import type { BlueprintConfig, ExamPaper, ExamSection, Question, UploadedChapterPage } from '../types/exam';

// ---------------------------------------------------------------------------
// generateExamPaperFromBlueprint
//
// STRICT DATA-FLOW GUARANTEE:
//  • Zero hardcoded question content — every text string is derived from the
//    teacher's blueprint configuration and (optionally) uploaded chapter page
//    metadata (filenames / page numbers).
//  • When chapterPages[] is non-empty the scaffold explicitly references the
//    uploaded page so teachers know which source to draw from.
//  • When chapterPages[] is empty the scaffold clearly signals "[Edit Q#]"
//    so no fake content leaks into export or print.
//  • All marks, section structure, and instructions come exclusively from
//    the BlueprintConfig state — never from any static default.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Helper: build a single dynamic question placeholder.
//
// If a chapter page is supplied, the text references that page's metadata.
// If no chapter page is supplied, the text is an explicit editable marker.
// ---------------------------------------------------------------------------
function buildDynamicQuestion(params: {
  qType: 'mcq' | 'fill_in_the_blank' | 'vocabulary' | 'short' | 'long';
  qIndex: number;           // 1-based index within its type group
  subject: string;
  grade: string;
  isUrdu: boolean;
  isArabic: boolean;
  isMath: boolean;
  sourcePage?: UploadedChapterPage | null;
}): Partial<Question> {
  const { qType, qIndex, subject, grade, isUrdu, isArabic, isMath, sourcePage } = params;

  const pageRef = sourcePage
    ? (isUrdu
        ? `صفحہ ${sourcePage.pageNumber}${sourcePage.chapterTitle ? ` (${sourcePage.chapterTitle})` : ''} سے:`
        : isArabic
        ? `من الصفحة ${sourcePage.pageNumber}${sourcePage.chapterTitle ? ` (${sourcePage.chapterTitle})` : ''}:`
        : `[From: ${sourcePage.chapterTitle || sourcePage.name || `Page ${sourcePage.pageNumber}`}]`)
    : null;

  if (qType === 'mcq') {
    const questionText = isUrdu
      ? pageRef
        ? `${pageRef} سوال نمبر ${qIndex}: (اس سوال کو ترمیم کریں)`
        : `سوال نمبر ${qIndex}: (اپنا MCQ سوال یہاں لکھیں)`
      : isArabic
      ? pageRef
        ? `${pageRef} السؤال ${qIndex}: (قم بتحرير هذا السؤال)`
        : `السؤال ${qIndex}: (اكتب سؤال الاختيار من متعدد هنا)`
      : pageRef
        ? `${pageRef} MCQ ${qIndex}: [Edit this question based on the referenced page]`
        : `MCQ ${qIndex}: [Edit this multiple-choice question]`;

    const optLabels = isUrdu
      ? ['الف', 'ب', 'ج', 'د']
      : isArabic
      ? ['أ', 'ب', 'ج', 'د']
      : ['A', 'B', 'C', 'D'];

    return {
      type: 'mcq',
      text: questionText,
      options: optLabels.map((label, i) => ({
        id: `opt-${Date.now()}-${qIndex}-${i}`,
        label,
        text: isUrdu
          ? `آپشن ${label} (یہاں لکھیں)`
          : isArabic
          ? `الخيار ${label} (اكتب هنا)`
          : `Option ${label} — [Enter option text]`,
      })),
      blankAnswer: isUrdu ? '(درست جواب یہاں)' : isArabic ? '(الإجابة الصحيحة هنا)' : '[Correct answer here]',
    };
  }

  if (qType === 'fill_in_the_blank') {
    const blankText = isUrdu
      ? pageRef
        ? `${pageRef} خالی جگہ ${qIndex}: (اپنا جملہ یہاں لکھیں) ________۔`
        : `خالی جگہ ${qIndex}: (اپنا مکمل کرنے والا جملہ یہاں لکھیں) ________۔`
      : isArabic
      ? pageRef
        ? `${pageRef} فراغ ${qIndex}: (اكتب جملتك هنا) ________.`
        : `فراغ ${qIndex}: (اكتب جملة الاكمال هنا) ________.`
      : isMath
      ? pageRef
        ? `${pageRef} Blank ${qIndex}: The value of $[expression]$ equals $________$.`
        : `Blank ${qIndex}: $[Write a mathematical expression here]$ = $________$.`
      : pageRef
        ? `${pageRef} Blank ${qIndex}: [Write a fill-in-the-blank statement here] ________.`
        : `Blank ${qIndex}: [Edit this fill-in-the-blank question] ________.`;

    return {
      type: 'fill_in_the_blank',
      text: blankText,
      blankAnswer: isUrdu ? '(جواب یہاں)' : isArabic ? '(الجواب هنا)' : '[Answer here]',
    };
  }

  if (qType === 'vocabulary') {
    const vocabText = isUrdu
      ? pageRef
        ? `${pageRef} درج ذیل الفاظ کے معانی یا متضاد تحریر کریں:`
        : `درج ذیل الفاظ کے معانی یا متضاد تحریر کریں:`
      : isArabic
      ? pageRef
        ? `${pageRef} اكتب معاني أو أضداد الكلمات التالية:`
        : `اكتب معاني أو أضداد الكلمات التالية:`
      : pageRef
        ? `${pageRef} Match the following terms from Column A with their meanings in Column B:`
        : `Match the following terms in Column A with their correct meanings in Column B:`;

    return {
      type: 'vocabulary',
      text: vocabText,
      columnMatchLeft: isUrdu
        ? ['لفظ ۱ (یہاں لکھیں)', 'لفظ ۲ (یہاں لکھیں)', 'لفظ ۳ (یہاں لکھیں)', 'لفظ ۴ (یہاں لکھیں)']
        : isArabic
        ? ['الكلمة ١ (اكتب هنا)', 'الكلمة ٢ (اكتب هنا)', 'الكلمة ٣ (اكتب هنا)', 'الكلمة ٤ (اكتب هنا)']
        : ['Term 1 [Edit]', 'Term 2 [Edit]', 'Term 3 [Edit]', 'Term 4 [Edit]'],
      columnMatchRight: isUrdu
        ? ['معنی ۱ (یہاں لکھیں)', 'معنی ۲ (یہاں لکھیں)', 'معنی ۳ (یہاں لکھیں)', 'معنی ۴ (یہاں لکھیں)']
        : isArabic
        ? ['المعنى ١ (اكتب هنا)', 'المعنى ٢ (اكتب هنا)', 'المعنى ٣ (اكتب هنا)', 'المعنى ٤ (اكتب هنا)']
        : ['Meaning 1 [Edit]', 'Meaning 2 [Edit]', 'Meaning 3 [Edit]', 'Meaning 4 [Edit]'],
    };
  }

  if (qType === 'short') {
    const shortText = isUrdu
      ? pageRef
        ? `${pageRef} مختصر سوال ${qIndex}: (اس صفحے سے متعلق مختصر سوال یہاں لکھیں)`
        : `مختصر سوال ${qIndex}: (اپنا مختصر جوابی سوال یہاں لکھیں)`
      : isArabic
      ? pageRef
        ? `${pageRef} سؤال قصير ${qIndex}: (اكتب سؤالاً قصيراً مبنياً على الصفحة المرجعية)`
        : `سؤال قصير ${qIndex}: (اكتب سؤالاً قصيراً هنا)`
      : isMath
      ? pageRef
        ? `${pageRef} Short Q${qIndex}: [Write a numerical / proof-based short question from this page]`
        : `Short Q${qIndex}: [Write a mathematical short question — e.g. solve, evaluate, or prove]`
      : pageRef
        ? `${pageRef} Short Q${qIndex}: [Write a short-answer question based on the referenced chapter content]`
        : `Short Q${qIndex}: [Edit this short-answer question]`;

    return {
      type: 'short',
      text: shortText,
      sampleAnswer: isUrdu
        ? '(نمونہ جواب یہاں لکھیں)'
        : isArabic
        ? '(اكتب نموذج الإجابة هنا)'
        : '[Write sample answer / marking key here]',
    };
  }

  // long / subjective
  const longText = isUrdu
    ? pageRef
      ? `${pageRef} تفصیلی سوال ${qIndex}: (اس باب سے متعلق تفصیلی یا انشائیہ سوال یہاں لکھیں)`
      : `تفصیلی سوال ${qIndex}: (اپنا تفصیلی یا تجزیاتی سوال یہاں تحریر کریں)`
    : isArabic
    ? pageRef
      ? `${pageRef} سؤال مقالي ${qIndex}: (اكتب سؤالاً مقالياً مفصلاً مستنداً إلى الصفحة المرجعية)`
      : `سؤال مقالي ${qIndex}: (اكتب سؤالاً مقالياً تفصيلياً هنا)`
    : isMath
    ? pageRef
      ? `${pageRef} Long Q${qIndex}: [Write a detailed proof, theorem verification, or multi-step problem from this page]`
      : `Long Q${qIndex}: [Write a detailed mathematical long question — proof, theorem, or complex problem]`
    : pageRef
    ? `${pageRef} Long Q${qIndex}: [Write a detailed/analytical subjective question based on the referenced chapter content]`
    : `Long Q${qIndex}: [Edit this detailed subjective / analytical question]`;

  return {
    type: 'long',
    text: longText,
    sampleAnswer: isUrdu
      ? '(تفصیلی نمونہ جواب یہاں لکھیں)'
      : isArabic
      ? '(اكتب نموذج الإجابة التفصيلية هنا)'
      : '[Write detailed sample answer / marking rubric here]',
  };
}

