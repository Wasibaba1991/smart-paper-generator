import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Code2, 
  Pencil, 
  Palette
} from 'lucide-react';
import type { Question, QuestionType, QuestionOption, Language, ExamSection } from '../../types/exam';
import { MathRenderer } from '../MathRenderer';

interface QuestionEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: Question | null;
  sections: ExamSection[];
  onSave: (question: Question, targetSectionId?: string) => void;
}

export const QuestionEditorModal: React.FC<QuestionEditorModalProps> = ({
  isOpen,
  onClose,
  question,
  sections,
  onSave,
}) => {
  const [text, setText] = useState<string>('');
  const [type, setType] = useState<QuestionType>('short');
  const [marks, setMarks] = useState<number>(3);
  const [targetSectionId, setTargetSectionId] = useState<string>(sections[0]?.id || '');
  const [options, setOptions] = useState<QuestionOption[]>([]);
  const [blankAnswer, setBlankAnswer] = useState<string>('');
  const [sampleAnswer, setSampleAnswer] = useState<string>('');
  const [lang, setLang] = useState<Language>('ur');

  // Pre-Primary state
  const [tracingLettersStr, setTracingLettersStr] = useState<string>('A a, B b, C c, D d');
  const [tracingGuideText, setTracingGuideText] = useState<string>('Start at the top line and follow the pencil path.');
  const [drawingOutlineType, setDrawingOutlineType] = useState<'apple' | 'flower' | 'star' | 'crescent' | 'tree' | 'car' | 'mosque' | 'boat' | 'custom_box'>('apple');
  const [drawingInstruction, setDrawingInstruction] = useState<string>('Color neatly inside the lines with bright colors.');

  useEffect(() => {
    if (question) {
      setText(question.text || '');
      setType(question.type || 'short');
      setMarks(question.marks || 3);
      setOptions(question.options || []);
      setBlankAnswer(question.blankAnswer || '');
      setSampleAnswer(question.sampleAnswer || '');
      setLang(question.language || 'ur');
      if (question.tracingLetters) {
        setTracingLettersStr(question.tracingLetters.join(', '));
      } else {
        setTracingLettersStr('A a, B b, C c, D d');
      }
      setTracingGuideText(question.tracingGuideText || 'Start at the top line and follow the pencil path.');
      setDrawingOutlineType(question.drawingOutlineType || 'apple');
      setDrawingInstruction(question.drawingInstruction || 'Color neatly inside the lines with bright colors.');
    } else {
      setText('');
      setType('short');
      setMarks(3);
      setOptions([
        { id: '1', label: 'A', text: 'Option A' },
        { id: '2', label: 'B', text: 'Option B' },
        { id: '3', label: 'C', text: 'Option C' },
        { id: '4', label: 'D', text: 'Option D' },
      ]);
      setBlankAnswer('');
      setSampleAnswer('');
      setLang('ur');
      setTracingLettersStr('A a, B b, C c, D d');
      setTracingGuideText('Start at the top line and follow the pencil path.');
      setDrawingOutlineType('apple');
      setDrawingInstruction('Color neatly inside the lines with bright colors.');
    }
  }, [question, isOpen]);

  if (!isOpen) return null;

  const handleInsertMathSnippet = (snippet: string) => {
    setText((prev) => prev + snippet);
  };

  const handleAddOption = () => {
    const nextIdx = options.length;
    const label = lang === 'ur' ? ['الف', 'ب', 'ج', 'د', 'ہ'][nextIdx] || `${nextIdx + 1}` : String.fromCharCode(65 + nextIdx);
    setOptions((prev) => [
      ...prev,
      { id: `opt-${Date.now()}`, label, text: `Option ${label}` },
    ]);
  };

  const handleUpdateOption = (id: string, newText: string) => {
    setOptions((prev) => prev.map((o) => (o.id === id ? { ...o, text: newText } : o)));
  };

  const handleRemoveOption = (id: string) => {
    setOptions((prev) => prev.filter((o) => o.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedQuestion: Question = {
      id: question?.id || `q-custom-${Date.now()}`,
      questionNumber: question?.questionNumber || 1,
      type,
      text,
      marks,
      options: type === 'mcq' ? options : question?.options,
      blankAnswer: type === 'fill_in_the_blank' ? blankAnswer : undefined,
      sampleAnswer,
      language: lang,
      tracingLetters: type === 'tracing' ? tracingLettersStr.split(',').map(s => s.trim()).filter(Boolean) : undefined,
      tracingGuideText: type === 'tracing' ? tracingGuideText : undefined,
      drawingOutlineType: type === 'coloring_drawing' ? drawingOutlineType : undefined,
      drawingInstruction: type === 'coloring_drawing' ? drawingInstruction : undefined,
      visualPairs: type === 'image_matching' ? (question?.visualPairs || [
        { id: 'vp-1', leftIcon: '🍎', leftText: 'Apple', rightText: 'Letter A', rightIcon: '🅰️' },
        { id: 'vp-2', leftIcon: '🎈', leftText: 'Balloon', rightText: 'Letter B', rightIcon: '🅱️' },
        { id: 'vp-3', leftIcon: '🐱', leftText: 'Cat', rightText: 'Letter C', rightIcon: '🅲' },
        { id: 'vp-4', leftIcon: '🦆', leftText: 'Duck', rightText: 'Letter D', rightIcon: '🅳' },
      ]) : undefined,
      countItemsList: type === 'count_and_circle' ? (question?.countItemsList || [
        { icon: '🍎', count: 3, label: 'Apples' },
        { icon: '⭐', count: 4, label: 'Stars' },
        { icon: '🎈', count: 5, label: 'Balloons' },
      ]) : undefined,
    };
    onSave(updatedQuestion, targetSectionId);
    onClose();
  };

  const isUrduOrArabic = lang === 'ur' || lang === 'ar';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto no-print">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6">
        {/* Header */}
        <div className="bg-[#0F284E] text-white p-5 flex items-center justify-between">
          <h3 className="font-bold text-base flex items-center gap-2">
            <span>{question ? 'Edit Question' : 'Add New Question'}</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {/* Section & Type Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Target Section:</label>
              <select
                value={targetSectionId}
                onChange={(e) => setTargetSectionId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium text-slate-800"
              >
                {sections.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    {sec.sectionTitle}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Question Type:</label>
              <select
                value={type}
                onChange={(e) => {
                  const newType = e.target.value as QuestionType;
                  setType(newType);
                  if (newType === 'mcq' || newType === 'fill_in_the_blank') setMarks(1);
                  else if (newType === 'short') setMarks(3);
                  else if (newType === 'long') setMarks(8);
                  else if (newType === 'tracing') setMarks(8);
                  else if (newType === 'image_matching' || newType === 'count_and_circle') setMarks(6);
                  else if (newType === 'coloring_drawing') setMarks(5);
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium text-slate-800"
              >
                <optgroup label="Kindergarten & Pre-Primary">
                  <option value="tracing">Tracing (Letters / Numbers Handwriting)</option>
                  <option value="coloring_drawing">Coloring & Drawing Box</option>
                  <option value="image_matching">Image & Object Matching</option>
                  <option value="count_and_circle">Count & Circle Objects</option>
                </optgroup>
                <optgroup label="Standard Exam Formats">
                  <option value="mcq">MCQ (Multiple Choice)</option>
                  <option value="fill_in_the_blank">Fill in the Blank</option>
                  <option value="short">Short Answer Question</option>
                  <option value="long">Long / Subjective Question</option>
                  <option value="vocabulary">Vocabulary / Column Match</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Marks Assigned:</label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={marks}
                onChange={(e) => setMarks(parseFloat(e.target.value) || 1)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-slate-900"
              />
            </div>
          </div>

          {/* Quick Math / KaTeX Formula Insert Bar */}
          {type !== 'tracing' && type !== 'coloring_drawing' && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1">
                <Code2 className="w-3.5 h-3.5" />
                <span>Quick Formula Insert:</span>
              </span>
              <button
                type="button"
                onClick={() => handleInsertMathSnippet('$x^2$')}
                className="px-2 py-0.5 bg-white border border-slate-300 hover:border-emerald-500 rounded text-[11px] font-mono text-slate-800"
              >
                $x^2$
              </button>
              <button
                type="button"
                onClick={() => handleInsertMathSnippet('$\\frac{a}{b}$')}
                className="px-2 py-0.5 bg-white border border-slate-300 hover:border-emerald-500 rounded text-[11px] font-mono text-slate-800"
              >
                {'$\\frac{a}{b}$'}
              </button>
              <button
                type="button"
                onClick={() => handleInsertMathSnippet('$\\sqrt{x}$')}
                className="px-2 py-0.5 bg-white border border-slate-300 hover:border-emerald-500 rounded text-[11px] font-mono text-slate-800"
              >
                {'$\\sqrt{x}$'}
              </button>
              <button
                type="button"
                onClick={() => handleInsertMathSnippet('$\\theta$')}
                className="px-2 py-0.5 bg-white border border-slate-300 hover:border-emerald-500 rounded text-[11px] font-mono text-slate-800"
              >
                {'$\\theta$'}
              </button>
            </div>
          )}

          {/* Question Text Input */}
          <div>
            <label className="block text-slate-700 font-bold mb-1 flex items-center justify-between">
              <span>Question Statement:</span>
              <span className="text-slate-400 font-normal">Supports Urdu, Arabic & KaTeX</span>
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              dir={isUrduOrArabic ? 'rtl' : 'ltr'}
              className={`w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none ${
                isUrduOrArabic ? 'font-urdu text-sm' : ''
              }`}
              placeholder="Enter question text here..."
              required
            />
          </div>

          {/* Specialized Pre-Primary Controls: Tracing Letters */}
          {type === 'tracing' && (
            <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl space-y-3">
              <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                <Pencil className="w-4 h-4 text-emerald-600" />
                <span>Tracing Letters / Numbers (Comma-separated):</span>
              </div>
              <input
                type="text"
                value={tracingLettersStr}
                onChange={(e) => setTracingLettersStr(e.target.value)}
                placeholder="e.g. A a, B b, C c, D d OR 1, 2, 3, 4 OR ا, ب, پ, ت"
                className="w-full bg-white border border-amber-300 rounded-lg p-2 font-mono text-xs text-slate-800"
              />
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Teacher Guideline / Hint:</label>
                <input
                  type="text"
                  value={tracingGuideText}
                  onChange={(e) => setTracingGuideText(e.target.value)}
                  placeholder="e.g. Start at the top line and follow the pencil path."
                  className="w-full bg-white border border-amber-300 rounded-lg p-2 text-xs text-slate-800"
                />
              </div>
            </div>
          )}

          {/* Specialized Pre-Primary Controls: Coloring Box */}
          {type === 'coloring_drawing' && (
            <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-3">
              <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                <Palette className="w-4 h-4 text-emerald-700" />
                <span>Select Coloring Outline Illustration:</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'apple', label: '🍎 Apple' },
                  { id: 'crescent', label: '🌙 Crescent & Star' },
                  { id: 'star', label: '⭐ Star' },
                  { id: 'flower', label: '🌸 Flower' },
                  { id: 'mosque', label: '🕌 Mosque' },
                  { id: 'car', label: '🚗 Car' },
                  { id: 'boat', label: '⛵ Boat' },
                  { id: 'tree', label: '🌳 Fruit Tree' },
                  { id: 'custom_box', label: '✎ Free Draw Box' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDrawingOutlineType(item.id as any)}
                    className={`p-2 rounded-lg border text-left text-xs font-bold transition-all ${
                      drawingOutlineType === item.id
                        ? 'border-emerald-600 bg-emerald-100 text-emerald-900 shadow-2xs'
                        : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Coloring Instruction Prompt:</label>
                <input
                  type="text"
                  value={drawingInstruction}
                  onChange={(e) => setDrawingInstruction(e.target.value)}
                  placeholder="e.g. Color the apple red and leaf green / رنگ بھریں"
                  className="w-full bg-white border border-emerald-300 rounded-lg p-2 text-xs text-slate-800"
                />
              </div>
            </div>
          )}

          {/* MCQ Options Configuration */}
          {type === 'mcq' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-slate-700 font-bold">Multiple Choice Options:</label>
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Option</span>
                </button>
              </div>

              <div className="space-y-2">
                {options.map((opt) => (
                  <div key={opt.id} className="flex items-center gap-2">
                    <span className="w-6 text-center font-bold text-slate-700">({opt.label})</span>
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => handleUpdateOption(opt.id, e.target.value)}
                      dir={isUrduOrArabic ? 'rtl' : 'ltr'}
                      className="flex-1 bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                      placeholder="Option content..."
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(opt.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fill In Blank Correct Answer */}
          {type === 'fill_in_the_blank' && (
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Correct Blank Answer:
              </label>
              <input
                type="text"
                value={blankAnswer}
                onChange={(e) => setBlankAnswer(e.target.value)}
                dir={isUrduOrArabic ? 'rtl' : 'ltr'}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                placeholder="Correct word or phrase..."
              />
            </div>
          )}

          {/* Sample Solution / Answer for Marking Scheme */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Sample Solution / Rubric for Marking Scheme:
            </label>
            <textarea
              value={sampleAnswer}
              onChange={(e) => setSampleAnswer(e.target.value)}
              rows={2}
              dir={isUrduOrArabic ? 'rtl' : 'ltr'}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
              placeholder="Model answer or step-by-step marking guideline..."
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-sm transition-all cursor-pointer"
            >
              Save Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
