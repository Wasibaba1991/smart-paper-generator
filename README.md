# The Achievers Islamic Academy - Smart Paper Generator & Exam Studio

A production-ready, professional examination paper generator and exam studio engineered for **The Achievers Islamic Academy**.

---

## 🌟 Key Features

### 1. Multi-Language & RTL Engine
- **English**: Modern academic typography with clean layout.
- **Urdu (اردو)**: Authentic Right-to-Left (RTL) alignment with **Nastaliq / Jameel Noori** typography (`Noto Nastaliq Urdu`), Urdu numerals (۱، ۲، ۳), and option labels (الف، ب، ج، د).
- **Arabic (اللغة العربية)**: Naskh / Amiri script (`Amiri`) with full diacritics (Tashkeel / Aerab) for Quranic verses, Hadith, and Islamic grammar (Nahw & Sarf).
- **Mathematics (ریاضی)**: High-fidelity LaTeX mathematical equation rendering powered by **KaTeX** ($ax^2 + bx + c = 0$, fractions $\frac{a}{b}$, square roots $\sqrt{x}$, Greek symbols $\alpha, \beta, \omega, \theta$, and matrices).
- **Bilingual Support**: Side-by-side English + Urdu text for dual-language examination papers.

---

### 2. Mode 1: OCR & Formatting Mode
- **Snapshot & Notes Upload**: Teachers can upload mobile snapshots, handwritten notes, or scanned test sheets.
- **Pre-Loaded OCR Presets**: Ready-to-test handwritten papers for Islamic Studies, Mathematics, and Urdu Literature.
- **Handwriting Enhancement Filters**: Real-time ink contrast adjustment, paper brightness boost, and monochromatic B&W filter to optimize handwriting legibility.
- **Smart Parsing & Segmentation**: Automatically identifies exam metadata, sections (Objective, Short Qs, Long Qs), MCQs, fill-in-the-blanks, and matching columns.
- **Interactive Reviewer**: Side-by-side comparison between original snapshot, editable raw OCR text, and structured question blocks.

---

### 3. Mode 2: AI Auto-Generation Mode
- **Multi-Image Chapter Upload**: Teachers can upload 4 to 10 textbook pages or syllabus snapshots to ground question generation.
- **Preset Curriculum Collections**: Instant 1-click chapter sets (e.g., *Surah Al-Hujurat 5 pages*, *Grade 10 Mathematics 6 pages*).
- **Interactive Question Distribution**:
  - MCQs count & marks per question
  - Fill in the blanks count & marks
  - Vocabulary / word meanings / matching columns
  - Short Questions: Total pool count, number to attempt (e.g., "Attempt any 5 out of 7"), and marks
  - Long Questions: Total pool count, number to attempt (e.g., "Attempt any 2 out of 3"), and marks
- **Preliminary Clarification & Confirmation Step**:
  - Interactive blueprint confirmation modal
  - Real-time marks calculation and section weightage percentages
  - Bloom's Taxonomy cognitive distribution (Knowledge 40%, Understanding 40%, Application 20%)
  - Choice rubric verification before final paper generation.

---

### 4. Interactive Exam Paper Studio & Live Editor
- **Official Letterhead Layout**:
  - Academy Emblem / Crest
  - Calligraphic Arabic Bismillah: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ`
  - Academy Motto: *Excellence in Academic Wisdom & Islamic Values • العِلْمُ وَالْعَمَلُ*
  - Student details table (Student Name, Roll No., Class, Section, Subject, Date, Invigilator Signature, Obtained Marks)
  - General examination instructions.
- **Layout Toggles**:
  - Switch between **Single-Column** and **Two-Column** classic Pakistani/British board exam layouts to optimize paper usage.
  - Font Size adjustments: **Compact**, **Standard**, and **Large**.
  - Academy crest watermark toggle.
- **Inline Question Editing**:
  - Add new questions to any section anytime.
  - Edit question text, marks, options, and sample answers.
  - Quick Math snippet buttons for instant LaTeX formula insertion ($\frac{a}{b}$, $\sqrt{x}$, $\alpha$, $\beta$, etc.).
  - Duplicate, delete, and reorder questions up and down.
- **Teacher Marking Scheme & Answer Key**:
  - Dedicated toggle to switch between **Student Question Paper** and **Teacher Answer Key**.
  - Highlights correct options for MCQs, blank solutions, and model answers with step-by-step grading rubrics.

---

### 5. Multi-Format Direct Export
- **Microsoft Word (.docx)**: Native Word document generation using the `docx` library with custom academy headers, formatted tables, bold marks, and section styling.
- **One-Click Print (A4)**: Configured `@media print` rules for portrait A4 layout, zero web UI clutter, exact margins, and no question splitting across page breaks.
- **PDF Export**: Direct client-side PDF download via `html2canvas` and `jspdf`.

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Production build
npm run build
```

The application will run at `http://localhost:5173/`.

---

## 🛠️ Technology Stack
- **Framework**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS v4
- **Typography**: Google Fonts (*Plus Jakarta Sans*, *Amiri*, *Noto Nastaliq Urdu*, *Noto Naskh Arabic*)
- **Math Rendering**: KaTeX 0.16
- **Word Export**: `docx` + `file-saver`
- **PDF / Print**: `jspdf` + `html2canvas` + Print CSS
- **Icons**: Lucide React
- **Celebration Feedback**: Canvas Confetti
