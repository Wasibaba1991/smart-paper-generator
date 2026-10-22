import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { PaperSize } from '../types/exam';

/**
 * Injects or updates a dynamic <style> tag specifically for print media
 * so the browser's print dialog strictly matches the selected paper dimensions (A4 or Legal),
 * with 0 margin on @page to let the paper container strictly handle exact 210mm x 297mm dimensions.
 */
export const applyPrintPageStyle = (paperSize: PaperSize = 'a4'): void => {
  let styleEl = document.getElementById('achievers-dynamic-page-style') as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'achievers-dynamic-page-style';
    document.head.appendChild(styleEl);
  }

  const isLegal = paperSize === 'legal';
  const widthMm = isLegal ? '215.9mm' : '210mm';
  const heightMm = isLegal ? '355.6mm' : '297mm';

  styleEl.textContent = `
    @media print {
      @page {
        size: ${isLegal ? 'legal portrait' : 'A4 portrait'} !important;
        margin: 0 !important;
      }
      html, body {
        width: 100% !important;
        min-height: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        background: #ffffff !important;
      }
      #root,
      #root > div,
      main,
      main > div {
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        display: block !important;
      }
      #achievers-printable-paper,
      #achievers-printable-marking-scheme,
      .print-container {
        width: ${widthMm} !important;
        min-width: ${widthMm} !important;
        max-width: ${widthMm} !important;
        min-height: ${heightMm} !important;
        padding: 20mm !important;
        box-sizing: border-box !important;
        margin: 0 auto !important;
        background: #ffffff !important;
        border: none !important;
        box-shadow: none !important;
        display: block !important;
      }
    }
  `;
};

/**
 * Triggers native browser print dialog with the selected paper size enforced.
 */
export const printPaperNative = (paperSize: PaperSize = 'a4'): void => {
  applyPrintPageStyle(paperSize);
  window.print();
};

/**
 * High-definition PDF export strictly adhering to standard A4 (210x297mm) 
 * or Legal (215.9x355.6mm) dimensions with exact academic margins and padding.
 */
export const exportPaperToPdf = async (
  elementId: string, 
  filename = 'The_Achievers_Islamic_Academy_Paper.pdf',
  paperSize: PaperSize = 'a4'
): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    printPaperNative(paperSize);
    return;
  }

  const isLegal = paperSize === 'legal';
  const pageWidth = isLegal ? 215.9 : 210;
  const pageHeight = isLegal ? 355.6 : 297;

  // Strict standard width at 96 DPI: A4 is 794px (210mm), Legal is 816px (215.9mm)
  const targetPixelWidth = isLegal ? 816 : 794;

  try {
    // Ensure all embedded Nastaliq, Arabic, and KaTeX fonts are fully loaded
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    // Render the element to a canvas with 2x scale for crisp academic print quality
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: Math.max(1200, targetPixelWidth + 100),
      onclone: (clonedDoc) => {
        // Sanitize modern oklch color functions to sRGB hex/rgb so html2canvas doesn't crash
        try {
          const dummyCanvas = clonedDoc.createElement('canvas');
          const ctx = dummyCanvas.getContext('2d');
          const convertColor = (val: string): string => {
            if (!val || !val.includes('oklch')) return val;
            if (!ctx) return '#000000';
            try {
              ctx.fillStyle = '#000000';
              ctx.fillStyle = val;
              return ctx.fillStyle || '#000000';
            } catch {
              return '#000000';
            }
          };

          // 1. Sanitize all <style> elements in clonedDoc
          clonedDoc.querySelectorAll('style').forEach((styleEl) => {
            if (styleEl.textContent && styleEl.textContent.includes('oklch')) {
              styleEl.textContent = styleEl.textContent.replace(/oklch\([^)]+\)/gi, (match) => {
                return convertColor(match);
              });
            }
          });

          // 2. Sanitize inline styles on elements
          clonedDoc.querySelectorAll('*').forEach((node) => {
            const el = node as HTMLElement;
            if (el.style) {
              const props = ['color', 'backgroundColor', 'borderColor', 'outlineColor', 'fill', 'stroke'];
              for (const prop of props) {
                const current = (el.style as any)[prop];
                if (current && typeof current === 'string' && current.includes('oklch')) {
                  (el.style as any)[prop] = convertColor(current);
                }
              }
            }
          });
        } catch (e) {
          console.warn('oklch color sanitization warning:', e);
        }

        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          // Strictly enforce A4 / Legal width and padding
          clonedElement.style.width = `${targetPixelWidth}px`;
          clonedElement.style.maxWidth = `${targetPixelWidth}px`;
          clonedElement.style.minHeight = isLegal ? '1344px' : '1123px';
          clonedElement.style.boxSizing = 'border-box';
          clonedElement.style.padding = '75px 75px'; // Exact 20mm in px at 96 DPI
          clonedElement.style.margin = '0 auto';
          clonedElement.style.backgroundColor = '#ffffff';
          clonedElement.style.boxShadow = 'none';
          clonedElement.style.border = 'none';

          // Reset all parent wrappers in clone to prevent width restrictions
          let parent = clonedElement.parentElement;
          while (parent && parent !== clonedDoc.body) {
            parent.style.width = '100%';
            parent.style.maxWidth = '100%';
            parent.style.margin = '0';
            parent.style.padding = '0';
            parent.style.display = 'block';
            parent = parent.parentElement;
          }

          // Preserve 2-column layout in clone
          const twoCols = clonedElement.querySelectorAll('.print-grid-2');
          twoCols.forEach((col) => {
            const htmlCol = col as HTMLElement;
            htmlCol.style.display = 'grid';
            htmlCol.style.gridTemplateColumns = 'repeat(2, minmax(0, 1fr))';
            htmlCol.style.columnGap = '24px';
            htmlCol.style.rowGap = '12px';
          });
        }
      },
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: isLegal ? 'legal' : 'a4',
    });

    // Sized to exactly match physical page edge-to-edge (margins already built into padding)
    const contentWidth = pageWidth;
    const availablePageHeight = pageHeight;

    // Height of one PDF page in canvas pixel units
    const canvasPageHeight = Math.floor(availablePageHeight * (canvas.width / contentWidth));

    if (canvas.height <= canvasPageHeight) {
      // Single page document
      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const imgHeight = (canvas.height * contentWidth) / canvas.width;
      pdf.addImage(imgData, 'JPEG', 0, 0, contentWidth, imgHeight);
    } else {
      // Multi-page document: slice canvas cleanly
      const totalPages = Math.ceil(canvas.height / canvasPageHeight);

      for (let i = 0; i < totalPages; i++) {
        if (i > 0) {
          pdf.addPage(isLegal ? 'legal' : 'a4', 'portrait');
        }

        const sourceY = i * canvasPageHeight;
        const sourceHeight = Math.min(canvasPageHeight, canvas.height - sourceY);

        const sliceCanvas = document.createElement('canvas');
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = sourceHeight;
        const ctx = sliceCanvas.getContext('2d');

        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
          ctx.drawImage(
            canvas,
            0, sourceY, canvas.width, sourceHeight,
            0, 0, canvas.width, sourceHeight
          );

          const sliceData = sliceCanvas.toDataURL('image/jpeg', 0.98);
          const slicePdfHeight = (sourceHeight * contentWidth) / canvas.width;
          pdf.addImage(sliceData, 'JPEG', 0, 0, contentWidth, slicePdfHeight);
        }
      }
    }

    pdf.save(filename);
  } catch (err) {
    console.error('PDF export fallback to window.print', err);
    printPaperNative(paperSize);
  }
};
