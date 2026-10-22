import type { ExamPaper, ExamSection, QuestionOption, Language, Subject, GradeLevel, ExamTerm, PaperSize } from '../types/exam';

export const parseRawOcrTextToExamPaper = (
  rawText: string,
  options?: {
    customSubject?: Subject;
    customGrade?: GradeLevel;
    customLanguage?: Language;
    customExamTerm?: ExamTerm;
    customTotalMarks?: number;
    customTime?: string;
    customPaperSize?: PaperSize;
  }
): ExamPaper => {
  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);
  
  // Detect language if not explicitly provided
  let detectedLang: Language = options?.customLanguage || 'en';
  if (!options?.customLanguage) {
    const urduCharCount = (rawText.match(/[\u0600-\u06FF]/g) || []).length;
    const englishCharCount = (rawText.match(/[a-zA-Z]/g) || []).length;
    const mathSymbolCount = (rawText.match(/[\$\=\+\-\*\/\^\\]/g) || []).length;

    if (mathSymbolCount > 8) {
      detectedLang = 'math';
    } else if (urduCharCount > englishCharCount) {
      detectedLang = 'ur';
    }
  }

  // Detect Subject (respect customSubject first)
  let detectedSubject: Subject = options?.customSubject || 'English Language & Lit';
  if (!options?.customSubject) {
    if (rawText.includes('اسلامیات') || rawText.includes('قرآن') || rawText.includes('حدیث') || rawText.includes('Islamic Studies')) {
      detectedSubject = 'Islamic Studies (اسلامیات)';
    } else if (rawText.includes('Mathematics') || rawText.includes('ریاضی') || rawText.includes('quadratic') || rawText.includes('algebra')) {
      detectedSubject = 'Mathematics (ریاضی)';
    } else if (rawText.includes('اردو') || rawText.includes('اشعار') || rawText.includes('محاورات') || rawText.includes('غزل')) {
      detectedSubject = 'Urdu Literature & Grammar (اردو)';
    } else if (rawText.includes('Arabic') || rawText.includes('العربية')) {
      detectedSubject = 'Arabic Language (اللغة العربية)';
    } else if (rawText.includes('Science') || rawText.includes('سائنس')) {
      detectedSubject = 'General Science (سائنس)';
    } else if (detectedLang === 'ur') {
      detectedSubject = 'Urdu Literature & Grammar (اردو)';
    }
  }

  // Detect Total Marks
  let totalMarks = options?.customTotalMarks || 50;
  if (!options?.customTotalMarks) {
    const marksMatch = rawText.match(/(?:Total Marks|کل نمبر|Marks|نمبر)[:\s]*(\d+)/i);
    if (marksMatch && marksMatch[1]) {
      totalMarks = parseInt(marksMatch[1], 10);
    }
  }

  // Detect Time
  let timeAllowed = options?.customTime || '1 Hour 30 Minutes';
  if (!options?.customTime) {
    const timeMatch = rawText.match(/(?:Time|وقت)[:\s]*([^\n]+)/i);
    if (timeMatch && timeMatch[1]) {
      timeAllowed = timeMatch[1].trim();
    }
  }

  // Build Sections
  const sections: ExamSection[] = [];
  let currentSection: ExamSection = {
    id: 'sec-ocr-1',
    sectionTitle: detectedLang === 'ur' ? 'حصہ اول: معروضی سوالات (Objective)' : 'Section A: Objective Questions',
    instructions: detectedLang === 'ur' ? 'تمام سوالات لازمی ہیں۔ درست جواب کی نشاندہی کریں۔' : 'Attempt all questions.',
    totalMarks: 0,
    questions: [],
  };

  let qCounter = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for Section headers
    if (
      line.match(/^(?:Section|حصہ|PART)\s*[A-Z1-3اولدومسوم]/i) ||
      line.includes('معروضی سوالات') ||
      line.includes('مختصر سوالات') ||
      line.includes('تفصیلی سوالات') ||
      line.includes('Objective Section') ||
      line.includes('Short Questions') ||
      line.includes('Long Questions')
    ) {
      if (currentSection.questions.length > 0) {
        sections.push(currentSection);
      }
      currentSection = {
        id: `sec-ocr-${sections.length + 1}`,
        sectionTitle: line,
        instructions: 'Follow the specific instructions given below.',
        totalMarks: 0,
        questions: [],
      };
      continue;
    }

    // Check if line looks like an MCQ (contains options (a) (b) or (الف) (ب))
    const mcqOptRegex = /\((?:[a-d]|[A-D]|الف|ب|ج|د|1-4)\)/;
    if (mcqOptRegex.test(line) || (i + 1 < lines.length && mcqOptRegex.test(lines[i + 1]))) {
      let qText = line;
      let optLine = '';

      if (mcqOptRegex.test(line)) {
        // Options are in the same line
        const splitIdx = line.search(mcqOptRegex);
        qText = line.substring(0, splitIdx).trim();
        optLine = line.substring(splitIdx).trim();
      } else if (i + 1 < lines.length && mcqOptRegex.test(lines[i + 1])) {
        // Options are on the next line
        i++;
        optLine = lines[i];
      }

      // Parse options
      const options: QuestionOption[] = [];
      const labels = ['A', 'B', 'C', 'D'];
      const rawOpts = optLine.split(/\s*(?:\((?:[a-dA-D1-4]|الف|ب|ج|د)\))\s*/).filter(Boolean);

      
      rawOpts.slice(0, 4).forEach((optStr, idx) => {
        options.push({
          id: `opt-${Date.now()}-${idx}`,
          label: detectedLang === 'ur' ? ['الف', 'ب', 'ج', 'د'][idx] || `(${idx + 1})` : labels[idx] || `(${idx + 1})`,
          text: optStr.trim(),
        });
      });

      if (options.length === 0) {
        // Fallback default options
        options.push(
          { id: '1', label: 'A', text: 'Option 1' },
          { id: '2', label: 'B', text: 'Option 2' },
          { id: '3', label: 'C', text: 'Option 3' },
          { id: '4', label: 'D', text: 'Option 4' }
        );
      }

      currentSection.questions.push({
        id: `q-ocr-${Date.now()}-${qCounter}`,
        type: 'mcq',
        questionNumber: qCounter++,
        text: qText.replace(/^\d+[\.\-\)]\s*/, ''),
        options,
        marks: 1,
        language: detectedLang,
      });
      currentSection.totalMarks += 1;
      continue;
    }

    // Check if line is a Fill in the Blank
    if (line.includes('_____') || line.includes('______') || line.includes('خالی جگہ')) {
      currentSection.questions.push({
        id: `q-ocr-${Date.now()}-${qCounter}`,
        type: 'fill_in_the_blank',
        questionNumber: qCounter++,
        text: line.replace(/^\d+[\.\-\)]\s*/, ''),
        marks: 1,
        language: detectedLang,
      });
      currentSection.totalMarks += 1;
      continue;
    }

    // Check if line looks like a question (starts with Q, Q1, 1., سوال, etc.)
    if (line.match(/^(?:Q\d*|Question|\d+[\.\-\)]|سوال\s*(?:نمبر)?\s*\d*)/i)) {
      const isLong = line.toLowerCase().includes('long') || 
                    line.toLowerCase().includes('prove') || 
                    line.toLowerCase().includes('تفصیلی') || 
                    currentSection.sectionTitle.toLowerCase().includes('long') ||
                    currentSection.sectionTitle.includes('حصہ سوم');

      const qMarks = isLong ? 8 : 4;

      currentSection.questions.push({
        id: `q-ocr-${Date.now()}-${qCounter}`,
        type: isLong ? 'long' : 'short',
        questionNumber: qCounter++,
        text: line.replace(/^(?:Q\d*|Question|\d+[\.\-\)]|سوال\s*(?:نمبر)?\s*\d*[:\.]?)\s*/i, ''),
        marks: qMarks,
        language: detectedLang,
      });
      currentSection.totalMarks += qMarks;
    }
  }

  if (currentSection.questions.length > 0) {
    sections.push(currentSection);
  }

  // If no sections were identified, wrap raw lines in a default section
  if (sections.length === 0 || sections.every((s) => s.questions.length === 0)) {
    sections.push({
      id: 'sec-ocr-default',
      sectionTitle: detectedLang === 'ur' ? 'امتحانی پرچہ - سوالات' : 'Examination Questions',
      instructions: 'Attempt all questions with neat handwriting.',
      totalMarks: 30,
      questions: lines.slice(0, 8).map((line, idx) => ({
        id: `q-fallback-${idx}`,
        type: idx < 3 ? 'mcq' : 'short',
        questionNumber: idx + 1,
        text: line,
        marks: idx < 3 ? 1 : 4,
        options: idx < 3 ? [
          { id: '1', label: 'A', text: 'Option A' },
          { id: '2', label: 'B', text: 'Option B' },
          { id: '3', label: 'C', text: 'Option C' },
          { id: '4', label: 'D', text: 'Option D' },
        ] : undefined,
        language: detectedLang,
      })),
    });
  }

  // Recalculate total marks
  const computedTotal = sections.reduce((sum, sec) => sum + sec.totalMarks, 0);

  return {
    id: `ocr-paper-${Date.now()}`,
    academyName: 'The Achievers Islamic Academy',
    campusName: 'Main Academic Campus',
    examTerm: options?.customExamTerm || 'Mid-Term Examination 2026',
    gradeLevel: options?.customGrade || 'Grade 9 (Matric / O-Level)',
    subject: detectedSubject,
    language: detectedLang,
    timeAllowed,
    totalMarks: options?.customTotalMarks || (computedTotal > 0 ? computedTotal : totalMarks),
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    instructions: [
      'Write your Roll Number on the top of question paper immediately.',
      'Check that the paper contains all the questions and sections mentioned.',
      'Overwriting or cutting in Objective section will not be awarded any marks.',
    ],
    showBismillah: true,
    showWatermark: true,
    showStudentTable: true,
    boardFormat: 'bise',
    paperCode: '5241',
    examGroup: 'Group-I (Morning)',
    showBubbleSheet: true,
    layoutColumns: 1,
    fontSize: 'standard',
    paperSize: options?.customPaperSize || 'a4',
    sections,
    createdVia: 'ocr_extract',
    createdAt: new Date().toISOString(),
  };
};
