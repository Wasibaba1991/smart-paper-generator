import React, { useRef, useState, useCallback } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  X,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  BookOpen,
  Clock,
  Hash,
  GraduationCap,
  Printer,
  FileDown,
  Download,
  ZoomIn,
  ScanText,
  ChevronRight,
  Layers,
} from 'lucide-react';
import type { ExamPaper, Subject, GradeLevel, Language, ExamTerm } from '../../types/exam';
import { recognizeImage } from '../../utils/ocrService';
import { parseRawOcrTextToExamPaper } from '../../utils/ocrParser';
import { AcademyLetterhead } from '../AcademyLetterhead';
import { QuestionItem } from '../studio/QuestionItem';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface UploadedImage {
  id: string;
  file: File;
  dataUrl: string;
  name: string;
  sizeKB: number;
  status: 'pending' | 'processing' | 'done' | 'error';
  ocrText?: string;
  ocrConfidence?: number;
  progress?: number;
  errorMsg?: string;
}

interface HandwrittenConverterProps {
  onPrint: () => void;
  onExportDocx: () => void;
  onExportPdf: () => void;
  onPaperReady: (paper: ExamPaper) => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MAX_IMAGES = 3;
const MIN_IMAGES = 2;

const SUBJECT_OPTIONS: Subject[] = [
  'Islamic Studies (اسلامیات)',
  'Urdu Literature & Grammar (اردو)',
  'English Language & Lit',
  'Mathematics (ریاضی)',
  'Arabic Language (اللغة العربية)',
  'General Science (سائنس)',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Pakistan Studies (مطالعہ پاکستان)',
];

const GRADE_OPTIONS: GradeLevel[] = [
  'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5',
  'Grade 6', 'Grade 7', 'Grade 8',
  'Grade 9 (Matric / O-Level)',
  'Grade 10 (Matric / O-Level)',
  'Grade 11 (HSSC-I)',
  'Grade 12 (HSSC-II)',
];

function getAutoLanguage(subject: Subject): Language {
  if (subject.includes('Islamic') || subject.includes('اسلامیات') || subject.includes('Urdu') || subject.includes('اردو')) return 'ur';
  if (subject.includes('Arabic') || subject.includes('العربية')) return 'ar';
  if (subject.includes('Math') || subject.includes('ریاضی')) return 'math';
  return 'en';
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export const HandwrittenConverter: React.FC<HandwrittenConverterProps> = ({
  onPrint,
  onExportDocx,
  onExportPdf,
  onPaperReady,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [generatedPaper, setGeneratedPaper] = useState<ExamPaper | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  // Metadata
  const [subject, setSubject] = useState<Subject>('Islamic Studies (اسلامیات)');
  const [grade, setGrade] = useState<GradeLevel>('Grade 9 (Matric / O-Level)');
  const [examTerm, setExamTerm] = useState<string>('Mid-Term Examination 2026');
  const [totalMarks, setTotalMarks] = useState<number>(50);
  const [timeAllowed, setTimeAllowed] = useState<string>('2 Hours');

  // ── Helpers ──────────────────────────────────────────────────────────────

  const addFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files);
    setGlobalError(null);
    setGeneratedPaper(null);

    const validFiles = arr.filter((f) => f.type.startsWith('image/')).slice(0, MAX_IMAGES - images.length);

    if (validFiles.length === 0) return;

    const newImgs: UploadedImage[] = validFiles.map((file) => ({
      id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      file,
      dataUrl: '',
      name: file.name,
      sizeKB: Math.round(file.size / 1024),
      status: 'pending',
    }));

    // Read each file as data URL
    newImgs.forEach((img) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        setImages((prev) =>
          prev.map((i) => (i.id === img.id ? { ...i, dataUrl: url } : i))
        );
      };
      reader.readAsDataURL(img.file);
    });

