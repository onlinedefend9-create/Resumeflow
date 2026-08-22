import dotenv from "dotenv";
dotenv.config();

import Parser from "rss-parser";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

// ==================== CONFIGURATION ====================
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const SCRAPE_LIMIT = Number(process.env.SCRAPE_LIMIT || 30);
const SKIP_ROBOTS_CHECK = process.env.SKIP_ROBOTS_CHECK === "true";

// Adzuna API credentials
const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID || "d38ef67c";
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY || "894ff9c26f634b3f8a0b06b025c8629f";

const USER_AGENT = process.env.USER_AGENT || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

// ==================== VALIDATION ====================
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ [FATAL] SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquent!");
  console.error("   - SUPABASE_URL:", SUPABASE_URL ? "✅ Configuré" : "❌ Manquant");
  console.error("   - SUPABASE_SERVICE_ROLE_KEY:", SUPABASE_SERVICE_ROLE_KEY ? "✅ Configuré" : "❌ Manquant");
  process.exit(1);
}

if (SUPABASE_URL.includes("votre-projet") || SUPABASE_URL.includes("example.com")) {
  console.error("❌ [FATAL] URL Supabase invalide/placeholder. Configurez GitHub Secrets correctement.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ==================== UTILS ====================
function calculateContentHash(title: string, company: string, description: string, salary: string = ""): string {
  return crypto
    .createHash("sha1")
    .update(`${title}|${company}|${description}|${salary}`)
    .digest("hex");
}

async function testSupabaseConnection(): Promise<boolean> {
  try {
    console.log("[TEST] Vérification de la connexion Supabase...");
    const { data, error } = await supabase
      .from("scraped_jobs")
      .select("id", { count: "exact", head: true });

    if (error) {
      console.error("❌ [Supabase] Erreur de connexion:", error.message);
      return false;
    }
    console.log("✅ [Supabase] Connexion OK");
    return true;
  } catch (err: any) {
    console.error("❌ [Supabase] Exception:", err.message);
    return false;
  }
}

async function upsertJobs(jobs: any[], source: string): Promise<number> {
  if (jobs.length === 0) {
    console.log(`ℹ️ [${source}] Aucune offre à insérer.`);
    return 0;
  }

  try {
    console.log(`📥 [${source}] Upsert de ${jobs.length} offres dans Supabase...`);
    const { error, data } = await supabase
      .from("scraped_jobs")
      .upsert(jobs, { onConflict: "source_url" });

    if (error) {
      console.error(`❌ [${source}] Erreur Supabase:`, error.message);
      return 0;
    }

    console.log(`✅ [${source}] ${jobs.length} offres insérées/mises à jour`);
    return jobs.length;
  } catch (err: any) {
    console.error(`❌ [${source}] Exception upsert:`, err.message);
    return 0;
  }
}

// ==================== ADZUNA SCRAPER ====================
async function scrapeAdzuna(): Promise<number> {
  console.log("\n🔍 [ADZUNA] Démarrage du scraping Adzuna...");
  let totalInserted = 0;

  try {
    const url = `https://api.adzuna.com/v1/api/jobs/ma/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}&results_per_page=${SCRAPE_LIMIT}&what=developer`;
    console.log(`📡 [ADZUNA] Appel API: ${url.replace(ADZUNA_APP_KEY, "***")}`);

    const response = await fetch(url, { signal: AbortSignal.timeout(15000) });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data: any = await response.json();

    if (!data.results || data.results.length === 0) {
      console.log("ℹ️ [ADZUNA] Aucune offre retournée.");
      return 0;
    }

    const formattedJobs = data.results.map((item: any) => {
      const title = item.title || "Développeur";
      const company = item.company?.display_name || "Confidentiel";
      const description = item.description || "";
      const salary = item.salary_min ? `${item.salary_min} MAD` : null;

      return {
        title,
        company,
        country: "MA",
        region: item.location?.area?.[1] || "Casablanca-Settat",
        city: item.location?.area?.[2] || "Casablanca",
        contract_type: item.contract_time === "full_time" ? "CDI" : "CDD",
        experience_level: "Mid",
        skills: item.category?.label ? [item.category.label] : ["IT"],
        description,
        is_remote: 
          title.toLowerCase().includes("remote") ||
          title.toLowerCase().includes("télétravail") ||
          description.toLowerCase().includes("télétravail"),
        source_url: item.redirect_url,
        salary,
        content_hash: calculateContentHash(title, company, description, salary || ""),
        source: "Adzuna",
        scraped_at: new Date().toISOString()
      };
    });

    totalInserted = await upsertJobs(formattedJobs, "ADZUNA");
  } catch (err: any) {
    console.error("❌ [ADZUNA] Erreur:", err.message);
  }

  return totalInserted;
}

// ==================== RSS FALLBACK ====================
async function scrapeRSSFeeds(): Promise<number> {
  console.log("\n🔍 [RSS] Démarrage du scraping RSS (fallback)...");
  const parser = new Parser();
  let totalInserted = 0;

  const rssFeeds = [
    // Feeds fiables pour le Maroc / développeurs
    "https://www.indeed.com/rss?q=developer&l=Morocco&jt=fulltime",
    "https://jobs.github.com/positions.json", // GitHub Jobs API (non-RSS mais compatible fetch)
    "https://www.monster.com/jobs/search/?q=Developer&where=Morocco&has_salary=1"
  ];

  for (const feedUrl of rssFeeds) {
    try {
      console.log(`📡 [RSS] Lecture: ${feedUrl}`);
      
      // Cas spécial pour GitHub Jobs (JSON)
      if (feedUrl.includes("github.com")) {
        const response = await fetch(feedUrl, { signal: AbortSignal.timeout(10000) });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const jobs: any[] = await response.json();
        if (!Array.isArray(jobs)) {
          console.warn("⚠️ [RSS] Format JSON inattendu");
          continue;
        }

        const formattedJobs = jobs.slice(0, SCRAPE_LIMIT).map((job: any) => ({
          title: job.title || "Développeur",
          company: job.company || "Confidentiel",
          city: job.location || "Remote",
          description: job.description || "",
          source_url: job.url,
          source: "GitHub Jobs",
          is_active: true,
          is_remote: job.type?.includes("remote") || false,
          content_hash: calculateContentHash(job.title || "", job.company || "", job.description || ""),
          created_at: new Date().toISOString(),
          scraped_at: new Date().toISOString()
        })).filter(j => j.source_url);

        const inserted = await upsertJobs(formattedJobs, "RSS-GitHub");
        totalInserted += inserted;
        continue;
      }

      // Cas normal RSS
      const feed = await parser.parseURL(feedUrl);
      if (!feed.items || feed.items.length === 0) {
        console.warn(`⚠️ [RSS] Flux vide: ${feedUrl}`);
        continue;
      }

      const formattedJobs = feed.items.slice(0, SCRAPE_LIMIT).map((item: any) => ({
        title: item.title || "Offre d'emploi",
        company: item.creator || item.author || "Confidentiel",
        city: "Maroc",
        description: item.contentSnippet || item.content || "",
        source_url: item.link || "",
        source: "RSS Feed",
        is_active: true,
        content_hash: calculateContentHash(
          item.title || "",
          item.creator || item.author || "",
          item.contentSnippet || item.content || ""
        ),
        created_at: item.isoDate || new Date().toISOString(),
        scraped_at: new Date().toISOString()
      })).filter(j => j.source_url);

      const inserted = await upsertJobs(formattedJobs, `RSS-${new URL(feedUrl).hostname}`);
      totalInserted += inserted;

    } catch (err: any) {
      console.warn(`⚠️ [RSS] Erreur pour ${feedUrl}:`, err.message);
    }
  }

  return totalInserted;
}

// ==================== LINKEDIN PLAYWRIGHT (optionnel) ====================
/**
 * Scraper LinkedIn avec Playwright (intensif en ressources)
 * Activé uniquement si ENABLE_LINKEDIN_PLAYWRIGHT=true
 */
async function scrapeLinkedInPlaywright(): Promise<number> {
  const enableLinkedIn = process.env.ENABLE_LINKEDIN_PLAYWRIGHT === "true";
  if (!enableLinkedIn) {
    console.log("\n⏭️ [LINKEDIN] Scraper Playwright désactivé (ENABLE_LINKEDIN_PLAYWRIGHT=false)");
    return 0;
  }

  console.log("\n🔍 [LINKEDIN] Démarrage du scraping Playwright (mode avancé)...");

  try {
    // Dynamique import pour éviter les dépendances si non utilisé
    const { chromium } = require("playwright");
    
    const browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const context = await browser.newContext({ userAgent: USER_AGENT });
    const page = await context.newPage();
    let totalInserted = 0;

    try {
      const searchUrl = "https://www.linkedin.com/jobs/search/?keywords=Developer&location=Casablanca&limit=" + SCRAPE_LIMIT;
      console.log(`📡 [LINKEDIN] Navigation vers: ${searchUrl}`);

      await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 30000 });

      // Extraction des URLs d'offres
      const jobUrls = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll("a.base-card__full-link"));
        return links.map(el => (el as HTMLAnchorElement).href).filter(url => !!url);
      });

      console.log(`🎯 [LINKEDIN] ${jobUrls.length} offres détectées`);

      for (const url of jobUrls.slice(0, SCRAPE_LIMIT)) {
        try {
          await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
          await page.waitForTimeout(500 + Math.random() * 1000); // Politeness

          const jobDetails = await page.evaluate(() => {
            return {
              title: document.querySelector("h1.top-card-layout__title")?.textContent?.trim() || "",
              company: document.querySelector("a.topcard__org-name-link")?.textContent?.trim() || "",
              city: document.querySelector("span.topcard__flavor--bullet")?.textContent?.trim() || "Casablanca",
              description: document.querySelector(".show-more-less-html__markup")?.textContent?.trim() || "",
              salary: document.querySelector(".compensation__salary")?.textContent?.trim() || null
            };
          });

          if (!jobDetails.title || !jobDetails.company) continue;

          const payload = {
            title: jobDetails.title,
            company: jobDetails.company,
            city: jobDetails.city,
            description: jobDetails.description,
            source_url: url,
            source: "LinkedIn",
            is_remote: (jobDetails.description + jobDetails.title).toLowerCase().includes("remote"),
            salary: jobDetails.salary,
            content_hash: calculateContentHash(jobDetails.title, jobDetails.company, jobDetails.description, jobDetails.salary || ""),
            country: "MA",
            region: "Casablanca-Settat",
            contract_type: "CDI",
            experience_level: "Mid",
            skills: ["React", "TypeScript", "Node.js"],
            scraped_at: new Date().toISOString()
          };

          const inserted = await upsertJobs([payload], "LINKEDIN");
          totalInserted += inserted;
        } catch (err: any) {
          console.warn(`⚠️ [LINKEDIN] Erreur pour ${url}:`, err.message);
        }
      }

      return totalInserted;
    } finally {
      await browser.close();
    }
  } catch (err: any) {
    console.error("❌ [LINKEDIN] Erreur critique:", err.message);
    return 0;
  }
}

