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

// ---------------------------------------------------------------------------
// Structured extraction types
// ---------------------------------------------------------------------------

export interface GeminiQuestionOption {
  label: string;  // "A", "B", "C", "D" or "الف", "ب", "ج", "د"
  text: string;
}

export interface GeminiQuestion {
  type: 'mcq' | 'fill_in_the_blank' | 'short' | 'long';
  text: string;
  options?: GeminiQuestionOption[];
  marks: number;
}

export interface GeminiSection {
  title: string;
  instructions: string;
  questions: GeminiQuestion[];
}

export interface GeminiStructuredResult {
  success: boolean;
  errorMessage?: string;
  // All metadata fields are null when Gemini cannot find them on the image
  subject: string | null;
  grade: string | null;
  examTerm: string | null;
  totalMarks: number | null;
  timeAllowed: string | null;
  language: 'ur' | 'en' | 'ar' | 'math' | null;
  sections: GeminiSection[];
}

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const MODEL = 'gemini-2.0-flash';

// ---------------------------------------------------------------------------
// Prompt: plain-text OCR (used for Tesseract fallback path)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Prompt: structured JSON extraction — the primary path when Gemini is active
// ---------------------------------------------------------------------------

const STRUCTURED_EXTRACTION_PROMPT = `You are an expert academic document parser for The Achievers Islamic Academy.
Analyze this handwritten exam paper image and return ONLY a valid JSON object — no markdown, no code fences, no explanation.

Extract EXACTLY what is written on the paper. Do NOT invent, guess, or fill in any field that is not clearly visible on the paper.
If a field is not found or unclear, use null for that field.

Return this JSON structure:
{
  "subject": "<exact subject name written on the paper, or null if not visible>",
  "grade": "<exact grade/class written on the paper, e.g. 'Grade 9', 'Class 7', or null if not visible>",
  "examTerm": "<exact exam title/term written on the paper, e.g. 'Mid-Term Examination 2026', 'Monthly Test', or null if not visible>",
  "totalMarks": <integer total marks if written, or null>,
  "timeAllowed": "<time duration exactly as written, e.g. '2 Hours', '1:30 Hours', or null>",
  "language": "<primary language: 'ur' for Urdu, 'ar' for Arabic, 'math' for Mathematics, 'en' for English>",
  "sections": [
    {
      "title": "<section header exactly as written, e.g. 'Section A', 'حصہ اول'>",
      "instructions": "<any instruction line for this section, or empty string>",
      "questions": [
        {
          "type": "<'mcq' | 'fill_in_the_blank' | 'short' | 'long'>",
          "text": "<full question text exactly as written on paper>",
          "options": [
            { "label": "A", "text": "<option text>" },
            { "label": "B", "text": "<option text>" },
            { "label": "C", "text": "<option text>" },
            { "label": "D", "text": "<option text>" }
          ],
          "marks": <integer marks for this question, or 1 if not specified>
        }
      ]
    }
  ]
}

CRITICAL RULES:
1. "options" array is ONLY included for MCQ type questions. Omit it for short/long/fill_in_the_blank.
2. For Urdu/Arabic MCQs, use labels "الف", "ب", "ج", "د" instead of A/B/C/D.
3. Extract question text EXACTLY as handwritten — do not paraphrase or correct spelling.
4. Preserve Urdu/Arabic script faithfully. Do NOT transliterate.
5. If the paper has no clear section headers, put all questions under one section titled with whatever heading appears at the top.
6. Return ONLY the raw JSON object. No text before or after it.
7. Marks for fill-in-the-blank and MCQ questions default to 1 if not explicitly stated.
8. For unclear/illegible words in questions, write [illegible] in the text.`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function dataUrlToInlineData(dataUrl: string): { mimeType: string; data: string } {
  const [header, base64Data] = dataUrl.split(',');
  const mimeType = header.match(/data:([^;]+)/)?.[1] || 'image/jpeg';
  return { mimeType, data: base64Data };
}

// ---------------------------------------------------------------------------
// Exported: Plain-text OCR (Tesseract fallback compatibility)
// ---------------------------------------------------------------------------

/**
 * Recognize handwritten text in an image using Gemini Vision API.
 * Returns raw text — used when structured extraction fails or as a fallback.
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
        temperature: 0.1,
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

// ---------------------------------------------------------------------------
// Exported: Structured JSON extraction — PRIMARY path when Gemini is active
// ---------------------------------------------------------------------------

/**
 * Extract fully structured exam paper data (metadata + all questions) from an
 * image using Gemini Vision. Returns null fields for anything not found on the
 * image — ZERO hardcoded fallback values are injected.
 *
 * @param imageDataUrl  - base64 data URL of the image
 * @param apiKey        - Google AI (Gemini) API key
 * @param onProgress    - optional progress callback (0–100)
 */
