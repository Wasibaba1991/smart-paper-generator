import React from 'react';
import type { ExamPaper } from '../types/exam';

interface AcademyLetterheadProps {
  paper: ExamPaper;
  isUrduOrArabic?: boolean;
}

export const AcademyLetterhead: React.FC<AcademyLetterheadProps> = ({ 
  paper, 
  isUrduOrArabic = false 
}) => {
  const isBoardFormat = paper.boardFormat === 'bise' || paper.boardFormat === 'fbise';
  const boardTitle = paper.boardFormat === 'fbise' 
    ? 'FEDERAL BOARD (FBISE) PATTERN EXAMINATION' 
    : 'BISE BOARD PATTERN EXAMINATION';
  const paperCode = paper.paperCode || '5241';
  const examGroup = paper.examGroup || 'Group-I (Morning)';

  const isPrePrimary = 
    paper.isPrePrimary || 
    paper.boardFormat === 'pre_primary' || 
    paper.fontSize === 'pre_primary' ||
    paper.gradeLevel.includes('Nursery') ||
    paper.gradeLevel.includes('KG') ||
    paper.gradeLevel.includes('Kindergarten') ||
    paper.gradeLevel.includes('Playgroup') ||
    paper.subject.startsWith('Pre-Primary');

  // Find MCQs for bubble sheet if enabled
  const mcqQuestions = paper.sections.flatMap((s) => s.questions.filter((q) => q.type === 'mcq'));

  return (
    <div className="w-full border-b-2 border-slate-900 pb-3 mb-4 text-slate-900">
      {/* Calligraphic Bismillah */}
      {paper.showBismillah && (
        <div className="text-center mb-2">
          <p className="font-arabic text-xl md:text-2xl font-bold tracking-wide text-slate-800 leading-none select-none">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </div>
      )}

      {/* Main Board / Academy / Pre-Primary Header */}
      {isBoardFormat ? (
        /* =================== PAKISTANI BOARD (BISE/FBISE) HEADER =================== */
        <div className="border border-slate-900 p-2.5 rounded-lg bg-white mb-2">
          <div className="grid grid-cols-12 gap-2 items-center border-b border-slate-300 pb-2">
            {/* Left: Roll Number in Figures Boxes */}
            <div className="col-span-12 sm:col-span-3 text-left">
              <span className="block text-[10px] font-black uppercase tracking-wider text-slate-700 mb-1">
                Roll No (ہندسوں میں):
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <span
                    key={i}
                    className="w-5 h-6 sm:w-6 sm:h-7 border-2 border-slate-800 rounded flex items-center justify-center font-mono font-black text-xs text-slate-900 bg-slate-50"
                  >
                  </span>
                ))}
              </div>
            </div>

            {/* Center: Board & Academy Title */}
            <div className="col-span-12 sm:col-span-6 text-center">
              <span className="inline-block text-[10px] font-black tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-300 rounded px-2 py-0.5 uppercase mb-1">
                {boardTitle}
              </span>
              <h1 className="text-lg sm:text-xl font-black uppercase tracking-wider text-[#0F284E] leading-tight">
                {paper.academyName || 'THE ACHIEVERS ISLAMIC ACADEMY'}
              </h1>
              <div className="flex items-center justify-center gap-2 mt-1 text-xs font-bold text-slate-700">
                <span>{paper.examTerm}</span>
                <span>•</span>
                <span className="text-emerald-700">{paper.gradeLevel}</span>
              </div>
            </div>

            {/* Right: Paper Code & Group Box */}
            <div className="col-span-12 sm:col-span-3 text-right">
              <div className="inline-block border-2 border-slate-900 rounded p-1 bg-slate-50 min-w-[105px] text-center">
                <div className="text-[9px] font-bold text-slate-600 uppercase">Paper Code / کوڈ</div>
                <div className="text-sm font-mono font-black text-[#0F284E] tracking-wider">{paperCode}</div>
                <div className="text-[9px] font-semibold text-slate-700 border-t border-slate-300 mt-0.5 pt-0.5">
                  {examGroup}
                </div>
              </div>
            </div>
          </div>

          {/* Subject & Timing Bar */}
          <div className="flex flex-wrap items-center justify-between text-xs font-bold pt-2 px-1">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 uppercase tracking-wide text-[11px]">مضمون / Subject:</span>
              <span className={`font-black text-[#0F284E] uppercase text-sm ${isUrduOrArabic ? 'font-urdu' : ''}`}>
                {paper.subject}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span>وقت / Time: <strong className="text-slate-900">{paper.timeAllowed}</strong></span>
              <span>کل نمبر / Total Marks: <strong className="text-[#0F284E] text-sm font-black border border-slate-400 px-1.5 py-0.5 rounded bg-slate-100">{paper.totalMarks}</strong></span>
            </div>
          </div>
        </div>
      ) : isPrePrimary ? (
        /* =================== PRE-PRIMARY / NURSERY & KG HEADER =================== */
        <div className="border-2 border-slate-900 rounded-2xl p-3 sm:p-4 bg-white mb-2">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b-2 border-slate-300 pb-3">
            {/* Left Kid Friendly Academy Crest */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0F284E] via-[#1E3A8A] to-[#059669] border-2 border-amber-400 p-2 flex items-center justify-center shadow-xs">
                <span className="text-2xl select-none">🌟</span>
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-black tracking-widest uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300">
                    Pre-Primary & KG Wing
                  </span>
                  <span className="text-xs text-amber-500 font-black">★ ★ ★</span>
                </div>
                <h1 className="text-lg sm:text-xl font-black uppercase tracking-wider text-[#0F284E] leading-tight mt-0.5">
                  {paper.academyName || 'THE ACHIEVERS ISLAMIC ACADEMY'}
                </h1>
                <p className="text-[11px] font-bold text-slate-600">
                  Early Childhood Foundation Assessment • نرسری و کے جی ورک شیٹ
                </p>
              </div>
            </div>

            {/* Right Term & Subject Badge */}
            <div className="text-right flex flex-col items-center sm:items-end gap-1">
              <span className="inline-block bg-[#0F284E] text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                {paper.examTerm}
              </span>
              <div className="flex items-center gap-2 text-xs font-black text-slate-800">
                <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                  {paper.gradeLevel}
                </span>
                <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded border border-emerald-300">
                  {paper.totalMarks} Marks
                </span>
              </div>
            </div>
          </div>

          {/* Child-Friendly Student Details & Teacher Star Stamp Box */}
          <div className="mt-3 pt-2 grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs items-center">
            {/* Student Name with extra writing space */}
            <div className="sm:col-span-6 flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-200">
              <span className="font-black text-[#0F284E] text-xs sm:text-sm whitespace-nowrap">
                Student Name (بچے کا نام):
              </span>
              <span className="flex-1 border-b-2 border-dotted border-slate-800 h-6"></span>
            </div>

            {/* Class / Section & Roll No */}
            <div className="sm:col-span-3 flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-700 whitespace-nowrap">
                Roll No:
              </span>
              <span className="flex-1 border-b-2 border-dotted border-slate-800 h-6"></span>
            </div>

            {/* Teacher's Star Rating Box */}
            <div className="sm:col-span-3 bg-amber-50/80 border-2 border-amber-400 rounded-xl p-1.5 text-center shadow-2xs">
              <span className="block text-[10px] font-black uppercase text-amber-900">
                Teacher's Star / ستارہ
              </span>
              <div className="flex items-center justify-center gap-1 text-amber-500 text-sm select-none">
                <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
              </div>
            </div>
          </div>

          {/* Subject Banner */}
          <div className="mt-2 py-1 px-3 bg-gradient-to-r from-emerald-50 via-slate-50 to-amber-50 rounded-lg border border-slate-300 flex items-center justify-between text-xs font-black text-[#0F284E]">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 uppercase tracking-wider text-[11px]">مضمون / Subject:</span>
              <span className={`text-sm ${isUrduOrArabic ? 'font-urdu' : ''}`}>
                {paper.subject}
              </span>
            </div>
            <div className="flex items-center gap-3 text-slate-600 font-semibold">
              <span>Date: <strong>{paper.date || '___/___/2026'}</strong></span>
              <span>Time: <strong>{paper.timeAllowed}</strong></span>
            </div>
          </div>
        </div>
      ) : (
        /* =================== STANDARD ACADEMY HEADER =================== */
        <div className="flex items-center justify-between gap-4 border-b border-slate-300 pb-3">
          {/* Academy Emblem / Crest */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#0F284E] to-[#1E3A8A] border-2 border-amber-500/80 p-2 flex items-center justify-center shadow-sm">
              <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
                <circle cx="50" cy="50" r="44" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="4 2" />
                <path d="M50 14 L59 34 L81 34 L63 47 L70 69 L50 56 L30 69 L37 47 L19 34 L41 34 Z" fill="#059669" opacity="0.3" />
                <path d="M22 66 C32 60 44 61 50 66 C56 61 68 60 78 66 L78 40 C68 34 56 35 50 40 C44 35 32 34 22 40 Z" fill="#FFFFFF" stroke="#0F284E" strokeWidth="2" />
                <line x1="50" y1="40" x2="50" y2="66" stroke="#0F284E" strokeWidth="2" />
                <circle cx="50" cy="28" r="9" fill="#F59E0B" />
                <circle cx="53" cy="27" r="8" fill="#0F284E" />
                <polygon points="50,23 52,28 57,28 53,31 55,36 50,33 45,36 47,31 43,28 48,28" fill="#F59E0B" />
              </svg>
            </div>
          </div>

          {/* School Titles */}
          <div className="text-center flex-1">
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-wider text-[#0F284E]">
              {paper.academyName || 'THE ACHIEVERS ISLAMIC ACADEMY'}
            </h1>
            <p className="text-xs font-semibold text-emerald-800 tracking-wide uppercase mt-0.5">
              Excellence in Academic Wisdom & Islamic Values • العِلْمُ وَالْعَمَلُ
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-1.5">
              <span className="inline-block bg-[#0F284E] text-white text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-wide">
                {paper.examTerm}
              </span>
              <span className="inline-block bg-emerald-700 text-white text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-wide">
                {paper.subject} — {paper.gradeLevel}
              </span>
            </div>
          </div>

          {/* Right Corner Marks / Assessment Badge */}
          <div className="flex-shrink-0 text-right text-xs">
            <div className="border border-slate-400 rounded p-1.5 bg-slate-50 min-w-[110px]">
              <div className="text-slate-500 font-semibold uppercase text-[10px]">Total Marks</div>
              <div className="text-base font-black text-[#0F284E]">{paper.totalMarks}</div>
              <div className="text-[10px] text-slate-600 font-medium">{paper.timeAllowed}</div>
            </div>
          </div>
        </div>
      )}

      {/* Prominent Subject & Grade Banner for non-board, non-pre-primary reminder */}
      {!isBoardFormat && !isPrePrimary && (
        <div className="my-2 py-1.5 px-3 bg-slate-100/90 border-y border-slate-300 flex items-center justify-between text-xs sm:text-sm font-bold text-[#0F284E]">
          <div className="flex items-center gap-2">
            <span className="uppercase tracking-wider text-slate-500 text-[11px]">Examination Subject:</span>
            <span className={`font-black uppercase tracking-wide ${isUrduOrArabic ? 'font-urdu text-base' : ''}`}>
              {paper.subject}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="bg-white border border-slate-300 px-2.5 py-0.5 rounded font-bold text-slate-800">
              {paper.gradeLevel}
            </span>
            <span className="text-slate-600 hidden sm:inline">
              Time: <strong className="text-slate-900">{paper.timeAllowed}</strong>
            </span>
          </div>
        </div>
      )}

      {/* Student Details and Exam Metadata Grid for Standard Header */}
      {paper.showStudentTable && !isPrePrimary && (
        <div className="mt-2 text-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-slate-50/80 p-2 border border-slate-300 rounded">
            <div>
              <span className="font-semibold text-slate-600">Student Name (نام):</span>
              <span className="inline-block border-b border-dotted border-slate-600 ml-1 w-24 sm:w-28"></span>
            </div>
            <div>
              <span className="font-semibold text-slate-600">Roll No (لفظوں میں):</span>
              <span className="inline-block border-b border-dotted border-slate-600 ml-1 w-20"></span>
            </div>
            <div>
              <span className="font-semibold text-slate-600">Class / سیکشن:</span>
              <span className="font-bold text-slate-900 ml-1">{paper.gradeLevel}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-600">Date (تاریخ):</span>
              <span className="font-semibold text-slate-800 ml-1">{paper.date || '___/___/2026'}</span>
            </div>

            <div>
              <span className="font-semibold text-slate-600">Center (امتحانی مرکز):</span>
              <span className="inline-block border-b border-dotted border-slate-600 ml-1 w-24 sm:w-28"></span>
            </div>
            <div>
              <span className="font-semibold text-slate-600">Candidate Sign:</span>
              <span className="inline-block border-b border-dotted border-slate-600 ml-1 w-20"></span>
            </div>
            <div>
              <span className="font-semibold text-slate-600">Invigilator Sign:</span>
              <span className="inline-block border-b border-dotted border-slate-600 ml-1 w-20"></span>
            </div>
            <div>
              <span className="font-semibold text-slate-600">Marks (حاصل کردہ نمبر):</span>
              <span className="font-bold text-slate-900 ml-1">_____ / {paper.totalMarks}</span>
            </div>
          </div>
        </div>
      )}

      {/* Bubble sheet for Objective section if enabled */}
      {paper.showBubbleSheet && mcqQuestions.length > 0 && !isPrePrimary && (
        <div className="mt-3 p-2 border border-slate-800 rounded bg-slate-50/80">
          <div className="flex items-center justify-between border-b border-slate-300 pb-1 mb-1 text-[11px] font-bold text-slate-700">
            <span>OMR Response Sheet (جوابی دائرے پر کریں):</span>
            <span className="text-[10px] text-slate-500 font-normal">Use Blue/Black Ballpoint only</span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 justify-start text-[11px]">
            {mcqQuestions.slice(0, 15).map((q, qIndex) => (
              <div key={q.id || qIndex} className="flex items-center gap-1">
                <span className="font-bold text-slate-800 min-w-[18px]">Q{q.questionNumber || qIndex + 1}:</span>
                <div className="flex items-center gap-0.5">
                  {(q.options && q.options.length > 0 ? q.options : [1, 2, 3, 4]).map((opt, oIdx) => (
                    <span
                      key={oIdx}
                      className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[9px] font-bold text-slate-800 bg-white"
                    >
                      {typeof opt === 'object' ? opt.label : String.fromCharCode(65 + oIdx)}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