// ==================== MAIN ORCHESTRATOR ====================
async function runAllScrapers() {
  console.log("═══════════════════════════════════════════════════════");
  console.log("🚀 [ORCHESTRATOR] Démarrage du scraping multi-sources");
  console.log("═══════════════════════════════════════════════════════\n");

  const startTime = Date.now();

  // Test de connexion Supabase
  const dbConnected = await testSupabaseConnection();
  if (!dbConnected) {
    console.error("❌ [FATAL] Impossible de se connecter à Supabase. Arrêt.");
    process.exit(1);
  }

  const results: { [key: string]: number } = {};

  // Phase 1: Adzuna (API officielle - fiable)
  try {
    results.adzuna = await scrapeAdzuna();
  } catch (err: any) {
    console.error("❌ [ORCHESTRATOR] Adzuna échoué:", err.message);
    results.adzuna = 0;
  }

  // Phase 2: LinkedIn Playwright (optionnel - intensif)
  try {
    results.linkedin = await scrapeLinkedInPlaywright();
  } catch (err: any) {
    console.error("❌ [ORCHESTRATOR] LinkedIn Playwright échoué:", err.message);
    results.linkedin = 0;
  }

  // Phase 3: RSS Feeds (fallback - léger)
  try {
    results.rss = await scrapeRSSFeeds();
  } catch (err: any) {
    console.error("❌ [ORCHESTRATOR] RSS échoué:", err.message);
    results.rss = 0;
  }

  // Résumé final
  const totalInserted = Object.values(results).reduce((a, b) => a + b, 0);
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log("\n═══════════════════════════════════════════════════════");
  console.log("📊 [RÉSUMÉ] Scraping terminé");
  console.log("═══════════════════════════════════════════════════════");
  console.log(`  Adzuna:     ${results.adzuna} offres ✨`);
  console.log(`  LinkedIn:   ${results.linkedin} offres 🔗`);
  console.log(`  RSS:        ${results.rss} offres 📡`);
  console.log(`  ─────────────────────────────────`);
  console.log(`  TOTAL:      ${totalInserted} offres`);
  console.log(`  Durée:      ${duration}s`);
  console.log("═══════════════════════════════════════════════════════\n");

  if (totalInserted === 0) {
    console.warn("⚠️ [WARNING] Aucune offre n'a été trouvée. Vérifiez les configurations.");
  } else {
    console.log("✅ [SUCCESS] Scraping multi-sources complété!");
  }

  process.exit(totalInserted > 0 ? 0 : 1);
}

// Lancement
runAllScrapers().catch(err => {
  console.error("❌ [FATAL] Exception non gérée:", err);
  process.exit(1);
});
