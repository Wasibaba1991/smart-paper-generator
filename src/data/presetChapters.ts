import type { UploadedChapterPage, Subject } from '../types/exam';

export interface ChapterCollectionPreset {
  id: string;
  subject: Subject;
  title: string;
  description: string;
  pagesCount: number;
  pages: UploadedChapterPage[];
}

export const PRESET_CHAPTER_COLLECTIONS: ChapterCollectionPreset[] = [
  {
    id: 'chap-islamiat-hujurat',
    subject: 'Islamic Studies (اسلامیات)',
    title: 'اسلامیات لازمی - سورۃ الحجرات اور معاشرتی آداب',
    description: 'کتاب کے 5 اوراق: سورۃ الحجرات کا ترجمہ، آدابِ مجلس، تجسس و غیبت کی ممانعت، اور قرآنی احکام',
    pagesCount: 5,
    pages: [
      {
        id: 'isl-p1',
        name: 'Page_42_Surah_Hujurat_Ayat_1-5.jpg',
        size: 384000,
        pageNumber: 1,
        chapterTitle: 'سورۃ الحجرات - تعارف و آیات 1 تا 5',
        previewUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="420" viewBox="0 0 300 420"><rect width="100%" height="100%" fill="%23f8fafc" stroke="%23cbd5e1"/><text x="150" y="40" font-family="serif" font-size="14" font-weight="bold" fill="%230F284E" text-anchor="middle">صفحہ 42: سورۃ الحجرات</text><line x1="20" y1="55" x2="280" y2="55" stroke="%23059669" stroke-width="2"/><text x="270" y="80" font-family="serif" font-size="11" fill="%23334155" text-anchor="end">یا ایھا الذین آمنوا لا تقدموا بین یدی اللہ</text><text x="270" y="110" font-family="serif" font-size="10" fill="%2364748b" text-anchor="end">ترجمہ: اے ایمان والو! اللہ اور اس کے رسول سے آگے نہ بڑھو...</text><rect x="30" y="140" width="240" height="180" fill="%23e2e8f0" rx="4"/><text x="150" y="235" font-family="sans-serif" font-size="12" fill="%2364748b" text-anchor="middle">متن قرآن و تشریح</text><text x="150" y="390" font-family="sans-serif" font-size="10" fill="%2394a3b8" text-anchor="middle">صفحہ نمبر 42</text></svg>',
        dataUrl: '',
      },
      {
        id: 'isl-p2',
        name: 'Page_43_Aadaab_e_Risalat.jpg',
        size: 412000,
        pageNumber: 2,
        chapterTitle: 'آدابِ رسالت اور اخلاقی تعلیمات',
        previewUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="420" viewBox="0 0 300 420"><rect width="100%" height="100%" fill="%23f8fafc" stroke="%23cbd5e1"/><text x="150" y="40" font-family="serif" font-size="14" font-weight="bold" fill="%230F284E" text-anchor="middle">صفحہ 43: آدابِ رسالت</text><line x1="20" y1="55" x2="280" y2="55" stroke="%23059669" stroke-width="2"/><text x="270" y="80" font-family="serif" font-size="11" fill="%23334155" text-anchor="end">لا ترفعوا اصواتکم فوق صوت النبی</text><text x="270" y="110" font-family="serif" font-size="10" fill="%2364748b" text-anchor="end">اپنی آوازیں نبی کی آواز پر بلند نہ کرو...</text><rect x="30" y="140" width="240" height="180" fill="%23e2e8f0" rx="4"/><text x="150" y="235" font-family="sans-serif" font-size="12" fill="%2364748b" text-anchor="middle">شانِ نزول و تفسیری نکات</text><text x="150" y="390" font-family="sans-serif" font-size="10" fill="%2394a3b8" text-anchor="middle">صفحہ نمبر 43</text></svg>',
        dataUrl: '',
      },
      {
        id: 'isl-p3',
        name: 'Page_44_Ikhwa_wa_Sulh.jpg',
        size: 395000,
        pageNumber: 3,
        chapterTitle: 'مومنین کے درمیان صلح اور اخوت',
        previewUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="420" viewBox="0 0 300 420"><rect width="100%" height="100%" fill="%23f8fafc" stroke="%23cbd5e1"/><text x="150" y="40" font-family="serif" font-size="14" font-weight="bold" fill="%230F284E" text-anchor="middle">صفحہ 44: مومنین میں صلح</text><line x1="20" y1="55" x2="280" y2="55" stroke="%23059669" stroke-width="2"/><text x="270" y="80" font-family="serif" font-size="11" fill="%23334155" text-anchor="end">إنما المؤمنون إخوة فأصلحوا بين أخويكم</text><rect x="30" y="130" width="240" height="190" fill="%23e2e8f0" rx="4"/><text x="150" y="235" font-family="sans-serif" font-size="12" fill="%2364748b" text-anchor="middle">معاشرتی یگانگت کے اصول</text><text x="150" y="390" font-family="sans-serif" font-size="10" fill="%2394a3b8" text-anchor="middle">صفحہ نمبر 44</text></svg>',
        dataUrl: '',
      },
      {
        id: 'isl-p4',
        name: 'Page_45_Gheebat_Tajassus_Mamnoo.jpg',
        size: 420000,
        pageNumber: 4,
        chapterTitle: 'تجسس، غیبت اور بدگمانی کی حرمت',
        previewUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="420" viewBox="0 0 300 420"><rect width="100%" height="100%" fill="%23f8fafc" stroke="%23cbd5e1"/><text x="150" y="40" font-family="serif" font-size="14" font-weight="bold" fill="%230F284E" text-anchor="middle">صفحہ 45: برے اخلاق کی ممانعت</text><line x1="20" y1="55" x2="280" y2="55" stroke="%23059669" stroke-width="2"/><text x="270" y="80" font-family="serif" font-size="11" fill="%23334155" text-anchor="end">اجتنبوا كثيرا من الظن ولا تجسسوا</text><text x="270" y="110" font-family="serif" font-size="10" fill="%2364748b" text-anchor="end">ولا يغتب بعضكم بعضا...</text><rect x="30" y="140" width="240" height="180" fill="%23e2e8f0" rx="4"/><text x="150" y="235" font-family="sans-serif" font-size="12" fill="%2364748b" text-anchor="middle">غیبت کی سنگینی اور تمثیل</text><text x="150" y="390" font-family="sans-serif" font-size="10" fill="%2394a3b8" text-anchor="middle">صفحہ نمبر 45</text></svg>',
        dataUrl: '',
      },
      {
        id: 'isl-p5',
        name: 'Page_46_Mashq_wa_Tamreenat.jpg',
        size: 435000,
        pageNumber: 5,
        chapterTitle: 'مشقی سوالات و الفاظ و معانی',
        previewUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="420" viewBox="0 0 300 420"><rect width="100%" height="100%" fill="%23f8fafc" stroke="%23cbd5e1"/><text x="150" y="40" font-family="serif" font-size="14" font-weight="bold" fill="%230F284E" text-anchor="middle">صفحہ 46: مشق و سوالات</text><line x1="20" y1="55" x2="280" y2="55" stroke="%23059669" stroke-width="2"/><text x="270" y="80" font-family="serif" font-size="11" fill="%23334155" text-anchor="end">سوالات: الفاظ کے معانی اور مشقی کثیر الانتخابی سوالات</text><rect x="30" y="120" width="240" height="200" fill="%23e2e8f0" rx="4"/><text x="150" y="235" font-family="sans-serif" font-size="12" fill="%2364748b" text-anchor="middle">مشق و سوالات</text><text x="150" y="390" font-family="sans-serif" font-size="10" fill="%2394a3b8" text-anchor="middle">صفحہ نمبر 46</text></svg>',
        dataUrl: '',
      },
    ],
  },
  {
    id: 'chap-math-quadratic',
    subject: 'Mathematics (ریاضی)',
    title: 'Grade 10 Math - Chapter 1 & 2: Quadratic Equations & Roots',
    description: 'Textbook pages covering factorization, quadratic formula, synthetic division, and cube roots of unity',
    pagesCount: 6,
    pages: [
      {
        id: 'm-p1',
        name: 'Math_Chap1_Page12_QuadIntro.jpg',
        size: 340000,
        pageNumber: 1,
        chapterTitle: 'Definition & Standard Form of Quadratic Equations',
        previewUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="420" viewBox="0 0 300 420"><rect width="100%" height="100%" fill="%23f8fafc" stroke="%23cbd5e1"/><text x="150" y="40" font-family="sans-serif" font-size="14" font-weight="bold" fill="%230F284E" text-anchor="middle">Page 12: Quadratic Equations</text><line x1="20" y1="55" x2="280" y2="55" stroke="%230F284E" stroke-width="2"/><text x="30" y="90" font-family="monospace" font-size="12" fill="%23334155">ax^2 + bx + c = 0, a != 0</text><rect x="30" y="120" width="240" height="200" fill="%23f1f5f9" rx="4"/><text x="150" y="225" font-family="sans-serif" font-size="12" fill="%2364748b" text-anchor="middle">Solving Methods &amp; Examples</text><text x="150" y="390" font-family="sans-serif" font-size="10" fill="%2394a3b8" text-anchor="middle">Page 12</text></svg>',
        dataUrl: '',
      },
      {
        id: 'm-p2',
        name: 'Math_Chap1_Page18_Factorization.jpg',
        size: 360000,
        pageNumber: 2,
        chapterTitle: 'Solution by Factoring and Completing Squares',
        previewUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="420" viewBox="0 0 300 420"><rect width="100%" height="100%" fill="%23f8fafc" stroke="%23cbd5e1"/><text x="150" y="40" font-family="sans-serif" font-size="14" font-weight="bold" fill="%230F284E" text-anchor="middle">Page 18: Solution Methods</text><line x1="20" y1="55" x2="280" y2="55" stroke="%230F284E" stroke-width="2"/><rect x="30" y="100" width="240" height="220" fill="%23f1f5f9" rx="4"/><text x="150" y="215" font-family="sans-serif" font-size="12" fill="%2364748b" text-anchor="middle">Exercise 1.1 &amp; 1.2 Problems</text><text x="150" y="390" font-family="sans-serif" font-size="10" fill="%2394a3b8" text-anchor="middle">Page 18</text></svg>',
        dataUrl: '',
      },
      {
        id: 'm-p3',
        name: 'Math_Chap2_Page26_Discriminant.jpg',
        size: 380000,
        pageNumber: 3,
        chapterTitle: 'Discriminant & Nature of Roots (b^2 - 4ac)',
        previewUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="420" viewBox="0 0 300 420"><rect width="100%" height="100%" fill="%23f8fafc" stroke="%23cbd5e1"/><text x="150" y="40" font-family="sans-serif" font-size="14" font-weight="bold" fill="%230F284E" text-anchor="middle">Page 26: Theory of Quadratic Eq</text><line x1="20" y1="55" x2="280" y2="55" stroke="%230F284E" stroke-width="2"/><text x="30" y="90" font-family="monospace" font-size="12" fill="%23334155">Disc = b^2 - 4ac</text><rect x="30" y="120" width="240" height="200" fill="%23f1f5f9" rx="4"/><text x="150" y="225" font-family="sans-serif" font-size="12" fill="%2364748b" text-anchor="middle">Nature of Roots Table</text><text x="150" y="390" font-family="sans-serif" font-size="10" fill="%2394a3b8" text-anchor="middle">Page 26</text></svg>',
        dataUrl: '',
      },
      {
        id: 'm-p4',
        name: 'Math_Chap2_Page32_CubeRoots.jpg',
        size: 375000,
        pageNumber: 4,
        chapterTitle: 'Cube Roots of Unity and Properties (omega, omega^2)',
        previewUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="420" viewBox="0 0 300 420"><rect width="100%" height="100%" fill="%23f8fafc" stroke="%23cbd5e1"/><text x="150" y="40" font-family="sans-serif" font-size="14" font-weight="bold" fill="%230F284E" text-anchor="middle">Page 32: Cube Roots of Unity</text><line x1="20" y1="55" x2="280" y2="55" stroke="%230F284E" stroke-width="2"/><text x="30" y="90" font-family="monospace" font-size="12" fill="%23334155">1 + w + w^2 = 0, w^3 = 1</text><rect x="30" y="120" width="240" height="200" fill="%23f1f5f9" rx="4"/><text x="150" y="225" font-family="sans-serif" font-size="12" fill="%2364748b" text-anchor="middle">Proofs and Simplifications</text><text x="150" y="390" font-family="sans-serif" font-size="10" fill="%2394a3b8" text-anchor="middle">Page 32</text></svg>',
        dataUrl: '',
      },
    ],
  },
];
