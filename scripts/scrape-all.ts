import Parser from 'rss-parser';
import { createClient } from '@supabase/supabase-js';

const parser = new Parser();

// Replis explicites si les variables d'environnement CI manquent
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://votre-projet.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'votre-cle-anon';

async function runScraper() {
  console.log('[SCRAPER] Démarrage de la récolte RSS...');

  if (!SUPABASE_URL || SUPABASE_URL.includes('votre-projet')) {
    console.error('[ERROR] URL Supabase invalide. Configurez VITE_SUPABASE_URL dans GitHub Secrets.');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const rssFeeds = [
    'https://rsshub.app/linkedin/jobs/search/keywords=Developer&location=Morocco',
    'https://jobspire.io/feed/rss?q=developer&l=morocco'
  ];

  let totalInserted = 0;

  for (const url of rssFeeds) {
    try {
      console.log(`[RSS] Lecture : ${url}`);
      const feed = await parser.parseURL(url);

      const jobs = (feed.items || []).map((item) => ({
        title: item.title || 'Développeur',
        company: item.creator || item.author || 'Entreprise Confidentielle',
        location: 'Maroc',
        description: item.contentSnippet || item.content || '',
        job_url: item.link || '',
        source: 'LinkedIn (RSS)',
        is_active: true,
        created_at: item.isoDate || new Date().toISOString()
      })).filter(j => j.job_url);

      if (jobs.length > 0) {
        const { error } = await supabase
          .from('jobs')
          .upsert(jobs, { onConflict: 'job_url', ignoreDuplicates: true });

        if (error) {
          console.error('[Supabase Error]:', error.message);
        } else {
          console.log(`[RSS Success] ${jobs.length} offres envoyées à Supabase.`);
          totalInserted += jobs.length;
        }
      }
    } catch (err: any) {
      console.warn(`[RSS Warning] Flux ignoré (${url}):`, err.message);
    }
  }

  console.log(`[SCRAPER] Fin de la récolte. Total : ${totalInserted}`);
  process.exit(0);
}

runScraper();
