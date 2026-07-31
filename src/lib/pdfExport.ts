// @ts-ignore
import html2pdfModule from 'html2pdf.js';

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

export interface ExportPDFResult {
  blobUrl: string;
  dataUri: string;
}

const blobToDataURI = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Converts oklab to rgb/rgba
const oklabToRgb = (L: number, a: number, b: number, alpha: number = 1): string => {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  let r_lin = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  let g_lin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  let b_lin = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  const f = (x: number) => (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);

  const r_val = Math.round(Math.max(0, Math.min(1, f(r_lin))) * 255);
  const g_val = Math.round(Math.max(0, Math.min(1, f(g_lin))) * 255);
  const b_val = Math.round(Math.max(0, Math.min(1, f(b_lin))) * 255);

  return alpha === 1 ? `rgb(${r_val}, ${g_val}, ${b_val})` : `rgba(${r_val}, ${g_val}, ${b_val}, ${alpha})`;
};

// Converts oklch to rgb/rgba
const oklchToRgb = (l: number, c: number, h: number, a: number = 1): string => {
  const hueRad = (h * Math.PI) / 180;
  const a_lab = c * Math.cos(hueRad);
  const b_lab = c * Math.sin(hueRad);
  return oklabToRgb(l, a_lab, b_lab, a);
};

// Regex-based converter for parsing and replacing oklch() / oklab() in cssText
const replaceOklchAndOklabInCss = (cssText: string): string => {
  return cssText.replace(/okl(ch|ab)\(([^)]+)\)/g, (match, type, coords) => {
    try {
      const parts = coords.split('/');
      const colorPartsStr = parts[0].trim();
      const alphaStr = parts[1] ? parts[1].trim() : null;

      const colorParts = colorPartsStr.split(/[\s,]+/).filter(Boolean);
      if (colorParts.length < 3) return match;

      const v1 = colorParts[0];
      const v2 = colorParts[1];
      const v3 = colorParts[2];

      const parseVal = (valStr: string, isPercent: boolean) => {
        if (valStr.endsWith('%')) {
          return parseFloat(valStr) / 100;
        }
        const val = parseFloat(valStr);
        return isPercent ? val / 100 : val;
      };

      const L = parseVal(v1, v1.endsWith('%'));
      const val2 = parseFloat(v2);
      const val3 = parseFloat(v3);

      let alpha = 1;
      if (alphaStr) {
        if (alphaStr.endsWith('%')) {
          alpha = parseFloat(alphaStr) / 100;
        } else {
          alpha = parseFloat(alphaStr);
        }
      }

      if (isNaN(L) || isNaN(val2) || isNaN(val3)) return match;

      if (type === 'ch') {
        return oklchToRgb(L, val2, val3, alpha);
      } else {
        return oklabToRgb(L, val2, val3, alpha);
      }
    } catch (e) {
      console.error('Error converting oklch/oklab to RGB:', e);
      return 'rgb(120, 120, 120)';
    }
  });
};

