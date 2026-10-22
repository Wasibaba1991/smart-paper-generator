import React from 'react';

export type DrawingOutline = 
  | 'apple' 
  | 'flower' 
  | 'star' 
  | 'crescent' 
  | 'tree' 
  | 'car' 
  | 'mosque' 
  | 'boat' 
  | 'custom_box';

interface DrawingOutlineProps {
  type: DrawingOutline;
  className?: string;
}

export const PrePrimaryDrawingOutline: React.FC<DrawingOutlineProps> = ({ type, className = 'w-32 h-32' }) => {
  switch (type) {
    case 'apple':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Apple Stem */}
          <path d="M50 14 C50 8 55 4 60 5" strokeWidth="3" />
          {/* Leaf */}
          <path d="M52 12 C60 8 68 12 66 18 C58 18 53 15 52 12 Z" fill="#DCFCE7" stroke="#15803D" strokeWidth="2" />
          {/* Apple Body Outline */}
          <path d="M50 24 C40 18 20 18 16 38 C12 56 22 84 42 86 C47 86.5 49 84 50 84 C51 84 53 86.5 58 86 C78 84 88 56 84 38 C80 18 60 18 50 24 Z" fill="#FEF2F2" />
          {/* Dotted Color Guide */}
          <text x="50" y="55" fontSize="11" fill="#94A3B8" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">
            COLOR RED
          </text>
        </svg>
      );

    case 'crescent':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Crescent Moon */}
          <path d="M60 15 C35 22 25 50 40 78 C25 68 20 40 38 20 C44 14 52 13 60 15 Z" fill="#FEFCE8" stroke="#0F284E" strokeWidth="2.5" />
          {/* Star */}
          <polygon points="68,36 71,43 78,44 73,49 74,56 68,52 62,56 63,49 58,44 65,43" fill="#FEF9C3" stroke="#D97706" strokeWidth="2" />
          <text x="50" y="90" fontSize="10" fill="#94A3B8" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">
            ہلال اور ستارہ
          </text>
        </svg>
      );

    case 'flower':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Stem & Leaves */}
          <path d="M50 55 L50 90" stroke="#15803D" strokeWidth="3" />
          <path d="M50 72 C40 70 35 78 40 84 C46 84 49 80 50 75" fill="#DCFCE7" stroke="#15803D" strokeWidth="2" />
          <path d="M50 68 C60 66 65 74 60 80 C54 80 51 76 50 71" fill="#DCFCE7" stroke="#15803D" strokeWidth="2" />
          {/* Petals */}
          <circle cx="50" cy="30" r="12" fill="#FDF2F8" />
          <circle cx="34" cy="42" r="12" fill="#FDF2F8" />
          <circle cx="66" cy="42" r="12" fill="#FDF2F8" />
          <circle cx="40" cy="58" r="12" fill="#FDF2F8" />
          <circle cx="60" cy="58" r="12" fill="#FDF2F8" />
          {/* Center */}
          <circle cx="50" cy="45" r="11" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2.5" />
        </svg>
      );

    case 'star':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="50,10 61,35 88,38 68,57 73,84 50,71 27,84 32,57 12,38 39,35" fill="#FFFBEB" stroke="#D97706" strokeWidth="3" />
          <circle cx="42" cy="48" r="3" fill="#1E293B" />
          <circle cx="58" cy="48" r="3" fill="#1E293B" />
          <path d="M44 56 Q50 62 56 56" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'mosque':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {/* Base */}
          <rect x="25" y="52" width="50" height="36" fill="#F0FDF4" stroke="#0F284E" strokeWidth="2" />
          {/* Arch Door */}
          <path d="M44 88 L44 68 C44 63 56 63 56 68 L56 88 Z" fill="#DCFCE7" stroke="#0F284E" strokeWidth="2" />
          {/* Main Dome */}
          <path d="M30 52 C30 32 50 24 50 18 C50 24 70 32 70 52 Z" fill="#FEFCE8" stroke="#0F284E" strokeWidth="2.5" />
          <circle cx="50" cy="14" r="2.5" fill="#F59E0B" stroke="#0F284E" />
          {/* Left Minaret */}
          <rect x="15" y="38" width="8" height="50" fill="#F8FAFC" stroke="#0F284E" strokeWidth="2" />
          <path d="M15 38 L19 28 L23 38 Z" fill="#DCFCE7" stroke="#0F284E" strokeWidth="2" />
          {/* Right Minaret */}
          <rect x="77" y="38" width="8" height="50" fill="#F8FAFC" stroke="#0F284E" strokeWidth="2" />
          <path d="M77 38 L81 28 L85 38 Z" fill="#DCFCE7" stroke="#0F284E" strokeWidth="2" />
        </svg>
      );

    case 'car':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Car Body */}
          <path d="M15 62 L20 48 C22 43 28 40 35 40 L65 40 C72 40 78 43 80 48 L85 62 L90 64 C92 65 92 68 90 70 L85 70 L85 76 L15 76 L15 70 L10 70 C8 68 8 65 10 64 Z" fill="#EFF6FF" />
          {/* Windows */}
          <path d="M28 44 L46 44 L46 56 L24 56 Z" fill="#DBEAFE" stroke="#1E293B" strokeWidth="1.5" />
          <path d="M52 44 L72 44 L76 56 L52 56 Z" fill="#DBEAFE" stroke="#1E293B" strokeWidth="1.5" />
          {/* Wheels */}
          <circle cx="32" cy="76" r="9" fill="#334155" stroke="#1E293B" strokeWidth="2.5" />
          <circle cx="32" cy="76" r="3.5" fill="#FFFFFF" />
          <circle cx="68" cy="76" r="9" fill="#334155" stroke="#1E293B" strokeWidth="2.5" />
          <circle cx="68" cy="76" r="3.5" fill="#FFFFFF" />
        </svg>
      );

    case 'boat':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Waves */}
          <path d="M10 82 Q25 76 40 82 T70 82 T100 82" stroke="#38BDF8" strokeWidth="3" />
          {/* Hull */}
          <path d="M20 62 L80 62 L70 78 L30 78 Z" fill="#FEF3C7" stroke="#1E293B" strokeWidth="2.5" />
          {/* Mast */}
          <line x1="50" y1="20" x2="50" y2="62" stroke="#78350F" strokeWidth="3" />
          {/* Left Sail */}
          <path d="M48 24 L25 56 L48 56 Z" fill="#FEE2E2" stroke="#1E293B" strokeWidth="2" />
          {/* Right Sail */}
          <path d="M52 20 L78 56 L52 56 Z" fill="#E0E7FF" stroke="#1E293B" strokeWidth="2" />
        </svg>
      );

    case 'tree':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Trunk */}
          <path d="M44 60 L44 90 L56 90 L56 60" fill="#78350F" stroke="#1E293B" strokeWidth="2.5" />
          {/* Foliage */}
          <path d="M50 16 C38 16 30 26 30 36 C22 38 18 46 20 54 C22 62 30 66 38 64 C42 68 58 68 62 64 C70 66 78 62 80 54 C82 46 78 38 70 36 C70 26 62 16 50 16 Z" fill="#DCFCE7" stroke="#15803D" strokeWidth="2.5" />
          <circle cx="38" cy="38" r="3" fill="#EF4444" />
          <circle cx="58" cy="42" r="3" fill="#EF4444" />
          <circle cx="48" cy="52" r="3" fill="#EF4444" />
        </svg>
      );

    default:
      return null;
  }
};
