/**
 * Algorithme local d'optimisation et d'analyse sémantique ATS (Offline ATS Score Optimizer)
 * Intègre la taxonomie scientifique et technique du référentiel "awesome-matlab"
 * ainsi que les standards de l'ingénierie et du développement moderne.
 */

import { StructuredCVData } from './parserAlgorithm';

export interface SectionEval {
  section: string;
  status: 'good' | 'warning' | 'critical';
  feedback: string;
  suggestions: string[];
}

export interface ATSAnalysisResult {
  score: number;
  matchingKeywords: string[];
  missingKeywords: string[];
  sectionEvaluations: SectionEval[];
  formattingTips: string[];
}

// Dictionnaire sémantique thématique basé sur "awesome-matlab" et le développement d'ingénierie
const SEMANTIC_DICTIONARY = {
  matlab_core: [
    'matlab', 'simulink', 'stateflow', 'octave', 'scilab', 'mex', 'm-code', 'mu-pad',
    'live editor', 'matlab coder', 'simulink coder', 'gpu coder', 'app designer'
  ],
  scientific_toolboxes: [
    'control system toolbox', 'signal processing toolbox', 'image processing toolbox',
    'computer vision toolbox', 'deep learning toolbox', 'optimization toolbox',
    'statistics and machine learning', 'curve fitting toolbox', 'symbolic math toolbox',
    'wavelet toolbox', 'rf toolbox', 'pde toolbox', 'dsp system toolbox'
  ],
  engineering_domains: [
    'traitement du signal', 'signal processing', 'automatique', 'control systems',
    'computer vision', 'vision par ordinateur', 'deep learning', 'machine learning',
    'intelligence artificielle', 'simulation physique', 'physical modeling',
    'génération de code', 'calcul scientifique', 'scientific computing',
    'systèmes embarqués', 'embedded systems', 'robotique', 'ros', 'instrumentation'
  ],
  modern_languages: [
    'python', 'numpy', 'scipy', 'julia', 'c++', 'c#', 'fortran', 'sql', 'r language',
    'typescript', 'javascript', 'react', 'git', 'docker', 'ci/cd', 'api'
  ],
  methodology: [
    'agile', 'scrum', 'gestion de projet', 'project management', 'kpi', 'conception',
    'modélisation', 'validation', 'tests unitaires', 'simulation', 'prototypage'
  ]
};

// Recommandations intelligentes de mots-clés selon le profil détecté
const RECOMMENDATIONS = {
  matlab: [
    'Simulink', 'Control System Toolbox', 'Génération de Code C/C++', 'MATLAB Coder',
    'Simulation Hardware-in-the-Loop (HIL)', 'Calcul Scientifique', 'Stateflow'
  ],
  scientific: [
    'Optimization Toolbox', 'Curve Fitting', 'Traitement Numérique du Signal',
    'Modélisation Physique', 'GNU Octave', 'Julia', 'Analyse de Données'
  ],
  modern: [
    'Python (NumPy / SciPy)', 'Intégration Continue (CI/CD)', 'Git / Versioning',
    'Docker', 'API REST', 'Méthodologie Agile / Scrum'
  ]
};

/**
 * Analyse sémantique hors-ligne d'un CV
 */
