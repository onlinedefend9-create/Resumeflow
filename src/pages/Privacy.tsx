import { Shield, Lock, Eye, CheckCircle2, FileText, Globe, RefreshCw } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useLanguage } from '../i18n/LanguageContext';

export const Privacy = () => {
  const { language } = useLanguage();

  const isFr = language === 'fr';

  return (
    <div className="py-16 md:py-24 px-6 md:px-10 max-w-4xl mx-auto space-y-12">
      <SEO
        title={isFr ? "Politique de Confidentialité" : "Privacy Policy"}
        description={isFr ? "Notre engagement pour la protection de vos données personnelles et professionnelles." : "Our commitment to protecting your personal and professional data."}
      />

      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-100 bg-blue-50/50 text-xs font-semibold text-blue-700">
          <Shield className="w-3.5 h-3.5 text-blue-600" />
          <span>RGPD & Confidentialité</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0a0a0a]">
          {isFr ? "Politique de " : "Privacy "}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {isFr ? "Confidentialité" : "Policy"}
          </span>
        </h1>
        <p className="text-zinc-500 text-sm font-medium">
          {isFr ? "Dernière mise à jour : 1er août 2026" : "Last updated: August 1, 2026"}
        </p>
      </div>

      {/* Main Content Card */}
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-xs p-8 md:p-10 space-y-10 text-left">
        
        {/* Intro */}
        <div className="prose prose-zinc max-w-none">
          <p className="text-zinc-600 leading-relaxed text-sm">
            {isFr ? (
              "Chez ResumeFlow, nous prenons la protection de vos données personnelles très au sérieux. Cette politique de confidentialité détaille la manière dont nous collectons, utilisons, stockons et protégeons les informations que vous fournissez lors de l'utilisation de notre créateur de CV en ligne, de l'importateur de CV assisté par l'IA et de nos services associés."
            ) : (
              "At ResumeFlow, we take the protection of your personal data very seriously. This privacy policy details how we collect, use, store, and protect the information you provide when using our online resume builder, AI-assisted CV importer, and associated services."
            )}
          </p>
        </div>

        {/* Highlight Banner */}
        <div className="p-5 bg-zinc-50 rounded-xl border border-zinc-200/60 flex items-start gap-3.5">
          <Lock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-left">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Pas de revente de données</h4>
            <p className="text-zinc-600 text-xs leading-relaxed">
              Vos informations professionnelles, CV, emails et coordonnées de contact vous appartiennent exclusivement. Nous ne vendons, n'échangeons, ni ne louons jamais vos données à des tiers ou des régies publicitaires.
            </p>
          </div>
        </div>

        {/* Section 1 */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="text-lg font-bold text-zinc-900">Collecte et origine des données</h3>
          </div>
          <div className="pl-11 space-y-3 text-zinc-600 text-sm leading-relaxed">
            <p>
              Nous collectons les données que vous saisissez activement dans l'éditeur de CV, ou que vous importez par le biais de nos modules de synchronisation :
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li>
                <strong className="text-zinc-800">Données de profil de base :</strong> Nom complet, titre professionnel, adresse email, numéro de téléphone, localisation géographique, site web et liens sociaux (ex: LinkedIn, GitHub).
              </li>
              <li>
                <strong className="text-zinc-800">Parcours professionnel & académique :</strong> Historique détaillé des emplois occupés, missions et réalisations, diplômes, établissements fréquentés, dates de début et de fin.
              </li>
              <li>
                <strong className="text-zinc-800">Compétences et projets :</strong> Listes de compétences techniques et humaines, projets personnels ou académiques détaillés.
              </li>
            </ul>
          </div>
        </div>

        {/* Section 2 */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="text-lg font-bold text-zinc-900">Comment nous utilisons vos données</h3>
          </div>
          <div className="pl-11 space-y-3 text-zinc-600 text-sm leading-relaxed">
            <p>
              Vos données sont traitées dans le but de vous fournir une expérience d'édition fluide et optimale :
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li>
                <strong className="text-zinc-800">Génération de CV en temps réel :</strong> Pour composer et afficher instantanément vos informations dans le modèle de design sélectionné.
              </li>
              <li>
                <strong className="text-zinc-800">Exportation PDF :</strong> Pour compiler et télécharger votre CV au format vectoriel haute fidélité via notre moteur d'exportation dédié.
              </li>
              <li>
                <strong className="text-zinc-800">Analyse IA de texte :</strong> Lorsque vous utilisez notre outil de parsing assisté par l'IA Gemini, le texte brut que vous copiez-collez est envoyé de manière sécurisée et anonymisée à l'API de Google Gemini pour structurer vos rubriques. Aucune donnée n'est conservée par l'API de Google pour l'entraînement des modèles.
              </li>
            </ul>
          </div>
        </div>

        {/* Section 3 */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="text-lg font-bold text-zinc-900">Stockage et sécurité des données</h3>
          </div>
          <div className="pl-11 space-y-3 text-zinc-600 text-sm leading-relaxed">
            <p>
              Nous mettons en œuvre des technologies robustes de sécurité pour empêcher tout accès non autorisé :
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li>
                <strong className="text-zinc-800">Sauvegarde locale (Offline-first) :</strong> Par défaut, toutes vos modifications sont instantanément enregistrées de manière locale dans le stockage de votre navigateur (localStorage). Cela signifie que vos données restent physiquement sur votre appareil.
              </li>
              <li>
                <strong className="text-zinc-800">Synchronisation Cloud Firestore :</strong> Si vous créez un compte utilisateur ou vous connectez, vos CV sont sauvegardés de manière hautement sécurisée dans notre base de données Cloud Firestore de Firebase, sécurisée par des règles de filtrage d'accès strictes. Seul vous pouvez y accéder.
              </li>
              <li>
                <strong className="text-zinc-800">Sécurité des transferts :</strong> Tous les échanges d'informations entre votre appareil et nos serveurs sont cryptés à l'aide de protocoles de sécurité standard (HTTPS / SSL/TLS).
              </li>
            </ul>
          </div>
        </div>

        {/* Section 4 */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              4
            </div>
            <h3 className="text-lg font-bold text-zinc-900">Vos droits (Conformité RGPD)</h3>
          </div>
          <div className="pl-11 space-y-3 text-zinc-600 text-sm leading-relaxed text-xs">
            <p>
              Conformément à la réglementation européenne sur la protection des données personnelles (RGPD), vous disposez de droits complets sur l'ensemble de vos données :
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="p-4 border border-zinc-150 rounded-xl bg-zinc-50/50 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-zinc-900 text-xs">Accès & Rectification</h5>
                  <p className="text-[10px] text-zinc-500 mt-1">Vous pouvez consulter, éditer ou modifier toutes les données de votre profil à tout moment depuis l'interface d'édition.</p>
                </div>
              </div>
              <div className="p-4 border border-zinc-150 rounded-xl bg-zinc-50/50 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-zinc-900 text-xs">Suppression totale</h5>
                  <p className="text-[10px] text-zinc-500 mt-1">Vous pouvez supprimer l'intégralité de vos CV et données stockés localement en vidant le cache de votre navigateur, ou demander la suppression définitive de votre compte Cloud.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 5 */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              5
            </div>
            <h3 className="text-lg font-bold text-zinc-900">Contact et support</h3>
          </div>
          <div className="pl-11 space-y-2 text-zinc-600 text-sm leading-relaxed">
            <p>
              Pour toute question relative à cette politique de confidentialité ou pour toute demande de retrait d'informations personnelles, vous pouvez nous contacter directement à l'adresse suivante :
            </p>
            <p className="font-bold text-zinc-900 text-xs">
              support@resumeflow.online
            </p>
          </div>
        </div>

      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-zinc-50 border border-zinc-200/60 rounded-xl space-y-1">
          <Globe className="w-5 h-5 text-blue-600 mx-auto" />
          <h5 className="text-xs font-bold text-zinc-900">100% Conforme RGPD</h5>
          <p className="text-[10px] text-zinc-500">Protection totale des résidents européens</p>
        </div>
        <div className="p-4 bg-zinc-50 border border-zinc-200/60 rounded-xl space-y-1">
          <Lock className="w-5 h-5 text-blue-600 mx-auto" />
          <h5 className="text-xs font-bold text-zinc-900">Cryptage HTTPS</h5>
          <p className="text-[10px] text-zinc-500">Sécurisation renforcée des transmissions</p>
        </div>
        <div className="p-4 bg-zinc-50 border border-zinc-200/60 rounded-xl space-y-1">
          <RefreshCw className="w-5 h-5 text-blue-600 mx-auto" />
          <h5 className="text-xs font-bold text-zinc-900">Portabilité Totale</h5>
          <p className="text-[10px] text-zinc-500">Exportez ou supprimez en un clic</p>
        </div>
      </div>
    </div>
  );
};
