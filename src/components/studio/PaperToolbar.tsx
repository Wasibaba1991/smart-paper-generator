import { 
  Printer, 
  Download, 
  FileDown, 
  Columns, 
  PlusCircle, 
  Type, 
  FileText, 
  Key,
  Layers,
  ChevronDown
} from 'lucide-react';
import type { ExamPaper, PaperSize } from '../../types/exam';

interface PaperToolbarProps {
  paper: ExamPaper;
  setPaper: React.Dispatch<React.SetStateAction<ExamPaper>>;
  studioMode: 'paper' | 'marking_scheme';
  setStudioMode: (mode: 'paper' | 'marking_scheme') => void;
  onAddQuestion: () => void;
  onPrint: () => void;
  onExportDocx: () => void;
  onExportPdf: () => void;
}

export const PaperToolbar: React.FC<PaperToolbarProps> = ({
  paper,
  setPaper,
  studioMode,
  setStudioMode,
  onAddQuestion,
  onPrint,
  onExportDocx,
  onExportPdf,
}) => {
  const toggleColumns = () => {
    setPaper((prev) => ({
      ...prev,
      layoutColumns: prev.layoutColumns === 1 ? 2 : 1,
    }));
  };

  const toggleWatermark = () => {
    setPaper((prev) => ({
      ...prev,
      showWatermark: !prev.showWatermark,
    }));
  };

  const toggleBismillah = () => {
    setPaper((prev) => ({
      ...prev,
      showBismillah: !prev.showBismillah,
    }));
  };

  const toggleStudentTable = () => {
    setPaper((prev) => ({
      ...prev,
      showStudentTable: !prev.showStudentTable,
    }));
  };

  const cycleFontSize = () => {
    const nextSize = 
      paper.fontSize === 'compact' 
        ? 'standard' 
        : paper.fontSize === 'standard' 
        ? 'large' 
        : paper.fontSize === 'large'
        ? 'pre_primary'
        : 'compact';
    setPaper((prev) => ({ ...prev, fontSize: nextSize }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 mb-6 no-print">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: View Mode Switcher (Student Paper vs Marking Scheme) */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setStudioMode('paper')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              studioMode === 'paper'
                ? 'bg-[#0F284E] text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Question Paper (Student View)</span>
          </button>

          <button
            onClick={() => setStudioMode('marking_scheme')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              studioMode === 'marking_scheme'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-amber-300" />
            <span>Answer Key & Marking Scheme</span>
          </button>
        </div>

        {/* Center: Formatting & Layout Controls */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {/* Columns */}
          <button
            onClick={toggleColumns}
            title="Switch between 1-Column and 2-Column Board Exam Layout"
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg font-medium transition-all"
          >
            <Columns className="w-3.5 h-3.5 text-emerald-600" />
            <span>{paper.layoutColumns === 1 ? '1 Col' : '2 Col'}</span>
          </button>

          {/* Font Size */}
          <button
            onClick={cycleFontSize}
            title="Cycle Font Size (Compact, Standard, Large)"
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg font-medium transition-all"
          >
            <Type className="w-3.5 h-3.5 text-emerald-600" />
            <span className="capitalize">{paper.fontSize}</span>
          </button>

          {/* Watermark */}
          <button
            onClick={toggleWatermark}
            title="Toggle Academy Watermark"
            className={`flex items-center gap-1 px-2.5 py-1.5 border rounded-lg font-medium transition-all ${
              paper.showWatermark
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            <span>Watermark</span>
          </button>

          {/* Bismillah */}
          <button
            onClick={toggleBismillah}
            title="Toggle Arabic Bismillah Header"
            className={`flex items-center gap-1 px-2.5 py-1.5 border rounded-lg font-medium transition-all ${
              paper.showBismillah
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            <span>Bismillah</span>
          </button>

          {/* Student Table */}
          <button
            onClick={toggleStudentTable}
            title="Toggle Student Details Header Grid"
            className={`flex items-center gap-1 px-2.5 py-1.5 border rounded-lg font-medium transition-all ${
              paper.showStudentTable
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            <span>Student Grid</span>
          </button>

          {/* Add Question */}
          <button
            onClick={onAddQuestion}
            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-sm transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Question</span>
          </button>
        </div>

        {/* Right: Paper Size Dropdown & Export/Print Triggers */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Paper Size Selection Dropdown Menu */}
          <div className="flex items-center bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 shadow-2xs hover:border-emerald-500 transition-all">
            <label htmlFor="toolbar-paper-size" className="text-[11px] font-bold text-slate-600 flex items-center gap-1 mr-1.5 cursor-pointer">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Size:</span>
            </label>
            <div className="relative flex items-center">
              <select
                id="toolbar-paper-size"
                value={paper.paperSize || 'a4'}
                onChange={(e) =>
                  setPaper((prev) => ({
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

          {/* Dynamic Print Trigger */}
          <button
            onClick={onPrint}
            title={`Print examination paper strictly formatted for ${paper.paperSize === 'legal' ? 'Legal (8.5x14")' : 'A4 (210x297mm)'}`}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F284E] hover:bg-slate-800 text-white font-bold rounded-lg text-xs shadow-sm transition-all"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-400" />
            <span>Print {paper.paperSize === 'legal' ? 'Legal' : 'A4'}</span>
          </button>

          {/* Export to Word */}
          <button
            onClick={onExportDocx}
            title="Export to Microsoft Word (.docx)"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-lg text-xs shadow-sm transition-all"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Word (.docx)</span>
          </button>

          {/* Export to PDF */}
          <button
            onClick={onExportPdf}
            title={`Download high-definition PDF formatted for ${paper.paperSize === 'legal' ? 'Legal' : 'A4'}`}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-lg text-xs shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
