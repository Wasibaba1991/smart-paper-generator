import type { BlueprintConfig, ExamPaper, ExamSection, Question, UploadedChapterPage } from '../types/exam';

// ---------------------------------------------------------------------------
// Helper: cycle through a pool array to always return exactly `count` items.
// If pool.length < count, items wrap around so the blueprint is honoured.
// ---------------------------------------------------------------------------
function cyclePool<T>(pool: T[], count: number): T[] {
  if (count <= 0 || pool.length === 0) return [];
  const result: T[] = [];
  for (let i = 0; i < count; i++) {
    result.push(pool[i % pool.length]);
  }
  return result;
}

export const generateExamPaperFromBlueprint = (
  blueprint: BlueprintConfig,
  pages: UploadedChapterPage[] = []
): ExamPaper => {
  const isUrdu = blueprint.language === 'ur';
  const isArabic = blueprint.language === 'ar';
  const isMath = blueprint.language === 'math' || blueprint.subject.includes('Math');
  const isBilingual = blueprint.language === 'bilingual';

  const sections: ExamSection[] = [];

  // ==========================================
  // SECTION A: OBJECTIVE (MCQs + BLANKS + VOCAB)
  // ==========================================
  const objectiveQuestions: Question[] = [];
  let qNum = 1;

  // 1. Generate MCQs
  const generatedMcqs = getSubjectSpecificMcqs(blueprint.subject, blueprint.grade, blueprint.mcqCount, isUrdu, isArabic);
  generatedMcqs.forEach((mcq) => {
    objectiveQuestions.push({
      ...mcq,
      type: 'mcq',
      text: mcq.text || '',
      id: `mcq-${Date.now()}-${qNum}`,
      questionNumber: qNum++,
      marks: blueprint.mcqMarksEach,
    });
  });

  // 2. Generate Fill in the blanks
  const generatedBlanks = getSubjectSpecificBlanks(blueprint.subject, blueprint.grade, blueprint.blanksCount, isUrdu, isArabic);
  generatedBlanks.forEach((blank) => {
    objectiveQuestions.push({
      ...blank,
      type: 'fill_in_the_blank',
      text: blank.text || '',
      id: `blank-${Date.now()}-${qNum}`,
      questionNumber: qNum++,
      marks: blueprint.blanksMarksEach,
    });
  });

  // 3. Generate Vocabulary / Word Meanings / Match Columns
  if (blueprint.vocabCount > 0) {
    const vocabQ = getSubjectSpecificVocab(blueprint.subject, blueprint.vocabCount, isUrdu, isArabic);
    objectiveQuestions.push({
      ...vocabQ,
      type: 'vocabulary',
      text: vocabQ.text || '',
      id: `vocab-${Date.now()}-${qNum}`,
      questionNumber: qNum++,
      marks: blueprint.vocabCount * blueprint.vocabMarksEach,
    });
  }

  if (objectiveQuestions.length > 0) {
    const totalObjMarks = objectiveQuestions.reduce((sum, q) => sum + q.marks, 0);
    sections.push({
      id: `sec-obj-${Date.now()}`,
      sectionTitle: isUrdu 
        ? 'حصہ اول: معروضی سوالات (Section A - Objective)' 
        : isArabic 
        ? 'القسم الأول: الأسئلة الموضوعية (Section A - Objective)' 
        : 'Section A: Objective Questions',
      instructions: isUrdu
        ? 'تمام سوالات لازمی ہیں۔ درست جواب کی نشاندہی کریں۔ کاٹ کر یا اوور رائٹنگ کر کے لکھا گیا جواب منسوخ ہوگا۔'
        : isArabic
        ? 'جميع الأسئلة إجبارية. اختر الإجابة الصحيحة بعناية.'
        : 'Attempt all questions. Cutting, erasing or overwriting in this section will result in zero marks.',
      totalMarks: totalObjMarks,
      questions: objectiveQuestions,
    });
  }

  // ==========================================
  // SECTION B: SHORT QUESTIONS
  // ==========================================
  if (blueprint.shortCountTotal > 0) {
    const shortQsRaw = getSubjectSpecificShortQuestions(
      blueprint.subject,
      blueprint.grade,
      blueprint.shortCountTotal,
      isUrdu,
      isArabic,
      isMath
    );

    const shortQuestions: Question[] = shortQsRaw.map((q, idx) => ({
      ...q,
      type: 'short',
      text: q.text || '',
      id: `sq-${Date.now()}-${idx + 1}`,
      questionNumber: idx + 1,
      marks: blueprint.shortMarksEach,
    }));

    const attemptMarks = blueprint.shortCountToAttempt * blueprint.shortMarksEach;

    sections.push({
      id: `sec-short-${Date.now()}`,
      sectionTitle: isUrdu
        ? 'حصہ دوم: مختصر سوالات (Section B - Short Questions)'
        : isArabic
        ? 'القسم الثاني: الأسئلة القصيرة (Section B - Short Questions)'
        : 'Section B: Short Answer Questions',
      instructions: isUrdu
        ? `کوئی سے ${blueprint.shortCountToAttempt} سوالات کے مختصر و جامع جوابات تحریر کیجیے۔ (${blueprint.shortCountToAttempt} × ${blueprint.shortMarksEach} = ${attemptMarks} نمبر)`
        : isArabic
        ? `أجب عن أي ${blueprint.shortCountToAttempt} أسئلة باختصار ووضوح.`
        : `Attempt any ${blueprint.shortCountToAttempt} out of ${blueprint.shortCountTotal} questions. Each question carries ${blueprint.shortMarksEach} marks. (${blueprint.shortCountToAttempt} × ${blueprint.shortMarksEach} = ${attemptMarks} Marks)`,
      allowedChoiceText: `Attempt any ${blueprint.shortCountToAttempt} out of ${blueprint.shortCountTotal} questions`,
      totalMarks: attemptMarks,
      questions: shortQuestions,
    });
  }

  // ==========================================
  // SECTION C: LONG / SUBJECTIVE QUESTIONS
  // ==========================================
  if (blueprint.longCountTotal > 0) {
    const longQsRaw = getSubjectSpecificLongQuestions(
      blueprint.subject,
      blueprint.grade,
      blueprint.longCountTotal,
      isUrdu,
      isArabic,
      isMath
    );

    const longQuestions: Question[] = longQsRaw.map((q, idx) => ({
      ...q,
      type: 'long',
      text: q.text || '',
      id: `lq-${Date.now()}-${idx + 1}`,
      questionNumber: idx + 1,
      marks: blueprint.longMarksEach,
    }));


    const attemptLongMarks = blueprint.longCountToAttempt * blueprint.longMarksEach;

    sections.push({
      id: `sec-long-${Date.now()}`,
      sectionTitle: isUrdu
        ? 'حصہ سوم: تفصیلی و انشائیہ سوالات (Section C - Subjective)'
        : isArabic
        ? 'القسم الثالث: الأسئلة المقالية المفصلة (Section C - Subjective)'
        : 'Section C: Subjective & Analytical Questions',
      instructions: isUrdu
        ? `کوئی سے ${blueprint.longCountToAttempt} تفصیلی سوالات حل کیجیے۔ (${blueprint.longCountToAttempt} × ${blueprint.longMarksEach} = ${attemptLongMarks} نمبر)`
        : isArabic
        ? `أجب عن أي ${blueprint.longCountToAttempt} أسئلة مقالية بالتفصيل والدقة.`
        : `Attempt any ${blueprint.longCountToAttempt} out of ${blueprint.longCountTotal} questions. Each carries ${blueprint.longMarksEach} marks. (${blueprint.longCountToAttempt} × ${blueprint.longMarksEach} = ${attemptLongMarks} Marks)`,
      allowedChoiceText: `Attempt any ${blueprint.longCountToAttempt} out of ${blueprint.longCountTotal} questions`,
      totalMarks: attemptLongMarks,
      questions: longQuestions,
    });
  }

  // Calculate actual total marks
  const finalCalculatedMarks = sections.reduce((sum, s) => sum + s.totalMarks, 0);

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
      'Read every question carefully before answering.',
      'Check that this question paper contains all pages and sections as stated.',
      'Borrowing calculators, geometry boxes, or stationery is strictly prohibited.',
    ],
    showBismillah: true,
    showWatermark: true,
    showStudentTable: true,
    boardFormat: 'bise',
    paperCode: `${Math.floor(1000 + Math.random() * 9000)}`,
    examGroup: 'Group-I (Morning)',
    showBubbleSheet: true,
    layoutColumns: 1,
    fontSize: 'standard',
    paperSize: blueprint.paperSize || 'a4',
    sections,
    createdVia: 'ai_generator',
    createdAt: new Date().toISOString(),
  };
};

