import dotenv from "dotenv";
dotenv.config();

import { createClient } from "@supabase/supabase-js";
import { fetchLinkedinJobs } from "../src/lib/linkedinWrapper.ts";

let supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "https://egszycbulbqgnaiuqdoq.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnc3p5Y2J1bGJxZ25haXVxZG9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMTczODIsImV4cCI6MjEwMDg5MzM4Mn0.GzHZSp5kDsql-h2T7QEYG61uBE1Dx9I-9ECUEsLTtQo";

try {
  const parts = supabaseAnonKey.split('.');
  if (parts.length === 3) {
    const decoded = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
    if (decoded && decoded.ref) {
      supabaseUrl = `https://${decoded.ref}.supabase.co`;
    }
  }
} catch (err) {
  console.warn("[Supabase] Impossible de décoder la clé, utilisation de l'URL par défaut :", err);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function synchronizeJobs() {
  console.log("🔄 Démarrage de la synchronisation des offres LinkedIn...");
  
  // List of keywords and locations to scrape to have a rich database of offers
  const keywords = ["React", "TypeScript", "Node.js", "Développeur", "Frontend", "Backend", "Fullstack"];
  const locations = ["Casablanca", "Maroc", "Paris", "France", "Remote"];

  let totalInserted = 0;

  for (const keyword of keywords) {
    for (const location of locations) {
      try {
        console.log(`📡 Récupération locale de : "${keyword}" à "${location}"...`);
        const jobs = await fetchLinkedinJobs({
          keyword,
          location,
          limit: 15
        });

        if (!jobs || jobs.length === 0) {
          console.log(`⚠️ Aucune offre trouvée pour "${keyword}" @ "${location}"`);
          continue;
        }

        const cleanJobs = jobs
          .filter(job => job.url)
          .map(job => ({
            title: job.title || "Offre d'emploi",
            company: job.company || "Confidentiel",
            city: job.city || location || "Maroc",
            date: job.date || null,
            salary: job.salary || null,
            url: job.url,
            logo: job.logo || null,
            source: 'LinkedIn'
          }));

        if (cleanJobs.length > 0) {
          const { error } = await supabase
            .from("linkedin_jobs")
            .upsert(cleanJobs, { onConflict: "url" });

          if (error) {
            console.error(`❌ Erreur d'insertion dans Supabase pour "${keyword}" @ "${location}" :`, error.message);
          } else {
            console.log(`✅ ${cleanJobs.length} offres enregistrées/mise à jour pour "${keyword}" @ "${location}"`);
            totalInserted += cleanJobs.length;
          }
        }

        // Delay to avoid hitting rate limits on the local network IP
        await new Promise(resolve => setTimeout(resolve, 3000));

      } catch (err: any) {
        console.error(`⚠️ Erreur de récupération pour "${keyword}" @ "${location}" :`, err.message || err);
      }
    }
  }

  console.log(`\n🎉 Synchronisation terminée ! Total d'offres LinkedIn traitées : ${totalInserted}`);
  process.exit(0);
}

synchronizeJobs().catch(e => {
  console.error("❌ Erreur critique lors de la synchronisation :", e);
  process.exit(1);
});
