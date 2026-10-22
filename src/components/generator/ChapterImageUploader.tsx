import React, { useRef, useState } from 'react';
import { 
  Upload, 
  Trash2, 
  Eye, 
  Image as ImageIcon, 
  Plus, 
  CheckCircle, 
  AlertCircle,
  Sparkles,
  BookMarked
} from 'lucide-react';
import type { UploadedChapterPage } from '../../types/exam';
import { PRESET_CHAPTER_COLLECTIONS, type ChapterCollectionPreset } from '../../data/presetChapters';

interface ChapterImageUploaderProps {
  pages: UploadedChapterPage[];
  setPages: React.Dispatch<React.SetStateAction<UploadedChapterPage[]>>;
  onPreviewImage: (url: string, title?: string) => void;
}

export const ChapterImageUploader: React.FC<ChapterImageUploaderProps> = ({
  pages,
  setPages,
  onPreviewImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('chap-islamiat-hujurat');

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPages: UploadedChapterPage[] = [];
    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const pageObj: UploadedChapterPage = {
            id: `upload-${Date.now()}-${index}`,
            name: file.name,
            size: file.size,
            dataUrl: event.target.result as string,
            previewUrl: event.target.result as string,
            pageNumber: pages.length + newPages.length + 1,
            chapterTitle: `Page ${pages.length + newPages.length + 1}`,
          };
          setPages((prev) => [...prev, pageObj]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleLoadPreset = (preset: ChapterCollectionPreset) => {
    setSelectedPresetId(preset.id);
    setPages(preset.pages);
  };

  const handleRemovePage = (id: string) => {
    setPages((prev) => prev.filter((p) => p.id !== id).map((p, idx) => ({ ...p, pageNumber: idx + 1 })));
  };

  const minPages = 4;
  const maxPages = 10;
  const isSatisfied = pages.length >= minPages && pages.length <= maxPages;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
      {/* Title Bar */}
      <div className="bg-slate-50 border-b border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#0F284E] text-white uppercase tracking-wide">
              Step 1
            </span>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Upload Chapter Images / Textbook Pages
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Upload 4 to 10 textbook pages or syllabus snapshots to ground question generation in your exact curriculum.
          </p>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
              isSatisfied
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}
          >
            {isSatisfied ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
            <span>{pages.length} Pages Loaded ({minPages}–{maxPages} recommended)</span>
          </span>
        </div>
      </div>

      <div className="p-5">
        {/* Quick Presets Picker */}
        <div className="mb-4">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <BookMarked className="w-4 h-4 text-emerald-600" />
            <span>Or load preset curriculum chapter samples:</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PRESET_CHAPTER_COLLECTIONS.map((preset) => {
              const isSelected = selectedPresetId === preset.id && pages.length === preset.pages.length;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleLoadPreset(preset)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-1 ring-emerald-500'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                      {preset.subject}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700">
                      {preset.pagesCount} Pages
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">{preset.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{preset.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Thumbnail Grid & Upload Card */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
          {pages.map((page) => (
            <div
              key={page.id}
              className="group relative bg-slate-50 rounded-lg border border-slate-200 overflow-hidden hover:shadow-md transition-all flex flex-col"
            >
              {/* Page Number Badge */}
              <div className="absolute top-1.5 left-1.5 z-10 bg-[#0F284E] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                Page {page.pageNumber}
              </div>

              {/* Action Buttons on Hover */}
              <div className="absolute top-1.5 right-1.5 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onPreviewImage(page.previewUrl || page.dataUrl || '', page.chapterTitle || page.name)}
                  title="Enlarge Image"
                  className="p-1 bg-white/90 hover:bg-white text-slate-700 rounded shadow hover:text-emerald-600 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleRemovePage(page.id)}
                  title="Remove Page"
                  className="p-1 bg-white/90 hover:bg-white text-slate-700 rounded shadow hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Image Thumbnail */}
              <div
                onClick={() => onPreviewImage(page.previewUrl || page.dataUrl || '', page.chapterTitle || page.name)}
                className="h-32 bg-slate-200 flex items-center justify-center cursor-pointer overflow-hidden"
              >
                {page.previewUrl ? (
                  <img
                    src={page.previewUrl}
                    alt={page.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-slate-400" />
                )}
              </div>

              {/* Page Title */}
              <div className="p-1.5 text-[11px] font-medium text-slate-700 truncate bg-white">
                {page.chapterTitle || page.name}
              </div>
            </div>
          ))}

          {/* Add Page Dropzone Button */}
          {pages.length < maxPages && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="h-40 border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-lg flex flex-col items-center justify-center p-3 text-center cursor-pointer bg-slate-50 hover:bg-emerald-50/30 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1.5">
                <Plus className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800">Add Page</span>
              <span className="text-[10px] text-slate-500 mt-0.5">JPG, PNG</span>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
          className="hidden"
        />
      </div>
    </div>
  );
};
