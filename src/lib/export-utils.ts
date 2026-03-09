import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from "docx";
import { saveAs } from "file-saver";

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
      text: title,
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
  ];

  citations.forEach((c) => {
    // We need to parse the html string to handle italics
    // For simplicity, we split by <i> and </i>
    const parts = c.html.split(/<\/?i>/);
    const children: TextRun[] = [];
    
    parts.forEach((part: string, index: number) => {
      // Even indexes are normal, odd are italicized (if they were between <i> and </i>)
      const isItalic = index % 2 !== 0;
      children.push(new TextRun({
        text: part,
        italics: isItalic,
        size: parseInt(settings.textSize) * 2, // docx uses half-points
        font: settings.font,
      }));
    });

    paragraphs.push(
      new Paragraph({
        children: children,
        spacing: { 
          line: settings.doubleSpaced ? 480 : 240, // 240 is 1 line
          after: 200 
        },
        indent: settings.hangingIndent ? { hanging: 720 } : undefined, // 720 is 0.5 inch
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
  // @ts-ignore
  const html2pdf = (await import('html2pdf.js')).default;
  const element = document.getElementById(elementId);
  if (!element) return;

  const opt = {
    margin: 1,
    filename: filename,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const }
  };

  html2pdf().from(element).set(opt).save();
};
