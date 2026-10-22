import React, { useState } from 'react';
import { 
  BookOpen, 
  GraduationCap, 
  Award, 
  Clock, 
  Languages, 
  Columns, 
  Type, 
  ChevronDown, 
  ChevronUp, 
  Sliders, 
  FileCheck, 
  Calculator 
} from 'lucide-react';
import type { 
  ExamPaper, 
  Subject, 
  GradeLevel, 
  ExamTerm, 
  Language
} from '../../types/exam';
import { getCurriculumTemplateForSubject } from '../../data/subjectCurriculumTemplates';

interface StudioSettingsPanelProps {
  paper: ExamPaper;
  setPaper: React.Dispatch<React.SetStateAction<ExamPaper>>;
  title?: string;
  onSubjectChange?: (newSubject: Subject, templateSample?: string) => void;
}

export const StudioSettingsPanel: React.FC<StudioSettingsPanelProps> = ({
  paper,
  setPaper,
  title = 'Paper Studio Settings & Metadata Selector',
  onSubjectChange,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // Auto-calculate total marks from all questions across sections
  const calculateTotalFromQuestions = () => {
    const total = paper.sections.reduce((sum, sec) => {
      const secTotal = sec.questions.reduce((qSum, q) => qSum + (q.marks || 0), 0);
      return sum + secTotal;
    }, 0);

    setPaper((prev) => ({
      ...prev,
      totalMarks: total > 0 ? total : prev.totalMarks,
    }));
  };

  const handleSubjectChange = (newSubject: Subject) => {
    // Dynamically retrieve curriculum questions, marks, and language script
    const template = getCurriculumTemplateForSubject(newSubject, paper.gradeLevel);

    const isPrePrim = newSubject.startsWith('Pre-Primary') || 
      paper.gradeLevel.includes('Nursery') || 
      paper.gradeLevel.includes('KG') || 
      paper.gradeLevel.includes('Kindergarten') ||
      paper.gradeLevel.includes('Playgroup');

    setPaper((prev) => ({
      ...prev,
      subject: newSubject,
      language: template.language,
      totalMarks: template.totalMarks,
      timeAllowed: template.timeAllowed,
      sections: template.sections,
      isPrePrimary: isPrePrim,
      fontSize: isPrePrim ? 'pre_primary' : prev.fontSize === 'pre_primary' ? 'standard' : prev.fontSize,
      boardFormat: isPrePrim ? 'pre_primary' : prev.boardFormat === 'pre_primary' ? 'standard' : prev.boardFormat,
    }));

    onSubjectChange?.(newSubject, template.rawTextSample);
  };

  const handleGradeChange = (newGrade: GradeLevel) => {
    const isPrePrim = newGrade.includes('Nursery') || 
      newGrade.includes('KG') || 
      newGrade.includes('Kindergarten') || 
      newGrade.includes('Playgroup') ||
      paper.subject.startsWith('Pre-Primary');

    if (isPrePrim) {
      // For pre-primary grades, reload matching curriculum template and enforce A4
      const template = getCurriculumTemplateForSubject(paper.subject, newGrade);
      setPaper((prev) => ({
        ...prev,
        gradeLevel: newGrade,
        isPrePrimary: true,
        fontSize: 'pre_primary',
        boardFormat: 'pre_primary',
        paperSize: 'a4', // Pre-primary worksheets always A4
        language: template.language,
        totalMarks: template.totalMarks,
        timeAllowed: template.timeAllowed,
        sections: template.sections,
      }));
    } else {
      setPaper((prev) => ({
        ...prev,
        gradeLevel: newGrade,
        isPrePrimary: false,
        fontSize: prev.fontSize === 'pre_primary' ? 'standard' : prev.fontSize,
        boardFormat: prev.boardFormat === 'pre_primary' ? 'standard' : prev.boardFormat,
      }));
    }
  };

  const handleExamTermChange = (newTerm: ExamTerm | string) => {
    setPaper((prev) => ({
      ...prev,
      examTerm: newTerm as ExamTerm,
    }));
  };

  const handleTotalMarksChange = (marks: number) => {
    setPaper((prev) => ({
      ...prev,
      totalMarks: marks > 0 ? marks : 0,
    }));
  };

  const handleTimeAllowedChange = (time: string) => {
    setPaper((prev) => ({
      ...prev,
      timeAllowed: time,
    }));
  };

  const handleLanguageChange = (newLang: Language) => {
    setPaper((prev) => ({
      ...prev,
      language: newLang,
    }));
  };

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
        : 'compact';
    setPaper((prev) => ({ ...prev, fontSize: nextSize }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-300 overflow-hidden transition-all mt-8 no-print">
      {/* Panel Header & Dynamic Real-time Status */}
      <div 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="bg-gradient-to-r from-[#0F284E] via-[#163564] to-[#047857] text-white p-4 sm:px-6 cursor-pointer flex items-center justify-between select-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-extrabold tracking-wide text-white">
                {title}
              </h3>
              <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                Live Controller
              </span>
            </div>
            <p className="text-[11px] text-slate-300 hidden sm:block">
              Changes to Subject, Class, Marks, or Exam Title update the studio header, paper preview, and exports instantly.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Active Summary Pill */}
          <span className="hidden md:inline-flex items-center gap-1.5 text-xs bg-black/25 border border-white/10 px-3 py-1 rounded-lg text-emerald-300 font-bold">
            <span>{paper.subject}</span>
            <span className="text-white/40">•</span>
            <span>{paper.gradeLevel}</span>
            <span className="text-white/40">•</span>
            <span className="text-amber-300">{paper.totalMarks} Marks</span>
            <span className="text-white/40">•</span>
            <span className="text-emerald-200 uppercase">{paper.paperSize || 'a4'}</span>
          </span>

          <button
            type="button"
            className="p-1 rounded-lg hover:bg-white/10 text-slate-200 transition-colors"
          >
            {isCollapsed ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expandable Settings Body */}
      {!isCollapsed && (
        <div className="p-5 sm:p-6 bg-slate-50/70 border-t border-slate-200 space-y-5 text-xs">
          {/* Row 1: Core Dynamic Metadata (Subject, Class, Exam Title, Marks) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Subject Selector */}
            <div>
              <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span>Selected Subject:</span>
              </label>
              <select
                value={paper.subject}
                onChange={(e) => handleSubjectChange(e.target.value as Subject)}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900 shadow-2xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <optgroup label="🌟 Pre-Primary / Nursery & KG Curriculums">
                  <option value="Pre-Primary English & Phonics">Pre-Primary English & Phonics</option>
                  <option value="Pre-Primary Urdu (حروفیات و تصویری پہچان)">Pre-Primary Urdu (حروفیات و تصویری پہچان)</option>
                  <option value="Pre-Primary Math & Numbers">Pre-Primary Math & Numbers</option>
                  <option value="Pre-Primary Islamic & General Knowledge">Pre-Primary Islamic & General Knowledge</option>
                  <option value="Pre-Primary Art, Drawing & Coloring">Pre-Primary Art, Drawing & Coloring</option>
                </optgroup>
                <optgroup label="🏫 Primary, Middle & Matric (General & Islamic)">
                  <option value="Islamic Studies (اسلامیات)">Islamic Studies (اسلامیات)</option>
                  <option value="Urdu Literature & Grammar (اردو)">Urdu Literature & Grammar (اردو)</option>
                  <option value="English Language & Lit">English Language & Lit</option>
                  <option value="Mathematics (ریاضی)">Mathematics (ریاضی)</option>
                  <option value="Arabic Language (اللغة العربية)">Arabic Language (اللغة العربية)</option>
                  <option value="General Science (سائنس)">General Science (سائنس)</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Pakistan Studies (مطالعہ پاکستان)">Pakistan Studies (مطالعہ پاکستان)</option>
                </optgroup>
              </select>
            </div>

            {/* 2. Target Class / Grade Selector */}
            <div>
              <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                <span>Target Class / Grade:</span>
              </label>
              <select
                value={paper.gradeLevel}
                onChange={(e) => handleGradeChange(e.target.value as GradeLevel)}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900 shadow-2xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <optgroup label="👶 Early Childhood / Pre-Primary">
                  <option value="Playgroup / Nursery">Playgroup / Nursery</option>
                  <option value="Kindergarten (KG / Prep)">Kindergarten (KG / Prep)</option>
                  <option value="Kindergarten (KG-1 / Prep)">Kindergarten (KG-1 / Prep)</option>
                  <option value="Kindergarten (KG-2 / Advance)">Kindergarten (KG-2 / Advance)</option>
                </optgroup>
                <optgroup label="🎒 Primary, Middle & Matric">
                  <option value="Grade 1">Grade 1</option>
                  <option value="Grade 2">Grade 2</option>
                  <option value="Grade 3">Grade 3</option>
                  <option value="Grade 4">Grade 4</option>
                  <option value="Grade 5">Grade 5</option>
                  <option value="Grade 6">Grade 6</option>
                  <option value="Grade 7">Grade 7</option>
                  <option value="Grade 8">Grade 8</option>
                  <option value="Grade 9 (Matric / O-Level)">Grade 9 (Matric / O-Level)</option>
                  <option value="Grade 10 (Matric / O-Level)">Grade 10 (Matric / O-Level)</option>
                  <option value="Grade 11 (HSSC-I)">Grade 11 (HSSC-I)</option>
                  <option value="Grade 12 (HSSC-II)">Grade 12 (HSSC-II)</option>
                </optgroup>
              </select>
            </div>

            {/* 3. Examination Title / Term */}
            <div>
              <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Exam Title / Term:</span>
              </label>
              <input
                type="text"
                value={paper.examTerm}
                onChange={(e) => handleExamTermChange(e.target.value)}
                placeholder="e.g. Mid-Term Examination 2026"
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900 shadow-2xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* 4. Total Marks & Auto-Calculate */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-700 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Total Marks:</span>
                </label>
                <button
                  type="button"
                  onClick={calculateTotalFromQuestions}
                  className="text-[10px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  title="Sum marks from all questions in sections"
                >
                  <Calculator className="w-3 h-3" />
                  <span>Auto-Sum</span>
                </button>
              </div>
              <input
                type="number"
                min="1"
                max="200"
                value={paper.totalMarks}
                onChange={(e) => handleTotalMarksChange(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 font-black text-[#0F284E] text-base shadow-2xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Row 2: Secondary Controls (Time, Script/Language, Date, Instructions) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 border-t border-slate-200">
            {/* Time Allowed */}
            <div className="sm:col-span-2">
              <label className="block text-slate-600 font-bold mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                <span>Time Allowed:</span>
              </label>
              <input
                type="text"
                value={paper.timeAllowed}
                onChange={(e) => handleTimeAllowedChange(e.target.value)}
                placeholder="e.g. 2 Hours 30 Minutes"
                className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Script & Direction */}
            <div className="sm:col-span-2">
              <label className="block text-slate-600 font-bold mb-1 flex items-center gap-1">
                <Languages className="w-3 h-3 text-slate-500" />
                <span>Script & Alignment:</span>
              </label>
              <select
                value={paper.language}
                onChange={(e) => handleLanguageChange(e.target.value as Language)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:ring-1 focus:ring-emerald-500"
              >
                <option value="ur">Urdu (اردو - Nastaliq RTL)</option>
                <option value="ar">Arabic (عربي - Naskh RTL)</option>
                <option value="math">Mathematics (KaTeX formulas)</option>
                <option value="en">English (Standard LTR)</option>
                <option value="bilingual">Bilingual (English + Urdu)</option>
              </select>
            </div>

            {/* Date Field */}
            <div className="sm:col-span-2">
              <label className="block text-slate-600 font-bold mb-1">
                Examination Date:
              </label>
              <input
                type="text"
                value={paper.date || ''}
                onChange={(e) => setPaper((prev) => ({ ...prev, date: e.target.value }))}
                placeholder="e.g. 24 October 2026"
                className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Row 3: Pakistani Board Pattern Controls */}
          <div className="pt-3 border-t border-slate-200">
            <div className="text-slate-700 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>Pakistani Board Examination Settings:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Board Format */}
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Board Layout Pattern:
                </label>
                <select
                  value={paper.boardFormat || 'bise'}
                  onChange={(e) => setPaper((prev) => ({ ...prev, boardFormat: e.target.value as any }))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="bise">BISE (Punjab / Sindh / KPK Board)</option>
                  <option value="fbise">FBISE (Federal Board Islamabad)</option>
                  <option value="standard">Standard Academy Style</option>
                </select>
              </div>

              {/* Paper Code */}
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Paper Code (پرچہ کوڈ):
                </label>
                <input
                  type="text"
                  value={paper.paperCode || '5241'}
                  onChange={(e) => setPaper((prev) => ({ ...prev, paperCode: e.target.value }))}
                  placeholder="e.g. 5241"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold text-[#0F284E] focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Exam Group */}
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Exam Group (گروپ):
                </label>
                <select
                  value={paper.examGroup || 'Group-I (Morning)'}
                  onChange={(e) => setPaper((prev) => ({ ...prev, examGroup: e.target.value }))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Group-I (Morning)">Group-I (Morning / اوّل)</option>
                  <option value="Group-II (Evening)">Group-II (Evening / دوم)</option>
                </select>
              </div>

              {/* OMR Bubble Sheet Toggle */}
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  OMR Bubble Sheet:
                </label>
                <button
                  type="button"
                  onClick={() => setPaper((prev) => ({ ...prev, showBubbleSheet: !prev.showBubbleSheet }))}
                  className={`w-full py-2 px-3 border rounded-lg font-bold transition-all text-xs flex items-center justify-center gap-1.5 ${
                    paper.showBubbleSheet
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <span>OMR Bubbles: {paper.showBubbleSheet ? 'Enabled' : 'Disabled'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Row 4: Formatting & Layout Toggles */}
          <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mr-1">
                Formatting:
              </span>

              {/* Paper Size Selector */}
              <div className="flex items-center bg-white border border-slate-300 rounded-lg p-0.5 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-600 px-2 flex items-center gap-1">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Size:</span>
                </span>
                <button
                  type="button"
                  onClick={() => setPaper((prev) => ({ ...prev, paperSize: 'a4' }))}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                    (paper.paperSize || 'a4') === 'a4'
                      ? 'bg-[#0F284E] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="A4 Standard Sheet (210 × 297 mm)"
                >
                  A4
                </button>
                <button
                  type="button"
                  onClick={() => setPaper((prev) => ({ ...prev, paperSize: 'legal' }))}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                    paper.paperSize === 'legal'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Legal Long Sheet (8.5 × 14.0 in)"
                >
                  Legal
                </button>
              </div>

              {/* Columns Toggle */}
              <button
                type="button"
                onClick={toggleColumns}
                className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg font-semibold transition-all shadow-2xs"
              >
                <Columns className="w-3.5 h-3.5 text-emerald-600" />
                <span>{paper.layoutColumns === 1 ? '1 Column Sheet' : '2 Column Layout'}</span>
              </button>

              {/* Font Size Cycle */}
              <button
                type="button"
                onClick={cycleFontSize}
                className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg font-semibold transition-all shadow-2xs"
              >
                <Type className="w-3.5 h-3.5 text-emerald-600" />
                <span>Font: <strong className="capitalize">{paper.fontSize}</strong></span>
              </button>

              {/* Watermark Toggle */}
              <button
                type="button"
                onClick={toggleWatermark}
                className={`flex items-center gap-1 px-3 py-1.5 border rounded-lg font-semibold transition-all shadow-2xs ${
                  paper.showWatermark
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-white text-slate-600 border-slate-300'
                }`}
              >
                <span>Watermark: {paper.showWatermark ? 'On' : 'Off'}</span>
              </button>

              {/* Bismillah Toggle */}
              <button
                type="button"
                onClick={toggleBismillah}
                className={`flex items-center gap-1 px-3 py-1.5 border rounded-lg font-semibold transition-all shadow-2xs ${
                  paper.showBismillah
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-white text-slate-600 border-slate-300'
                }`}
              >
                <span>Bismillah: {paper.showBismillah ? 'On' : 'Off'}</span>
              </button>

              {/* Student Metadata Table */}
              <button
                type="button"
                onClick={toggleStudentTable}
                className={`flex items-center gap-1 px-3 py-1.5 border rounded-lg font-semibold transition-all shadow-2xs ${
                  paper.showStudentTable
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-white text-slate-600 border-slate-300'
                }`}
              >
                <span>Student Table: {paper.showStudentTable ? 'On' : 'Off'}</span>
              </button>
            </div>

            <div className="text-[11px] text-slate-500 font-semibold italic">
              Active Subject: <strong className="text-emerald-700">{paper.subject}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
