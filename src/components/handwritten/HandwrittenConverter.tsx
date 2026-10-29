import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  UploadCloud,
  X,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Hash,
  GraduationCap,
  Printer,
  FileDown,
  ZoomIn,
  BookOpen,
  AlertTriangle,
  FileText,
  ChevronDown,
  Image as ImageIcon,
  Key,
  Eye,
  EyeOff,
  Cpu,
  ScanLine,
  Zap,
  Info,
} from 'lucide-react';
import type { ExamPaper, Subject, GradeLevel, Language } from '../../types/exam';
import { recognizeImage } from '../../utils/ocrService';
import { recognizeWithGemini, validateGeminiKey, extractStructuredExamData } from '../../utils/geminiOcrService';
import type { GeminiSection } from '../../utils/geminiOcrService';
import { parseRawOcrTextToExamPaper } from '../../utils/ocrParser';
import { AcademyLetterhead } from '../AcademyLetterhead';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface UploadedImage {
  id: string;
  file: File;
  dataUrl: string;
  name: string;
  sizeKB: number;
  label: string; // e.g. "Front Page", "Back Page", "Page 3", "Page 4"
  status: 'pending' | 'processing' | 'done' | 'error';
  ocrText?: string;
  ocrEngine?: 'gemini' | 'tesseract';
  progress?: number;
  errorMsg?: string;
}

interface HandwrittenConverterProps {
  onPrint: () => void;
  onExportDocx: () => void;
  onExportPdf: () => void;
  onPaperReady: (paper: ExamPaper) => void;
  currentPaper: ExamPaper;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MAX_IMAGES = 4;
const SESSION_KEY = 'aia_gemini_api_key';

const PAGE_LABELS = ['Front Page', 'Back Page', 'Page 3', 'Page 4'];

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
// Sub-component: Gemini API Key Panel
// ---------------------------------------------------------------------------

const GeminiKeyPanel: React.FC<{
  apiKey: string;
  keyStatus: 'idle' | 'validating' | 'valid' | 'invalid';
  onKeyChange: (k: string) => void;
  onValidate: () => void;
}> = ({ apiKey, keyStatus, onKeyChange, onValidate }) => {
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Panel Header */}
      <div className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-sm text-white">AI-Powered OCR</span>
          <span className="text-[10px] text-slate-500 ml-1">· Google Gemini Vision — Best for handwriting</span>
        </div>
        {keyStatus === 'valid' && (
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-900/30 border border-emerald-800 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3 h-3" /> Gemini Active
          </span>
        )}
        {keyStatus === 'idle' && (
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 bg-slate-800/60 border border-slate-700 px-2.5 py-1 rounded-full">
            <Cpu className="w-3 h-3" /> Tesseract fallback
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Key input */}
          <div className="relative flex-1">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
              <Key className="w-4 h-4" />
            </div>
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => onKeyChange(e.target.value)}
              placeholder="Enter your Google AI (Gemini) API key — AIzaSy..."
              className="w-full bg-slate-800/80 border border-slate-700 hover:border-slate-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-slate-200 text-sm rounded-xl pl-10 pr-10 py-2.5 outline-none transition-all placeholder:text-slate-600 font-mono"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Validate button */}
          <button
            onClick={onValidate}
            disabled={!apiKey.trim() || keyStatus === 'validating'}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all active:scale-95 whitespace-nowrap"
          >
            {keyStatus === 'validating' ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Verifying…
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Verify & Enable
              </>
            )}
          </button>
        </div>

        {/* Status messages */}
        {keyStatus === 'valid' && (
          <p className="mt-2 text-xs text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Gemini Vision enabled — uploads will use AI for superior handwriting extraction.
          </p>
        )}
        {keyStatus === 'invalid' && (
          <p className="mt-2 text-xs text-red-400 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            Key invalid. Check it at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-300">aistudio.google.com</a> — falling back to Tesseract.
          </p>
        )}
        {keyStatus === 'idle' && !apiKey && (
          <p className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            No key? Get a free one at{' '}
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline hover:text-amber-300">
              aistudio.google.com
            </a>
            . Without a key, Tesseract OCR runs locally.
          </p>
        )}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Sub-component: Image Thumbnail Card
// ---------------------------------------------------------------------------

