import React from 'react';
import { TemplateId } from '../types/cv';

interface TemplateMockupProps {
  templateId: TemplateId;
  color: string;
  isExpanded?: boolean;
}

export const TemplateMockup: React.FC<TemplateMockupProps> = ({
  templateId,
  color,
  isExpanded = false
}) => {
  // Common sample profile images
  const femaleAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200";
  const maleAvatar = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200";

  switch (templateId) {
    case 'split_left':
      // CVDesignr bestseller: Left sidebar pastel column, Circular Avatar, right details
      return (
        <div className="w-full h-full bg-white text-[5.5px] leading-[1.25] flex overflow-hidden font-sans select-none pointer-events-none">
          {/* Left pastel column */}
          <div className="w-[35%] h-full p-2.5 flex flex-col justify-between" style={{ backgroundColor: `${color}12` }}>
            <div className="space-y-3">
              {/* Avatar circular */}
              <div className="w-9 h-9 mx-auto rounded-full overflow-hidden border-2 border-white shadow-sm">
                <img src={femaleAvatar} alt="Profile" className="w-full h-full object-cover" />
              </div>

              {/* Contact info */}
              <div className="space-y-1">
                <div className="font-extrabold uppercase tracking-wider text-[4.5px] border-b pb-0.5" style={{ color }}>Contact</div>
                <div className="text-[4px] text-zinc-600 space-y-0.5">
                  <div className="truncate">paris@resumeflow.fr</div>
                  <div>+33 6 12 34 56 78</div>
                  <div>Paris, France</div>
                </div>
              </div>

              {/* Skills with elegant small bar charts */}
              <div className="space-y-1.5">
                <div className="font-extrabold uppercase tracking-wider text-[4.5px]" style={{ color }}>Compétences</div>
                <div className="space-y-1">
                  <div>
                    <div className="flex justify-between text-[4px] text-zinc-700 font-medium"><span>Gestion de Projet</span></div>
                    <div className="w-full h-1 bg-zinc-200/70 rounded-full overflow-hidden mt-0.5">
                      <div className="h-full rounded-full" style={{ width: '85%', backgroundColor: color }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[4px] text-zinc-700 font-medium"><span>Stratégie Digitale</span></div>
                    <div className="w-full h-1 bg-zinc-200/70 rounded-full overflow-hidden mt-0.5">
                      <div className="h-full rounded-full" style={{ width: '90%', backgroundColor: color }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[4px] text-zinc-700 font-medium"><span>UX / UI Design</span></div>
                    <div className="w-full h-1 bg-zinc-200/70 rounded-full overflow-hidden mt-0.5">
                      <div className="h-full rounded-full" style={{ width: '75%', backgroundColor: color }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom languages */}
            <div className="space-y-1 border-t border-zinc-200/60 pt-2">
              <div className="font-extrabold uppercase tracking-wider text-[4px]" style={{ color }}>Langues</div>
              <div className="text-[4px] text-zinc-600 font-medium">
                <div>Français (Natif)</div>
                <div>Anglais (C1 - Courant)</div>
              </div>
            </div>
          </div>

          {/* Right principal column */}
          <div className="w-[65%] h-full p-3 flex flex-col justify-between">
            <div>
              {/* Header: Name, Colored position title */}
              <div className="mb-2.5">
                <h1 className="text-[10px] font-black tracking-tight text-zinc-900 leading-none">SACHA DUBOIS</h1>
                <div className="inline-block px-1.5 py-0.5 mt-1 rounded-md text-[4.5px] font-extrabold uppercase tracking-widest text-white" style={{ backgroundColor: color }}>
                  Chef de Projet Digital
                </div>
              </div>

              {/* Profile Intro */}
              <div className="mb-2.5 space-y-0.5">
                <h2 className="text-[5px] font-extrabold uppercase tracking-wider border-b pb-0.5" style={{ borderColor: `${color}30`, color }}>Profil</h2>
                <p className="text-[4px] text-zinc-600 leading-relaxed">
                  Professionnelle passionnée avec 5 ans d'expérience dans la conduite de projets web et d'applications mobiles. Experte en pilotage d'équipes et méthodologies agiles.
                </p>
              </div>

              {/* Professional Experience */}
              <div className="space-y-2">
                <h2 className="text-[5px] font-extrabold uppercase tracking-wider border-b pb-0.5" style={{ borderColor: `${color}30`, color }}>Expériences professionnelles</h2>
                
                <div className="space-y-0.5">
                  <div className="flex justify-between font-bold text-zinc-800 text-[4.5px]">
                    <span>Chef de Projet Senior — Agence Digital</span>
                    <span className="text-zinc-400 font-normal">2023 - Présent</span>
                  </div>
                  <p className="text-[4px] text-zinc-500 italic">Direction d'une équipe de 8 ingénieurs, livraison de 12 applications SaaS.</p>
                </div>

                <div className="space-y-0.5">
                  <div className="flex justify-between font-bold text-zinc-800 text-[4.5px]">
                    <span>Consultante Digitale — Global Media</span>
                    <span className="text-zinc-400 font-normal">2021 - 2023</span>
                  </div>
                  <p className="text-[4px] text-zinc-500 italic">Optimisation des tunnels d'acquisition client, croissance de +40% du CA.</p>
                </div>
              </div>
            </div>

            {/* Education / Diploma */}
            <div className="space-y-1.5 pt-1.5 border-t border-zinc-100">
              <h2 className="text-[5px] font-extrabold uppercase tracking-wider" style={{ color }}>Formation</h2>
              <div className="text-[4px] text-zinc-700">
                <span className="font-bold text-zinc-800">Master Marketing Digital</span> — Université de Paris (2021)
              </div>
            </div>
          </div>
        </div>
      );

    case 'moderne':
      // Template Tech / Moderne: clean, grid layout, square photo right, styled badges
      return (
        <div className="w-full h-full bg-white text-[5.5px] p-3 flex flex-col justify-between font-sans select-none pointer-events-none">
          <div>
            {/* Header row */}
            <div className="flex items-center justify-between border-b-2 pb-2 mb-2" style={{ borderColor: color }}>
              <div>
                <h1 className="text-[10px] font-black tracking-tight text-zinc-900 leading-tight">ALFRED BERNARD</h1>
                <div className="text-[5.5px] font-bold uppercase tracking-wider" style={{ color }}>Développeur Full-Stack</div>
              </div>
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-zinc-100 shadow-xs shrink-0">
                <img src={maleAvatar} alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="grid grid-cols-12 gap-2.5">
              {/* Main content 65% */}
              <div className="col-span-8 space-y-2">
                <div className="space-y-1.5">
                  <div className="font-extrabold text-[5px] uppercase tracking-wider text-zinc-800">Expérience Récente</div>
                  
                  <div className="space-y-1">
                    <div>
                      <div className="font-bold text-[4.5px] text-zinc-900">Lead Tech React — TechCorp Paris</div>
                      <div className="text-[4px] text-zinc-400">2024 - Présent</div>
                      <p className="text-[4px] text-zinc-600 leading-normal">Architecture d'une plateforme SaaS à forte charge. Encadrement de 4 développeurs juniors.</p>
                    </div>

                    <div>
                      <div className="font-bold text-[4.5px] text-zinc-900">Ingénieur Front — StartupX</div>
                      <div className="text-[4px] text-zinc-400">2022 - 2024</div>
                      <p className="text-[4px] text-zinc-600 leading-normal">Développement du design system en Tailwind et intégration de l'API de paiement.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar 35% */}
              <div className="col-span-4 space-y-2 border-l border-zinc-100 pl-2">
                <div className="space-y-1.5">
                  <div className="font-bold text-[5px] uppercase tracking-wider text-zinc-800">Compétences</div>
                  <div className="flex flex-wrap gap-1">
                    {['React', 'Node.js', 'TypeScript', 'Docker', 'AWS'].map(s => (
                      <span key={s} className="px-1 py-0.5 bg-zinc-50 border border-zinc-150 text-[3.8px] font-bold rounded-sm text-zinc-700" style={{ borderLeftColor: color, borderLeftWidth: '1.5px' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 pt-1 border-t border-zinc-50">
                  <div className="font-bold text-[4.5px] uppercase text-zinc-800">Contact</div>
                  <div className="text-[3.8px] text-zinc-500 space-y-0.5">
                    <div className="truncate">alfred@tech.io</div>
                    <div>+33 7 89 01 23 45</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer info */}
          <div className="text-center text-[4px] text-zinc-400 pt-1 border-t border-zinc-100">
            Portfolio: alfredbernard.dev • GitHub: @alfredb
          </div>
        </div>
      );

    case 'international':
      // Harvard / Mckinsey style: Centered, Single Column, No Photo, Serif, Double lines, Maximum ATS efficiency
      return (
        <div className="w-full h-full bg-white text-[5.2px] p-3.5 flex flex-col justify-between font-serif select-none pointer-events-none">
          <div className="space-y-2.5">
            {/* Header centered */}
            <div className="text-center space-y-1 border-b pb-1.5" style={{ borderColor: color }}>
              <h1 className="text-[11px] font-bold tracking-wider text-zinc-950 uppercase">JEAN-GUILLAUME DE LA ROCHE</h1>
              <div className="text-[4.5px] text-zinc-500 font-medium tracking-wide">
                Paris, France | +33 (0)1 42 00 11 22 | jg.laroche@executive-alumni.com | linkedin.com/in/laroche
              </div>
            </div>

            {/* Profile Summary */}
            <div className="space-y-1">
              <h2 className="text-[5px] font-bold uppercase tracking-wider text-zinc-950 border-b pb-0.5" style={{ borderBottomColor: color }}>PROFIL SUMMARY</h2>
              <p className="text-[4px] text-zinc-700 leading-normal italic text-justify">
                Directeur financier aguerri avec 12+ années d'expérience en fusions-acquisitions et restructurations d'entreprises. Spécialiste du conseil en stratégie auprès des instances de direction générale.
              </p>
            </div>

            {/* Experience timeline */}
            <div className="space-y-1.5">
              <h2 className="text-[5px] font-bold uppercase tracking-wider text-zinc-950 border-b pb-0.5" style={{ borderBottomColor: color }}>PROFESSIONAL EXPERIENCE</h2>
              
              <div className="space-y-1">
                <div>
                  <div className="flex justify-between font-bold text-zinc-900 text-[4.5px]">
                    <span>VP FINANCE & STRATÉGIE — CABINET GIBSON & PARTNERS</span>
                    <span>2022 - PRESENT</span>
                  </div>
                  <div className="text-[4px] text-zinc-500 italic">Paris, France</div>
                  <p className="text-[4px] text-zinc-600 leading-normal pl-1.5">
                    • Supervision de 8 audits d'acquisition transfrontaliers pour un total d'actifs de 450M€.<br/>
                    • Optimisation de la structure fiscale de 3 filiales, générant 4.2M€ d'économies annuelles.
                  </p>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-zinc-900 text-[4.5px]">
                    <span>ASSOCIÉ M&A — LAZARD FRÈRES</span>
                    <span>2018 - 2022</span>
                  </div>
                  <div className="text-[4px] text-zinc-500 italic">Londres, Royaume-Uni</div>
                  <p className="text-[4px] text-zinc-600 leading-normal pl-1.5">
                    • Exécution de transactions de capital-investissement pour des fonds paneuropéens.
                  </p>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="space-y-1">
              <h2 className="text-[5px] font-bold uppercase tracking-wider text-zinc-950 border-b pb-0.5" style={{ borderBottomColor: color }}>EDUCATION</h2>
              <div className="flex justify-between font-bold text-zinc-900 text-[4.2px]">
                <span>HEC Paris — Master Grande École en Finance (Major de Promotion)</span>
                <span>2018</span>
              </div>
            </div>
          </div>
        </div>
      );

    case 'classique':
      // Classic serif elegant layout, traditional corporate look with left-side alignment and serif fonts
      return (
        <div className="w-full h-full bg-white text-[5.2px] p-3.5 flex flex-col justify-between font-serif select-none pointer-events-none">
          <div className="space-y-3">
            {/* Header Left name, right contacts */}
            <div className="flex justify-between items-start border-b pb-2" style={{ borderColor: `${color}40` }}>
              <div>
                <h1 className="text-[10px] font-bold text-zinc-900 uppercase tracking-tight">STÉPHANIE MERCIER</h1>
                <div className="text-[5px] italic text-zinc-600" style={{ color }}>Avocate au Barreau de Paris</div>
              </div>
              <div className="text-right text-[3.8px] text-zinc-500 leading-normal">
                <div>s.mercier@cabinet-avocat.fr</div>
                <div>+33 1 76 54 32 10</div>
                <div>Paris 8e, France</div>
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-2">
              <h2 className="text-[5px] font-extrabold uppercase tracking-widest text-zinc-800" style={{ color }}>EXPÉRIENCE JURIDIQUE</h2>
              
              <div className="space-y-1.5 pl-1">
                <div>
                  <div className="flex justify-between font-bold text-zinc-900 text-[4.5px]">
                    <span>Avocate Collaboratrice — Cabinet Linklaters</span>
                    <span className="text-zinc-400">2021 - Présent</span>
                  </div>
                  <p className="text-[4px] text-zinc-600 leading-relaxed">
                    Spécialisation en droit des affaires et contentieux commerciaux complexes. Rédaction de 40+ conclusions par an et plaidoiries devant le Tribunal de Commerce.
                  </p>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-zinc-900 text-[4.5px]">
                    <span>Juriste Droit Social — Hermès International</span>
                    <span className="text-zinc-400">2019 - 2021</span>
                  </div>
                  <p className="text-[4px] text-zinc-600 leading-relaxed">
                    Négociation d'accords collectifs d'entreprise et gestion des contentieux prud'homaux.
                  </p>
                </div>
              </div>
            </div>

            {/* Formation */}
            <div className="space-y-1">
              <h2 className="text-[5px] font-extrabold uppercase tracking-widest text-zinc-800" style={{ color }}>DIPLÔMES & CERTIFICATIONS</h2>
              <div className="text-[4px] text-zinc-700 pl-1">
                <span className="font-bold text-zinc-900">CAPA (Certificat d'Aptitude à la Profession d'Avocat)</span> — EFB Paris (2019)<br/>
                <span className="font-bold text-zinc-900">Master II Droit des Affaires</span> — Université Paris II Panthéon-Assas (2018)
              </div>
            </div>
          </div>
        </div>
      );

    case 'creatif':
      // Creative Studio Bold: Large colorful top header block, rounded avatar on left, 2 columns below
      return (
        <div className="w-full h-full bg-white text-[5.5px] flex flex-col justify-between font-sans overflow-hidden select-none pointer-events-none">
          {/* Solid Top Banner */}
          <div className="p-3 text-white flex items-center gap-3" style={{ backgroundColor: color }}>
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/60 shrink-0 shadow-md">
              <img src={femaleAvatar} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-[10px] font-black tracking-wider leading-none">MARGOT LEROY</h1>
              <div className="text-[5px] font-bold text-white/95 mt-1 tracking-widest uppercase">Directrice Artistique & UI</div>
            </div>
          </div>

          <div className="p-3 grid grid-cols-12 gap-3 flex-1">
            {/* Left side 7 columns */}
            <div className="col-span-8 space-y-2.5">
              <div className="space-y-1">
                <div className="font-extrabold text-[4.8px] uppercase tracking-wider" style={{ color }}>Projets Créatifs</div>
                <div className="space-y-1.5">
                  <div>
                    <div className="font-bold text-[4.5px] text-zinc-800">Refonte Mobile — Studio Éclipse</div>
                    <p className="text-[3.8px] text-zinc-600 leading-normal">
                      Création d'une identité de marque vibrante et d'une interface mobile immersive. Augmentation du taux de rétention de +50%.
                    </p>
                  </div>
                  <div>
                    <div className="font-bold text-[4.5px] text-zinc-800">Identité Visuelle — Maison Bloom</div>
                    <p className="text-[3.8px] text-zinc-600 leading-normal">
                      Direction artistique complète : charte graphique, site e-commerce et packagings éco-conçus.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side 4 columns */}
            <div className="col-span-4 space-y-2 border-l border-zinc-100 pl-2">
              <div className="space-y-1">
                <div className="font-extrabold text-[4.5px] uppercase" style={{ color }}>Outils</div>
                <div className="flex flex-wrap gap-0.5">
                  {['Figma', 'Illustrator', 'Photoshop', 'Indesign', 'After Effects'].map(tool => (
                    <span key={tool} className="px-1 py-0.5 bg-zinc-50 border border-zinc-200 text-[3.5px] font-medium text-zinc-600 rounded">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1 pt-1.5 border-t border-zinc-100">
                <div className="font-extrabold text-[4.5px] uppercase" style={{ color }}>Contact</div>
                <div className="text-[3.8px] text-zinc-500 space-y-0.5">
                  <div>margot@creative.fr</div>
                  <div>Nantes, France</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'minimal':
      // Ultra Minimal Single-Page: High contrast, wide margins, elegant date on left margin, super clean Swiss grid
      return (
        <div className="w-full h-full bg-white text-[5.2px] p-4 flex flex-col justify-between font-sans select-none pointer-events-none">
          <div className="space-y-3.5">
            {/* Minimal Header */}
            <div>
              <h1 className="text-[11px] font-black tracking-tight text-zinc-900">MATHIEU NOÉ</h1>
              <p className="text-[5px] text-zinc-500 font-bold tracking-wider uppercase mt-0.5" style={{ color }}>Consultant en Relations Publiques</p>
              <div className="text-[4px] text-zinc-400 mt-1">
                m.noe@pr-agency.com • +33 6 99 88 77 66 • Lyon, France
              </div>
            </div>

            {/* Experience with Left date margin */}
            <div className="space-y-2">
              <h2 className="text-[4.5px] font-bold text-zinc-400 uppercase tracking-widest border-b pb-0.5">Expérience professionnelle</h2>
              
              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-1">
                  <div className="col-span-3 text-zinc-400 font-bold text-[4px]">2022 - Présent</div>
                  <div className="col-span-9">
                    <div className="font-bold text-[4.5px] text-zinc-900">Directeur de Clientèle — PR Studio</div>
                    <p className="text-[3.8px] text-zinc-600 mt-0.5 leading-normal">
                      Gestion de comptes RP d'influence pour des entreprises de la FrenchTech. Organisation de 15 conférences de presse d'envergure nationale.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-1">
                  <div className="col-span-3 text-zinc-400 font-bold text-[4px]">2020 - 2022</div>
                  <div className="col-span-9">
                    <div className="font-bold text-[4.5px] text-zinc-900">Attaché de Presse — Havas Media</div>
                    <p className="text-[3.8px] text-zinc-600 mt-0.5 leading-normal">
                      Rédaction de communiqués et relations quotidiennes avec les journalistes économiques et tech.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="space-y-1">
              <h2 className="text-[4.5px] font-bold text-zinc-400 uppercase tracking-widest border-b pb-0.5">Formation</h2>
              <div className="grid grid-cols-12 gap-1">
                <div className="col-span-3 text-zinc-400 font-bold text-[4px]">2020</div>
                <div className="col-span-9 text-zinc-800 font-bold text-[4px]">
                  Master Info-Communication — EFAP Lyon
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'pro':
      // Professionnel Elite Header: Full width color block header, two asymmetric columns below
      return (
        <div className="w-full h-full bg-white text-[5.2px] flex flex-col justify-between font-sans overflow-hidden select-none pointer-events-none">
          {/* Large elite header */}
          <div className="p-3 text-white flex justify-between items-center" style={{ backgroundColor: color }}>
            <div>
              <h1 className="text-[10px] font-extrabold tracking-tight">CAMILLE ROUSSEL</h1>
              <div className="text-[4.8px] font-bold tracking-widest text-white/90 uppercase mt-0.5">Directrice des Ressources Humaines</div>
            </div>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/40 shadow-sm shrink-0">
              <img src={femaleAvatar} alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Left Column (30%) */}
            <div className="w-[30%] h-full p-2.5 bg-zinc-50 border-r border-zinc-100 space-y-3">
              <div className="space-y-1">
                <div className="font-extrabold text-[4.5px] uppercase" style={{ color }}>Contact</div>
                <div className="text-[3.8px] text-zinc-600 space-y-0.5">
                  <div>c.roussel@rh-elite.fr</div>
                  <div>+33 6 45 32 12 00</div>
                  <div>Strasbourg, FR</div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="font-extrabold text-[4.5px] uppercase" style={{ color }}>Savoir-être</div>
                <div className="space-y-0.5 text-[3.8px] text-zinc-600">
                  <div>• Leadership agile</div>
                  <div>• Négociation CSE</div>
                  <div>• Recrutement C-Level</div>
                </div>
              </div>
            </div>

            {/* Right Column (70%) */}
            <div className="w-[70%] h-full p-3.5 space-y-2.5">
              <div className="space-y-1">
                <div className="font-extrabold text-[4.5px] uppercase tracking-wider" style={{ color }}>Expérience RH</div>
                
                <div className="space-y-1.5">
                  <div>
                    <div className="flex justify-between font-bold text-zinc-800 text-[4px]">
                      <span>DRH — Groupe EuroLogistics</span>
                      <span className="text-zinc-400 font-normal">2022 - Présent</span>
                    </div>
                    <p className="text-[3.8px] text-zinc-600 mt-0.5">
                      Encadrement de l'équipe RH (4 collaborateurs). Gestion du dialogue social pour 350 salariés, accord d'intéressement.
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-zinc-800 text-[4px]">
                      <span>Responsable Recrutement — TalentCorp</span>
                      <span className="text-zinc-400 font-normal">2019 - 2022</span>
                    </div>
                    <p className="text-[3.8px] text-zinc-600 mt-0.5">
                      Recrutement de 120 profils techniques et supports par an.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'tech_lead':
      // Tech Lead Terminal Grid: Code styles, terminal header block, grid of tech badges
      return (
        <div className="w-full h-full bg-zinc-950 text-emerald-400 text-[5px] p-3 flex flex-col justify-between font-mono select-none pointer-events-none">
          <div>
            {/* Terminal Top Line */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5 mb-2">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                <span className="text-zinc-500 text-[4px] ml-1">bash - resume_dev.sh</span>
              </div>
              <span className="text-zinc-600 text-[4.2px]">IP: 192.168.1.42</span>
            </div>

            {/* Profile Intro */}
            <div className="space-y-1 mb-2">
              <h1 className="text-[9px] font-black tracking-tight text-white leading-none">LOÏC MARTINEZ</h1>
              <div className="text-zinc-400 text-[4.5px]">
                <span className="text-emerald-400">$</span> cat current_role.json
              </div>
              <div className="text-zinc-300 bg-zinc-900 p-1 rounded border border-zinc-850 text-[3.8px]">
                {`"role": "Lead DevOps & Cloud Engineer", "level": "L6 / Senior"`}
              </div>
            </div>

            {/* Stack grid */}
            <div className="space-y-1 mb-2">
              <div className="text-zinc-400 text-[4.2px]">
                <span className="text-emerald-400">$</span> ./show_stack.sh
              </div>
              <div className="flex flex-wrap gap-1">
                {['Kubernetes', 'Terraform', 'Go', 'Python', 'AWS', 'CI-CD'].map(stack => (
                  <span key={stack} className="px-1 py-0.5 bg-emerald-950/40 border border-emerald-900 text-emerald-300 text-[3.8px] rounded font-bold">
                    [{stack}]
                  </span>
                ))}
              </div>
            </div>

            {/* Exp */}
            <div className="space-y-1">
              <div className="text-zinc-400 text-[4.2px]">
                <span className="text-emerald-400">$</span> grep -A 2 "experience" portfolio.md
              </div>
              <div className="space-y-1 bg-zinc-900/60 p-1 rounded border border-zinc-900">
                <div>
                  <div className="text-white font-bold text-[3.8px]">**DevOps Architect @ CloudSolutions** (2022-Present)</div>
                  <p className="text-zinc-400 text-[3.5px] leading-tight">Migration infra on-premise vers cloud AWS. Reduction des couts de run de 30%.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[3.5px] text-zinc-600 text-center">
            Last update: Jul 2026 • system_status: STABLE
          </div>
        </div>
      );

    case 'nordic':
      // Nordic Clean Architecture: Forest/teal elements, very soft beige background, elegant minimalist layout
      return (
        <div className="w-full h-full bg-stone-50 text-[5.4px] p-3.5 flex flex-col justify-between font-sans select-none pointer-events-none">
          <div className="space-y-3">
            {/* Header with Forest/Teal touch */}
            <div className="flex justify-between items-end border-b pb-1.5" style={{ borderColor: `${color}30` }}>
              <div>
                <h1 className="text-[10px] font-black tracking-tight text-stone-900">ELIN LARSSON</h1>
                <p className="text-[4.5px] font-medium tracking-wide" style={{ color }}>Consultante en Éco-Conception</p>
              </div>
              <div className="text-right text-[3.8px] text-stone-500">
                <div>elin@nordic-green.se</div>
                <div>Paris, France</div>
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-2">
              <h2 className="text-[4.8px] font-extrabold uppercase tracking-widest text-stone-700">PARCOURS DURABLE</h2>
              
              <div className="space-y-1.5">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-stone-900 text-[4.5px]">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }}></span>
                    <span>Chef de Projet RSE — GreenTech France</span>
                    <span className="text-stone-400 font-normal ml-auto">2023 - Présent</span>
                  </div>
                  <p className="text-[3.8px] text-stone-600 pl-3 leading-normal">
                    Réalisation de bilans carbone complets pour 15 entreprises du CAC 40. Définition de plans d'action d'éco-conception logicielle.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 font-bold text-stone-900 text-[4.5px]">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }}></span>
                    <span>Consultante Junior — Cabinet Terra</span>
                    <span className="text-stone-400 font-normal ml-auto">2021 - 2023</span>
                  </div>
                  <p className="text-[3.8px] text-stone-600 pl-3 leading-normal">
                    Accompagnement à l'obtention de la certification B-Corp.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-stone-400 text-[3.8px] text-center italic">
            "Penser globalement, agir localement."
          </div>
        </div>
      );

    case 'monochrome':
      // Monochrome Editorial Ink: Sharp Editorial layout, Wall Street Journal look, elegant typography dividers
      return (
        <div className="w-full h-full bg-white text-[5.2px] p-4 flex flex-col justify-between font-serif select-none pointer-events-none border border-zinc-150">
          <div className="space-y-3.5">
            {/* Editorial Title */}
            <div className="text-center space-y-1 border-b-2 border-zinc-900 pb-2">
              <h1 className="text-[11px] font-black tracking-widest text-zinc-950 uppercase">FRANÇOIS DE VALOIS</h1>
              <div className="text-[4px] font-bold text-zinc-500 uppercase tracking-widest">Rédacteur en Chef • Journaliste Littéraire</div>
            </div>

            {/* 2 Equal Columns separated by solid line */}
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-8 space-y-2">
                <div className="space-y-1">
                  <div className="font-bold text-[4.8px] uppercase tracking-wider text-zinc-950 border-b border-zinc-200 pb-0.5">PUBLICATIONS ET CARRIÈRE</div>
                  
                  <div className="space-y-1">
                    <div>
                      <div className="font-bold text-[4.2px] text-zinc-900">Rédacteur Senior — Le Figaro Littéraire</div>
                      <p className="text-[3.8px] text-zinc-700 italic leading-relaxed">
                        Chroniqueur hebdomadaire d'essais philosophiques et de romans francophones. Direction d'une équipe de 4 journalistes.
                      </p>
                    </div>

                    <div>
                      <div className="font-bold text-[4.2px] text-zinc-900">Journaliste Culture — Télérama</div>
                      <p className="text-[3.8px] text-zinc-700 italic leading-relaxed">
                        Interviews exclusives de cinéastes et couverture des festivals littéraires de renommée internationale.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-4 border-l border-zinc-900 pl-2.5 space-y-2">
                <div className="space-y-1">
                  <div className="font-bold text-[4.5px] uppercase tracking-wider text-zinc-950">CONTACT</div>
                  <div className="text-[3.8px] text-zinc-600 space-y-0.5 font-sans">
                    <div>f.valois@presse-actu.fr</div>
                    <div>+33 1 89 76 54 32</div>
                    <div>Paris, France</div>
                  </div>
                </div>

                <div className="space-y-1 pt-1 border-t border-zinc-200">
                  <div className="font-bold text-[4.5px] uppercase tracking-wider text-zinc-950">LANGUES</div>
                  <div className="text-[3.8px] text-zinc-600 font-sans">
                    Français (Natif)<br/>Italien (B2)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'vibrant':
      // Vibrant Pulse Marketing: fresh layout, modern sans-serif, colorful circle indicators
      return (
        <div className="w-full h-full bg-white text-[5.5px] p-3 flex flex-col justify-between font-sans select-none pointer-events-none">
          <div className="space-y-2.5">
            {/* Vibrant Header with big color spot */}
            <div className="flex items-center justify-between border-l-4 pl-2.5 py-0.5" style={{ borderColor: color }}>
              <div>
                <h1 className="text-[10px] font-black tracking-tight text-zinc-950">ZOÉ MARIN</h1>
                <p className="text-[5px] font-extrabold uppercase tracking-widest mt-0.5" style={{ color }}>Growth Marketer & Acquisition Specialist</p>
              </div>
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-zinc-100 shadow-sm shrink-0">
                <img src={femaleAvatar} alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-1.5 py-1 bg-zinc-50 rounded-lg text-center border border-zinc-100">
              <div>
                <div className="text-[5px] font-bold text-zinc-400 uppercase">ACQUISITION</div>
                <div className="text-[6.5px] font-black" style={{ color }}>+140%</div>
              </div>
              <div className="border-x border-zinc-200">
                <div className="text-[5px] font-bold text-zinc-400 uppercase">ROI MOYEN</div>
                <div className="text-[6.5px] font-black" style={{ color }}>4.8x</div>
              </div>
              <div>
                <div className="text-[5px] font-bold text-zinc-400 uppercase">BUDGET GÉRÉ</div>
                <div className="text-[6.5px] font-black" style={{ color }}>1.2M€</div>
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-1.5">
              <h2 className="text-[5px] font-black uppercase tracking-wider text-zinc-800">EXPÉRIENCES D'IMPACT</h2>
              
              <div className="space-y-1">
                <div>
                  <div className="flex justify-between font-bold text-zinc-900 text-[4.5px]">
                    <span>Growth Hacker Lead — FoodTech App</span>
                    <span className="text-zinc-400 font-normal">2023 - Présent</span>
                  </div>
                  <p className="text-[3.8px] text-zinc-600 leading-normal pl-1 border-l" style={{ borderColor: `${color}40` }}>
                    • Lancement des campagnes SEA / Social Ads avec un CPA réduit de 45%.<br/>
                    • Amélioration du taux de conversion mobile de +2.2 points de pourcentage.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-right text-[3.8px] text-zinc-500 font-medium">
            zoe@growthpulse.fr • Paris, FR
          </div>
        </div>
      );

    case 'academic':
      // Académique & Recherche: Traditional, structured single column, publications block, serif font
      return (
        <div className="w-full h-full bg-white text-[5.2px] p-4 flex flex-col justify-between font-serif select-none pointer-events-none">
          <div className="space-y-3">
            {/* Header */}
            <div className="text-center space-y-1 border-b border-zinc-200 pb-1.5">
              <h1 className="text-[10px] font-extrabold tracking-wide text-zinc-900">DR. PIERRE-YVES LAURENT</h1>
              <p className="text-[4.5px] text-zinc-600 italic">Chercheur en Intelligence Artificielle & Sciences Cognitives</p>
              <p className="text-[3.8px] text-zinc-400">pierre-yves.laurent@universite.fr • CNRS UMR 8001 • Paris, France</p>
            </div>

            {/* Education */}
            <div className="space-y-1.5">
              <h2 className="text-[4.8px] font-extrabold uppercase tracking-wide border-b border-zinc-300 pb-0.5" style={{ color }}>EDUCATION & TITRES</h2>
              <div className="space-y-1">
                <div>
                  <div className="flex justify-between text-[4.2px] font-bold text-zinc-900">
                    <span>Doctorat (Ph.D.) en Informatique Mathématique</span>
                    <span>2019</span>
                  </div>
                  <div className="text-[3.8px] text-zinc-500">Sorbonne Université, Paris • Félicitations du jury de thèse</div>
                </div>
              </div>
            </div>

            {/* Research & Publications */}
            <div className="space-y-1.5">
              <h2 className="text-[4.8px] font-extrabold uppercase tracking-wide border-b border-zinc-300 pb-0.5" style={{ color }}>PUBLICATIONS SÉLECTIONNÉES</h2>
              <div className="space-y-1 text-[3.8px] text-zinc-700 leading-normal pl-1">
                <div>
                  1. **Laurent, P.-Y.** & Dubois, S. (2025). "Deep Learning Architectures for Neuroimaging analysis." *Journal of Artificial Intelligence Research*, 42(3), 112-135.
                </div>
                <div>
                  2. **Laurent, P.-Y.** (2023). "Cognitive structures and multi-agent neural feedback loops." *IEEE Transactions on Cognitive Systems*, 12(1), 45-56.
                </div>
              </div>
            </div>

            {/* Teaching */}
            <div className="space-y-1">
              <h2 className="text-[4.8px] font-extrabold uppercase tracking-wide border-b border-zinc-300 pb-0.5" style={{ color }}>ENSEIGNEMENT</h2>
              <div className="text-[4px] text-zinc-700">
                <span className="font-bold text-zinc-900">Maitre de Conférences Associé</span> — ENS Paris (250 heures / an de cours de Master en Machine Learning)
              </div>
            </div>
          </div>
        </div>
      );

    default:
      // High-end elegant default fallback
      return (
        <div className="w-full h-full bg-white p-3.5 text-[5.5px] flex flex-col justify-between font-sans select-none pointer-events-none">
          <div>
            <div className="text-center border-b pb-2 mb-2" style={{ borderColor: `${color}30` }}>
              <h1 className="text-[9.5px] font-black tracking-wider text-zinc-900 uppercase">NATHALIE DUPONT</h1>
              <div className="text-[4.5px] text-zinc-600 font-medium tracking-widest uppercase mt-0.5" style={{ color }}>Responsable Commerciale</div>
            </div>
            
            <div className="space-y-2">
              <div className="space-y-1">
                <div className="text-[4.5px] font-bold uppercase tracking-wider text-zinc-800">Parcours Commercial</div>
                <div className="space-y-1">
                  <div>
                    <div className="flex justify-between font-bold text-[4.2px] text-zinc-900">
                      <span>Directrice de Clientèle — SalesForce France</span>
                      <span>2022 - Présent</span>
                    </div>
                    <p className="text-[3.8px] text-zinc-600 leading-relaxed">
                      Pilotage du portefeuille de comptes clés d'une valeur de 4.5M€. Négociation et closing de contrats B2B complexes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center text-[3.8px] text-zinc-400 border-t pt-1.5">
            nathalie.dupont@email.com • +33 6 12 34 56 78 • Paris
          </div>
        </div>
      );
  }
};
