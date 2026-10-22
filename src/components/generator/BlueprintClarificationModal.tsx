import React from 'react';
import { 
  CheckCircle2, 
  X, 
  Sparkles, 
  Award, 
  PieChart, 
  ListChecks, 
  Layers, 
  Clock, 
  HelpCircle,
  FileCheck2,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { BlueprintConfig, UploadedChapterPage } from '../../types/exam';

interface BlueprintClarificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  blueprint: BlueprintConfig;
  uploadedPages: UploadedChapterPage[];
  onConfirmGenerate: () => void;
}

export const BlueprintClarificationModal: React.FC<BlueprintClarificationModalProps> = ({
  isOpen,
  onClose,
  blueprint,
  uploadedPages,
  onConfirmGenerate,
}) => {
  if (!isOpen) return null;

  const mcqMarks = blueprint.mcqCount * blueprint.mcqMarksEach;
  const blanksMarks = blueprint.blanksCount * blueprint.blanksMarksEach;
  const vocabMarks = blueprint.vocabCount * blueprint.vocabMarksEach;
  const objTotalMarks = mcqMarks + blanksMarks + vocabMarks;

  const shortTotalMarks = blueprint.shortCountToAttempt * blueprint.shortMarksEach;
  const longTotalMarks = blueprint.longCountToAttempt * blueprint.longMarksEach;

  const totalCalculated = objTotalMarks + shortTotalMarks + longTotalMarks;

  // Percentage calculations
  const objPercent = totalCalculated > 0 ? Math.round((objTotalMarks / totalCalculated) * 100) : 0;
  const shortPercent = totalCalculated > 0 ? Math.round((shortTotalMarks / totalCalculated) * 100) : 0;
  const longPercent = totalCalculated > 0 ? Math.round((longTotalMarks / totalCalculated) * 100) : 0;

  const handleConfirm = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#059669', '#0F284E', '#F59E0B'],
      });
    } catch {
      // Confetti fallback
    }
    onConfirmGenerate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header */}
        <div className="bg-[#0F284E] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-900 uppercase tracking-wide">
              Preliminary Clarification & Confirmation
            </span>
            <span className="text-xs text-slate-300">• Blueprint Verification</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <span>Exam Blueprint & Question Weightage Confirmation</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Please review the marks distribution, internal choices, and syllabus source below before AI finalizes the examination paper.
          </p>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Metadata Summary Banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block font-medium">Academy:</span>
              <span className="font-bold text-[#0F284E]">The Achievers Islamic Academy</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">Subject & Class:</span>
              <span className="font-bold text-slate-900">{blueprint.subject} • {blueprint.grade}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">Term & Time:</span>
              <span className="font-bold text-slate-900">{blueprint.examTerm} ({blueprint.timeAllowed})</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">Paper Format:</span>
              <span className="font-bold text-emerald-800 uppercase">{blueprint.paperSize === 'legal' ? 'Legal (8.5×14")' : 'A4 (210×297mm)'}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">Total Paper Marks:</span>
              <span className="font-black text-emerald-700 text-sm">{totalCalculated} Marks</span>
            </div>
          </div>

          {/* Section Weightage & Question Breakdown Table */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ListChecks className="w-4 h-4 text-emerald-600" />
              <span>Section-by-Section Weightage Breakdown</span>
            </h4>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Section Title</th>
                    <th className="p-3">Question Types</th>
                    <th className="p-3">Choice / Rubric</th>
                    <th className="p-3 text-right">Marks</th>
                    <th className="p-3 text-right">Weightage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {/* Section A */}
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-[#0F284E]">
                      Section A: Objective
                    </td>
                    <td className="p-3 text-slate-600">
                      {blueprint.mcqCount} MCQs + {blueprint.blanksCount} Blanks {blueprint.vocabCount > 0 ? `+ ${blueprint.vocabCount} Vocab` : ''}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                        Compulsory (No Choice)
                      </span>
                    </td>
                    <td className="p-3 text-right font-bold text-slate-900">
                      {objTotalMarks}
                    </td>
                    <td className="p-3 text-right font-bold text-emerald-700">
                      {objPercent}%
                    </td>
                  </tr>

                  {/* Section B */}
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-[#0F284E]">
                      Section B: Short Qs
                    </td>
                    <td className="p-3 text-slate-600">
                      {blueprint.shortCountTotal} Short Answer Questions
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                        Attempt any {blueprint.shortCountToAttempt} of {blueprint.shortCountTotal}
                      </span>
                    </td>
                    <td className="p-3 text-right font-bold text-slate-900">
                      {shortTotalMarks}
                    </td>
                    <td className="p-3 text-right font-bold text-emerald-700">
                      {shortPercent}%
                    </td>
                  </tr>

                  {/* Section C */}
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-[#0F284E]">
                      Section C: Long / Essay
                    </td>
                    <td className="p-3 text-slate-600">
                      {blueprint.longCountTotal} Detailed / Analytical Questions
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                        Attempt any {blueprint.longCountToAttempt} of {blueprint.longCountTotal}
                      </span>
                    </td>
                    <td className="p-3 text-right font-bold text-slate-900">
                      {longTotalMarks}
                    </td>
                    <td className="p-3 text-right font-bold text-emerald-700">
                      {longPercent}%
                    </td>
                  </tr>
                </tbody>
                <tfoot className="bg-slate-50 border-t-2 border-slate-200 font-bold text-slate-900">
                  <tr>
                    <td colSpan={3} className="p-3 text-right uppercase">
                      Total Calculated Marks:
                    </td>
                    <td className="p-3 text-right text-base text-emerald-700 font-black">
                      {totalCalculated}
                    </td>
                    <td className="p-3 text-right text-base text-emerald-700 font-black">
                      100%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Visual Weightage Progress Bar */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
              <span>Section Weightage Distribution:</span>
              <span>Objective ({objPercent}%) • Short Qs ({shortPercent}%) • Long Qs ({longPercent}%)</span>
            </div>
            <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-200 shadow-inner">
              <div style={{ width: `${objPercent}%` }} className="bg-[#0F284E]" title={`Objective: ${objPercent}%`} />
              <div style={{ width: `${shortPercent}%` }} className="bg-emerald-600" title={`Short: ${shortPercent}%`} />
              <div style={{ width: `${longPercent}%` }} className="bg-amber-500" title={`Long: ${longPercent}%`} />
            </div>
          </div>

          {/* Curriculum Grounding & Cognitive Distribution */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Left: Bloom's Taxonomy Cognitive levels */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <span className="font-bold text-slate-800 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <PieChart className="w-3.5 h-3.5 text-emerald-600" />
                <span>Bloom's Cognitive Rigor</span>
              </span>
              <ul className="space-y-1.5 text-slate-600">
                <li className="flex justify-between">
                  <span>Knowledge & Direct Recall:</span>
                  <span className="font-bold text-slate-800">40%</span>
                </li>
                <li className="flex justify-between">
                  <span>Conceptual Understanding:</span>
                  <span className="font-bold text-slate-800">40%</span>
                </li>
                <li className="flex justify-between">
                  <span>Application & Problem Solving:</span>
                  <span className="font-bold text-slate-800">20%</span>
                </li>
              </ul>
            </div>

            {/* Right: Sources & Verification */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <span className="font-bold text-slate-800 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Generation Verification</span>
              </span>
              <ul className="space-y-1.5 text-slate-600">
                <li className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{uploadedPages.length} textbook pages linked as syllabus base</span>
                </li>
                <li className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Official Achievers Islamic Academy letterhead applied</span>
                </li>
                <li className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Complete Teacher Marking Scheme & Solutions included</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-100 transition-all"
          >
            Adjust Configuration
          </button>
          <button
            onClick={handleConfirm}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold rounded-lg text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Approve Blueprint & Generate Exam Paper</span>
          </button>
        </div>
      </div>
    </div>
  );
};
