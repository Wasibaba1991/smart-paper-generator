import React from 'react';
import { 
  Edit, 
  Trash2, 
  Copy, 
  ArrowUp, 
  ArrowDown, 
  Pencil, 
  Palette
} from 'lucide-react';
import type { Question, Language } from '../../types/exam';
import { MathRenderer } from '../MathRenderer';
import { PrePrimaryDrawingOutline } from '../common/PrePrimaryDrawings';

interface QuestionItemProps {
  question: Question;
  paperLanguage: Language;
  onEdit: (question: Question) => void;
  onDelete: (questionId: string) => void;
  onDuplicate: (question: Question) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  fontSize: 'compact' | 'standard' | 'large' | 'pre_primary';
  index: number;
}

export const QuestionItem: React.FC<QuestionItemProps> = ({
  question,
  paperLanguage,
  onEdit,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  fontSize,
  index,
}) => {
  const isUrdu = paperLanguage === 'ur' || question.language === 'ur';
  const isArabic = paperLanguage === 'ar' || question.language === 'ar';
  const isUrduOrArabic = isUrdu || isArabic;
  const isPrePrimary = fontSize === 'pre_primary' || 
    ['tracing', 'coloring_drawing', 'image_matching', 'count_and_circle'].includes(question.type);

  const fontClass = isUrdu ? 'font-urdu' : isArabic ? 'font-arabic' : isPrePrimary ? 'font-kids' : '';

  const textSizeClasses = {
    compact: 'text-xs',
    standard: 'text-sm',
    large: 'text-base',
    pre_primary: 'text-base sm:text-lg font-bold',
  }[fontSize || 'standard'];

  return (
    <div 
      className={`group relative border border-transparent hover:border-slate-300 p-2 sm:p-3 rounded-xl transition-all question-item ${
        isPrePrimary ? 'bg-slate-50/40 border-slate-200/80 mb-3' : ''
      }`}
      dir={isUrduOrArabic ? 'rtl' : 'ltr'}
    >
      {/* Teacher Action Hover Bar (Hidden on print) */}
      <div 
        className={`no-print absolute top-1 ${isUrduOrArabic ? 'left-1' : 'right-1'} z-10 hidden group-hover:flex items-center gap-1 bg-white/95 border border-slate-200 rounded-md shadow px-1.5 py-0.5 text-slate-600`}
        dir="ltr"
      >
        {onMoveUp && (
          <button onClick={onMoveUp} title="Move Up" className="p-1 hover:text-slate-900 transition-colors">
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        )}
        {onMoveDown && (
          <button onClick={onMoveDown} title="Move Down" className="p-1 hover:text-slate-900 transition-colors">
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        )}
        <button onClick={() => onDuplicate(question)} title="Duplicate Question" className="p-1 hover:text-emerald-600 transition-colors">
          <Copy className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => onEdit(question)} title="Edit Question" className="p-1 hover:text-blue-600 transition-colors">
          <Edit className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => onDelete(question.id)} title="Delete Question" className="p-1 hover:text-red-600 transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Question Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          {/* Question Title & Badge Header */}
          <div className="flex items-baseline gap-2">
            {/* Question Number Badge */}
            <span className={`inline-flex items-center justify-center font-black text-[#0F284E] flex-shrink-0 ${
              isPrePrimary 
                ? 'w-7 h-7 rounded-full bg-amber-100 border border-amber-400 text-amber-900 text-xs sm:text-sm'
                : textSizeClasses
            }`}>
              {isUrduOrArabic ? `سوال ${question.questionNumber || index + 1}:` : `Q${question.questionNumber || index + 1}.`}
            </span>

            {/* Question Text */}
            <div className={`text-slate-900 leading-relaxed font-semibold ${textSizeClasses} ${fontClass}`}>
              <MathRenderer content={question.text} isUrduOrArabic={isUrduOrArabic} />
            </div>
          </div>

          {/* Secondary Text for Bilingual papers */}
          {question.secondaryText && (
            <div className={`mt-0.5 text-slate-600 text-xs italic ${isUrduOrArabic ? 'font-sans' : 'font-urdu'}`}>
              <MathRenderer content={question.secondaryText} />
            </div>
          )}

          {/* ========================================================================
              FORMAT 1: PRE-PRIMARY ALPHABET & NUMBER TRACING (Dotted Guidelines)
              ======================================================================== */}
          {question.type === 'tracing' && (
            <div className="mt-3 space-y-3">
              {/* Optional Tracing Guide Text */}
              {question.tracingGuideText && (
                <p className="text-xs text-slate-500 font-semibold italic flex items-center gap-1.5">
                  <Pencil className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{question.tracingGuideText}</span>
                </p>
              )}

              {/* Tracing Characters Grid */}
              <div className="space-y-2.5">
                {(question.tracingLetters || ['A a', 'B b', 'C c', 'D d']).map((letter, lIdx) => (
                  <div key={lIdx} className="border border-slate-300 rounded-lg p-2 bg-white shadow-2xs">
                    {/* Practice Track */}
                    <div className="flex items-center gap-3">
                      {/* 1. Solid Model Character (Model to copy) */}
                      <div className="w-14 h-12 flex items-center justify-center bg-emerald-50 border-2 border-emerald-600 rounded-lg flex-shrink-0">
                        <span className={`text-2xl font-black text-[#0F284E] tracking-wider ${isUrduOrArabic ? 'font-urdu text-3xl' : 'font-mono'}`}>
                          {letter}
                        </span>
                      </div>

                      {/* 2. Dotted Trace Characters on Guidelines */}
                      <div className="flex-1 overflow-x-auto">
                        <div className={isUrduOrArabic ? 'handwriting-lines-urdu' : 'handwriting-lines-4'}>
                          <div className="flex items-center justify-around w-full px-2" dir={isUrduOrArabic ? 'rtl' : 'ltr'}>
                            {[1, 2, 3, 4].map((step) => (
                              <div key={step} className="flex flex-col items-center">
                                <span 
                                  className={`text-xl sm:text-2xl font-black tracking-widest select-none ${
                                    isUrduOrArabic ? 'font-urdu' : 'font-mono font-tracing'
                                  } ${
                                    step <= 2 
                                      ? 'text-slate-400 border-b-2 border-dotted border-slate-400' 
                                      : 'text-slate-300 opacity-60'
                                  }`}
                                  style={{
                                    textShadow: step <= 2 ? '0 0 1px #64748B' : undefined,
                                    letterSpacing: '0.15em'
                                  }}
                                >
                                  {step === 4 ? ' ' : letter}
                                </span>
                                <span className="text-[9px] text-slate-400 font-mono mt-0.5 select-none">
                                  {step <= 2
                                    ? (isUrduOrArabic ? '• پنسل پھیریں' : '• Trace')
                                    : (isUrduOrArabic ? '• خود لکھیں' : '• Write')}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================
              FORMAT 2: PRE-PRIMARY DRAWING & COLORING TASK BOX
              ======================================================================== */}
          {question.type === 'coloring_drawing' && (
            <div className="mt-3">
              <div className="border-2 border-dashed border-slate-400 rounded-2xl p-4 sm:p-5 bg-gradient-to-b from-white to-slate-50/60 relative overflow-hidden">
                {/* Visual Coloring Prompt Cue Banner */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-amber-100 text-amber-800">
                      <Palette className="w-4 h-4" />
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-800">
                      {question.drawingInstruction || 'Color the outline neatly inside the lines / رنگ بھریں'}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Art & Coloring Box
                  </span>
                </div>

                {/* Center Coloring Illustration Outline */}
                <div className="min-h-[160px] flex flex-col items-center justify-center p-3">
                  {question.drawingOutlineType && question.drawingOutlineType !== 'custom_box' ? (
                    <div className="flex flex-col items-center gap-2">
                      <PrePrimaryDrawingOutline 
                        type={question.drawingOutlineType} 
                        className="w-36 h-36 sm:w-44 sm:h-44 text-slate-800 filter drop-shadow-xs" 
                      />
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest select-none">
                        ✎ Draw & Color Area
                      </span>
                    </div>
                  ) : (
                    /* Free Drawing Canvas with faint dots */
                    <div className="w-full h-40 border border-dashed border-slate-300 rounded-xl bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] flex flex-col items-center justify-center text-slate-400">
                      <Pencil className="w-8 h-8 text-slate-300 mb-1" />
                      <span className="text-xs font-semibold">باکس کے اندر خوبصورت تصویر بنائیں اور رنگ بھریں</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">(Student Drawing Canvas)</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================
              FORMAT 3: PRE-PRIMARY IMAGE & OBJECT MATCHING (Draw lines to match)
              ======================================================================== */}
          {question.type === 'image_matching' && question.visualPairs && (
            <div className="mt-3 border border-slate-300 rounded-xl p-3 sm:p-4 bg-white shadow-2xs">
              <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-2 border-b border-slate-200 pb-1 flex items-center justify-between">
                <span>Column A (تصاویر / اشیاء)</span>
                <span className="text-emerald-700 italic">پنسل سے لکیر کھینچ کر ملائیں (Draw Connecting Lines)</span>
                <span>Column B (الفاظ / حروف)</span>
              </div>

              <div className="space-y-3">
                {question.visualPairs.map((pair) => (
                  <div 
                    key={pair.id} 
                    className="flex items-center justify-between gap-4 p-2 rounded-lg bg-slate-50 border border-slate-200 hover:bg-emerald-50/50 transition-colors"
                  >
                    {/* Left Object & Connect Node */}
                    <div className="flex items-center gap-3">
                      {pair.leftIcon && (
                        <span className="text-2xl sm:text-3xl filter drop-shadow-xs select-none">
                          {pair.leftIcon}
                        </span>
                      )}
                      <div>
                        <span className={`font-bold text-slate-900 text-sm sm:text-base ${fontClass}`}>
                          {pair.leftText}
                        </span>
                        {pair.leftSubtext && (
                          <span className="block text-[10px] text-slate-500 font-medium">
                            {pair.leftSubtext}
                          </span>
                        )}
                      </div>
                      <span className="match-anchor-dot ml-1" title="Start connection line from here"></span>
                    </div>

                    {/* Dotted Center Space Guide */}
                    <div className="flex-1 border-b-2 border-dotted border-slate-300 mx-2 hidden sm:block opacity-60"></div>

                    {/* Right Target & Connect Node */}
                    <div className="flex items-center gap-3">
                      <span className="match-anchor-dot mr-1" title="Connect line to here"></span>
                      {pair.rightIcon && (
                        <span className="text-2xl sm:text-3xl select-none">
                          {pair.rightIcon}
                        </span>
                      )}
                      <div className="text-right">
                        <span className={`font-black text-slate-900 text-sm sm:text-base ${isUrduOrArabic ? 'font-urdu text-lg' : 'font-mono'}`}>
                          {pair.rightText}
                        </span>
                        {pair.rightSubtext && (
                          <span className="block text-[10px] text-slate-500 font-medium">
                            {pair.rightSubtext}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================
              FORMAT 4: PRE-PRIMARY COUNT & CIRCLE (Count items and circle number)
              ======================================================================== */}
          {question.type === 'count_and_circle' && (
            <div className="mt-3 space-y-2">
              <div className="p-3 border border-slate-300 rounded-xl bg-slate-50/60 space-y-3">
                {(question.countItemsList || [
                  { icon: '🍎', count: 4, label: 'Apples' },
                  { icon: '⭐', count: 3, label: 'Stars' },
                  { icon: '🎈', count: 5, label: 'Balloons' }
                ]).map((item, cIdx) => (
                  <div key={cIdx} className="flex flex-wrap items-center justify-between gap-3 p-2 bg-white rounded-lg border border-slate-200">
                    {/* Visual Countable Items */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 w-5">{cIdx + 1}.</span>
                      <div className="flex flex-wrap items-center gap-2">
                        {Array.from({ length: item.count }).map((_, i) => (
                          <span key={i} className="text-2xl sm:text-3xl select-none hover:scale-110 transition-transform">
                            {item.icon}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Number Bubbles to Circle */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 mr-1">{isUrduOrArabic ? 'درست ہندسے پر دائرہ لگائیں:' : 'Circle the correct number:'}</span>
                      {[item.count - 1, item.count, item.count + 1].filter(n => n > 0).map((num) => (
                        <span 
                          key={num}
                          className="w-8 h-8 rounded-full border-2 border-slate-800 bg-white flex items-center justify-center font-black text-sm text-slate-900 shadow-2xs hover:border-emerald-600 hover:bg-emerald-50 cursor-pointer"
                        >
                          {num}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================
              STANDARD FORMAT: MCQ OPTIONS DISPLAY
              ======================================================================== */}
          {question.type === 'mcq' && question.options && question.options.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 pt-1">
              {question.options.map((opt) => (
                <div 
                  key={opt.id} 
                  className={`flex items-baseline gap-1.5 text-slate-800 ${
                    isPrePrimary ? 'p-2 rounded-lg border border-slate-200 bg-slate-50/50 text-sm' : 'text-xs'
                  }`}
                >
                  <span className="font-bold text-slate-900">
                    ({opt.label})
                  </span>
                  {opt.icon && <span className="text-lg mr-1">{opt.icon}</span>}
                  <span className={`${fontClass}`}>
                    <MathRenderer content={opt.text} />
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* ========================================================================
              STANDARD FORMAT: VOCABULARY / MATCHING COLUMNS
              ======================================================================== */}
          {question.type === 'vocabulary' && question.columnMatchLeft && question.columnMatchRight && (
            <div className="mt-2 border border-slate-300 rounded p-2 bg-slate-50/50 max-w-xl text-xs">
              <div className="grid grid-cols-2 gap-4 font-bold border-b border-slate-300 pb-1 mb-1.5 text-slate-700">
                <span>Column A / الفاظ</span>
                <span>Column B / معانی</span>
              </div>
              <div className="space-y-1">
                {question.columnMatchLeft.map((leftItem, i) => (
                  <div key={i} className="grid grid-cols-2 gap-4 text-slate-800">
                    <span className={fontClass}>• <MathRenderer content={leftItem} /></span>
                    <span className={fontClass}>• <MathRenderer content={question.columnMatchRight?.[i] || ''} /></span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================
              STANDARD FORMAT: FILL IN THE BLANK
              ======================================================================== */}
          {question.type === 'fill_in_the_blank' && !question.text.includes('____') && (
            <div className="mt-1 text-slate-400 text-xs tracking-widest font-mono">
              _____________________________
            </div>
          )}
        </div>

        {/* Right Corner Marks & Optional Pre-Primary Smile / Star Stamp */}
        <div className="flex-shrink-0 text-right flex flex-col items-end gap-1">
          <span className="text-[11px] font-bold text-slate-700 border border-slate-300 bg-slate-50 px-2 py-0.5 rounded shadow-2xs">
            [{question.marks} {question.marks === 1 ? 'Mark' : 'Marks'}]
          </span>

          {isPrePrimary && (
            <span className="text-[10px] text-amber-700 font-bold bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded flex items-center gap-1 select-none">
              <span>⭐</span>
              <span>ستارہ</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
