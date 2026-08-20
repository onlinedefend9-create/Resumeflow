import { spawn } from "child_process";
import path from "path";

async function runScript(scriptPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log(`\n🏃 Execution du script : ${scriptPath}...`);
    
    const process = spawn("npx", ["tsx", scriptPath], {
      stdio: "inherit",
      shell: true
    });

    process.on("close", (code) => {
      if (code === 0) {
        console.log(`✅ Script terminé avec succès : ${scriptPath}`);
        resolve();
      } else {
        console.error(`❌ Script échoué avec le code de sortie : ${code}`);
        reject(new Error(`Le script a échoué avec le code ${code}`));
      }
    });
  });
}

async function runAllScrapers() {
  console.log("🏁 Démarrage de l'orchestrateur de scraping général...");
  
  const scrapers = [
    path.join(process.cwd(), "scripts", "scrape-linkedin.ts"),
    path.join(process.cwd(), "scripts", "scrape-linkedin-lightweight.ts")
  ];

  for (const scraper of scrapers) {
    try {
      await runScript(scraper);
    } catch (err: any) {
      console.error(`⚠️ Échec de l'orchestrateur sur : ${scraper} - `, err.message || err);
    }
  }

  console.log("\n🎉 Tous les scrapers programmés ont été exécutés.");
}

runAllScrapers().catch(e => {
  console.error("❌ Erreur fatale dans l'orchestrateur :", e);
  process.exit(1);
});
