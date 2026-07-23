export type Language = 'fr' | 'en' | 'es' | 'de';

export interface TranslationSchema {
  nav: {
    templates: string;
    blog: string;
    pricing: string;
    createCv: string;
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    atsBadge: string;
    pdfBadge: string;
    noAccountBadge: string;
  };
  home: {
    dragDropTag: string;
    editorPreviewTitle: string;
    editorPreviewDesc: string;
    editorPreviewCta: string;
    activeTemplateLabel: string;
    readyBadge: string;
    whyTitle: string;
    whySubtitle: string;
    feat1Title: string;
    feat1Desc: string;
    feat2Title: string;
    feat2Desc: string;
    feat3Title: string;
    feat3Desc: string;
    ratingText: string;
    testimonialsTitle: string;
    t1Quote: string;
    t1Name: string;
    t1Role: string;
    t2Quote: string;
    t2Name: string;
    t2Role: string;
    t3Quote: string;
    t3Name: string;
    t3Role: string;
    faqTitle: string;
    faqSubtitle: string;
    faqs: Array<{ q: string; a: string }>;
    ctaBannerTitle: string;
    ctaBannerSubtitle: string;
  };
  editor: {
    editorTitle: string;
    structureTitle: string;
    customizationTitle: string;
    autoSave: string;
    localStorage: string;
    changeTemplate: string;
    colorsFonts: string;
    exportPdf: string;
    generating: string;
    share: string;
    linkCopied: string;
    headerSection: string;
    experienceSection: string;
    educationSection: string;
    skillsSection: string;
    projectsSection: string;
  };
  templates: {
    title: string;
    subtitle: string;
    headerBadge: string;
    headerTitle1: string;
    headerTitle2: string;
    headerSubtitle: string;
    all: string;
    modern: string;
    classic: string;
    creative: string;
    minimal: string;
    executive: string;
    filterAll: string;
    filterTech: string;
    filterBusiness: string;
    filterDesign: string;
    filterMinimal: string;
    filterExec: string;
    useTemplate: string;
    atsCompatible: string;
    preview: string;
    wellOrganized: string;
    fullyEditable: string;
    pdfVectorial: string;
    close: string;
  };
  blog: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    readArticle: string;
    readTime: string;
    backToArticles: string;
    notFound: string;
    notFoundDesc: string;
    ctaBoxTitle: string;
    ctaBoxDesc: string;
    ctaBoxBtn: string;
    articles: Array<{ slug: string; title: string; excerpt: string; date: string; readTime: string; category: string; content?: string }>;
  };
  pricing: {
    title: string;
    subtitle: string;
    freeTitle: string;
    freePrice: string;
    freePerks: string[];
    freeCta: string;
    premiumTitle: string;
    premiumPrice: string;
    premiumPerks: string[];
    premiumCta: string;
    premiumActive: string;
    alertSuccess: string;
  };
  sidebar: {
    backHome: string;
    tabSections: string;
    tabTemplates: string;
    tabDesign: string;
    tabLanguage: string;
    onCanvas: string;
    sectionsTip: string;
    paletteLabel: string;
    customColor: string;
    typography: string;
    spacingDensity: string;
    compact: string;
    normal: string;
    spacious: string;
    appLanguage: string;
    samplePresetTitle: string;
    samplePresetDesc: string;
    loadPresetFr: string;
    loadPresetEn: string;
    loadPresetEs: string;
    loadPresetDe: string;
  };
  footer: {
    tagline: string;
    rights: string;
    madeWith: string;
  };
}