export function analyzeCVATSLocal(cvData: any, isFr: boolean = true): ATSAnalysisResult {
  // Extraction de tout le texte du CV pour recherche sémantique
  let fullText = '';
  const sections = cvData.sections || [];

  // Variables pour l'analyse de structure
  let hasSummary = false;
  let hasEmail = false;
  let hasPhone = false;
  let hasLocation = false;
  let hasExperience = false;
  let hasEducation = false;
  let hasSkills = false;

  let experienceCount = 0;
  let educationCount = 0;
  let skillsCount = 0;

  let bulletPointsCount = 0;
  const criticalSectionEvals: SectionEval[] = [];

  // Parcourir les rubriques pour accumuler le texte et diagnostiquer la structure
  for (const sec of sections) {
    const secType = sec.type;
    const content = sec.content || {};

    if (secType === 'header') {
      fullText += ` ${content.fullName || ''} ${content.title || ''} ${content.summary || ''} ${content.location || ''} ${content.email || ''} ${content.phone || ''}`;
      if (content.summary && content.summary.trim().length > 20) {
        hasSummary = true;
      }
      if (content.email && content.email.includes('@')) {
        hasEmail = true;
      }
      if (content.phone && content.phone.trim().length >= 8) {
        hasPhone = true;
      }
      if (content.location && content.location.trim().length > 3) {
        hasLocation = true;
      }
    } else if (secType === 'experience') {
      hasExperience = true;
      const items = content.items || [];
      experienceCount = items.length;
      for (const item of items) {
        fullText += ` ${item.role || ''} ${item.company || ''} ${item.description || ''}`;
        if (item.description) {
          const bullets = item.description.split('\n').filter((l: string) => l.trim().startsWith('•') || l.trim().startsWith('-'));
          bulletPointsCount += bullets.length;
        }
      }
    } else if (secType === 'education') {
      hasEducation = true;
      const items = content.items || [];
      educationCount = items.length;
      for (const item of items) {
        fullText += ` ${item.degree || ''} ${item.school || ''} ${item.location || ''}`;
      }
    } else if (secType === 'skills') {
      hasSkills = true;
      const skillsList = content.skillsList || [];
      skillsCount = skillsList.length;
      fullText += ` ${skillsList.join(' ')}`;
    }
  }

  const normalizedText = fullText.toLowerCase();

  // Détection des mots-clés présents dans le CV
  const matchingKeywordsSet = new Set<string>();
  const flatDictionary = [
    ...SEMANTIC_DICTIONARY.matlab_core,
    ...SEMANTIC_DICTIONARY.scientific_toolboxes,
    ...SEMANTIC_DICTIONARY.engineering_domains,
    ...SEMANTIC_DICTIONARY.modern_languages,
    ...SEMANTIC_DICTIONARY.methodology
  ];

  for (const keyword of flatDictionary) {
    const escapedKeyword = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'i');
    if (regex.test(normalizedText)) {
      // Capitaliser élégamment pour l'affichage
      const formattedName = keyword
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      matchingKeywordsSet.add(formattedName);
    }
  }

  const matchingKeywords = Array.from(matchingKeywordsSet);

  // Déterminer la catégorie de profil pour suggérer des mots-clés manquants intelligents
  let profileType: 'matlab' | 'scientific' | 'modern' = 'modern';
  
  const matlabScore = (normalizedText.match(/matlab|simulink|stateflow|octave/g) || []).length;
  const scientificScore = (normalizedText.match(/optimization|math|signal|simulation|physic|calcul/g) || []).length;

  if (matlabScore > 1) {
    profileType = 'matlab';
  } else if (scientificScore > 1) {
    profileType = 'scientific';
  }

  // Sélectionner les compétences recommandées qui ne sont pas encore présentes dans le CV
  const potentialMissing = RECOMMENDATIONS[profileType];
  const missingKeywords = potentialMissing.filter(
    kw => !matchingKeywords.some(m => m.toLowerCase().includes(kw.toLowerCase()))
  );

  // Calcul dynamique du score ATS (sur 100)
  let score = 30; // Score de base pour avoir commencé le CV

  // Points pour les coordonnées indispensables (Max +15)
  if (hasEmail) score += 5;
  if (hasPhone) score += 5;
  if (hasLocation) score += 5;

  // Points pour le profil de compétences (Max +15)
  if (skillsCount >= 4 && skillsCount <= 12) {
    score += 15;
  } else if (skillsCount > 0) {
    score += 8;
  }

  // Points pour le résumé introductif (Max +10)
  if (hasSummary) score += 10;

  // Points pour l'expérience et l'utilisation de listes à puces (Max +20)
  if (hasExperience && experienceCount > 0) {
    score += 10;
    if (bulletPointsCount >= 3) {
      score += 10;
    } else if (bulletPointsCount > 0) {
      score += 5;
    }
  }

  // Points pour la pertinence sémantique / mots-clés détectés (Max +10)
  const kwBonus = Math.min(matchingKeywords.length * 2, 10);
  score += kwBonus;

  // Points de structure globale (Max +10)
  if (hasEducation && educationCount > 0) {
    score += 10;
  }

  // Borner le score entre 15 et 98 (98 est le maximum réaliste pour inciter à l'optimisation)
  score = Math.min(Math.max(score, 15), 98);

  // Évaluation de l'en-tête (Header)
  const headerSuggestions: string[] = [];
  let headerStatus: 'good' | 'warning' | 'critical' = 'good';
  let headerFeedback = isFr
    ? "Votre en-tête contient les informations de contact indispensables."
    : "Your header contains essential contact details.";

  if (!hasEmail || !hasPhone) {
    headerStatus = 'critical';
    headerFeedback = isFr
      ? "Il manque des informations de contact cruciales (email ou téléphone)."
      : "Crucial contact information is missing (email or phone).";
    if (!hasEmail) headerSuggestions.push(isFr ? "Ajoutez une adresse email professionnelle." : "Add a professional email address.");
    if (!hasPhone) headerSuggestions.push(isFr ? "Renseignez un numéro de téléphone joignable." : "Provide an active phone number.");
  } else if (!hasLocation) {
    headerStatus = 'warning';
    headerFeedback = isFr
      ? "L'absence de localisation géographique (ville) peut freiner les recruteurs locaux."
      : "Lack of location coordinates might limit local recruiter matches.";
    headerSuggestions.push(isFr ? "Spécifiez votre ville et code postal (ex: Paris 75015)." : "Specify your city and postal code.");
  }

  if (!hasSummary) {
    if (headerStatus === 'good') headerStatus = 'warning';
    headerSuggestions.push(isFr 
      ? "Rédigez une accroche ou résumé (3 lignes maximum) pour capter immédiatement l'attention." 
      : "Draft an introductory summary (maximum 3 lines) to capture instant attention."
    );
  }

  criticalSectionEvals.push({
    section: isFr ? "Informations de Contact & Profil" : "Contact Details & Profile",
    status: headerStatus,
    feedback: headerFeedback,
    suggestions: headerSuggestions
  });

  // Évaluation des Expériences (Experience)
  const expSuggestions: string[] = [];
  let expStatus: 'good' | 'warning' | 'critical' = 'good';
  let expFeedback = isFr
    ? "Vos expériences professionnelles sont bien détaillées."
    : "Your work history is appropriately detailed.";

  if (!hasExperience || experienceCount === 0) {
    expStatus = 'critical';
    expFeedback = isFr
      ? "Aucune expérience professionnelle détectée. C'est l'élément le plus scruté par les ATS."
      : "No work experience found. This is the single most verified block by ATS filters.";
    expSuggestions.push(isFr ? "Décrivez vos anciens postes, stages ou projets académiques marquants." : "Detail past jobs, internships, or academic projects.");
  } else {
    // Vérifier la présence de puces descriptives
    if (bulletPointsCount === 0) {
      expStatus = 'warning';
      expFeedback = isFr
        ? "Vos descriptions de postes manquent de structure. Les ATS rejettent les longs blocs de texte brut."
        : "Your job descriptions lack markup. ATS engines favor concise lists over massive text blocks.";
      expSuggestions.push(isFr 
        ? "Structurez vos réalisations sous forme de listes à puces (commençant par des tirets ou '•')."
        : "Format your achievements with standard bullets (starting with '-' or '•')."
      );
    } else if (bulletPointsCount < experienceCount * 2) {
      expStatus = 'warning';
      expFeedback = isFr
        ? "Certaines de vos expériences mériteraient d'être plus détaillées avec des indicateurs de réussite."
        : "Some roles need more action verbs and impact metrics.";
      expSuggestions.push(isFr 
        ? "Ajoutez des métriques ou des résultats quantifiables (ex: '+15% de performances', 'simulation de 4 architectures')."
        : "Include numerical impact metrics (e.g., '+15% solver speed', 'modeled 4 configurations')."
      );
    }

    // Vérifier s'il y a des termes techniques d'ingénierie
    if (matchingKeywords.length === 0) {
      if (expStatus === 'good') expStatus = 'warning';
      expSuggestions.push(isFr
        ? `Enrichissez vos tâches avec des mots-clés techniques (ex: ${potentialMissing.slice(0, 3).join(', ')}).`
        : `Enrich your experience with core tech keywords (e.g., ${potentialMissing.slice(0, 3).join(', ')}).`
      );
    }
  }

  criticalSectionEvals.push({
    section: isFr ? "Parcours Professionnel" : "Professional Experience",
    status: expStatus,
    feedback: expFeedback,
    suggestions: expSuggestions
  });

  // Évaluation des Compétences (Skills)
  const skillSuggestions: string[] = [];
  let skillStatus: 'good' | 'warning' | 'critical' = 'good';
  let skillFeedback = isFr
    ? "La liste de vos compétences est équilibrée et lisible."
    : "Your technical skills are well categorized.";

  if (!hasSkills || skillsCount === 0) {
    skillStatus = 'critical';
    skillFeedback = isFr
      ? "Aucune compétence déclarée. Les robots de recrutement se basent principalement sur cette liste pour vous indexer."
      : "No core skills listed. ATS robots search this segment first to classify your candidacy.";
    skillSuggestions.push(isFr ? "Ajoutez une section dédiée aux compétences techniques et humaines." : "Add a dedicated technical and core skills section.");
  } else if (skillsCount < 4) {
    skillStatus = 'warning';
    skillFeedback = isFr
      ? "Votre liste de compétences est trop restreinte pour vous positionner sur les requêtes des recruteurs."
      : "Your list is too brief. Recruiters index dozens of technical synonyms.";
    skillSuggestions.push(isFr 
      ? `Ajoutez des compétences connexes, outils de simulation ou langages complémentaires (ex: ${potentialMissing.slice(0, 2).join(', ')}).`
      : `Incorporate related concepts, solvers, or design suites (e.g., ${potentialMissing.slice(0, 2).join(', ')}).`
    );
  } else if (skillsCount > 15) {
    skillStatus = 'warning';
    skillFeedback = isFr
      ? "Trop de compétences répertoriées (effet de saturation). Ciblez les compétences les plus critiques."
      : "Too many skills listed. This dilutes focus. Prioritize top-tier proficiencies.";
    skillSuggestions.push(isFr ? "Regroupez ou filtrez pour ne garder que les 10 compétences majeures." : "Refine your list to focus on 10 critical technologies.");
  }

  criticalSectionEvals.push({
    section: isFr ? "Compétences & Mots-clés" : "Expertise & Keywords",
    status: skillStatus,
    feedback: skillFeedback,
    suggestions: skillSuggestions
  });

  // Conseils de formatage universels
  const formattingTips = isFr ? [
    "Utilisez une police standard hautement lisible (Arial, Georgia, Times New Roman).",
    "Évitez d'inclure des graphiques complexes, jauges de niveau, ou diagrammes circulaires que les robots ne peuvent pas lire.",
    "Exportez toujours votre CV final au format PDF standard (texte sélectionnable), jamais sous forme d'image (JPG/PNG).",
    "N'insérez pas d'informations critiques (coordonnées, titre) dans les en-têtes et pieds de page de votre fichier Word/PDF, car certains logiciels ATS les ignorent."
  ] : [
    "Use standard, clear web-safe typography (Arial, Georgia, Garamond).",
    "Avoid skill bars, dials, progress rings, or custom shapes; they are unreadable by parser algorithms.",
    "Always export to a standard vector PDF. Avoid scanning your resume or saving it as a flat image.",
    "Do not place essential details like phone or email inside native header or footer zones, as some parsers bypass them completely."
  ];

  return {
    score,
    matchingKeywords,
    missingKeywords,
    sectionEvaluations: criticalSectionEvals,
    formattingTips
  };
}
