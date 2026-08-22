import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('[SCRAPER ERROR] Clés Supabase manquantes.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const LOCATIONS = [
  { name: 'Casablanca', geoId: '105432658' },
  { name: 'Rabat', geoId: '103309996' },
  { name: 'Fès-Meknès', geoId: '103823485' },
  { name: 'Tanger', geoId: '101666687' },
  { name: 'Maroc (Global)', geoId: '102787409' }
];

const KEYWORDS = ['Developer', 'Développeur', 'React', 'Node', 'Fullstack'];

async function fetchLinkedInGuestJobs(keyword: string, locationObj: { name: string, geoId: string }, start = 0) {
  const url = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${encodeURIComponent(keyword)}&geoId=${locationObj.geoId}&start=${start}`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    });

    if (!res.ok) return [];

    const html = await res.text();
    const jobs: any[] = [];

    const titleMatches = [...html.matchAll(/class="base-search-card__title"[^>]*>([\s\S]*?)<\/h3>/g)];
    const companyMatches = [...html.matchAll(/class="base-search-card__subtitle"[^>]*>([\s\S]*?)<\/h4>/g)];
    const locationMatches = [...html.matchAll(/class="job-search-card__location"[^>]*>([\s\S]*?)<\/span>/g)];
    const linkMatches = [...html.matchAll(/href="(https:\/\/[a-z]+\.linkedin\.com\/jobs\/view\/[^"?]+)/g)];

    const count = Math.min(titleMatches.length, linkMatches.length);

    for (let i = 0; i < count; i++) {
      const title = titleMatches[i]?.[1]?.trim() || 'Développeur';
      const company = companyMatches[i]?.[1]?.replace(/<[^>]+>/g, '').trim() || 'Entreprise Confidentielle';
      const loc = locationMatches[i]?.[1]?.trim() || locationObj.name;
      const job_url = linkMatches[i]?.[1];

      if (job_url) {
        jobs.push({
          title,
          company,
          location: loc,
          description: `Offre extraite pour ${keyword} - ${loc}`,
          job_url,
          source: 'LinkedIn (Map API)',
          is_active: true,
          created_at: new Date().toISOString()
        });
      }
    }

    return jobs;
  } catch (err: any) {
    console.warn(`[LinkedIn Map Error] ${locationObj.name} (${keyword}):`, err.message);
    return [];
  }
}

async function runScraper() {
  console.log('[SCRAPER] Démarrage de l\'extraction ciblée par Carte/Localisations...');
  let totalInserted = 0;

  for (const loc of LOCATIONS) {
    for (const kw of KEYWORDS) {
      for (let start = 0; start <= 50; start += 25) {
        console.log(`[LinkedIn Map] Recherche : "${kw}" à ${loc.name} (index: ${start})...`);

        const jobs = await fetchLinkedInGuestJobs(kw, loc, start);

        if (jobs.length > 0) {
          const { error } = await supabase
            .from('jobs')
            .upsert(jobs, { onConflict: 'job_url', ignoreDuplicates: true });

          if (!error) {
            totalInserted += jobs.length;
            console.log(` -> ${jobs.length} offres extraites.`);
          }
        }

        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }
  }

  console.log(`[SCRAPER FINI] Archive mise à jour. Total extrait : ${totalInserted} offres.`);
  process.exit(0);
}

runScraper();