// ==========================================
// Subject Specific Question Banks & Helpers
// ==========================================

function getSubjectSpecificMcqs(subject: string, grade: string, count: number, isUrdu: boolean, isArabic: boolean): Partial<Question>[] {
  if (subject.includes('Islamic') || subject.includes('اسلامیات')) {
    const pool = [
      {
        text: 'سورۃ الحجرات میں اللہ تعالیٰ نے مومنوں کو کس چیز سے بچنے کی تاکید فرمائی ہے؟',
        options: [
          { id: '1', label: 'الف', text: 'کثرتِ گمان اور تجسس' },
          { id: '2', label: 'ب', text: 'باہمی گفتگو' },
          { id: '3', label: 'ج', text: 'تجارت و کسبِ حلال' },
          { id: '4', label: 'د', text: 'سفر و ہجرت' },
        ],
        blankAnswer: 'کثرتِ گمان اور تجسس',
        sampleAnswer: 'کثرتِ گمان، بدگمانی، تجسس اور غیبت سے روکا گیا ہے۔',
      },
      {
        text: 'قرآن مجید میں غیبت کرنے کو کس فعل کے مشابہ قرار دیا گیا ہے؟',
        options: [
          { id: '1', label: 'الف', text: 'مردہ بھائی کا گوشت کھانے کے' },
          { id: '2', label: 'ب', text: 'مالِ یتیم کھانے کے' },
          { id: '3', label: 'ج', text: 'چوری کرنے کے' },
          { id: '4', label: 'د', text: 'امانت میں خیانت کے' },
        ],
        blankAnswer: 'مردہ بھائی کا گوشت کھانے کے',
      },
      {
        text: 'حدیثِ نبوی ﷺ: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَ..." مکمل کریں:',
        options: [
          { id: '1', label: 'الف', text: 'يَدِهِ (اس کے ہاتھ سے)' },
          { id: '2', label: 'ب', text: 'عَيْنِهِ (اس کی آنکھ سے)' },
          { id: '3', label: 'ج', text: 'قَلْبِهِ (اس کے دل سے)' },
          { id: '4', label: 'د', text: 'رِجْلِهِ (اس کے پاؤں سے)' },
        ],
        blankAnswer: 'يَدِهِ (اس کے ہاتھ سے)',
      },
      {
        text: 'ارکانِ اسلام میں مالی عبادت کون سی ہے؟',
        options: [
          { id: '1', label: 'الف', text: 'زکوٰۃ' },
          { id: '2', label: 'ب', text: 'نماز' },
          { id: '3', label: 'ج', text: 'روزہ' },
          { id: '4', label: 'د', text: 'شہادتین' },
        ],
        blankAnswer: 'زکوٰۃ',
      },
      {
        text: 'صلح حدیبیہ کس سن ہجری میں واقع ہوئی؟',
        options: [
          { id: '1', label: 'الف', text: '6 ہجری' },
          { id: '2', label: 'ب', text: '5 ہجری' },
          { id: '3', label: 'ج', text: '8 ہجری' },
          { id: '4', label: 'د', text: '9 ہجری' },
        ],
        blankAnswer: '6 ہجری',
      },
      {
        text: 'اللہ تعالیٰ کے نزدیک سب سے معزز اور مکرم شخص وہ ہے جو:',
        options: [
          { id: '1', label: 'الف', text: 'سب سے زیادہ متقی ہو' },
          { id: '2', label: 'ب', text: 'سب سے زیادہ مالدار ہو' },
          { id: '3', label: 'ج', text: 'سب سے اونچے قبیلے سے ہو' },
          { id: '4', label: 'د', text: 'سب سے بڑا حاکم ہو' },
        ],
        blankAnswer: 'سب سے زیادہ متقی ہو',
      },
    ];
    return cyclePool(pool, count);
  }

  if (subject.includes('Math') || subject.includes('ریاضی')) {
    const pool = [
      {
        text: 'The standard form of a quadratic equation with variable $x$ is:',
        options: [
          { id: '1', label: 'A', text: '$ax^2 + bx + c = 0, a \\neq 0$' },
          { id: '2', label: 'B', text: '$ax + b = 0$' },
          { id: '3', label: 'C', text: '$ax^3 + bx + c = 0$' },
          { id: '4', label: 'D', text: '$x^2 = -c$' },
        ],
        blankAnswer: '$ax^2 + bx + c = 0, a \\neq 0$',
      },
      {
        text: 'If the discriminant $\\Delta = b^2 - 4ac > 0$ and is a perfect square, roots are:',
        options: [
          { id: '1', label: 'A', text: 'Real, rational, and unequal' },
          { id: '2', label: 'B', text: 'Real and equal' },
          { id: '3', label: 'C', text: 'Imaginary / complex' },
          { id: '4', label: 'D', text: 'Irrational and equal' },
        ],
        blankAnswer: 'Real, rational, and unequal',
      },
      {
        text: 'The sum of the three cube roots of unity $(1 + \\omega + \\omega^2)$ is always equal to:',
        options: [
          { id: '1', label: 'A', text: '$0$' },
          { id: '2', label: 'B', text: '$1$' },
          { id: '3', label: 'C', text: '$-1$' },
          { id: '4', label: 'D', text: '$\\omega$' },
        ],
        blankAnswer: '$0$',
      },
      {
        text: 'The distance of point $P(3, 4)$ from the origin is:',
        options: [
          { id: '1', label: 'A', text: '$5$' },
          { id: '2', label: 'B', text: '$7$' },
          { id: '3', label: 'C', text: '$\\sqrt{7}$' },
          { id: '4', label: 'D', text: '$25$' },
        ],
        blankAnswer: '$5$',
      },
      {
        text: 'In a right triangle, $\\sin^2 \\theta + \\cos^2 \\theta$ is identically equal to:',
        options: [
          { id: '1', label: 'A', text: '$1$' },
          { id: '2', label: 'B', text: '$0$' },
          { id: '3', label: 'C', text: '$\\tan \\theta$' },
          { id: '4', label: 'D', text: '$-1$' },
        ],
        blankAnswer: '$1$',
      },
    ];
    return cyclePool(pool, count);
  }

  if (subject.includes('Urdu') || subject.includes('اردو')) {
    const pool = [
      {
        text: 'نظم "حمد" کس ایسی صنفِ سخن کو کہا جاتا ہے جس میں:',
        options: [
          { id: '1', label: 'الف', text: 'اللہ تعالیٰ کی تعریف و توصیف بیان کی جائے' },
          { id: '2', label: 'ب', text: 'حضور اکرم ﷺ کی مدح کی جائے' },
          { id: '3', label: 'ج', text: 'بزرگانِ دین کا تذکرہ ہو' },
          { id: '4', label: 'د', text: 'فطرت کے مناظر بیان کیے جائیں' },
        ],
        blankAnswer: 'اللہ تعالیٰ کی تعریف و توصیف بیان کی جائے',
      },
      {
        text: 'لفظ "چراغ پا ہونا" قواعد کی رو سے کیا ہے؟',
        options: [
          { id: '1', label: 'الف', text: 'محاورہ' },
          { id: '2', label: 'ب', text: 'ضرب المثل' },
          { id: '3', label: 'ج', text: 'تلمیح' },
          { id: '4', label: 'د', text: 'روزمرہ' },
        ],
        blankAnswer: 'محاورہ',
      },
      {
        text: 'غزل کے آخری شعر کو جس میں شاعر اپنا تخلص استعمال کرتا ہے، کیا کہتے ہیں؟',
        options: [
          { id: '1', label: 'الف', text: 'مقطع' },
          { id: '2', label: 'ب', text: 'مطلع' },
          { id: '3', label: 'ج', text: 'قافیہ' },
          { id: '4', label: 'د', text: 'ردیف' },
        ],
        blankAnswer: 'مقطع',
      },
      {
        text: 'درج ذیل میں سے درست املا والا لفظ منتخب کریں:',
        options: [
          { id: '1', label: 'الف', text: 'علحیدہ' },
          { id: '2', label: 'ب', text: 'علیحدہ' },
          { id: '3', label: 'ج', text: 'علیحدہء' },
          { id: '4', label: 'د', text: 'الائحدہ' },
        ],
        blankAnswer: 'علیحدہ',
      },
    ];
    return cyclePool(pool, count);
  }

  // Default English / Science
  const pool = [
    {
      text: 'Which organelle is universally known as the powerhouse of the cell?',
      options: [
        { id: '1', label: 'A', text: 'Mitochondria' },
        { id: '2', label: 'B', text: 'Ribosome' },
        { id: '3', label: 'C', text: 'Nucleus' },
        { id: '4', label: 'D', text: 'Endoplasmic Reticulum' },
      ],
      blankAnswer: 'Mitochondria',
    },
    {
      text: 'What is the SI unit of electric current?',
      options: [
        { id: '1', label: 'A', text: 'Ampere (A)' },
        { id: '2', label: 'B', text: 'Volt (V)' },
        { id: '3', label: 'C', text: 'Ohm (Ω)' },
        { id: '4', label: 'D', text: 'Watt (W)' },
      ],
      blankAnswer: 'Ampere (A)',
    },
    {
      text: 'The value of acceleration due to gravity $g$ on the surface of Earth is approximately:',
      options: [
        { id: '1', label: 'A', text: '$9.8\\text{ m/s}^2$' },
        { id: '2', label: 'B', text: '$1.6\\text{ m/s}^2$' },
        { id: '3', label: 'C', text: '$19.6\\text{ m/s}^2$' },
        { id: '4', label: 'D', text: '$98\\text{ m/s}^2$' },
      ],
      blankAnswer: '$9.8\\text{ m/s}^2$',
    },
  ];
  return cyclePool(pool, count);
}

