import React, { useState } from 'react';
import type { ExamPaper, Question } from '../../types/exam';
import { AcademyLetterhead } from '../AcademyLetterhead';
import { PaperToolbar } from './PaperToolbar';
import { QuestionItem } from './QuestionItem';
import { QuestionEditorModal } from './QuestionEditorModal';
import { MarkingSchemeView } from './MarkingSchemeView';
import { PaperStudioHeader } from './PaperStudioHeader';
import { StudioSettingsPanel } from './StudioSettingsPanel';

interface PaperStudioProps {
  paper: ExamPaper;
  setPaper: React.Dispatch<React.SetStateAction<ExamPaper>>;
  onPrint: () => void;
  onExportDocx: () => void;
  onExportPdf: () => void;
}

export const PaperStudio: React.FC<PaperStudioProps> = ({
  paper,
  setPaper,
  onPrint,
  onExportDocx,
  onExportPdf,
}) => {
  const [studioMode, setStudioMode] = useState<'paper' | 'marking_scheme'>('paper');
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

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
    setPaper((prev) => ({
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

    setPaper((prev) => ({
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
    setPaper((prev) => {
      let updatedSections = [...prev.sections];
      const isExisting = updatedSections.some((sec) =>
        sec.questions.some((q) => q.id === savedQ.id)
      );

      if (isExisting) {
        // Update existing question
        updatedSections = updatedSections.map((sec) => ({
          ...sec,
          questions: sec.questions.map((q) => (q.id === savedQ.id ? savedQ : q)),
        }));
      } else {
        // Add new question into target section or first section
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
    setPaper((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        const newQs = [...sec.questions];
        const targetIndex = direction === 'up' ? qIndex - 1 : qIndex + 1;
        if (targetIndex < 0 || targetIndex >= newQs.length) return sec;

        const temp = newQs[qIndex];
        newQs[qIndex] = newQs[targetIndex];
        newQs[targetIndex] = temp;

        // Reassign question numbers
        newQs.forEach((q, idx) => {
          q.questionNumber = idx + 1;
        });

        return { ...sec, questions: newQs };
      }),
    }));
  };

  return (
    <div className="max-w-6xl mx-auto pb-16">
      {/* Top Dynamic Header Title Banner */}
      <PaperStudioHeader
        paper={paper}
        onPrint={onPrint}
        onExportDocx={onExportDocx}
        onExportPdf={onExportPdf}
        badgeLabel="Paper Studio Mode"
      />

      {/* Top Toolbar */}
      <PaperToolbar
        paper={paper}
        setPaper={setPaper}
        studioMode={studioMode}
        setStudioMode={setStudioMode}
        onAddQuestion={handleOpenAddQuestion}
        onPrint={onPrint}
        onExportDocx={onExportDocx}
        onExportPdf={onExportPdf}
      />

      {/* Main View: Either Student Question Paper OR Teacher Marking Scheme */}
      {studioMode === 'marking_scheme' ? (
        <MarkingSchemeView paper={paper} onPrint={onPrint} />
      ) : (
        /* Student Examination Paper Sheet */
        <>
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
              {/* Academy Letterhead */}
              <AcademyLetterhead paper={paper} isUrduOrArabic={isUrduOrArabic} />

              {/* Sections & Questions */}
              <div className="space-y-6 mt-4">
                {paper.sections.map((section, sIdx) => (
                  <div key={section.id || sIdx} className="space-y-2">
                    {/* Section Title Header */}
                    <div
                      className="border-b-2 border-slate-800 pb-1 flex items-center justify-between section-header-print"
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
        </>
      )}

      {/* Bottom Settings & Curriculum Selector Panel */}
      <StudioSettingsPanel
        paper={paper}
        setPaper={setPaper}
        title="Curriculum Settings & Paper Metadata Selector"
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
