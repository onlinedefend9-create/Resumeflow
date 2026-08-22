import Parser from 'rss-parser';
import { createClient } from '@supabase/supabase-js';

const parser = new Parser();
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''
);

async function runScraper() {
  console.log('[SCRAPER] Démarrage de la récolte multi-sources...');
  
  const rssFeeds = [
    'https://rsshub.app/linkedin/jobs/search/keywords=Developer&location=Morocco',
    'https://jobspire.io/feed/rss?q=developer&l=morocco'
  ];

  let totalInserted = 0;

  for (const url of rssFeeds) {
    try {
      console.log(`[RSS] Parsing: ${url}`);
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
        const { data, error } = await supabase
          .from('jobs')
          .upsert(jobs, { onConflict: 'job_url', ignoreDuplicates: true });

        if (error) {
          console.error('[Supabase Error]:', error.message);
        } else {
          console.log(`[RSS Success] ${jobs.length} offres traitées.`);
          totalInserted += jobs.length;
        }
      }
    } catch (err: any) {
      console.warn(`[RSS Warning] Flux inaccessible (${url}):`, err.message);
    }
  }

  console.log(`[SCRAPER] Récolte terminée. Total traité : ${totalInserted}`);
  process.exit(0);
}

runScraper();
