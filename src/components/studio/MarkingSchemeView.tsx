import React from 'react';
import { 
  CheckCircle2, 
  Printer, 
  Award
} from 'lucide-react';
import type { ExamPaper } from '../../types/exam';
import { MathRenderer } from '../MathRenderer';

interface MarkingSchemeViewProps {
  paper: ExamPaper;
  onPrint: () => void;
}

export const MarkingSchemeView: React.FC<MarkingSchemeViewProps> = ({
  paper,
  onPrint,
}) => {
  const isUrdu = paper.language === 'ur';
  const isArabic = paper.language === 'ar';
  const isUrduOrArabic = isUrdu || isArabic;
  const paperSize = paper.paperSize || 'a4';

  return (
    <>
      <style>{`
        @media print {
          @page {
            size: ${paperSize === 'legal' ? 'legal portrait' : 'A4 portrait'} !important;
            margin: 0 !important;
          }
        }
      `}</style>

      <div
        id="achievers-printable-marking-scheme"
        data-paper-size={paperSize}
        className={`bg-white rounded-xl shadow-lg border border-slate-300 mx-auto print-container transition-all ${
          paperSize === 'legal' ? 'paper-sheet-legal' : 'paper-sheet-a4'
        }`}
      >
        {/* Header */}
        <div className="border-b-2 border-emerald-600 pb-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-600 text-white font-black text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Official Marking Key
                </span>
                <span className="text-xs font-semibold text-slate-500">Teacher Confidential</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0F284E] mt-1">
                THE ACHIEVERS ISLAMIC ACADEMY
              </h2>
              <p className="text-xs font-bold text-emerald-800">
                Exam Marking Scheme & Solution Key • {paper.subject} ({paper.gradeLevel}) • {paperSize === 'legal' ? 'Legal Sheet' : 'A4 Sheet'}
              </p>
            </div>

            <div className="no-print flex items-center gap-2">
              <button
                onClick={onPrint}
                title={`Print Marking Key formatted for ${paperSize === 'legal' ? 'Legal (8.5x14")' : 'A4 (210x297mm)'}`}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F284E] hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
              >
                <Printer className="w-3.5 h-3.5 text-emerald-400" />
                <span>Print Key ({paperSize.toUpperCase()})</span>
              </button>
            </div>
          </div>

        {/* Info Grid */}
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 bg-emerald-50/60 border border-emerald-200 rounded-lg p-2.5 text-xs">
          <div>
            <span className="text-slate-500 font-medium">Exam Term:</span>
            <span className="font-bold text-slate-900 ml-1">{paper.examTerm}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Total Marks:</span>
            <span className="font-bold text-emerald-800 ml-1">{paper.totalMarks}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Time Allowed:</span>
            <span className="font-semibold text-slate-800 ml-1">{paper.timeAllowed}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Date:</span>
            <span className="font-semibold text-slate-800 ml-1">{paper.date}</span>
          </div>
        </div>
      </div>

      {/* Sections and Answers */}
      <div className="space-y-8">
        {paper.sections.map((section, sIdx) => (
          <div key={section.id || sIdx} className="space-y-3">
            <div className="bg-slate-100 px-4 py-2 rounded-lg border-l-4 border-emerald-600 flex items-center justify-between">
              <h3 className={`font-bold text-sm text-[#0F284E] ${isUrduOrArabic ? 'font-urdu' : ''}`}>
                {section.sectionTitle}
              </h3>
              <span className="text-xs font-bold text-emerald-800">
                Total: {section.totalMarks} Marks
              </span>
            </div>

            <div className="space-y-4">
              {section.questions.map((q, qIdx) => {
                const qIsUrdu = q.language === 'ur' || isUrdu;
                const qFontClass = qIsUrdu ? 'font-urdu' : q.language === 'ar' ? 'font-arabic' : '';

                return (
                  <div
                    key={q.id || qIdx}
                    className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white transition-all question-item"
                    dir={qIsUrdu ? 'rtl' : 'ltr'}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className="font-bold text-xs text-slate-800">
                            {qIsUrdu ? `سوال ${q.questionNumber || qIdx + 1}:` : `Q${q.questionNumber || qIdx + 1}.`}
                          </span>
                          <span className={`text-xs text-slate-700 font-medium ${qFontClass}`}>
                            <MathRenderer content={q.text} isUrduOrArabic={qIsUrdu} />
                          </span>
                        </div>

                        {/* MCQ Correct Answer Highlight */}
                        {q.type === 'mcq' && (
                          <div className="mt-2 p-2 bg-emerald-50 border border-emerald-200 rounded text-xs">
                            <span className="font-bold text-emerald-900 mr-2 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
                              <span>Correct Option:</span>
                            </span>
                            <span className={`font-bold text-emerald-800 ${qFontClass}`}>
                              {q.blankAnswer || q.options?.[0]?.text || 'Option (A)'}
                            </span>
                          </div>
                        )}

                        {/* Fill in the blank answer */}
                        {q.type === 'fill_in_the_blank' && (
                          <div className="mt-2 p-2 bg-emerald-50 border border-emerald-200 rounded text-xs">
                            <span className="font-bold text-emerald-900 mr-2">Blank Key:</span>
                            <span className={`font-bold text-emerald-800 ${qFontClass}`}>
                              {q.blankAnswer || 'Correct Word'}
                            </span>
                          </div>
                        )}

                        {/* Vocabulary / Column Match Answer */}
                        {q.type === 'vocabulary' && q.columnMatchLeft && q.columnMatchRight && (
                          <div className="mt-2 p-2 bg-emerald-50 border border-emerald-200 rounded text-xs">
                            <span className="font-bold text-emerald-900 block mb-1">Paired Key:</span>
                            <div className="grid grid-cols-2 gap-2">
                              {q.columnMatchLeft.map((item, i) => (
                                <div key={i} className="text-slate-800">
                                  <span className="font-semibold">{item}</span> ➔ {q.columnMatchRight?.[i]}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Model Solution / Marking Scheme Rubric */}
                        {(q.type === 'short' || q.type === 'long') && (
                          <div className="mt-2 p-3 bg-amber-50/70 border border-amber-200 rounded text-xs">
                            <div className="font-bold text-amber-950 mb-1 flex items-center gap-1.5">
                              <Award className="w-3.5 h-3.5 text-amber-700" />
                              <span>Model Answer & Rubric:</span>
                            </div>
                            <div className={`text-slate-800 leading-relaxed ${qFontClass}`}>
                              <MathRenderer
                                content={
                                  q.sampleAnswer ||
                                  'Award full marks for relevant Quranic references, accurate definitions, correct formula application, and neat presentation.'
                                }
                                isUrduOrArabic={qIsUrdu}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
                          {q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-300 mt-8 pt-4 text-center text-xs text-slate-500">
        Confidential Examination Key • For Faculty & Invigilator Use Only • The Achievers Islamic Academy
      </div>
    </div>
    </>
  );
};
