import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CVData, CVTheme, TemplateId } from '../types/cv';
import { useLanguage } from '../i18n/LanguageContext';

export interface CVContextType {
  data: CVData;
  setData: React.Dispatch<React.SetStateAction<CVData>>;
  loadLanguagePreset: (lang: string) => void;
  updateTheme: (newTheme: Partial<CVTheme>) => void;
}

const CVContext = createContext<CVContextType | undefined>(undefined);

export const defaultTheme: CVTheme = {
  templateId: 'moderne',
  primaryColor: '#2563eb',
  fontFamily: 'sans',
  spacingDensity: 'normal'
};

export const sampleCVsByLanguage: Record<string, CVData> = {
  fr: {
    theme: defaultTheme,
    sections: [
      {
        id: 'header-1',
        type: 'header',
        content: {
          fullName: 'Alexandre Dupont',
          title: 'Développeur Fullstack Senior / Lead Tech',
          email: 'alexandre.dupont@email.com',
          phone: '+33 6 12 34 56 78',
          location: 'Paris, France',
          website: 'alexdupont.dev',
          summary: 'Développeur passionné avec 6+ ans d\'expérience dans la conception d\'applications web à fort trafic. Spécialisé en React, Node.js, TypeScript et architectures Cloud.'
        },
        style: {}
      },
      {
        id: 'exp-1',
        type: 'experience',
        content: {
          title: 'Expériences Professionnelles',
          items: [
            {
              role: 'Senior Fullstack Engineer',
              company: 'TechScale Inc.',
              period: '2023 - Présent',
              location: 'Paris',
              description: 'Lead technique sur l\'application SaaS principale. Amélioration du temps de chargement de 40% et migration de l\'infrastructure vers GCP.'
            },
            {
              role: 'Développeur Web Fullstack',
              company: 'Creative Studio',
              period: '2020 - 2023',
              location: 'Lyon',
              description: 'Développement de plus de 15 applications web sur mesure. Intégration de paiements Stripe et gestion de bases de données distribuées.'
            }
          ]
        },
        style: {}
      },
      {
        id: 'edu-1',
        type: 'education',
        content: {
          title: 'Formation & Diplômes',
          items: [
            {
              degree: 'Master en Ingénierie Logicielle',
              school: 'Grande École d\'Informatique (EPITA)',
              period: '2015 - 2020',
              location: 'Paris'
            }
          ]
        },
        style: {}
      },
      {
        id: 'skills-1',
        type: 'skills',
        content: {
          title: 'Compétences & Technologies',
          skillsList: ['TypeScript', 'React / Next.js', 'Node.js / Express', 'Tailwind CSS', 'PostgreSQL / Firestore', 'Docker & GCP', 'CI/CD & Git']
        },
        style: {}
      }
    ]
  },
  en: {
    theme: defaultTheme,
    sections: [
      {
        id: 'header-1',
        type: 'header',
        content: {
          fullName: 'Alexander Miller',
          title: 'Senior Fullstack Engineer / Tech Lead',
          email: 'alex.miller@email.com',
          phone: '+1 (555) 019-2834',
          location: 'San Francisco, CA',
          website: 'alexmiller.dev',
          summary: 'Passionate Senior Engineer with 6+ years of expertise in building high-throughput web applications. Expert in React, Node.js, TypeScript, and modern Cloud Infrastructure.'
        },
        style: {}
      },
      {
        id: 'exp-1',
        type: 'experience',
        content: {
          title: 'Work Experience',
          items: [
            {
              role: 'Senior Fullstack Engineer',
              company: 'TechScale Inc.',
              period: '2023 - Present',
              location: 'San Francisco, CA',
              description: 'Tech lead for flagship SaaS product. Boosted page speed by 40% and successfully migrated core architecture to Google Cloud Platform.'
            },
            {
              role: 'Fullstack Web Developer',
              company: 'Creative Studio',
              period: '2020 - 2023',
              location: 'Austin, TX',
              description: 'Engineered 15+ custom web applications. Integrated Stripe payment gateways and managed distributed databases.'
            }
          ]
        },
        style: {}
      },
      {
        id: 'edu-1',
        type: 'education',
        content: {
          title: 'Education',
          items: [
            {
              degree: 'M.S. in Computer Software Engineering',
              school: 'Stanford University',
              period: '2015 - 2020',
              location: 'Stanford, CA'
            }
          ]
        },
        style: {}
      },
      {
        id: 'skills-1',
        type: 'skills',
        content: {
          title: 'Skills & Tech Stack',
          skillsList: ['TypeScript', 'React / Next.js', 'Node.js / Express', 'Tailwind CSS', 'PostgreSQL / Firestore', 'Docker & GCP', 'CI/CD & Git']
        },
        style: {}
      }
    ]
  },
  es: {
    theme: defaultTheme,
    sections: [
      {
        id: 'header-1',
        type: 'header',
        content: {
          fullName: 'Alejandro Gómez',
          title: 'Desarrollador Senior Fullstack / Líder Técnico',
          email: 'alejandro.gomez@email.com',
          phone: '+34 612 345 678',
          location: 'Madrid, España',
          website: 'alegomez.dev',
          summary: 'Desarrollador apasionado con más de 6 años de experiencia en aplicaciones web de alto tráfico. Especializado en React, Node.js, TypeScript y arquitecturas Cloud.'
        },
        style: {}
      },
      {
        id: 'exp-1',
        type: 'experience',
        content: {
          title: 'Experiencia Profesional',
          items: [
            {
              role: 'Ingeniero Fullstack Senior',
              company: 'TechScale Inc.',
              period: '2023 - Presente',
              location: 'Madrid',
              description: 'Líder técnico en la plataforma SaaS principal. Optimización del tiempo de carga en un 40% y migración de infraestructura a GCP.'
            },
            {
              role: 'Desarrollador Web Fullstack',
              company: 'Creative Studio',
              period: '2020 - 2023',
              location: 'Barcelona',
              description: 'Desarrollo de más de 15 aplicaciones web personalizadas con integración de pagos Stripe y bases de datos distribuidas.'
            }
          ]
        },
        style: {}
      },
      {
        id: 'edu-1',
        type: 'education',
        content: {
          title: 'Educación y Títulos',
          items: [
            {
              degree: 'Máster en Ingeniería de Software',
              school: 'Universidad Politécnica de Madrid',
              period: '2015 - 2020',
              location: 'Madrid'
            }
          ]
        },
        style: {}
      },
      {
        id: 'skills-1',
        type: 'skills',
        content: {
          title: 'Habilidades y Tecnologías',
          skillsList: ['TypeScript', 'React / Next.js', 'Node.js / Express', 'Tailwind CSS', 'PostgreSQL / Firestore', 'Docker & GCP', 'CI/CD & Git']
        },
        style: {}
      }
    ]
  },
  de: {
    theme: defaultTheme,
    sections: [
      {
        id: 'header-1',
        type: 'header',
        content: {
          fullName: 'Alexander Schneider',
          title: 'Senior Fullstack Entwickler / Tech Lead',
          email: 'alex.schneider@email.de',
          phone: '+49 30 12345678',
          location: 'Berlin, Deutschland',
          website: 'alexschneider.dev',
          summary: 'Leidenschaftlicher Entwickler mit 6+ Jahren Erfahrung in der Erstellung skalierbarer Webanwendungen. Spezialisiert auf React, Node.js, TypeScript und Cloud-Architekturen.'
        },
        style: {}
      },
      {
        id: 'exp-1',
        type: 'experience',
        content: {
          title: 'Berufserfahrung',
          items: [
            {
              role: 'Senior Fullstack Engineer',
              company: 'TechScale Inc.',
              period: '2023 - Heute',
              location: 'Berlin',
              description: 'Technischer Leiter für die Haupt-SaaS-Anwendung. Steigerung der Ladegeschwindigkeit um 40% und Migration der Infrastruktur zu GCP.'
            },
            {
              role: 'Fullstack Webentwickler',
              company: 'Creative Studio',
              period: '2020 - 2023',
              location: 'München',
              description: 'Entwicklung von über 15 maßgeschneiderten Webanwendungen mit Stripe-Zahlungsintegration und verteilten Datenbanken.'
            }
          ]
        },
        style: {}
      },
      {
        id: 'edu-1',
        type: 'education',
        content: {
          title: 'Ausbildung & Studium',
          items: [
            {
              degree: 'Master in Software Engineering',
              school: 'Technische Universität Berlin',
              period: '2015 - 2020',
              location: 'Berlin'
            }
          ]
        },
        style: {}
      },
      {
        id: 'skills-1',
        type: 'skills',
        content: {
          title: 'Kenntnisse & Technologien',
          skillsList: ['TypeScript', 'React / Next.js', 'Node.js / Express', 'Tailwind CSS', 'PostgreSQL / Firestore', 'Docker & GCP', 'CI/CD & Git']
        },
        style: {}
      }
    ]
  }
};