export const translations: Record<Language, TranslationSchema> = {
  fr: {
    nav: {
      templates: 'Modèles',
      blog: 'Blog',
      pricing: 'Tarifs',
      createCv: 'Créer mon CV',
    },
    hero: {
      badge: 'Nouveau : Éditeur international 2026',
      titleLine1: 'Votre carrière mérite',
      titleLine2: 'un design d\'exception.',
      subtitle: 'Créez un CV percutant, structuré et optimisé pour les recruteurs du monde entier en moins de 5 minutes.',
      ctaPrimary: 'Créer mon CV gratuitement',
      ctaSecondary: 'Explorer les modèles',
      atsBadge: 'Conforme aux normes ATS',
      pdfBadge: 'Export PDF Vectoriel',
      noAccountBadge: 'Sans inscription requise',
    },
    home: {
      dragDropTag: 'Glisser & Déposer',
      editorPreviewTitle: 'Un éditeur visuel réactif et zéro prise de tête',
      editorPreviewDesc: 'Organisez vos compétences, vos expériences et votre formation en un clic. Votre CV se met à jour instantanément avec une précision au millimètre.',
      editorPreviewCta: 'Lancer l\'éditeur maintenant',
      activeTemplateLabel: 'Modèle Actif : Moderne Minimal',
      readyBadge: '100% Prêt',
      whyTitle: 'Pourquoi choisir ResumeFlow ?',
      whySubtitle: 'Conçu pour maximiser vos chances de décrocher des entretiens grâce à une présentation irréprochable.',
      feat1Title: 'Designs Épurés & Pro',
      feat1Desc: 'Fini les CV surchargés des années 2010. Nos templates adoptent les standards des meilleures entreprises mondiales.',
      feat2Title: 'Instantané & Sans Friction',
      feat2Desc: 'Pas de formulaire interminable. Remplissez directement votre CV et visualisez les modifications en temps réel.',
      feat3Title: 'Export PDF de Haute Précision',
      feat3Desc: 'Téléchargez un fichier PDF vectoriel léger, parfaitement imprimable et compatible avec tous les recruteurs.',
      ratingText: '4.9/5 par plus de 10 000 utilisateurs',
      testimonialsTitle: 'Ce qu\'en disent nos candidats',
      t1Quote: '"J\'ai refait mon CV en 10 minutes avant un entretien chez une grande Scale-up. Le recruteur m\'a immédiatement félicité pour la clarté du document !"',
      t1Name: 'Thomas L.',
      t1Role: 'Product Designer',
      t2Quote: '"Très intuitif, pas de pub agressive ni de piège à abonnement. L\'export PDF est propre et net. Je recommande à 100%."',
      t2Name: 'Sarah M.',
      t2Role: 'Développeuse Fullstack',
      t3Quote: '"Le système de drag & drop pour réordonner les blocs est un pur bonheur. Gain de temps incroyable par rapport à Word."',
      t3Name: 'Marc D.',
      t3Role: 'Consultant Marketing',
      faqTitle: 'Foire Aux Questions',
      faqSubtitle: 'Tout ce que vous devez savoir pour démarrer sereinement.',
      faqs: [
        {
          q: 'Est-ce vraiment gratuit pour créer mon CV ?',
          a: 'Oui ! Vous pouvez créer votre CV complet, choisir parmi nos modèles et l\'exporter directement en PDF. Les fonctionnalités avancées sans filigrane sont disponibles dans l\'offre Premium.',
        },
        {
          q: 'Mes données personnelles sont-elles sécurisées ?',
          a: 'Absolument. Vos informations sont stockées localement dans votre navigateur et ne sont jamais vendues ou partagées avec des tiers.',
        },
        {
          q: 'Les CV créés sont-ils compatibles avec les logiciels de recrutement (ATS) ?',
          a: 'Oui, tous nos templates sont conçus avec une structure propre et des polices lisibles parfaitement décodées par les systèmes ATS des recruteurs.',
        },
        {
          q: 'Puis-je modifier mon CV après l\'avoir exporté ?',
          a: 'Oui, vos modifications sont automatiquement enregistrées dans votre navigateur. Revenez sur la plateforme à tout moment pour mettre à jour votre CV.',
        },
      ],
      ctaBannerTitle: 'Prêt à faire passer votre carrière au niveau supérieur ?',
      ctaBannerSubtitle: 'Rejoignez des milliers de professionnels ayant décroché le job de leurs rêves grâce à nos designs.',
    },
    editor: {
      editorTitle: 'Éditeur',
      structureTitle: 'Structure du CV',
      customizationTitle: 'Personnalisation',
      autoSave: 'Sauvegarde auto',
      localStorage: 'Stockage local sécurisé',
      changeTemplate: 'Changer de modèle',
      colorsFonts: 'Couleurs & Polices',
      exportPdf: 'Exporter PDF',
      generating: 'Génération...',
      share: 'Partager',
      linkCopied: 'Lien copié',
      headerSection: 'En-tête & Contact',
      experienceSection: 'Expérience Pro',
      educationSection: 'Formation & Diplômes',
      skillsSection: 'Compétences',
      projectsSection: 'Projets & Portfolio',
    },
    templates: {
      title: 'Modèles de CV internationaux',
      subtitle: 'Designs testés et approuvés par les recruteurs pour faire sortir votre candidature du lot.',
      headerBadge: '20 Modèles ATS Conformes & Personnalisables',
      headerTitle1: '20 Types de CV',
      headerTitle2: 'Haute Précision',
      headerSubtitle: 'Sélectionnez le modèle parfait adapté à votre secteur : Tech, Finance, Design, Droit, Santé ou Management.',
      all: 'Tous les modèles',
      modern: 'Moderne',
      classic: 'Classique',
      creative: 'Créatif',
      minimal: 'Minimal',
      executive: 'Professionnel',
      filterAll: 'Tous les modèles',
      filterTech: 'Tech & Product',
      filterBusiness: 'Business, Finance & Droit',
      filterDesign: 'Design & Créatif',
      filterMinimal: 'Minimal & International',
      filterExec: 'Executive & Management',
      useTemplate: 'Utiliser ce modèle',
      atsCompatible: 'Compatibles logiciels ATS',
      preview: 'Aperçu Plein Écran',
      wellOrganized: 'Structure ATS Propre',
      fullyEditable: '100% Personnalisable',
      pdfVectorial: 'Export PDF Haute-Rés',
      close: 'Fermer',
    },
    blog: {
      badge: 'Guides & Conseils Candidature',
      title: 'Le Blog de l\'Emploi',
      titleHighlight: '& du Design',
      subtitle: 'Des articles rédigés par nos experts en recrutement pour maximiser vos opportunités professionnelles.',
      readArticle: 'Lire l\'article',
      readTime: 'min de lecture',
      backToArticles: 'Retour aux articles',
      notFound: 'Article non trouvé',
      notFoundDesc: 'L\'article que vous cherchez n\'existe pas.',
      ctaBoxTitle: 'Prêt à créer votre CV ?',
      ctaBoxDesc: 'Mettez en pratique nos conseils avec notre éditeur visuel gratuit.',
      ctaBoxBtn: 'Créer mon CV maintenant',
      articles: [
        {
          slug: 'comment-faire-un-cv-en-2026',
          title: 'Comment faire un CV en 2026 : Le Guide Ultime',
          excerpt: 'Découvrez les nouvelles exigences des recruteurs et des logiciels ATS en 2026. Structure, accroche et compétences clés à mettre en avant.',
          date: '1 Avril 2026',
          readTime: '6 min de lecture',
          category: 'Conseils Carrière',
          content: `
          <h2>1. Les Nouvelles Attentes des Recruteurs en 2026</h2>
          <p>En 2026, la lisibilité et l'impact visuel sont devenus prédominants. Les recruteurs reçoivent en moyenne plus de 200 candidatures par poste. Pour sortir du lot, votre CV doit être synthétique, structuré et immédiatement compréhensible.</p>
          <h2>2. L'Importance Cruciale de l'Accroche</h2>
          <p>L'accroche (ou résumé professionnel) placée en haut de votre CV est l'élément numéro un lu par les recruteurs. En 2 à 3 phrases, résumez vos compétences clés, vos années d'expérience et ce que vous apportez à l'entreprise.</p>
          <h2>3. Passer le Filtre des ATS (Applicant Tracking Systems)</h2>
          <p>Les outils de tri automatique de CV recherchent des mots-clés spécifiques. Veillez à reprendre les termes exacts de l'offre d'emploi dans votre section compétences et expériences.</p>
          `,
        },
        {
          slug: 'exemple-cv-etudiant',
          title: 'Exemple de CV Étudiant sans Expérience : Réussir sa Candidature',
          excerpt: 'Comment créer un CV percutant quand on n\'a pas encore d\'expérience professionnelle. Astuces pour valoriser vos projets et votre potentiel.',
          date: '28 Mars 2026',
          readTime: '5 min de lecture',
          category: 'Étudiants & Stages',
          content: `
          <h2>1. Valoriser ses Projets Académiques et Associatifs</h2>
          <p>L'absence d'expérience en entreprise n'est pas un frein. Mettez en avant vos travaux de groupe, vos projets d'études et vos engagements bénévoles.</p>
          <h2>2. Mettre l'Accent sur les Soft Skills</h2>
          <p>La capacité d'apprentissage, la rigueur, l'esprit d'équipe et la ponctualité sont particulièrement recherchés chez les profils juniors.</p>
          `,
        },
        {
          slug: 'competences-cv',
          title: 'Quelles Compétences Mettre sur son CV en 2026 ?',
          excerpt: 'Hard skills vs Soft skills : Liste complète et méthodes concrètes pour présenter vos compétences et faire la différence.',
          date: '15 Mars 2026',
          readTime: '7 min de lecture',
          category: 'Guide Pratique',
          content: `
          <h2>1. Différencier Hard Skills et Soft Skills</h2>
          <p>Les Hard Skills désignent vos compétences techniques (ex: React, Python, Excel), tandis que les Soft Skills représentent vos aptitudes relationnelles (ex: communication, résolution de problèmes).</p>
          <h2>2. Organiser ses Compétences avec Clarté</h2>
          <p>Utilisez des badges ou des catégories pour classer vos compétences et faciliter la lecture rapide par les recruteurs.</p>
          `,
        },
      ],
    },
    pricing: {
      title: 'Des tarifs simples et transparents',
      subtitle: 'Démarrez gratuitement sans carte bancaire, puis passez au niveau supérieur.',
      freeTitle: 'Gratuit',
      freePrice: '0€',
      freePerks: [
        'Création de CV illimitée',
        'Accès aux modèles de base',
        'Export PDF instantané',
        'Inclus un discret filigrane ResumeFlow',
      ],
      freeCta: 'Utiliser la version gratuite',
      premiumTitle: 'Premium',
      premiumPrice: '4,99€',
      premiumPerks: [
        'Export PDF 100% Sans Filigrane',
        'Accès à tous les modèles exclusifs',
        'Support multilingue complet (FR, EN, ES, DE)',
        'Palette de couleurs sur-mesure',
      ],
      premiumCta: 'Activer l\'offre Premium',
      premiumActive: 'Compte Premium Actif',
      alertSuccess: '🎉 Félicitations ! Votre compte est désormais Premium. L\'export PDF se fera sans aucun filigrane.',
    },
    sidebar: {
      backHome: 'Accueil',
      tabSections: 'Sections',
      tabTemplates: 'Modèles',
      tabDesign: 'Design',
      tabLanguage: 'Langue',
      onCanvas: 'Sur le Canvas',
      sectionsTip: '💡 Cliquez directement sur une section du CV à droite pour la modifier ou la réordonner en glisser-déposer.',
      paletteLabel: 'Palette de couleurs',
      customColor: 'Couleur personnalisée',
      typography: 'Typographie',
      spacingDensity: 'Densité de la mise en page',
      compact: 'Compacte',
      normal: 'Équilibrée',
      spacious: 'Aérée',
      appLanguage: 'Langue de l\'application',
      samplePresetTitle: 'Exemple de CV traduit',
      samplePresetDesc: 'Chargez un modèle de contenu pré-rempli dans la langue souhaitée pour votre profil international :',
      loadPresetFr: 'Charger modèle Français',
      loadPresetEn: 'Load English Resume',
      loadPresetEs: 'Cargar modelo Español',
      loadPresetDe: 'Deutschen Lebenslauf laden',
    },
    footer: {
      tagline: 'Le générateur de CV international nouvelle génération.',
      rights: 'Tous droits réservés.',
      madeWith: 'Fait avec passion pour les candidats ambitieux.',
    },
  },
  en: {
    nav: {
      templates: 'Templates',
      blog: 'Blog',
      pricing: 'Pricing',
      createCv: 'Create My Resume',
    },
    hero: {
      badge: 'New: International Editor 2026',
      titleLine1: 'Your career deserves',
      titleLine2: 'exceptional design.',
      subtitle: 'Build a high-impact, ATS-friendly resume tailored for recruiters worldwide in under 5 minutes.',
      ctaPrimary: 'Build My Resume Free',
      ctaSecondary: 'Browse Templates',
      atsBadge: 'ATS System Compliant',
      pdfBadge: 'Vector PDF Export',
      noAccountBadge: 'No Registration Required',
    },
    home: {
      dragDropTag: 'Drag & Drop',
      editorPreviewTitle: 'A responsive visual editor with zero hassle',
      editorPreviewDesc: 'Organize your skills, work experience, and education with one click. Your resume updates live with pixel precision.',
      editorPreviewCta: 'Launch Editor Now',
      activeTemplateLabel: 'Active Template: Modern Minimal',
      readyBadge: '100% Ready',
      whyTitle: 'Why Choose ResumeFlow?',
      whySubtitle: 'Designed to maximize your interview chances through flawless presentation.',
      feat1Title: 'Sleek & Professional Designs',
      feat1Desc: 'Say goodbye to bloated 2010 resumes. Our templates match top global company standards.',
      feat2Title: 'Instant & Frictionless',
      feat2Desc: 'No endless forms. Fill in your resume directly and preview every edit in real time.',
      feat3Title: 'High-Precision PDF Export',
      feat3Desc: 'Download a lightweight vector PDF, crisp for print and perfectly parsed by recruiters.',
      ratingText: '4.9/5 rated by over 10,000 job seekers',
      testimonialsTitle: 'What Our Candidates Say',
      t1Quote: '"I remade my resume in 10 minutes before an interview at a top scale-up. The recruiter immediately praised how clear it was!"',
      t1Name: 'Thomas L.',
      t1Role: 'Product Designer',
      t2Quote: '"Very intuitive, no annoying ads or subscription traps. The PDF export is super clean. 100% recommended."',
      t2Name: 'Sarah M.',
      t2Role: 'Fullstack Engineer',
      t3Quote: '"The drag & drop system to reorder sections is pure joy. Saved me hours compared to Word."',
      t3Name: 'Marc D.',
      t3Role: 'Marketing Consultant',
      faqTitle: 'Frequently Asked Questions',
      faqSubtitle: 'Everything you need to know to get started smoothly.',
      faqs: [
        {
          q: 'Is it really free to build my resume?',
          a: 'Yes! You can create your full resume, pick from our templates, and export it directly to PDF. Advanced watermark-free exports are included in the Premium plan.',
        },
        {
          q: 'Is my personal data secure?',
          a: 'Absolutely. Your information is stored locally in your web browser and is never sold or shared with third parties.',
        },
        {
          q: 'Are the resumes compatible with ATS recruiting software?',
          a: 'Yes, all our templates feature clean markup and readable fonts specifically parsed by ATS recruitment systems.',
        },
        {
          q: 'Can I edit my resume after exporting?',
          a: 'Yes, your changes are automatically saved in your browser. Come back anytime to update your resume.',
        },
      ],
      ctaBannerTitle: 'Ready to take your career to the next level?',
      ctaBannerSubtitle: 'Join thousands of professionals who landed their dream jobs with our designs.',
    },
    editor: {
      editorTitle: 'Editor',
      structureTitle: 'Resume Layout',
      customizationTitle: 'Customization',
      autoSave: 'Auto-saved',
      localStorage: 'Encrypted Local Storage',
      changeTemplate: 'Switch Template',
      colorsFonts: 'Colors & Fonts',
      exportPdf: 'Export PDF',
      generating: 'Generating...',
      share: 'Share',
      linkCopied: 'Link Copied',
      headerSection: 'Header & Contact',
      experienceSection: 'Work Experience',
      educationSection: 'Education',
      skillsSection: 'Skills & Tools',
      projectsSection: 'Projects & Portfolio',
    },
    templates: {
      title: 'International Resume Templates',
      subtitle: 'Recruiter-approved templates designed to make your application stand out globally.',
      headerBadge: '20 ATS Compliant & Customizable Templates',
      headerTitle1: '20 Resume Styles',
      headerTitle2: 'High Precision',
      headerSubtitle: 'Select the ideal template for your industry: Tech, Finance, Design, Law, Healthcare or Management.',
      all: 'All Templates',
      modern: 'Modern',
      classic: 'Classic',
      creative: 'Creative',
      minimal: 'Minimal',
      executive: 'Executive',
      filterAll: 'All Templates',
      filterTech: 'Tech & Product',
      filterBusiness: 'Business, Finance & Law',
      filterDesign: 'Design & Creative',
      filterMinimal: 'Minimal & Global',
      filterExec: 'Executive & Management',
      useTemplate: 'Use This Template',
      atsCompatible: 'ATS Compliant Formats',
      preview: 'Full-Screen Preview',
      wellOrganized: 'Clean ATS Structure',
      fullyEditable: '100% Fully Editable',
      pdfVectorial: 'High-Res PDF Export',
      close: 'Close',
    },
    blog: {
      badge: 'Job Search & Resume Guides',
      title: 'The Career & Design',
      titleHighlight: 'Blog',
      subtitle: 'Expert articles written by recruiters to boost your job applications.',
      readArticle: 'Read article',
      readTime: 'min read',
      backToArticles: 'Back to articles',
      notFound: 'Article not found',
      notFoundDesc: 'The article you are looking for does not exist.',
      ctaBoxTitle: 'Ready to build your resume?',
      ctaBoxDesc: 'Put our career advice into practice with our free visual editor.',
      ctaBoxBtn: 'Build My Resume Now',
      articles: [
        {
          slug: 'comment-faire-un-cv-en-2026',
          title: 'How to Build a High-Impact Resume in 2026',
          excerpt: 'Discover new recruiter expectations and ATS software requirements. Master structure, summary statements, and key skills.',
          date: 'April 1, 2026',
          readTime: '6 min read',
          category: 'Career Advice',
          content: `
          <h2>1. New Recruiter Expectations in 2026</h2>
          <p>In 2026, clarity and visual impact are paramount. Recruiters review hundreds of applications per posting. To stand out, your resume must be concise, structured, and instantly readable.</p>
          <h2>2. The Crucial Role of Your Summary Statement</h2>
          <p>The top professional summary is the first thing recruiters read. In 2-3 sentences, highlight your key skills, years of experience, and core value proposition.</p>
          <h2>3. Passing ATS (Applicant Tracking System) Filters</h2>
          <p>Automated screening tools search for exact keyword matches. Ensure your work history and skill sections incorporate exact terms from job descriptions.</p>
          `,
        },
        {
          slug: 'exemple-cv-etudiant',
          title: 'Student Resume Example with No Experience',
          excerpt: 'How to craft a compelling resume when entering the workforce. Leverage academic projects, leadership, and potential.',
          date: 'March 28, 2026',
          readTime: '5 min read',
          category: 'Students & Internships',
          content: `
          <h2>1. Highlighting Academic & Volunteer Projects</h2>
          <p>Lack of corporate experience is not a roadblock. Emphasize coursework, capstone projects, and extracurricular leadership roles.</p>
          <h2>2. Emphasizing Core Soft Skills</h2>
          <p>Adaptability, teamwork, problem-solving, and communication are highly prized attributes for junior talent.</p>
          `,
        },
        {
          slug: 'competences-cv',
          title: 'Essential Resume Skills to Include in 2026',
          excerpt: 'Hard skills vs Soft skills: Complete breakdown and actionable tips to highlight your capabilities effectively.',
          date: 'March 15, 2026',
          readTime: '7 min read',
          category: 'Practical Guide',
          content: `
          <h2>1. Hard Skills vs. Soft Skills</h2>
          <p>Hard skills cover technical proficiency (e.g. React, Python, Financial Modeling), while soft skills reflect interpersonal capabilities (e.g. communication, adaptability).</p>
          <h2>2. Categorizing Skills for Fast Scanning</h2>
          <p>Use pill tags or clean subheadings to organize your skills for rapid scanning by recruiters.</p>
          `,
        },
      ],
    },
    pricing: {
      title: 'Simple and transparent pricing',
      subtitle: 'Start free without a credit card, upgrade when you need peak performance.',
      freeTitle: 'Free',
      freePrice: '$0',
      freePerks: [
        'Unlimited resume creation',
        'Access to core templates',
        'Instant PDF export',
        'Includes subtle CVCraft watermark',
      ],
      freeCta: 'Start Free Version',
      premiumTitle: 'Premium',
      premiumPrice: '$4.99',
      premiumPerks: [
        '100% Watermark-Free PDF Exports',
        'Full access to all 20 premium designs',
        'Complete multilingual support (EN, FR, ES, DE)',
        'Custom brand color palettes',
      ],
      premiumCta: 'Upgrade to Premium',
      premiumActive: 'Premium Account Active',
      alertSuccess: '🎉 Congratulations! Your account is now Premium. PDF exports will be 100% watermark-free.',
    },
    sidebar: {
      backHome: 'Home',
      tabSections: 'Sections',
      tabTemplates: 'Templates',
      tabDesign: 'Design',
      tabLanguage: 'Language',
      onCanvas: 'On Canvas',
      sectionsTip: '💡 Click directly on any section on the canvas to edit or drag-and-drop to reorder.',
      paletteLabel: 'Color Palette',
      customColor: 'Custom Color',
      typography: 'Typography',
      spacingDensity: 'Layout Density',
      compact: 'Compact',
      normal: 'Balanced',
      spacious: 'Spacious',
      appLanguage: 'Application Language',
      samplePresetTitle: 'Sample Translated Resume',
      samplePresetDesc: 'Load pre-filled sample content in your target language for international applications:',
      loadPresetFr: 'Load French Template',
      loadPresetEn: 'Load English Resume',
      loadPresetEs: 'Load Spanish Template',
      loadPresetDe: 'Load German Resume',
    },
    footer: {
      tagline: 'Next-generation international resume builder.',
      rights: 'All rights reserved.',
      madeWith: 'Built with passion for ambitious candidates.',
    },
  },
  es: {
    nav: {
      templates: 'Plantillas',
      blog: 'Blog',
      pricing: 'Precios',
      createCv: 'Crear mi CV',
    },
    hero: {
      badge: 'Nuevo: Editor internacional 2026',
      titleLine1: 'Tu carrera merece',
      titleLine2: 'un diseño excepcional.',
      subtitle: 'Crea un CV impactante y optimizado para reclutadores de todo el mundo en menos de 5 minutos.',
      ctaPrimary: 'Crear mi CV gratis',
      ctaSecondary: 'Ver plantillas',
      atsBadge: 'Compatible con ATS',
      pdfBadge: 'Exportación PDF Vectorial',
      noAccountBadge: 'Sin registro necesario',
    },
    home: {
      dragDropTag: 'Arrastrar y Soltar',
      editorPreviewTitle: 'Un editor visual interactivo sin complicaciones',
      editorPreviewDesc: 'Organiza tus habilidades, experiencia laboral y educación en un clic. Tu CV se actualiza al instante con máxima precisión.',
      editorPreviewCta: 'Iniciar editor ahora',
      activeTemplateLabel: 'Modelo Activo: Moderna Minimal',
      readyBadge: '100% Listo',
      whyTitle: '¿Por qué elegir ResumeFlow?',
      whySubtitle: 'Diseñado para maximizar tus posibilidades de conseguir entrevistas con una presentación impecable.',
      feat1Title: 'Diseños Elegantes y Profesionales',
      feat1Desc: 'Olvídate de los CV sobrecargados. Nuestras plantillas siguen los estándares de las mejores empresas internacionales.',
      feat2Title: 'Instantáneo y sin fricciones',
      feat2Desc: 'Sin formularios interminables. Completa tu CV directamente y observa los cambios en tiempo real.',
      feat3Title: 'Exportación PDF de Alta Precisión',
      feat3Desc: 'Descarga un archivo PDF vectorial ligero, perfecto para imprimir y compatible con reclutadores.',
      ratingText: '4.9/5 valorado por más de 10,000 candidatos',
      testimonialsTitle: 'Lo que dicen nuestros candidatos',
      t1Quote: '"Rehice mi CV en 10 minutos antes de una entrevista. ¡El reclutador me felicitó de inmediato por la claridad del documento!"',
      t1Name: 'Tomás L.',
      t1Role: 'Product Designer',
      t2Quote: '"Muy intuitivo, sin anuncios molestos ni trampas de suscripción. La exportación a PDF es muy limpia. Recomendado al 100%."',
      t2Name: 'Sara M.',
      t2Role: 'Desarrolladora Fullstack',
      t3Quote: '"El sistema de arrastrar y soltar para reordenar secciones es fantástico. Ahorra muchísimo tiempo en comparación con Word."',
      t3Name: 'Marcos D.',
      t3Role: 'Consultor de Marketing',
      faqTitle: 'Preguntas Frecuentes',
      faqSubtitle: 'Todo lo que necesitas saber para empezar con tranquilidad.',
      faqs: [
        {
          q: '¿Es realmente gratis crear mi CV?',
          a: '¡Sí! Puedes crear tu CV completo, elegir entre nuestras plantillas y exportarlo directamente en PDF. La versión sin marca de agua está disponible en el plan Premium.',
        },
        {
          q: '¿Están seguros mis datos personales?',
          a: 'Totalmente. Tu información se almacena localmente en tu navegador y nunca se vende ni comparte con terceros.',
        },
        {
          q: '¿Son los CV compatibles con sistemas de reclutamiento (ATS)?',
          a: 'Sí, todas nuestras plantillas están diseñadas con una estructura limpia e identificable por los sistemas ATS.',
        },
        {
          q: '¿Puedo modificar mi CV después de exportarlo?',
          a: 'Sí, tus cambios se guardan automáticamente en tu navegador. Vuelve en cualquier momento para actualizar tu CV.',
        },
      ],
      ctaBannerTitle: '¿Listo para llevar tu carrera al siguiente nivel?',
      ctaBannerSubtitle: 'Únete a miles de profesionales que consiguieron el trabajo de sus sueños con nuestros diseños.',
    },
    editor: {
      editorTitle: 'Editor',
      structureTitle: 'Estructura del CV',
      customizationTitle: 'Personalización',
      autoSave: 'Guardado auto',
      localStorage: 'Almacenamiento local seguro',
      changeTemplate: 'Cambiar plantilla',
      colorsFonts: 'Colores y Fuentes',
      exportPdf: 'Exportar PDF',
      generating: 'Generando...',
      share: 'Compartir',
      linkCopied: 'Enlace copiado',
      headerSection: 'Encabezado y Contacto',
      experienceSection: 'Experiencia Laboral',
      educationSection: 'Educación',
      skillsSection: 'Habilidades',
      projectsSection: 'Proyectos y Portafolio',
    },
    templates: {
      title: 'Plantillas de CV Internacionales',
      subtitle: 'Diseños aprobados por reclutadores para hacer destacar tu candidatura a nivel global.',
      headerBadge: '20 Plantillas Compatibles con ATS y Personalizables',
      headerTitle1: '20 Estilos de CV',
      headerTitle2: 'Alta Precisión',
      headerSubtitle: 'Selecciona la plantilla ideal para tu sector: Tecnología, Finanzas, Diseño, Derecho, Salud o Gestión.',
      all: 'Todas',
      modern: 'Moderna',
      classic: 'Clásica',
      creative: 'Creativa',
      minimal: 'Minimalista',
      executive: 'Ejecutiva',
      filterAll: 'Todas las plantillas',
      filterTech: 'Tecnología y Producto',
      filterBusiness: 'Negocios y Finanzas',
      filterDesign: 'Diseño y Creativo',
      filterMinimal: 'Minimalista e Internacional',
      filterExec: 'Ejecutivo y Dirección',
      useTemplate: 'Usar esta plantilla',
      atsCompatible: 'Formatos compatibles con ATS',
      preview: 'Vista Previa Completa',
      wellOrganized: 'Estructura ATS Clara',
      fullyEditable: '100% Personalizable',
      pdfVectorial: 'Exportación PDF HD',
      close: 'Cerrar',
    },
    blog: {
      badge: 'Guías y Consejos de Empleo',
      title: 'El Blog de Empleo',
      titleHighlight: 'y Diseño',
      subtitle: 'Artículos redactados por expertos en reclutamiento para potenciar tus oportunidades.',
      readArticle: 'Leer artículo',
      readTime: 'min de lectura',
      backToArticles: 'Volver a artículos',
      notFound: 'Artículo no encontrado',
      notFoundDesc: 'El artículo que buscas no existe.',
      ctaBoxTitle: '¿Listo para crear tu CV?',
      ctaBoxDesc: 'Pon en práctica nuestros consejos con nuestro editor visual gratuito.',
      ctaBoxBtn: 'Crear mi CV ahora',
      articles: [
        {
          slug: 'comment-faire-un-cv-en-2026',
          title: 'Cómo hacer un CV de alto impacto en 2026',
          excerpt: 'Descubre los nuevos requisitos de los reclutadores y los programas ATS en 2026. Estructura, perfil profesional y claves del éxito.',
          date: '1 de Abril de 2026',
          readTime: '6 min de lectura',
          category: 'Consejos de Carrera',
          content: `
          <h2>1. Las nuevas expectativas de selección en 2026</h2>
          <p>En 2026, la claridad y la presentación visual son fundamentales. Los reclutadores revisan cientos de postulaciones. Tu CV debe ser sintético y entendible al instante.</p>
          <h2>2. La importancia del perfil profesional</h2>
          <p>El resumen ubicado en la parte superior es lo primero que leen los reclutadores. En 2 o 3 frases, destaca tus logros y competencias clave.</p>
          <h2>3. Superar los filtros ATS (Applicant Tracking Systems)</h2>
          <p>Las herramientas automáticas buscan palabras clave específicas. Asegúrate de incluir los términos de la oferta laboral en tu experiencia y habilidades.</p>
          `,
        },
        {
          slug: 'exemple-cv-etudiant',
          title: 'Ejemplo de CV Estudiantil sin Experiencia Previa',
          excerpt: 'Cómo crear un CV atractivo sin experiencia laboral formal. Consejos para destacar proyectos académicos y aptitudes.',
          date: '28 de Marzo de 2026',
          readTime: '5 min de lectura',
          category: 'Estudiantes y Prácticas',
          content: `
          <h2>1. Valorar proyectos académicos y voluntariados</h2>
          <p>La falta de experiencia profesional no es un obstáculo. Resalta tus trabajos universitarios, voluntariados y liderazgo estudiantil.</p>
          <h2>2. Enfatizar las Soft Skills</h2>
          <p>La capacidad de aprendizaje, el trabajo en equipo y la adaptabilidad son valores sumamente apreciados.</p>
          `,
        },
        {
          slug: 'competences-cv',
          title: 'Qué Habilidades Incluir en tu CV en 2026',
          excerpt: 'Hard skills vs Soft skills: Guía completa y métodos prácticos para presentar tus habilidades y marcar la diferencia.',
          date: '15 de Marzo de 2026',
          readTime: '7 min de lectura',
          category: 'Guía Práctica',
          content: `
          <h2>1. Diferenciar Hard Skills y Soft Skills</h2>
          <p>Las Hard Skills abarcan competencias técnicas (ej: React, Python, Análisis Financiero), mientras que las Soft Skills representan aptitudes interpersonales.</p>
          <h2>2. Organizar tus habilidades de forma clara</h2>
          <p>Utiliza etiquetas para clasificar tus aptitudes y facilitar una rápida lectura profesional.</p>
          `,
        },
      ],
    },
    pricing: {
      title: 'Precios simples y transparentes',
      subtitle: 'Empieza gratis sin tarjeta de crédito y da el salto cuando quieras.',
      freeTitle: 'Gratis',
      freePrice: '0€',
      freePerks: [
        'Creación ilimitada de CV',
        'Acceso a plantillas básicas',
        'Exportación PDF instantánea',
        'Incluye una sutil marca de agua CVExpress',
      ],
      freeCta: 'Usar versión gratuita',
      premiumTitle: 'Premium',
      premiumPrice: '4,99€',
      premiumPerks: [
        'PDFs 100% Sin Marca de Agua',
        'Acceso a todas las 20 plantillas premium',
        'Soporte multi-idioma (FR, EN, ES, DE)',
        'Paleta de colores personalizada',
      ],
      premiumCta: 'Activar versión Premium',
      premiumActive: 'Cuenta Premium Activa',
      alertSuccess: '🎉 ¡Felicitaciones! Tu cuenta ahora es Premium. Las exportaciones en PDF serán 100% sin marca de agua.',
    },
    sidebar: {
      backHome: 'Inicio',
      tabSections: 'Secciones',
      tabTemplates: 'Plantillas',
      tabDesign: 'Diseño',
      tabLanguage: 'Idioma',
      onCanvas: 'En el lienzo',
      sectionsTip: '💡 Haz clic directamente en cualquier sección del lienzo para editarla o arrástrala para reordenarla.',
      paletteLabel: 'Paleta de colores',
      customColor: 'Color personalizado',
      typography: 'Tipografía',
      spacingDensity: 'Densidad del diseño',
      compact: 'Compacto',
      normal: 'Equilibrado',
      spacious: 'Espacioso',
      appLanguage: 'Idioma de la aplicación',
      samplePresetTitle: 'Ejemplo de CV traducido',
      samplePresetDesc: 'Carga un modelo precompletado en tu idioma preferido para postulaciones internacionales:',
      loadPresetFr: 'Cargar modelo Francés',
      loadPresetEn: 'Load English Resume',
      loadPresetEs: 'Cargar modelo Español',
      loadPresetDe: 'Deutschen Lebenslauf laden',
    },
    footer: {
      tagline: 'El generador de CV internacional de nueva generación.',
      rights: 'Todos los derechos reservados.',
      madeWith: 'Hecho con pasión para candidatos ambiciosos.',
    },
  },
  de: {
    nav: {
      templates: 'Vorlagen',
      blog: 'Blog',
      pricing: 'Preise',
      createCv: 'Lebenslauf erstellen',
    },
    hero: {
      badge: 'Neu: Internationaler Editor 2026',
      titleLine1: 'Ihre Karriere verdient',
      titleLine2: 'ein außergewöhnliches Design.',
      subtitle: 'Erstellen Sie in unter 5 Minuten einen professionellen, ATS-optimierten Lebenslauf für internationale Arbeitgeber.',
      ctaPrimary: 'Kostenlos erstellen',
      ctaSecondary: 'Vorlagen durchsuchen',
      atsBadge: 'ATS-Konform',
      pdfBadge: 'Vektor-PDF-Export',
      noAccountBadge: 'Ohne Registrierung',
    },
    home: {
      dragDropTag: 'Drag & Drop',
      editorPreviewTitle: 'Ein visureaktiver Editor ohne Aufwand',
      editorPreviewDesc: 'Organisieren Sie Ihre Kenntnisse, Berufserfahrung und Ausbildung mit einem Klick. Ihr Lebenslauf wird live aktualisiert.',
      editorPreviewCta: 'Editor jetzt starten',
      activeTemplateLabel: 'Aktives Design: Modern Minimal',
      readyBadge: '100% Bereit',
      whyTitle: 'Warum ResumeFlow wählen?',
      whySubtitle: 'Maximieren Sie Ihre Chancen auf Vorstellungsgespräche durch eine makellose Präsentation.',
      feat1Title: 'Elegante & Professionelle Designs',
      feat1Desc: 'Keine überladenen Lebensläufe mehr. Unsere Vorlagen entsprechen den Standards führender globaler Unternehmen.',
      feat2Title: 'Sofort & Ohne Hürden',
      feat2Desc: 'Keine endlosen Formulare. Füllen Sie Ihren Lebenslauf direkt aus und sehen Sie jede Änderung in Echtzeit.',
      feat3Title: 'Hochpräziser PDF-Export',
      feat3Desc: 'Laden Sie eine leichte Vektor-PDF-Datei herunter, ideal zum Drucken und für Personaler.',
      ratingText: '4.9/5 von über 10.000 Bewerbern bewertet',
      testimonialsTitle: 'Das sagen unsere Bewerber',
      t1Quote: '"Ich habe meinen Lebenslauf vor einem Gespräch in 10 Minuten überarbeitet. Der Personaler hat mich direkt für die Übersichtlichkeit gelobt!"',
      t1Name: 'Thomas L.',
      t1Role: 'Product Designer',
      t2Quote: '"Sehr intuitiv, keine nervige Werbung oder Abofallen. Der PDF-Export ist extrem sauber. 100% Empfehlung."',
      t2Name: 'Sarah M.',
      t2Role: 'Fullstack Entwicklerin',
      t3Quote: '"Das Drag & Drop System ist einfach klasse. Riesige Zeitersparnis im Vergleich zu Word."',
      t3Name: 'Marc D.',
      t3Role: 'Marketing Consultant',
      faqTitle: 'Häufig gestellte Fragen',
      faqSubtitle: 'Alles, was Sie wissen müssen, um sorgenfrei zu starten.',
      faqs: [
        {
          q: 'Ist das Erstellen meines Lebenslaufs wirklich kostenlos?',
          a: 'Ja! Sie können Ihren kompletten Lebenslauf erstellen, Vorlagen auswählen und direkt als PDF exportieren. Wasserzeichenfreie Exporte sind im Premium-Tarif enthalten.',
        },
        {
          q: 'Sind meine persönlichen Daten sicher?',
          a: 'Absolut. Ihre Daten werden lokal in Ihrem Webbrowser gespeichert und niemals an Dritte weitergegeben.',
        },
        {
          q: 'Sind die Lebensläufe mit Bewerbermanagementsystemen (ATS) kompatibel?',
          a: 'Ja, alle Vorlagen besitzen eine saubere Struktur und gut lesbare Schriftarten für ATS-Systeme.',
        },
        {
          q: 'Kann ich meinen Lebenslauf nach dem Export bearbeiten?',
          a: 'Ja, Ihre Änderungen werden automatisch im Browser gespeichert. Sie können jederzeit zurückkehren.',
        },
      ],
      ctaBannerTitle: 'Bereit, Ihre Karriere auf das nächste Level zu heben?',
      ctaBannerSubtitle: 'Schließen Sie sich Tausenden Bewerbern an, die mit unseren Designs ihren Traumjob gefunden haben.',
    },
    editor: {
      editorTitle: 'Editor',
      structureTitle: 'Lebenslauf-Struktur',
      customizationTitle: 'Anpassung',
      autoSave: 'Automatisch gespeichert',
      localStorage: 'Sicherer lokaler Speicher',
      changeTemplate: 'Vorlage wechseln',
      colorsFonts: 'Farben & Schriftarten',
      exportPdf: 'PDF Exportieren',
      generating: 'Generiere...',
      share: 'Teilen',
      linkCopied: 'Link kopiert',
      headerSection: 'Kopfzeile & Kontakt',
      experienceSection: 'Berufserfahrung',
      educationSection: 'Ausbildung',
      skillsSection: 'Kenntnisse',
      projectsSection: 'Projekte & Portfolio',
    },
    templates: {
      title: 'Internationale Lebenslauf-Vorlagen',
      subtitle: 'Von Personalverantwortlichen geprüfte Designs für Ihre erfolgreiche Bewerbung.',
      headerBadge: '20 ATS-konforme & anpassbare Vorlagen',
      headerTitle1: '20 Lebenslauf-Stile',
      headerTitle2: 'Hohe Präzision',
      headerSubtitle: 'Wählen Sie das perfekte Design für Ihre Branche: Tech, Finanzen, Design, Recht, Medizin oder Management.',
      all: 'Alle Vorlagen',
      modern: 'Modern',
      classic: 'Klassisch',
      creative: 'Kreativ',
      minimal: 'Minimalistisch',
      executive: 'Executive',
      filterAll: 'Alle Vorlagen',
      filterTech: 'Tech & Produkt',
      filterBusiness: 'Business, Finanzen & Recht',
      filterDesign: 'Design & Kreativ',
      filterMinimal: 'Minimal & International',
      filterExec: 'Executive & Management',
      useTemplate: 'Diese Vorlage nutzen',
      atsCompatible: 'ATS-kompatibel',
      preview: 'Vollbild-Vorschau',
      wellOrganized: 'Klare ATS-Struktur',
      fullyEditable: '100% Anpassbar',
      pdfVectorial: 'HQ PDF-Export',
      close: 'Schließen',
    },
    blog: {
      badge: 'Bewerbungstipps & Ratgeber',
      title: 'Der Karriere- & Design',
      titleHighlight: 'Blog',
      subtitle: 'Expertenartikel von Personalberatern für Ihren Bewerbungserfolg.',
      readArticle: 'Artikel lesen',
      readTime: 'Min. Lesezeit',
      backToArticles: 'Zurück zur Übersicht',
      notFound: 'Artikel nicht gefunden',
      notFoundDesc: 'Der gesuchte Artikel existiert nicht.',
      ctaBoxTitle: 'Bereit für Ihren neuen Lebenslauf?',
      ctaBoxDesc: 'Setzen Sie unsere Tipps direkt in unserem kostenlosen Editor um.',
      ctaBoxBtn: 'Lebenslauf jetzt erstellen',
      articles: [
        {
          slug: 'comment-faire-un-cv-en-2026',
          title: 'Lebenslauf erstellen 2026: Der ultimative Leitfaden',
          excerpt: 'Entdecken Sie die neuesten Anforderungen von Personalverantwortlichen und ATS-Software im Jahr 2026.',
          date: '1. April 2026',
          readTime: '6 Min. Lesezeit',
          category: 'Karrieretipps',
          content: `
          <h2>1. Neue Erwartungen im Jahr 2026</h2>
          <p>Im Jahr 2026 stehen Übersichtlichkeit und visuelle Wirkung an erster Stelle. Personalverantwortliche sichten Hunderte Bewerbungen. Ihr Lebenslauf muss strukturiert und sofort verständlich sein.</p>
          <h2>2. Die entscheidende Bedeutung des Kurzprofils</h2>
          <p>Das Kurzprofil oben im Lebenslauf wird als Erstes gelesen. Fassen Sie Ihre Kernkompetenzen und Ihre Erfahrung in 2-3 Sätzen zusammen.</p>
          <h2>3. ATS-Filter erfolgreich passieren</h2>
          <p>Automatische Scannersysteme suchen nach gezielten Schlüsselwörtern. Übernehmen Sie Begriffe exakt aus der Stellenanzeige.</p>
          `,
        },
        {
          slug: 'exemple-cv-etudiant',
          title: 'Lebenslauf für Studenten & Berufseinsteiger',
          excerpt: 'So erstellen Sie einen überzeugenden Lebenslauf ohne lange Berufserfahrung mit Fokus auf Projekte und Skills.',
          date: '28. März 2026',
          readTime: '5 Min. Lesezeit',
          category: 'Studenten & Praktika',
          content: `
          <h2>1. Studienprojekte & Engagement hervorheben</h2>
          <p>Fehlende Praxis im Unternehmen ist kein Problem. Heben Sie Gruppenarbeiten, Semesterprojekte und ehrenamtliches Engagement hervor.</p>
          <h2>2. Soft Skills betonen</h2>
          <p>Lernbereitschaft, Teamgeist, Zuverlässigkeit und lösungsorientiertes Denken sind bei Einsteigern besonders gefragt.</p>
          `,
        },
        {
          slug: 'competences-cv',
          title: 'Welche Kenntnisse gehören 2026 in den Lebenslauf?',
          excerpt: 'Hard Skills vs. Soft Skills: Vollständige Übersicht und praxiserprobte Tipps zur Darstellung Ihrer Fähigkeiten.',
          date: '15. März 2026',
          readTime: '7 Min. Lesezeit',
          category: 'Praxis-Ratgeber',
          content: `
          <h2>1. Hard Skills und Soft Skills unterscheiden</h2>
          <p>Hard Skills bezeichnen fachliche Qualifikationen (z.B. React, Python, Excel), während Soft Skills Ihre persönlichen Stärken abbilden.</p>
          <h2>2. Kenntnisse übersichtlich gliedern</h2>
          <p>Nutzen Sie Kategorien oder Tag-Elemente für eine schnelle Lesbarkeit.</p>
          `,
        },
      ],
    },
    pricing: {
      title: 'Einfache & transparente Preise',
      subtitle: 'Starten Sie kostenlos ohne Kreditkarte und upgraden Sie jederzeit.',
      freeTitle: 'Kostenlos',
      freePrice: '0€',
      freePerks: [
        'Unbegrenzte Lebenslauf-Erstellung',
        'Zugang zu Basis-Vorlagen',
        'Sofortiger PDF-Export',
        'Mit dezentem CVExpress-Wasserzeichen',
      ],
      freeCta: 'Kostenlos starten',
      premiumTitle: 'Premium',
      premiumPrice: '4,99€',
      premiumPerks: [
        '100% Wasserzeichenfreier PDF-Export',
        'Zugang zu allen 20 Premium-Designs',
        'Vollständige Mehrsprachigkeit (FR, EN, ES, DE)',
        'Individuelle Farbpalette',
      ],
      premiumCta: 'Auf Premium upgraden',
      premiumActive: 'Premium-Konto Aktiv',
      alertSuccess: '🎉 Herzlichen Glückwunsch! Ihr Konto ist jetzt Premium. PDF-Exporte sind zu 100% wasserzeichenfrei.',
    },
    sidebar: {
      backHome: 'Startseite',
      tabSections: 'Abschnitte',
      tabTemplates: 'Vorlagen',
      tabDesign: 'Design',
      tabLanguage: 'Sprache',
      onCanvas: 'Auf dem Canvas',
      sectionsTip: '💡 Klicken Sie direkt auf einen Abschnitt im Lebenslauf, um ihn zu bearbeiten oder neu anzordnen.',
      paletteLabel: 'Farbpalette',
      customColor: 'Benutzerdefinierte Farbe',
      typography: 'Typografie',
      spacingDensity: 'Layout-Dichte',
      compact: 'Kompakt',
      normal: 'Ausgewogen',
      spacious: 'Luftig',
      appLanguage: 'App-Sprache',
      samplePresetTitle: 'Übersetzter Muster-Lebenslauf',
      samplePresetDesc: 'Laden Sie vorausgefüllte Musterdaten in Ihrer Wunschsprache für internationale Bewerbungen:',
      loadPresetFr: 'Französische Vorlage laden',
      loadPresetEn: 'English Resume laden',
      loadPresetEs: 'Spanische Vorlage laden',
      loadPresetDe: 'Deutschen Lebenslauf laden',
    },
    footer: {
      tagline: 'Der internationale Lebenslauf-Generator der nächsten Generation.',
      rights: 'Alle Rechte vorbehalten.',
      madeWith: 'Mit Leidenschaft für ehrgeizige Bewerber entwickelt.',
    },
  },
};
