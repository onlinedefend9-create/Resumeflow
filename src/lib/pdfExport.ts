// @ts-ignore
import html2pdfModule from 'html2pdf.js/dist/html2pdf.bundle.min.js';

const loadHtml2PdfFromCDN = (): Promise<any> => {
  return new Promise((resolve) => {
    if (typeof (window as any).html2pdf === 'function') {
      resolve((window as any).html2pdf);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.integrity = 'sha512-GsLlZN/3F2ErC5xWfZUsfRJ3IpPxLiRI17RsRCky6QN3XPax55XSguocJHli0qTo3T/RJgGN3yIaGXQR8YXMgg==';
    script.crossOrigin = 'anonymous';
    script.onload = () => {
      resolve((window as any).html2pdf || null);
    };
    script.onerror = () => {
      resolve(null);
    };
    document.head.appendChild(script);
  });
};

const getHtml2Pdf = async () => {
  if (typeof html2pdfModule === 'function') {
    return html2pdfModule;
  }
  if ((html2pdfModule as any)?.default && typeof (html2pdfModule as any).default === 'function') {
    return (html2pdfModule as any).default;
  }
  if (typeof (window as any).html2pdf === 'function') {
    return (window as any).html2pdf;
  }
  
  // Try loading from CDN dynamically as robust fallback
  try {
    const cdnModule = await loadHtml2PdfFromCDN();
    if (cdnModule) {
      return cdnModule;
    }
  } catch (e) {
    console.warn('Could not load html2pdf from CDN:', e);
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
    const html2pdf = await getHtml2Pdf();
    if (html2pdf) {
      const opt = {
        margin: [8, 8, 8, 8],
        filename: filename,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          scrollY: 0,
          scrollX: 0
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as 'portrait' | 'landscape' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
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