export const CVDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchParams] = useSearchParams();
  const { language, setLanguage } = useLanguage();

  const [data, setData] = useState<CVData>(() => {
    // Read URL parameters
    const urlTemplate = searchParams.get('template') as TemplateId | null;
    const urlColor = searchParams.get('color');
    const urlLang = searchParams.get('lang');

    const initialLang = (urlLang && ['fr', 'en', 'es', 'de'].includes(urlLang))
      ? urlLang
      : (localStorage.getItem('cvcraft_lang') || 'fr');

    const saved = localStorage.getItem('cv-data-v3');
    let baseData = sampleCVsByLanguage[initialLang] || sampleCVsByLanguage.fr;

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.sections && parsed.sections.length > 0) {
          baseData = {
            ...parsed,
            theme: { ...defaultTheme, ...parsed.theme }
          };
        }
      } catch (e) {
        console.error('Error loading saved CV:', e);
      }
    }

    // Always override theme if template or color are passed via URL query parameters
    if (urlTemplate || urlColor) {
      baseData = {
        ...baseData,
        theme: {
          ...(baseData.theme || defaultTheme),
          ...(urlTemplate ? { templateId: urlTemplate } : {}),
          ...(urlColor ? { primaryColor: decodeURIComponent(urlColor) } : {})
        }
      };
    }

    return baseData;
  });

  // Handle URL query parameter changes dynamically (e.g. user navigating from catalog)
  useEffect(() => {
    const urlTemplate = searchParams.get('template') as TemplateId | null;
    const urlColor = searchParams.get('color');
    const urlLang = searchParams.get('lang');

    if (urlLang && ['fr', 'en', 'es', 'de'].includes(urlLang) && urlLang !== language) {
      setLanguage(urlLang as any);
      const preset = sampleCVsByLanguage[urlLang];
      if (preset) {
        setData(prev => ({
          ...preset,
          theme: {
            ...(preset.theme || defaultTheme),
            ...(prev.theme || defaultTheme),
            ...(urlTemplate ? { templateId: urlTemplate } : {}),
            ...(urlColor ? { primaryColor: decodeURIComponent(urlColor) } : {})
          }
        }));
      }
    } else if (urlTemplate || urlColor) {
      setData(prev => ({
        ...prev,
        theme: {
          ...(prev.theme || defaultTheme),
          ...(urlTemplate ? { templateId: urlTemplate } : {}),
          ...(urlColor ? { primaryColor: decodeURIComponent(urlColor) } : {})
        }
      }));
    }
  }, [searchParams]);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('cv-data-v3', JSON.stringify(data));
  }, [data]);

  // Automatically sync CV content data when application language changes
  useEffect(() => {
    if (language && sampleCVsByLanguage[language]) {
      const preset = sampleCVsByLanguage[language];
      setData((prev) => {
        // Find if current experience section title matches the target language preset
        const currentExpTitle = prev.sections.find((s) => s.type === 'experience')?.content?.title;
        const targetExpTitle = preset.sections.find((s) => s.type === 'experience')?.content?.title;

        if (currentExpTitle === targetExpTitle) {
          return prev;
        }

        // Keep current custom theme (template, primaryColor, font, density)
        return {
          ...preset,
          theme: {
            ...(preset.theme || defaultTheme),
            ...(prev.theme || defaultTheme),
          },
        };
      });
    }
  }, [language]);

  const loadLanguagePreset = (lang: string) => {
    const preset = sampleCVsByLanguage[lang] || sampleCVsByLanguage.en;
    setData(prev => ({
      ...preset,
      theme: prev.theme || defaultTheme
    }));
    setLanguage(lang as any);
  };

  const updateTheme = (newTheme: Partial<CVTheme>) => {
    setData(prev => ({
      ...prev,
      theme: {
        ...(prev.theme || defaultTheme),
        ...newTheme
      }
    }));
  };

  return (
    <CVContext.Provider value={{ data, setData, loadLanguagePreset, updateTheme }}>
      {children}
    </CVContext.Provider>
  );
};

export const useCVData = (): CVContextType => {
  const context = useContext(CVContext);
  if (!context) {
    throw new Error('useCVData must be used within a CVDataProvider');
  }
  return context;
};


