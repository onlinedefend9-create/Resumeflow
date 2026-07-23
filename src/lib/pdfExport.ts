// @ts-ignore
import html2pdfModule from 'html2pdf.js';

const getHtml2Pdf = () => {
  if (typeof html2pdfModule === 'function') {
    return html2pdfModule;
  }
  if ((html2pdfModule as any)?.default && typeof (html2pdfModule as any).default === 'function') {
    return (html2pdfModule as any).default;
  }
  if (typeof (window as any).html2pdf === 'function') {
    return (window as any).html2pdf;
  }
  return null;
};

export const exportToPDF = async (elementId: string = 'cv-canvas', filename: string = 'resume.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found`);
    window.print();
    return;
  }

  // Add temporary print class to document body to hide non-printable widgets/buttons
  document.body.classList.add('exporting-pdf');

  try {
    const html2pdf = getHtml2Pdf();
    if (html2pdf) {
      const opt = {
        margin: [6, 6, 6, 6],
        filename: filename,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          windowWidth: 800,
          scrollY: 0,
          scrollX: 0
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as 'portrait' | 'landscape' }
      };

      await html2pdf().set(opt).from(element).save();
    } else {
      console.warn('html2pdf function not available, triggering browser print dialog');
      window.print();
    }
  } catch (error) {
    console.warn('html2pdf generation error, falling back to browser print:', error);
    window.print();
  } finally {
    document.body.classList.remove('exporting-pdf');
  }
};


