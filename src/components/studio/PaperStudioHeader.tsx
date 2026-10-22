import React from 'react';
import { 
  Printer, 
  Download, 
  FileDown, 
  Clock, 
  Award
} from 'lucide-react';
import type { ExamPaper } from '../../types/exam';

interface PaperStudioHeaderProps {
  paper: ExamPaper;
  onPrint?: () => void;
  onExportDocx?: () => void;
  onExportPdf?: () => void;
  badgeLabel?: string;
}

export const PaperStudioHeader: React.FC<PaperStudioHeaderProps> = ({
  paper,
  onPrint,
  onExportDocx,
  onExportPdf,
  badgeLabel = 'Live Paper Studio',
}) => {
  const isUrdu = paper.language === 'ur';
  const isArabic = paper.language === 'ar';
  const isUrduOrArabic = isUrdu || isArabic;

  const totalQuestions = paper.sections.reduce((acc, s) => acc + s.questions.length, 0);

  return (
    <div className="bg-gradient-to-r from-[#0F284E] via-[#1E3A8A] to-[#065F46] rounded-2xl p-5 sm:p-6 text-white shadow-lg border border-slate-700/50 mb-6 transition-all no-print">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Dynamic Titles & School Badge */}
        <div className="space-y-2">
          {/* Top Tagline / Meta Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-400 text-slate-950 uppercase tracking-wider shadow-xs">
              {badgeLabel}
            </span>

            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Real-Time Dynamic Sync</span>
            </span>

            <span className="text-xs text-slate-300 font-semibold hidden sm:inline">
              THE ACHIEVERS ISLAMIC ACADEMY
            </span>
          </div>

          {/* DYNAMIC TOP HEADER TITLE: Updates in real-time whenever Subject or Class changes */}
          <div>
            <h1 
              className={`text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white ${
                isUrduOrArabic ? 'font-urdu' : ''
              }`}
            >
              {paper.subject} <span className="text-emerald-400 font-normal sm:font-bold">—</span> {paper.gradeLevel}
            </h1>

            <p className="text-xs sm:text-sm text-slate-200 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-semibold text-amber-300">{paper.examTerm}</span>
              <span className="text-slate-400">•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-300" />
                <span>{paper.timeAllowed}</span>
              </span>
              <span className="text-slate-400">•</span>
              <span className="flex items-center gap-1 font-bold text-emerald-300">
                <Award className="w-3.5 h-3.5" />
                <span>{paper.totalMarks} Total Marks</span>
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-300">
                {totalQuestions} {totalQuestions === 1 ? 'Question' : 'Questions'} ({paper.sections.length} {paper.sections.length === 1 ? 'Section' : 'Sections'})
              </span>
              <span className="text-slate-400">•</span>
              <span className="inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded bg-white/10 text-amber-300 border border-amber-300/30 text-[11px]">
                <span>{paper.paperSize === 'legal' ? 'Legal Paper (8.5×14")' : 'A4 Paper (210×297mm)'}</span>
              </span>
            </p>
          </div>
        </div>

        {/* Right: Quick Action Triggers */}
        {(onPrint || onExportDocx || onExportPdf) && (
          <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/10">
            {onPrint && (
              <button
                onClick={onPrint}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900/80 hover:bg-slate-900 text-white font-bold rounded-xl text-xs border border-white/20 shadow-sm transition-all hover:scale-102"
                title={`Print examination paper strictly formatted for ${paper.paperSize === 'legal' ? 'Legal (8.5x14")' : 'A4 (210x297mm)'}`}
              >
                <Printer className="w-3.5 h-3.5 text-emerald-400" />
                <span>Print {paper.paperSize === 'legal' ? 'Legal' : 'A4'}</span>
              </button>
            )}

            {onExportDocx && (
              <button
                onClick={onExportDocx}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-sm transition-all hover:scale-102"
                title="Export to Microsoft Word (.docx)"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Word (.docx)</span>
              </button>
            )}

            {onExportPdf && (
              <button
                onClick={onExportPdf}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-sm transition-all hover:scale-102"
                title="Download PDF"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