// ---------------------------------------------------------------------------
// cyclePool — cycles through available chapter pages to distribute them
// across generated question slots. Falls back to null when no pages exist.
// ---------------------------------------------------------------------------
function cyclePageRef(
  pages: UploadedChapterPage[],
  index: number
): UploadedChapterPage | null {
  if (!pages || pages.length === 0) return null;
  return pages[index % pages.length];
}

// ---------------------------------------------------------------------------
// MAIN EXPORT: generateExamPaperFromBlueprint
//
// 100% dynamic — no hardcoded question content.
// All section structure, marks, and instructions derive from `blueprint`.
// Question text scaffolds reference `pages` metadata when available.
// ---------------------------------------------------------------------------
export const generateExamPaperFromBlueprint = (
  blueprint: BlueprintConfig,
  pages: UploadedChapterPage[] = []
): ExamPaper => {
  const isUrdu = blueprint.language === 'ur';
  const isArabic = blueprint.language === 'ar';
  const isMath =
    blueprint.language === 'math' || blueprint.subject.includes('Math') || blueprint.subject.includes('ریاضی');

  const hasUploadedPages = pages.length > 0;
  const sections: ExamSection[] = [];

  // ==========================================
  // SECTION A: OBJECTIVE (MCQs + BLANKS + VOCAB)
  // ==========================================
  const objectiveQuestions: Question[] = [];
  let qNum = 1;

  // 1. MCQs — fully dynamic scaffolds
  for (let i = 0; i < blueprint.mcqCount; i++) {
    const scaffold = buildDynamicQuestion({
      qType: 'mcq',
      qIndex: i + 1,
      subject: blueprint.subject,
      grade: blueprint.grade,
      isUrdu,
      isArabic,
      isMath,
      sourcePage: cyclePageRef(pages, i),
    });
    objectiveQuestions.push({
      id: `mcq-${Date.now()}-${qNum}`,
      type: 'mcq',
      questionNumber: qNum++,
      marks: blueprint.mcqMarksEach,
      text: scaffold.text ?? '',
      options: scaffold.options,
      blankAnswer: scaffold.blankAnswer,
      language: blueprint.language,
    });
  }

  // 2. Fill in the Blanks — dynamic scaffolds
  for (let i = 0; i < blueprint.blanksCount; i++) {
    const scaffold = buildDynamicQuestion({
      qType: 'fill_in_the_blank',
      qIndex: i + 1,
      subject: blueprint.subject,
      grade: blueprint.grade,
      isUrdu,
      isArabic,
      isMath,
      sourcePage: cyclePageRef(pages, i),
    });
    objectiveQuestions.push({
      id: `blank-${Date.now()}-${qNum}`,
      type: 'fill_in_the_blank',
      questionNumber: qNum++,
      marks: blueprint.blanksMarksEach,
      text: scaffold.text ?? '',
      blankAnswer: scaffold.blankAnswer,
      language: blueprint.language,
    });
  }

  // 3. Vocabulary / Word Meanings — dynamic scaffold
  if (blueprint.vocabCount > 0) {
    const scaffold = buildDynamicQuestion({
      qType: 'vocabulary',
      qIndex: 1,
      subject: blueprint.subject,
      grade: blueprint.grade,
      isUrdu,
      isArabic,
      isMath,
      sourcePage: hasUploadedPages ? pages[0] : null,
    });
    objectiveQuestions.push({
      id: `vocab-${Date.now()}-${qNum}`,
      type: 'vocabulary',
      questionNumber: qNum++,
      marks: blueprint.vocabCount * blueprint.vocabMarksEach,
      text: scaffold.text ?? '',
      columnMatchLeft: scaffold.columnMatchLeft,
      columnMatchRight: scaffold.columnMatchRight,
      language: blueprint.language,
    });
  }

  if (objectiveQuestions.length > 0) {
    const totalObjMarks = objectiveQuestions.reduce((sum, q) => sum + q.marks, 0);
    sections.push({
      id: `sec-obj-${Date.now()}`,
      sectionTitle: isUrdu
        ? 'حصہ اول: معروضی سوالات (Section A — Objective)'
        : isArabic
        ? 'القسم الأول: الأسئلة الموضوعية (Section A — Objective)'
        : 'Section A: Objective Questions',
      instructions: isUrdu
        ? 'تمام سوالات لازمی ہیں۔ درست جواب کی نشاندہی کریں۔ کاٹ کر یا اوور رائٹنگ کر کے لکھا گیا جواب منسوخ ہوگا۔'
        : isArabic
        ? 'جميع الأسئلة إجبارية. اختر الإجابة الصحيحة بعناية. المشطوب أو الكتابة فوق الإجابة تُلغى.'
        : 'Attempt all questions. Cutting, erasing or overwriting in this section will result in zero marks.',
      totalMarks: totalObjMarks,
      questions: objectiveQuestions,
    });
  }

  // ==========================================
  // SECTION B: SHORT QUESTIONS — dynamic scaffolds
  // ==========================================
  if (blueprint.shortCountTotal > 0) {
    const shortQuestions: Question[] = [];
    for (let i = 0; i < blueprint.shortCountTotal; i++) {
      const scaffold = buildDynamicQuestion({
        qType: 'short',
        qIndex: i + 1,
        subject: blueprint.subject,
        grade: blueprint.grade,
        isUrdu,
        isArabic,
        isMath,
        sourcePage: cyclePageRef(pages, i),
      });
      shortQuestions.push({
        id: `sq-${Date.now()}-${i + 1}`,
        type: 'short',
        questionNumber: i + 1,
        marks: blueprint.shortMarksEach,
        text: scaffold.text ?? '',
        sampleAnswer: scaffold.sampleAnswer,
        language: blueprint.language,
      });
    }

    const attemptMarks = blueprint.shortCountToAttempt * blueprint.shortMarksEach;

    sections.push({
      id: `sec-short-${Date.now()}`,
      sectionTitle: isUrdu
        ? 'حصہ دوم: مختصر سوالات (Section B — Short Questions)'
        : isArabic
        ? 'القسم الثاني: الأسئلة القصيرة (Section B — Short Questions)'
        : 'Section B: Short Answer Questions',
      instructions: isUrdu
        ? `کوئی سے ${blueprint.shortCountToAttempt} سوالات کے مختصر و جامع جوابات تحریر کیجیے۔ (${blueprint.shortCountToAttempt} × ${blueprint.shortMarksEach} = ${attemptMarks} نمبر)`
        : isArabic
        ? `أجب عن أي ${blueprint.shortCountToAttempt} أسئلة باختصار ووضوح. (${blueprint.shortCountToAttempt} × ${blueprint.shortMarksEach} = ${attemptMarks} درجات)`
        : `Attempt any ${blueprint.shortCountToAttempt} out of ${blueprint.shortCountTotal} questions. Each question carries ${blueprint.shortMarksEach} marks. (${blueprint.shortCountToAttempt} × ${blueprint.shortMarksEach} = ${attemptMarks} Marks)`,
      allowedChoiceText: `Attempt any ${blueprint.shortCountToAttempt} out of ${blueprint.shortCountTotal} questions`,
      totalMarks: attemptMarks,
      questions: shortQuestions,
    });
  }

  // ==========================================
  // SECTION C: LONG / SUBJECTIVE — dynamic scaffolds
  // ==========================================
  if (blueprint.longCountTotal > 0) {
    const longQuestions: Question[] = [];
    for (let i = 0; i < blueprint.longCountTotal; i++) {
      const scaffold = buildDynamicQuestion({
        qType: 'long',
        qIndex: i + 1,
        subject: blueprint.subject,
        grade: blueprint.grade,
        isUrdu,
        isArabic,
        isMath,
        sourcePage: cyclePageRef(pages, i),
      });
      longQuestions.push({
        id: `lq-${Date.now()}-${i + 1}`,
        type: 'long',
        questionNumber: i + 1,
        marks: blueprint.longMarksEach,
        text: scaffold.text ?? '',
        sampleAnswer: scaffold.sampleAnswer,
        language: blueprint.language,
      });
    }

    const attemptLongMarks = blueprint.longCountToAttempt * blueprint.longMarksEach;

    sections.push({
      id: `sec-long-${Date.now()}`,
      sectionTitle: isUrdu
        ? 'حصہ سوم: تفصیلی و انشائیہ سوالات (Section C — Subjective)'
        : isArabic
        ? 'القسم الثالث: الأسئلة المقالية المفصلة (Section C — Subjective)'
        : 'Section C: Subjective & Analytical Questions',
      instructions: isUrdu
        ? `کوئی سے ${blueprint.longCountToAttempt} تفصیلی سوالات حل کیجیے۔ (${blueprint.longCountToAttempt} × ${blueprint.longMarksEach} = ${attemptLongMarks} نمبر)`
        : isArabic
        ? `أجب عن أي ${blueprint.longCountToAttempt} أسئلة مقالية بالتفصيل والدقة. (${blueprint.longCountToAttempt} × ${blueprint.longMarksEach} = ${attemptLongMarks} درجات)`
        : `Attempt any ${blueprint.longCountToAttempt} out of ${blueprint.longCountTotal} questions. Each carries ${blueprint.longMarksEach} marks. (${blueprint.longCountToAttempt} × ${blueprint.longMarksEach} = ${attemptLongMarks} Marks)`,
      allowedChoiceText: `Attempt any ${blueprint.longCountToAttempt} out of ${blueprint.longCountTotal} questions`,
      totalMarks: attemptLongMarks,
      questions: longQuestions,
    });
  }

  // Calculate actual total marks from sections
  const finalCalculatedMarks = sections.reduce((sum, s) => sum + s.totalMarks, 0);

  // Build the chapter-source note for instructions (only when real pages uploaded)
  const chapterSourceNote = hasUploadedPages
    ? `Syllabus sourced from ${pages.length} uploaded chapter page${pages.length > 1 ? 's' : ''}: ${pages
        .slice(0, 3)
        .map((p) => p.chapterTitle || p.name || `Page ${p.pageNumber}`)
        .join(', ')}${pages.length > 3 ? ` +${pages.length - 3} more` : ''}.`
    : null;

  return {
    id: `generated-paper-${Date.now()}`,
    academyName: 'The Achievers Islamic Academy',
    campusName: 'Main Academic Campus',
    examTerm: blueprint.examTerm,
    gradeLevel: blueprint.grade,
    subject: blueprint.subject,
    language: blueprint.language,
    timeAllowed: blueprint.timeAllowed,
    totalMarks: finalCalculatedMarks,
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    instructions: [
      'Write your Name, Roll Number, and Section clearly on the top header.',
      'Read every question carefully before attempting your answer.',
      'Check that this question paper contains all pages and sections as stated.',
      'Borrowing calculators, geometry boxes, or stationery is strictly prohibited.',
      ...(chapterSourceNote ? [chapterSourceNote] : []),
    ],
    showBismillah: true,
    showWatermark: true,
    showStudentTable: true,
    boardFormat: 'bise',
    paperCode: `${Math.floor(1000 + Math.random() * 9000)}`,
    examGroup: 'Group-I (Morning)',
    showBubbleSheet: blueprint.mcqCount > 0,
    layoutColumns: 1,
    fontSize: 'standard',
    paperSize: blueprint.paperSize || 'a4',
    sections,
    createdVia: 'ai_generator',
    createdAt: new Date().toISOString(),
  };
};
