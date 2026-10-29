import React, { useState } from 'react';
import type { ExamPaper } from './types/exam';
import { HandwrittenConverter } from './components/handwritten/HandwrittenConverter';
import { exportPaperToDocx } from './utils/docxExporter';
import { printPaperNative } from './utils/pdfExporter';

// ---------------------------------------------------------------------------
// Blank paper template — true "no data" starting state.
// Only populated after teacher completes OCR conversion.
// ---------------------------------------------------------------------------
const BLANK_PAPER: ExamPaper = {
  id: 'blank-paper-initial',
  academyName: 'The Achievers Islamic Academy',
  campusName: 'Main Academic Campus',
  examTerm: 'Mid-Term Examination 2026',
  gradeLevel: 'Grade 9 (Matric / O-Level)',
  subject: 'Islamic Studies (اسلامیات)',
  language: 'ur',
  timeAllowed: '2 Hours',
  totalMarks: 50,
  date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
  instructions: [],
  showBismillah: true,
  showWatermark: false,
  showStudentTable: true,
  boardFormat: 'standard',
  showBubbleSheet: false,
  layoutColumns: 1,
  fontSize: 'standard',
  paperSize: 'a4',
  sections: [],
  createdVia: 'manual',
  createdAt: new Date().toISOString(),
};

export function App() {
  const [currentPaper, setCurrentPaper] = useState<ExamPaper>(BLANK_PAPER);

  // Export to Word (.docx)
  const handleExportDocx = async () => {
    try {
      await exportPaperToDocx(currentPaper);
    } catch (err) {
      console.error('Docx export failed:', err);
      alert('Could not export Word document. Please try Print / Save PDF instead.');
    }
  };

  // Native browser print → teacher can save as PDF from print dialog
  const handlePrint = () => {
    printPaperNative('a4');
  };

  // PDF export alias — use the same native print (most reliable across browsers)
  const handleExportPdf = () => {
    printPaperNative('a4');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-900">
      <HandwrittenConverter
        onPrint={handlePrint}
        onExportDocx={handleExportDocx}
        onExportPdf={handleExportPdf}
        onPaperReady={(paper) => setCurrentPaper(paper)}
        currentPaper={currentPaper}
      />
    </div>
  );
}

export default App;
