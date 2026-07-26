// @ts-ignore
import html2pdfModule from 'html2pdf.js/dist/html2pdf.bundle.min.js';

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

export const exportToPDF = async (elementId: string = 'cv-canvas', filename: string = 'resume.pdf'): Promise<string | null> => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found`);
    window.print();
    return null;
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

      // Generate Data URI of the PDF
      const pdfDataUri = await html2pdf().set(opt).from(element).output('datauristring');

      // Attempt to save file directly to disk
      try {
        await html2pdf().set(opt).from(element).save();
      } catch (saveError) {
        console.warn('Standard save failed, fallback to anchor tag download', saveError);
        const link = document.createElement('a');
        link.href = pdfDataUri;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      return pdfDataUri;
    } else {
      console.warn('html2pdf function not available, triggering browser print dialog');
      window.print();
      return null;
    }
  } catch (error) {
    console.warn('html2pdf generation error, falling back to browser print:', error);
    window.print();
    return null;
  } finally {
    document.body.classList.remove('exporting-pdf');
  }
};