const ImageCard: React.FC<{
  img: UploadedImage;
  onRemove: (id: string) => void;
  onPreview: (url: string) => void;
}> = ({ img, onRemove, onPreview }) => {
  const statusColors = {
    pending: 'border-slate-600 bg-slate-800/60',
    processing: 'border-blue-500 bg-blue-950/40',
    done: 'border-emerald-500 bg-emerald-950/30',
    error: 'border-red-500 bg-red-950/30',
  };

  return (
    <div className={`relative group rounded-xl border-2 overflow-hidden transition-all duration-300 ${statusColors[img.status]}`}>
      {/* Label badge */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-slate-900/90 to-transparent px-2 py-1.5 flex items-center justify-between">
        <span className="text-[10px] font-black text-white uppercase tracking-wider bg-slate-800/80 px-1.5 py-0.5 rounded">
          {img.label}
        </span>
        {img.ocrEngine && img.status === 'done' && (
          <span className={`text-[9px] font-black px-1 py-0.5 rounded ${img.ocrEngine === 'gemini' ? 'bg-amber-500 text-slate-900' : 'bg-slate-600 text-slate-200'}`}>
            {img.ocrEngine === 'gemini' ? '✦ AI' : 'OCR'}
          </span>
        )}
      </div>

      {/* Thumbnail */}
      <div className="relative aspect-[3/4] bg-slate-900 overflow-hidden">
        {img.dataUrl ? (
          <img
            src={img.dataUrl}
            alt={img.label}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-slate-600" />
          </div>
        )}

        {/* Processing overlay */}
        {img.status === 'processing' && (
          <div className="absolute inset-0 bg-slate-900/75 flex flex-col items-center justify-center gap-2">
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1e293b" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15.9" fill="none"
                  stroke="#3b82f6" strokeWidth="3"
                  strokeDasharray={`${(img.progress ?? 0)} 100`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-blue-300">
                {img.progress ?? 0}%
              </span>
            </div>
            <span className="text-[10px] text-blue-300 font-semibold">Extracting…</span>
          </div>
        )}

        {/* Done overlay */}
        {img.status === 'done' && (
          <div className="absolute bottom-0 left-0 right-0 bg-emerald-900/80 px-2 py-1 text-center">
            <span className="text-[9px] text-emerald-300 font-bold">Text extracted ✓</span>
          </div>
        )}

        {/* Error overlay */}
        {img.status === 'error' && (
          <div className="absolute bottom-0 left-0 right-0 bg-red-900/80 px-2 py-1 text-center">
            <span className="text-[9px] text-red-300 font-bold">Extraction failed</span>
          </div>
        )}

        {/* Hover: preview button */}
        {img.dataUrl && (
          <button
            onClick={() => onPreview(img.dataUrl)}
            className="absolute top-8 left-1 w-7 h-7 bg-slate-900/80 border border-slate-600 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:border-blue-400"
          >
            <ZoomIn className="w-3.5 h-3.5 text-slate-300" />
          </button>
        )}

        {/* Remove button */}
        <button
          onClick={() => onRemove(img.id)}
          className="absolute top-8 right-1 w-7 h-7 bg-red-900/80 border border-red-700 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
        >
          <X className="w-3.5 h-3.5 text-red-200" />
        </button>
      </div>

      {/* File name footer */}
      <div className="px-2 py-1.5">
        <p className="text-[10px] text-slate-400 font-semibold truncate">{img.name}</p>
        <p className="text-[9px] text-slate-600">{img.sizeKB} KB</p>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Sub-component: Preview Modal
// ---------------------------------------------------------------------------

const PreviewModal: React.FC<{ url: string; onClose: () => void }> = ({ url, onClose }) => (
  <div
    className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-4"
    onClick={onClose}
  >
    <div className="relative max-w-3xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
      <img src={url} alt="Preview" className="rounded-xl object-contain max-h-[85vh] shadow-2xl" />
      <button
        onClick={onClose}
        className="absolute top-2 right-2 w-8 h-8 bg-slate-900/90 border border-slate-700 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors"
      >
        <X className="w-4 h-4 text-slate-200" />
      </button>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Sub-component: Select Field
// ---------------------------------------------------------------------------

const SelectField: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}> = ({ icon, label, value, onChange, options }) => (
  <div className="flex flex-col gap-1.5">
    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
      {icon}
      {label}
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-slate-800/80 border border-slate-700 hover:border-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-200 text-sm rounded-xl px-3 py-2.5 pr-8 transition-all outline-none cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-slate-800">{opt}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export const HandwrittenConverter: React.FC<HandwrittenConverterProps> = ({
  onPrint,
  onExportDocx,
  onExportPdf,
  onPaperReady,
  currentPaper,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [generatedPaper, setGeneratedPaper] = useState<ExamPaper | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Gemini key state
  const [geminiKey, setGeminiKey] = useState<string>('');
  const [keyStatus, setKeyStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');

  // Metadata — all start empty; populated from Gemini's JSON extraction after image upload
  const [subject, setSubject] = useState<Subject>('' as Subject);
  const [grade, setGrade] = useState<GradeLevel>('' as GradeLevel);
  const [examTerm, setExamTerm] = useState<string>('');
  const [totalMarks, setTotalMarks] = useState<number>(0);
  const [timeAllowed, setTimeAllowed] = useState<string>('');

  // Load key from session storage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) {
      setGeminiKey(saved);
      setKeyStatus('valid'); // Assume saved key is valid until we try it
    }
  }, []);

  // ── Gemini Key Validation ────────────────────────────────────────────────

  const handleValidateKey = useCallback(async () => {
    setKeyStatus('validating');
    const { valid, message } = await validateGeminiKey(geminiKey);
    if (valid) {
      sessionStorage.setItem(SESSION_KEY, geminiKey.trim());
      setKeyStatus('valid');
    } else {
      sessionStorage.removeItem(SESSION_KEY);
      setKeyStatus('invalid');
      console.warn('Gemini key invalid:', message);
    }
  }, [geminiKey]);

  const handleKeyChange = (k: string) => {
    setGeminiKey(k);
    if (keyStatus !== 'idle') setKeyStatus('idle');
    if (!k.trim()) {
      sessionStorage.removeItem(SESSION_KEY);
    }
  };

  // ── File Handling ─────────────────────────────────────────────────────────

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const arr = Array.from(files).filter((f) => f.type.startsWith('image/'));
      if (arr.length === 0) return;
      setGlobalError(null);
      setGeneratedPaper(null);

      const slots = MAX_IMAGES - images.length;
      const valid = arr.slice(0, slots);

      const newImgs: UploadedImage[] = valid.map((file, idx) => ({
        id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        file,
        dataUrl: '',
        name: file.name,
        sizeKB: Math.round(file.size / 1024),
        label: PAGE_LABELS[images.length + idx] || `Page ${images.length + idx + 1}`,
        status: 'pending',
      }));

      newImgs.forEach((img) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const url = e.target?.result as string;
          setImages((prev) => prev.map((i) => (i.id === img.id ? { ...i, dataUrl: url } : i)));
        };
        reader.readAsDataURL(img.file);
      });

      setImages((prev) => [...prev, ...newImgs].slice(0, MAX_IMAGES));
    },
    [images.length]
  );

  const removeImage = (id: string) => {
    setImages((prev) => {
      const filtered = prev.filter((i) => i.id !== id);
      // Re-assign labels
      return filtered.map((img, idx) => ({ ...img, label: PAGE_LABELS[idx] || `Page ${idx + 1}` }));
    });
    setGlobalError(null);
  };

  const resetAll = () => {
    setImages([]);
    setGeneratedPaper(null);
    setGlobalError(null);
    setIsRunning(false);
  };

  // ── Drag & Drop ───────────────────────────────────────────────────────────

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files);
  };
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) addFiles(e.target.files);
    e.target.value = '';
  };

  // ── OCR Pipeline ──────────────────────────────────────────────────────────

  const handleConvert = async () => {
    if (images.length < 1) {
      setGlobalError('Please upload at least one handwritten paper image first (Front Page minimum).');
      return;
    }
    if (images.some((i) => !i.dataUrl)) {
      setGlobalError('Some images are still loading — please wait a moment and try again.');
      return;
    }

    setIsRunning(true);
    setGlobalError(null);
    setGeneratedPaper(null);

    const useGemini = keyStatus === 'valid' && geminiKey.trim().length > 10;

    // ══════════════════════════════════════════════════════════════════════════
    // GEMINI PATH: Structured JSON extraction — single call returns metadata
    // + all questions directly from the image. Zero fallback to dummy values.
    // ══════════════════════════════════════════════════════════════════════════
    if (useGemini) {
      // Mark first image as processing
      setImages((prev) =>
        prev.map((i, idx) => idx === 0 ? { ...i, status: 'processing', progress: 0 } : i)
      );

      // ── Structured extraction from first (front) page ──────────────────
      const frontImg = images[0];
      const structuredResult = await extractStructuredExamData(
        frontImg.dataUrl,
        geminiKey,
        (pct) => {
          setImages((prev) =>
            prev.map((i) => i.id === frontImg.id ? { ...i, progress: pct } : i)
          );
        }
      );

      if (structuredResult.success || structuredResult.sections.length > 0) {
        // Mark front page as done
        const qCount = structuredResult.sections.reduce((n, s) => n + s.questions.length, 0);
        setImages((prev) =>
          prev.map((i) =>
            i.id === frontImg.id
              ? { ...i, status: 'done', ocrEngine: 'gemini', progress: 100,
                  ocrText: `[Structured Gemini extraction — ${qCount} questions]` }
              : i
          )
        );

        // ── Process remaining pages (plain text OCR for multi-page merge) ─
        for (let idx = 1; idx < images.length; idx++) {
          const img = images[idx];
          setImages((prev) =>
            prev.map((i) => i.id === img.id ? { ...i, status: 'processing', progress: 0 } : i)
          );
          try {
            const r = await recognizeWithGemini(img.dataUrl, geminiKey, (pct) => {
              setImages((prev) => prev.map((i) => i.id === img.id ? { ...i, progress: pct } : i));
            });
            setImages((prev) =>
              prev.map((i) =>
                i.id === img.id
                  ? r.success
                    ? { ...i, status: 'done', ocrEngine: 'gemini', ocrText: r.text, progress: 100 }
                    : { ...i, status: 'error', progress: 0 }
                  : i
              )
            );
          } catch {
            setImages((prev) =>
              prev.map((i) => i.id === img.id ? { ...i, status: 'error', progress: 0 } : i)
            );
          }
        }

        // ── Build ExamPaper from structured JSON — NO dummy defaults ───────
        const extractedSubject  = structuredResult.subject   || '';
        const extractedGrade    = structuredResult.grade     || '';
        const extractedTerm     = structuredResult.examTerm  || '';
        const extractedMarks    = structuredResult.totalMarks ?? 0;
        const extractedTime     = structuredResult.timeAllowed || '';
        const extractedLang     = structuredResult.language  || 'en';

        // Populate metadata form so teacher can review / correct
        setSubject(extractedSubject as Subject);
        setGrade(extractedGrade as GradeLevel);
        setExamTerm(extractedTerm);
        setTotalMarks(extractedMarks);
        setTimeAllowed(extractedTime);

        // Convert GeminiSection[] → ExamSection[]
        const nowMs = Date.now();
        const sections = structuredResult.sections.map((sec: GeminiSection, sIdx: number) => ({
          id: `sec-gemini-${nowMs}-${sIdx}`,
          sectionTitle: sec.title,
          instructions: sec.instructions,
          totalMarks: sec.questions.reduce((s, q) => s + (q.marks ?? 1), 0),
          questions: sec.questions.map((q, qIdx) => ({
            id: `q-gemini-${nowMs}-${sIdx}-${qIdx}`,
            type: q.type,
            questionNumber: qIdx + 1,
            text: q.text,
            marks: q.marks ?? 1,
            language: extractedLang as Language,
            options: q.options?.map((o, oIdx) => ({
              id: `opt-gemini-${nowMs}-${sIdx}-${qIdx}-${oIdx}`,
              label: o.label,
              text: o.text,
            })),
          })),
        }));

        const computedTotal = sections.reduce((s, sec) => s + sec.totalMarks, 0);

        const finalPaper: ExamPaper = {
          id: `gemini-paper-${nowMs}`,
          academyName: 'The Achievers Islamic Academy',
          campusName: 'Main Academic Campus',
          // Only what Gemini extracted from the image — empty string if not found
          subject: extractedSubject as Subject,
          gradeLevel: extractedGrade as GradeLevel,
          examTerm: extractedTerm as any,
          language: extractedLang as Language,
          timeAllowed: extractedTime,
          totalMarks: extractedMarks > 0 ? extractedMarks : (computedTotal > 0 ? computedTotal : 0),
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
          instructions: [
            'Write your Roll Number on the top of question paper immediately.',
            'Check that the paper contains all the questions and sections mentioned.',
            'Overwriting or cutting in Objective section will not be awarded any marks.',
          ],
          showBismillah: true,
          showWatermark: true,
          showStudentTable: true,
          boardFormat: 'standard',
          showBubbleSheet: false,
          layoutColumns: 1,
          fontSize: 'standard',
          paperSize: 'a4',
          sections,
          createdVia: 'ocr_extract',
          createdAt: new Date().toISOString(),
        };

        setGeneratedPaper(finalPaper);
        onPaperReady(finalPaper);
        setIsRunning(false);
        return; // Done — skip Tesseract path
      }

      // Structured extraction returned nothing — fall through to Tesseract
      setImages((prev) =>
        prev.map((i) => i.id === frontImg.id ? { ...i, status: 'error', progress: 0 } : i)
      );
    }

    // ══════════════════════════════════════════════════════════════════════════
    // TESSERACT FALLBACK PATH (no Gemini key, or structured extraction failed)
    // ══════════════════════════════════════════════════════════════════════════
    const lang: Language = getAutoLanguage(subject as Subject);
    const allTexts: string[] = [];
    let anySuccess = false;

    for (let idx = 0; idx < images.length; idx++) {
      const img = images[idx];
      setImages((prev) =>
        prev.map((i) => (i.id === img.id ? { ...i, status: 'processing', progress: 0 } : i))
      );

      let extractedText = '';
      let engineUsed: 'gemini' | 'tesseract' = 'tesseract';

      // Try Gemini plain OCR even without structured extraction (key exists but structured failed)
      if (useGemini) {
        try {
          const result = await recognizeWithGemini(img.dataUrl, geminiKey, (pct) => {
            setImages((prev) => prev.map((i) => (i.id === img.id ? { ...i, progress: pct } : i)));
          });
          if (result.success && result.text.length > 5) {
            extractedText = result.text;
            engineUsed = 'gemini';
            anySuccess = true;
          }
        } catch (e) {
          console.warn(`Gemini plain OCR failed for ${img.name}:`, e);
        }
      }

      // Tesseract fallback
      if (!extractedText) {
        try {
          setImages((prev) => prev.map((i) => (i.id === img.id ? { ...i, progress: 5 } : i)));
          const result = await recognizeImage(img.dataUrl, lang, (pct) => {
            setImages((prev) => prev.map((i) => (i.id === img.id ? { ...i, progress: pct } : i)));
          });
          if (result.success && result.text.length > 10) {
            extractedText = result.text;
            engineUsed = 'tesseract';
            anySuccess = true;
          } else if (result.text.trim().length > 5) {
            extractedText = result.text.trim();
            anySuccess = true;
          }
        } catch (err) {
          console.error(`Tesseract OCR failed for ${img.name}:`, err);
        }
      }

      if (extractedText) {
        allTexts.push(`--- ${img.label}: ${img.name} ---\n${extractedText}`);
        setImages((prev) =>
          prev.map((i) =>
            i.id === img.id
              ? { ...i, status: 'done', ocrText: extractedText, ocrEngine: engineUsed, progress: 100 }
              : i
          )
        );
      } else {
        setImages((prev) =>
          prev.map((i) =>
            i.id === img.id
              ? { ...i, status: 'error', progress: 0,
                  errorMsg: 'Could not extract text — ensure image is clear, well-lit, and in focus.' }
              : i
          )
        );
      }
    }

    if (!anySuccess && allTexts.length === 0) {
      setGlobalError(
        'Could not extract readable text from any uploaded image.\n\n' +
        'Tips:\n• Ensure images are sharp and well-lit\n' +
        '• Avoid shadows or glare on the paper\n' +
        '• Handwriting should be clear and distinct\n' +
        '• Enable Gemini AI (above) for best handwriting recognition'
      );
      setIsRunning(false);
      return;
    }

    // Build paper from Tesseract raw text — pass form values only if non-empty
    const merged = allTexts.join('\n\n');
    const paper = parseRawOcrTextToExamPaper(merged, {
      customSubject: subject || undefined,
      customGrade: grade || undefined,
      customLanguage: lang,
      customExamTerm: examTerm || (undefined as any),
      customTotalMarks: totalMarks || undefined,
      customTime: timeAllowed || undefined,
    });

    const finalPaper: ExamPaper = {
      ...paper,
      boardFormat: 'standard',
      showBubbleSheet: false,
      showBismillah: true,
      showStudentTable: true,
    };

    setGeneratedPaper(finalPaper);
    onPaperReady(finalPaper);
    setIsRunning(false);
  };

  // ── Derived ───────────────────────────────────────────────────────────────

  const hasResult = !!generatedPaper;
  const totalQCount = generatedPaper
    ? generatedPaper.sections.reduce((sum, s) => sum + s.questions.length, 0)
    : 0;
  const activeLang = generatedPaper?.language ?? getAutoLanguage(subject);
  const isUrduOrArabic = activeLang === 'ur' || activeLang === 'ar';
  const processingImg = images.find((i) => i.status === 'processing');
  const canConvert = images.length > 0 && !isRunning && images.every((i) => !!i.dataUrl);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Image preview lightbox */}
      {previewUrl && <PreviewModal url={previewUrl} onClose={() => setPreviewUrl(null)} />}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileInput}
      />

      {/* ════════════════════════════════════════════════════════════════════
          PAGE WRAPPER
         ════════════════════════════════════════════════════════════════════ */}
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0a1628] to-[#091420] relative overflow-hidden">

        {/* Decorative ambient blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-40 -left-40 w-[480px] h-[480px] bg-emerald-900/15 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -right-20 w-72 h-72 bg-blue-900/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#0F284E]/30 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 no-print">

          {/* ─────────────────────────────────────────────────────────────────
              HEADER
             ───────────────────────────────────────────────────────────────── */}
          <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Academy crest */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0F284E] to-[#1a3a60] border border-[#2a4a70] flex items-center justify-center shadow-lg flex-shrink-0">
                <BookOpen className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400/80">
                  The Achievers Islamic Academy
                </p>
                <h1 className="text-lg sm:text-xl font-black text-white leading-none tracking-tight">
                  Handwritten Paper Converter
                </h1>
              </div>
            </div>

            {/* Header export buttons — only when result is ready */}
            {hasResult && (
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={onExportDocx}
                  className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold rounded-xl shadow-lg transition-all"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  Word (.docx)
                </button>
                <button
                  onClick={onPrint}
                  className="flex items-center gap-1.5 px-3 py-2 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white text-xs font-bold rounded-xl shadow-lg transition-all"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print / PDF
                </button>
              </div>
            )}
          </header>

          {/* ─────────────────────────────────────────────────────────────────
              HERO BANNER
             ───────────────────────────────────────────────────────────────── */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#0F284E] via-[#143562] to-[#0d4a38] border border-white/10 shadow-2xl p-6 sm:p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            <div className="relative flex flex-col md:flex-row md:items-center gap-6 justify-between">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-400 text-slate-900 uppercase tracking-wider">
                    AI Vision OCR
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 uppercase tracking-wider">
                    Zero Dummy Data
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                  Upload → Extract → Export
                </h2>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                  Upload 1–4 snapshots of your handwritten exam paper (front &amp; back pages). Gemini AI or
                  Tesseract OCR extracts the exact text and structures it under the official Academy
                  letterhead — ready for <strong className="text-amber-300">Word</strong> or{' '}
                  <strong className="text-amber-300">PDF</strong> in one click.
                </p>
              </div>

              {/* Step indicators */}
              <div className="flex md:flex-col gap-3 text-xs text-slate-300 bg-white/5 rounded-xl p-4 border border-white/10 flex-shrink-0">
                {[
                  { n: '1', c: 'bg-amber-400 text-slate-900', t: 'Upload 1–4 paper images' },
                  { n: '2', c: 'bg-sky-400 text-slate-900', t: 'AI auto-extracts all metadata' },
                  { n: '3', c: 'bg-emerald-400 text-slate-900', t: 'Extract & generate paper' },
                  { n: '4', c: 'bg-rose-400 text-slate-900', t: 'Download Word or Print PDF' },
                ].map(({ n, c, t }) => (
                  <div key={n} className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full ${c} font-black text-[11px] flex items-center justify-center flex-shrink-0`}>{n}</span>
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────────
              GEMINI API KEY PANEL
             ───────────────────────────────────────────────────────────────── */}
          <GeminiKeyPanel
            apiKey={geminiKey}
            keyStatus={keyStatus}
            onKeyChange={handleKeyChange}
            onValidate={handleValidateKey}
          />

          {/* ─────────────────────────────────────────────────────────────────
              UPLOAD ZONE
             ───────────────────────────────────────────────────────────────── */}
          <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            {/* Panel header */}
            <div className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-sky-400" />
                <span className="font-bold text-sm text-white">Upload Handwritten Paper Images</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${images.length >= MAX_IMAGES ? 'bg-amber-500 text-slate-900' : 'bg-slate-700 text-slate-400'}`}>
                  {images.length}/{MAX_IMAGES}
                </span>
              </div>
              {images.length > 0 && (
                <button
                  onClick={resetAll}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-400 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  Clear all
                </button>
              )}
            </div>

            <div className="p-5 space-y-4">
              {/* Drop zone */}
              {images.length < MAX_IMAGES && (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
                    transition-all duration-300 select-none
                    ${isDragging
                      ? 'border-sky-400 bg-sky-900/20 scale-[1.01] shadow-lg shadow-sky-900/20'
                      : 'border-slate-700 hover:border-slate-500 hover:bg-slate-800/40 bg-slate-800/20'
                    }
                  `}
                >
                  {isDragging && (
                    <div className="absolute inset-0 rounded-xl bg-sky-500/5 animate-pulse" />
                  )}
                  <div className="relative">
                    <div className={`mx-auto w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-colors ${isDragging ? 'bg-sky-500/20 border-sky-500' : 'bg-slate-800 border-slate-700'} border-2`}>
                      <UploadCloud className={`w-7 h-7 ${isDragging ? 'text-sky-400' : 'text-slate-500'} transition-colors`} />
                    </div>
                    <p className="text-sm font-bold text-slate-200">
                      {isDragging ? 'Drop your paper images here' : 'Drag & drop or click to select images'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      JPG, PNG, HEIC, WEBP · Front page, back page, up to {MAX_IMAGES} images
                    </p>
                    <div className="mt-3 flex items-center justify-center gap-3 flex-wrap">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600/15 border border-amber-600/30 rounded-lg text-amber-400 text-xs font-semibold">
                        <Zap className="w-3.5 h-3.5" />
                        Gemini Vision AI
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600/15 border border-sky-600/30 rounded-lg text-sky-400 text-xs font-semibold">
                        <ScanLine className="w-3.5 h-3.5" />
                        Tesseract OCR fallback
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Thumbnail grid */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {images.map((img) => (
                    <ImageCard
                      key={img.id}
                      img={img}
                      onRemove={removeImage}
                      onPreview={(url) => setPreviewUrl(url)}
                    />
                  ))}
                  {/* Add more slot */}
                  {images.length < MAX_IMAGES && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-[3/4] rounded-xl border-2 border-dashed border-slate-700 hover:border-slate-500 bg-slate-800/30 hover:bg-slate-800/60 flex flex-col items-center justify-center gap-2 transition-all group cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-xl bg-slate-700/50 group-hover:bg-slate-700 flex items-center justify-center transition-colors">
                        <UploadCloud className="w-4.5 h-4.5 text-slate-500 group-hover:text-slate-400" />
                      </div>
                      <span className="text-[11px] text-slate-600 group-hover:text-slate-400 font-semibold">
                        {PAGE_LABELS[images.length] || 'Add page'}
                      </span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────────
              METADATA PANEL
             ───────────────────────────────────────────────────────────────── */}
          <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 px-5 py-3.5 border-b border-slate-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-sm text-white">Paper Metadata</span>
              {keyStatus === 'valid' ? (
                <span className="text-[10px] text-amber-400 font-bold ml-1 bg-amber-900/30 border border-amber-700/40 px-2 py-0.5 rounded-full">
                  ✔ Auto-extracted by Gemini AI from image
                </span>
              ) : (
                <span className="text-[10px] text-slate-500 ml-1">· Enter manually (no Gemini key)</span>
              )}
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <SelectField
                icon={<BookOpen className="w-3 h-3" />}
                label="Subject"
                value={subject}
                onChange={(v) => setSubject(v as Subject)}
                options={['', ...SUBJECT_OPTIONS]}
              />
              <SelectField
                icon={<GraduationCap className="w-3 h-3" />}
                label="Grade / Class"
                value={grade}
                onChange={(v) => setGrade(v as GradeLevel)}
                options={['', ...GRADE_OPTIONS]}
              />
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <Hash className="w-3 h-3" />
                  Total Marks
                </label>
                <input
                  type="number"
                  min={0}
                  max={200}
                  value={totalMarks || ''}
                  onChange={(e) => setTotalMarks(Number(e.target.value))}
                  placeholder={keyStatus === 'valid' ? 'From image…' : 'e.g. 50'}
                  className="bg-slate-800/80 border border-slate-700 hover:border-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-slate-200 text-sm rounded-xl px-3 py-2.5 outline-none transition-all placeholder:text-slate-600"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <Clock className="w-3 h-3" />
                  Time Allowed
                </label>
                <input
                  type="text"
                  value={timeAllowed}
                  onChange={(e) => setTimeAllowed(e.target.value)}
                  placeholder={keyStatus === 'valid' ? 'From image…' : 'e.g. 2 Hours 30 Minutes'}
                  className="bg-slate-800/80 border border-slate-700 hover:border-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-slate-200 text-sm rounded-xl px-3 py-2.5 outline-none transition-all placeholder:text-slate-600"
                />
              </div>
            </div>
            {/* Exam term row */}
            <div className="px-5 pb-5">
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <FileText className="w-3 h-3" />
                  Examination Title / Term
                </label>
                <input
                  type="text"
                  value={examTerm}
                  onChange={(e) => setExamTerm(e.target.value)}
                  placeholder={keyStatus === 'valid' ? 'Auto-extracted from image…' : 'e.g. Mid-Term Examination 2026'}
                  className="bg-slate-800/80 border border-slate-700 hover:border-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-200 text-sm rounded-xl px-3 py-2.5 outline-none transition-all placeholder:text-slate-600 max-w-sm"
                />
              </div>
              {keyStatus === 'valid' && (
                <p className="text-[11px] text-slate-600 mt-2 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Fields are populated automatically after AI extracts them from your image. You can correct them if needed.
                </p>
              )}
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────────
              CONVERT BUTTON
             ───────────────────────────────────────────────────────────────── */}
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={handleConvert}
              disabled={!canConvert}
              className={`
                relative group flex items-center gap-3 px-10 py-4 rounded-2xl font-black text-base
                shadow-2xl transition-all duration-300 select-none
                ${canConvert
                  ? 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:via-emerald-400 hover:to-teal-400 text-white hover:shadow-emerald-900/40 hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 cursor-pointer'
                  : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
                }
              `}
            >
              {isRunning ? (
                <>
                  <svg className="w-5 h-5 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>
                    Extracting {processingImg ? `${processingImg.label}` : '…'}
                  </span>
                </>
              ) : hasResult ? (
                <>
                  <RefreshCw className="w-5 h-5" />
                  <span>Re-Convert Paper</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span>
                    {keyStatus === 'valid' ? '✦ AI Extract & Generate Official Paper' : 'Extract & Generate Official Paper'}
                  </span>
                </>
              )}
              {/* Shimmer */}
              {canConvert && !isRunning && (
                <span className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </span>
              )}
            </button>

            {/* Progress bars */}
            {isRunning && (
              <div className="w-full max-w-md space-y-2">
                {images.map((img) => (
                  <div key={img.id} className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400 w-20 font-bold truncate">{img.label}</span>
                    <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          img.status === 'done' ? 'bg-emerald-500' :
                          img.status === 'error' ? 'bg-red-500' :
                          img.status === 'processing' ? 'bg-blue-500 animate-pulse' : 'bg-slate-700'
                        }`}
                        style={{ width: `${img.progress ?? 0}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 w-8 text-right font-mono">{img.progress ?? 0}%</span>
                  </div>
                ))}
              </div>
            )}

            {images.length === 0 && !isRunning && (
              <p className="text-xs text-slate-600">Upload at least one image to begin</p>
            )}
          </div>

          {/* ─────────────────────────────────────────────────────────────────
              ERROR DISPLAY
             ───────────────────────────────────────────────────────────────── */}
          {globalError && (
            <div className="flex gap-3 p-4 bg-red-950/40 border border-red-800/60 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-300">Extraction Issue</p>
                <p className="text-xs text-red-400 mt-0.5 whitespace-pre-line">{globalError}</p>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────────
              SUCCESS BAR
             ───────────────────────────────────────────────────────────────── */}
          {hasResult && generatedPaper && (
            <div className="flex items-center justify-between gap-4 p-4 bg-emerald-950/40 border border-emerald-800/50 rounded-xl flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-black text-emerald-300">Paper generated successfully!</p>
                  <p className="text-xs text-emerald-600">
                    {generatedPaper.sections.length} section{generatedPaper.sections.length !== 1 ? 's' : ''} · {totalQCount} question{totalQCount !== 1 ? 's' : ''} · {generatedPaper.totalMarks} marks
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={onExportDocx}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md transition-all"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  Download Word (.docx)
                </button>
                <button
                  onClick={onPrint}
                  className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md transition-all"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print / Save PDF (A4)
                </button>
              </div>
            </div>
          )}
        </div>{/* end .no-print wrapper */}

        {/* ══════════════════════════════════════════════════════════════════
            A4 PAPER PREVIEW
           ══════════════════════════════════════════════════════════════════ */}
        {hasResult && generatedPaper && (
          <div className="no-print max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            {/* Preview label */}
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-emerald-500 rounded-full" />
                <span className="font-bold text-sm text-white">Live Paper Preview</span>
                <span className="text-xs text-slate-600">· A4 (210mm × 297mm)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onExportDocx}
                  className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-bold transition-colors"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  Word
                </button>
                <span className="text-slate-700">·</span>
                <button
                  onClick={onPrint}
                  className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-bold transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print / PDF
                </button>
              </div>
            </div>

            {/* Paper wrapper */}
            <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-800 shadow-xl overflow-auto">
              {/* A4 sheet */}
              <div
                id="achievers-printable-paper"
                className="bg-white mx-auto shadow-2xl"
                style={{
                  width: '210mm',
                  minHeight: '297mm',
                  maxWidth: '100%',
                  padding: '20mm',
                  boxSizing: 'border-box',
                  fontFamily: 'Arial, sans-serif',
                  fontSize: '11pt',
                  color: '#1a1a1a',
                }}
              >
                {/* Academy Letterhead */}
                <AcademyLetterhead paper={generatedPaper} isUrduOrArabic={isUrduOrArabic} />

                {/* General Instructions */}
                {generatedPaper.instructions && generatedPaper.instructions.length > 0 && (
                  <div className="mb-4 border border-slate-300 rounded bg-slate-50 p-2.5" style={{ borderColor: '#cbd5e1' }}>
                    <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1.5" style={{ color: '#334155' }}>
                      General Instructions:
                    </p>
                    <ol className="list-decimal list-inside text-xs text-slate-700 space-y-0.5" style={{ color: '#334155' }}>
                      {generatedPaper.instructions.map((ins, i) => (
                        <li key={i}>{ins}</li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Sections */}
                {generatedPaper.sections.length === 0 ? (
                  /* Raw text fallback when no sections detected */
                  <div className="text-sm text-slate-700" style={{ lineHeight: 1.8 }}>
                    <p className="font-bold text-slate-500 mb-2 text-xs uppercase tracking-wide">Extracted Content:</p>
                    {images
                      .filter((i) => i.ocrText)
                      .map((i) => (
                        <div key={i.id} className="mb-6">
                          <p className="font-bold text-xs text-slate-400 mb-1 uppercase">{i.label}</p>
                          <p className="whitespace-pre-wrap" dir={isUrduOrArabic ? 'rtl' : 'ltr'}
                            style={{ fontFamily: isUrduOrArabic ? "'Noto Nastaliq Urdu', serif" : 'inherit', lineHeight: isUrduOrArabic ? 2.4 : 1.8 }}>
                            {i.ocrText}
                          </p>
                        </div>
                      ))}
                  </div>
                ) : (
                  generatedPaper.sections.map((section) => (
                    <div key={section.id} className="mb-6">
                      {/* Section header */}
                      <div
                        className="py-1.5 px-3 mb-3 rounded"
                        style={{ backgroundColor: '#0F284E', color: '#ffffff' }}
                      >
                        <div className="flex items-center justify-between">
                          <h2 className="font-black text-sm" style={{ color: '#ffffff' }}>
                            {section.sectionTitle}
                          </h2>
                          <span className="font-bold text-xs" style={{ color: '#6ee7b7' }}>
                            [{section.totalMarks} Marks]
                          </span>
                        </div>
                        {section.instructions && (
                          <p className="text-[10px] mt-0.5 italic" style={{ color: '#93c5fd' }}>
                            {section.instructions}
                          </p>
                        )}
                      </div>

                      {/* Questions */}
                      {section.questions.map((q, qi) => (
                        <div
                          key={q.id}
                          className="mb-3 pb-2"
                          style={{ borderBottom: qi < section.questions.length - 1 ? '1px solid #f1f5f9' : 'none' }}
                        >
                          <div className="flex items-start gap-2">
                            <span
                              className="font-black text-[11px] flex-shrink-0 mt-0.5"
                              style={{ color: '#0F284E', minWidth: '24px' }}
                            >
                              Q{q.questionNumber || qi + 1}.
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p
                                  className="text-sm leading-relaxed"
                                  dir={isUrduOrArabic ? 'rtl' : 'ltr'}
                                  style={{
                                    fontFamily: isUrduOrArabic
                                      ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
                                      : 'Arial, sans-serif',
                                    lineHeight: isUrduOrArabic ? '2.4' : '1.5',
                                    color: '#1e293b',
                                  }}
                                >
                                  {q.text || ''}
                                </p>
                                <span
                                  className="font-bold text-[10px] flex-shrink-0 px-1.5 py-0.5 rounded text-white"
                                  style={{ backgroundColor: '#059669', whiteSpace: 'nowrap' }}
                                >
                                  {q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}
                                </span>
                              </div>

                              {/* MCQ Options */}
                              {q.type === 'mcq' && q.options && q.options.length > 0 && (
                                <div className="mt-1.5 flex flex-wrap gap-x-6 gap-y-1">
                                  {q.options.filter(o => o.text).map((opt) => (
                                    <span key={opt.id} className="text-xs" style={{ color: '#334155' }}>
                                      <strong style={{ color: '#0F284E' }}>({opt.label})</strong>{' '}
                                      {opt.text}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Fill blank answer line */}
                              {q.type === 'fill_in_the_blank' && (
                                <div className="mt-1.5 border-b border-slate-300" style={{ minHeight: '20px', borderColor: '#cbd5e1' }} />
                              )}

                              {/* Short answer lines */}
                              {q.type === 'short' && (
                                <div className="mt-2 space-y-2">
                                  {[...Array(3)].map((_, li) => (
                                    <div key={li} className="border-b" style={{ height: '20px', borderColor: '#e2e8f0' }} />
                                  ))}
                                </div>
                              )}

                              {/* Long answer lines */}
                              {q.type === 'long' && (
                                <div className="mt-2 space-y-2">
                                  {[...Array(6)].map((_, li) => (
                                    <div key={li} className="border-b" style={{ height: '20px', borderColor: '#e2e8f0' }} />
                                  ))}
                                </div>
                              )}

                              {/* Vocabulary column match */}
                              {q.type === 'vocabulary' && q.columnMatchLeft && q.columnMatchRight && (
                                <div className="mt-2 grid grid-cols-2 gap-x-8 text-xs" style={{ color: '#334155' }}>
                                  <div>
                                    {q.columnMatchLeft.map((item, li) => (
                                      <p key={li} className="py-0.5 border-b" style={{ borderColor: '#e2e8f0' }}>
                                        {li + 1}. {item}
                                      </p>
                                    ))}
                                  </div>
                                  <div>
                                    {q.columnMatchRight.map((item, li) => (
                                      <p key={li} className="py-0.5 border-b text-right" style={{ borderColor: '#e2e8f0' }}>
                                        {item}
                                      </p>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))
                )}

                {/* Footer */}
                <div className="mt-8 pt-3 text-center" style={{ borderTop: '2px solid #0F284E' }}>
                  <p className="font-black text-xs tracking-widest" style={{ color: '#0F284E' }}>
                    *** ALL THE BEST — THE ACHIEVERS ISLAMIC ACADEMY ***
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* App footer */}
        <footer className="no-print border-t border-slate-800/60 py-5 text-center">
          <p className="text-[11px] text-slate-600">
            <span className="font-bold text-slate-500">THE ACHIEVERS ISLAMIC ACADEMY</span>
            {' '}· Handwritten Paper Converter · Gemini Vision AI + Tesseract OCR
          </p>
        </footer>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          PRINT STYLES
         ══════════════════════════════════════════════════════════════════════ */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait !important;
            margin: 0 !important;
          }
          html, body {
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
          }
          .no-print,
          header,
          footer,
          nav {
            display: none !important;
          }
          #achievers-printable-paper {
            display: block !important;
            width: 210mm !important;
            min-width: 210mm !important;
            max-width: 210mm !important;
            min-height: 297mm !important;
            padding: 20mm !important;
            box-sizing: border-box !important;
            margin: 0 auto !important;
            background: #ffffff !important;
            border: none !important;
            box-shadow: none !important;
            color: #1a1a1a !important;
          }
          #root, #root > div, main, main > div {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            display: block !important;
            background: transparent !important;
          }
        }
      `}</style>
    </>
  );
};
