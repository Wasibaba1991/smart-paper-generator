import React from 'react';
import { 
  Sparkles, 
  ScanText, 
  FileText, 
  Printer, 
  Download, 
  FileDown, 
  GraduationCap,
  Layers,
  ChevronDown,
  PenLine,
} from 'lucide-react';
import type { PaperSize } from '../types/exam';

interface HeaderProps {
  activeTab: 'generator' | 'ocr' | 'pre_primary' | 'studio' | 'samples' | 'handwritten';
  setActiveTab: (tab: 'generator' | 'ocr' | 'pre_primary' | 'studio' | 'samples' | 'handwritten') => void;
  onPrint?: () => void;
  onExportDocx?: () => void;
  onExportPdf?: () => void;
  hasActivePaper?: boolean;
  paperSize?: PaperSize;
  onPaperSizeChange?: (size: PaperSize) => void;
  currentSubject?: string;
  currentGrade?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onPrint,
  onExportDocx,
  onExportPdf,
  hasActivePaper = true,
  paperSize = 'a4',
  onPaperSizeChange,
  currentSubject,
  currentGrade,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0F284E] text-white shadow-md border-b-2 border-emerald-600 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div 
            onClick={() => setActiveTab('handwritten')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-white/10 border border-emerald-400/50 p-1 flex items-center justify-center group-hover:bg-white/20 transition-all">
              <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
                <circle cx="50" cy="50" r="44" fill="none" stroke="#F59E0B" strokeWidth="3" />
                <path d="M50 14 L59 34 L81 34 L63 47 L70 69 L50 56 L30 69 L37 47 L19 34 L41 34 Z" fill="#059669" opacity="0.4" />
                <path d="M22 66 C32 60 44 61 50 66 C56 61 68 60 78 66 L78 40 C68 34 56 35 50 40 C44 35 32 34 22 40 Z" fill="#FFFFFF" stroke="#0F284E" strokeWidth="2" />
                <circle cx="50" cy="28" r="7" fill="#F59E0B" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wide text-sm sm:text-base text-white">
                  THE ACHIEVERS
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-600 text-white">
                  Islamic Academy
                </span>
              </div>
              <p className="text-[11px] text-slate-300 hidden sm:block">
                Smart Paper Generator &amp; Examination Studio
              </p>
            </div>
          </div>

          {/* Navigation Modes Switcher */}
          <nav className="flex items-center gap-1 sm:gap-1.5">
            {/* PRIMARY: Handwritten Converter tab */}
            <button
              onClick={() => setActiveTab('handwritten')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'handwritten'
                  ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400/50'
                  : 'text-amber-300 hover:bg-white/10 hover:text-amber-200'
              }`}
              title="Handwritten to Digital Paper Converter"
            >
              <PenLine className="w-4 h-4" />
              <span className="hidden sm:inline">HW Converter</span>
              <span className="sm:hidden">HW</span>
            </button>

            <button
              onClick={() => setActiveTab('pre_primary')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-black transition-all cursor-pointer ${
                activeTab === 'pre_primary'
                  ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300/50'
                  : 'text-amber-300 hover:bg-white/10 hover:text-amber-200'
              }`}
            >
              <span className="text-sm">🌟</span>
              <span className="hidden md:inline">Pre-Primary / KG</span>
              <span className="md:hidden">KG</span>
            </button>

            <button
              onClick={() => setActiveTab('generator')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'generator'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span className="hidden sm:inline">AI Auto-Gen</span>
              <span className="sm:hidden">Gen</span>
            </button>

            <button
              onClick={() => setActiveTab('ocr')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'ocr'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              <ScanText className="w-4 h-4 text-amber-300" />
              <span className="hidden lg:inline">OCR &amp; Formatting</span>
              <span className="lg:hidden">OCR</span>
            </button>

            <button
              onClick={() => setActiveTab('studio')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'studio'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              <FileText className="w-4 h-4 text-sky-300" />
              <span>Studio</span>
            </button>

            <button
              onClick={() => setActiveTab('samples')}
              className={`hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'samples'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-purple-300" />
              <span>Presets</span>
            </button>
          </nav>

          {/* Dynamic Active Subject & Grade Pill */}
          {currentSubject && currentGrade && (
            <div className="hidden xl:flex items-center gap-2 bg-slate-900/80 border border-emerald-500/40 rounded-xl px-3 py-1 shadow-inner text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-bold text-white max-w-[150px] truncate" title={currentSubject}>
                {currentSubject}
              </span>
              <span className="text-emerald-400 font-normal">—</span>
              <span className="font-extrabold text-amber-300 max-w-[120px] truncate" title={currentGrade}>
                {currentGrade}
              </span>
            </div>
          )}

          {/* Action Export Buttons & Paper Size */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {hasActivePaper && (
              <>
                {onPaperSizeChange && (
                  <div className="hidden md:flex items-center bg-white/10 border border-white/20 rounded-lg px-2 py-1">
                    <label htmlFor="header-paper-size" className="text-[11px] font-bold text-slate-200 flex items-center gap-1 mr-1.5 cursor-pointer">
                      <Layers className="w-3 h-3 text-emerald-400" />
                      <span>Size:</span>
                    </label>
                    <div className="relative flex items-center">
                      <select
                        id="header-paper-size"
                        value={paperSize}
                        onChange={(e) => onPaperSizeChange(e.target.value as PaperSize)}
                        title="Set active page dimensions"
                        className="appearance-none bg-slate-900 text-emerald-300 font-extrabold text-xs py-0.5 pl-2 pr-5 border border-emerald-500/40 rounded focus:ring-1 focus:ring-emerald-400 focus:outline-none cursor-pointer"
                      >
                        <option value="a4">A4 (210×297mm)</option>
                        <option value="legal">Legal (8.5×14")</option>
                      </select>
                      <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1 pointer-events-none" />
                    </div>
                  </div>
                )}

                <button
                  onClick={onPrint}
                  title={`Print Question Paper formatted strictly for ${paperSize === 'legal' ? 'Legal (8.5x14")' : 'A4 (210x297mm)'}`}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold border border-slate-600 transition-all shadow-sm cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Print ({paperSize === 'legal' ? 'Legal' : 'A4'})</span>
                </button>

                <button
                  onClick={onExportDocx}
                  title="Export to Microsoft Word (.docx)"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold transition-all shadow-sm cursor-pointer"
                >
                  <FileDown className="w-3.5 h-3.5 text-white" />
                  <span className="hidden sm:inline">Word</span>
                </button>

                <button
                  onClick={onExportPdf}
                  title={`Direct Download PDF (${paperSize === 'legal' ? 'Legal' : 'A4'})`}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold transition-all shadow-sm cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-white" />
                  <span className="hidden md:inline">PDF</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
