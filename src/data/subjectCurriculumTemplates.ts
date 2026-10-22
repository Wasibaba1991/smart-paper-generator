import type { ExamSection, Language, Subject, GradeLevel } from '../types/exam';

export interface CurriculumTemplate {
  subject: Subject;
  language: Language;
  totalMarks: number;
  timeAllowed: string;
  sections: ExamSection[];
  rawTextSample: string;
}

export const getCurriculumTemplateForSubject = (
  subject: Subject,
  grade: GradeLevel = 'Grade 9 (Matric / O-Level)'
): CurriculumTemplate => {
  // =========================================================================
  // 0. PRE-PRIMARY / NURSERY & KG SPECIALIZED CURRICULUMS
  // =========================================================================
  if (subject === 'Pre-Primary English & Phonics') {
    return {
      subject: 'Pre-Primary English & Phonics',
      language: 'en',
      totalMarks: 25,
      timeAllowed: '1 Hour',
      rawTextSample: `The Achievers Islamic Academy
Pre-Primary English & Phonics - ${grade}
Total Marks: 25   Time Allowed: 1 Hour

Section A: Alphabet Tracing & Handwriting (8 Marks)
1. Trace letters A a, B b, C c, D d neatly along the four guidelines.

Section B: Phonic Picture Matching (6 Marks)
1. Draw lines to match each letter to its matching picture (A -> Apple, B -> Balloon, C -> Cat, D -> Duck).

Section C: Object Counting & Circling (6 Marks)
1. Count the objects and circle the correct number bubble.

Section D: Coloring Fun (5 Marks)
1. Color the Apple Red inside the outline lines.`,
      sections: [
        {
          id: 'sec-prep-eng-trace',
          sectionTitle: 'Section A: Alphabet Tracing & Letter Practice (8 Marks)',
          instructions: 'Trace the letters neatly on the four guidelines. Start from the green dots.',
          totalMarks: 8,
          questions: [
            {
              id: 'prep-eng-q1',
              type: 'tracing',
              questionNumber: 1,
              text: 'Trace uppercase and lowercase letters on the four guidelines:',
              tracingLetters: ['A a', 'B b', 'C c', 'D d'],
              tracingGuideText: 'Start at the top red line and follow the pencil guides.',
              marks: 8,
              language: 'en',
            },
          ],
        },
        {
          id: 'sec-prep-eng-match',
          sectionTitle: 'Section B: Phonic Picture Matching (6 Marks)',
          instructions: 'Draw pencil lines to match each letter to the correct beginning sound picture.',
          totalMarks: 6,
          questions: [
            {
              id: 'prep-eng-q2',
              type: 'image_matching',
              questionNumber: 2,
              text: 'Match the letters to their phonic picture:',
              visualPairs: [
                { id: 'vp-1', leftIcon: '🍎', leftText: 'Apple', rightText: 'Letter A', rightIcon: '🅰️' },
                { id: 'vp-2', leftIcon: '🎈', leftText: 'Balloon', rightText: 'Letter B', rightIcon: '🅱️' },
                { id: 'vp-3', leftIcon: '🐱', leftText: 'Cat', rightText: 'Letter C', rightIcon: '🅲' },
                { id: 'vp-4', leftIcon: '🦆', leftText: 'Duck', rightText: 'Letter D', rightIcon: '🅳' },
              ],
              marks: 6,
              language: 'en',
            },
          ],
        },
        {
          id: 'sec-prep-eng-count',
          sectionTitle: 'Section C: Count & Circle the Correct Number (6 Marks)',
          instructions: 'Count the cute objects and circle the correct number bubble.',
          totalMarks: 6,
          questions: [
            {
              id: 'prep-eng-q3',
              type: 'count_and_circle',
              questionNumber: 3,
              text: 'Count each group of objects and circle the matching number:',
              countItemsList: [
                { icon: '🍎', count: 3, label: 'Apples' },
                { icon: '⭐', count: 4, label: 'Stars' },
                { icon: '🎈', count: 5, label: 'Balloons' },
              ],
              marks: 6,
              language: 'en',
            },
          ],
        },
        {
          id: 'sec-prep-eng-color',
          sectionTitle: 'Section D: Creative Drawing & Coloring Task (5 Marks)',
          instructions: 'Color the apple red with a green leaf. Try to stay inside the lines!',
          totalMarks: 5,
          questions: [
            {
              id: 'prep-eng-q4',
              type: 'coloring_drawing',
              questionNumber: 4,
              text: 'Color the cute apple red and leaf green (سیب میں لال رنگ بھریں):',
              drawingOutlineType: 'apple',
              drawingInstruction: 'Use red crayon for apple body and green for leaf.',
              marks: 5,
              language: 'en',
            },
          ],
        },
      ],
    };
  }

  if (subject === 'Pre-Primary Urdu (حروفیات و تصویری پہچان)') {
    return {
      subject: 'Pre-Primary Urdu (حروفیات و تصویری پہچان)',
      language: 'ur',
      totalMarks: 25,
      timeAllowed: '1 Hour',
      rawTextSample: `The Achievers Islamic Academy
نرسری و کے جی اردو امتحانی پرچہ - ${grade}
کل نمبر: 25   وقت: 1 گھنٹہ

حصہ اول: حروفیات کی خوشخطی اور پنسل پھیریں (8 نمبر)
1. دی گئی لکیروں پر حروفیات (ا، ب، پ، ت) پر پنسل پھیریں۔

حصہ دوم: تصویری جوڑ ملائیں (6 نمبر)
1. تصویر کو درست ابتدائی حرف سے پنسل کی لکیر کے ذریعے ملائیں۔

حصہ سوم: اشیاء گنیں اور درست ہندسے پر دائرہ لگائیں (6 نمبر)
1. اشیاء کی گنتی کر کے درست ہندسے کا انتخاب کریں۔

حصہ چہارم: رنگ بھریں (5 نمبر)
1. ہلال اور ستارے کی تصویر میں خوبصورت رنگ بھریں۔`,
      sections: [
        {
          id: 'sec-prep-urd-trace',
          sectionTitle: 'حصہ اول: حروفیات پر پنسل پھیریں (Tracing Practice)',
          instructions: 'نقطوں کو ملاتے ہوئے خوبصورت اور صاف خوشخطی کریں۔',
          totalMarks: 8,
          questions: [
            {
              id: 'prep-urd-q1',
              type: 'tracing',
              questionNumber: 1,
              text: 'دیے گئے حروف پر پنسل پھیریں اور خالی جگہ پر خود لکھیں:',
              tracingLetters: ['ا', 'ب', 'پ', 'ت', 'ٹ'],
              tracingGuideText: 'دائیں سے بائیں شروع کر کے نقطے ملائیں۔',
              marks: 8,
              language: 'ur',
            },
          ],
        },
        {
          id: 'sec-prep-urd-match',
          sectionTitle: 'حصہ دوم: تصویری پہچان اور جوڑ ملائیں (Image Matching)',
          instructions: 'تصویر دیکھ کر درست حرف کے ساتھ لکیر کھینچ کر ملائیں۔',
          totalMarks: 6,
          questions: [
            {
              id: 'prep-urd-q2',
              type: 'image_matching',
              questionNumber: 2,
              text: 'تصویر کو اس کے ابتدائی حرف سے ملائیں:',
              visualPairs: [
                { id: 'ur-vp-1', leftIcon: '🦆', leftText: 'بطخ', rightText: 'حرف ب', rightSubtext: 'بے سے بطخ' },
                { id: 'ur-vp-2', leftIcon: ' पतंग', leftText: 'پتنگ 🪁', rightText: 'حرف پ', rightSubtext: 'پے سے پتنگ' },
                { id: 'ur-vp-3', leftIcon: '🦋', leftText: 'تتلی', rightText: 'حرف ت', rightSubtext: 'تے سے تتلی' },
                { id: 'ur-vp-4', leftIcon: '🍎', leftText: 'سیب', rightText: 'حرف س', rightSubtext: 'سین سے سیب' },
              ],
              marks: 6,
              language: 'ur',
            },
          ],
        },
        {
          id: 'sec-prep-urd-count',
          sectionTitle: 'حصہ سوم: اشیاء گنیں اور درست ہندسے پر دائرہ لگائیں',
          instructions: 'اشیاء کو گن کر نیچے دیے گئے دائروں میں سے درست ہندسے کے گرد دائرہ لگائیں۔',
          totalMarks: 6,
          questions: [
            {
              id: 'prep-urd-q3',
              type: 'count_and_circle',
              questionNumber: 3,
              text: 'تصاویر گنیں اور درست گنتی کے گرد دائرہ لگائیں:',
              countItemsList: [
                { icon: '⭐', count: 3, label: 'ستارے' },
                { icon: '🍎', count: 4, label: 'سیب' },
                { icon: '🎈', count: 5, label: 'غبارے' },
              ],
              marks: 6,
              language: 'ur',
            },
          ],
        },
        {
          id: 'sec-prep-urd-color',
          sectionTitle: 'حصہ چہارم: اسلامی ہلال و ستارہ میں رنگ بھریں (Coloring Fun)',
          instructions: 'خوبصورت سبز اور سنہرا رنگ بھریں۔',
          totalMarks: 5,
          questions: [
            {
              id: 'prep-urd-q4',
              type: 'coloring_drawing',
              questionNumber: 4,
              text: 'ہلال اور ستارے کی تصویر میں خوشنما رنگ بھریں:',
              drawingOutlineType: 'crescent',
              drawingInstruction: 'ہلال میں سبز رنگ اور ستارے میں پیلا رنگ بھریں۔',
              marks: 5,
              language: 'ur',
            },
          ],
        },
      ],
    };
  }

  if (subject === 'Pre-Primary Math & Numbers') {
    return {
      subject: 'Pre-Primary Math & Numbers',
      language: 'en',
      totalMarks: 25,
      timeAllowed: '1 Hour',
      rawTextSample: `The Achievers Islamic Academy
Early Childhood Math & Numbers - ${grade}
Total Marks: 25   Time: 1 Hour

Section 1: Number Tracing 1 to 5 (8 Marks)
1. Trace numbers 1, 2, 3, 4, 5 along the practice guidelines.

Section 2: Count the Objects & Circle (6 Marks)
1. Count the objects and circle the matching number.

Section 3: Match Shapes to Everyday Objects (6 Marks)
1. Match shapes (Circle, Star, Triangle, Square) to real objects.

Section 4: Shape Drawing & Coloring (5 Marks)
1. Color the Five-Pointed Star yellow.`,
      sections: [
        {
          id: 'sec-prep-math-trace',
          sectionTitle: 'Section 1: Number Tracing & Writing Practice (8 Marks)',
          instructions: 'Trace numbers carefully along the dotted guidelines.',
          totalMarks: 8,
          questions: [
            {
              id: 'prep-m-q1',
              type: 'tracing',
              questionNumber: 1,
              text: 'Trace the numbers 1 through 5 on guidelines:',
              tracingLetters: ['1', '2', '3', '4', '5'],
              tracingGuideText: 'Start at the top dot and trace down.',
              marks: 8,
              language: 'en',
            },
          ],
        },
        {
          id: 'sec-prep-math-count',
          sectionTitle: 'Section 2: Count the Objects & Circle the Number (6 Marks)',
          instructions: 'Count each group of items and circle the matching number bubble.',
          totalMarks: 6,
          questions: [
            {
              id: 'prep-m-q2',
              type: 'count_and_circle',
              questionNumber: 2,
              text: 'Count the items and circle the correct digit:',
              countItemsList: [
                { icon: '🚗', count: 2, label: 'Cars' },
                { icon: '⭐', count: 4, label: 'Stars' },
                { icon: '🌸', count: 5, label: 'Flowers' },
              ],
              marks: 6,
              language: 'en',
            },
          ],
        },
        {
          id: 'sec-prep-math-match',
          sectionTitle: 'Section 3: Match Basic Geometric Shapes (6 Marks)',
          instructions: 'Connect each shape on the left to its matching item on the right.',
          totalMarks: 6,
          questions: [
            {
              id: 'prep-m-q3',
              type: 'image_matching',
              questionNumber: 3,
              text: 'Match the geometric shape to the real-life object:',
              visualPairs: [
                { id: 'sh-1', leftIcon: '⚪', leftText: 'Circle', rightText: 'Clock ⏰', rightIcon: '⏰' },
                { id: 'sh-2', leftIcon: '⭐', leftText: 'Star', rightText: 'Night Sky ⭐', rightIcon: '✨' },
                { id: 'sh-3', leftIcon: '🔺', leftText: 'Triangle', rightText: 'Slice of Pizza 🍕', rightIcon: '🍕' },
                { id: 'sh-4', leftIcon: '⏹️', leftText: 'Square', rightText: 'Gift Box 🎁', rightIcon: '🎁' },
              ],
              marks: 6,
              language: 'en',
            },
          ],
        },
        {
          id: 'sec-prep-math-color',
          sectionTitle: 'Section 4: Shape Coloring Activity (5 Marks)',
          instructions: 'Color the cute smiling star yellow.',
          totalMarks: 5,
          questions: [
            {
              id: 'prep-m-q4',
              type: 'coloring_drawing',
              questionNumber: 4,
              text: 'Color the Star bright yellow and draw eyes:',
              drawingOutlineType: 'star',
              drawingInstruction: 'Color the star yellow with care.',
              marks: 5,
              language: 'en',
            },
          ],
        },
      ],
    };
  }

  if (subject === 'Pre-Primary Islamic & General Knowledge') {
    return {
      subject: 'Pre-Primary Islamic & General Knowledge',
      language: 'bilingual',
      totalMarks: 25,
      timeAllowed: '1 Hour',
      rawTextSample: `The Achievers Islamic Academy
Pre-Primary Islamic & General Knowledge - ${grade}
Total Marks: 25   Time: 1 Hour

Section 1: Islamic Etiquettes & Dua Match (8 Marks)
1. Match daily actions to the correct Dua (Before Eating -> Bismillah, After Eating -> Alhamdulillah).

Section 2: Sacred Words Tracing (6 Marks)
1. Trace the blessed word 'الله' and 'محمد ﷺ'.

Section 3: Good Manners Identification (6 Marks)
1. Identify and circle good Islamic deeds.

Section 4: Color the Islamic Mosque Outline (5 Marks)
1. Color the beautiful Mosque dome and minarets.`,
      sections: [
        {
          id: 'sec-prep-isl-match',
          sectionTitle: 'Section 1: Islamic Manners & Daily Duas (8 Marks)',
          instructions: 'Draw lines to match each situation with what a Muslim child says.',
          totalMarks: 8,
          questions: [
            {
              id: 'prep-isl-q1',
              type: 'image_matching',
              questionNumber: 1,
              text: 'Match the daily habit with the correct Islamic phrase / مسنون دعا:',
              visualPairs: [
                { id: 'isl-m1', leftIcon: '🍲', leftText: 'Before Eating (کھانے سے پہلے)', rightText: 'بِسْمِ اللَّهِ', rightIcon: '🤲' },
                { id: 'isl-m2', leftIcon: '😋', leftText: 'After Eating (کھانے کے بعد)', rightText: 'الْحَمْدُ لِلَّهِ', rightIcon: '✨' },
                { id: 'isl-m3', leftIcon: '👋', leftText: 'Greeting a Friend (ملاقات پر)', rightText: 'السَّلَامُ عَلَيْكُمْ', rightIcon: '🤝' },
                { id: 'isl-m4', leftIcon: '😴', leftText: 'Before Sleeping (سوتے وقت)', rightText: 'اللَّهُمَّ بِاسْمِكَ أَمُوتُ', rightIcon: '🌙' },
              ],
              marks: 8,
              language: 'bilingual',
            },
          ],
        },
        {
          id: 'sec-prep-isl-trace',
          sectionTitle: 'Section 2: Sacred Words Tracing (6 Marks)',
          instructions: 'پنسل پھیریں اور صاف لکھیں (Trace with devotion).',
          totalMarks: 6,
          questions: [
            {
              id: 'prep-isl-q2',
              type: 'tracing',
              questionNumber: 2,
              text: 'دیے گئے مبارک کلمات پر پنسل پھیریں:',
              tracingLetters: ['اللّٰہ', 'مُحَمَّد ﷺ'],
              tracingGuideText: 'دائیں سے بائیں خوبصورت انداز میں لکھیں۔',
              marks: 6,
              language: 'ur',
            },
          ],
        },
        {
          id: 'sec-prep-isl-color',
          sectionTitle: 'Section 3: Color the Beautiful Mosque (5 Marks)',
          instructions: 'مسجد کے گنبد اور مینار میں خوبصورت رنگ بھریں۔',
          totalMarks: 5,
          questions: [
            {
              id: 'prep-isl-q3',
              type: 'coloring_drawing',
              questionNumber: 3,
              text: 'مسجد کی تصویر میں خوبصورت رنگ بھریں (Color the Mosque Outline):',
              drawingOutlineType: 'mosque',
              drawingInstruction: 'Color dome green or gold and minarets neatly.',
              marks: 5,
              language: 'bilingual',
            },
          ],
        },
      ],
    };
  }

  if (subject === 'Pre-Primary Art, Drawing & Coloring') {
    return {
      subject: 'Pre-Primary Art, Drawing & Coloring',
      language: 'en',
      totalMarks: 25,
      timeAllowed: '1 Hour',
      rawTextSample: `The Achievers Islamic Academy
Pre-Primary Art, Drawing & Coloring - ${grade}
Total Marks: 25   Time: 1 Hour

Section 1: Color the Outlines (10 Marks)
1. Color the beautiful sailboat and green tree.

Section 2: Creative Free Drawing Canvas (15 Marks)
1. Draw your favorite toy, family or flower inside the student box.`,
      sections: [
        {
          id: 'sec-prep-art-color',
          sectionTitle: 'Section 1: Coloring Activity (10 Marks)',
          instructions: 'Color neatly inside the outlines. Use bright, cheerful colors!',
          totalMarks: 10,
          questions: [
            {
              id: 'prep-art-q1',
              type: 'coloring_drawing',
              questionNumber: 1,
              text: 'Color the Sailing Boat on water (کشتی میں رنگ بھریں):',
              drawingOutlineType: 'boat',
              drawingInstruction: 'Color the hull wooden and sails bright red & blue.',
              marks: 5,
              language: 'en',
            },
            {
              id: 'prep-art-q2',
              type: 'coloring_drawing',
              questionNumber: 2,
              text: 'Color the Green Fruit Tree (درخت میں رنگ بھریں):',
              drawingOutlineType: 'tree',
              drawingInstruction: 'Use brown for trunk, green for leaves, red for fruits.',
              marks: 5,
              language: 'en',
            },
          ],
        },
        {
          id: 'sec-prep-art-draw',
          sectionTitle: 'Section 2: Creative Free Drawing (15 Marks)',
          instructions: 'Draw your favorite toy or house inside the drawing box and color it.',
          totalMarks: 15,
          questions: [
            {
              id: 'prep-art-q3',
              type: 'coloring_drawing',
              questionNumber: 3,
              text: 'Draw your favorite toy or fruit inside the box (اپنی پسندیدہ تصویر بنائیں):',
              drawingOutlineType: 'custom_box',
              drawingInstruction: 'Draw with pencil first, then color with crayons.',
              marks: 15,
              language: 'bilingual',
            },
          ],
        },
      ],
    };
  }

  // 1. Mathematics
  if (subject.includes('Math') || subject.includes('ریاضی')) {
    return {
      subject: 'Mathematics (ریاضی)',
      language: 'math',
      totalMarks: 50,
      timeAllowed: '2 Hours',
      rawTextSample: `The Achievers Islamic Academy
Mathematics Examination - ${grade}
Total Marks: 50   Time: 2 Hours

Section A: Objective & MCQs (10 Marks)
1. The standard form of a quadratic equation is:
(A) $ax^2 + bx + c = 0$   (B) $ax + b = 0$   (C) $ax^3 = 0$   (D) $x^2 = y$

2. The solution set of $x^2 - 16 = 0$ is:
(A) $\\{4\\}$   (B) $\\{-4\\}$   (C) $\\{\\pm 4\\}$   (D) $\\{16\\}$

3. The discriminant of quadratic equation $ax^2 + bx + c = 0$ is given by:
(A) $b^2 - 4ac$   (B) $b^2 + 4ac$   (C) $\\sqrt{b^2 - 4ac}$   (D) $-b \\pm 4ac$

4. Fill in the blank: The product of cube roots of unity is equal to ________.
Answer: 1

Section B: Short Questions (Attempt any 5)
1. Solve the quadratic equation by factorization: $x^2 - 7x + 12 = 0$
2. Find the discriminant of $3x^2 - 5x + 2 = 0$ and state the nature of roots.
3. If $\\alpha, \\beta$ are roots of $x^2 - 3x + 1 = 0$, evaluate $\\alpha^2 + \\beta^2$.
4. Resolve into partial fractions: $\\frac{1}{(x-1)(x-2)}$
5. Prove that the sum of the angles of a triangle equals $180^\\circ$.

Section C: Long Questions (Attempt any 2)
1. State and prove Pythagoras Theorem with neat geometric diagram.
2. Solve the following simultaneous equations graphically: $x + y = 6$ and $2x - y = 3$.`,
      sections: [
        {
          id: 'sec-math-obj',
          sectionTitle: 'Section A: Objective & Multiple Choice Questions (10 Marks)',
          instructions: 'Attempt all questions. Each carries 2 marks.',
          totalMarks: 10,
          questions: [
            {
              id: 'm-q1',
              type: 'mcq',
              questionNumber: 1,
              text: 'The standard form of a quadratic equation is:',
              options: [
                { id: 'mo-1', label: 'A', text: '$ax^2 + bx + c = 0, a \\neq 0$' },
                { id: 'mo-2', label: 'B', text: '$ax + b = 0$' },
                { id: 'mo-3', label: 'C', text: '$ax^3 + bx^2 + c = 0$' },
                { id: 'mo-4', label: 'D', text: '$ax^2 = c$' },
              ],
              marks: 2,
              language: 'math',
            },
            {
              id: 'm-q2',
              type: 'mcq',
              questionNumber: 2,
              text: 'The discriminant of the quadratic equation $ax^2 + bx + c = 0$ is:',
              options: [
                { id: 'mo-5', label: 'A', text: '$b^2 - 4ac$' },
                { id: 'mo-6', label: 'B', text: '$b^2 + 4ac$' },
                { id: 'mo-7', label: 'C', text: '$\\sqrt{b^2 - 4ac}$' },
                { id: 'mo-8', label: 'D', text: '$-b \\pm 4ac$' },
              ],
              marks: 2,
              language: 'math',
            },
            {
              id: 'm-q3',
              type: 'mcq',
              questionNumber: 3,
              text: 'If the discriminant $b^2 - 4ac < 0$, then the roots of the equation are:',
              options: [
                { id: 'mo-9', label: 'A', text: 'Real and equal' },
                { id: 'mo-10', label: 'B', text: 'Rational and unequal' },
                { id: 'mo-11', label: 'C', text: 'Imaginary (complex conjugates)' },
                { id: 'mo-12', label: 'D', text: 'Irrational' },
              ],
              marks: 2,
              language: 'math',
            },
            {
              id: 'm-q4',
              type: 'fill_in_the_blank',
              questionNumber: 4,
              text: 'The solution set of the equation $x^2 - 16 = 0$ is equal to ________.',
              blankAnswer: '{\\pm 4}',
              marks: 2,
              language: 'math',
            },
            {
              id: 'm-q5',
              type: 'fill_in_the_blank',
              questionNumber: 5,
              text: 'The product of all three cube roots of unity is equal to ________.',
              blankAnswer: '1',
              marks: 2,
              language: 'math',
            },
          ],
        },
        {
          id: 'sec-math-short',
          sectionTitle: 'Section B: Short Answer Questions (24 Marks)',
          instructions: 'Attempt any four (4) questions. Each question carries 6 marks.',
          totalMarks: 24,
          questions: [
            {
              id: 'm-q6',
              type: 'short',
              questionNumber: 1,
              text: 'Solve the quadratic equation by factorization method: $x^2 - 7x + 12 = 0$',
              marks: 6,
              language: 'math',
            },
            {
              id: 'm-q7',
              type: 'short',
              questionNumber: 2,
              text: 'Find the discriminant of the equation $3x^2 - 5x + 2 = 0$ and describe the nature of roots.',
              marks: 6,
              language: 'math',
            },
            {
              id: 'm-q8',
              type: 'short',
              questionNumber: 3,
              text: 'If $\\alpha$ and $\\beta$ are the roots of $x^2 - 3x + 1 = 0$, evaluate the value of $\\alpha^2 + \\beta^2$.',
              marks: 6,
              language: 'math',
            },
            {
              id: 'm-q9',
              type: 'short',
              questionNumber: 4,
              text: 'Resolve into partial fractions: $\\frac{1}{(x-1)(x-2)}$',
              marks: 6,
              language: 'math',
            },
          ],
        },
        {
          id: 'sec-math-long',
          sectionTitle: 'Section C: Long & Analytical Questions (16 Marks)',
          instructions: 'Attempt any one (1) comprehensive question with complete steps and geometric proofs.',
          totalMarks: 16,
          questions: [
            {
              id: 'm-q10',
              type: 'long',
              questionNumber: 1,
              text: 'State and prove Pythagoras Theorem: In a right-angled triangle, the square of the hypotenuse is equal to the sum of the squares of the other two sides ($c^2 = a^2 + b^2$). Draw diagram.',
              marks: 16,
              language: 'math',
            },
            {
              id: 'm-q11',
              type: 'long',
              questionNumber: 2,
              text: 'Solve the following simultaneous equations graphically and determine point of intersection: $x + y = 6$ and $2x - y = 3$.',
              marks: 16,
              language: 'math',
            },
          ],
        },
      ],
    };
  }

  // 2. Urdu Literature & Grammar
  if (subject.includes('Urdu') || subject.includes('اردو')) {
    return {
      subject: 'Urdu Literature & Grammar (اردو)',
      language: 'ur',
      totalMarks: 50,
      timeAllowed: '2 Hours 30 Minutes',
      rawTextSample: `The Achievers Islamic Academy
اردو لازمی - ${grade}
کل نمبر: 50   وقت: 2 گھنٹے 30 منٹ

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

سوال نمبر 3: درج ذیل محاورات میں سے کوئی سے چار (4) محاورات کو جملوں میں استعمال کریں:
(1) آب آب ہونا  (2) چراغ پا ہونا  (3) باغ باغ ہونا  (4) ہوش اڑ جانا  (5) دال نہ گلنا

حصہ سوم: تفصیلی مضمون (15 نمبر)
سوال نمبر 4: کسی ایک عنوان پر جامع مضمون قلمبند کریں:
(الف) سیرت النبی ﷺ بحیثیت معلم اخلاق
(ب) وقت کی پابندی اور قومی ترقی`,
      sections: [
        {
          id: 'sec-urdu-obj',
          sectionTitle: 'حصہ اول: معروضی و قواعد (Objective Section)',
          instructions: 'تمام سوالات لازمی ہیں۔ درست جواب کی نشاندہی کریں۔',
          totalMarks: 10,
          questions: [
            {
              id: 'u-q1',
              type: 'mcq',
              questionNumber: 1,
              text: 'مصرع "پتہ پتہ بوٹا بوٹا حال ہمارا جانے ہے" کس نامور شاعر کا ہے؟',
              options: [
                { id: 'uo-1', label: 'الف', text: 'میر تقی میر' },
                { id: 'uo-2', label: 'ب', text: 'مرزا اسد اللہ خان غالب' },
                { id: 'uo-3', label: 'ج', text: 'خواجہ میر درد' },
                { id: 'uo-4', label: 'د', text: 'علامہ محمد اقبال' },
              ],
              marks: 2,
              language: 'ur',
            },
            {
              id: 'u-q2',
              type: 'mcq',
              questionNumber: 2,
              text: 'لفظ "مسدس" ایسی ہیئت کو کہتے ہیں جس کے ہر بند میں مصرعوں کی تعداد ہوتی ہے:',
              options: [
                { id: 'uo-5', label: 'الف', text: 'چار مصرعے' },
                { id: 'uo-6', label: 'ب', text: 'پانچ مصرعے' },
                { id: 'uo-7', label: 'ج', text: 'چھ مصرعے' },
                { id: 'uo-8', label: 'د', text: 'آٹھ مصرعے' },
              ],
              marks: 2,
              language: 'ur',
            },
            {
              id: 'u-q3',
              type: 'fill_in_the_blank',
              questionNumber: 3,
              text: 'علمِ بیان میں کسی چیز کو کسی خاص صفت کی بنا پر دوسری چیز جیسا قرار دینا ________ کہلاتا ہے۔',
              blankAnswer: 'تشبیہ',
              marks: 2,
              language: 'ur',
            },
            {
              id: 'u-q4',
              type: 'fill_in_the_blank',
              questionNumber: 4,
              text: 'نظم "طلوعِ اسلام" اور "شکوہ" حکیم الامت ________ کی لازوال تصنیف ہیں۔',
              blankAnswer: 'علامہ محمد اقبال',
              marks: 2,
              language: 'ur',
            },
            {
              id: 'u-q5',
              type: 'mcq',
              questionNumber: 5,
              text: 'درج ذیل میں سے اسمِ خاص (معرفہ) کی درست مثال ہے:',
              options: [
                { id: 'uo-9', label: 'الف', text: 'شہر' },
                { id: 'uo-10', label: 'ب', text: 'دریا' },
                { id: 'uo-11', label: 'ج', text: 'لاہور' },
                { id: 'uo-12', label: 'د', text: 'کتاب' },
              ],
              marks: 2,
              language: 'ur',
            },
          ],
        },
        {
          id: 'sec-urdu-subj',
          sectionTitle: 'حصہ دوم: انشائیہ، اشعار کی تشریح و محاورات',
          instructions: 'سوالات کے جوابات صاف اور با محاورہ اردو میں تحریر کریں۔',
          totalMarks: 25,
          questions: [
            {
              id: 'u-q6',
              type: 'short',
              questionNumber: 1,
              text: 'درج ذیل شعر کی با محاورہ تشریح شاعر کے حوالے سے کریں: "نہ تخت و تاج میں نے فقر و استغنا میں رکھی ہے / وہ عزت جو خدا نے خدمتِ انساں میں رکھی ہے"',
              marks: 8,
              language: 'ur',
            },
            {
              id: 'u-q7',
              type: 'short',
              questionNumber: 2,
              text: 'درج ذیل محاورات میں سے کوئی سے چار محاورات کو اپنے جملوں میں استعمال کریں: (1) آب آب ہونا (2) چراغ پا ہونا (3) دال میں کالا ہونا (4) باغ باغ ہونا (5) ہوش اڑ جانا۔',
              marks: 8,
              language: 'ur',
            },
            {
              id: 'u-q8',
              type: 'short',
              questionNumber: 3,
              text: 'سبق کے متن کی روشنی میں خلاصہ اور مصنف کا اخلاقی پیغام اپنے الفاظ میں تحریر کریں۔',
              marks: 9,
              language: 'ur',
            },
          ],
        },
        {
          id: 'sec-urdu-essay',
          sectionTitle: 'حصہ سوم: جامع تفصیلی مضمون',
          instructions: 'کسی ایک عنوان پر جامع اور فکر انگیز مضمون قلمبند کریں۔',
          totalMarks: 15,
          questions: [
            {
              id: 'u-q9',
              type: 'long',
              questionNumber: 1,
              text: 'کسی ایک عنوان پر 200 تا 250 الفاظ پر مشتمل با اثر مضمون تحریر کریں: (الف) سیرت النبی ﷺ بحیثیت معلمِ انسانیت (ب) وقت کی پابندی اور قومی خود انحصاری (ج) اسلامی معاشرے میں نوجوانوں کا کردار۔',
              marks: 15,
              language: 'ur',
            },
          ],
        },
      ],
    };
  }

  // 3. English Language & Lit
  if (subject.includes('English')) {
    return {
      subject: 'English Language & Lit',
      language: 'en',
      totalMarks: 50,
      timeAllowed: '2 Hours',
      rawTextSample: `The Achievers Islamic Academy
English Language & Lit - ${grade}
Total Marks: 50   Time: 2 Hours

Section A: Objective & Grammar (10 Marks)
1. Choose the correct synonym of the word 'Benevolent':
(A) Kind & Generous   (B) Cruel & Harsh   (C) Selfish   (D) Indifferent

2. Fill in the blank with appropriate preposition: "She is proficient ________ spoken English."
Answer: in

3. Identify the part of speech for the underlined word: "The birds fly *swiftly* across the horizon."
(A) Adverb   (B) Adjective   (C) Conjunction   (D) Noun

Section B: Reading Comprehension & Short Questions (25 Marks)
1. Summarize the central theme of William Wordsworth's poem "Daffodils".
2. Change the following sentence from Active into Passive Voice: "The teacher appreciated the student's creative presentation."
3. Use the following idiom in an illustrative sentence: "A blessing in disguise".
4. Differentiate between a Transitive and Intransitive verb with one clear example of each.

Section C: Composition & Creative Writing (15 Marks)
1. Write a well-structured essay of 150-200 words on: "The Role of Ethical Leadership in Modern Society".`,
      sections: [
        {
          id: 'sec-eng-obj',
          sectionTitle: 'Section A: Grammar & Objective Concepts (10 Marks)',
          instructions: 'Choose the most appropriate option. Overwriting is strictly not allowed.',
          totalMarks: 10,
          questions: [
            {
              id: 'e-q1',
              type: 'mcq',
              questionNumber: 1,
              text: "Identify the antonym of the word 'Benevolent':",
              options: [
                { id: 'eo-1', label: 'A', text: 'Malevolent & Malicious' },
                { id: 'eo-2', label: 'B', text: 'Generous' },
                { id: 'eo-3', label: 'C', text: 'Helpful' },
                { id: 'eo-4', label: 'D', text: 'Affectionate' },
              ],
              marks: 2,
              language: 'en',
            },
            {
              id: 'e-q2',
              type: 'fill_in_the_blank',
              questionNumber: 2,
              text: 'Fill in with the correct preposition: "He has been absent from school ________ Monday last."',
              blankAnswer: 'since',
              marks: 2,
              language: 'en',
            },
            {
              id: 'e-q3',
              type: 'mcq',
              questionNumber: 3,
              text: "Identify the part of speech for the word 'fluently' in: 'She speaks Arabic fluently.'",
              options: [
                { id: 'eo-5', label: 'A', text: 'Adverb' },
                { id: 'eo-6', label: 'B', text: 'Adjective' },
                { id: 'eo-7', label: 'C', text: 'Preposition' },
                { id: 'eo-8', label: 'D', text: 'Conjunction' },
              ],
              marks: 2,
              language: 'en',
            },
            {
              id: 'e-q4',
              type: 'fill_in_the_blank',
              questionNumber: 4,
              text: 'Complete the proverb: "Honesty is ________ best policy."',
              blankAnswer: 'the',
              marks: 2,
              language: 'en',
            },
            {
              id: 'e-q5',
              type: 'mcq',
              questionNumber: 5,
              text: 'Identify the sentence with correct punctuation:',
              options: [
                { id: 'eo-9', label: 'A', text: 'Where are you going, Ali?' },
                { id: 'eo-10', label: 'B', text: 'where are you going Ali' },
                { id: 'eo-11', label: 'C', text: 'Where are you going Ali.' },
                { id: 'eo-12', label: 'D', text: 'Where are you going? Ali' },
              ],
              marks: 2,
              language: 'en',
            },
          ],
        },
        {
          id: 'sec-eng-subj',
          sectionTitle: 'Section B: Comprehension & Literary Questions (25 Marks)',
          instructions: 'Answer all questions concisely in accurate English grammar.',
          totalMarks: 25,
          questions: [
            {
              id: 'e-q6',
              type: 'short',
              questionNumber: 1,
              text: 'Summarize the central philosophy and imagery highlighted in William Wordsworth\'s poem "Daffodils".',
              marks: 7,
              language: 'en',
            },
            {
              id: 'e-q7',
              type: 'short',
              questionNumber: 2,
              text: 'Change into Passive Voice: "The academy principal distributed medals to the hardworking students yesterday."',
              marks: 6,
              language: 'en',
            },
            {
              id: 'e-q8',
              type: 'short',
              questionNumber: 3,
              text: 'Illustrate the contextual meanings of idioms: (a) "A blessing in disguise" (b) "Burn the midnight oil".',
              marks: 6,
              language: 'en',
            },
            {
              id: 'e-q9',
              type: 'short',
              questionNumber: 4,
              text: 'Differentiate between a Transitive and Intransitive verb with two clear illustrative sentences.',
              marks: 6,
              language: 'en',
            },
          ],
        },
        {
          id: 'sec-eng-essay',
          sectionTitle: 'Section C: Essay & Applied Composition (15 Marks)',
          instructions: 'Draft an original essay demonstrating cohesive paragraphs and strong vocabulary.',
          totalMarks: 15,
          questions: [
            {
              id: 'e-q10',
              type: 'long',
              questionNumber: 1,
              text: 'Write a persuasive essay of 150-200 words on: "Character Building and Ethical Excellence in Modern Education".',
              marks: 15,
              language: 'en',
            },
          ],
        },
      ],
    };
  }

  // 4. Arabic Language
  if (subject.includes('Arabic') || subject.includes('العربية')) {
    return {
      subject: 'Arabic Language (اللغة العربية)',
      language: 'ar',
      totalMarks: 50,
      timeAllowed: '2 Hours',
      rawTextSample: `The Achievers Islamic Academy
اللغة العربية وقواعدها - ${grade}
كل نمبر: 50   وقت: 2 گھنٹے

حصہ اول: معروضی سوالات
1. اختر المعنى الصحيح لكلمة "الْكِتَابُ": (أ) القلم (ب) الدفتر (ج) الكتاب
2. الضمير للمتكلم المفرد هو: أنا

حصہ دوم: مختصر سوالات
1. ترجم الجمل الآتية: "الْعِلْمُ نُورٌ وَالْجَهْلُ ظَلَامٌ"
2. اعرب: "كَتَبَ التِّلْمِيذُ الدَّرْسَ"

حصہ سوم: تفصیلی سوال
1. اكتب فقرة موجزة عن أهمية اللغة العربية.`,
      sections: [
        {
          id: 'sec-ar-obj',
          sectionTitle: 'القسم الأول: الأسئلة الموضوعية والمفردات',
          instructions: 'أجب عن جميع الأسئلة الآتية باختيار الإجابة الصحيحة.',
          totalMarks: 10,
          questions: [
            {
              id: 'ar-q1',
              type: 'mcq',
              questionNumber: 1,
              text: 'اختر المعنى الصحيح لكلمة "الْعِلْمُ" في اللغة:',
              options: [
                { id: 'ao-1', label: 'أ', text: 'المعرفة والنور' },
                { id: 'ao-2', label: 'ب', text: 'الجهل' },
                { id: 'ao-3', label: 'ج', text: 'المال' },
                { id: 'ao-4', label: 'د', text: 'السفر' },
              ],
              marks: 2,
              language: 'ar',
            },
            {
              id: 'ar-q2',
              type: 'fill_in_the_blank',
              questionNumber: 2,
              text: 'الضمير المنفصل الدال على المتكلم المفرد في النحو العربي هو ________.',
              blankAnswer: 'أَنَا',
              marks: 2,
              language: 'ar',
            },
            {
              id: 'ar-q3',
              type: 'mcq',
              questionNumber: 3,
              text: 'جمع كلمة "طَالِبٌ" في اللغة العربية هو:',
              options: [
                { id: 'ao-5', label: 'أ', text: 'طُلَّابٌ' },
                { id: 'ao-6', label: 'ب', text: 'طالبات' },
                { id: 'ao-7', label: 'ج', text: 'مطالب' },
                { id: 'ao-8', label: 'د', text: 'طوالب' },
              ],
              marks: 2,
              language: 'ar',
            },
          ],
        },
        {
          id: 'sec-ar-subj',
          sectionTitle: 'القسم الثاني: الترجمة وقواعد النحو',
          instructions: 'ترجم العبارات بدقة وبيّن المعاني النحوية.',
          totalMarks: 25,
          questions: [
            {
              id: 'ar-q4',
              type: 'short',
              questionNumber: 1,
              text: 'ترجم الجملة الآتية ترجمة صحيحة: "الْعِلْمُ نُورٌ يَهْدِي الْعُقُولَ، وَالْعَمَلُ الصَّالِحُ يَرْفَعُ الدَّرَجَاتِ."',
              marks: 12,
              language: 'ar',
            },
            {
              id: 'ar-q5',
              type: 'short',
              questionNumber: 2,
              text: 'بيّن الفاعل والمفعول به في الجملة الآتية: "قَرَأَ التِّلْمِيذُ الْقُرْآنَ الْكَرِيمَ."',
              marks: 13,
              language: 'ar',
            },
          ],
        },
        {
          id: 'sec-ar-long',
          sectionTitle: 'القسم الثالث: التعبير والإنشاء العربي',
          instructions: 'اكتب فقرة باللغة العربية الفصحى.',
          totalMarks: 15,
          questions: [
            {
              id: 'ar-q6',
              type: 'long',
              questionNumber: 1,
              text: 'اكتب فقرة موجزة من خمسة أسطر عن: "أهمية تعلم لغة القرآن الكريم في بناء الشخصية الإسلامية".',
              marks: 15,
              language: 'ar',
            },
          ],
        },
      ],
    };
  }

  // 5. Islamic Studies (اسلامیات)
  if (subject.includes('Islamic') || subject.includes('اسلامیات')) {
    return {
      subject: 'Islamic Studies (اسلامیات)',
      language: 'ur',
      totalMarks: 50,
      timeAllowed: '2 Hours 30 Minutes',
      rawTextSample: `The Achievers Islamic Academy
اسلامیات لازمی - ${grade}
کل نمبر: 50   وقت: 2 گھنٹے 30 منٹ

حصہ اول: معروضی سوالات (10 نمبر)
1. ارکان اسلام کی کل تعداد ہے:
(الف) چار   (ب) پانچ   (ج) چھ   (د) سات

2. حدیث نبوی: "الصَّلَاةُ عِمَادُ الدِّينِ" کا معنی ہے: نماز دین کا ________ ہے۔
خالی جگہ: ستون

3. سورۃ الانفال کس غزوہ کے موقع پر نازل ہوئی؟
(الف) غزوہ بدر   (ب) غزوہ احد   (ج) غزوہ خندق   (د) غزوہ تبوک

حصہ دوم: مختصر سوالات (کوئی سے 5 حل کریں)
1. سورۃ الانفال کی روشنی میں مومنین کے اوصاف بیان کریں۔
2. زکوٰۃ کے مصارف اور فضیلت تحریر کریں۔
3. سیرت النبی ﷺ سے امانت و دیانت کا ایک واقعہ لکھیں۔
4. عقیدہ ختمِ نبوت ﷺ کی قرآنی اہمیت واضح کریں۔

حصہ سوم: تفصیلی سوالات (کوئی سے 2 حل کریں)
1. مواخات مدینہ کے پس منظر اور اخوتِ اسلامی پر جامع نوٹ تحریر کریں۔
2. اسلامی معیشت میں حلال روزی کمانے کی برکات اور سود کی حرمت پر نوٹ لکھیں۔`,
      sections: [
        {
          id: 'sec-isl-obj',
          sectionTitle: 'حصہ اول: معروضی سوالات (Objective Section)',
          instructions: 'تمام سوالات لازمی ہیں۔ درست جواب کی نشاندہی کریں۔',
          totalMarks: 10,
          questions: [
            {
              id: 'i-q1',
              type: 'mcq',
              questionNumber: 1,
              text: 'ارکان اسلام کی کل تعداد کتنی ہے؟',
              options: [
                { id: 'io-1', label: 'الف', text: 'چار' },
                { id: 'io-2', label: 'ب', text: 'پانچ' },
                { id: 'io-3', label: 'ج', text: 'چھ' },
                { id: 'io-4', label: 'د', text: 'سات' },
              ],
              marks: 2,
              language: 'ur',
            },
            {
              id: 'i-q2',
              type: 'mcq',
              questionNumber: 2,
              text: 'سورۃ الانفال کس اہم غزوہ کے موقع پر نازل ہوئی؟',
              options: [
                { id: 'io-5', label: 'الف', text: 'غزوہ بدر' },
                { id: 'io-6', label: 'ب', text: 'غزوہ احد' },
                { id: 'io-7', label: 'ج', text: 'غزوہ خندق' },
                { id: 'io-8', label: 'د', text: 'غزوہ تبوک' },
              ],
              marks: 2,
              language: 'ur',
            },
            {
              id: 'i-q3',
              type: 'fill_in_the_blank',
              questionNumber: 3,
              text: 'حدیثِ مبارکہ "الصَّلَاةُ عِمَادُ الدِّينِ" کا مفہوم ہے کہ نماز دین کا ________ ہے۔',
              blankAnswer: 'ستون',
              marks: 2,
              language: 'ur',
            },
            {
              id: 'i-q4',
              type: 'fill_in_the_blank',
              questionNumber: 4,
              text: 'قرآن مجید کے کل ________ پارے اور 114 سورتیں ہیں۔',
              blankAnswer: '30',
              marks: 2,
              language: 'ur',
            },
            {
              id: 'i-q5',
              type: 'mcq',
              questionNumber: 5,
              text: 'قرآن مجید کی سب سے افضل اور بابرکت آیت کون سی ہے؟',
              options: [
                { id: 'io-9', label: 'الف', text: 'آیت الکرسی' },
                { id: 'io-10', label: 'ب', text: 'سورۃ الفاتحہ' },
                { id: 'io-11', label: 'ج', text: 'سورۃ الاخلاص' },
                { id: 'io-12', label: 'د', text: 'سورۃ یٰس' },
              ],
              marks: 2,
              language: 'ur',
            },
          ],
        },
        {
          id: 'sec-isl-short',
          sectionTitle: 'حصہ دوم: مختصر سوالات (کوئی سے چار حل کریں)',
          instructions: 'قرآن و سنت کے دلائل کے ساتھ مختصر جوابات دیں۔',
          totalMarks: 24,
          questions: [
            {
              id: 'i-q6',
              type: 'short',
              questionNumber: 1,
              text: 'سورۃ الانفال کی روشنی میں مومنین کے تین اوصاف تحریر کریں۔',
              marks: 6,
              language: 'ur',
            },
            {
              id: 'i-q7',
              type: 'short',
              questionNumber: 2,
              text: 'زکوٰۃ کی فرضیت اور قرآنی مصارف تفصیل سے بیان کریں۔',
              marks: 6,
              language: 'ur',
            },
            {
              id: 'i-q8',
              type: 'short',
              questionNumber: 3,
              text: 'سیرت النبی ﷺ سے امانت و دیانت کا ایک مستند واقعہ تحریر کریں۔',
              marks: 6,
              language: 'ur',
            },
            {
              id: 'i-q9',
              type: 'short',
              questionNumber: 4,
              text: 'عقیدہ ختمِ نبوت ﷺ کی اہمیت پر قرآن کی روشنی میں نوٹ لکھیں۔',
              marks: 6,
              language: 'ur',
            },
          ],
        },
        {
          id: 'sec-isl-long',
          sectionTitle: 'حصہ سوم: تفصیلی سوالات (جامع نوٹ)',
          instructions: 'کسی ایک سوال کا جامع و تفصیلی جواب تحریر کریں۔',
          totalMarks: 16,
          questions: [
            {
              id: 'i-q10',
              type: 'long',
              questionNumber: 1,
              text: 'مواخاتِ مدینہ کے تاریخی پس منظر اور اخوتِ اسلامی کے معاشرتی و معاشی اثرات پر سیر حاصل نوٹ تحریر کریں۔',
              marks: 16,
              language: 'ur',
            },
            {
              id: 'i-q11',
              type: 'long',
              questionNumber: 2,
              text: 'اسلام میں کسبِ حلال کی فضیلت اور سود (ربا) کی معاشرتی برائیوں پر تفصیلی مضمون قلمبند کریں۔',
              marks: 16,
              language: 'ur',
            },
          ],
        },
      ],
    };
  }

  // 6. Pakistan Studies (مطالعہ پاکستان)
  if (subject.includes('Pakistan') || subject.includes('پاکستان')) {
    return {
      subject: 'Pakistan Studies (مطالعہ پاکستان)',
      language: 'ur',
      totalMarks: 50,
      timeAllowed: '2 Hours',
      rawTextSample: `The Achievers Islamic Academy
مطالعہ پاکستان - ${grade}
کل نمبر: 50   وقت: 2 گھنٹے

حصہ اول: معروضی سوالات (10 نمبر)
1. نظریہ پاکستان کی بنیاد درج ذیل میں سے کس پر ہے؟
(الف) ہندو مسلم اتحاد  (ب) دو قومی نظریہ  (ج) معاشی مفادات  (د) لسانی یکجہتی

2. قرار دادِ پاکستان 23 مارچ 1940ء کو کس نے پیش کی؟
خالی جگہ: مولوی اے کے فضل الحق

حصہ دوم: مختصر سوالات
1. علامہ محمد اقبال کے خطبہ الہ آباد 1930ء کے اہم نکات لکھیں۔
2. قائد اعظم محمد علی جناح کے 14 نکات میں سے کوئی سے تین نکات تحریر کریں۔

حصہ سوم: تفصیلی سوال
1. تحریکِ پاکستان میں علمائے کرام اور مشائخ کے کردار پر مفصل نوٹ لکھیں۔`,
      sections: [
        {
          id: 'sec-pak-obj',
          sectionTitle: 'حصہ اول: معروضی سوالات (10 نمبر)',
          instructions: 'تمام سوالات لازمی ہیں۔ درست جواب کی نشاندہی کریں۔',
          totalMarks: 10,
          questions: [
            {
              id: 'p-q1',
              type: 'mcq',
              questionNumber: 1,
              text: 'نظریہ پاکستان کی فکری بنیاد کس نظریے پر استوار ہے؟',
              options: [
                { id: 'po-1', label: 'الف', text: 'دو قومی نظریہ (اسلام)' },
                { id: 'po-2', label: 'ب', text: 'مشترکہ قومیت' },
                { id: 'po-3', label: 'ج', text: 'سیکولرازم' },
                { id: 'po-4', label: 'د', text: 'صوبائی خود مختاری' },
              ],
              marks: 2,
              language: 'ur',
            },
            {
              id: 'p-q2',
              type: 'fill_in_the_blank',
              questionNumber: 2,
              text: 'تاریخی قراردادِ پاکستان 23 مارچ 1940ء کو شیرِ بنگال ________ نے پیش کی۔',
              blankAnswer: 'مولوی اے کے فضل الحق',
              marks: 2,
              language: 'ur',
            },
            {
              id: 'p-q3',
              type: 'mcq',
              questionNumber: 3,
              text: 'قائد اعظم محمد علی جناح نے مسلم لیگ کے پلیٹ فارم سے چودہ نکات کس سن میں پیش کیے؟',
              options: [
                { id: 'po-5', label: 'الف', text: '1927ء' },
                { id: 'po-6', label: 'ب', text: '1929ء' },
                { id: 'po-7', label: 'ج', text: '1930ء' },
                { id: 'po-8', label: 'د', text: '1935ء' },
              ],
              marks: 2,
              language: 'ur',
            },
            {
              id: 'p-q4',
              type: 'fill_in_the_blank',
              questionNumber: 4,
              text: 'پاکستان کا موجودہ آئین سن ________ میں متفقہ طور پر منظور ہوا۔',
              blankAnswer: '1973ء',
              marks: 2,
              language: 'ur',
            },
            {
              id: 'p-q5',
              type: 'mcq',
              questionNumber: 5,
              text: 'علامہ محمد اقبال نے تاریخی خطبہ الہ آباد کس سن میں ارشاد فرمایا؟',
              options: [
                { id: 'po-9', label: 'الف', text: '1930ء' },
                { id: 'po-10', label: 'ب', text: '1932ء' },
                { id: 'po-11', label: 'ج', text: '1938ء' },
                { id: 'po-12', label: 'د', text: '1940ء' },
              ],
              marks: 2,
              language: 'ur',
            },
          ],
        },
        {
          id: 'sec-pak-short',
          sectionTitle: 'حصہ دوم: مختصر سوالات (24 نمبر)',
          instructions: 'کوئی سے چار (4) سوالات کے مدلل اور مختصر جوابات تحریر کریں۔',
          totalMarks: 24,
          questions: [
            {
              id: 'p-q6',
              type: 'short',
              questionNumber: 1,
              text: 'دو قومی نظریے کی وضاحت قائد اعظم کے فرمودات کی روشنی میں کریں۔',
              marks: 6,
              language: 'ur',
            },
            {
              id: 'p-q7',
              type: 'short',
              questionNumber: 2,
              text: 'علامہ اقبال کے خطبہ الہ آباد 1930ء کے تین بنیادی نکات بیان کریں۔',
              marks: 6,
              language: 'ur',
            },
            {
              id: 'p-q8',
              type: 'short',
              questionNumber: 3,
              text: 'قراردادِ مقاصد 1949ء کے اہم اسلامی اصول تحریر کریں۔',
              marks: 6,
              language: 'ur',
            },
            {
              id: 'p-q9',
              type: 'short',
              questionNumber: 4,
              text: 'پاکستان کے جغرافیائی محل وقوع کی تزویراتی اہمیت بیان کریں۔',
              marks: 6,
              language: 'ur',
            },
          ],
        },
        {
          id: 'sec-pak-long',
          sectionTitle: 'حصہ سوم: تفصیلی سوالات (16 نمبر)',
          instructions: 'کسی ایک سوال کا جامع اور مفصل جواب قلمبند کریں۔',
          totalMarks: 16,
          questions: [
            {
              id: 'p-q10',
              type: 'long',
              questionNumber: 1,
              text: 'قائد اعظم محمد علی جناح کے 14 نکات کا تفصیلی جائزہ لیں اور تحریک پاکستان میں ان کی سیاسی اہمیت واضح کریں۔',
              marks: 16,
              language: 'ur',
            },
          ],
        },
      ],
    };
  }

  // 7. Physics / Chemistry / Biology / General Science
  if (
    subject.includes('Physics') ||
    subject.includes('Chemistry') ||
    subject.includes('Biology') ||
    subject.includes('Science') ||
    subject.includes('سائنس')
  ) {
    const scienceName = subject.includes('Physics')
      ? 'Physics'
      : subject.includes('Chemistry')
      ? 'Chemistry'
      : subject.includes('Biology')
      ? 'Biology'
      : 'General Science (سائنس)';

    return {
      subject: scienceName,
      language: 'en',
      totalMarks: 50,
      timeAllowed: '2 Hours',
      rawTextSample: `The Achievers Islamic Academy
${scienceName} Examination - ${grade}
Total Marks: 50   Time: 2 Hours

Section A: Multiple Choice Questions (10 Marks)
1. The SI unit of force is:
(A) Joule   (B) Newton   (C) Pascal   (D) Watt

2. Work done is equal to force multiplied by:
Answer: displacement

Section B: Short Conceptual Questions (24 Marks)
1. State Newton's Second Law of Motion and derive F = ma.
2. Differentiate between mass and weight with SI units.
3. Define kinetic energy and state its formula.

Section C: Comprehensive Questions (16 Marks)
1. State the Law of Conservation of Energy and give real-world applications.`,
      sections: [
        {
          id: 'sec-sci-obj',
          sectionTitle: `Section A: Objective Concepts & MCQs (10 Marks)`,
          instructions: 'Attempt all questions. Choose the most scientifically accurate option.',
          totalMarks: 10,
          questions: [
            {
              id: 's-q1',
              type: 'mcq',
              questionNumber: 1,
              text: 'The SI unit of force in standard metric measurement is:',
              options: [
                { id: 'so-1', label: 'A', text: 'Newton (N)' },
                { id: 'so-2', label: 'B', text: 'Joule (J)' },
                { id: 'so-3', label: 'C', text: 'Pascal (Pa)' },
                { id: 'so-4', label: 'D', text: 'Watt (W)' },
              ],
              marks: 2,
              language: 'en',
            },
            {
              id: 's-q2',
              type: 'fill_in_the_blank',
              questionNumber: 2,
              text: 'Work done is defined as the product of force and ________ in the direction of force.',
              blankAnswer: 'displacement',
              marks: 2,
              language: 'en',
            },
            {
              id: 's-q3',
              type: 'mcq',
              questionNumber: 3,
              text: 'Which of the following is a scalar quantity?',
              options: [
                { id: 'so-5', label: 'A', text: 'Speed' },
                { id: 'so-6', label: 'B', text: 'Velocity' },
                { id: 'so-7', label: 'C', text: 'Acceleration' },
                { id: 'so-8', label: 'D', text: 'Force' },
              ],
              marks: 2,
              language: 'en',
            },
            {
              id: 's-q4',
              type: 'fill_in_the_blank',
              questionNumber: 4,
              text: 'Energy possessed by a body due to its motion is called ________ energy.',
              blankAnswer: 'kinetic',
              marks: 2,
              language: 'en',
            },
            {
              id: 's-q5',
              type: 'mcq',
              questionNumber: 5,
              text: 'Acceleration due to gravity near the surface of the Earth is approximately:',
              options: [
                { id: 'so-9', label: 'A', text: '$9.8\\text{ m/s}^2$' },
                { id: 'so-10', label: 'B', text: '$12.4\\text{ m/s}^2$' },
                { id: 'so-11', label: 'C', text: '$6.67\\text{ m/s}^2$' },
                { id: 'so-12', label: 'D', text: '$3.0\\text{ m/s}^2$' },
              ],
              marks: 2,
              language: 'en',
            },
          ],
        },
        {
          id: 'sec-sci-short',
          sectionTitle: 'Section B: Short Conceptual Questions (24 Marks)',
          instructions: 'Attempt any four (4) questions with clear scientific explanations.',
          totalMarks: 24,
          questions: [
            {
              id: 's-q6',
              type: 'short',
              questionNumber: 1,
              text: "State Newton's Second Law of Motion and show that $F = ma$.",
              marks: 6,
              language: 'en',
            },
            {
              id: 's-q7',
              type: 'short',
              questionNumber: 2,
              text: 'Differentiate between mass and weight. Mention their SI units.',
              marks: 6,
              language: 'en',
            },
            {
              id: 's-q8',
              type: 'short',
              questionNumber: 3,
              text: 'Define Kinetic Energy and Potential Energy with mathematical expressions.',
              marks: 6,
              language: 'en',
            },
            {
              id: 's-q9',
              type: 'short',
              questionNumber: 4,
              text: "Explain Pascal's Principle and state one practical hydraulic application.",
              marks: 6,
              language: 'en',
            },
          ],
        },
        {
          id: 'sec-sci-long',
          sectionTitle: 'Section C: Comprehensive Questions (16 Marks)',
          instructions: 'Attempt any one (1) question with complete derivations and diagrams.',
          totalMarks: 16,
          questions: [
            {
              id: 's-q10',
              type: 'long',
              questionNumber: 1,
              text: 'State the Law of Conservation of Energy. Prove that the total mechanical energy of a freely falling body remains constant throughout its motion.',
              marks: 16,
              language: 'en',
            },
          ],
        },
      ],
    };
  }

  // 8. Computer Science
  if (subject.includes('Computer')) {
    return {
      subject: 'Computer Science',
      language: 'en',
      totalMarks: 50,
      timeAllowed: '2 Hours',
      rawTextSample: `The Achievers Islamic Academy
Computer Science Assessment - ${grade}
Total Marks: 50   Time: 2 Hours

Section A: Multiple Choice Questions (10 Marks)
1. The brain of a computer system is:
(A) CPU   (B) RAM   (C) Hard Disk   (D) Monitor

2. 1 Byte is equal to:
Answer: 8 bits

Section B: Short Technical Questions (24 Marks)
1. Differentiate between Compiler and Interpreter.
2. Define Algorithm and Flowchart with standard symbols.
3. Explain the difference between RAM and ROM.

Section C: Comprehensive Programming (16 Marks)
1. Write an algorithm and flowchart to find the largest among three numbers.`,
      sections: [
        {
          id: 'sec-cs-obj',
          sectionTitle: 'Section A: Objective Computing Fundamentals (10 Marks)',
          instructions: 'Attempt all questions. Choose the most accurate option.',
          totalMarks: 10,
          questions: [
            {
              id: 'cs-q1',
              type: 'mcq',
              questionNumber: 1,
              text: 'Which hardware component performs arithmetic and logic operations in a computer?',
              options: [
                { id: 'cso-1', label: 'A', text: 'Central Processing Unit (CPU)' },
                { id: 'cso-2', label: 'B', text: 'Random Access Memory (RAM)' },
                { id: 'cso-3', label: 'C', text: 'Solid State Drive (SSD)' },
                { id: 'cso-4', label: 'D', text: 'Motherboard' },
              ],
              marks: 2,
              language: 'en',
            },
            {
              id: 'cs-q2',
              type: 'fill_in_the_blank',
              questionNumber: 2,
              text: 'In digital memory measurement, one standard Byte consists of ________ bits.',
              blankAnswer: '8',
              marks: 2,
              language: 'en',
            },
            {
              id: 'cs-q3',
              type: 'mcq',
              questionNumber: 3,
              text: 'Which data structure follows the Last-In First-Out (LIFO) principle?',
              options: [
                { id: 'cso-5', label: 'A', text: 'Stack' },
                { id: 'cso-6', label: 'B', text: 'Queue' },
                { id: 'cso-7', label: 'C', text: 'Array' },
                { id: 'cso-8', label: 'D', text: 'Linked List' },
              ],
              marks: 2,
              language: 'en',
            },
            {
              id: 'cs-q4',
              type: 'fill_in_the_blank',
              questionNumber: 4,
              text: 'A step-by-step finite procedure to solve a specific problem is known as an ________.',
              blankAnswer: 'algorithm',
              marks: 2,
              language: 'en',
            },
            {
              id: 'cs-q5',
              type: 'mcq',
              questionNumber: 5,
              text: 'Which of the following translates high-level source code into machine code line-by-line?',
              options: [
                { id: 'cso-9', label: 'A', text: 'Interpreter' },
                { id: 'cso-10', label: 'B', text: 'Compiler' },
                { id: 'cso-11', label: 'C', text: 'Assembler' },
                { id: 'cso-12', label: 'D', text: 'Linker' },
              ],
              marks: 2,
              language: 'en',
            },
          ],
        },
        {
          id: 'sec-cs-short',
          sectionTitle: 'Section B: Technical Concepts & Logic (24 Marks)',
          instructions: 'Attempt any four (4) questions with precise technical explanations.',
          totalMarks: 24,
          questions: [
            {
              id: 'cs-q6',
              type: 'short',
              questionNumber: 1,
              text: 'Differentiate between Compiler and Interpreter with two major differences.',
              marks: 6,
              language: 'en',
            },
            {
              id: 'cs-q7',
              type: 'short',
              questionNumber: 2,
              text: 'Compare Primary Memory (RAM) and Read-Only Memory (ROM).',
              marks: 6,
              language: 'en',
            },
            {
              id: 'cs-q8',
              type: 'short',
              questionNumber: 3,
              text: 'Draw four standard flowchart symbols (Start/End, Input/Output, Process, Decision) with their functions.',
              marks: 6,
              language: 'en',
            },
            {
              id: 'cs-q9',
              type: 'short',
              questionNumber: 4,
              text: 'Explain the difference between a While loop and a For loop in programming.',
              marks: 6,
              language: 'en',
            },
          ],
        },
        {
          id: 'sec-cs-long',
          sectionTitle: 'Section C: Computational Problem Solving (16 Marks)',
          instructions: 'Attempt any one (1) programming problem with complete logic.',
          totalMarks: 16,
          questions: [
            {
              id: 'cs-q10',
              type: 'long',
              questionNumber: 1,
              text: 'Design a structured algorithm and draw an unambiguous flowchart to determine whether a given positive integer is Prime or Composite.',
              marks: 16,
              language: 'en',
            },
          ],
        },
      ],
    };
  }

  // 9. Generic / Custom Subject Fallback - Retains EXACT chosen subject name!
  return {
    subject: subject,
    language: subject.includes('اردو') ? 'ur' : subject.includes('عرب') ? 'ar' : 'en',
    totalMarks: 50,
    timeAllowed: '2 Hours',
    rawTextSample: `The Achievers Islamic Academy
${subject} Examination - ${grade}
Total Marks: 50   Time: 2 Hours

Section A: Objective Questions (10 Marks)
1. Complete the essential foundational concepts.

Section B: Short Conceptual Questions (24 Marks)
1. State the core definitions and principles.
2. Provide analytical reasoning with examples.

Section C: Detailed Essay / Analysis (16 Marks)
1. Discuss the major topics thoroughly.`,
    sections: [
      {
        id: 'sec-gen-obj',
        sectionTitle: 'Section A: Objective & Concepts (10 Marks)',
        instructions: 'Attempt all questions.',
        totalMarks: 10,
        questions: [
          {
            id: 'g-q1',
            type: 'mcq',
            questionNumber: 1,
            text: `Core examination question 1 for ${subject}:`,
            options: [
              { id: 'go-1', label: 'A', text: 'Fundamental Principle A' },
              { id: 'go-2', label: 'B', text: 'Fundamental Principle B' },
              { id: 'go-3', label: 'C', text: 'Fundamental Principle C' },
              { id: 'go-4', label: 'D', text: 'Fundamental Principle D' },
            ],
            marks: 2,
            language: 'en',
          },
          {
            id: 'g-q2',
            type: 'fill_in_the_blank',
            questionNumber: 2,
            text: `The essential theoretical definition in ${subject} is ________.`,
            blankAnswer: 'standard definition',
            marks: 2,
            language: 'en',
          },
        ],
      },
      {
        id: 'sec-gen-short',
        sectionTitle: 'Section B: Short Questions (24 Marks)',
        instructions: 'Attempt questions concisely.',
        totalMarks: 24,
        questions: [
          {
            id: 'g-q3',
            type: 'short',
            questionNumber: 1,
            text: `Explain the key concepts of ${subject} with relevant illustrations.`,
            marks: 6,
            language: 'en',
          },
          {
            id: 'g-q4',
            type: 'short',
            questionNumber: 2,
            text: 'Differentiate between theoretical framework and practical application.',
            marks: 6,
            language: 'en',
          },
        ],
      },
      {
        id: 'sec-gen-long',
        sectionTitle: 'Section C: Comprehensive Questions (16 Marks)',
        instructions: 'Provide an in-depth answer.',
        totalMarks: 16,
        questions: [
          {
            id: 'g-q5',
            type: 'long',
            questionNumber: 1,
            text: `Write an extensive analytical essay addressing the key challenges and advancements in ${subject}.`,
            marks: 16,
            language: 'en',
          },
        ],
      },
    ],
  };
};
