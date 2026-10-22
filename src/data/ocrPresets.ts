import type { Subject, GradeLevel, ExamTerm, Language } from '../types/exam';

export interface OcrPreset {
  id: string;
  title: string;
  category: 'Handwritten Exam' | 'Urdu & Arabic Notes' | 'Mathematics Worksheet' | 'Printed Question Paper' | 'English & Science Worksheet';
  language: Language;
  subject: Subject;
  gradeLevel: GradeLevel;
  examTerm: ExamTerm;
  totalMarks: number;
  timeAllowed: string;
  description: string;
  imageMockUrl: string;
  extractedRawText: string;
}

export const OCR_PRESETS: OcrPreset[] = [
  {
    id: 'ocr-islamiat-handwritten',
    title: 'اسلامیات لازمی - خطی امتحانی پرچہ و احادیث مبارکہ',
    category: 'Urdu & Arabic Notes',
    language: 'ur',
    subject: 'Islamic Studies (اسلامیات)',
    gradeLevel: 'Grade 9 (Matric / O-Level)',
    examTerm: 'Mid-Term Examination 2026',
    totalMarks: 25,
    timeAllowed: '1 Hour',
    description: 'اساتذہ کے ہاتھ سے تحریر کردہ قرآنی آیات، احادیث اور معروضی سوالات پر مشتمل ہاتھ کے نوٹس',
    imageMockUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="850" viewBox="0 0 600 850"><rect width="100%" height="100%" fill="%23fffdf5"/><path d="M40 0 v850 M80 0 v850" stroke="%23ffd5d5" stroke-width="1"/><g stroke="%23d8e2dc" stroke-width="1"><line x1="0" y1="90" x2="600" y2="90"/><line x1="0" y1="130" x2="600" y2="130"/><line x1="0" y1="170" x2="600" y2="170"/><line x1="0" y1="210" x2="600" y2="210"/><line x1="0" y1="250" x2="600" y2="250"/><line x1="0" y1="290" x2="600" y2="290"/><line x1="0" y1="330" x2="600" y2="330"/><line x1="0" y1="370" x2="600" y2="370"/><line x1="0" y1="410" x2="600" y2="410"/><line x1="0" y1="450" x2="600" y2="450"/><line x1="0" y1="490" x2="600" y2="490"/><line x1="0" y1="530" x2="600" y2="530"/><line x1="0" y1="570" x2="600" y2="570"/><line x1="0" y1="610" x2="600" y2="610"/><line x1="0" y1="650" x2="600" y2="650"/><line x1="0" y1="690" x2="600" y2="690"/></g><text x="300" y="70" font-family="serif" font-size="22" font-weight="bold" fill="%230F284E" text-anchor="middle">بسم اللہ الرحمن الرحیم</text><text x="540" y="120" font-family="serif" font-size="16" fill="%231e293b" text-anchor="end">سوال نمبر 1: درست جواب کا انتخاب کریں: (5 نمبر)</text><text x="540" y="160" font-family="serif" font-size="15" fill="%23334155" text-anchor="end">1. ارکان اسلام کی کل تعداد ہے: (الف) 4 (ب) 5 (ج) 6 (د) 7</text><text x="540" y="200" font-family="serif" font-size="15" fill="%23334155" text-anchor="end">2. حدیث نبوی: الصَّلَاةُ عِمَادُ الدِّينِ کا معنی ہے نماز دین کا _____ ہے۔</text><text x="540" y="240" font-family="serif" font-size="15" fill="%23334155" text-anchor="end">3. قرآن مجید کی سب سے افضل آیت کون سی ہے؟</text><text x="540" y="320" font-family="serif" font-size="16" fill="%231e293b" text-anchor="end">سوال نمبر 2: کوئی سے تین مختصر سوالات حل کریں: (9 نمبر)</text><text x="540" y="360" font-family="serif" font-size="14" fill="%23334155" text-anchor="end">الف) والدین کے حقوق کے متعلق ایک قرآنی آیت کا ترجمہ لکھیں۔</text><text x="540" y="400" font-family="serif" font-size="14" fill="%23334155" text-anchor="end">ب) زکوٰۃ کن لوگوں پر فرض ہے اور اس کے مصارف کون سے ہیں؟</text><text x="540" y="440" font-family="serif" font-size="14" fill="%23334155" text-anchor="end">ج) سیرت طیبہ کی روشنی میں امانت و دیانت پر نوٹ لکھیں۔</text><text x="540" y="520" font-family="serif" font-size="16" fill="%231e293b" text-anchor="end">سوال نمبر 3: تفصیلی سوال (10 نمبر)</text><text x="540" y="560" font-family="serif" font-size="14" fill="%23334155" text-anchor="end">اسلام میں حلال رزق کمانے کی فضیلت اور سود کی حرمت پر تفصیلی نوٹ لکھیں۔</text></svg>',
    extractedRawText: `The Achievers Islamic Academy
اسلامیات لازمی - نہم
کل نمبر: 25   وقت: 1 گھنٹہ

حصہ اول: معروضی سوالات (5 نمبر)
1. ارکان اسلام کی کل تعداد کتنی ہے؟
(الف) چار   (ب) پانچ   (ج) چھ   (د) سات

2. حدیث مبارکہ: "الصَّلَاةُ عِمَادُ الدِّينِ" کا ترجمہ ہے: نماز دین کا ________ ہے۔
خالی جگہ: ستون

3. قرآن مجید کی سب سے بابرکت اور عظیم ترین آیت کون سی ہے؟
(الف) سورۃ الفاتحہ   (ب) آیت الکرسی   (ج) سورۃ الاخلاص   (د) سورۃ الملک

حصہ دوم: مختصر سوالات (کوئی سے 3 حل کریں - کل 9 نمبر)
1. والدین کے ساتھ حسن سلوک سے متعلق ایک قرآنی آیت کا با محاورہ اردو ترجمہ تحریر کریں۔
2. زکوٰۃ کی تعریف کریں اور بتائیں کہ اسلامی شریعت میں نصابِ زکوٰۃ کیا ہے؟
3. حضرت محمد مصطفیٰ ﷺ کی امانت اور صداقت کی شہرت پر مختصر نوٹ لکھیں۔
4. روزہ کی معاشرتی اور اخلاقی اہمیت تین نکات میں بیان کریں۔

حصہ سوم: تفصیلی سوال (11 نمبر)
1. اسلامی معیشت میں حلال روزی کمانے کی برکات اور سود (ربا) کی حرمت پر قرآن و سنت کی روشنی میں جامع نوٹ تحریر کریں۔`,
  },
  {
    id: 'ocr-math-handwritten',
    title: 'Grade 10 Mathematics - Teacher Algebraic Test Draft',
    category: 'Mathematics Worksheet',
    language: 'math',
    subject: 'Mathematics (ریاضی)',
    gradeLevel: 'Grade 10 (Matric / O-Level)',
    examTerm: 'Mid-Term Examination 2026',
    totalMarks: 30,
    timeAllowed: '1 Hour',
    description: 'Handwritten algebra, quadratic equations, and geometric theorem test notes drafted by teacher',
    imageMockUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="850" viewBox="0 0 600 850"><rect width="100%" height="100%" fill="%23fcfdfc"/><g stroke="%23e2e8f0" stroke-width="1"><line x1="0" y1="80" x2="600" y2="80"/><line x1="0" y1="140" x2="600" y2="140"/><line x1="0" y1="200" x2="600" y2="200"/><line x1="0" y1="260" x2="600" y2="260"/><line x1="0" y1="320" x2="600" y2="320"/><line x1="0" y1="380" x2="600" y2="380"/><line x1="0" y1="440" x2="600" y2="440"/><line x1="0" y1="500" x2="600" y2="500"/></g><text x="40" y="55" font-family="sans-serif" font-size="16" font-weight="bold" fill="%230F284E">Math Unit Test - Handwritten Teacher Draft</text><text x="40" y="110" font-family="monospace" font-size="14" fill="%23334155">Q1. Solve quadratic equation: x^2 - 5x + 6 = 0 [3 Marks]</text><text x="40" y="170" font-family="monospace" font-size="14" fill="%23334155">Q2. Find discriminant for 2x^2 + 4x - 7 = 0 [3 Marks]</text><text x="40" y="230" font-family="monospace" font-size="14" fill="%23334155">Q3. If alpha, beta are roots, find alpha^2 + beta^2 [4 Marks]</text><text x="40" y="290" font-family="monospace" font-size="14" fill="%23334155">Q4. MCQ: Nature of roots when b^2 - 4ac &lt; 0 is: (a) real (b) imaginary [1 Mark]</text><text x="40" y="370" font-family="monospace" font-size="14" fill="%23334155">Q5. Long Question: Prove theorem: In right angled triangle, c^2 = a^2 + b^2 [8 Marks]</text></svg>',
    extractedRawText: `The Achievers Islamic Academy
Mathematics Mid-Term Assessment - Grade 10
Total Marks: 30    Time: 1 Hour

Section A: Multiple Choice Questions (5 Marks)
1. If the discriminant $b^2 - 4ac < 0$, then roots of the equation are:
(A) Real and equal   (B) Rational and unequal   (C) Imaginary (complex)   (D) Irrational

2. The solution set of $x^2 - 9 = 0$ is:
(A) $\\{3\\}$   (B) $\\{-3\\}$   (C) $\\{\\pm 3\\}$   (D) $\\{9\\}$

3. A quadratic equation has degree equal to:
(A) 1   (B) 2   (C) 3   (D) 4

4. Fill in the blank: The product of cube roots of unity is equal to ________.
Answer: 1

Section B: Short Questions (Attempt any 3 - 3 x 4 = 12 Marks)
1. Solve the quadratic equation by factorization: $x^2 - 5x + 6 = 0$
2. Find the discriminant of equation: $2x^2 + 4x - 7 = 0$ and describe the nature of roots.
3. If $\\alpha, \\beta$ are the roots of $x^2 - 3x + 2 = 0$, evaluate $\\alpha^2 + \\beta^2$.
4. Resolve into partial fractions: $\\frac{1}{(x-1)(x-2)}$

Section C: Long / Analytical Questions (Attempt 1 - 8 Marks)
1. State and prove Pythagoras Theorem: In a right-angled triangle, the square of the length of the hypotenuse is equal to the sum of the squares of the lengths of the other two sides.
2. Solve the following simultaneous equations graphically: $x + y = 6$ and $2x - y = 3$.`,
  },
  {
    id: 'ocr-urdu-literature',
    title: 'اردو لازمی - اشعار کی تشریح، محاورات اور قواعد',
    category: 'Printed Question Paper',
    language: 'ur',
    subject: 'Urdu Literature & Grammar (اردو)',
    gradeLevel: 'Grade 10 (Matric / O-Level)',
    examTerm: 'Mid-Term Examination 2026',
    totalMarks: 50,
    timeAllowed: '2 Hours',
    description: 'امتحانی پرچے کا اسکین شدہ نسخہ جس میں اشعار، محاورات، معروضی اور جامع مضمون شامل ہیں',
    imageMockUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="850" viewBox="0 0 600 850"><rect width="100%" height="100%" fill="%23ffffff"/><rect x="20" y="20" width="560" height="810" fill="none" stroke="%230F284E" stroke-width="2"/><text x="300" y="60" font-family="serif" font-size="20" font-weight="bold" fill="%230F284E" text-anchor="middle">دی اچیورز اسلامک اکیڈمی - اردو پرچہ</text><line x1="40" y1="80" x2="560" y2="80" stroke="%2394a3b8"/><text x="540" y="120" font-family="serif" font-size="15" fill="%230f172a" text-anchor="end">حصہ اول: اشعار کی تشریح (10 نمبر)</text><text x="540" y="160" font-family="serif" font-size="14" fill="%23334155" text-anchor="end">پتہ پتہ بوٹا بوٹا حال ہمارا جانے ہے / جانے نہ جانے گل ہی نہ جانے باغ تو سارا جانے ہے</text><text x="540" y="220" font-family="serif" font-size="15" fill="%230f172a" text-anchor="end">حصہ دوم: محاورات کا جملوں میں استعمال (5 نمبر)</text><text x="540" y="260" font-family="serif" font-size="14" fill="%23334155" text-anchor="end">1. آب آب ہونا  2. چراغ پا ہونا  3. دال میں کالا ہونا</text></svg>',
    extractedRawText: `The Achievers Islamic Academy
اردو لازمی - جماعت دہم
کل نمبر: 50   وقت: 2 گھنٹے

حصہ اول: معروضی سوالات (10 نمبر)
1. "پتہ پتہ بوٹا بوٹا حال ہمارا جانے ہے" یہ کس شاعر کا مشہور شعر ہے؟
(الف) میر تقی میر   (ب) مرزا اسد اللہ خان غالب   (ج) خواجہ میر درد   (د) علامہ محمد اقبال

2. لفظ "مسدس" ایسی نظم کو کہتے ہیں جس کے ہر بند میں ________ مصرعے ہوتے ہیں۔
خالی جگہ: چھ

3. درج ذیل میں سے اسمِ معرفہ کی نشاندہی کریں:
(الف) شہر   (ب) دریا   (ج) کراچی   (د) کتاب

حصہ دوم: انشائیہ (25 نمبر)
سوال نمبر 2: درج ذیل اشعار کی تشریح کیجیے، شاعر کا نام اور نظم کا عنوان بھی تحریر کریں:
"نہ تخت و تاج میں نے فقر و استغنا میں رکھی ہے
وہ عزت جو خدا نے خدمتِ انساں میں رکھی ہے"

سوال نمبر 3: درج ذیل محاورات میں سے کوئی سے چار (4) محاورات کو اپنے جملوں میں اس طرح استعمال کریں کہ مفہوم واضح ہو جائے:
(1) آب آب ہونا  (2) چراغ پا ہونا  (3) باغ باغ ہونا  (4) ہوش اڑ جانا  (5) دال نہ گلنا

حصہ سوم: تفصیلی مضمون (15 نمبر)
سوال نمبر 4: کسی ایک عنوان پر جامع مضمون قلمبند کریں:
(الف) سیرت النبی ﷺ بحیثیت معلم اخلاق
(ب) وقت کی پابندی اور قومی ترقی
(ج) ماحولیاتی آلودگی اور ہمارا کردار`,
  },
  {
    id: 'ocr-english-lit',
    title: 'English Language & Lit - Comprehension & Grammar Test',
    category: 'English & Science Worksheet',
    language: 'en',
    subject: 'English Language & Lit',
    gradeLevel: 'Grade 9 (Matric / O-Level)',
    examTerm: 'Mid-Term Examination 2026',
    totalMarks: 40,
    timeAllowed: '1 Hour 30 Minutes',
    description: 'Scanned teacher draft on reading comprehension, active/passive voice, idioms, and essay drafting',
    imageMockUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="850" viewBox="0 0 600 850"><rect width="100%" height="100%" fill="%23f8fafc"/><rect x="20" y="20" width="560" height="810" fill="none" stroke="%231e3a8a" stroke-width="2"/><text x="300" y="65" font-family="sans-serif" font-size="20" font-weight="bold" fill="%230F284E" text-anchor="middle">The Achievers Islamic Academy - English Assessment</text><line x1="40" y1="85" x2="560" y2="85" stroke="%23cbd5e1"/><text x="40" y="125" font-family="sans-serif" font-size="14" font-weight="bold" fill="%230F284E">Section A: Objective & Vocabulary (10 Marks)</text><text x="40" y="160" font-family="sans-serif" font-size="13" fill="%23334155">1. Identify synonym of "Benevolent": (A) Cruel (B) Generous (C) Proud (D) Weak</text><text x="40" y="200" font-family="sans-serif" font-size="13" fill="%23334155">2. Change voice: "The students completed the assignment on time."</text><text x="40" y="260" font-family="sans-serif" font-size="14" font-weight="bold" fill="%230F284E">Section B: Short Questions & Comprehension (20 Marks)</text><text x="40" y="300" font-family="sans-serif" font-size="13" fill="%23334155">1. Explain the moral theme highlighted in the poem "Daffodils".</text></svg>',
    extractedRawText: `The Achievers Islamic Academy
English Language & Lit Mid-Term Examination - Grade 9
Total Marks: 40    Time: 1 Hour 30 Minutes

Section A: Objective & Grammar (10 Marks)
1. Choose the correct synonym of the word 'Benevolent':
(A) Kind & Generous   (B) Cruel & Harsh   (C) Selfish   (D) Indifferent

2. Fill in the blank with appropriate preposition: "He is senior ________ me in academic qualifications."
Answer: to

3. Identify the part of speech for the underlined word: "She speaks English *fluently*."
(A) Adjective   (B) Adverb   (C) Conjunction   (D) Preposition

4. Choose the correctly punctuated sentence:
(A) Where are you going, Ali?   (B) where are you going Ali   (C) Where are you going Ali.   (D) Where are you going? Ali

Section B: Reading Comprehension & Short Questions (20 Marks)
1. Read the given excerpt and summarize the central theme of William Wordsworth's poem "Daffodils".
2. Change the following sentence from Active into Passive Voice: "The teacher appreciated the student's creative presentation."
3. Use the following idiom in an illustrative sentence: "A blessing in disguise".
4. Differentiate between a Transitive and Intransitive verb with one clear example of each.

Section C: Composition & Creative Writing (10 Marks)
1. Write a well-structured essay of 150-200 words on: "The Role of Digital Technology in Modern Islamic Education".`,
  },
];