function getSubjectSpecificBlanks(subject: string, grade: string, count: number, isUrdu: boolean, isArabic: boolean): Partial<Question>[] {
  if (subject.includes('Islamic') || subject.includes('اسلامیات')) {
    const pool = [
      {
        text: 'سورۃ الحجرات میں اللہ تعالیٰ نے تمام مومنوں کو آپس میں ________ قرار دیا ہے۔',
        blankAnswer: 'بھائی بھائی (إِخْوَة)',
        type: 'fill_in_the_blank' as const,
      },
      {
        text: 'کسی مسلمان کی غیر موجودگی میں اس کے عیوب بیان کرنا شریعت میں ________ کہلاتا ہے۔',
        blankAnswer: 'غیبت',
        type: 'fill_in_the_blank' as const,
      },
      {
        text: 'حدیثِ نبوی ﷺ کے مطابق: "الطُّهُورُ شَطْرُ ________" (صفائی اور پاکیزگی آدھا ایمان ہے)۔',
        blankAnswer: 'الْإِيمَانِ',
        type: 'fill_in_the_blank' as const,
      },
    ];
    return cyclePool(pool, count);
  }

  if (subject.includes('Math') || subject.includes('ریاضی')) {
    const pool = [
      {
        text: 'The discriminant formula for quadratic equation $ax^2 + bx + c = 0$ is ________.',
        blankAnswer: '$b^2 - 4ac$',
        type: 'fill_in_the_blank' as const,
      },
      {
        text: 'A set having no element is called an empty set or ________ set.',
        blankAnswer: 'null',
        type: 'fill_in_the_blank' as const,
      },
      {
        text: 'The trigonometric identity $\\tan \\theta$ is equal to $\\frac{\\sin \\theta}{________}$.',
        blankAnswer: '$\\cos \\theta$',
        type: 'fill_in_the_blank' as const,
      },
    ];
    return cyclePool(pool, count);
  }

  // Default Blanks
  const pool = [
    {
      text: 'Water boils at ________ °C at standard atmospheric pressure.',
      blankAnswer: '100',
      type: 'fill_in_the_blank' as const,
    },
    {
      text: 'The chemical formula for table salt is ________.',
      blankAnswer: 'NaCl',
      type: 'fill_in_the_blank' as const,
    },
  ];
  return cyclePool(pool, count);
}

