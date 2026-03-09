import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from "docx";
import { saveAs } from "file-saver";
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

// Helper to clean HTML tags for plain text or specific formats
const stripHtml = (html: string) => {
  return html.replace(/<[^>]*>?/gm, '');
};

export const exportToBibTeX = (citations: any[]) => {
  const bibtex = citations.map((c, index) => {
    const authors = c.original.authors?.map((a: any) => `${a.lastName || ''}, ${a.firstName || ''}`).join(' and ') || 'Unknown';
    return `@misc{cite${index + 1},
  author = {${authors}},
  title = {${c.titleText}},
  year = {${c.original.year || ''}},
  publisher = {${c.original.source || ''}},
  url = {${c.original.url || ''}}
}`;
  }).join('\n\n');

  const blob = new Blob([bibtex], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, "citations.bib");
};

export const exportToRIS = (citations: any[]) => {
  const ris = citations.map((c) => {
    const authors = c.original.authors?.map((a: any) => `AU  - ${a.lastName || ''}, ${a.firstName || ''}`).join('\n') || 'AU  - Unknown';
    return `TY  - GEN
${authors}
TI  - ${c.titleText}
PY  - ${c.original.year || ''}
PB  - ${c.original.source || ''}
UR  - ${c.original.url || ''}
ER  - `;
  }).join('\n\n');

  const blob = new Blob([ris], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, "citations.ris");
};

export const exportToWord = async (citations: any[], settings: any, language: string) => {
  const title = language === 'TH' ? 'รายการอ้างอิง' : 'References';
  
  const paragraphs = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: title,
          bold: true,
          size: 32, // 16pt
          font: settings.font,
        })
      ]
    }),
  ];

  citations.forEach((c) => {
    const parts = c.html.split(/<\/?i>/);
    const children: TextRun[] = [];
    
    parts.forEach((part: string, index: number) => {
      const isItalic = index % 2 !== 0;
      children.push(new TextRun({
        text: part,
        italics: isItalic,
        size: parseInt(settings.textSize) * 2,
        font: settings.font,
      }));
    });

    paragraphs.push(
      new Paragraph({
        children: children,
        spacing: { 
          line: settings.doubleSpaced ? 480 : 360, 
          after: 200 
        },
        indent: settings.hangingIndent ? { left: 720, hanging: 720 } : undefined,
        alignment: AlignmentType.LEFT,
      })
    );
  });

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: 1440,
            right: 1440,
            bottom: 1440,
            left: 1440,
          },
        },
      },
      children: paragraphs,
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "bibliography.docx");
};

export const exportToPDF = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    // Hide actions temporarily if needed, but the paper ID should only contain the paper
    const dataUrl = await toPng(element, { 
      backgroundColor: '#ffffff',
      cacheBust: true,
      style: {
        // Ensure no Lab/Oklch colors are parsed incorrectly by some capture engines
        // effectively "flattening" the style
      }
    });
    
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'in',
      format: 'letter'
    });

    const imgProps = doc.getImageProperties(dataUrl);
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    doc.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
    doc.save(filename);
    return true;
  } catch (error) {
    console.error('PDF Export Error:', error);
    throw error;
  }
};
