import React from 'react';
import { TemplateId } from '../types/cv';
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  Award,
  Briefcase,
  GraduationCap,
  Code,
  Terminal,
  Activity,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Building2,
  Scale
} from 'lucide-react';

interface TemplateMockupProps {
  templateId: TemplateId;
  color?: string;
  isExpanded?: boolean;
}

export const TemplateMockup: React.FC<TemplateMockupProps> = ({
  templateId,
  color = '#2563eb',
  isExpanded = false,
}) => {
  const accentColor = color;

  // 1. SPLIT_LEFT (Graphicforest Dark)
  if (templateId === 'split_left') {
    return (
      <div className="w-full h-full bg-white flex text-[8px] sm:text-[9px] select-none font-sans overflow-hidden">
        {/* Left Dark Sidebar */}
        <div className="w-[38%] bg-[#1c1f26] text-white p-2.5 sm:p-3 flex flex-col justify-between relative">
          <div className="text-center space-y-1.5 my-1">
            <div
              className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border-2 mx-auto bg-zinc-800 flex items-center justify-center font-bold text-amber-300 shadow-md text-xs"
              style={{ borderColor: accentColor }}
            >
              BB
            </div>
            <p className="text-[7.5px] font-extrabold text-white tracking-tight">BRIAN BAXTER</p>
          </div>

          <div className="space-y-1">
            <div className="text-[6.5px] font-extrabold tracking-wider uppercase border-b border-zinc-700 pb-0.5" style={{ color: accentColor }}>
              CONTACT
            </div>
            <div className="space-y-0.5 text-[6px] text-zinc-300">
              <div className="flex items-center gap-1"><Phone className="w-2 h-2" /> +33 6 12 34 56 78</div>
              <div className="flex items-center gap-1"><Mail className="w-2 h-2" /> brian@studio.com</div>
              <div className="flex items-center gap-1"><MapPin className="w-2 h-2" /> Paris, France</div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[6.5px] font-extrabold tracking-wider uppercase border-b border-zinc-700 pb-0.5" style={{ color: accentColor }}>
              REFERENCES
            </div>
            <div className="text-[6px] text-zinc-300 leading-tight">
              <p className="font-bold text-white">DARWIN R. MAGANA</p>
              <p className="text-zinc-400">Creative Director, Agency</p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[6.5px] font-extrabold tracking-wider uppercase border-b border-zinc-700 pb-0.5" style={{ color: accentColor }}>
              EDUCATION
            </div>
            <div className="text-[6px] text-zinc-300 leading-tight">
              <p className="font-bold text-white">STANFORD UNIVERSITY</p>
              <p className="text-zinc-400">Master Degree • 2020</p>
            </div>
          </div>
        </div>

        {/* Right Content Column */}
        <div className="w-[62%] bg-white text-zinc-900 p-3 flex flex-col justify-between relative">
          <div>
            <h4 className="text-[11px] font-extrabold text-zinc-900 uppercase tracking-tight leading-none">
              BRIAN R. <span style={{ color: accentColor }}>BAXTER</span>
            </h4>
            <p className="text-[6.5px] font-bold tracking-widest text-zinc-500 uppercase mt-0.5">
              GRAPHIC & WEB DESIGNER
            </p>
            <div className="h-1 w-8 rounded-full mt-1" style={{ backgroundColor: accentColor }} />
          </div>

          <div className="space-y-0.5 mt-1">
            <div className="text-[7px] font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
              ABOUT ME
            </div>
            <p className="text-[5.5px] text-zinc-500 leading-tight line-clamp-2">
              Passionate and result-driven specialist with over 8 years of experience leading high-impact projects.
            </p>
          </div>

          <div className="space-y-1 mt-1">
            <div className="text-[7px] font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
              JOB EXPERIENCE
            </div>
            <div className="space-y-1 text-[6px]">
              <div className="border-l-2 pl-1.5" style={{ borderColor: accentColor }}>
                <p className="font-bold text-zinc-900">SENIOR WEB DESIGNER</p>
                <p className="text-zinc-400 text-[5px]">Creative Agency / 2022 - Present</p>
              </div>
              <div className="border-l-2 pl-1.5 border-zinc-200">
                <p className="font-bold text-zinc-800">GRAPHIC DESIGNER</p>
                <p className="text-zinc-400 text-[5px]">Digital Studio / 2019 - 2022</p>
              </div>
            </div>
          </div>

          <div className="space-y-0.5 mt-1">
            <div className="text-[7px] font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
              SKILLS
            </div>
            <div className="space-y-0.5 text-[5.5px]">
              <div>
                <div className="flex justify-between font-bold text-zinc-700">
                  <span>UI/UX Architecture</span>
                  <span>95%</span>
                </div>
                <div className="w-full bg-zinc-100 h-1 rounded-full overflow-hidden mt-0.5">
                  <div className="h-full rounded-full" style={{ width: '95%', backgroundColor: accentColor }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. MODERNE (Moderne Minimal)
  if (templateId === 'moderne') {
    return (
      <div className="w-full h-full bg-white flex text-[8px] sm:text-[9px] select-none font-sans overflow-hidden">
        <div className="w-[32%] bg-zinc-50 border-r border-zinc-200 p-2.5 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg mx-auto bg-zinc-900 flex items-center justify-center font-bold text-white text-xs shadow-sm">
              BB
            </div>
            <div className="text-center">
              <p className="text-[8px] font-bold text-zinc-900">Brian Baxter</p>
              <p className="text-[6px] text-zinc-500">Tech Product Lead</p>
            </div>
          </div>

          <div className="space-y-1.5 text-[6px]">
            <p className="font-bold text-zinc-800 uppercase tracking-wider border-b border-zinc-200 pb-0.5">Contact</p>
            <p className="text-zinc-600">brian@tech.io</p>
            <p className="text-zinc-600">+33 6 00 11 22 33</p>
            <p className="text-zinc-600">Paris, FR</p>
          </div>

          <div className="space-y-1 text-[6px]">
            <p className="font-bold text-zinc-800 uppercase tracking-wider border-b border-zinc-200 pb-0.5">Skills</p>
            <div className="flex flex-wrap gap-0.5">
              <span className="px-1 py-0.5 rounded text-[5px] font-bold text-white" style={{ backgroundColor: accentColor }}>React</span>
              <span className="px-1 py-0.5 bg-zinc-200 rounded text-[5px] text-zinc-700 font-semibold">TypeScript</span>
              <span className="px-1 py-0.5 bg-zinc-200 rounded text-[5px] text-zinc-700 font-semibold">Node.js</span>
            </div>
          </div>
        </div>

        <div className="w-[68%] p-3 flex flex-col justify-between bg-white">
          <div className="border-b border-zinc-100 pb-2">
            <h3 className="text-[12px] font-extrabold text-zinc-900 tracking-tight">
              Brian <span style={{ color: accentColor }}>Baxter</span>
            </h3>
            <p className="text-[7px] font-semibold text-zinc-600">Senior Product Manager & Fullstack Architect</p>
          </div>

          <div className="space-y-1.5">
            <h4 className="text-[7px] font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-sm" style={{ backgroundColor: accentColor }} />
              Experience
            </h4>
            <div className="space-y-1 text-[6px]">
              <div>
                <p className="font-bold text-zinc-900">Lead PM • Scaleup SaaS</p>
                <p className="text-zinc-400 text-[5px]">2022 - Present</p>
                <p className="text-zinc-600 text-[5.5px]">Pilote une équipe de 12 ingénieurs et designers.</p>
              </div>
              <div>
                <p className="font-bold text-zinc-800">Fullstack Engineer • Startup</p>
                <p className="text-zinc-400 text-[5px]">2019 - 2022</p>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="text-[7px] font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-sm" style={{ backgroundColor: accentColor }} />
              Education
            </h4>
            <div className="text-[6px]">
              <p className="font-bold text-zinc-900">Master Informatique & Data</p>
              <p className="text-zinc-500 text-[5px]">École Polytechnique • 2019</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. CLASSIQUE (Classique Exécutif)
  if (templateId === 'classique') {
    return (
      <div className="w-full h-full bg-white p-3 sm:p-4 flex flex-col justify-between text-[7px] sm:text-[8px] select-none font-serif text-zinc-900 overflow-hidden">
        {/* Header */}
        <div className="text-center space-y-1 border-b-2 border-t-2 py-2 border-zinc-900">
          <h2 className="text-[13px] font-bold tracking-widest uppercase text-zinc-900">
            BRIAN R. BAXTER
          </h2>
          <p className="text-[6.5px] italic text-zinc-600">
            Directeur Financier & Conseil en Stratégie
          </p>
          <p className="text-[5.5px] font-sans text-zinc-500 tracking-wide">
            brian.baxter@executive.com • +33 1 42 68 00 00 • Paris, France
          </p>
        </div>

        {/* Profile */}
        <div className="space-y-0.5">
          <h3 className="text-[7.5px] font-bold uppercase tracking-wider border-b border-zinc-400 pb-0.5 text-zinc-900">
            RÉSUMÉ EXÉCUTIF
          </h3>
          <p className="text-[5.5px] text-zinc-700 leading-normal italic">
            Plus de 15 ans d'expérience dans la gestion financière internationale, le M&A et la restructuration d'entreprises du CAC 40.
          </p>
        </div>

        {/* Experience */}
        <div className="space-y-1">
          <h3 className="text-[7.5px] font-bold uppercase tracking-wider border-b border-zinc-400 pb-0.5 text-zinc-900">
            PARCOURS PROFESSIONNEL
          </h3>
          <div className="space-y-1 text-[6px]">
            <div>
              <div className="flex justify-between font-bold text-zinc-900">
                <span>DIRECTEUR FINANCIER GROUPE</span>
                <span>2020 - PRÉSENT</span>
              </div>
              <p className="text-zinc-600 italic text-[5.5px]">Banque d'Investissement International</p>
              <ul className="list-disc list-inside text-zinc-700 text-[5px] mt-0.5 space-y-0.5">
                <li>Supervision d'un portefeuille d'actifs de 450M€.</li>
                <li>Pilotage de 3 acquisitions stratégiques transfrontalières.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="space-y-0.5">
          <h3 className="text-[7.5px] font-bold uppercase tracking-wider border-b border-zinc-400 pb-0.5 text-zinc-900">
            FORMATION & DIPLÔMES
          </h3>
          <div className="flex justify-between text-[6px]">
            <span className="font-bold">MBA Finance & Management - HEC Paris</span>
            <span className="text-zinc-600">2010</span>
          </div>
        </div>
      </div>
    );
  }

  // 4. CREATIF (Créatif Studio Bold)
  if (templateId === 'creatif') {
    return (
      <div className="w-full h-full bg-white flex flex-col justify-between text-[7.5px] select-none font-sans overflow-hidden relative">
        {/* Top Diagonal Bold Header */}
        <div
          className="p-3.5 text-white space-y-1 relative"
          style={{
            background: `linear-gradient(135deg, ${accentColor} 0%, #1e1b4b 100%)`
          }}
        >
          <span className="px-1.5 py-0.5 bg-white/20 backdrop-blur-md rounded text-[5px] font-extrabold uppercase tracking-widest">
            Creative Portfolio
          </span>
          <h2 className="text-[13px] font-black tracking-tight leading-none text-white">
            BRIAN BAXTER
          </h2>
          <p className="text-[6.5px] font-medium text-white/80">Directeur Artistique & Designer Produit</p>
        </div>

        {/* Content Body */}
        <div className="p-3 flex-1 flex gap-3 bg-white">
          <div className="w-[60%] space-y-2">
            <div>
              <h4 className="text-[7px] font-extrabold text-zinc-900 uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-2 h-2" style={{ color: accentColor }} />
                Expériences Clés
              </h4>
              <div className="space-y-1 mt-1 text-[6px]">
                <div className="p-1.5 rounded-lg bg-zinc-50 border border-zinc-200">
                  <p className="font-extrabold text-zinc-900">Senior Brand Designer</p>
                  <p className="text-zinc-500 text-[5px]">Studio Paris • 2021-Present</p>
                </div>
                <div className="p-1.5 rounded-lg bg-zinc-50 border border-zinc-200">
                  <p className="font-extrabold text-zinc-900">UI/UX Designer</p>
                  <p className="text-zinc-500 text-[5px]">Creative Agency • 2018-2021</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-[40%] space-y-2 border-l border-zinc-100 pl-2">
            <div>
              <h4 className="text-[7px] font-extrabold text-zinc-900 uppercase tracking-widest">Compétences</h4>
              <div className="flex flex-wrap gap-1 mt-1 text-[5px]">
                <span className="px-1 py-0.5 rounded-full text-white font-bold" style={{ backgroundColor: accentColor }}>Art Direction</span>
                <span className="px-1 py-0.5 bg-zinc-100 rounded-full font-semibold text-zinc-700">Figma</span>
                <span className="px-1 py-0.5 bg-zinc-100 rounded-full font-semibold text-zinc-700">3D Design</span>
              </div>
            </div>
            <div>
              <h4 className="text-[7px] font-extrabold text-zinc-900 uppercase tracking-widest">Contact</h4>
              <p className="text-[5.5px] text-zinc-600 mt-0.5">brian@creativestudio.com</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 5. MINIMAL (Ultra Minimal)
  if (templateId === 'minimal') {
    return (
      <div className="w-full h-full bg-white p-4 flex flex-col justify-between text-[7px] select-none font-sans text-zinc-800 overflow-hidden">
        <div className="space-y-1 border-b border-zinc-200 pb-2">
          <h2 className="text-[12px] font-light text-zinc-900 tracking-tight">
            Brian <span className="font-semibold text-zinc-900">Baxter</span>
          </h2>
          <p className="text-[6.5px] text-zinc-500 tracking-widest uppercase">UX Researcher & Information Architect</p>
          <p className="text-[5.5px] text-zinc-400">brian.baxter@minimal.org | +33 6 12 34 56 78 | Paris</p>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-[7px] font-semibold text-zinc-400 uppercase tracking-widest">Expérience</h3>
          <div className="space-y-1 text-[6px]">
            <div>
              <div className="flex justify-between font-semibold text-zinc-900">
                <span>Lead UX Architect — Global Org</span>
                <span className="text-zinc-400 font-normal">2021 — PRÉSENT</span>
              </div>
              <p className="text-zinc-600 text-[5.5px]">Conception de systèmes de données simples et accessibles.</p>
            </div>
            <div>
              <div className="flex justify-between font-semibold text-zinc-900">
                <span>Design Strategist — Studio</span>
                <span className="text-zinc-400 font-normal">2018 — 2021</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-[7px] font-semibold text-zinc-400 uppercase tracking-widest">Compétences & Outils</h3>
          <p className="text-[6px] text-zinc-700">User Research • Wireframing • Usability Testing • Design Systems</p>
        </div>
      </div>
    );
  }

  // 6. PRO (Professionnel Elite)
  if (templateId === 'pro') {
    return (
      <div className="w-full h-full bg-white flex flex-col justify-between text-[7.5px] select-none font-sans overflow-hidden">
        <div className="p-3 text-white flex justify-between items-center" style={{ backgroundColor: accentColor }}>
          <div>
            <h2 className="text-[11px] font-extrabold uppercase tracking-wide">BRIAN BAXTER</h2>
            <p className="text-[6.5px] opacity-90">Directeur des Opérations & Transformation Digital</p>
          </div>
          <div className="text-[5.5px] text-right opacity-80">
            <p>brian.baxter@pro.com</p>
            <p>Paris, France</p>
          </div>
        </div>

        <div className="p-3 flex-1 flex gap-3">
          <div className="w-[65%] space-y-2">
            <div className="p-2 bg-blue-50/60 rounded border border-blue-100 text-[6px] text-blue-950 font-medium">
              Dirigeant chevronné spécialisé dans la conduite du changement, l'optimisation des processus opérationnels et la croissance scalable.
            </div>
            <div className="space-y-1">
              <h4 className="text-[7px] font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-200 pb-0.5">
                Expériences Professionnelles
              </h4>
              <div className="space-y-1 text-[6px]">
                <div>
                  <p className="font-bold text-zinc-900">VP Operations — Groupe Enterprise</p>
                  <p className="text-zinc-500 text-[5px]">2020 - Présent</p>
                </div>
                <div>
                  <p className="font-bold text-zinc-800">Directeur de Projets — Consulting</p>
                  <p className="text-zinc-500 text-[5px]">2016 - 2020</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-[35%] space-y-2 border-l border-zinc-200 pl-2">
            <div className="space-y-1">
              <h4 className="text-[7px] font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-200 pb-0.5">
                Expertises
              </h4>
              <ul className="text-[5.5px] text-zinc-700 space-y-0.5 font-medium">
                <li>• Management d'équipes</li>
                <li>• Budget & P&L</li>
                <li>• Agile & Lean</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 7. TECH_LEAD (Tech Lead Grid)
  if (templateId === 'tech_lead') {
    return (
      <div className="w-full h-full bg-[#0f172a] text-slate-100 p-3 flex flex-col justify-between text-[7.5px] select-none font-mono overflow-hidden">
        <div className="border-b border-slate-800 pb-2 flex justify-between items-center">
          <div>
            <span className="text-[6px] text-emerald-400 font-bold">&lt;developer&gt;</span>
            <h2 className="text-[11px] font-bold text-white tracking-tight">brian_baxter.ts</h2>
            <p className="text-[6px] text-slate-400">Principal Software Architect & DevOps Lead</p>
          </div>
          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[5.5px] border border-emerald-500/30">
            Available 2026
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <div className="p-1.5 rounded bg-slate-800/80 border border-slate-700">
            <p className="text-[6px] text-cyan-400 font-bold">FRONTEND</p>
            <p className="text-[5.5px] text-slate-300">React, Next.js, Tailwind, WebGL</p>
          </div>
          <div className="p-1.5 rounded bg-slate-800/80 border border-slate-700">
            <p className="text-[6px] text-purple-400 font-bold">BACKEND</p>
            <p className="text-[5.5px] text-slate-300">Node, Go, PostgreSQL, Redis</p>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-[6px] text-amber-400 font-bold">// WORK_EXPERIENCE</p>
          <div className="p-1.5 rounded bg-slate-900 border border-slate-800 space-y-0.5 text-[5.5px]">
            <p className="text-white font-bold">Head of Architecture @ CloudTech</p>
            <p className="text-slate-400">2021 - Present • Scaled infra to 10M req/sec</p>
          </div>
        </div>
      </div>
    );
  }

  // 8. NORDIC (Nordic Clean)
  if (templateId === 'nordic') {
    return (
      <div className="w-full h-full bg-[#f8fafc] p-3.5 flex flex-col justify-between text-[7px] select-none font-sans text-slate-800 overflow-hidden">
        <div className="space-y-1">
          <h2 className="text-[12px] font-extralight text-slate-900 tracking-widest uppercase">
            BRIAN <span className="font-semibold text-slate-900">BAXTER</span>
          </h2>
          <p className="text-[6px] text-slate-500 tracking-wider">Interior & Architectural Designer</p>
        </div>

        <div className="grid grid-cols-2 gap-3 my-2">
          <div className="p-2 bg-white rounded-xl shadow-2xs border border-slate-200/80 space-y-1">
            <span className="text-[5.5px] font-bold uppercase text-slate-400 tracking-wider">Prosjekter</span>
            <p className="font-bold text-slate-900 text-[6.5px]">Nordic Architecture Studio</p>
            <p className="text-[5.5px] text-slate-500">Stockholm, Sweden • 2022-2026</p>
          </div>
          <div className="p-2 bg-white rounded-xl shadow-2xs border border-slate-200/80 space-y-1">
            <span className="text-[5.5px] font-bold uppercase text-slate-400 tracking-wider">Utdanning</span>
            <p className="font-bold text-slate-900 text-[6.5px]">Royal Institute of Art</p>
            <p className="text-[5.5px] text-slate-500">Master of Fine Arts • 2021</p>
          </div>
        </div>

        <div className="p-2 bg-slate-200/50 rounded-lg text-[5.5px] text-slate-600 flex justify-between">
          <span>brian@nordicdesign.se</span>
          <span>+46 8 123 4567</span>
        </div>
      </div>
    );
  }

  // 9. MONOCHROME (Monochrome Ink)
  if (templateId === 'monochrome') {
    return (
      <div className="w-full h-full bg-white p-3.5 flex flex-col justify-between text-[7px] select-none font-serif text-black overflow-hidden border border-black">
        <div className="bg-black text-white p-2 text-center">
          <h2 className="text-[12px] font-bold tracking-widest uppercase">BRIAN BAXTER</h2>
          <p className="text-[6px] font-sans tracking-wide uppercase text-zinc-300">Journaliste Éditorial & Rédacteur en Chef</p>
        </div>

        <div className="border-t-2 border-b-2 border-black py-1 my-1 text-[5.5px] font-sans flex justify-between font-bold">
          <span>ÉDITION N° 2026</span>
          <span>PARIS • LONDRES • NEW YORK</span>
        </div>

        <div className="space-y-1 flex-1">
          <h3 className="text-[7.5px] font-bold uppercase border-b border-black pb-0.5">PARCOURS ÉDITORIAL</h3>
          <div className="space-y-1 text-[6px]">
            <div>
              <p className="font-bold">Rédacteur en Chef — Le Grand Journal</p>
              <p className="italic text-[5.5px]">2020 - Présent</p>
            </div>
            <div>
              <p className="font-bold">Critique Littéraire — Presse Nationale</p>
              <p className="italic text-[5.5px]">2016 - 2020</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 10. VIBRANT (Vibrant Pulse)
  if (templateId === 'vibrant') {
    return (
      <div className="w-full h-full bg-white flex flex-col justify-between text-[7.5px] select-none font-sans overflow-hidden">
        <div
          className="p-3 text-white space-y-0.5"
          style={{
            background: `linear-gradient(90deg, ${accentColor} 0%, #ec4899 100%)`
          }}
        >
          <h2 className="text-[12px] font-black tracking-tight">BRIAN BAXTER</h2>
          <p className="text-[6.5px] font-bold opacity-90">Growth Hacker & Head of Marketing</p>
        </div>

        <div className="p-3 flex-1 space-y-2">
          <div className="flex gap-1">
            <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded-full font-bold text-[5px]">🔥 Growth +300%</span>
            <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded-full font-bold text-[5px]">🚀 User Acquisition</span>
          </div>

          <div className="space-y-1 text-[6px]">
            <p className="font-bold text-zinc-900 uppercase tracking-wider text-[6.5px]" style={{ color: accentColor }}>
              Expériences Récentes
            </p>
            <div className="p-1.5 rounded-lg border border-zinc-200 space-y-0.5">
              <p className="font-extrabold text-zinc-900">Head of Growth — Scaleup Tech</p>
              <p className="text-zinc-500 text-[5px]">2022 - Present</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 11. ACADEMIC (Académique & Recherche)
  if (templateId === 'academic') {
    return (
      <div className="w-full h-full bg-white p-3.5 flex flex-col justify-between text-[7px] select-none font-serif text-zinc-900 overflow-hidden">
        <div className="text-center space-y-0.5 border-b border-zinc-300 pb-2">
          <h2 className="text-[11px] font-bold tracking-tight">Dr. Brian R. Baxter, Ph.D.</h2>
          <p className="text-[6px] italic text-zinc-600">Senior Researcher in Artificial Intelligence & Computational Linguistics</p>
          <p className="text-[5.5px] font-sans text-zinc-500">Sorbonne Université • brian.baxter@sorbonne.fr</p>
        </div>

        <div className="space-y-1">
          <h3 className="text-[7px] font-bold uppercase tracking-wider text-zinc-800 border-b border-zinc-200">
            PUBLICATIONS MAJEURES
          </h3>
          <div className="space-y-1 text-[5.5px] text-zinc-700">
            <p>[1] Baxter, B. et al. (2025). "Neural Architecture Search in NLP". <i>Journal of AI Research</i>, 42(3).</p>
            <p>[2] Baxter, B. (2023). "Transformer Language Models Scaling". <i>Nature Machine Intelligence</i>.</p>
          </div>
        </div>

        <div className="space-y-0.5 text-[5.5px]">
          <h3 className="text-[7px] font-bold uppercase tracking-wider text-zinc-800 border-b border-zinc-200">
            ENSEIGNEMENT & CHAIRES
          </h3>
          <p className="font-bold">Professeur Associé — Sorbonne Université (2021-2026)</p>
        </div>
      </div>
    );
  }

  // 12. STARTUP (Startup Founder)
  if (templateId === 'startup') {
    return (
      <div className="w-full h-full bg-zinc-950 text-white p-3 flex flex-col justify-between text-[7.5px] select-none font-sans overflow-hidden">
        <div className="space-y-0.5">
          <div className="inline-block px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-400 font-mono text-[5px] border border-pink-500/30">
            FOUNDER & BUILDER
          </div>
          <h2 className="text-[12px] font-extrabold text-white tracking-tight">BRIAN BAXTER</h2>
          <p className="text-[6.5px] text-zinc-400">Co-Founder & CEO @ NextGen AI</p>
        </div>

        <div className="grid grid-cols-3 gap-1 my-1 text-center">
          <div className="p-1 rounded bg-zinc-900 border border-zinc-800">
            <p className="text-[8px] font-black text-pink-500">$5M+</p>
            <p className="text-[4.5px] text-zinc-400">ARR Raised</p>
          </div>
          <div className="p-1 rounded bg-zinc-900 border border-zinc-800">
            <p className="text-[8px] font-black text-emerald-400">250K</p>
            <p className="text-[4.5px] text-zinc-400">Active Users</p>
          </div>
          <div className="p-1 rounded bg-zinc-900 border border-zinc-800">
            <p className="text-[8px] font-black text-purple-400">15</p>
            <p className="text-[4.5px] text-zinc-400">Team Size</p>
          </div>
        </div>

        <div className="space-y-1 text-[6px]">
          <p className="text-zinc-400 font-bold uppercase text-[5.5px]">Track Record</p>
          <div className="p-1.5 rounded bg-zinc-900 border border-zinc-800">
            <p className="font-bold text-white">CEO & Founder — AI SaaS (2022-Pres)</p>
          </div>
        </div>
      </div>
    );
  }

  // 13. INTERNATIONAL (International Harvard)
  if (templateId === 'international') {
    return (
      <div className="w-full h-full bg-white p-3.5 flex flex-col justify-between text-[7px] select-none font-serif text-zinc-900 overflow-hidden">
        <div className="text-center space-y-0.5 border-b-2 border-zinc-900 pb-1">
          <h2 className="text-[11px] font-bold tracking-widest uppercase">BRIAN R. BAXTER</h2>
          <p className="text-[5.5px] font-sans text-zinc-600">
            12 Rue de la Paix, Paris • +33 6 00 00 00 00 • brian.baxter@harvard.edu
          </p>
        </div>

        <div className="space-y-1">
          <h3 className="text-[7px] font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-300">
            EDUCATION
          </h3>
          <div className="text-[6px] flex justify-between">
            <div>
              <p className="font-bold">HARVARD BUSINESS SCHOOL</p>
              <p className="italic text-[5.5px]">Master in Business Administration (MBA)</p>
            </div>
            <p className="text-zinc-600">Cambridge, MA • 2021</p>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-[7px] font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-300">
            PROFESSIONAL EXPERIENCE
          </h3>
          <div className="text-[6px] space-y-0.5">
            <div className="flex justify-between font-bold">
              <span>MCKINSEY & COMPANY</span>
              <span>Paris, France</span>
            </div>
            <p className="italic text-[5.5px] text-zinc-600">Engagement Manager (2021 - Present)</p>
          </div>
        </div>
      </div>
    );
  }

  // 14. LUXURE (Luxury Atelier)
  if (templateId === 'luxure') {
    return (
      <div className="w-full h-full bg-[#fdfbf7] p-3.5 flex flex-col justify-between text-[7px] select-none font-serif text-[#3e2723] overflow-hidden border border-[#d7ccc8]">
        <div className="text-center space-y-1 my-1">
          <div className="w-8 h-8 rounded-full border border-[#8d6e63] mx-auto flex items-center justify-center font-bold text-[#5d4037] text-[9px] bg-amber-50">
            BB
          </div>
          <h2 className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-[#3e2723]">
            BRIAN BAXTER
          </h2>
          <p className="text-[6px] tracking-widest uppercase text-[#8d6e63] font-sans">
            Maison de Haute Couture & Directeut Artistique
          </p>
        </div>

        <div className="border-t border-b border-[#d7ccc8] py-1 text-center text-[5.5px] text-[#6d4c41]">
          PARIS • MILAN • TOKYO
        </div>

        <div className="space-y-1 text-[6px] text-[#4e342e]">
          <p className="font-bold tracking-widest uppercase text-[6.5px] text-[#8d6e63]">Missions Récentes</p>
          <p className="font-semibold">Directeur de Création — Maison de Luxe (2020-2026)</p>
        </div>
      </div>
    );
  }

  // 15. MEDICAL (Santé & Médical)
  if (templateId === 'medical') {
    return (
      <div className="w-full h-full bg-white flex flex-col justify-between text-[7.5px] select-none font-sans overflow-hidden">
        <div className="p-3 bg-teal-700 text-white flex justify-between items-center">
          <div>
            <h2 className="text-[11px] font-bold">Dr. Brian Baxter</h2>
            <p className="text-[6px] opacity-90">Médecin Spécialiste & Chef de Service</p>
          </div>
          <span className="p-1 bg-white/20 rounded-full">
            <Activity className="w-3 h-3 text-white" />
          </span>
        </div>

        <div className="p-3 flex-1 space-y-2">
          <div className="space-y-1">
            <h4 className="text-[7px] font-bold text-teal-800 uppercase tracking-wider border-b border-teal-100 pb-0.5">
              Hospital & Clinical Practice
            </h4>
            <div className="space-y-1 text-[6px]">
              <div>
                <p className="font-bold text-zinc-900">Chef de Service — CHU de Paris</p>
                <p className="text-zinc-500 text-[5px]">2020 - Présent</p>
              </div>
            </div>
          </div>

          <div className="space-y-1 text-[6px]">
            <h4 className="text-[7px] font-bold text-teal-800 uppercase tracking-wider border-b border-teal-100 pb-0.5">
              Ordre & Certifications
            </h4>
            <p className="text-zinc-700">Inscrit au Conseil National de l'Ordre des Médecins</p>
          </div>
        </div>
      </div>
    );
  }

  // 16. LEGAL (Juridique Avocat)
  if (templateId === 'legal') {
    return (
      <div className="w-full h-full bg-white flex flex-col justify-between text-[7.5px] select-none font-serif overflow-hidden">
        <div className="p-3 bg-indigo-950 text-amber-100 border-b-2 border-amber-400">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-[11px] font-bold tracking-wider uppercase">Me BRIAN BAXTER</h2>
              <p className="text-[6px] text-amber-200/80 font-sans">Avocat au Barreau de Paris • Droit des Affaires</p>
            </div>
            <Scale className="w-3 h-3 text-amber-300" />
          </div>
        </div>

        <div className="p-3 flex-1 space-y-2 text-zinc-900">
          <div className="space-y-1">
            <h4 className="text-[7px] font-bold uppercase tracking-wider text-indigo-950 border-b border-zinc-200">
              Cabinet & Spécialisations
            </h4>
            <div className="space-y-1 text-[6px]">
              <div>
                <p className="font-bold">Avocat Associé — Cabinet Corporate</p>
                <p className="text-zinc-500 text-[5px]">2019 - Présent</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 17. COMPACT (Dense One-Page)
  if (templateId === 'compact') {
    return (
      <div className="w-full h-full bg-white p-2.5 flex flex-col justify-between text-[6.5px] select-none font-sans text-zinc-800 overflow-hidden">
        <div className="border-b border-zinc-300 pb-1 flex justify-between items-center">
          <div>
            <h2 className="text-[10px] font-extrabold text-zinc-900">Brian Baxter</h2>
            <p className="text-[5.5px] text-zinc-600 font-semibold">Senior Operations & Logistics Manager</p>
          </div>
          <p className="text-[5px] text-zinc-500">Paris • +33 6 00 00 00 00</p>
        </div>

        <div className="grid grid-cols-2 gap-1.5 my-1">
          <div className="space-y-1">
            <p className="font-bold text-zinc-900 border-b border-zinc-200 text-[6px]">PARCOURS (10+ ANS)</p>
            <div className="space-y-0.5 text-[5.5px]">
              <p className="font-bold text-zinc-900">Directeur Logistique (2022-Pres)</p>
              <p className="font-bold text-zinc-800">Responsable Supply Chain (2018-2022)</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="font-bold text-zinc-900 border-b border-zinc-200 text-[6px]">COMPÉTENCES CLÉS</p>
            <p className="text-[5.5px] text-zinc-700">WMS, ERP SAP, Management 40+, Lean Six Sigma</p>
          </div>
        </div>
      </div>
    );
  }

  // 18. ELEGANT_SERIF (Élégant Serif)
  if (templateId === 'elegant_serif') {
    return (
      <div className="w-full h-full bg-[#fdfaf7] p-3 flex flex-col justify-between text-[7px] select-none font-serif text-purple-950 overflow-hidden">
        <div className="text-center space-y-1 my-1">
          <h2 className="text-[12px] font-normal tracking-widest text-purple-900">
            Brian Baxter
          </h2>
          <div className="w-8 h-0.5 bg-purple-400 mx-auto rounded-full" />
          <p className="text-[6px] italic text-purple-700">Auteur & Conservateur du Patrimoine</p>
        </div>

        <div className="space-y-1 text-[6px] text-purple-900">
          <p className="font-bold tracking-wider text-[6.5px]">Direction de Projets Culturels</p>
          <p className="italic text-[5.5px]">Fondation des Arts • 2020-2026</p>
        </div>
      </div>
    );
  }

  // 19. BOLD_HEADER (Header Impactful)
  if (templateId === 'bold_header') {
    return (
      <div className="w-full h-full bg-white flex flex-col justify-between text-[7.5px] select-none font-sans overflow-hidden">
        <div className="p-3.5 text-white space-y-1" style={{ backgroundColor: accentColor }}>
          <h2 className="text-[13px] font-black uppercase tracking-tight">BRIAN BAXTER</h2>
          <p className="text-[6.5px] font-bold text-white/90">VP Sales & Business Development</p>
        </div>

        <div className="p-3 flex-1 space-y-2">
          <div className="p-1.5 bg-zinc-50 border border-zinc-200 rounded text-[6px] text-zinc-800">
            Pénétrations de nouveaux marchés B2B et génération de +20M€ de chiffre d'affaires.
          </div>
          <div className="space-y-1 text-[6px]">
            <p className="font-extrabold text-zinc-900">Sales Director — Tech Enterprise</p>
            <p className="text-zinc-500 text-[5px]">2021 - Present</p>
          </div>
        </div>
      </div>
    );
  }

  // 20. MODERN_TIMELINE (Chronologique Modern)
  if (templateId === 'modern_timeline') {
    return (
      <div className="w-full h-full bg-white p-3 flex flex-col justify-between text-[7.5px] select-none font-sans overflow-hidden">
        <div>
          <h2 className="text-[11px] font-extrabold text-zinc-900">
            BRIAN <span style={{ color: accentColor }}>BAXTER</span>
          </h2>
          <p className="text-[6.5px] font-bold text-zinc-500">Project Manager & Agile Coach</p>
        </div>

        <div className="space-y-1 my-1">
          <p className="text-[6.5px] font-bold text-zinc-900 uppercase tracking-wider">Chronologie</p>
          <div className="relative pl-3 border-l-2 space-y-2" style={{ borderColor: accentColor }}>
            <div className="relative">
              <span className="absolute -left-[15px] top-0.5 w-2 h-2 rounded-full border-2 bg-white" style={{ borderColor: accentColor }} />
              <p className="font-bold text-zinc-900 text-[6px]">Lead Agile Coach</p>
              <p className="text-[5px] text-zinc-400">2023 - Present</p>
            </div>
            <div className="relative">
              <span className="absolute -left-[15px] top-0.5 w-2 h-2 rounded-full border-2 bg-white" style={{ borderColor: accentColor }} />
              <p className="font-bold text-zinc-800 text-[6px]">Senior Scrum Master</p>
              <p className="text-[5px] text-zinc-400">2020 - 2023</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback default
  return (
    <div className="w-full h-full bg-white p-3 flex flex-col justify-between text-[7.5px] select-none font-sans">
      <div>
        <h2 className="text-[11px] font-bold text-zinc-900">Brian Baxter</h2>
        <p className="text-[6.5px] text-zinc-500">Professional Resume</p>
      </div>
      <div className="space-y-1 text-[6px]">
        <p className="font-bold text-zinc-800">Experience</p>
        <p className="text-zinc-600">Senior Professional Position</p>
      </div>
    </div>
  );
};