export async function extractStructuredExamData(
  imageDataUrl: string,
  apiKey: string,
  onProgress?: (pct: number) => void,
): Promise<GeminiStructuredResult> {
  const EMPTY: GeminiStructuredResult = {
    success: false,
    subject: null,
    grade: null,
    examTerm: null,
    totalMarks: null,
    timeAllowed: null,
    language: null,
    sections: [],
  };

  if (!apiKey || apiKey.trim().length < 10) {
    return { ...EMPTY, errorMessage: 'Invalid or missing API key.' };
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
            { text: STRUCTURED_EXTRACTION_PROMPT },
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
        temperature: 0.1,   // low for factual extraction
        topK: 1,
        topP: 0.9,
        maxOutputTokens: 8192,
        // NOTE: responseMimeType is intentionally omitted — not supported by all
        // Gemini API regions/versions and causes silent 400 failures.
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
      console.error('Gemini structured extraction error:', errMsg);
      return { ...EMPTY, errorMessage: errMsg };
    }

    const json = await response.json();
    onProgress?.(90);

    const rawText: string =
      json?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!rawText.trim()) {
      return { ...EMPTY, errorMessage: 'Gemini returned empty response.' };
    }

    // Strip any accidental markdown code fences before parsing
    const cleanJson = rawText
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```\s*$/, '')
      .trim();

    let parsed: any;
    try {
      parsed = JSON.parse(cleanJson);
    } catch (parseErr) {
      console.error('Failed to parse Gemini JSON response:', cleanJson.slice(0, 500));
      return { ...EMPTY, errorMessage: 'Gemini response was not valid JSON.' };
    }

    onProgress?.(100);

    // Safely map parsed object → typed result. Never trust the shape blindly.
    const result: GeminiStructuredResult = {
      success: true,
      subject: typeof parsed.subject === 'string' && parsed.subject.trim() ? parsed.subject.trim() : null,
      grade: typeof parsed.grade === 'string' && parsed.grade.trim() ? parsed.grade.trim() : null,
      examTerm: typeof parsed.examTerm === 'string' && parsed.examTerm.trim() ? parsed.examTerm.trim() : null,
      totalMarks: typeof parsed.totalMarks === 'number' && parsed.totalMarks > 0 ? parsed.totalMarks : null,
      timeAllowed: typeof parsed.timeAllowed === 'string' && parsed.timeAllowed.trim() ? parsed.timeAllowed.trim() : null,
      language: (['ur', 'en', 'ar', 'math'] as const).includes(parsed.language)
        ? parsed.language as 'ur' | 'en' | 'ar' | 'math'
        : null,
      sections: Array.isArray(parsed.sections)
        ? parsed.sections
            .filter((s: any) => s && typeof s === 'object')
            .map((s: any): GeminiSection => ({
              title: typeof s.title === 'string' ? s.title.trim() : 'Examination Questions',
              instructions: typeof s.instructions === 'string' ? s.instructions.trim() : '',
              questions: Array.isArray(s.questions)
                ? s.questions
                    .filter((q: any) => q && typeof q.text === 'string' && q.text.trim())
                    .map((q: any): GeminiQuestion => ({
                      type: (['mcq', 'fill_in_the_blank', 'short', 'long'] as const).includes(q.type)
                        ? q.type
                        : 'short',
                      text: q.text.trim(),
                      marks: typeof q.marks === 'number' && q.marks > 0 ? q.marks : 1,
                      options: q.type === 'mcq' && Array.isArray(q.options)
                        ? q.options
                            .filter((o: any) => o && typeof o.text === 'string')
                            .map((o: any) => ({
                              label: typeof o.label === 'string' ? o.label : 'A',
                              text: o.text.trim(),
                            }))
                        : undefined,
                    }))
                : [],
            }))
        : [],
    };

    // If sections parsed but no questions at all, mark as partial success
    if (result.sections.length === 0 || result.sections.every(s => s.questions.length === 0)) {
      result.success = false;
      result.errorMessage = 'Gemini could not identify questions in the image.';
    }

    return result;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Gemini structured extraction failed:', msg);
    return { ...EMPTY, errorMessage: `Network error: ${msg}` };
  }
}

// ---------------------------------------------------------------------------
// Exported: Validate a Gemini API key by making a tiny test call
// ---------------------------------------------------------------------------

/**
 * Validate a Gemini API key.
 *
 * Leniency rules:
 *  - HTTP 200: definitely valid
 *  - HTTP 429 (quota), 402 (billing), 503 (overload): key is structurally
 *    valid — Google's servers recognised it. Mark as valid so the user can
 *    still attempt OCR (the actual call may work at lower load).
 *  - HTTP 401 / 403 with API_KEY_INVALID or PERMISSION_DENIED body: truly
 *    bad key — mark invalid.
 *  - Network error: warn but do NOT mark invalid — could be transient.
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

    // Definite success
    if (res.ok) return { valid: true, message: 'API key validated ✓' };

    // Parse error body for diagnostics
    const j = await res.json().catch(() => ({}));
    const errorCode: string = (j as any)?.error?.status || '';
    const errorMsg: string  = (j as any)?.error?.message || '';

    // Hard invalid: Google explicitly rejected the key credential
    const isAuthError =
      res.status === 400 && errorCode === 'INVALID_ARGUMENT' && errorMsg.toLowerCase().includes('api key') ||
      res.status === 401 ||
      (res.status === 403 && (errorCode === 'PERMISSION_DENIED' || errorMsg.toLowerCase().includes('api_key_invalid')));

    if (isAuthError) {
      return { valid: false, message: errorMsg || `Authentication failed (HTTP ${res.status})` };
    }

    // Soft errors: quota, billing, rate-limit, overload — key is recognised by Google
    // Let the user proceed; the actual OCR call might still succeed.
    const isSoftError = res.status === 429 || res.status === 402 || res.status === 503 || res.status === 500;
    if (isSoftError) {
      return {
        valid: true,
        message: `Key accepted (HTTP ${res.status} — ${errorMsg || 'quota or billing limit'}). OCR will still be attempted.`,
      };
    }

    // Unknown error — treat as valid to avoid blocking the user
    return {
      valid: true,
      message: `Key accepted with warning (HTTP ${res.status}). OCR will be attempted.`,
    };
  } catch (e) {
    // Network error (offline, CORS, firewall) — cannot determine validity.
    // Treat as valid so the user isn’t blocked; the OCR call will fail gracefully if needed.
    return {
      valid: true,
      message: 'Could not reach Google’s servers to verify — key assumed valid. OCR will be attempted.',
    };
  }
}
