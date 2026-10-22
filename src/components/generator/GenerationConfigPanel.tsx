import React from 'react';
import { 
  Settings2, 
  Sparkles, 
  Calculator, 
  HelpCircle, 
  Clock, 
  BookOpen, 
  GraduationCap,
  ListOrdered,
  Layers,
  ArrowRight
} from 'lucide-react';
import type { BlueprintConfig, Subject, GradeLevel, ExamTerm, Language } from '../../types/exam';

interface GenerationConfigPanelProps {
  blueprint: BlueprintConfig;
  setBlueprint: React.Dispatch<React.SetStateAction<BlueprintConfig>>;
  onOpenClarification: () => void;
  canGenerate: boolean;
}

export const GenerationConfigPanel: React.FC<GenerationConfigPanelProps> = ({
  blueprint,
  setBlueprint,
  onOpenClarification,
  canGenerate,
}) => {
  // Compute total marks in real-time
  const mcqTotal = blueprint.mcqCount * blueprint.mcqMarksEach;
  const blanksTotal = blueprint.blanksCount * blueprint.blanksMarksEach;
  const vocabTotal = blueprint.vocabCount * blueprint.vocabMarksEach;
  const shortTotal = blueprint.shortCountToAttempt * blueprint.shortMarksEach;
  const longTotal = blueprint.longCountToAttempt * blueprint.longMarksEach;
  const computedTotal = mcqTotal + blanksTotal + vocabTotal + shortTotal + longTotal;

  const handleChange = <K extends keyof BlueprintConfig>(key: K, value: BlueprintConfig[K]) => {
    setBlueprint((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#0F284E] text-white uppercase tracking-wide">
              Step 2
            </span>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Exam Configuration & Question Distribution
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Specify subject, class, question quantities, marks per question, and internal choices.
          </p>
        </div>

        {/* Live Total Marks Summary Widget */}
        <div className="flex items-center gap-2 bg-[#0F284E] text-white px-4 py-2 rounded-xl shadow-sm">
          <Calculator className="w-4 h-4 text-emerald-400" />
          <div className="text-right">
            <span className="text-[10px] text-slate-300 uppercase font-semibold block leading-tight">
              Calculated Total
            </span>
            <span className="text-lg font-black text-emerald-300 leading-tight">
              {computedTotal} Marks
            </span>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Row 1: Academic Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>Subject</span>
            </label>
            <select
              value={blueprint.subject}
              onChange={(e) => {
                const sub = e.target.value as Subject;
                handleChange('subject', sub);
                // Auto switch language based on subject
                if (sub.includes('Islamic') || sub.includes('اسلامیات') || sub.includes('Urdu') || sub.includes('اردو')) {
                  handleChange('language', 'ur');
                } else if (sub.includes('Arabic') || sub.includes('العربية')) {
                  handleChange('language', 'ar');
                } else if (sub.includes('Math') || sub.includes('ریاضی')) {
                  handleChange('language', 'math');
                } else {
                  handleChange('language', 'en');
                }
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
              <span>Class / Grade</span>
            </label>
            <select
              value={blueprint.grade}
              onChange={(e) => handleChange('grade', e.target.value as GradeLevel)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Exam Term & Time</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={blueprint.examTerm}
                onChange={(e) => handleChange('examTerm', e.target.value as ExamTerm)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Mid-Term Examination 2026">Mid-Term 2026</option>
                <option value="Final Term Examination">Final Term</option>
                <option value="First Monthly Assessment">Monthly Test</option>
                <option value="Pre-Board Preparatory Exam">Pre-Board</option>
                <option value="Weekly Quiz Assessment">Weekly Quiz</option>
              </select>

              <select
                value={blueprint.timeAllowed}
                onChange={(e) => handleChange('timeAllowed', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="45 Minutes">45 Min</option>
                <option value="1 Hour">1 Hour</option>
                <option value="1 Hour 30 Minutes">1.5 Hours</option>
                <option value="2 Hours">2 Hours</option>
                <option value="2 Hours 30 Minutes">2.5 Hours</option>
                <option value="3 Hours">3 Hours</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              <span>Language & Typography</span>
            </label>
            <select
              value={blueprint.language}
              onChange={(e) => handleChange('language', e.target.value as Language)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="ur">Urdu (اردو Nastaliq RTL)</option>
              <option value="ar">Arabic (عربي Naskh / Amiri)</option>
              <option value="math">Mathematics (KaTeX LaTeX)</option>
              <option value="en">English (Standard)</option>
              <option value="bilingual">Bilingual (English + Urdu)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              <span>Paper Size</span>
            </label>
            <select
              value={blueprint.paperSize || 'a4'}
              onChange={(e) => handleChange('paperSize', e.target.value as 'a4' | 'legal')}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="a4">A4 (210 × 297 mm)</option>
              <option value="legal">Legal (8.5 × 14.0 in)</option>
            </select>
          </div>
        </div>

        {/* Row 2: Question Quantities & Marks Grid */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-100/70 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wide">
            <span className="flex items-center gap-1.5">
              <ListOrdered className="w-4 h-4 text-emerald-600" />
              <span>Question Distribution Table</span>
            </span>
            <span className="text-slate-500 font-normal">Customizable per section</span>
          </div>

          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 bg-white text-xs">
            {/* 1. MCQs */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="flex justify-between items-center mb-2 font-bold text-slate-800">
                <span>1. MCQs (Objective)</span>
                <span className="text-emerald-700 font-bold">{mcqTotal} Marks</span>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-[11px] text-slate-500 block mb-0.5">Quantity:</span>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={blueprint.mcqCount}
                    onChange={(e) => handleChange('mcqCount', Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-white border border-slate-300 rounded p-1.5 font-bold text-slate-900"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block mb-0.5">Marks Each:</span>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={blueprint.mcqMarksEach}
                    onChange={(e) => handleChange('mcqMarksEach', parseFloat(e.target.value) || 1)}
                    className="w-full bg-white border border-slate-300 rounded p-1.5 text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* 2. Fill in the blanks */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="flex justify-between items-center mb-2 font-bold text-slate-800">
                <span>2. Fill in the Blanks</span>
                <span className="text-emerald-700 font-bold">{blanksTotal} Marks</span>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-[11px] text-slate-500 block mb-0.5">Quantity:</span>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={blueprint.blanksCount}
                    onChange={(e) => handleChange('blanksCount', Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-white border border-slate-300 rounded p-1.5 font-bold text-slate-900"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block mb-0.5">Marks Each:</span>
                  <input
                    type="number"
                    min="1"
                    value={blueprint.blanksMarksEach}
                    onChange={(e) => handleChange('blanksMarksEach', parseFloat(e.target.value) || 1)}
                    className="w-full bg-white border border-slate-300 rounded p-1.5 text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* 3. Vocabulary / Meanings */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="flex justify-between items-center mb-2 font-bold text-slate-800">
                <span>3. Vocab / Meanings</span>
                <span className="text-emerald-700 font-bold">{vocabTotal} Marks</span>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-[11px] text-slate-500 block mb-0.5">Words Count:</span>
                  <input
                    type="number"
                    min="0"
                    max="15"
                    value={blueprint.vocabCount}
                    onChange={(e) => handleChange('vocabCount', Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-white border border-slate-300 rounded p-1.5 font-bold text-slate-900"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block mb-0.5">Marks Per Word:</span>
                  <input
                    type="number"
                    min="1"
                    value={blueprint.vocabMarksEach}
                    onChange={(e) => handleChange('vocabMarksEach', parseFloat(e.target.value) || 1)}
                    className="w-full bg-white border border-slate-300 rounded p-1.5 text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* 4. Short Questions */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="flex justify-between items-center mb-2 font-bold text-slate-800">
                <span>4. Short Questions</span>
                <span className="text-emerald-700 font-bold">{shortTotal} Marks</span>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-1.5">
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-0.5">Total Qs:</span>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={blueprint.shortCountTotal}
                      onChange={(e) => handleChange('shortCountTotal', Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-white border border-slate-300 rounded p-1.5 font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-0.5">To Attempt:</span>
                    <input
                      type="number"
                      min="1"
                      max={blueprint.shortCountTotal}
                      value={blueprint.shortCountToAttempt}
                      onChange={(e) => handleChange('shortCountToAttempt', Math.min(blueprint.shortCountTotal, Math.max(1, parseInt(e.target.value) || 1)))}
                      className="w-full bg-white border border-slate-300 rounded p-1.5 font-bold text-emerald-800"
                    />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block mb-0.5">Marks Each:</span>
                  <input
                    type="number"
                    min="1"
                    value={blueprint.shortMarksEach}
                    onChange={(e) => handleChange('shortMarksEach', parseFloat(e.target.value) || 3)}
                    className="w-full bg-white border border-slate-300 rounded p-1.5 text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* 5. Long / Subjective Questions */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="flex justify-between items-center mb-2 font-bold text-slate-800">
                <span>5. Long Questions</span>
                <span className="text-emerald-700 font-bold">{longTotal} Marks</span>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-1.5">
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-0.5">Total Qs:</span>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={blueprint.longCountTotal}
                      onChange={(e) => handleChange('longCountTotal', Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-white border border-slate-300 rounded p-1.5 font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-0.5">To Attempt:</span>
                    <input
                      type="number"
                      min="1"
                      max={blueprint.longCountTotal}
                      value={blueprint.longCountToAttempt}
                      onChange={(e) => handleChange('longCountToAttempt', Math.min(blueprint.longCountTotal, Math.max(1, parseInt(e.target.value) || 1)))}
                      className="w-full bg-white border border-slate-300 rounded p-1.5 font-bold text-emerald-800"
                    />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block mb-0.5">Marks Each:</span>
                  <input
                    type="number"
                    min="1"
                    value={blueprint.longMarksEach}
                    onChange={(e) => handleChange('longMarksEach', parseFloat(e.target.value) || 8)}
                    className="w-full bg-white border border-slate-300 rounded p-1.5 text-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Generate / Review Blueprint Trigger */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Preliminary Step:</span> A detailed clarification and weightage review modal will appear before generating.
          </div>

          <button
            onClick={onOpenClarification}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Review Blueprint & Generate Exam Paper</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