// Scans and sanitizes all stylesheets, replacing oklch/oklab dynamically
const sanitizeStylesheets = async (): Promise<() => void> => {
  const styleElements = Array.from(document.querySelectorAll('style'));
  const linkElements = Array.from(document.querySelectorAll('link[rel="stylesheet"]')) as HTMLLinkElement[];
  const restoredElements: Array<{ element: HTMLElement; originalContent?: string; wasDisabled?: boolean }> = [];

  // Sanitizing inline style tags
  for (const styleEl of styleElements) {
    const content = styleEl.textContent;
    if (content && (content.includes('oklch') || content.includes('oklab'))) {
      restoredElements.push({ element: styleEl, originalContent: content });
      styleEl.textContent = replaceOklchAndOklabInCss(content);
    }
  }

  // Sanitizing same-origin stylesheet links on-the-fly
  for (const linkEl of linkElements) {
    try {
      const href = linkEl.href;
      if (href && (href.startsWith(window.location.origin) || !href.startsWith('http'))) {
        let hasOkl = false;
        try {
          const rules = linkEl.sheet?.cssRules;
          if (rules) {
            for (let i = 0; i < rules.length; i++) {
              const text = rules[i].cssText;
              if (text.includes('oklch') || text.includes('oklab')) {
                hasOkl = true;
                break;
              }
            }
          }
        } catch (e) {
          hasOkl = true;
        }

        if (hasOkl) {
          const response = await fetch(href);
          if (response.ok) {
            const rawCss = await response.text();
            const cleanCss = replaceOklchAndOklabInCss(rawCss);

            const tempStyle = document.createElement('style');
            tempStyle.id = 'temp-sanitized-style';
            tempStyle.textContent = cleanCss;
            document.head.appendChild(tempStyle);

            linkEl.disabled = true;

            restoredElements.push({ element: linkEl, wasDisabled: false });
            restoredElements.push({ element: tempStyle });
          }
        }
      }
    } catch (err) {
      console.warn('Failed to sanitize stylesheet link:', linkEl.href, err);
    }
  }

  return () => {
    for (const item of restoredElements) {
      if (item.element.id === 'temp-sanitized-style') {
        item.element.parentNode?.removeChild(item.element);
      } else if (item.element instanceof HTMLStyleElement && item.originalContent !== undefined) {
        item.element.textContent = item.originalContent;
      } else if (item.element instanceof HTMLLinkElement && item.wasDisabled === false) {
        item.element.disabled = false;
      }
    }
  };
};

export const exportToPDF = async (
  elementId: string = 'cv-canvas',
  filename: string = 'resume.pdf',
  options: ExportPDFOptions = {}
): Promise<ExportPDFResult | null> => {
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

  let restoreStyles: (() => void) | null = null;
  const originalGetComputedStyle = window.getComputedStyle;
  const originalDefaultViewGetComputedStyle = document.defaultView?.getComputedStyle;

  try {
    // Override window.getComputedStyle to intercept oklch/oklab styles queried by html2canvas
    window.getComputedStyle = function (elt, pseudoElt) {
      const style = originalGetComputedStyle(elt, pseudoElt);
      return new Proxy(style, {
        get(target, prop, receiver) {
          const value = Reflect.get(target, prop, receiver);
          if (typeof value === 'string' && (value.includes('oklch') || value.includes('oklab'))) {
            return replaceOklchAndOklabInCss(value);
          }
          if (typeof value === 'function') {
            if (prop === 'getPropertyValue') {
              return function (propertyName: string) {
                const val = target.getPropertyValue(propertyName);
                if (typeof val === 'string' && (val.includes('oklch') || val.includes('oklab'))) {
                  return replaceOklchAndOklabInCss(val);
                }
                return val;
              };
            }
            return value.bind(target);
          }
          return value;
        }
      });
    };

    if (document.defaultView) {
      document.defaultView.getComputedStyle = window.getComputedStyle;
    }

    updateProgress(30, language === 'fr' ? 'Nettoyage des styles modernes (CORS/Color OKLCH)...' : 'Cleaning modern CSS styles...');
    restoreStyles = await sanitizeStylesheets();

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
    const pdfBlob = await html2pdf().set(opt).from(clone).output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);

    // standard and highly reliable file download via anchor click using blobUrl
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Convert to data URI for persistent history storage
    const dataUri = await blobToDataURI(pdfBlob);

    updateProgress(100, language === 'fr' ? 'Terminé !' : 'Success !');
    return { blobUrl, dataUri };
  } catch (err: any) {
    console.error('Advanced PDF generation failed:', err);
    updateProgress(100, language === 'fr' ? 'Erreur, impression par défaut...' : 'Error, printing...');
    // Fallback to standard window print
    window.print();
    return null;
  } finally {
    window.getComputedStyle = originalGetComputedStyle;
    if (document.defaultView && originalDefaultViewGetComputedStyle) {
      document.defaultView.getComputedStyle = originalDefaultViewGetComputedStyle;
    }

    if (restoreStyles) {
      try {
        restoreStyles();
      } catch (e) {
        console.warn('Failed to restore original styles:', e);
      }
    }
    // Clean up clone from the DOM
    if (clone.parentNode) {
      clone.parentNode.removeChild(clone);
    }
  }
};
