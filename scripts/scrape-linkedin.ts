import dotenv from "dotenv";
dotenv.config();

import { chromium } from "playwright";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import http from "http";
import https from "https";

// Configuration des variables d'environnement
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const SCRAPE_LIMIT = Number(process.env.SCRAPE_LIMIT || 20);
const USER_AGENT = process.env.USER_AGENT || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const SKIP_ROBOTS_CHECK = process.env.SKIP_ROBOTS_CHECK === 'true';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Erreur : SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY non spécifié.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Calcul du SHA1 pour valider l'unicité du contenu d'une offre d'emploi
function calculateContentHash(title: string, company: string, description: string, salary: string): string {
  return crypto
    .createHash("sha1")
    .update(`${title}|${company}|${description}|${salary}`)
    .digest("hex");
}

// Fonction de validation robots.txt simplifiée
async function checkRobotsTxt(urlStr: string): Promise<boolean> {
  if (SKIP_ROBOTS_CHECK) {
    console.log("ℹ️ [Robots.txt] Ignoré par configuration SKIP_ROBOTS_CHECK=true.");
    return true;
  }
  try {
    const parsedUrl = new URL(urlStr);
    const robotsUrl = `${parsedUrl.protocol}//${parsedUrl.host}/robots.txt`;
    console.log(`📡 [Robots.txt] Vérification de : ${robotsUrl}...`);

    return new Promise((resolve) => {
      const reqLib = parsedUrl.protocol === 'https:' ? https : http;
      reqLib.get(robotsUrl, { headers: { 'User-Agent': USER_AGENT } }, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          if (res.statusCode === 200) {
            const lines = data.toLowerCase().split('\n');
            let isUserAgentMatch = false;
            let isDisallowed = false;

            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed.startsWith('user-agent:')) {
                const agent = trimmed.split(':')[1]?.trim() || '';
                isUserAgentMatch = (agent === '*' || agent.includes('playwright') || agent.includes('bot'));
              }
              if (isUserAgentMatch && trimmed.startsWith('disallow:')) {
                const path = trimmed.split(':')[1]?.trim() || '';
                if (path && parsedUrl.pathname.startsWith(path)) {
                  isDisallowed = true;
                  break;
                }
              }
            }
            if (isDisallowed) {
              console.log(`⚠️ [Robots.txt] Le crawl est interdit pour l'URI : ${parsedUrl.pathname}`);
              resolve(false);
            } else {
              console.log(`✅ [Robots.txt] Le crawl est autorisé pour l'URI : ${parsedUrl.pathname}`);
              resolve(true);
            }
          } else {
            resolve(true); // Autorisé par défaut si robots.txt introuvable ou erreur 404
          }
        });
      }).on('error', () => resolve(true));
    });
  } catch {
    return true;
  }
}

// Implémentation du retry avec backoff exponentiel pour l'accès réseau
async function runWithRetry<T>(fn: () => Promise<T>, retries = 3, delay = 500): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 1) throw err;
    console.warn(`⚠️ Erreur réseau rencontrée. Nouvelle tentative dans ${delay}ms... (Tentatives restantes : ${retries - 1})`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return runWithRetry(fn, retries - 1, delay * 2);
  }
}

