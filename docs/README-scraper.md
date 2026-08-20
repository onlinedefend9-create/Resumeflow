# 🤖 Resumeflow - Playwright & Supabase Scraping Engine

Ce sous-système automatise l'extraction, la normalisation et l'historisation des offres d'emploi LinkedIn directement dans votre base de données Supabase.

---

## ⚙️ Configuration & Variables d'environnement

Le scraper a besoin des secrets de votre projet. Ne les commitez jamais en clair. Configurez-les dans un fichier `.env` local ou dans l'interface de gestion de votre plateforme (Vercel / GitHub Secrets) :

| Variable | Description | Exemple / Valeur |
| :--- | :--- | :--- |
| `SUPABASE_URL` | L'URL d'API de votre base de données Supabase | `https://xxxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | La clé d'accès Admin bypassant les sécurités RLS (strictement confidentiel) | `eyJhbGciOiJIUzI1NiIsInR5c...` |
| `SCRAPE_LIMIT` | Nombre maximal d'offres à scraper par exécution | `20` (par défaut) |
| `SKIP_ROBOTS_CHECK` | Permet d'ignorer la vérification de robots.txt (uniquement pour le dev local) | `true` ou `false` |
| `USER_AGENT` | User-agent personnalisé pour s'identifier | `Mozilla/5.0 ...` |

---

## 🏃 Exécution et Test Local

### 1. Installation des dépendances requises
```bash
npm install
npx playwright install chromium --with-deps
```

### 2. Lancer le scraping de LinkedIn individuellement
```bash
npx tsx scripts/scrape-linkedin.ts
```

### 3. Lancer l'orchestrateur complet (qui appelle tous les scrapers)
```bash
npx tsx scripts/scrape-all.ts
```

---

## 🏗️ Déploiement en Production

### Option A : Déploiement par Docker (Cloud Run / AWS ECS)
Vous pouvez builder et déployer l'image sur n'importe quel orchestrateur de conteneurs :
```bash
# Compiler l'image
docker build -t resumeflow-scraper -f Dockerfile.scraper .

# Lancer localement le conteneur
docker run --rm \
  -e SUPABASE_URL="https://egszycbulbqgnaiuqdoq.supabase.co" \
  -e SUPABASE_SERVICE_ROLE_KEY="VOTRE_CLE" \
  resumeflow-scraper
```

### Option B : GitHub Actions (Gratuit et Intégré)
Le workflow d'automatisation est pré-configuré sous `.github/workflows/scrape-schedule.yml`. Il s'exécute toutes les 30 minutes de manière transparente.
Pour l'activer, ajoutez simplement vos secrets `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` dans les **Repository Secrets** de votre projet GitHub.

---

## 🔍 Comment adapter les sélecteurs DOM LinkedIn ?

LinkedIn met fréquemment à jour les classes de ses pages d'offres publiques. Si le scraper ne remonte plus d'offres, modifiez les sélecteurs CSS suivants directement dans `/scripts/scrape-linkedin.ts` :

- **Liste de résultats (recherche)** : `const jobListSelector = ".jobs-search__results-list li"`
- **Lien vers le détail de l'offre** : `const jobLinkSelector = "a.base-card__full-link"`
- **Titre du Poste** : `document.querySelector('h1.top-card-layout__title')`
- **Nom de l'Entreprise** : `document.querySelector('a.topcard__org-name-link')`
- **Ville de l'Offre** : `document.querySelector('span.topcard__flavor--bullet')`
- **Description HTML** : `document.querySelector('.show-more-less-html__markup')`

---

## 🔒 Sécurité
> ⚠️ **CRITICAL SECURITY NOTE :** Ne transmettez **jamais** la clé `SUPABASE_SERVICE_ROLE_KEY` à votre client frontend (React/Vite). Cette clé permet d'outrepasser toutes les règles de sécurité (Row Level Security). Utilisez-la uniquement en environnement serveur ou dans ce script de scraping.
