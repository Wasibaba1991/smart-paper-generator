import React, { useState } from 'react';
import { 
  Printer, 
  Download, 
  Pencil, 
  Palette, 
  Shapes, 
  BookOpen, 
  Edit3
} from 'lucide-react';
import type { ExamPaper, GradeLevel, Subject, Question } from '../../types/exam';
import { AcademyLetterhead } from '../AcademyLetterhead';
import { QuestionItem } from '../studio/QuestionItem';
import { getCurriculumTemplateForSubject } from '../../data/subjectCurriculumTemplates';

interface PrePrimaryModeViewProps {
  paper: ExamPaper;
  setPaper: React.Dispatch<React.SetStateAction<ExamPaper>>;
  onPrint: () => void;
  onExportDocx: () => void;
  onExportPdf: () => void;
  onOpenInStudio: () => void;
}

export const PrePrimaryModeView: React.FC<PrePrimaryModeViewProps> = ({
  paper,
  setPaper,
  onPrint,
  onExportDocx,
  onExportPdf,
  onOpenInStudio,
}) => {
  const [selectedTemplateSubject, setSelectedTemplateSubject] = useState<Subject>(
    paper.subject.startsWith('Pre-Primary') ? paper.subject : 'Pre-Primary English & Phonics'
  );

  const isUrdu = paper.language === 'ur';
  const isArabic = paper.language === 'ar';
  const isUrduOrArabic = isUrdu || isArabic;

  // Load a Pre-Primary Curriculum Template
  const handleLoadCurriculumTemplate = (sub: Subject, targetGrade?: GradeLevel) => {
    setSelectedTemplateSubject(sub);
    const gradeToUse = targetGrade || (paper.gradeLevel.includes('Nursery') ? 'Playgroup / Nursery' : 'Kindergarten (KG / Prep)');
    const template = getCurriculumTemplateForSubject(sub, gradeToUse);

    setPaper((prev) => ({
      ...prev,
      subject: sub,
      gradeLevel: gradeToUse,
      language: template.language,
      totalMarks: template.totalMarks,
      timeAllowed: template.timeAllowed,
      sections: template.sections,
      isPrePrimary: true,
      fontSize: 'pre_primary',
      boardFormat: 'pre_primary',
      paperSize: 'a4', // Enforce A4 strictly
    }));
  };

  // Switch Grade and reload curriculum template for the currently selected subject
  const handleGradeChange = (grade: GradeLevel) => {
    const template = getCurriculumTemplateForSubject(selectedTemplateSubject, grade);
    setPaper((prev) => ({
      ...prev,
      gradeLevel: grade,
      isPrePrimary: true,
      fontSize: 'pre_primary',
      boardFormat: 'pre_primary',
      // Reload template to match the selected grade
      language: template.language,
      totalMarks: template.totalMarks,
      timeAllowed: template.timeAllowed,
      sections: template.sections,
    }));
  };

  // Quick Action: Add Tracing Question
  const handleAddTracingQuestion = () => {
    const newQ: Question = {
      id: `trace-${Date.now()}`,
      type: 'tracing',
      questionNumber: (paper.sections[0]?.questions.length || 0) + 1,
      text: isUrduOrArabic 
        ? 'دیے گئے حروف پر پنسل پھیریں اور نقطے ملائیں:' 
        : 'Trace the letters neatly on the four guidelines:',
      tracingLetters: isUrduOrArabic ? ['ا', 'ب', 'پ', 'ت'] : ['A a', 'B b', 'C c', 'D d'],
      tracingGuideText: isUrduOrArabic ? 'دائیں سے بائیں خوبصورت انداز میں لکھیں۔' : 'Start at the top line and follow the guidelines.',
      marks: 6,
      language: paper.language,
    };

    setPaper((prev) => {
      const updated = [...prev.sections];
      if (updated.length === 0) {
        updated.push({
          id: `sec-${Date.now()}`,
          sectionTitle: isUrduOrArabic ? 'حصہ اول: حروفیات کی مشق' : 'Section A: Letter Practice',
          totalMarks: 6,
          questions: [newQ],
        });
      } else {
        updated[0] = {
          ...updated[0],
          questions: [...updated[0].questions, newQ],
        };
      }
      return { ...prev, sections: updated };
    });
  };

  // Quick Action: Add Image Matching Task
  const handleAddMatchingQuestion = () => {
    const newQ: Question = {
      id: `match-${Date.now()}`,
      type: 'image_matching',
      questionNumber: (paper.sections[0]?.questions.length || 0) + 1,
      text: isUrduOrArabic 
        ? 'تصویر دیکھ کر درست حرف کے ساتھ لکیر کھینچ کر ملائیں:' 
        : 'Draw lines to match each picture with its beginning sound:',
      visualPairs: isUrduOrArabic ? [
        { id: 'vp-u1', leftIcon: '🍎', leftText: 'سیب', rightText: 'حرف س' },
        { id: 'vp-u2', leftIcon: '🦆', leftText: 'بطخ', rightText: 'حرف ب' },
        { id: 'vp-u3', leftIcon: '🦋', leftText: 'تتلی', rightText: 'حرف ت' },
      ] : [
        { id: 'vp-e1', leftIcon: '🍎', leftText: 'Apple', rightText: 'Letter A', rightIcon: '🅰️' },
        { id: 'vp-e2', leftIcon: '🚗', leftText: 'Car', rightText: 'Letter C', rightIcon: '🅲' },
        { id: 'vp-e3', leftIcon: '⭐', leftText: 'Star', rightText: 'Letter S', rightIcon: '🆂' },
      ],
      marks: 6,
      language: paper.language,
    };

    setPaper((prev) => {
      const updated = [...prev.sections];
      const targetSec = updated[1] || updated[0];
      if (targetSec) {
        targetSec.questions.push(newQ);
      }
      return { ...prev, sections: updated };
    });
  };

  // Quick Action: Add Coloring Task
  const handleAddColoringQuestion = (outline: 'apple' | 'crescent' | 'star' | 'flower' | 'mosque') => {
    const newQ: Question = {
      id: `color-${Date.now()}`,
      type: 'coloring_drawing',
      questionNumber: (paper.sections[0]?.questions.length || 0) + 1,
      text: isUrduOrArabic ? 'خوبصورت رنگ بھریں:' : 'Color the outline neatly inside the lines:',
      drawingOutlineType: outline,
      drawingInstruction: outline === 'apple' ? 'Color the apple red and leaf green.' : 'Color with bright crayons inside the lines.',
      marks: 5,
      language: paper.language,
    };

    setPaper((prev) => {
      const updated = [...prev.sections];
      const targetSec = updated[updated.length - 1] || updated[0];
      if (targetSec) {
        targetSec.questions.push(newQ);
      }
      return { ...prev, sections: updated };
    });
  };

  // Quick Action: Add Count & Circle Task
  const handleAddCountQuestion = () => {
    const newQ: Question = {
      id: `count-${Date.now()}`,
      type: 'count_and_circle',
      questionNumber: (paper.sections[0]?.questions.length || 0) + 1,
      text: isUrduOrArabic ? 'اشیاء گنیں اور درست ہندسے پر دائرہ لگائیں:' : 'Count the objects and circle the matching number:',
      countItemsList: [
        { icon: '🍎', count: 3, label: 'Apples' },
        { icon: '⭐', count: 4, label: 'Stars' },
        { icon: '🎈', count: 5, label: 'Balloons' },
      ],
      marks: 6,
      language: paper.language,
    };

    setPaper((prev) => {
      const updated = [...prev.sections];
      const targetSec = updated[0];
      if (targetSec) {
        targetSec.questions.push(newQ);
      }
      return { ...prev, sections: updated };
    });
  };

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-6">
      {/* 1. Playful Pre-Primary Mode Banner */}
      <div className="bg-gradient-to-r from-[#0F284E] via-[#1E3A8A] to-[#047857] rounded-3xl p-6 sm:p-8 text-white shadow-xl border-2 border-emerald-400/30 no-print">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                <span>🌟</span>
                <span>Pre-Primary / Nursery & KG Mode</span>
              </span>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                A4 Print & Worksheet Optimized
              </span>

              <span className="text-xs text-slate-300 font-semibold hidden sm:inline">
                The Achievers Islamic Academy
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                Early Childhood Assessment Studio
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 mt-2 max-w-3xl leading-relaxed">
                Generate and customize rich, kid-friendly examination sheets for Playgroup, Nursery, and Kindergarten. 
                Includes dotted alphabet & number tracing on guidelines, visual image-matching, object counting, and drawing & coloring task boxes.
              </p>
            </div>

            {/* Quick Class Selection Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-bold text-amber-300">Target Grade:</span>
              {[
                'Playgroup / Nursery',
                'Kindergarten (KG / Prep)',
                'Kindergarten (KG-1 / Prep)',
                'Kindergarten (KG-2 / Advance)'
              ].map((g) => (
                <button
                  key={g}
                  onClick={() => handleGradeChange(g as GradeLevel)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    paper.gradeLevel === g
                      ? 'bg-amber-400 text-slate-950 shadow-md scale-102'
                      : 'bg-white/10 text-slate-200 hover:bg-white/20'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 flex-shrink-0">
            <button
              onClick={onPrint}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-white hover:bg-slate-100 text-[#0F284E] font-black rounded-xl text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-emerald-600" />
              <span>Print A4 Worksheet</span>
            </button>

            <button
              onClick={onExportPdf}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={onOpenInStudio}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-bold rounded-xl text-xs border border-white/20 transition-all cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-300" />
              <span>Open in Full Studio</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. One-Click Pre-Primary Curriculum Subject Selectors */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 no-print space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-base font-extrabold text-[#0F284E] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Pre-Primary Curriculum Worksheets (One-Click Load)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any curriculum below to instantly load an authentic, age-appropriate exam paper.
            </p>
          </div>

          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            Current: {paper.subject}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            {
              id: 'Pre-Primary English & Phonics',
              icon: '🔤',
              title: 'English & Phonics',
              desc: 'Tracing A-D, sound match, apple coloring',
              grade: 'Kindergarten (KG / Prep)',
              color: 'hover:border-blue-500 hover:bg-blue-50/50',
            },
            {
              id: 'Pre-Primary Urdu (حروفیات و تصویری پہچان)',
              icon: '📖',
              title: 'اردو حروفیات و پہچان',
              desc: 'حروف پنسل پھیریں، تصویری جوڑ، ہلال رنگ',
              grade: 'Playgroup / Nursery',
              color: 'hover:border-emerald-500 hover:bg-emerald-50/50',
            },
            {
              id: 'Pre-Primary Math & Numbers',
              icon: '🔢',
              title: 'Math & Numbers',
              desc: 'Trace 1 to 5, count & circle, shape match',
              grade: 'Kindergarten (KG-1 / Prep)',
              color: 'hover:border-amber-500 hover:bg-amber-50/50',
            },
            {
              id: 'Pre-Primary Islamic & General Knowledge',
              icon: '🌙',
              title: 'Islamic & Manners',
              desc: 'Dua match, sacred word trace, mosque color',
              grade: 'Kindergarten (KG / Prep)',
              color: 'hover:border-teal-500 hover:bg-teal-50/50',
            },
            {
              id: 'Pre-Primary Art, Drawing & Coloring',
              icon: '🎨',
              title: 'Art & Drawing',
              desc: 'Sailboat & fruit tree coloring, free draw',
              grade: 'Playgroup / Nursery',
              color: 'hover:border-rose-500 hover:bg-rose-50/50',
            },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleLoadCurriculumTemplate(item.id as Subject, item.grade as GradeLevel)}
              className={`text-left p-3.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                paper.subject === item.id
                  ? 'border-emerald-600 bg-emerald-50/70 shadow-sm'
                  : `border-slate-200 bg-slate-50/40 ${item.color}`
              }`}
            >
              <div>
                <span className="text-2xl mb-1 block">{item.icon}</span>
                <span className="font-extrabold text-xs text-slate-900 block leading-tight">
                  {item.title}
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block leading-normal line-clamp-2">
                  {item.desc}
                </span>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-bold text-slate-500">
                <span>{item.grade.split(' ')[0]}</span>
                <span className="text-emerald-700">Load ➔</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Quick Visual Task Add Toolbar */}
      <div className="bg-gradient-to-r from-amber-50 via-emerald-50 to-sky-50 border border-slate-300 rounded-2xl p-4 no-print flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 font-black flex items-center justify-center text-sm shadow-xs">
            +
          </span>
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
              Quick Visual Question Inserter
            </h3>
            <p className="text-[11px] text-slate-600">
              Add early-childhood question formats directly onto the active paper:
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleAddTracingQuestion}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:border-emerald-600 text-slate-800 rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer hover:bg-emerald-50"
          >
            <Pencil className="w-3.5 h-3.5 text-emerald-600" />
            <span>+ Handwriting Tracing</span>
          </button>

          <button
            onClick={handleAddMatchingQuestion}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:border-emerald-600 text-slate-800 rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer hover:bg-emerald-50"
          >
            <Shapes className="w-3.5 h-3.5 text-amber-600" />
            <span>+ Picture Matching</span>
          </button>

          <button
            onClick={handleAddCountQuestion}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:border-emerald-600 text-slate-800 rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer hover:bg-emerald-50"
          >
            <span>🔢</span>
            <span>+ Count & Circle</span>
          </button>

          <button
            onClick={() => handleAddColoringQuestion('apple')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:border-emerald-600 text-slate-800 rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer hover:bg-emerald-50"
          >
            <Palette className="w-3.5 h-3.5 text-rose-600" />
            <span>+ Coloring Box</span>
          </button>
        </div>
      </div>

      {/* 4. Live Standard A4 Printable Paper Container */}
      <div className="relative">
        {/* Dynamic @page style enforcing strict A4 dimensions */}
        <style>{`
          @media print {
            @page {
              size: A4 portrait !important;
              margin: 0 !important;
            }
            /* Strict A4 container sizing for Pre-Primary worksheets */
            #achievers-printable-paper {
              width: 210mm !important;
              min-height: 297mm !important;
              padding: 20mm !important;
              margin: 0 auto !important;
              box-shadow: none !important;
              border: none !important;
              border-radius: 0 !important;
              background-color: #ffffff !important;
            }
            /* Ensure pre-primary specific elements render with color in print */
            .handwriting-lines-4,
            .handwriting-lines-urdu,
            .trace-char-box {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
        `}</style>

        <div
          id="achievers-printable-paper"
          data-paper-size="a4"
          className="relative bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-300 mx-auto print-container transition-all paper-sheet-a4"
        >
          {/* Watermark (if enabled) */}
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
            {/* Kid-Friendly Pre-Primary Academy Letterhead */}
            <AcademyLetterhead paper={paper} isUrduOrArabic={isUrduOrArabic} />

            {/* Sections & Questions */}
            <div className="space-y-6 mt-4">
              {paper.sections.map((section, sIdx) => (
                <div key={section.id || sIdx} className="space-y-3">
                  {/* Section Title Header */}
                  <div
                    className="border-b-2 border-slate-800 pb-1.5 flex items-center justify-between section-header-print"
                    dir={isUrduOrArabic ? 'rtl' : 'ltr'}
                  >
                    <div>
                      <h2
                        className={`text-sm sm:text-base font-black text-[#0F284E] uppercase tracking-wide flex items-center gap-1.5 ${
                          isUrduOrArabic ? 'font-urdu' : 'font-kids'
                        }`}
                      >
                        <span>🌟</span>
                        <span>{section.sectionTitle}</span>
                      </h2>
                      {section.instructions && (
                        <p className={`text-xs text-slate-600 font-semibold italic ${isUrduOrArabic ? 'font-urdu' : ''}`}>
                          {section.instructions}
                        </p>
                      )}
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-black text-slate-900 border border-slate-400 rounded-lg px-2.5 py-0.5 bg-slate-50">
                        {section.totalMarks} Marks
                      </span>
                    </div>
                  </div>

                  {/* Question Grid */}
                  <div className="space-y-3">
                    {section.questions.map((question, qIdx) => (
                      <QuestionItem
                        key={question.id || qIdx}
                        question={question}
                        paperLanguage={paper.language}
                        fontSize="pre_primary"
                        index={qIdx}
                        onEdit={() => onOpenInStudio()}
                        onDelete={(qId) => {
                          setPaper((prev) => ({
                            ...prev,
                            sections: prev.sections.map((s) => ({
                              ...s,
                              questions: s.questions.filter((q) => q.id !== qId),
                            })),
                          }));
                        }}
                        onDuplicate={(q) => {
                          setPaper((prev) => ({
                            ...prev,
                            sections: prev.sections.map((s) => {
                              if (s.questions.some((item) => item.id === q.id)) {
                                return {
                                  ...s,
                                  questions: [
                                    ...s.questions,
                                    { ...q, id: `dup-${Date.now()}`, questionNumber: s.questions.length + 1 },
                                  ],
                                };
                              }
                              return s;
                            }),
                          }));
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Pre-Primary Worksheet Footer & Smiley Stamp */}
            <div className="mt-8 pt-4 border-t-2 border-slate-300 flex flex-col sm:flex-row items-center justify-between text-xs font-bold text-slate-600 gap-2">
              <div className="flex items-center gap-2">
                <span className="text-base">🌟</span>
                <span>THE ACHIEVERS ISLAMIC ACADEMY • EARLY YEARS WING</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300 font-bold">
                  ★ Good Effort / شاباش ★
                </span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-300">
                  STANDARD A4 (210 × 297 MM)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
