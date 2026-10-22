import React, { useRef, useState } from 'react';
import { 
  UploadCloud, 
  Image as ImageIcon, 
  Sliders, 
  Sparkles, 
  RefreshCw,
  Eye,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { OCR_PRESETS, type OcrPreset } from '../../data/ocrPresets';
import type { Subject, GradeLevel, ExamTerm, Language } from '../../types/exam';

interface OcrUploaderProps {
  onStartOcr: (
    imageDataUrl: string, 
    rawPresetText?: string,
    presetMetadata?: {
      subject?: Subject;
      gradeLevel?: GradeLevel;
      language?: Language;
      examTerm?: ExamTerm;
      totalMarks?: number;
      timeAllowed?: string;
    }
  ) => void;
  onPresetSelect?: (preset: OcrPreset) => void;
  isProcessing: boolean;
}

export const OcrUploader: React.FC<OcrUploaderProps> = ({ onStartOcr, onPresetSelect, isProcessing }) => {
  const [selectedImage, setSelectedImage] = useState<string>(OCR_PRESETS[0].imageMockUrl);
  const [selectedPreset, setSelectedPreset] = useState<OcrPreset | null>(OCR_PRESETS[0]);
  const [contrast, setContrast] = useState<number>(115);
  const [brightness, setBrightness] = useState<number>(105);
  const [grayscale, setGrayscale] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
          setSelectedPreset(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (preset: OcrPreset) => {
    setSelectedPreset(preset);
    setSelectedImage(preset.imageMockUrl);
    onPresetSelect?.(preset);
  };

  const handleRunOcr = () => {
    onStartOcr(
      selectedImage, 
      selectedPreset?.extractedRawText,
      selectedPreset ? {
        subject: selectedPreset.subject,
        gradeLevel: selectedPreset.gradeLevel,
        language: selectedPreset.language,
        examTerm: selectedPreset.examTerm,
        totalMarks: selectedPreset.totalMarks,
        timeAllowed: selectedPreset.timeAllowed,
      } : undefined
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header bar */}
      <div className="bg-gradient-to-r from-[#0F284E] to-[#1E3A8A] text-white p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500 text-slate-900 uppercase tracking-wide">
                Mode 1
              </span>
              <h2 className="text-xl font-bold">OCR Digitization & Formatting Studio</h2>
            </div>
            <p className="text-xs text-slate-200 mt-1">
              Upload handwritten test sheets, teacher notes, or mobile snapshots. AI extracts questions and formats them into an official academy paper.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Quick Sample Presets Picker */}
        <div className="mb-6">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Or test with ready-made handwritten exam snapshots:</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {OCR_PRESETS.map((preset) => {
              const isSelected = selectedPreset?.id === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/80 shadow-sm ring-2 ring-emerald-500'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                      {preset.category}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{preset.title}</h4>
                  
                  {/* Subject and Class metadata badge */}
                  <div className="mt-1 flex flex-wrap items-center gap-1">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/90 px-1.5 py-0.5 rounded">
                      {preset.subject.split('(')[0].trim()}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-600 bg-slate-200/80 px-1.5 py-0.5 rounded">
                      {preset.gradeLevel.split('(')[0].trim()}
                    </span>
                    <span className="text-[10px] font-black text-[#0F284E] bg-white border border-slate-200 px-1 py-0.5 rounded ml-auto">
                      {preset.totalMarks}M
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 line-clamp-2 mt-1.5">{preset.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Upload & Image Enhancement Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Upload Dropzone & Controls */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-6 text-center cursor-pointer transition-all bg-slate-50/50 hover:bg-emerald-50/20 flex flex-col items-center justify-center min-h-[180px]"
            >
              <UploadCloud className="w-10 h-10 text-emerald-600 mb-2" />
              <p className="text-sm font-semibold text-slate-800">
                Click to upload snapshot or drag & drop
              </p>
              <p className="text-xs text-slate-500 mt-1">
                PNG, JPG, JPEG or scanned notes (Handwritten, Urdu, Arabic or Math)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Image Enhancement Panel */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-800 uppercase tracking-wide">
                <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                <span>Handwriting Enhancement Filters</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>Ink Contrast:</span>
                    <span className="font-semibold text-slate-800">{contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="180"
                    value={contrast}
                    onChange={(e) => setContrast(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg accent-emerald-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>Paper Brightness:</span>
                    <span className="font-semibold text-slate-800">{brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="140"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg accent-emerald-600 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-600">B&W Document Filter (Noise Reduction):</span>
                  <input
                    type="checkbox"
                    checked={grayscale}
                    onChange={(e) => setGrayscale(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Launch OCR Button */}
            <button
              onClick={handleRunOcr}
              disabled={isProcessing || !selectedImage}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50 text-sm"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing & Segmenting Document...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Digitize Paper with Smart OCR</span>
                </>
              )}
            </button>
          </div>

          {/* Right: Live Enhanced Preview Window */}
          <div className="lg:col-span-7 bg-slate-900/5 rounded-xl border border-slate-200 p-4 flex flex-col">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>Paper Preview (Pre-processed Image)</span>
              </span>
              <span className="text-[11px] text-emerald-700 font-medium">
                {grayscale ? 'Enhanced Monochromatic Mode' : 'Natural Color Mode'}
              </span>
            </div>

            <div className="flex-1 flex items-center justify-center overflow-hidden rounded-lg bg-slate-100 min-h-[360px] max-h-[460px] border border-slate-300 shadow-inner">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Exam preview"
                  style={{
                    filter: `contrast(${contrast}%) brightness(${brightness}%) ${grayscale ? 'grayscale(100%)' : ''}`,
                  }}
                  className="max-h-[440px] w-auto object-contain transition-all duration-200 shadow-md"
                />
              ) : (
                <div className="text-center text-slate-400">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">No image selected</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
