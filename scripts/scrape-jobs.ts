import dotenv from "dotenv";
dotenv.config();

import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "https://egszycbulbqgnaiuqdoq.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

// Identifiants Adzuna (optionnels avec repli vers des valeurs par défaut pour tester)
const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID || "d38ef67c";
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY || "894ff9c26f634b3f8a0b06b025c8629f";

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Erreur : SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY non spécifié.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function scrapeAndIngest() {
  console.log("🚀 Démarrage du scraping serverless Adzuna...");

  try {
    const url = `https://api.adzuna.com/v1/api/jobs/ma/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}&results_per_page=30&what=developer`;
    console.log(`📡 Appel de l'API Adzuna : ${url.replace(ADZUNA_APP_KEY, "HIDDEN_KEY")}...`);

    const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!response.ok) {
      throw new Error(`Erreur HTTP de l'API Adzuna : Code ${response.status}`);
    }

    const data: any = await response.json();
    if (!data.results || data.results.length === 0) {
      console.log("ℹ️ Aucune offre retournée par l'API Adzuna.");
      return;
    }

    const formattedJobs = data.results.map((item: any) => {
      const title = item.title || "Développeur";
      const company = item.company?.display_name || "Confidentiel";
      const description = item.description || "";
      const contentHash = crypto
        .createHash("sha1")
        .update(`${title}|${company}|${description}`)
        .digest("hex");

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
        is_remote: title.toLowerCase().includes("remote") || title.toLowerCase().includes("télétravail") || description.toLowerCase().includes("télétravail"),
        source_url: item.redirect_url,
        salary: item.salary_min ? `${item.salary_min} MAD` : null,
        content_hash: contentHash,
        source: "Adzuna",
        scraped_at: new Date().toISOString()
      };
    });

    console.log(`📥 Upsert de ${formattedJobs.length} offres Adzuna dans la table scraped_jobs...`);

    // Ingestion directe avec gestion des conflits sur source_url
    const { error } = await supabase
      .from("scraped_jobs")
      .upsert(formattedJobs, { onConflict: "source_url" });

    if (error) {
      console.error("❌ Erreur d'enregistrement Supabase :", error.message || error);
    } else {
      console.log(`✅ Ingestion réussie ! ${formattedJobs.length} offres Adzuna traitées.`);
    }

  } catch (err: any) {
    console.error("❌ Échec de la routine de scraping Adzuna :", err.message || err);
  }
}

scrapeAndIngest();
