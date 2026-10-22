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
import { SAMPLE_PAPERS } from './data/samplePapers';
import { PRESET_CHAPTER_COLLECTIONS } from './data/presetChapters';
import { OCR_PRESETS } from './data/ocrPresets';
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
import { exportPaperToDocx } from './utils/docxExporter';
import { exportPaperToPdf, printPaperNative } from './utils/pdfExporter';
import { parseRawOcrTextToExamPaper } from './utils/ocrParser';
import { generateExamPaperFromBlueprint } from './utils/aiGenerator';

export function App() {
  const [activeTab, setActiveTab] = useState<'generator' | 'ocr' | 'pre_primary' | 'studio' | 'samples'>('pre_primary');
  const [currentPaper, setCurrentPaper] = useState<ExamPaper>(SAMPLE_PAPERS[0]);

  // Mode 2: AI Auto-Generation State
  const [chapterPages, setChapterPages] = useState<UploadedChapterPage[]>(
    PRESET_CHAPTER_COLLECTIONS[0].pages
  );
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

  // Mode 1: OCR State
  const [isOcrProcessing, setIsOcrProcessing] = useState<boolean>(false);
  const [ocrCompleted, setOcrCompleted] = useState<boolean>(true);
  const [ocrRawText, setOcrRawText] = useState<string>(() => OCR_PRESETS[0].extractedRawText);
  const [ocrParsedPaper, setOcrParsedPaper] = useState<ExamPaper>(() => {
    return parseRawOcrTextToExamPaper(OCR_PRESETS[0].extractedRawText, {
      customSubject: OCR_PRESETS[0].subject,
      customGrade: OCR_PRESETS[0].gradeLevel,
      customLanguage: OCR_PRESETS[0].language,
      customExamTerm: OCR_PRESETS[0].examTerm,
      customTotalMarks: OCR_PRESETS[0].totalMarks,
      customTime: OCR_PRESETS[0].timeAllowed,
    });
  });

  // Action: Synchronously update OCR Paper and globally bind currentPaper
  const handleUpdateOcrPaper: React.Dispatch<React.SetStateAction<ExamPaper>> = (paperAction) => {
    setOcrParsedPaper((prev) => {
      const next = typeof paperAction === 'function' ? (paperAction as (p: ExamPaper) => ExamPaper)(prev) : paperAction;
      return next;
    });
    setCurrentPaper((prev) => {
      const next = typeof paperAction === 'function' ? (paperAction as (p: ExamPaper) => ExamPaper)(prev) : paperAction;
      return next;
    });
  };

  // Action: Handle instant preset selection in OCR tab
  const handlePresetSelect = (preset: (typeof OCR_PRESETS)[0]) => {
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
    // Pre-primary worksheets are always A4; other tabs read from document
    const paperSize: 'a4' | 'legal' = (activeTab === 'pre_primary') ? 'a4' : (activeDoc.paperSize || 'a4');
    await exportPaperToPdf(
      'achievers-printable-paper',
      `The_Achievers_Islamic_Academy_${cleanSub}_${cleanGrade}_${paperSize.toUpperCase()}.pdf`,
      paperSize
    );
  };

  // Action: Native Print
  const handlePrint = () => {
    // Pre-primary worksheets always enforce A4; other tabs read from active document
    if (activeTab === 'pre_primary') {
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

  // Action: Start OCR Digitize
  const handleStartOcr = (
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

    setTimeout(() => {
      let extractedText = rawPresetText;
      const targetSubject = presetMetadata?.subject || currentPaper.subject;
      const targetGrade = presetMetadata?.gradeLevel || currentPaper.gradeLevel;

      if (!extractedText) {
        if (targetSubject.includes('Urdu') || targetSubject.includes('اردو')) {
          extractedText = `The Achievers Islamic Academy
اردو لازمی - ${targetGrade}
کل نمبر: 50   وقت: 2 گھنٹے

حصہ اول: معروضی سوالات (10 نمبر)
1. "پتہ پتہ بوٹا بوٹا حال ہمارا جانے ہے" یہ کس شاعر کا کلام ہے؟
(الف) میر تقی میر   (ب) مرزا اسد اللہ خان غالب   (ج) علامہ اقبال   (د) فیض احمد فیض

2. لفظ "مسدس" کے لغوی معنی کیا ہیں؟
خالی جگہ: چھ مصرعوں پر مشتمل نظم

3. درج ذیل میں سے اسمِ معرفہ کی نشاندہی کریں:
(الف) شہر   (ب) دریا   (ج) کراچی   (د) کتاب

حصہ دوم: مختصر سوالات (کوئی سے 5 حل کریں)
1. تشبیہ کے بنیادی ارکان تفصیل سے لکھیں۔
2. محاورہ "آب آب ہونا" اور "چراغ پا ہونا" کا با محاورہ استعمال تحریر کریں۔
3. سیرت النبی ﷺ سے متعلق سبق کا مرکزی خیال قلمبند کریں۔

حصہ سوم: تفصیلی سوال (15 نمبر)
1. وقت کی پابندی اور قومی ترقی کے عنوان پر جامع مضمون تحریر کریں۔`;
        } else if (targetSubject.includes('Math') || targetSubject.includes('ریاضی')) {
          extractedText = `The Achievers Islamic Academy
Mathematics Examination - ${targetGrade}
Total Marks: 50   Time: 2 Hours

Section A: Objective & MCQs (10 Marks)
1. The standard form of a quadratic equation is:
(A) $ax^2 + bx + c = 0$   (B) $ax + b = 0$   (C) $ax^3 = 0$   (D) $x^2 = y$

2. The solution set of $x^2 - 16 = 0$ is:
(A) $\\{4\\}$   (B) $\\{-4\\}$   (C) $\\{\\pm 4\\}$   (D) $\\{16\\}$

Section B: Short Questions (Attempt any 5)
1. Solve $x^2 - 7x + 12 = 0$ by factorization.
2. Find the discriminant of $3x^2 - 5x + 2 = 0$ and state nature of roots.
3. If $\\alpha, \\beta$ are roots of $x^2 - 3x + 1 = 0$, evaluate $\\alpha^2 + \\beta^2$.

Section C: Long Questions (Attempt any 2)
1. State and prove Pythagoras Theorem with neat geometric diagram.
2. Solve the following simultaneous equations: $x + y = 6$ and $2x - y = 3$.`;
        } else if (targetSubject.includes('English')) {
          extractedText = `The Achievers Islamic Academy
English Language & Lit - ${targetGrade}
Total Marks: 50   Time: 2 Hours

Section A: Objective & Grammar (10 Marks)
1. Identify the antonym of the word 'Benevolent':
(A) Malevolent   (B) Generous   (C) Helpful   (D) Kind

2. Fill in the blank with appropriate preposition: "She is proficient ________ spoken English."
Answer: in

Section B: Short Questions & Comprehension (25 Marks)
1. Summarize the central theme of William Wordsworth's poem "Daffodils".
2. Change into Passive Voice: "The academy awarded the brilliant students."
3. Differentiate between a Transitive and Intransitive verb with examples.

Section C: Composition (15 Marks)
1. Write a descriptive essay on: "The Role of Education in Ethical Development".`;
        } else {
          // Dynamic Islamic Studies / Religious & Moral Education fallback
          extractedText = `The Achievers Islamic Academy
${targetSubject} - ${targetGrade}
کل نمبر: 50   وقت: 2 گھنٹے

حصہ اول: معروضی سوالات
1. ارکان اسلام کی کل تعداد ہے:
(الف) چار   (ب) پانچ   (ج) چھ   (د) سات

2. حدیث نبوی: "الصَّلَاةُ عِمَادُ الدِّينِ" کا معنی ہے: نماز دین کا ________ ہے۔
خالی جگہ: ستون

حصہ دوم: مختصر سوالات (کوئی سے 5 حل کریں)
1. سورۃ الانفال کی روشنی میں مومنین کے اوصاف بیان کریں۔
2. زکوٰۃ کے مصارف اور فضیلت تحریر کریں۔
3. سیرت النبی ﷺ سے امانت و دیانت کا ایک واقعہ لکھیں۔

حصہ سوم: تفصیلی سوالات (کوئی سے 2 حل کریں)
1. مواخات مدینہ کے پس منظر اور اخوتِ اسلامی پر جامع نوٹ تحریر کریں۔`;
        }
      }

      const parsed = parseRawOcrTextToExamPaper(extractedText, {
        customSubject: presetMetadata?.subject,
        customGrade: presetMetadata?.gradeLevel,
        customLanguage: presetMetadata?.language,
        customExamTerm: presetMetadata?.examTerm,
        customTotalMarks: presetMetadata?.totalMarks,
        customTime: presetMetadata?.timeAllowed,
      });

      setOcrRawText(extractedText);
      setOcrParsedPaper(parsed);
      setCurrentPaper(parsed); // Real-time global binding!
      setIsOcrProcessing(false);
      setOcrCompleted(true);
    }, 1200);
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

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Top Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onPrint={handlePrint}
        onExportDocx={handleExportDocx}
        onExportPdf={handleExportPdf}
        hasActivePaper={!!currentPaper}
        currentSubject={(activeTab === 'ocr' && ocrParsedPaper ? ocrParsedPaper.subject : currentPaper.subject)}
        currentGrade={(activeTab === 'ocr' && ocrParsedPaper ? ocrParsedPaper.gradeLevel : currentPaper.gradeLevel)}
        paperSize={(activeTab === 'ocr' && ocrParsedPaper ? ocrParsedPaper.paperSize : currentPaper.paperSize) || 'a4'}
        onPaperSizeChange={(size) => {
          if (activeTab === 'ocr') {
            setOcrParsedPaper((prev) => ({ ...prev, paperSize: size }));
          }
          setCurrentPaper((prev) => ({ ...prev, paperSize: size }));
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
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
                  Upload 4 to 10 textbook pages or chapter snapshots, specify question quantities, confirm weightage & rubric in the preliminary clarification step, and instantly generate a beautifully balanced academy examination paper.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => setIsClarificationOpen(true)}
                  className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <span>Review Blueprint & Generate</span>
                </button>
              </div>
            </div>

            {/* Step 1: Chapter Image Uploader */}
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
              canGenerate={chapterPages.length > 0}
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
            <span>• Assessment & Exam System</span>
          </div>
          <p className="text-slate-400">
            Optimized for Agentic IDEs (Google Antigravity, v0, Bolt.new) • Built with React, TypeScript & KaTeX
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