function getSubjectSpecificVocab(subject: string, count: number, isUrdu: boolean, isArabic: boolean): Partial<Question> {
  if (subject.includes('Islamic') || subject.includes('Arabic') || subject.includes('اسلامیات')) {
    return {
      type: 'vocabulary',
      text: 'درج ذیل قرآنی و عربی الفاظ کے سامنے ان کے درست اردو معانی ملائیے / تحریر کیجیے:',
      columnMatchLeft: ['لَا تَقَدَّمُوا', 'تَجَسَّسُوا', 'تَنَابَزُوا بِالْأَلْقَابِ', 'الْمُقْسِطِينَ'],
      columnMatchRight: ['آگے نہ بڑھو', 'ٹوہ اور تجسس نہ لگاؤ', 'برے القاب سے مت پکارو', 'انصاف کرنے والے'],
      sampleAnswer: 'لَا تَقَدَّمُوا = آگے نہ بڑھو | تَجَسَّسُوا = ٹوہ نہ لگاؤ | تَنَابَزُوا = برے نام نہ رکھو | الْمُقْسِطِينَ = انصاف کرنے والے',
    };
  }

  if (subject.includes('Urdu') || subject.includes('اردو')) {
    return {
      type: 'vocabulary',
      text: 'درج ذیل الفاظ کے متضاد (الفاظ و اضداد) تحریر کیجیے:',
      columnMatchLeft: ['فراز', 'ظلمت', 'کسب', 'عروج'],
      columnMatchRight: ['نشیب', 'نور / روشنی', 'زیاں / نقصان', 'زوال'],
      sampleAnswer: 'فراز: نشیب | ظلمت: نور | کسب: زیاں | عروج: زوال',
    };
  }

  return {
    type: 'vocabulary',
    text: 'Match the academic terms in Column A with their exact definitions in Column B:',
    columnMatchLeft: ['Hypothesis', 'Photosynthesis', 'Equilibrium', 'Catalyst'],
    columnMatchRight: [
      'A testable tentative explanation',
      'Process of food making in green plants',
      'State of balance between opposing forces',
      'Substance that speeds up reaction without being consumed',
    ],
  };
}

