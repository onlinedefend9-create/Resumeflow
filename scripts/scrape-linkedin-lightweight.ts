import dotenv from "dotenv";
dotenv.config();

import * as cheerio from "cheerio";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

// Configuration des variables d'environnement
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "https://egszycbulbqgnaiuqdoq.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnc3p5Y2J1bGJxZ25haXVxZG9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMTczODIsImV4cCI6MjEwMDg5MzM4Mn0.GzHZSp5kDsql-h2T7QEYG61uBE1Dx9I-9ECUEsLTtQo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface JobState {
  lastUpdated: string | null;
  data: Array<{
    title: string;
    company: string;
    city: string;
    url: string;
  }>;
  status: string;
}

// État partagé en mémoire (équivalent du thread-safe dict en Python)
export const jobsDb: JobState = {
  lastUpdated: null,
  data: [],
  status: "Initialisé"
};

// Fonction de hachage pour l'unicité
function calculateContentHash(title: string, company: string, city: string): string {
  return crypto
    .createHash("sha1")
    .update(`${title}|${company}|${city}`)
    .digest("hex");
}

/**
 * Version ultra-légère (sans navigateur headless) basée sur des requêtes HTTP directes et Cheerio.
 * Cette version consomme très peu de mémoire et s'exécute instantanément.
 */
export async function scrapeLinkedinJobsLightweight(keywords = "Python Developer", location = "France") {
  console.log(`\n[SCRAPER LIGHTWEIGHT] Lancement de la recherche pour: "${keywords}" à "${location}"`);
  jobsDb.status = "En cours...";

  // Construction de l'URL de recherche d'invité publique de LinkedIn
  const url = new URL("https://www.linkedin.com/jobs/search");
  url.searchParams.append("keywords", keywords);
  url.searchParams.append("location", location);
  url.searchParams.append("position", "1");
  url.searchParams.append("pageNum", "0");

  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
    "Referer": "https://www.linkedin.com/jobs/search"
  };

  try {
    const response = await fetch(url.toString(), { headers, signal: AbortSignal.timeout(15000) });
    
    if (response.status === 200) {
      const html = await response.text();
      const $ = cheerio.load(html);
      
      // Recherche des cartes d'emploi retournées dans le fragment HTML
      const jobCards = $("li");
      const scrapedJobs: any[] = [];

      jobCards.each((_, el) => {
        try {
          const card = $(el);
          const titleElem = card.find(".base-search-card__title, h3");
          const companyElem = card.find(".base-search-card__subtitle, h4, .topcard__org-name-link");
          const locationElem = card.find(".job-search-card__location, span.topcard__flavor--bullet");
          const linkElem = card.find(".base-card__full-link, a");

          const title = titleElem.text().trim();
          const company = companyElem.text().trim();
          const city = locationElem.text().trim() || "Non spécifié";
          const rawUrl = linkElem.attr("href") || "#";
          const cleanUrl = rawUrl.split("?")[0];

          if (title && company) {
            const contentHash = calculateContentHash(title, company, city);
            scrapedJobs.push({
              title,
              company,
              city,
              source_url: cleanUrl,
              content_hash: contentHash,
              source: "LinkedIn",
              scraped_at: new Date().toISOString()
            });
          }
        } catch {
          // Ignore les éléments mal formatés
        }
      });

      // Garder les 10 premières offres
      jobsDb.data = scrapedJobs.slice(0, 10).map(j => ({
        title: j.title,
        company: j.company,
        city: j.city,
        url: j.source_url
      }));
      jobsDb.lastUpdated = new Date().toISOString().replace("T", " ").substring(0, 19);
      jobsDb.status = "Succès";

      console.log(`[SCRAPER LIGHTWEIGHT] Succès : ${scrapedJobs.length} offres trouvées. (Top 10 sauvegardé en mémoire)`);

      // Enregistrement asynchrone des offres valides dans Supabase
      const validJobsToInsert = scrapedJobs.filter(j => j.source_url && j.source_url !== "#");
      if (validJobsToInsert.length > 0) {
        console.log(`[SCRAPER LIGHTWEIGHT] Tentative d'historisation de ${validJobsToInsert.length} offres dans Supabase...`);
        const { error } = await supabase
          .from("scraped_jobs")
          .upsert(validJobsToInsert, { onConflict: "source_url" });

        if (error) {
          console.error("❌ [Supabase Upsert Warning] Erreur d'enregistrement :", error.message);
        } else {
          console.log("✨ [Supabase Upsert Success] Offres insérées/mises à jour de manière transparente !");
        }
      }

    } else if (response.status === 429) {
      console.warn("[SCRAPER LIGHTWEIGHT] Rate limit rencontré (429) par l'IP du serveur.");
      jobsDb.status = "Bloqué (429)";
    } else {
      console.warn(`[SCRAPER LIGHTWEIGHT] Erreur serveur LinkedIn. Code : ${response.status}`);
      jobsDb.status = `Erreur HTTP ${response.status}`;
    }
  } catch (err: any) {
    console.error(`[SCRAPER LIGHTWEIGHT CRASH] Erreur critique :`, err.message || err);
    jobsDb.status = `Exception: ${err.message || err}`;
  }
}

// Lancement de la boucle de fond autonome si exécuté directement
const isMainFile = process.argv[1] && (
  process.argv[1].endsWith("scrape-linkedin-lightweight.ts") || 
  process.argv[1].endsWith("scrape-linkedin-lightweight.js")
);

if (isMainFile) {
  async function runScraperLoop() {
    console.log("🔄 Lancement de la boucle de fond du scraper ultra-léger (cycles de 60 minutes)...");
    while (true) {
      await scrapeLinkedinJobsLightweight("Python Developer", "France");
      console.log("💤 En attente du prochain cycle de scraping léger...");
      await new Promise((resolve) => setTimeout(resolve, 3600000)); // 60 minutes
    }
  }

  runScraperLoop().catch(err => {
    console.error("❌ Échec de la boucle de scraping autonome :", err);
  });
}
