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

const imageToBase64 = (url: string): Promise<string> => {
  return new Promise((resolve) => {
    // If it's already a Data URI, return it immediately
    if (url.startsWith('data:')) {
      resolve(url);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL('image/png');
          resolve(dataURL);
        } else {
          resolve(url);
        }
      } catch (err) {
        console.warn('Canvas conversion failed for image:', url, err);
        resolve(url);
      }
    };
    img.onerror = () => {
      // Return a transparent 1x1 GIF so it fails gracefully and doesn't crash
      resolve('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
    };
    // Add cache buster to bypass cached image without CORS headers
    img.src = url + (url.indexOf('?') > -1 ? '&' : '?') + 't_pdf=' + new Date().getTime();
  });
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

  // We create a deep clone of the element, position it offscreen, convert all its images
  // to base64, and then render it. This is extremely robust against CORS issues and layout shifts.
  const clone = element.cloneNode(true) as HTMLElement;
  clone.id = `${elementId}-pdf-clone`;
  
  // Render cloned element offscreen but still within the DOM so styles apply correctly
  clone.style.position = 'absolute';
  clone.style.left = '-9999px';
  clone.style.top = '-9999px';
  clone.style.width = `${element.offsetWidth}px`;
  
  document.body.appendChild(clone);

  try {
    const html2pdf = await getHtml2Pdf();
    if (html2pdf) {
      // Find all image elements in the clone and pre-convert them to Base64
      const images = clone.getElementsByTagName('img');
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const src = img.src;
        if (src) {
          const base64 = await imageToBase64(src);
          img.src = base64;
          // Ensure it has CORS settings if needed or none if it's already a Data URI
          if (base64.startsWith('data:')) {
            img.removeAttribute('crossorigin');
          }
        }
      }

      const opt = {
        margin: [8, 8, 8, 8],
        filename: filename,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          scrollY: 0,
          scrollX: 0
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as 'portrait' | 'landscape' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      // Generate Data URI from the fully-prepared clone
      const pdfDataUri = await html2pdf().set(opt).from(clone).output('datauristring');

      // Trigger standard and highly reliable file download via anchor click
      const link = document.createElement('a');
      link.href = pdfDataUri;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

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
    // Clean up clone from the DOM
    if (clone.parentNode) {
      clone.parentNode.removeChild(clone);
    }
    document.body.classList.remove('exporting-pdf');
  }
};