function getSubjectSpecificShortQuestions(
  subject: string,
  grade: string,
  count: number,
  isUrdu: boolean,
  isArabic: boolean,
  isMath: boolean
): Partial<Question>[] {
  if (subject.includes('Islamic') || subject.includes('اسلامیات')) {
    const pool = [
      {
        text: 'سورۃ الحجرات میں اللہ تعالیٰ کے رسول ﷺ کی بارگاہ کے کون سے دو بنیادی آداب بیان فرمائے گئے ہیں؟',
        sampleAnswer: '1. نبی کریم ﷺ کی آواز سے اپنی آواز بلند نہ کی جائے۔ 2. آپ ﷺ کو عام انسانوں کی طرح نام لے کر پکارنے سے پرہیز کیا جائے۔',
      },
      {
        text: 'اسلام میں "غیبت" کی کیا تعریف ہے اور شریعت نے اس کی سختی سے کیوں ممانعت فرمائی ہے؟',
        sampleAnswer: 'کسی مسلمان کی عدم موجودگی میں ایسی بات کرنا جو اس کو ناگوار گزرے۔ اس سے باہمی اعتماد، پیار اور اخوت کا شیرازہ بکھر جاتا ہے۔',
      },
      {
        text: 'حدیث نبوی ﷺ کی روشنی میں "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَىٰ كُلِّ مُسْلِمٍ" کی وضاحت اور اہمیت بیان کریں۔',
        sampleAnswer: 'علم حاصل کرنا ہر مسلمان پر فرض ہے۔ علم انسان کو حلال و حرام کی تمیز اور اللہ کی معرفت بخشتا ہے۔',
      },
      {
        text: 'اسلامی معاشرے میں عدل و انصاف (قسط) قائم رکھنے کے متعلق قرآنی حکم کیا ہے؟',
        sampleAnswer: 'اللہ تعالیٰ نے حکم دیا کہ اگر دو گروہوں میں جھگڑا ہو تو عدل و انصاف کے ساتھ صلح کراؤ، کیونکہ اللہ انصاف کرنے والوں کو پسند فرماتا ہے۔',
      },
      {
        text: 'ارکانِ اسلام کے نام تحریر کریں اور نماز (صلوٰۃ) کو دین کا ستون کیوں کہا گیا ہے؟',
        sampleAnswer: 'توحید و رسالت، نماز، روزہ، زکوٰۃ اور حج۔ نماز انسان کو بے حیائی اور برائی سے روکتی ہے اور تعلق باللہ استوار رکھتی ہے۔',
      },
      {
        text: 'امانت اور دیانت داری کی فضیلت پر سیرتِ طیبہ سے ایک مختصر واقعہ تحریر کیجیے۔',
        sampleAnswer: 'نبی کریم ﷺ کو اعلانِ نبوت سے قبل بھی کفارِ مکہ "صادق" اور "امین" کہتے تھے، حتیٰ کہ ہجرت کی رات بھی کفار کی امانتیں حضرت علیؓ کے سپرد فرمائیں۔',
      },
      {
        text: 'حقوق العباد سے کیا مراد ہے اور اسلام میں اس کا کیا مقام ہے؟',
        sampleAnswer: 'بندوں کے باہمی حقوق، جیسے والدین، رشتہ داروں اور پڑوسیوں کے حقوق۔ اللہ تعالیٰ اپنے حقوق معاف فرما سکتا ہے مگر بندوں کے حقوق بندے ہی معاف کریں گے۔',
      },
    ];
    return cyclePool(pool, count);
  }

  if (subject.includes('Math') || subject.includes('ریاضی')) {
    const pool = [
      {
        text: 'Solve the quadratic equation by factoring: $x^2 + 7x + 12 = 0$',
        sampleAnswer: '$(x + 3)(x + 4) = 0 \\implies x = -3, x = -4$. Solution set = $\\{-3, -4\\}$.',
      },
      {
        text: 'Find the discriminant of $3x^2 - 5x + 1 = 0$ and describe the nature of its roots.',
        sampleAnswer: '$\\Delta = (-5)^2 - 4(3)(1) = 25 - 12 = 13 > 0$. Roots are real, irrational, and unequal.',
      },
      {
        text: 'Prove that the product of all three complex cube roots of unity is equal to $1$.',
        sampleAnswer: '$1 \\times \\omega \\times \\omega^2 = \\omega^3 = 1$. Hence proved.',
      },
      {
        text: 'If $\\alpha$ and $\\beta$ are the roots of $2x^2 - 4x + 5 = 0$, find the value of $\\alpha + \\beta$ and $\\alpha \\cdot \\beta$.',
        sampleAnswer: '$\\alpha + \\beta = -(-4)/2 = 2$. Product $\\alpha \\cdot \\beta = 5/2$.',
      },
      {
        text: 'Resolve into partial fractions: $\\frac{2x + 1}{(x - 1)(x + 2)}$',
        sampleAnswer: '$\\frac{A}{x-1} + \\frac{B}{x+2} \\implies A = 1, B = 1$. Result = $\\frac{1}{x-1} + \\frac{1}{x+2}$.',
      },
      {
        text: 'Find the standard deviation of the numbers: $2, 4, 6, 8, 10$.',
        sampleAnswer: 'Mean $\\bar{x} = 6$. Deviations: $-4, -2, 0, 2, 4$. Sum of squares $= 40$. $s = \\sqrt{40/5} = \\sqrt{8} \\approx 2.83$.',
      },
    ];
    return cyclePool(pool, count);
  }

  if (subject.includes('Urdu') || subject.includes('اردو')) {
    const pool = [
      {
        text: 'اسم نکرہ اور اسم معرفہ میں کیا فرق ہے؟ دو دو مثالوں سے واضح کیجیے۔',
        sampleAnswer: 'اسم معرفہ کسی خاص شخص، جگہ یا چیز کے نام کو کہتے ہیں (جیسے کراچی، اقبال)۔ اسم نکرہ کسی عام چیز کو کہتے ہیں (جیسے شہر، آدمی)۔',
      },
      {
        text: 'درج ذیل محاورات کا مفہوم بیان کریں اور جملے بنائیں: (1) اینٹ سے اینٹ بجانا (2) باغ باغ ہونا',
        sampleAnswer: 'اینٹ سے اینٹ بجانا: تباہ و برباد کرنا۔ باغ باغ ہونا: بہت زیادہ خوش ہونا۔',
      },
      {
        text: 'تشبیہ کی تعریف کریں اور اس کے چار ارکان کے نام تحریر کریں۔',
        sampleAnswer: 'کسی ایک چیز کو کسی مشترک خوبی کی بنا پر دوسری چیز کی مانند قرار دینا۔ ارکان: مشبہ، مشبہ بہ، وجہ شبہ، حرفِ تشبیہ۔',
      },
      {
        text: 'علامہ محمد اقبال کے کلام کا بنیادی پیغام کیا ہے؟ مختصراً بیان کریں۔',
        sampleAnswer: 'خودی کی بیداری، خود اعتمادی، جہدِ مسلسل اور امت مسلمہ کا باوقار احیاء۔',
      },
    ];
    return cyclePool(pool, count);
  }

  // Default Science / General
  const pool = [
    {
      text: 'State Newton’s Second Law of Motion and write its mathematical equation.',
      sampleAnswer: 'When a net force acts on a body, it produces acceleration in the direction of the force: $F = ma$.',
    },
    {
      text: 'Differentiate between kinetic energy and potential energy with everyday examples.',
      sampleAnswer: 'Kinetic energy is energy possessed by a body due to its motion ($E_k = \\frac{1}{2}mv^2$). Potential energy is energy due to position ($E_p = mgh$).',
    },
    {
      text: 'What is the greenhouse effect and how does it contribute to global warming?',
      sampleAnswer: 'Greenhouse gases like $CO_2$ trap heat radiated from Earth’s surface, raising planetary temperatures.',
    },
  ];
  return cyclePool(pool, count);
}

