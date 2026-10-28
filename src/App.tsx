import React, { useState } from 'react';
import type { 
  ExamPaper, 
  BlueprintConfig, 
  UploadedChapterPage,
  Subject,
  GradeLevel,
  ExamTerm,
  Language
} from './types/exam';
import { Header } from './components/Header';
import { ChapterImageUploader } from './components/generator/ChapterImageUploader';
import { GenerationConfigPanel } from './components/generator/GenerationConfigPanel';
import { BlueprintClarificationModal } from './components/generator/BlueprintClarificationModal';
import { OcrUploader } from './components/ocr/OcrUploader';
import { OcrExtractedEditor } from './components/ocr/OcrExtractedEditor';
import { PaperStudio } from './components/studio/PaperStudio';
import { PresetsShowcase } from './components/PresetsShowcase';
import { PrePrimaryModeView } from './components/preprimary/PrePrimaryModeView';
import { ImagePreviewModal } from './components/common/ImagePreviewModal';
import { HandwrittenConverter } from './components/handwritten/HandwrittenConverter';
import { exportPaperToDocx } from './utils/docxExporter';
import { exportPaperToPdf, printPaperNative } from './utils/pdfExporter';
import { parseRawOcrTextToExamPaper } from './utils/ocrParser';
import { generateExamPaperFromBlueprint } from './utils/aiGenerator';
import { recognizeImage } from './utils/ocrService';

// ---------------------------------------------------------------------------
// Blank paper template — used as the true "no data" starting state.
// Subject, grade, sections etc. are all empty/default and must be replaced
// by real user actions (OCR, AI Generator, or Sample Paper load).
// ---------------------------------------------------------------------------
const BLANK_PAPER: ExamPaper = {
  id: 'blank-paper-initial',
  academyName: 'The Achievers Islamic Academy',
  campusName: 'Main Academic Campus',
  examTerm: 'Mid-Term Examination 2026',
  gradeLevel: 'Grade 9 (Matric / O-Level)',
  subject: 'Islamic Studies (اسلامیات)',
  language: 'ur',
  timeAllowed: '2 Hours',
  totalMarks: 50,
  date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
  instructions: [
    'Write your Name and Roll Number clearly on the answer sheet.',
    'Attempt all questions. No question will be repeated.',
    'Use blue or black pen for answers.',
  ],
  showBismillah: true,
  showWatermark: true,
  showStudentTable: true,
  boardFormat: 'bise',
  paperCode: '0000',
  examGroup: 'Group-I (Morning)',
  showBubbleSheet: false,
  layoutColumns: 1,
  fontSize: 'standard',
  paperSize: 'a4',
  sections: [],
  createdVia: 'manual',
  createdAt: new Date().toISOString(),
};