    setImages((prev) => {
      const combined = [...prev, ...newImgs];
      return combined.slice(0, MAX_IMAGES);
    });
  }, [images.length]);

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((i) => i.id !== id));
    setGlobalError(null);
    if (images.length <= 1) setGeneratedPaper(null);
  };

  const resetAll = () => {
    setImages([]);
    setGeneratedPaper(null);
    setGlobalError(null);
    setIsRunning(false);
  };

  // ── Drag & Drop ──────────────────────────────────────────────────────────

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
    }
    e.target.value = '';
  };

  // ── Core OCR Pipeline ────────────────────────────────────────────────────

  const handleGeneratePaper = async () => {
    if (images.length < MIN_IMAGES) {
      setGlobalError(`Please upload at least ${MIN_IMAGES} handwritten paper images before generating.`);
      return;
    }
    if (images.some((i) => !i.dataUrl)) {
      setGlobalError('Some images are still loading. Please wait a moment then try again.');
      return;
    }

    setIsRunning(true);
    setGlobalError(null);
    setGeneratedPaper(null);

    const lang: Language = getAutoLanguage(subject);
    let allExtractedTexts: string[] = [];
    let anySuccess = false;

    // Process each image sequentially
    for (let idx = 0; idx < images.length; idx++) {
      const img = images[idx];
      setImages((prev) =>
        prev.map((i) => i.id === img.id ? { ...i, status: 'processing', progress: 0 } : i)
      );

      try {
        const result = await recognizeImage(
          img.dataUrl,
          lang,
          (percent) => {
            setImages((prev) =>
              prev.map((i) => i.id === img.id ? { ...i, progress: percent } : i)
            );
          }
        );

        if (result.success && result.text.length > 20 && result.confidence > 20) {
          anySuccess = true;
          allExtractedTexts.push(`--- Image ${idx + 1}: ${img.name} ---\n${result.text}`);
          setImages((prev) =>
            prev.map((i) =>
              i.id === img.id
                ? { ...i, status: 'done', ocrText: result.text, ocrConfidence: result.confidence, progress: 100 }
                : i
            )
          );
        } else {
          // OCR returned low-confidence text — record as partial
          const partialText = result.text.trim();
          if (partialText.length > 10) {
            allExtractedTexts.push(`--- Image ${idx + 1}: ${img.name} (low confidence) ---\n${partialText}`);
          }
          setImages((prev) =>
            prev.map((i) =>
              i.id === img.id
                ? {
                    ...i,
                    status: result.confidence < 10 ? 'error' : 'done',
                    ocrConfidence: result.confidence,
                    progress: 100,
                    errorMsg:
                      result.confidence < 10
                        ? 'Image too blurry or low contrast. Please re-upload a clearer photo.'
                        : `Low confidence (${result.confidence.toFixed(0)}%). Consider using a clearer image.`,
                  }
                : i
            )
          );
        }
      } catch (err) {
        console.error(`OCR failed for image ${img.name}:`, err);
        setImages((prev) =>
          prev.map((i) =>
            i.id === img.id
              ? { ...i, status: 'error', errorMsg: 'OCR processing failed. Please try a clearer image.', progress: 0 }
              : i
          )
        );
      }
    }

    // If ALL images failed OCR
    if (!anySuccess && allExtractedTexts.length === 0) {
      setGlobalError(
        'Could not extract any readable text from the uploaded images. Please ensure the images are:\n' +
        '• In focus and well-lit\n' +
        '• Not too small or too dark\n' +
        '• Contain clearly written handwritten or printed text'
      );
      setIsRunning(false);
      return;
    }

    // Merge all extracted texts
    const mergedText = allExtractedTexts.join('\n\n');

    // Parse into ExamPaper
    const paper = parseRawOcrTextToExamPaper(mergedText, {
      customSubject: subject,
      customGrade: grade,
      customLanguage: lang,
      customExamTerm: examTerm as ExamTerm,
      customTotalMarks: totalMarks,
      customTime: timeAllowed,
    });

    if (paper.sections.length === 0 || paper.sections.every((s) => s.questions.length === 0)) {
      setGlobalError(
        'The OCR extracted some text but could not identify any structured questions. ' +
        'Please upload clearer images that contain legible question text.'
      );
      setIsRunning(false);
      return;
    }

    setGeneratedPaper(paper);
    onPaperReady(paper);
    setIsRunning(false);
  };

  // ── Derived State ────────────────────────────────────────────────────────

  const canGenerate = images.length >= MIN_IMAGES && !isRunning && images.every((i) => !!i.dataUrl);
  const hasResult = !!generatedPaper;
  const totalQCount = generatedPaper
    ? generatedPaper.sections.reduce((sum, s) => sum + s.questions.length, 0)
    : 0;
  const _lang = generatedPaper?.language ?? getAutoLanguage(subject);
  const isUrduOrArabic = _lang === 'ur' || _lang === 'ar';

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ─── Mode Banner ─────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-[#0F284E] via-[#1a3261] to-[#0d5c45] rounded-2xl p-6 sm:p-8 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-400 text-slate-900 uppercase tracking-wider">
                Handwritten Converter
              </span>
              <span className="text-xs text-slate-200 font-semibold">
                The Achievers Islamic Academy
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-3">
              <ScanText className="w-7 h-7 text-amber-300 flex-shrink-0" />
              Handwritten to Digital Paper Converter
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 mt-2 max-w-2xl leading-relaxed">
              Upload <strong className="text-amber-300">2–3 handwritten paper images</strong> or snapshots.
              The system uses OCR to extract real question content and formats it into an
              official Academy exam paper — no dummy data, no placeholders.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-xs text-slate-200 bg-white/10 rounded-xl p-4 border border-white/20 min-w-[180px]">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-900 font-black text-xs flex items-center justify-center flex-shrink-0">1</span>
              <span>Upload 2–3 images</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-400 text-slate-900 font-black text-xs flex items-center justify-center flex-shrink-0">2</span>
              <span>Set paper metadata</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-sky-400 text-slate-900 font-black text-xs flex items-center justify-center flex-shrink-0">3</span>
              <span>Generate & export</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main Layout ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ── Left: Upload Zone + Metadata ──────────────────────────── */}
        <div className="lg:col-span-5 space-y-4">

          {/* Upload Zone */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-[#0F284E] to-[#1a3261] text-white px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-emerald-300" />
                <span className="font-bold text-sm">Upload Handwritten Images</span>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                images.length >= MAX_IMAGES
                  ? 'bg-amber-400 text-slate-900'
                  : 'bg-white/20 text-white'
              }`}>
                {images.length} / {MAX_IMAGES}
              </span>
            </div>
            <div className="p-4 space-y-4">
              {/* Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => images.length < MAX_IMAGES && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[130px] ${
                  isDragging
                    ? 'border-emerald-500 bg-emerald-50 scale-[1.01]'
                    : images.length >= MAX_IMAGES
                    ? 'border-slate-200 bg-slate-50 cursor-not-allowed opacity-60'
                    : 'border-slate-300 hover:border-emerald-500 bg-slate-50/50 hover:bg-emerald-50/20'
                }`}
              >
                <UploadCloud className={`w-10 h-10 mb-2 ${isDragging ? 'text-emerald-600' : 'text-emerald-500'}`} />
                {images.length >= MAX_IMAGES ? (
                  <p className="text-xs font-semibold text-slate-500">
                    Maximum {MAX_IMAGES} images reached. Remove one to add another.
                  </p>
                ) : (
                  <>
                    <p className="text-sm font-bold text-slate-800">
                      {isDragging ? 'Drop images here!' : 'Click to upload or drag & drop'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Upload {MIN_IMAGES}–{MAX_IMAGES} handwritten paper snapshots (PNG, JPG, JPEG)
                    </p>
                    <p className="text-[11px] text-emerald-700 font-semibold mt-1.5 bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-200">
                      Supports English, Urdu, Arabic &amp; Math handwriting
                    </p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>

              {/* Uploaded Thumbnails */}
              {images.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                    Uploaded Images ({images.length})
                  </p>
                  <div className="space-y-2">
                    {images.map((img, idx) => (
                      <ImageThumbnailCard
                        key={img.id}
                        img={img}
                        index={idx}
                        onRemove={() => removeImage(img.id)}
                        onPreview={() => img.dataUrl && setPreviewImageUrl(img.dataUrl)}
                        isRunning={isRunning}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State Guidance */}
              {images.length === 0 && (
                <div className="text-center text-slate-400 py-2">
                  <div className="flex items-center justify-center gap-3 text-xs text-slate-500 bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <ImageIcon className="w-4 h-4 flex-shrink-0" />
                    <span>Upload 2–3 pages of a handwritten exam paper. Each image = one page or section of the paper.</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Metadata Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-3">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Paper Metadata</span>
                <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full ml-auto font-bold border border-amber-200">
                  Required
                </span>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {/* Subject */}
              <div>
                <label className="text-[11px] text-slate-500 font-semibold flex items-center gap-1 mb-1">
                  <BookOpen className="w-3 h-3" /> Subject / مضمون
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value as Subject)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {SUBJECT_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Grade */}
              <div>
                <label className="text-[11px] text-slate-500 font-semibold flex items-center gap-1 mb-1">
                  <GraduationCap className="w-3 h-3" /> Class / Grade
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value as GradeLevel)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {GRADE_OPTIONS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              {/* Exam Term */}
              <div>
                <label className="text-[11px] text-slate-500 font-semibold flex items-center gap-1 mb-1">
                  <FileText className="w-3 h-3" /> Exam Term / امتحانی دور
                </label>
                <select
                  value={examTerm}
                  onChange={(e) => setExamTerm(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="First Term Assessment 2026">First Term 2026</option>
                  <option value="Mid-Term Examination 2026">Mid-Term 2026</option>
                  <option value="Final Term Examination 2026">Final Term 2026</option>
                  <option value="Monthly Class Test">Monthly Class Test</option>
                  <option value="Send-Up / Pre-Board Examination">Pre-Board / Send-Up</option>
                </select>
              </div>

              {/* Marks & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-500 font-semibold flex items-center gap-1 mb-1">
                    <Hash className="w-3 h-3" /> Total Marks
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={200}
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(parseInt(e.target.value) || 50)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 font-semibold flex items-center gap-1 mb-1">
                    <Clock className="w-3 h-3" /> Time Allowed
                  </label>
                  <select
                    value={timeAllowed}
                    onChange={(e) => setTimeAllowed(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="45 Minutes">45 Min</option>
                    <option value="1 Hour">1 Hour</option>
                    <option value="1 Hour 30 Minutes">1.5 Hours</option>
                    <option value="2 Hours">2 Hours</option>
                    <option value="2 Hours 30 Minutes">2.5 Hours</option>
                    <option value="3 Hours">3 Hours</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGeneratePaper}
            disabled={!canGenerate}
            className={`w-full py-4 px-6 rounded-xl font-black text-sm flex items-center justify-center gap-3 transition-all shadow-md ${
              canGenerate
                ? 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white hover:shadow-lg hover:scale-[1.01]'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Processing Images with OCR...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>
                  {images.length < MIN_IMAGES
                    ? `Upload at least ${MIN_IMAGES} images to begin`
                    : 'Generate Paper from Images'}
                </span>
                {canGenerate && <ChevronRight className="w-5 h-5" />}
              </>
            )}
          </button>

          {/* Requirements Note */}
          {images.length > 0 && images.length < MIN_IMAGES && (
            <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600" />
              <span>
                Please upload at least <strong>{MIN_IMAGES} images</strong> (you have {images.length}). Each image should be a different page or section of the handwritten paper.
              </span>
            </div>
          )}

          {/* Global Error */}
          {globalError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-red-800 mb-1">Could Not Generate Paper</p>
                  <p className="text-xs text-red-700 whitespace-pre-line">{globalError}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Paper Preview Panel ─────────────────────────────── */}
        <div className="lg:col-span-7">
          {hasResult && generatedPaper ? (
            <div className="space-y-4">
              {/* Success Banner */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-emerald-900 text-sm">Paper Successfully Digitized!</p>
                    <p className="text-xs text-emerald-700">
                      {totalQCount} question{totalQCount !== 1 ? 's' : ''} extracted across {generatedPaper.sections.length} section{generatedPaper.sections.length !== 1 ? 's' : ''} — ready to export
                    </p>
                  </div>
                </div>
                <button
                  onClick={resetAll}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-red-600 border border-slate-200 hover:border-red-300 rounded-lg px-2.5 py-1.5 transition-all"
                >
                  <X className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Export Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-600" />
                  Export & Print Options
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={onPrint}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                  >
                    <Printer className="w-4 h-4 text-emerald-400" />
                    <span>Print (A4)</span>
                  </button>
                  <button
                    onClick={onExportDocx}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                  >
                    <FileDown className="w-4 h-4" />
                    <span>Export Word (.docx)</span>
                  </button>
                  <button
                    onClick={onExportPdf}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>

              {/* Live Paper Preview */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#0F284E]" />
                    <span className="font-bold text-sm text-slate-800">Live Paper Preview</span>
                  </div>
                  <span className="text-[11px] text-slate-500 bg-white border border-slate-200 rounded px-2 py-0.5">
                    A4 Format
                  </span>
                </div>

                {/* Printable Paper */}
                <div className="p-4 bg-slate-100/60">
                  <div
                    id="achievers-printable-paper"
                    className="bg-white shadow-sm mx-auto p-8 border border-slate-200"
                    style={{
                      width: '210mm',
                      minHeight: '297mm',
                      maxWidth: '100%',
                      boxSizing: 'border-box',
                    }}
                  >
                    {/* Academy Letterhead */}
                    <AcademyLetterhead paper={generatedPaper} isUrduOrArabic={isUrduOrArabic} />

                    {/* General Instructions */}
                    {generatedPaper.instructions && generatedPaper.instructions.length > 0 && (
                      <div className="mb-3 border border-slate-300 rounded bg-slate-50/80 p-2">
                        <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                          General Instructions:
                        </p>
                        <ol className="list-decimal list-inside text-xs text-slate-700 space-y-0.5">
                          {generatedPaper.instructions.map((ins, i) => (
                            <li key={i}>{ins}</li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {/* Sections & Questions */}
                    {generatedPaper.sections.map((section) => (
                      <div key={section.id} className="mb-5">
                        {/* Section Header */}
                        <div className="bg-[#0F284E] text-white px-3 py-1.5 rounded-t-sm mb-2 flex items-center justify-between">
                          <span className="font-bold text-sm">{section.sectionTitle}</span>
                          <span className="text-xs font-semibold text-emerald-300">
                            Marks: {section.totalMarks}
                          </span>
                        </div>
                        {section.instructions && (
                          <p className="text-[11px] text-slate-600 italic mb-2 px-1">
                            {section.instructions}
                          </p>
                        )}
                        <div className="space-y-2">
                          {section.questions.map((question, qIdx) => (
                            <QuestionItem
                              key={question.id}
                              question={question}
                              paperLanguage={generatedPaper.language}
                              fontSize="standard"
                              index={qIdx}
                              onEdit={() => {}}
                              onDelete={() => {}}
                              onDuplicate={() => {}}
                            />
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* Paper Footer */}
                    <div className="mt-6 pt-3 border-t border-slate-300 text-center text-[11px] text-slate-500">
                      <p className="font-semibold">{generatedPaper.academyName} • {generatedPaper.examTerm}</p>
                      <p>{generatedPaper.subject} — {generatedPaper.gradeLevel}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full min-h-[500px] flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0F284E] to-[#1a3261] border-2 border-amber-400/60 flex items-center justify-center mb-5 shadow-md">
                <ScanText className="w-10 h-10 text-amber-300" />
              </div>
              <h3 className="text-lg font-black text-slate-800 mb-2">
                Paper Preview
              </h3>
              <p className="text-sm text-slate-500 max-w-sm">
                Upload {MIN_IMAGES}–{MAX_IMAGES} handwritten exam paper images on the left, fill in the metadata, then click{' '}
                <span className="font-bold text-emerald-700">"Generate Paper from Images"</span>{' '}
                to digitize and format them here.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-3 w-full max-w-sm">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center gap-2 text-slate-300"
                  >
                    <ImageIcon className="w-6 h-6" />
                    <span className="text-xs font-semibold">Image {n}</span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-4">
                The digitized paper will appear here with the official Academy letterhead,<br />
                question sections, and one-click export buttons.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ─── Image Preview Modal ─────────────────────────────────────── */}
      {previewImageUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreviewImageUrl(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewImageUrl(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 bg-black/60 hover:bg-black text-white rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={previewImageUrl}
              alt="Full preview"
              className="max-w-full max-h-[85vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Sub-component: Image Thumbnail Card
// ---------------------------------------------------------------------------

interface ImageThumbnailCardProps {
  img: UploadedImage;
  index: number;
  onRemove: () => void;
  onPreview: () => void;
  isRunning: boolean;
}

const ImageThumbnailCard: React.FC<ImageThumbnailCardProps> = ({
  img,
  index,
  onRemove,
  onPreview,
  isRunning,
}) => {
  const statusColor = {
    pending: 'bg-slate-100 border-slate-200',
    processing: 'bg-amber-50 border-amber-300',
    done: 'bg-emerald-50 border-emerald-300',
    error: 'bg-red-50 border-red-300',
  }[img.status];

  const statusIcon = {
    pending: <span className="w-4 h-4 rounded-full bg-slate-300 flex-shrink-0" />,
    processing: <RefreshCw className="w-4 h-4 text-amber-600 animate-spin flex-shrink-0" />,
    done: <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />,
  }[img.status];

  return (
    <div className={`rounded-xl border p-3 transition-all ${statusColor}`}>
      <div className="flex items-center gap-3">
        {/* Thumbnail */}
        <div
          className="w-14 h-14 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0 bg-slate-100 cursor-pointer relative group"
          onClick={onPreview}
        >
          {img.dataUrl ? (
            <>
              <img
                src={img.dataUrl}
                alt={img.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                <ZoomIn className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-slate-400" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[10px] font-black text-slate-500 bg-slate-100 rounded px-1.5 py-0.5 border border-slate-200">
              #{index + 1}
            </span>
            <span className="text-xs font-semibold text-slate-800 truncate">{img.name}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {statusIcon}
            <span className="text-[11px] text-slate-600">
              {img.status === 'pending' && `${img.sizeKB} KB — Ready`}
              {img.status === 'processing' && `OCR: ${img.progress ?? 0}%`}
              {img.status === 'done' && (
                <span className="text-emerald-700">
                  Done {img.ocrConfidence ? `(${img.ocrConfidence.toFixed(0)}% conf.)` : ''}
                </span>
              )}
              {img.status === 'error' && (
                <span className="text-red-700 text-[10px]">{img.errorMsg || 'OCR Failed'}</span>
              )}
            </span>
          </div>

          {/* Progress bar */}
          {img.status === 'processing' && (
            <div className="mt-1.5 w-full bg-amber-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-amber-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${img.progress ?? 0}%` }}
              />
            </div>
          )}
        </div>

        {/* Remove Button */}
        {!isRunning && (
          <button
            onClick={onRemove}
            title="Remove this image"
            className="w-7 h-7 rounded-lg bg-white border border-slate-200 hover:bg-red-50 hover:border-red-300 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <X className="w-3.5 h-3.5 text-slate-400 hover:text-red-600" />
          </button>
        )}
      </div>
    </div>
  );
};