function getSubjectSpecificLongQuestions(
  subject: string,
  grade: string,
  count: number,
  isUrdu: boolean,
  isArabic: boolean,
  isMath: boolean
): Partial<Question>[] {
  if (subject.includes('Islamic') || subject.includes('اسلامیات')) {
    const pool = [
      {
        text: 'درج ذیل قرآنی آیت مبارکہ کا با محاورہ اردو ترجمہ اور تفصیلی تشریح تحریر کیجیے:\n"يَا أَيُّهَا الَّذِينَ آمَنُوا اجْتَنِبُوا كَثِيرًا مِّنَ الظَّنِّ إِنَّ بَعْضَ الظَّنِّ إِثْمٌ ۖ وَلَا تَجَسَّسُوا وَلَا يَغْتَب بَّعْضُكُم بَعْضًا ۚ أَيُحِبُّ أَحَدُكُمْ أَن يَأْكُلَ لَحْمَ أَخِيهِ مَيْتًا فَكَرِهْتُمُوهُ ۚ وَاتَّقُوا اللَّهَ ۚ إِنَّ اللَّهَ تَوَّابٌ رَّحِيمٌ"',
        sampleAnswer: 'ترجمہ: اے ایمان والو! بہت سے گمانوں سے بچو... تشریح: گمان کی برائیاں، تجسس کی ممانعت، اور معاشرتی امن کے تحفظ پر مفصل گفتگو۔',
      },
      {
        text: 'سیرت النبی ﷺ کی روشنی میں "مواخاتِ مدینہ" (اسلامی اخوت و بھائی چارہ) کے تاریخی پس منظر، انصار و مہاجرین کے ایثار اور موجودہ دور میں اس کی عملی اہمیت پر جامع مضمون لکھیے۔',
        sampleAnswer: 'ہجرت مدینہ کا احوال، مواخات کا آغاز، معاشی معاونت اور اتحادِ امت کے جدید تقاضے۔',
      },
      {
        text: 'اسلام میں عورتوں کے حقوق و فرائض پر قرآن و سنت کی روشنی میں جامع روشنی ڈالیے اور دورِ جہالت اور دورِ اسلام کا تقابلی جائزہ پیش کیجیے۔',
        sampleAnswer: 'عزت و احترام، وراثت میں حق، تعلیم کا حق اور عائلی زندگی میں ذمہ داریاں۔',
      },
    ];
    return cyclePool(pool, count);
  }

  if (subject.includes('Math') || subject.includes('ریاضی')) {
    const pool = [
      {
        text: 'Solve the system of quadratic equations simultaneously:\n$$\nx^2 + y^2 = 25 \\quad \\text{and} \\quad 3x + 4y = 25\n$$',
        sampleAnswer: 'From linear equation, $y = \\frac{25 - 3x}{4}$. Substituting into circle equation gives $(x - 3)^2 = 0 \\implies x = 3, y = 4$. Solution set = $\\{(3, 4)\\}$.',
      },
      {
        text: 'Prove that if two chords of a circle are congruent, then they are equidistant from the center of the circle. Draw labeled diagram with given, to prove, construction, and proof steps.',
        sampleAnswer: 'Circle with center O, chords $AB = CD$. Draw perpendiculars $OL \\perp AB$ and $OM \\perp CD$. Using congruent triangles $\\Delta OLA \\cong \\Delta OMC$, $OL = OM$.',
      },
      {
        text: 'Verify the trigonometric identity with complete step-by-step mathematical proof:\n$$\n\\frac{\\cos \\theta}{1 - \\tan \\theta} + \\frac{\\sin \\theta}{1 - \\cot \\theta} = \\sin \\theta + \\cos \\theta\n$$',
        sampleAnswer: 'Express $\\tan \\theta = \\sin/\\cos$ and $\\cot \\theta = \\cos/\\sin$. Common denominators yield $\\frac{\\cos^2\\theta}{\\cos\\theta-\\sin\\theta} - \\frac{\\sin^2\\theta}{\\cos\\theta-\\sin\\theta} = \\frac{\\cos^2\\theta-\\sin^2\\theta}{\\cos\\theta-\\sin\\theta} = \\cos\\theta+\\sin\\theta$.',
      },
    ];
    return cyclePool(pool, count);
  }

  if (subject.includes('Urdu') || subject.includes('اردو')) {
    const pool = [
      {
        text: 'درج ذیل اشعار کی تشریح کیجیے، نظم کا عنوان اور شاعر کا نام بھی تحریر کریں:\n"دل سے جو بات نکلتی ہے اثر رکھتی ہے\nپر نہیں، طاقتِ پرواز مگر رکھتی ہے\nقدسی الاصل ہے، رفعت پہ نظر رکھتی ہے\nخاک سے اٹھتی ہے، گردوں پہ گزر رکھتی ہے"',
        sampleAnswer: 'شاعر: علامہ محمد اقبال، نظم: شکوہ و جواب شکوہ۔ دعا اور سچی فریاد کی تاثیر کا بیان کہ خلوص نیت سے کی گئی دعا عرش تک پہنچتی ہے۔',
      },
      {
        text: 'اپنے علاقے کے ناظم / بلدیاتی چیئرمین کے نام محلے کی صفائی کی ابتر صورتحال اور نالیوں کی مرمت کے لیے ایک جامع درخواست تحریر کریں۔',
        sampleAnswer: 'بخدمت جناب چیئرمین بلدیہ، عنوان، مؤدبانہ گزارش، محلے کے مسائل، صفائی کا فقدان اور فوری اقدامات کی استدعا۔',
      },
    ];
    return cyclePool(pool, count);
  }

  // Default Long
  const pool = [
    {
      text: 'Explain the working principle and structural components of an AC Electric Generator with a neat, well-labeled diagram. Derive the induced EMF equation.',
      sampleAnswer: 'Faraday’s law of electromagnetic induction, armature coil, slip rings, magnetic field, and equation $\\varepsilon = \\varepsilon_0 \\sin(\\omega t)$.',
    },
    {
      text: 'Describe the structure of DNA (Deoxyribonucleic acid) according to Watson-Crick double helix model with labeled diagrams. Explain replication and hereditary functions.',
      sampleAnswer: 'Phosphate-sugar backbone, nitrogenous base pairs (A-T, G-C), hydrogen bonds, and double helix antiparallel strands.',
    },
  ];
  return cyclePool(pool, count);
}
