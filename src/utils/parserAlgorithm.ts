/**
 * Algorithme local d'analyse et de structuration sémantique de CV (Offline Parser)
 * Permet de s'affranchir d'un serveur d'API externe pour un déploiement Vercel 100% autonome.
 */

export interface StructuredCVData {
  header: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    summary: string;
  };
  experience: Array<{
    role: string;
    company: string;
    period: string;
    location: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    school: string;
    period: string;
    location: string;
  }>;
  skills: string[];
}

export function parseCVTextClientSide(text: string): StructuredCVData {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const result: StructuredCVData = {
    header: {
      fullName: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      summary: '',
    },
    experience: [],
    education: [],
    skills: [],
  };

  if (lines.length === 0) return result;

  // 1. Expressions régulières pour les métadonnées de contact
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i;
  const phoneRegex = /(?:\+?\d{1,4}[-.\s]?)?\(?\d{1,4}\)?(?:[-.\s]?\d{2,4}){2,5}/;
  const urlRegex = /(?:https?:\/\/)?(?:www\.)?(?:linkedin\.com|github\.com|twitter\.com|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\/[a-zA-Z0-9_.-]*/i;
  const genericUrlRegex = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,20}\b/i;

  // Analyse initiale de chaque ligne pour extraire les éléments de contact uniques
  for (const line of lines) {
    if (!result.header.email) {
      const emailMatch = line.match(emailRegex);
      if (emailMatch) result.header.email = emailMatch[0];
    }
    if (!result.header.phone) {
      const phoneMatch = line.match(phoneRegex);
      if (phoneMatch && phoneMatch[0].replace(/[^\d]/g, '').length >= 8) {
        result.header.phone = phoneMatch[0].trim();
      }
    }
    if (!result.header.website) {
      const urlMatch = line.match(urlRegex) || line.match(genericUrlRegex);
      if (urlMatch && !urlMatch[0].includes('@')) {
        result.header.website = urlMatch[0].trim();
      }
    }
  }

  // 2. Détection de structures pour segmenter le CV par rubrique
  let currentSection = 'header';
  const sections: { [key: string]: string[] } = {
    header: [],
    experience: [],
    education: [],
    skills: [],
  };

  const experienceKeywords = [
    'experience', 'expérience', 'parcours', 'emploi', 'work', 'career', 'poste', 'professionnelle', 'historique', 'professionnel'
  ];
  const educationKeywords = [
    'formation', 'education', 'étude', 'etude', 'diplôme', 'diplome', 'cursus', 'universite', 'université', 'école', 'ecole', 'school', 'academy'
  ];
  const skillsKeywords = [
    'compétence', 'competence', 'skill', 'technologie', 'outils', 'connaissance', 'expertise', 'langue', 'languages', 'technique'
  ];
  const summaryKeywords = [
    'résumé', 'resume', 'profil', 'objectifs', 'summary', 'introduction', 'à propos', 'about', 'apropos'
  ];

  for (const line of lines) {
    const lowerLine = line.toLowerCase();

    // Nettoyer la ponctuation de début pour les en-têtes (ex: "## EXPÉRIENCE" ou "1. EXPÉRIENCES")
    const cleanHeaderCandidate = lowerLine.replace(/^[#\d.\s•*\-]+|[#\s•*\-]+$/g, '').trim();

    let isSectionHeader = false;

    const matchesKeyword = (keywords: string[]) => {
      return keywords.some((k) => {
        const regex = new RegExp(`^${k}s?$|^${k}s?\\b|\\b${k}s?$`, 'i');
        return regex.test(cleanHeaderCandidate);
      });
    };

    if (matchesKeyword(experienceKeywords) && line.length < 50) {
      currentSection = 'experience';
      isSectionHeader = true;
    } else if (matchesKeyword(educationKeywords) && line.length < 50) {
      currentSection = 'education';
      isSectionHeader = true;
    } else if (matchesKeyword(skillsKeywords) && line.length < 50) {
      currentSection = 'skills';
      isSectionHeader = true;
    } else if (matchesKeyword(summaryKeywords) && line.length < 50) {
      currentSection = 'summary';
      isSectionHeader = true;
    }

    if (!isSectionHeader) {
      if (currentSection === 'summary') {
        sections['header'].push(line);
      } else {
        sections[currentSection].push(line);
      }
    }
  }

  // 3. Traitement de la section En-tête (Header)
  const headerLines = sections['header'].filter((l) => {
    const hasEmail = emailRegex.test(l);
    const hasPhone = phoneRegex.test(l);
    const isOnlyContact = (hasEmail || hasPhone) && l.length < 55;
    return !isOnlyContact;
  });

  // Détermination du nom complet (première ligne valide de l'en-tête)
  if (headerLines.length > 0) {
    result.header.fullName = headerLines[0].replace(/^[#\d.\s•*\-]+/g, '').trim();
  }

  // Détermination du titre professionnel (deuxième ligne ou ligne avec des mots-clés de métiers)
  if (headerLines.length > 1) {
    result.header.title = headerLines[1].replace(/^[#\d.\s•*\-]+/g, '').trim();
  }

  // Localisation : villes de France, pays francophones, codes postaux
  const locationKeywords = [
    'paris', 'lyon', 'marseille', 'lille', 'bordeaux', 'nantes', 'strasbourg', 'toulouse', 'nice', 'rennes',
    'france', 'belgique', 'suisse', 'canada', 'montreal', 'bruxelles', 'geneve', 'luxembourg'
  ];
  for (const line of headerLines) {
    const lower = line.toLowerCase();
    if (locationKeywords.some((k) => lower.includes(k)) || /\b\d{5}\b/.test(line)) {
      if (!result.header.location && line !== result.header.fullName && line !== result.header.title) {
        result.header.location = line.replace(/[|•,;\-]/g, '').trim();
      }
    }
  }

  // Résumé / Introduction
  const summaryParagraphs = headerLines.filter((l) => {
    if (l === result.header.fullName || l === result.header.title || l === result.header.location) return false;
    return l.length > 25;
  });

  if (summaryParagraphs.length > 0) {
    result.header.summary = summaryParagraphs.join(' ');
  } else if (headerLines.length > 2) {
    result.header.summary = headerLines.slice(2).join(' ');
  }

  // 4. Traitement des Compétences (Skills)
  const skillLines = sections['skills'];
  const skillsSet = new Set<string>();
  for (const line of skillLines) {
    // Séparation par virgule, point-virgule, puce, barre verticale ou slash
    const parts = line
      .split(/[,;|•\-\/]/)
      .map((p) => p.replace(/^[#\d.\s•*\-]+|[#\s•*\-]+$/g, '').trim())
      .filter((p) => p.length > 1 && p.length < 35);

    for (const part of parts) {
      if (part) {
        skillsSet.add(part);
      }
    }
  }
  result.skills = Array.from(skillsSet).slice(0, 16);

  // 5. Traitement des Expériences Professionnelles
  const expLines = sections['experience'];
  let currentExp: any = null;

  const dateRangeRegex = /\b(?:19|20)\d{2}\b/g;
  const monthYearRegex = /\b(?:0[1-9]|1[0-2])\/(?:19|20)\d{2}\b/g;
  const presentRegex = /présent|present|aujourd'hui|today|en cours|depuis|actuel/i;

  for (let i = 0; i < expLines.length; i++) {
    const line = expLines[i];
    const cleanLine = line.replace(/^[#\s•*\-]+|[#\s•*\-]+$/g, '').trim();
    if (!cleanLine) continue;

    const isBullet = line.startsWith('-') || line.startsWith('•') || line.startsWith('*');
    const hasDates = dateRangeRegex.test(line) || monthYearRegex.test(line) || presentRegex.test(line);
    const lowerLine = line.toLowerCase();
    
    // Une ligne déclenche une nouvelle expérience s'il y a des dates
    // ou si c'est un format de titre court contenant des séparateurs comme chez/at/|
    const isNewExperienceTrigger =
      !isBullet &&
      (hasDates ||
        (line.length < 75 &&
          (lowerLine.includes('|') ||
            lowerLine.includes('-') ||
            lowerLine.includes('chez') ||
            lowerLine.includes(' at ') ||
            lowerLine.includes('@'))));

    if (isNewExperienceTrigger || !currentExp) {
      if (currentExp) {
        result.experience.push(currentExp);
      }

      currentExp = {
        role: '',
        company: '',
        period: '',
        location: '',
        description: '',
      };

      // Tenter de découper le titre de l'expérience
      const splitParts = cleanLine.split(/[|:\-]/).map((p) => p.trim());
      let dateIdx = -1;

      // Détecter la période parmi les parties découpées
      for (let pIdx = 0; pIdx < splitParts.length; pIdx++) {
        const part = splitParts[pIdx];
        if (dateRangeRegex.test(part) || monthYearRegex.test(part) || presentRegex.test(part)) {
          currentExp.period = part;
          dateIdx = pIdx;
          break;
        }
      }

      const cleanParts = splitParts.filter((_, idx) => idx !== dateIdx && splitParts[idx].length > 0);

      if (cleanParts.length > 0) {
        currentExp.role = cleanParts[0];
      }
      if (cleanParts.length > 1) {
        currentExp.company = cleanParts[1];
      } else if (cleanParts[0] && cleanParts[0].toLowerCase().includes('chez')) {
        const chezIdx = cleanParts[0].toLowerCase().indexOf('chez');
        currentExp.role = cleanParts[0].substring(0, chezIdx).trim();
        currentExp.company = cleanParts[0].substring(chezIdx + 4).trim();
      }

      // Si aucune période n'est trouvée sur cette ligne, regarder la ligne suivante
      if (!currentExp.period && i + 1 < expLines.length) {
        const nextLine = expLines[i + 1];
        if (dateRangeRegex.test(nextLine) || monthYearRegex.test(nextLine) || presentRegex.test(nextLine)) {
          currentExp.period = nextLine.replace(/^[#\s•*\-]+|[#\s•*\-]+$/g, '').trim();
          i++; // Passer la ligne de date
        }
      }
    } else {
      // Ajout aux détails ou à la description
      if (isBullet) {
        const bulletText = line.replace(/^[\s•*\-]+/g, '').trim();
        currentExp.description += (currentExp.description ? '\n' : '') + `• ${bulletText}`;
      } else {
        const isShort = line.length < 40;
        if (isShort && !currentExp.location && locationKeywords.some((k) => lowerLine.includes(k))) {
          currentExp.location = cleanLine;
        } else {
          currentExp.description += (currentExp.description ? '\n' : '') + `• ${cleanLine}`;
        }
      }
    }
  }

  if (currentExp) {
    result.experience.push(currentExp);
  }

  // 6. Traitement des Formations (Education)
  const eduLines = sections['education'];
  let currentEdu: any = null;

  for (let i = 0; i < eduLines.length; i++) {
    const line = eduLines[i];
    const cleanLine = line.replace(/^[#\s•*\-]+|[#\s•*\-]+$/g, '').trim();
    if (!cleanLine) continue;

    const lowerLine = line.toLowerCase();
    const hasDates = dateRangeRegex.test(line) || monthYearRegex.test(line);
    const isEduTrigger =
      hasDates ||
      lowerLine.includes('master') ||
      lowerLine.includes('licence') ||
      lowerLine.includes('bac') ||
      lowerLine.includes('diplô') ||
      lowerLine.includes('diplome') ||
      lowerLine.includes('universi') ||
      lowerLine.includes('école') ||
      lowerLine.includes('ecole') ||
      lowerLine.includes('school');

    if (isEduTrigger || !currentEdu) {
      if (currentEdu) {
        result.education.push(currentEdu);
      }

      currentEdu = {
        degree: '',
        school: '',
        period: '',
        location: '',
      };

      const splitParts = cleanLine.split(/[|:\-]/).map((p) => p.trim());
      let dateIdx = -1;

      for (let pIdx = 0; pIdx < splitParts.length; pIdx++) {
        const part = splitParts[pIdx];
        if (dateRangeRegex.test(part)) {
          currentEdu.period = part;
          dateIdx = pIdx;
          break;
        }
      }

      const cleanParts = splitParts.filter((_, idx) => idx !== dateIdx && splitParts[idx].length > 0);
      if (cleanParts.length > 0) {
        currentEdu.degree = cleanParts[0];
      }
      if (cleanParts.length > 1) {
        currentEdu.school = cleanParts[1];
      }

      if (!currentEdu.period && i + 1 < eduLines.length) {
        const nextLine = eduLines[i + 1];
        if (dateRangeRegex.test(nextLine)) {
          currentEdu.period = nextLine.replace(/^[#\s•*\-]+|[#\s•*\-]+$/g, '').trim();
          i++;
        }
      }
    } else {
      if (locationKeywords.some((k) => lowerLine.includes(k)) && line.length < 35) {
        currentEdu.location = cleanLine;
      } else if (!currentEdu.school) {
        currentEdu.school = cleanLine;
      }
    }
  }

  if (currentEdu) {
    result.education.push(currentEdu);
  }

  // Garanties de repli si champs vides
  if (!result.header.fullName) {
    result.header.fullName = "Jean Dupont";
  }
  if (!result.header.title) {
    result.header.title = "Profil Professionnel";
  }

  return result;
}
