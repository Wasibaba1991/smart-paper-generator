import React, { useMemo } from 'react';
import katex from 'katex';

interface MathRendererProps {
  content: string;
  className?: string;
  isUrduOrArabic?: boolean;
}

export const MathRenderer: React.FC<MathRendererProps> = ({ 
  content, 
  className = '',
  isUrduOrArabic = false 
}) => {
  const renderedParts = useMemo(() => {
    if (!content) return [];

    // Regex to detect $...$ (inline math) or $$...$$ (display math)
    const parts: { type: 'text' | 'inline-math' | 'display-math'; value: string }[] = [];
    const regex = /(\$\$[\s\S]*?\$\$|\$[^\$]+?\$)/g;
    
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          value: content.slice(lastIndex, match.index),
        });
      }

      const raw = match[0];
      if (raw.startsWith('$$') && raw.endsWith('$$')) {
        parts.push({
          type: 'display-math',
          value: raw.slice(2, -2).trim(),
        });
      } else if (raw.startsWith('$') && raw.endsWith('$')) {
        parts.push({
          type: 'inline-math',
          value: raw.slice(1, -1).trim(),
        });
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        value: content.slice(lastIndex),
      });
    }

    return parts;
  }, [content]);

  return (
    <span className={`inline-block ${className} ${isUrduOrArabic ? 'direction-rtl' : ''}`}>
      {renderedParts.map((part, index) => {
        if (part.type === 'text') {
          return <span key={index}>{part.value}</span>;
        }

        try {
          const html = katex.renderToString(part.value, {
            displayMode: part.type === 'display-math',
            throwOnError: false,
          });

          return (
            <span
              key={index}
              className={`inline-math-container font-math ${part.type === 'display-math' ? 'block my-2 text-center' : 'inline px-1'}`}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return <span key={index} className="font-mono text-emerald-800">[{part.value}]</span>;
        }
      })}
    </span>
  );
};