async function scrapeLinkedIn() {
  console.log("🚀 Lancement du worker de scraping Playwright pour LinkedIn...");

  const searchUrl = "https://www.linkedin.com/jobs/search/?keywords=React&location=Casablanca";
  
  const isAllowed = await checkRobotsTxt(searchUrl);
  if (!isAllowed) {
    console.warn("🛑 Crawl abandonné suite aux restrictions de robots.txt.");
    return;
  }

  // Lancement du navigateur
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const context = await browser.newContext({
    userAgent: USER_AGENT,
    viewport: { width: 1280, height: 800 }
  });

  const page = await context.newPage();
  let scrapedCount = 0;
  let upsertCount = 0;

  try {
    console.log(`📡 Navigation vers l'URL de recherche : ${searchUrl}...`);
    
    await runWithRetry(async () => {
      await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
    });

    // SÉLECTEURS CSS À ADAPTER :
    // LinkedIn Public Jobs utilise fréquemment les structures suivantes :
    // - Liste d'offres : '.jobs-search__results-list li' ou 'ul.jobs-search__results-list > li'
    // - Lien de l'offre : 'a.base-card__full-link'
    const jobListSelector = ".jobs-search__results-list li";
    const jobLinkSelector = "a.base-card__full-link";

    console.log("⏳ Attente du chargement de la liste d'offres...");
    await page.waitForSelector(jobListSelector, { timeout: 15000 }).catch(() => {
      console.warn("⚠️ Sélecteur de liste d'offres non détecté. Tentative d'analyse alternative du DOM...");
    });

    // Récupérer les URLs de détails des offres d'emploi
    const jobUrls = await page.evaluate((selector) => {
      const elements = Array.from(document.querySelectorAll(selector));
      return elements.map(el => {
        const linkEl = el.querySelector('a');
        return linkEl ? linkEl.href : null;
      }).filter((url): url is string => !!url);
    }, jobLinkSelector);

    console.log(`🎯 ${jobUrls.length} offres d'emploi détectées.`);
    const urlsToScrape = jobUrls.slice(0, SCRAPE_LIMIT);

    for (const url of urlsToScrape) {
      try {
        scrapedCount++;
        console.log(`\n📄 [${scrapedCount}/${urlsToScrape.length}] Analyse détaillée de : ${url}`);

        // Politeness : Délai aléatoire (jitter) pour éviter les détections
        const randomDelay = Math.floor(Math.random() * 1000) + 1000; // Entre 1000 et 2000ms
        await page.waitForTimeout(randomDelay);

        await runWithRetry(async () => {
          await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
        });

        // Extraction des détails
        // SÉLECTEURS CSS À ADAPTER SELON LES EVOLUTIONS DE LINKEDIN :
        // - Titre : 'h1.top-card-layout__title' ou '.topcard__title'
        // - Entreprise : 'a.topcard__org-name-link' ou '.topcard__flavor a'
        // - Ville : 'span.topcard__flavor--bullet'
        // - Description : '.show-more-less-html__markup'
        // - Salaire : '.compensation__salary'
        const jobDetails = await page.evaluate(() => {
          const title = document.querySelector('h1.top-card-layout__title')?.textContent?.trim() || 
                        document.querySelector('.topcard__title')?.textContent?.trim() || 'Offre d\'emploi';
          
          const company = document.querySelector('a.topcard__org-name-link')?.textContent?.trim() || 
                          document.querySelector('.topcard__flavor a')?.textContent?.trim() || 
                          document.querySelector('.top-card-layout__subtitle-item a')?.textContent?.trim() || 'Confidentiel';
          
          const city = document.querySelector('span.topcard__flavor--bullet')?.textContent?.trim() || 
                       document.querySelector('.topcard__flavor--bullet')?.textContent?.trim() || 'Casablanca';

          const description = document.querySelector('.show-more-less-html__markup')?.innerHTML?.trim() || 
                              document.querySelector('.description__text')?.innerHTML?.trim() || '';

          const salary = document.querySelector('.compensation__salary')?.textContent?.trim() || null;

          const logo = document.querySelector('img.artdeco-entity-image')?.getAttribute('src') || null;

          return { title, company, city, description, salary, logo };
        });

        if (!jobDetails.title || !jobDetails.company) {
          console.log("⚠️ Structure d'offre incomplète, saut de cette offre.");
          continue;
        }

        // Détection de télétravail par Regex
        const textToAnalyze = `${jobDetails.title} ${jobDetails.description}`.toLowerCase();
        const isRemote = textToAnalyze.includes("telework") || 
                         textToAnalyze.includes("télétravail") || 
                         textToAnalyze.includes("remote") || 
                         textToAnalyze.includes("hybride") || 
                         textToAnalyze.includes("hybrid");

        // Calcul du hash de contenu pour éviter les écritures inutiles
        const contentHash = calculateContentHash(
          jobDetails.title,
          jobDetails.company,
          jobDetails.description,
          jobDetails.salary || ""
        );

        // Vérification préalable en base de données pour optimiser les écritures
        const { data: existing } = await supabase
          .from("scraped_jobs")
          .select("content_hash")
          .eq("source_url", url)
          .maybeSingle();

        if (existing && existing.content_hash === contentHash) {
          console.log("🔁 Offre identique déjà présente en base de données (content_hash identique). Ignorée.");
          continue;
        }

        const payload = {
          source: 'LinkedIn',
          source_url: url,
          title: jobDetails.title,
          company: jobDetails.company,
          city: jobDetails.city,
          region: 'Casablanca-Settat',
          country: 'MA',
          contract_type: 'CDI',
          experience_level: 'Mid',
          description: jobDetails.description,
          skills: ['React', 'TypeScript', 'Node.js', 'Frontend'],
          salary: jobDetails.salary,
          company_rating: 4.0,
          logo: jobDetails.logo,
          is_remote: isRemote,
          content_hash: contentHash,
          scraped_at: new Date().toISOString(),
          meta: { scraper: 'playwright-linkedin-worker' }
        };

        // Upsert dans Supabase
        const { error } = await supabase
          .from("scraped_jobs")
          .upsert(payload, { onConflict: 'source_url' });

        if (error) {
          console.error(`❌ Erreur d'enregistrement pour : ${jobDetails.title}`, error.message);
        } else {
          console.log(`✨ Enregistré avec succès : ${jobDetails.title} chez ${jobDetails.company}`);
          upsertCount++;
        }

      } catch (err: any) {
        console.error(`⚠️ Erreur d'analyse pour l'URL : ${url} :`, err.message || err);
      }
    }

  } catch (err: any) {
    console.error("❌ Erreur critique dans le flux de scraping :", err.message || err);
  } finally {
    await browser.close();
    console.log(`\n📊 [Rapport] Scraping terminé. Offres analysées : ${scrapedCount}, Offres historisées/mises à jour : ${upsertCount}`);
  }
}

scrapeLinkedIn().catch(e => {
  console.error("❌ Échec d'exécution du scraper :", e);
  process.exit(1);
});
