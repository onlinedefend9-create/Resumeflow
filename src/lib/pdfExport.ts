// @ts-ignore
import html2pdfModule from 'html2pdf.js/dist/html2pdf.bundle.min.js';

export interface ExportPDFOptions {
  format?: 'a4' | 'letter';
  dpi?: 'high' | 'standard' | 'low';
  compress?: boolean;
  watermark?: {
    enabled: boolean;
    text: string;
    type: 'diagonal' | 'footer';
    color?: string;
    opacity?: number;
  };
  language?: string;
  theme?: {
    accentColor?: string;
    fontFamily?: string;
  };
  onProgress?: (progress: number, stepName: string) => void;
}

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
  
  // Try loading from CDN dynamically as robust fallback for PWA/offline resiliency
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

// Optimizes and converts any image URL (including CORS ones) to Base64
const optimizeImageToBase64 = (url: string, compress: boolean = true): Promise<string> => {
  return new Promise((resolve) => {
    if (url.startsWith('data:')) {
      resolve(url);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        // Standard max resolution for CV photos (keep size reasonable to optimize memory & file size)
        const maxDim = compress ? 600 : 1200;
        let width = img.naturalWidth;
        let height = img.naturalHeight;
        
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Compress using JPEG with custom quality factor for ultra optimized payload
          const formatType = compress ? 'image/jpeg' : 'image/png';
          const quality = compress ? 0.82 : 1.0;
          const dataURL = canvas.toDataURL(formatType, quality);
          resolve(dataURL);
        } else {
          resolve(url);
        }
      } catch (err) {
        console.warn('Canvas optimization failed for image:', url, err);
        resolve(url);
      }
    };
    img.onerror = () => {
      // Return beautiful default fallback or standard placeholder
      resolve('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
    };
    // Cache buster for offline/CORS robustness
    img.src = url + (url.indexOf('?') > -1 ? '&' : '?') + 't_pdf=' + new Date().getTime();
  });
};

// Process SVGs inside element clone to prevent invisible icons in HTML5 canvas rendering
const fixSVGElementIcons = (root: HTMLElement) => {
  const svgs = root.querySelectorAll('svg');
  svgs.forEach((svg) => {
    const computed = window.getComputedStyle(svg);
    const width = svg.getAttribute('width') || computed.width || '16';
    const height = svg.getAttribute('height') || computed.height || '16';
    const strokeColor = svg.getAttribute('stroke') || computed.stroke || computed.color || '#4f46e5';
    const fillColor = svg.getAttribute('fill') || computed.fill || 'none';
    
    // Explicitly inline properties to override external stylesheets that html2canvas might ignore
    svg.setAttribute('width', width.replace('px', ''));
    svg.setAttribute('height', height.replace('px', ''));
    
    if (strokeColor && strokeColor !== 'none') {
      svg.setAttribute('stroke', strokeColor);
    }
    if (fillColor) {
      svg.setAttribute('fill', fillColor === 'currentColor' ? strokeColor : fillColor);
    }
    
    // Process Lucide-specific child paths
    const paths = svg.querySelectorAll('path, circle, rect, line, polyline, polygon');
    paths.forEach((path) => {
      const pathComputed = window.getComputedStyle(path);
      const pathStroke = path.getAttribute('stroke') || pathComputed.stroke;
      if (pathStroke && pathStroke !== 'none') {
        path.setAttribute('stroke', pathStroke === 'currentColor' ? strokeColor : pathStroke);
      }
    });
  });
};

