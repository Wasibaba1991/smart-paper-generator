// ---------------------------------------------------------------------------
// geminiOcrService.ts — Gemini Vision API integration for handwritten OCR
//
// Uses Google's Gemini 2.0 Flash model to extract handwritten exam paper
// content with high fidelity. Dramatically better than Tesseract for
// handwritten, mixed-script (English/Urdu/Arabic), or complex layouts.
// ---------------------------------------------------------------------------

export interface GeminiOcrResult {
  text: string;
  success: boolean;
  errorMessage?: string;
}

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const MODEL = 'gemini-2.0-flash';

const EXTRACTION_PROMPT = `You are an expert academic document OCR system for The Achievers Islamic Academy.
Your task: Extract ALL text from this handwritten exam paper image with maximum fidelity and accuracy.

CRITICAL RULES:
1. Extract every single word, number, and symbol exactly as written — do NOT rephrase, summarize, or omit anything.
2. Preserve the original structure: section headers, question numbers (Q1, Q2, 1., 2., etc.), sub-questions (a, b, c), and MCQ options ((a)(b)(c)(d) or (الف)(ب)(ج)(د)).
3. For Urdu/Arabic text, preserve the original script faithfully. Do NOT transliterate.
4. For mathematical expressions, write them in plain text (e.g., x^2 + 3x - 5 = 0).
5. If a line contains fill-in-the-blank underscores, include them as _____ in your output.
6. Mark section breaks with their original headers (e.g., "Section A", "حصہ اول", "PART I").
7. Output ONLY the extracted text. No explanations, no commentary, no "Here is the text:".
8. If the handwriting is unclear for a specific word, write [illegible] in place of that word.

Begin extraction now:`;

/**
 * Convert a data URL (base64 image) to Gemini API inlineData format.
 */
function dataUrlToInlineData(dataUrl: string): { mimeType: string; data: string } {
  const [header, base64Data] = dataUrl.split(',');
  const mimeType = header.match(/data:([^;]+)/)?.[1] || 'image/jpeg';
  return { mimeType, data: base64Data };
}

/**
 * Recognize handwritten text in an image using Gemini Vision API.
 *
 * @param imageDataUrl  - base64 data URL of the image
 * @param apiKey        - Google AI (Gemini) API key
 * @param onProgress    - optional progress callback (0–100)
 */
export async function recognizeWithGemini(
  imageDataUrl: string,
  apiKey: string,
  onProgress?: (pct: number) => void,
): Promise<GeminiOcrResult> {
  if (!apiKey || apiKey.trim().length < 10) {
    return { text: '', success: false, errorMessage: 'Invalid or missing API key.' };
  }

  try {
    onProgress?.(10);

    const inlineData = dataUrlToInlineData(imageDataUrl);
    const url = `${GEMINI_API_BASE}/${MODEL}:generateContent?key=${apiKey.trim()}`;

    onProgress?.(20);

    const body = {
      contents: [
        {
          parts: [
            { text: EXTRACTION_PROMPT },
            {
              inlineData: {
                mimeType: inlineData.mimeType,
                data: inlineData.data,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,       // Low temperature for factual extraction
        topK: 1,
        topP: 0.9,
        maxOutputTokens: 4096,
      },
    };

    onProgress?.(40);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    onProgress?.(75);

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      const errMsg =
        (errJson as any)?.error?.message ||
        `Gemini API error: ${response.status} ${response.statusText}`;
      console.error('Gemini API error:', errMsg);
      return { text: '', success: false, errorMessage: errMsg };
    }

    const json = await response.json();
    onProgress?.(90);

    const text: string =
      json?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    const cleanedText = text
      .replace(/\r\n/g, '\n')
      .replace(/\n{4,}/g, '\n\n\n')
      .trim();

    onProgress?.(100);

    return {
      text: cleanedText,
      success: cleanedText.length > 5,
      errorMessage: cleanedText.length <= 5 ? 'Gemini returned no meaningful text.' : undefined,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Gemini OCR failed:', msg);
    return { text: '', success: false, errorMessage: `Network error: ${msg}` };
  }
}

/**
 * Validate a Gemini API key by making a tiny test call.
 */
export async function validateGeminiKey(apiKey: string): Promise<{ valid: boolean; message: string }> {
  if (!apiKey || apiKey.trim().length < 10) {
    return { valid: false, message: 'Key is too short — please check and re-enter.' };
  }
  try {
    const url = `${GEMINI_API_BASE}/${MODEL}:generateContent?key=${apiKey.trim()}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Reply with the single word: OK' }] }],
        generationConfig: { maxOutputTokens: 5 },
      }),
    });
    if (res.ok) return { valid: true, message: 'API key validated ✓' };
    const j = await res.json().catch(() => ({}));
    return { valid: false, message: (j as any)?.error?.message || `Error ${res.status}` };
  } catch (e) {
    return { valid: false, message: 'Network error — check your internet connection.' };
  }
}
