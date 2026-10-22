import React from 'react';
import { 
  FileText, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Layers,
  GraduationCap
} from 'lucide-react';
import { SAMPLE_PAPERS } from '../data/samplePapers';
import type { ExamPaper } from '../types/exam';

interface PresetsShowcaseProps {
  onLoadPaper: (paper: ExamPaper) => void;
  onGoToGenerator: () => void;
  onGoToOcr: () => void;
}

export const PresetsShowcase: React.FC<PresetsShowcaseProps> = ({
  onLoadPaper,
  onGoToGenerator,
  onGoToOcr,
}) => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#0F284E] via-[#1E3A8A] to-[#059669] rounded-2xl p-6 sm:p-8 text-white shadow-md">
        <div className="max-w-2xl">
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-900 uppercase tracking-wide">
            Pre-Built Curriculum Examination Papers
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-2">
            The Achievers Islamic Academy Exam Papers
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 mt-2 leading-relaxed">
            Choose from ready-to-print, meticulously formatted examination papers featuring authentic Arabic/Urdu Nastaliq typography, KaTeX mathematical equations, and comprehensive grading keys.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-4">
            <button
              onClick={onGoToGenerator}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Generate From Custom Syllabus Pages</span>
            </button>
            <button
              onClick={onGoToOcr}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-lg border border-white/20 transition-all"
            >
              Digitize Handwritten Paper
            </button>
          </div>
        </div>
      </div>

      {/* Preset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SAMPLE_PAPERS.map((paper) => {
          const totalQuestions = paper.sections.reduce((acc, s) => acc + s.questions.length, 0);
          const isUrdu = paper.language === 'ur';

          return (
            <div
              key={paper.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 hover:border-emerald-500 overflow-hidden transition-all hover:shadow-md flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="bg-slate-50 border-b border-slate-200 p-4 sm:p-5 flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {paper.gradeLevel}
                    </span>
                    <h3 className={`text-base sm:text-lg font-bold text-slate-900 mt-1 ${isUrdu ? 'font-urdu' : ''}`}>
                      {paper.subject}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      {paper.examTerm}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-[#0F284E] block">
                      {paper.totalMarks} Marks
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {paper.timeAllowed}
                    </span>
                  </div>
                </div>

                {/* Section Summary */}
                <div className="p-5 space-y-3 text-xs">
                  <div className="space-y-1.5">
                    {paper.sections.map((sec, idx) => (
                      <div key={idx} className="flex items-center justify-between text-slate-700 bg-slate-50 p-2 rounded border border-slate-200/80">
                        <span className={`font-semibold truncate max-w-[260px] ${isUrdu ? 'font-urdu' : ''}`}>
                          {sec.sectionTitle}
                        </span>
                        <span className="font-bold text-emerald-700">
                          {sec.totalMarks} Marks ({sec.questions.length} Qs)
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Highlights */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 text-[11px] text-slate-600">
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{totalQuestions} Curriculum Questions</span>
                    </span>
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Full Marking Scheme & Solutions</span>
                    </span>
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Word (.docx) & PDF Ready</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-4 bg-slate-50 border-t border-slate-200">
                <button
                  onClick={() => onLoadPaper(paper)}
                  className="w-full py-2.5 px-4 bg-[#0F284E] hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Open in Paper Studio (Edit, Print & Export)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