export function App() {
  const [activeTab, setActiveTab] = useState<'generator' | 'ocr' | 'pre_primary' | 'studio' | 'samples' | 'handwritten'>('handwritten');

  // =========================================================
  // SHARED PAPER STATE — single source of truth for Studio,
  // Export, Print, and Header display. Never seeded with
  // hardcoded preset data.
  // =========================================================
  const [currentPaper, setCurrentPaper] = useState<ExamPaper>(BLANK_PAPER);

  // =========================================================
  // MODE 2: AI Auto-Generation State
  // chapterPages starts EMPTY — teacher must upload images.
  // =========================================================
  const [chapterPages, setChapterPages] = useState<UploadedChapterPage[]>([]);
  const [blueprint, setBlueprint] = useState<BlueprintConfig>({
    grade: 'Grade 9 (Matric / O-Level)',
    subject: 'Islamic Studies (اسلامیات)',
    examTerm: 'Mid-Term Examination 2026',
    language: 'ur',
    paperSize: 'a4',
    timeAllowed: '2 Hours 30 Minutes',
    totalTargetMarks: 50,
    mcqCount: 5,
    mcqMarksEach: 1,
    blanksCount: 3,
    blanksMarksEach: 1,
    vocabCount: 2,
    vocabMarksEach: 1,
    shortCountTotal: 7,
    shortCountToAttempt: 5,
    shortMarksEach: 3,
    longCountTotal: 3,
    longCountToAttempt: 2,
    longMarksEach: 12.5,
    difficultyDistribution: {
      easy: 40,
      medium: 40,
      hard: 20,
    },
  });
  const [isClarificationOpen, setIsClarificationOpen] = useState<boolean>(false);

  // =========================================================
  // MODE 1: OCR State
  // Starts with ocrCompleted = false and no pre-loaded paper.
  // Only populated after a teacher actually runs the OCR scan.
  // =========================================================
  const [isOcrProcessing, setIsOcrProcessing] = useState<boolean>(false);
  const [ocrProgress, setOcrProgress] = useState<number>(0);
  const [ocrCompleted, setOcrCompleted] = useState<boolean>(false);
  const [ocrRawText, setOcrRawText] = useState<string>('');
  const [ocrParsedPaper, setOcrParsedPaper] = useState<ExamPaper | null>(null);

  // Action: Update OCR paper and keep currentPaper in sync.
  // Computes `next` once from a shared base so both setters receive the
  // same value — avoids the double-evaluation divergence when a functional
  // updater is passed and the two state slices have drifted.
  const handleUpdateOcrPaper: React.Dispatch<React.SetStateAction<ExamPaper>> = (paperAction) => {
    setOcrParsedPaper((prev) => {
      const base = prev ?? BLANK_PAPER;
      const next =
        typeof paperAction === 'function'
          ? (paperAction as (p: ExamPaper) => ExamPaper)(base)
          : paperAction;
      // Keep currentPaper in sync using the already-computed next value.
      setCurrentPaper(next);
      return next;
    });
  };

  // Action: Handle instant preset selection in OCR tab — preset sends
  // its pre-extracted text directly so we bypass the fallback generator.
  const handlePresetSelect = (preset: { 
    extractedRawText: string;
    subject: Subject;
    gradeLevel: GradeLevel;
    language: Language;
    examTerm: ExamTerm;
    totalMarks: number;
    timeAllowed: string;
  }) => {
    const parsed = parseRawOcrTextToExamPaper(preset.extractedRawText, {
      customSubject: preset.subject,
      customGrade: preset.gradeLevel,
      customLanguage: preset.language,
      customExamTerm: preset.examTerm,
      customTotalMarks: preset.totalMarks,
      customTime: preset.timeAllowed,
    });
    setOcrRawText(preset.extractedRawText);
    setOcrParsedPaper(parsed);
    setCurrentPaper(parsed);
    setOcrCompleted(true);
  };

  // Common UI State
  const [previewImage, setPreviewImage] = useState<{ isOpen: boolean; url: string; title?: string }>({
    isOpen: false,
    url: '',
    title: '',
  });

  // Action: Export to Word (.docx)
  const handleExportDocx = async () => {
    try {
      const activeDoc = activeTab === 'ocr' && ocrParsedPaper ? ocrParsedPaper : currentPaper;
      await exportPaperToDocx(activeDoc);
    } catch (err) {
      console.error('Docx export failed:', err);
      alert('Could not export Word document. Please try printing to PDF instead.');
    }
  };

  // Action: Export to PDF
  const handleExportPdf = async () => {
    const activeDoc = (activeTab === 'ocr' && ocrParsedPaper) ? ocrParsedPaper : currentPaper;
    const cleanSub = activeDoc.subject.replace(/[^a-zA-Z0-9]/g, '_');
    const cleanGrade = activeDoc.gradeLevel.replace(/[^a-zA-Z0-9]/g, '_');
    const paperSize: 'a4' | 'legal' = (activeTab === 'pre_primary' || activeTab === 'handwritten') ? 'a4' : (activeDoc.paperSize || 'a4');
    await exportPaperToPdf(
      'achievers-printable-paper',
      `The_Achievers_Islamic_Academy_${cleanSub}_${cleanGrade}_${paperSize.toUpperCase()}.pdf`,
      paperSize
    );
  };

  // Action: Native Print
  const handlePrint = () => {
    if (activeTab === 'pre_primary' || activeTab === 'handwritten') {
      printPaperNative('a4');
    } else {
      const activeDoc = activeTab === 'ocr' && ocrParsedPaper ? ocrParsedPaper : currentPaper;
      printPaperNative(activeDoc.paperSize || 'a4');
    }
  };

  // Action: Open image zoom modal
  const handlePreviewImage = (url: string, title?: string) => {
    setPreviewImage({ isOpen: true, url, title });
  };

  // ---------------------------------------------------------------------------
  // Action: Start OCR Digitize
  //
  // For PRESET uploads: rawPresetText is provided by OcrUploader — parse it
  // directly with the preset's metadata. No Tesseract call needed.
  //
  // For REAL file uploads: rawPresetText is undefined.
  //   1. Attempt real in-browser OCR via Tesseract.js (ocrService.ts).
  //   2. If Tesseract succeeds (confidence > 30 & text > 20 chars), use its
  //      output as extractedText — this populates real question arrays.
  //   3. If Tesseract fails or returns low-confidence text, fall back to a
  //      clean scaffold so the teacher can paste/correct manually.
  // ---------------------------------------------------------------------------
  const handleStartOcr = async (
    imageDataUrl: string,
    rawPresetText?: string,
    presetMetadata?: {
      subject?: Subject;
      gradeLevel?: GradeLevel;
      language?: Language;
      examTerm?: ExamTerm;
      totalMarks?: number;
      timeAllowed?: string;
    }
  ) => {
    setIsOcrProcessing(true);
    setOcrCompleted(false);
    setOcrProgress(0);

    // Resolve metadata the teacher configured
    const resolvedSubject   = presetMetadata?.subject   ?? 'English Language & Lit';
    const resolvedGrade     = presetMetadata?.gradeLevel ?? 'Grade 9 (Matric / O-Level)';
    const resolvedLanguage  = presetMetadata?.language  ?? 'en';
    const resolvedTerm      = presetMetadata?.examTerm  ?? 'Mid-Term Examination 2026';
    const resolvedMarks     = presetMetadata?.totalMarks ?? 50;
    const resolvedTime      = presetMetadata?.timeAllowed ?? '2 Hours';

    let extractedText: string;

    if (rawPresetText) {
      // ── Preset path: use the pre-extracted text verbatim ──────────────────
      extractedText = rawPresetText;
    } else {
      // ── Real upload path: run Tesseract.js OCR on the actual image ─────────
      try {
        const ocrResult = await recognizeImage(
          imageDataUrl,
          resolvedLanguage,
          (percent) => setOcrProgress(percent),
        );

        if (ocrResult.success && ocrResult.text.length > 20 && ocrResult.confidence > 25) {
          // Real OCR text extracted — use it directly so the parser populates
          // mcqs / shortQuestions / longQuestions with real content.
          extractedText = ocrResult.text;
        } else {
          // OCR returned too little usable content — produce a labelled scaffold
          // with a note that the teacher should paste in the real text.
          const isUrduLang = resolvedLanguage === 'ur';
          const isArabicLang = resolvedLanguage === 'ar';

          if (isUrduLang || isArabicLang) {
            extractedText =
`The Achievers Islamic Academy
${resolvedSubject} — ${resolvedGrade}
کل نمبر: ${resolvedMarks}   وقت: ${resolvedTime}

حصہ اول: معروضی سوالات
سوال 1

حصہ دوم: مختصر سوالات (کوئی سے حل کریں)
سوال 1
سوال 2

حصہ سوم: تفصیلی سوالات
سوال 1`;
          } else {
            extractedText =
`The Achievers Islamic Academy
${resolvedSubject} — ${resolvedGrade}
Total Marks: ${resolvedMarks}   Time: ${resolvedTime}

Section A: Objective Questions
Q1.

Section B: Short Questions (Attempt any)
Q1.
Q2.

Section C: Long Questions
Q1.`;
          }
        }
      } catch {
        // Tesseract threw — produce minimal scaffold so app stays functional
        const isUrduLang = resolvedLanguage === 'ur';
        if (isUrduLang || resolvedLanguage === 'ar') {
          extractedText =
`The Achievers Islamic Academy
${resolvedSubject} — ${resolvedGrade}
کل نمبر: ${resolvedMarks}   وقت: ${resolvedTime}

حصہ اول: معروضی سوالات
سوال 1

حصہ دوم: مختصر سوالات
سوال 1`;
        } else {
          extractedText =
`The Achievers Islamic Academy
${resolvedSubject} — ${resolvedGrade}
Total Marks: ${resolvedMarks}   Time: ${resolvedTime}

Section A: Objective Questions
Q1.

Section B: Short Questions
Q1.`;
        }
      }
    }

    const parsed = parseRawOcrTextToExamPaper(extractedText, {
      customSubject:    resolvedSubject,
      customGrade:      resolvedGrade,
      customLanguage:   resolvedLanguage,
      customExamTerm:   resolvedTerm,
      customTotalMarks: resolvedMarks,
      customTime:       resolvedTime,
    });

    setOcrRawText(extractedText);
    setOcrParsedPaper(parsed);
    setCurrentPaper(parsed); // Real-time global binding
    setIsOcrProcessing(false);
    setOcrProgress(0);
    setOcrCompleted(true);
  };

  // Action: Apply OCR parsed paper to live studio
  const handleApplyOcrPaper = (paper: ExamPaper) => {
    setCurrentPaper(paper);
    setActiveTab('studio');
  };

  // Action: Confirm AI Generation Blueprint & Generate Paper
  const handleConfirmGenerate = () => {
    setIsClarificationOpen(false);
    const newPaper = generateExamPaperFromBlueprint(blueprint, chapterPages);
    setCurrentPaper(newPaper);
    setActiveTab('studio');
  };

  // Action: Load Sample Paper
  const handleLoadSamplePaper = (paper: ExamPaper) => {
    setCurrentPaper(paper);
    setActiveTab('studio');
  };

  // Derived: active paper for header display
  const headerPaper = activeTab === 'ocr' && ocrParsedPaper ? ocrParsedPaper : currentPaper;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Top Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onPrint={handlePrint}
        onExportDocx={handleExportDocx}
        onExportPdf={handleExportPdf}
        hasActivePaper={!!currentPaper && currentPaper.sections.length > 0}
        currentSubject={headerPaper.subject}
        currentGrade={headerPaper.gradeLevel}
        paperSize={headerPaper.paperSize || 'a4'}
        onPaperSizeChange={(size) => {
          if (activeTab === 'ocr' && ocrParsedPaper) {
            setOcrParsedPaper((prev) => prev ? { ...prev, paperSize: size } : prev);
          }
          setCurrentPaper((prev) => ({ ...prev, paperSize: size }));
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* ── NEW: Handwritten to Digital Paper Converter ── */}
        {activeTab === 'handwritten' && (
          <div className="animate-in fade-in duration-200">
            <HandwrittenConverter
              onPrint={handlePrint}
              onExportDocx={handleExportDocx}
              onExportPdf={handleExportPdf}
              onPaperReady={(paper) => {
                setCurrentPaper(paper);
              }}
            />
          </div>
        )}

        {/* Dedicated Mode: Pre-Primary / Nursery & KG */}
        {activeTab === 'pre_primary' && (
          <div className="animate-in fade-in duration-200">
            <PrePrimaryModeView
              paper={currentPaper}
              setPaper={setCurrentPaper}
              onPrint={handlePrint}
              onExportDocx={handleExportDocx}
              onExportPdf={handleExportPdf}
              onOpenInStudio={() => setActiveTab('studio')}
            />
          </div>
        )}

        {/* Tab 1: AI Auto-Generation Mode */}
        {activeTab === 'generator' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Mode Banner */}
            <div className="bg-gradient-to-r from-[#0F284E] via-[#1E3A8A] to-[#059669] rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-400 text-slate-900 uppercase tracking-wider">
                    Mode 2: AI Auto-Generation
                  </span>
                  <span className="text-xs text-slate-200 font-semibold">
                    The Achievers Islamic Academy
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                  Intelligent Curriculum Exam Generator
                </h1>
                <p className="text-xs sm:text-sm text-slate-200 mt-2 max-w-2xl leading-relaxed">
                  Optionally upload 4 to 10 textbook pages or chapter snapshots, specify question quantities, confirm weightage &amp; rubric in the preliminary clarification step, and instantly generate a beautifully balanced academy examination paper.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => setIsClarificationOpen(true)}
                  className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <span>Review Blueprint &amp; Generate</span>
                </button>
              </div>
            </div>

            {/* Step 1: Chapter Image Uploader (optional) */}
            <ChapterImageUploader
              pages={chapterPages}
              setPages={setChapterPages}
              onPreviewImage={handlePreviewImage}
            />

            {/* Step 2: Generation Configuration Panel */}
            <GenerationConfigPanel
              blueprint={blueprint}
              setBlueprint={setBlueprint}
              onOpenClarification={() => setIsClarificationOpen(true)}
              canGenerate={true}  // Always enabled — works from blueprint alone
            />
          </div>
        )}

        {/* Tab 2: OCR & Formatting Mode */}
        {activeTab === 'ocr' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <OcrUploader
              onStartOcr={handleStartOcr}
              onPresetSelect={handlePresetSelect}
              isProcessing={isOcrProcessing}
              ocrProgress={ocrProgress}
            />

            {ocrCompleted && ocrParsedPaper && (
              <OcrExtractedEditor
                rawText={ocrRawText}
                setRawText={(text) => {
                  setOcrRawText(text);
                  const updated = parseRawOcrTextToExamPaper(text, {
                    customSubject: ocrParsedPaper.subject,
                    customGrade: ocrParsedPaper.gradeLevel,
                    customLanguage: ocrParsedPaper.language,
                    customExamTerm: ocrParsedPaper.examTerm,
                    customTotalMarks: ocrParsedPaper.totalMarks,
                    customTime: ocrParsedPaper.timeAllowed,
                  });
                  setOcrParsedPaper(updated);
                  setCurrentPaper(updated);
                }}
                parsedPaper={ocrParsedPaper}
                setParsedPaper={handleUpdateOcrPaper}
                onApplyToStudio={handleApplyOcrPaper}
                onReset={() => {
                  setOcrCompleted(false);
                  setOcrParsedPaper(null);
                  setOcrRawText('');
                }}
                onPrint={handlePrint}
                onExportDocx={handleExportDocx}
                onExportPdf={handleExportPdf}
              />
            )}
          </div>
        )}

        {/* Tab 3: Interactive Paper Studio */}
        {activeTab === 'studio' && (
          <div className="animate-in fade-in duration-200">
            <PaperStudio
              paper={currentPaper}
              setPaper={setCurrentPaper}
              onPrint={handlePrint}
              onExportDocx={handleExportDocx}
              onExportPdf={handleExportPdf}
            />
          </div>
        )}

        {/* Tab 4: Pre-Built Curriculum Presets */}
        {activeTab === 'samples' && (
          <div className="animate-in fade-in duration-200">
            <PresetsShowcase
              onLoadPaper={handleLoadSamplePaper}
              onGoToGenerator={() => setActiveTab('generator')}
              onGoToOcr={() => setActiveTab('ocr')}
            />
          </div>
        )}
      </main>

      {/* Blueprint Confirmation & Clarification Modal */}
      <BlueprintClarificationModal
        isOpen={isClarificationOpen}
        onClose={() => setIsClarificationOpen(false)}
        blueprint={blueprint}
        uploadedPages={chapterPages}
        onConfirmGenerate={handleConfirmGenerate}
      />

      {/* Image Zoom Preview Modal */}
      <ImagePreviewModal
        isOpen={previewImage.isOpen}
        onClose={() => setPreviewImage({ isOpen: false, url: '', title: '' })}
        imageUrl={previewImage.url}
        title={previewImage.title}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 no-print mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0F284E]">THE ACHIEVERS ISLAMIC ACADEMY</span>
            <span>• Assessment &amp; Exam System</span>
          </div>
          <p className="text-slate-400">
            Optimized for Agentic IDEs (Google Antigravity, v0, Bolt.new) • Built with React, TypeScript &amp; KaTeX
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