// Ensure Google Fonts are explicitly injected into the print/export context
const injectGoogleFonts = (root: HTMLElement) => {
  // Grab Google Fonts link from the parent document
  const fontsLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
  fontsLinks.forEach((link) => {
    const clonedLink = link.cloneNode(true) as HTMLLinkElement;
    root.appendChild(clonedLink);
  });

  // Inject a custom inline style for safe font-family assignment fallback
  const fontStyle = document.createElement('style');
  fontStyle.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap');
    * {
      font-family: 'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, sans-serif !important;
    }
  `;
  root.appendChild(fontStyle);
};

// Insert beautiful optional watermark
const insertWatermark = (root: HTMLElement, watermark: ExportPDFOptions['watermark']) => {
  if (!watermark || !watermark.enabled) return;

  const text = watermark.text || 'Généré par ResumeFlow';
  const color = watermark.color || '#4f46e5';
  const opacity = watermark.opacity !== undefined ? watermark.opacity : 0.08;

  if (watermark.type === 'diagonal') {
    const div = document.createElement('div');
    div.className = 'absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none z-0';
    div.style.position = 'absolute';
    div.style.left = '0';
    div.style.top = '0';
    div.style.width = '100%';
    div.style.height = '100%';
    
    const span = document.createElement('span');
    span.innerText = text;
    span.style.transform = 'rotate(-35deg)';
    span.style.fontSize = '4.5rem';
    span.style.fontWeight = '900';
    span.style.color = color;
    span.style.opacity = opacity.toString();
    span.style.letterSpacing = '0.2em';
    span.style.textTransform = 'uppercase';
    span.style.whiteSpace = 'nowrap';
    
    div.appendChild(span);
    root.insertBefore(div, root.firstChild);
  } else if (watermark.type === 'footer') {
    const footer = document.createElement('div');
    footer.className = 'w-full text-center py-2 text-[9px] text-zinc-400 font-bold tracking-wider uppercase border-t border-zinc-100 select-none';
    footer.style.marginTop = 'auto';
    footer.style.paddingTop = '10px';
    footer.style.opacity = '0.7';
    footer.innerText = text;
    root.appendChild(footer);
  }
};

export const exportToPDF = async (
  elementId: string = 'cv-canvas',
  filename: string = 'resume.pdf',
  options: ExportPDFOptions = {}
): Promise<string | null> => {
  const {
    format = 'a4',
    dpi = 'high',
    compress = true,
    watermark,
    language = 'fr',
    theme,
    onProgress
  } = options;

  const updateProgress = (progress: number, stepName: string) => {
    if (onProgress) {
      onProgress(progress, stepName);
    }
  };

  updateProgress(10, language === 'fr' ? 'Initialisation de l\'export...' : 'Initializing export...');

  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found`);
    updateProgress(100, 'Erreur de ciblage');
    window.print();
    return null;
  }

  // Create clean clone to make updates safely off-screen
  updateProgress(20, language === 'fr' ? 'Clonage du document...' : 'Cloning document...');
  const clone = element.cloneNode(true) as HTMLElement;
  clone.id = `${elementId}-pdf-cloned`;

  // Apply absolute layout overrides for pristine output styling
  clone.style.position = 'absolute';
  clone.style.left = '-9999px';
  clone.style.top = '-9999px';
  clone.style.transform = 'none';
  clone.style.width = format === 'a4' ? '210mm' : '8.5in';
  clone.style.boxShadow = 'none';
  clone.style.border = 'none';
  clone.style.background = 'white';
  clone.style.color = '#0a0a0a';
  
  document.body.appendChild(clone);

  try {
    updateProgress(35, language === 'fr' ? 'Configuration des polices...' : 'Configuring fonts...');
    injectGoogleFonts(clone);
    await document.fonts.ready;

    updateProgress(50, language === 'fr' ? 'Optimisation des icônes SVG...' : 'Optimizing SVG icons...');
    fixSVGElementIcons(clone);

    updateProgress(65, language === 'fr' ? 'Conversion et compression des images...' : 'Converting & compressing images...');
    const images = clone.getElementsByTagName('img');
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      if (img.src) {
        const base64 = await optimizeImageToBase64(img.src, compress);
        img.src = base64;
        img.removeAttribute('crossorigin');
      }
    }

    if (watermark && watermark.enabled) {
      updateProgress(75, language === 'fr' ? 'Incrustation du filigrane...' : 'Adding watermark...');
      insertWatermark(clone, watermark);
    }

    updateProgress(85, language === 'fr' ? 'Génération du moteur PDF...' : 'Spawning PDF engine...');
    const html2pdf = await getHtml2Pdf();
    if (!html2pdf) {
      throw new Error('PDF Engine (html2pdf) could not be loaded.');
    }

    // Set resolution scale based on chosen DPI
    let scale = 2; // Standard 150 DPI
    if (dpi === 'high') scale = 3;  // High 300 DPI (crisp)
    if (dpi === 'low') scale = 1.2; // Optimized for minimal size

    // Configure perfect PDF parameters
    const opt = {
      margin: format === 'a4' ? [8, 8, 8, 8] : [6, 6, 6, 6],
      filename: filename,
      image: { type: 'jpeg', quality: compress ? 0.85 : 0.98 },
      html2canvas: {
        scale: scale,
        useCORS: true,
        allowTaint: true,
        logging: false,
        letterRendering: true,
        scrollY: 0,
        scrollX: 0
      },
      jsPDF: { 
        unit: 'mm', 
        format: format, 
        orientation: 'portrait'
      },
      pagebreak: { 
        mode: ['avoid-all', 'css', 'legacy'],
        avoid: ['.sortable-section', 'h2', 'h3', '.section-item']
      }
    };

    updateProgress(95, language === 'fr' ? 'Finalisation du fichier...' : 'Assembling PDF elements...');
    const pdfDataUri = await html2pdf().set(opt).from(clone).output('datauristring');

    // standard and highly reliable file download via anchor click
    const link = document.createElement('a');
    link.href = pdfDataUri;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    updateProgress(100, language === 'fr' ? 'Terminé !' : 'Success !');
    return pdfDataUri;
  } catch (err: any) {
    console.error('Advanced PDF generation failed:', err);
    updateProgress(100, language === 'fr' ? 'Erreur, impression par défaut...' : 'Error, printing...');
    // Fallback to standard window print
    window.print();
    return null;
  } finally {
    // Clean up clone from the DOM
    if (clone.parentNode) {
      clone.parentNode.removeChild(clone);
    }
  }
};
