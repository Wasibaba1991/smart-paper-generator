import React from 'react';
import { X, ZoomIn } from 'lucide-react';

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title?: string;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-[#0F284E] text-white px-5 py-3 flex items-center justify-between">
          <span className="font-bold text-sm truncate">{title || 'Textbook Page Preview'}</span>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image Content */}
        <div className="p-4 flex-1 flex items-center justify-center bg-slate-100 overflow-auto">
          <img
            src={imageUrl}
            alt="Preview"
            className="max-h-[75vh] w-auto object-contain rounded-lg shadow-md"
          />
        </div>
      </div>
    </div>
  );
};
