import React, { useState } from 'react';
import { 
  Edit3, 
  ArrowRight, 
  Layers, 
  Eye, 
  PlusCircle, 
  RotateCcw,
  ChevronDown
} from 'lucide-react';
import type { 
  ExamPaper, 
  Question,
  PaperSize 
} from '../../types/exam';
import { AcademyLetterhead } from '../AcademyLetterhead';
import { QuestionItem } from '../studio/QuestionItem';
import { QuestionEditorModal } from '../studio/QuestionEditorModal';
import { PaperStudioHeader } from '../studio/PaperStudioHeader';
import { StudioSettingsPanel } from '../studio/StudioSettingsPanel';

interface OcrExtractedEditorProps {
  rawText: string;
  setRawText: (text: string) => void;
  parsedPaper: ExamPaper;
  setParsedPaper: React.Dispatch<React.SetStateAction<ExamPaper>>;
  onApplyToStudio: (paper: ExamPaper) => void;
  onReset: () => void;
  onPrint?: () => void;
  onExportDocx?: () => void;
  onExportPdf?: () => void;
}

export const OcrExtractedEditor: React.FC<OcrExtractedEditorProps> = ({
  rawText,
  setRawText,
  parsedPaper,
  setParsedPaper,
  onApplyToStudio,
  onReset,
  onPrint,
  onExportDocx,
  onExportPdf,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'preview' | 'parsed' | 'raw'>('preview');
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Directly bind to parsedPaper and setParsedPaper from parent for single source of truth
  const paper = parsedPaper;
  const updatePaper = setParsedPaper;

  const isUrdu = paper.language === 'ur';
  const isArabic = paper.language === 'ar';
  const isUrduOrArabic = isUrdu || isArabic;

  const handleOpenAddQuestion = () => {
    setEditingQuestion(null);
    setIsEditorOpen(true);
  };

  const handleOpenEditQuestion = (q: Question) => {
    setEditingQuestion(q);
    setIsEditorOpen(true);
  };

  const handleDeleteQuestion = (questionId: string) => {
    updatePaper((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) => ({
        ...sec,
        questions: sec.questions.filter((q) => q.id !== questionId),
      })),
    }));
  };

  const handleDuplicateQuestion = (q: Question) => {
    const duplicated: Question = {
      ...q,
      id: `q-dup-${Date.now()}`,
      questionNumber: q.questionNumber + 1,
    };

    updatePaper((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) => {
        const found = sec.questions.some((item) => item.id === q.id);
        if (found) {
          return {
            ...sec,
            questions: [...sec.questions, duplicated],
          };
        }
        return sec;
      }),
    }));
  };

  const handleSaveQuestion = (savedQ: Question, targetSectionId?: string) => {
    updatePaper((prev) => {
      let updatedSections = [...prev.sections];
      const isExisting = updatedSections.some((sec) =>
        sec.questions.some((q) => q.id === savedQ.id)
      );

      if (isExisting) {
        updatedSections = updatedSections.map((sec) => ({
          ...sec,
          questions: sec.questions.map((q) => (q.id === savedQ.id ? savedQ : q)),
        }));
      } else {
        const targetSec = updatedSections.find((s) => s.id === targetSectionId) || updatedSections[0];
        if (targetSec) {
          targetSec.questions.push({
            ...savedQ,
            questionNumber: targetSec.questions.length + 1,
          });
        }
      }

      return {
        ...prev,
        sections: updatedSections,
      };
    });
  };

  const handleMoveQuestion = (sectionId: string, qIndex: number, direction: 'up' | 'down') => {
    updatePaper((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        const newQs = [...sec.questions];
        const targetIndex = direction === 'up' ? qIndex - 1 : qIndex + 1;
        if (targetIndex < 0 || targetIndex >= newQs.length) return sec;

        const temp = newQs[qIndex];
        newQs[qIndex] = newQs[targetIndex];
        newQs[targetIndex] = temp;

        newQs.forEach((q, idx) => {
          q.questionNumber = idx + 1;
        });

        return { ...sec, questions: newQs };
      }),
    }));
  };

  return (
    <div className="space-y-6 mt-6 pb-12">
      {/* 1. TOP DYNAMIC HEADER TITLE BANNER: Real-time dynamic updates whenever teacher selects a different subject or class */}
      <PaperStudioHeader
        paper={paper}
        onPrint={onPrint}
        onExportDocx={onExportDocx}
        onExportPdf={onExportPdf}
        badgeLabel="OCR & Formatting Studio"
      />

      {/* 2. Studio Action Navigation Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 no-print">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Sub-Tab Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setActiveSubTab('preview')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold transition-all ${
                activeSubTab === 'preview'
                  ? 'bg-[#0F284E] text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>Live Paper Sheet Preview</span>
            </button>

            <button
              onClick={() => setActiveSubTab('parsed')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold transition-all ${
                activeSubTab === 'parsed'
                  ? 'bg-[#0F284E] text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              <span>Question Blocks ({paper.sections.reduce((acc, s) => acc + s.questions.length, 0)})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('raw')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold transition-all ${
                activeSubTab === 'raw'
                  ? 'bg-[#0F284E] text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-400" />
              <span>Raw OCR Text</span>
            </button>
          </div>

          {/* Quick Toolbar Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Paper Size Selection Dropdown Menu */}
            <div className="flex items-center bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 shadow-2xs hover:border-emerald-500 transition-all">
              <label htmlFor="ocr-toolbar-paper-size" className="text-[11px] font-bold text-slate-600 flex items-center gap-1 mr-1.5 cursor-pointer">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Size:</span>
              </label>
              <div className="relative flex items-center">
                <select
                  id="ocr-toolbar-paper-size"
                  value={paper.paperSize || 'a4'}
                  onChange={(e) =>
                    updatePaper((prev) => ({
                      ...prev,
                      paperSize: e.target.value as PaperSize,
                    }))
                  }
                  title="Select preferred paper size for printing and PDF generation"
                  className="appearance-none bg-white text-slate-800 font-extrabold text-xs py-1 pl-2 pr-6 border border-slate-200 rounded-md focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <option value="a4">A4 (210 × 297 mm)</option>
                  <option value="legal">Legal (8.5 × 14.0 in)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-1.5 pointer-events-none" />
              </div>
            </div>

            <button
              onClick={handleOpenAddQuestion}
              className="flex items-center gap-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-sm transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Question</span>
            </button>

            <button
              onClick={onReset}
              className="flex items-center gap-1 px-3 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Scan Another Note</span>
            </button>

            <button
              onClick={() => onApplyToStudio(paper)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0F284E] hover:bg-slate-800 text-white font-bold rounded-lg text-xs shadow-md transition-all"
            >
              <span>Open in Paper Studio</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Viewport Content based on active sub-tab */}
      <div>
        {/* SUB-TAB 1: LIVE PRINTABLE PAPER SHEET PREVIEW */}
        {activeSubTab === 'preview' && (
          <div className="animate-in fade-in duration-150">
            {/* Dynamic print @page style tag guaranteeing browser print dialog defaults to selected paper size */}
            <style>{`
              @media print {
                @page {
                  size: ${paper.paperSize === 'legal' ? 'legal portrait' : 'A4 portrait'} !important;
                  margin: 0 !important;
                }
              }
            `}</style>

            <div
              id="achievers-printable-paper"
              data-paper-size={paper.paperSize || 'a4'}
              className={`relative bg-white text-slate-900 rounded-xl shadow-lg border border-slate-300 mx-auto print-container transition-all ${
                paper.paperSize === 'legal' ? 'paper-sheet-legal' : 'paper-sheet-a4'
              }`}
            >
              {/* Subtle Watermark (Achievers Emblem) */}
              {paper.showWatermark && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035] select-none z-0 overflow-hidden">
                  <svg viewBox="0 0 100 100" className="w-[450px] h-[450px] text-slate-950 fill-current">
                    <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="4" />
                    <path d="M50 14 L59 34 L81 34 L63 47 L70 69 L50 56 L30 69 L37 47 L19 34 L41 34 Z" fill="currentColor" />
                    <path d="M22 66 C32 60 44 61 50 66 C56 61 68 60 78 66 L78 40 C68 34 56 35 50 40 C44 35 32 34 22 40 Z" fill="#FFFFFF" stroke="currentColor" strokeWidth="3" />
                    <circle cx="50" cy="28" r="8" fill="currentColor" />
                  </svg>
                </div>
              )}

              <div className="relative z-10">
                {/* Academy Letterhead (Dynamically displays subject, grade, exam term, marks) */}
                <AcademyLetterhead paper={paper} isUrduOrArabic={isUrduOrArabic} />

                {/* Sections & Questions */}
                <div className="space-y-6 mt-4">
                  {paper.sections.map((section, sIdx) => (
                    <div key={section.id || sIdx} className="space-y-2">
                      {/* Section Title Header */}
                      <div
                        className="border-b-2 border-slate-800 pb-1 flex items-center justify-between"
                        dir={isUrduOrArabic ? 'rtl' : 'ltr'}
                      >
                        <div>
                          <h2
                            className={`text-sm sm:text-base font-black text-[#0F284E] uppercase tracking-wide ${
                              isUrduOrArabic ? 'font-urdu' : ''
                            }`}
                          >
                            {section.sectionTitle}
                          </h2>
                          {section.instructions && (
                            <p className={`text-[11px] text-slate-600 italic ${isUrduOrArabic ? 'font-urdu' : ''}`}>
                              {section.instructions}
                            </p>
                          )}
                        </div>

                        <div className="text-right flex-shrink-0">
                          <span className="text-xs font-bold text-slate-900 border border-slate-400 rounded px-2 py-0.5 bg-slate-50">
                            {section.totalMarks} Marks
                          </span>
                        </div>
                      </div>

                      {/* Question Grid / List (Single or Two-Column) */}
                      <div
                        className={`${
                          paper.layoutColumns === 2
                            ? 'grid grid-cols-1 md:grid-cols-2 print-grid-2 gap-x-6 gap-y-3'
                            : 'space-y-2'
                        }`}
                      >
                        {section.questions.map((question, qIdx) => (
                          <QuestionItem
                            key={question.id || qIdx}
                            question={question}
                            paperLanguage={paper.language}
                            fontSize={paper.fontSize}
                            index={qIdx}
                            onEdit={handleOpenEditQuestion}
                            onDelete={handleDeleteQuestion}
                            onDuplicate={handleDuplicateQuestion}
                            onMoveUp={qIdx > 0 ? () => handleMoveQuestion(section.id, qIdx, 'up') : undefined}
                            onMoveDown={
                              qIdx < section.questions.length - 1
                                ? () => handleMoveQuestion(section.id, qIdx, 'down')
                                : undefined
                            }
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Paper End Mark & Format Indicator */}
                <div className="mt-10 pt-4 border-t border-slate-300 flex flex-col sm:flex-row items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-widest select-none gap-2">
                  <span>*** END OF EXAMINATION PAPER ***</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-300 font-bold">
                    THE ACHIEVERS ISLAMIC ACADEMY • {paper.paperSize === 'legal' ? 'LEGAL SHEET (8.5 × 14.0 IN)' : 'A4 SHEET (210 × 297 MM)'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUB-TAB 2: STRUCTURED QUESTION BLOCKS */}
        {activeSubTab === 'parsed' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {paper.sections.map((section, sIdx) => (
              <div key={section.id || sIdx} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <div className="bg-slate-100/90 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h4 className={`font-bold text-sm text-[#0F284E] ${isUrduOrArabic ? 'font-urdu' : ''}`}>
                      {section.sectionTitle}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{section.instructions}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      {section.questions.length} Questions ({section.totalMarks} Marks)
                    </span>
                  </div>
                </div>

                <div className="divide-y divide-slate-100 p-2">
                  {section.questions.map((q, qIdx) => (
                    <QuestionItem
                      key={q.id || qIdx}
                      question={q}
                      paperLanguage={paper.language}
                      fontSize={paper.fontSize}
                      index={qIdx}
                      onEdit={handleOpenEditQuestion}
                      onDelete={handleDeleteQuestion}
                      onDuplicate={handleDuplicateQuestion}
                      onMoveUp={qIdx > 0 ? () => handleMoveQuestion(section.id, qIdx, 'up') : undefined}
                      onMoveDown={
                        qIdx < section.questions.length - 1
                          ? () => handleMoveQuestion(section.id, qIdx, 'down')
                          : undefined
                      }
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SUB-TAB 3: RAW OCR OUTPUT TEXT */}
        {activeSubTab === 'raw' && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm animate-in fade-in duration-150">
            <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-700">
                Direct Scanned OCR Text Editor (Changes can be re-parsed or adjusted freely):
              </span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {rawText.length} characters
              </span>
            </div>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              rows={16}
              className="w-full p-4 font-mono text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* 4. BOTTOM SETTINGS & SELECTOR PANEL:
          Ensures that whenever a teacher selects a different subject or class from this bottom panel,
          the top header title of the paper studio dynamically updates in real-time.
      */}
      <StudioSettingsPanel
        paper={paper}
        setPaper={updatePaper}
        title="OCR Studio Settings & Curriculum Selector"
        onSubjectChange={(_newSubject, templateSample) => {
          if (templateSample) {
            setRawText(templateSample);
          }
        }}
      />

      {/* Question Editor Modal */}
      <QuestionEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        question={editingQuestion}
        sections={paper.sections}
        onSave={handleSaveQuestion}
      />
    </div>
  );
};
