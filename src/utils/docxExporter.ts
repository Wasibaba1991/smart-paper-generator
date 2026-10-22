import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  Packer,
  HeadingLevel,
} from 'docx';
import { saveAs } from 'file-saver';
import type { ExamPaper } from '../types/exam';

export const exportPaperToDocx = async (paper: ExamPaper): Promise<void> => {
  const isUrduOrArabic = paper.language === 'ur' || paper.language === 'ar';
  const defaultFont = isUrduOrArabic ? 'Noto Nastaliq Urdu' : 'Arial';

  const docChildren: (Paragraph | Table)[] = [];

  // 1. Calligraphic Bismillah (if enabled)
  if (paper.showBismillah) {
    docChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
            font: 'Amiri',
            size: 28, // 14pt
            bold: true,
            color: '0F284E',
          }),
        ],
      })
    );
  }

  // 2. School Title & Subtitle
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 60, after: 60 },
      heading: HeadingLevel.TITLE,
      children: [
        new TextRun({
          text: 'THE ACHIEVERS ISLAMIC ACADEMY',
          font: 'Arial',
          size: 32, // 16pt
          bold: true,
          color: '0F284E',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: 'Excellence in Academic Wisdom & Islamic Values • العِلْمُ وَالْعَمَلُ',
          font: 'Arial',
          size: 18, // 9pt
          bold: true,
          color: '059669',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: `${paper.examTerm.toUpperCase()}`,
          font: 'Arial',
          size: 22, // 11pt
          bold: true,
          color: '0F284E',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 180 },
      children: [
        new TextRun({
          text: `${paper.subject.toUpperCase()} — ${paper.gradeLevel.toUpperCase()}`,
          font: isUrduOrArabic ? defaultFont : 'Arial',
          size: 24, // 12pt
          bold: true,
          color: '059669',
        }),
      ],
    })
  );

  // 3. Metadata Header Table (Class, Subject, Time, Total Marks, Student Name)
  const borderNone = {
    top: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
    left: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
    right: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
  };

  const metadataTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            borders: borderNone,
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'Class: ', bold: true, size: 18 }),
                  new TextRun({ text: paper.gradeLevel, size: 18 }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 35, type: WidthType.PERCENTAGE },
            borders: borderNone,
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'Subject: ', bold: true, size: 18 }),
                  new TextRun({ text: paper.subject, font: defaultFont, size: 18 }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 20, type: WidthType.PERCENTAGE },
            borders: borderNone,
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'Time: ', bold: true, size: 18 }),
                  new TextRun({ text: paper.timeAllowed, size: 18 }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 20, type: WidthType.PERCENTAGE },
            borders: borderNone,
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({ text: 'Max Marks: ', bold: true, size: 18 }),
                  new TextRun({ text: `${paper.totalMarks}`, bold: true, size: 20, color: '0F284E' }),
                ],
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            columnSpan: 2,
            borders: borderNone,
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'Student Name: _________________________________', size: 18 }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            borders: borderNone,
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'Roll No: ____________', size: 18 }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            borders: borderNone,
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({ text: 'Obt. Marks: _____', size: 18 }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  docChildren.push(metadataTable);

  // 4. General Instructions
  if (paper.instructions && paper.instructions.length > 0) {
    docChildren.push(
      new Paragraph({
        spacing: { before: 140, after: 140 },
        children: [
          new TextRun({ text: 'General Instructions: ', bold: true, size: 18 }),
          new TextRun({ text: paper.instructions.join(' | '), italics: true, size: 18 }),
        ],
      })
    );
  }

  // 5. Sections and Questions
  paper.sections.forEach((sec, secIdx) => {
    // Section Header
    docChildren.push(
      new Paragraph({
        spacing: { before: 240, after: 80 },
        children: [
          new TextRun({
            text: `${sec.sectionTitle} (${sec.totalMarks} Marks)`,
            bold: true,
            size: 22,
            color: '0F284E',
          }),
        ],
      })
    );

    if (sec.instructions) {
      docChildren.push(
        new Paragraph({
          spacing: { after: 120 },
          children: [
            new TextRun({
              text: sec.instructions,
              italics: true,
              size: 18,
              color: '555555',
            }),
          ],
        })
      );
    }

    // Questions in Section
    sec.questions.forEach((q) => {
      const qNumText = `Q${q.questionNumber || ''}. `;
      const marksText = ` [${q.marks} Mark${q.marks > 1 ? 's' : ''}]`;

      // Clean latex math symbols for Word readability (e.g. $x^2$ -> x^2)
      const cleanText = q.text.replace(/\$\$/g, '').replace(/\$/g, '');

      docChildren.push(
        new Paragraph({
          spacing: { before: 100, after: 40 },
          children: [
            new TextRun({ text: qNumText, bold: true, size: 20 }),
            new TextRun({ text: cleanText, font: defaultFont, size: 20 }),
            new TextRun({ text: marksText, bold: true, color: '059669', size: 18 }),
          ],
        })
      );

      // Handle MCQ Options
      if (q.type === 'mcq' && q.options && q.options.length > 0) {
        const optionRuns: TextRun[] = [];
        q.options.forEach((opt) => {
          const optText = opt.text.replace(/\$\$/g, '').replace(/\$/g, '');
          optionRuns.push(
            new TextRun({ text: `(${opt.label}) `, bold: true, size: 18 }),
            new TextRun({ text: `${optText}       `, font: defaultFont, size: 18 })
          );
        });

        docChildren.push(
          new Paragraph({
            spacing: { before: 40, after: 80 },
            indent: { left: 360 }, // 0.25 inch indent
            children: optionRuns,
          })
        );
      }

      // Handle Vocabulary / Matching Columns
      if (q.type === 'vocabulary' && q.columnMatchLeft && q.columnMatchRight) {
        const vocabRows = q.columnMatchLeft.map((leftItem, i) => {
          const rightItem = q.columnMatchRight?.[i] || '';
          return new TableRow({
            children: [
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                borders: borderNone,
                children: [new Paragraph({ children: [new TextRun({ text: `• ${leftItem}`, size: 18 })] })],
              }),
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                borders: borderNone,
                children: [new Paragraph({ children: [new TextRun({ text: `• ${rightItem}`, size: 18 })] })],
              }),
            ],
          });
        });

        docChildren.push(
          new Table({
            width: { size: 90, type: WidthType.PERCENTAGE },
            rows: vocabRows,
          })
        );
      }

      // Handle Pre-Primary Tracing
      if (q.type === 'tracing' && q.tracingLetters) {
        q.tracingLetters.forEach((letter) => {
          docChildren.push(
            new Paragraph({
              spacing: { before: 40, after: 60 },
              children: [
                new TextRun({ text: `[ ${letter} ]  `, bold: true, size: 24, color: '0F284E' }),
                new TextRun({ text: `${letter}  . . .  ${letter}  . . .  ${letter}  . . .  (Trace & Copy)`, color: '888888', size: 20 }),
              ],
            })
          );
        });
      }

      // Handle Pre-Primary Visual Matching
      if (q.type === 'image_matching' && q.visualPairs) {
        const matchRows = q.visualPairs.map((pair) => {
          return new TableRow({
            children: [
              new TableCell({
                width: { size: 45, type: WidthType.PERCENTAGE },
                borders: borderNone,
                children: [new Paragraph({ children: [new TextRun({ text: `${pair.leftIcon || '•'} ${pair.leftText}`, size: 18, bold: true })] })],
              }),
              new TableCell({
                width: { size: 10, type: WidthType.PERCENTAGE },
                borders: borderNone,
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'o  ---  o', color: '888888', size: 16 })] })],
              }),
              new TableCell({
                width: { size: 45, type: WidthType.PERCENTAGE },
                borders: borderNone,
                children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `${pair.rightText} ${pair.rightIcon || ''}`, size: 18, bold: true })] })],
              }),
            ],
          });
        });

        docChildren.push(
          new Table({
            width: { size: 95, type: WidthType.PERCENTAGE },
            rows: matchRows,
          })
        );
      }

      // Handle Pre-Primary Drawing & Coloring Task
      if (q.type === 'coloring_drawing') {
        docChildren.push(
          new Paragraph({
            spacing: { before: 60, after: 120 },
            children: [
              new TextRun({ text: `[ ✎ Drawing & Coloring Box: ${q.drawingOutlineType || 'Free Drawing'} ]`, italics: true, color: '059669', size: 18 }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        spacing: { before: 600, after: 600 },
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: `${q.drawingInstruction || 'Draw and color inside this box'}`, color: 'AAAAAA', size: 16 }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          })
        );
      }

      // Handle Pre-Primary Count and Circle
      if (q.type === 'count_and_circle' && q.countItemsList) {
        q.countItemsList.forEach((item, idx) => {
          const icons = Array(item.count).fill(item.icon).join(' ');
          docChildren.push(
            new Paragraph({
              spacing: { before: 40, after: 40 },
              children: [
                new TextRun({ text: `${idx + 1}.  ${icons}  `, size: 22 }),
                new TextRun({ text: `    Circle correct number: ( ${item.count - 1 > 0 ? item.count - 1 : 1} )   ( ${item.count} )   ( ${item.count + 1} )`, bold: true, size: 18, color: '0F284E' }),
              ],
            })
          );
        });
      }

      // If short or long question, add answer lines for worksheet format
      if (q.type === 'short') {
        docChildren.push(
          new Paragraph({
            spacing: { before: 40, after: 60 },
            children: [
              new TextRun({
                text: 'Ans: __________________________________________________________________________________',
                color: 'BBBBBB',
                size: 16,
              }),
            ],
          })
        );
      }
    });
  });

  // Footer note
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 360, after: 120 },
      children: [
        new TextRun({
          text: '*** ALL THE BEST - THE ACHIEVERS ISLAMIC ACADEMY ***',
          bold: true,
          size: 18,
          color: '0F284E',
        }),
      ],
    })
  );

  const isLegal = paper.paperSize === 'legal';

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              width: isLegal ? 12240 : 11906, // twips: 8.5in vs 8.27in
              height: isLegal ? 20160 : 16838, // twips: 14.0in vs 11.69in
            },
            margin: {
              top: 720, // 0.5 inch
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children: docChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const cleanSubject = paper.subject.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `The_Achievers_Islamic_Academy_${cleanSubject}_${paper.gradeLevel.replace(/[^a-zA-Z0-9]/g, '_')}.docx`;
  saveAs(blob, filename);
};
