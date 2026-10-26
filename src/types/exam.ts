export type PaperSize = 'a4' | 'legal';

export type Language = 'ur' | 'ar' | 'math' | 'en' | 'bilingual';

export type QuestionType = 
  | 'mcq' 
  | 'fill_in_the_blank' 
  | 'short' 
  | 'long' 
  | 'vocabulary'
  | 'tracing'
  | 'coloring_drawing'
  | 'image_matching'
  | 'count_and_circle';

export type GradeLevel =
  | 'Playgroup / Nursery'
  | 'Nursery / Playgroup'
  | 'Kindergarten (KG / Prep)'
  | 'Kindergarten (KG-1 / Prep)'
  | 'Kindergarten (KG-2 / Advance)'
  | 'Grade 1'
  | 'Grade 2'
  | 'Grade 3'
  | 'Grade 4'
  | 'Grade 5'
  | 'Grade 6'
  | 'Grade 7'
  | 'Grade 8'
  | 'Grade 9 (Matric / O-Level)'
  | 'Grade 10 (Matric / O-Level)'
  | 'Grade 11 (HSSC-I)'
  | 'Grade 12 (HSSC-II)';

export type Subject =
  | 'Pre-Primary English & Phonics'
  | 'Pre-Primary Urdu (حروفیات و تصویری پہچان)'
  | 'Pre-Primary Math & Numbers'
  | 'Pre-Primary Islamic & General Knowledge'
  | 'Pre-Primary Art, Drawing & Coloring'
  | 'Islamic Studies (اسلامیات)'
  | 'Urdu Literature & Grammar (اردو)'
  | 'English Language & Lit'
  | 'Mathematics (ریاضی)'
  | 'Arabic Language (اللغة العربية)'
  | 'General Science (سائنس)'
  | 'Physics'
  | 'Chemistry'
  | 'Biology'
  | 'Computer Science'
  | 'Pakistan Studies (مطالعہ پاکستان)';

export type ExamTerm =
  | 'First Term Assessment 2026'
  | 'Mid-Term Examination 2026'
  | 'Final Term Examination 2026'
  | 'Monthly Class Test'
  | 'Send-Up / Pre-Board Examination'
  | string;

export interface QuestionOption {
  id: string;
  label: string;
  text: string;
  image?: string;
  icon?: string;
  isCorrect?: boolean;
}

export interface VisualMatchingPair {
  id: string;
  leftText: string;
  leftIcon?: string;
  leftSubtext?: string;
  rightText: string;
  rightIcon?: string;
  rightSubtext?: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  questionNumber: number;
  text: string;
  secondaryText?: string;
  options?: QuestionOption[];
  blankAnswer?: string;
  sampleAnswer?: string;
  columnMatchLeft?: string[];
  columnMatchRight?: string[];
  visualPairs?: VisualMatchingPair[];
  tracingLetters?: string[];
  tracingGuideText?: string;
  tracingRows?: number;
  drawingInstruction?: string;
  drawingOutlineType?: 'apple' | 'flower' | 'star' | 'crescent' | 'tree' | 'car' | 'mosque' | 'boat' | 'custom_box';
  countItemsList?: { icon: string; count: number; label: string }[];
  marks: number;
  language?: Language;
  /** True when this question was auto-generated as a scaffold and has NOT been edited by the teacher yet */
  isScaffold?: boolean;
}

export interface ExamSection {
  id: string;
  sectionTitle: string;
  instructions?: string;
  allowedChoiceText?: string;
  totalMarks: number;
  questions: Question[];
}

export interface ExamPaper {
  id: string;
  academyName: string;
  campusName?: string;
  examTerm: ExamTerm;
  gradeLevel: GradeLevel;
  subject: Subject;
  language: Language;
  timeAllowed: string;
  totalMarks: number;
  date?: string;
  instructions: string[];
  showBismillah?: boolean;
  showWatermark?: boolean;
  showStudentTable?: boolean;
  boardFormat?: 'standard' | 'bise' | 'fbise' | 'pre_primary';
  paperCode?: string;
  examGroup?: string;
  showBubbleSheet?: boolean;
  layoutColumns?: 1 | 2;
  fontSize: 'compact' | 'standard' | 'large' | 'pre_primary';
  paperSize: PaperSize;
  createdVia?: 'ai_generator' | 'ocr' | 'preset' | 'manual' | 'ocr_extract' | 'pre_primary';
  createdAt?: string;
  sections: ExamSection[];
  isPrePrimary?: boolean;
}

export interface BlueprintConfig {
  grade: GradeLevel;
  subject: Subject;
  examTerm: ExamTerm;
  language: Language;
  paperSize: PaperSize;
  timeAllowed: string;
  totalTargetMarks: number;
  mcqCount: number;
  mcqMarksEach: number;
  blanksCount: number;
  blanksMarksEach: number;
  vocabCount: number;
  vocabMarksEach: number;
  shortCountTotal: number;
  shortCountToAttempt: number;
  shortMarksEach: number;
  longCountTotal: number;
  longCountToAttempt: number;
  longMarksEach: number;
  difficultyDistribution: {
    easy: number;
    medium: number;
    hard: number;
  };
}

export interface UploadedChapterPage {
  id: string;
  dataUrl: string;
  previewUrl?: string;
  chapterTitle?: string;
  name: string;
  pageNumber: number;
  file?: File;
  size?: number;
}