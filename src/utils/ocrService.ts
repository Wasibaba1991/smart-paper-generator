import { createWorker, type Worker } from 'tesseract.js';

// ---------------------------------------------------------------------------
// ocrService.ts — Real browser-based OCR using Tesseract.js (WASM)
//
// Provides actual text extraction from uploaded images.
// Supports English, Urdu/Arabic (when language data is available).
// Falls back gracefully to empty string on failure.
// ---------------------------------------------------------------------------

/** Map our internal language codes to Tesseract language codes */
function mapLanguage(lang: string): string {
  switch (lang) {
    case 'ur':
      return 'urd+eng'; // Urdu + English mixed
    case 'ar':
      return 'ara+eng'; // Arabic + English mixed
    case 'math':
      return 'eng';     // Math papers usually have English text
    case 'bilingual':
      return 'eng+urd';
    default:
      return 'eng';
  }
}

export interface OcrResult {
  text: string;
  confidence: number;
  success: boolean;
}

/**
 * Perform OCR on an image using Tesseract.js.
 * 
 * @param imageSource - data URL, blob URL, or File object
 * @param language - our internal language code ('en' | 'ur' | 'ar' | 'math' | 'bilingual')
 * @param onProgress - optional progress callback (0-100)
 * @returns Extracted text, confidence score, and success flag
 */
export async function recognizeImage(
  imageSource: string | File,
  language: string = 'en',
  onProgress?: (percent: number) => void,
): Promise<OcrResult> {
  let worker: Worker | null = null;

  try {
    const tessLang = mapLanguage(language);

    worker = await createWorker(tessLang, undefined, {
      logger: (m) => {
        if (m.status === 'recognizing text' && typeof m.progress === 'number') {
          onProgress?.(Math.round(m.progress * 100));
        }
      },
    });

    const { data } = await worker.recognize(imageSource);

    await worker.terminate();
    worker = null;

    const cleanedText = data.text
      .replace(/\f/g, '\n')          // Replace form feeds
      .replace(/\r\n/g, '\n')        // Normalize line endings
      .replace(/\n{3,}/g, '\n\n')    // Collapse excessive blank lines
      .trim();

    return {
      text: cleanedText,
      confidence: data.confidence,
      success: cleanedText.length > 10, // Need meaningful content
    };
  } catch (err) {
    console.error('Tesseract OCR failed:', err);
    if (worker) {
      try { await worker.terminate(); } catch { /* ignore */ }
    }
    return {
      text: '',
      confidence: 0,
      success: false,
    };
  }
}
