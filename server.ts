import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini client with standard telemetry headers
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Safe redirect URI resolver supporting proxy SSL termination
  const getRedirectUri = (req: express.Request, path: string) => {
    const host = req.get('host') || '';
    
    // In local development, use localhost
    if (host.includes('localhost') || host.includes('127.0.0.1')) {
      return `http://${host}${path}`;
    }
    
    // In AI Studio preview or cloud deployment, prefer APP_URL to match the registered OAuth redirect URI
    if (process.env.APP_URL) {
      const baseUrl = process.env.APP_URL.endsWith('/') ? process.env.APP_URL.slice(0, -1) : process.env.APP_URL;
      return `${baseUrl}${path}`;
    }
    
    // Fallback to request host
    return `https://${host}${path}`;
  };

  // Serve JSON parsing middleware
  app.use(express.json());

  // API Route for Supabase OAuth URL
  app.get('/api/auth/supabase/url', (req, res) => {
    const redirectUri = getRedirectUri(req, '/api/auth/supabase/callback');
    const clientId = process.env.VITE_SUPABASE_OAUTH_CLIENT_ID || process.env.SUPABASE_OAUTH_CLIENT_ID;
    
    if (!clientId) {
      return res.status(400).json({ error: "Client ID non configuré. Veuillez définir VITE_SUPABASE_OAUTH_CLIENT_ID dans l'éditeur." });
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'all',
      state: 'supabase_auth'
    });

    const authUrl = `https://api.supabase.com/v1/oauth/authorize?${params.toString()}`;
    res.json({ url: authUrl });
  });

  // Callback route
  app.get('/api/auth/supabase/callback', async (req, res) => {
    const { code } = req.query;
    if (!code) {
      return res.status(400).send("Code d'autorisation manquant.");
    }

    const clientId = process.env.VITE_SUPABASE_OAUTH_CLIENT_ID || process.env.SUPABASE_OAUTH_CLIENT_ID;
    const clientSecret = process.env.VITE_SUPABASE_OAUTH_CLIENT_SECRET || process.env.SUPABASE_OAUTH_CLIENT_SECRET;
    const redirectUri = getRedirectUri(req, '/api/auth/supabase/callback');

    if (!clientId || !clientSecret) {
      return res.status(400).send("Identifiants Supabase OAuth manquants.");
    }

    try {
      const tokenResponse = await fetch('https://api.supabase.com/v1/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code as string,
          redirect_uri: redirectUri,
        })
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        throw new Error(`Échec de l'échange de token: ${errorText}`);
      }

      const tokens = await tokenResponse.json();
      const accessToken = tokens.access_token;

      const userinfoResponse = await fetch('https://api.supabase.com/v1/oauth/userinfo', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!userinfoResponse.ok) {
        const errorText = await userinfoResponse.text();
        throw new Error(`Échec de récupération du profil: ${errorText}`);
      }

      const profile = await userinfoResponse.json();

      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Authentification Réussie</title>
            <meta charset="utf-8" />
            <style>
              body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #f9fafb; color: #1f2937; }
              .card { text-align: center; padding: 2rem; background: white; border-radius: 1rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #e5e7eb; max-width: 400px; }
              h1 { color: #10b981; font-size: 1.5rem; margin-bottom: 0.5rem; }
              p { color: #6b7280; font-size: 0.875rem; }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>Connexion Réussie !</h1>
              <p>Vous êtes maintenant connecté avec votre compte Supabase.</p>
              <p>Cette fenêtre va se fermer automatiquement...</p>
            </div>
            <script>
              if (window.opener) {
                window.opener.postMessage({ 
                  type: 'OAUTH_AUTH_SUCCESS', 
                  provider: 'supabase',
                  user: {
                    uid: 'supabase_' + (profile.sub || profile.id),
                    email: profile.email,
                    displayName: profile.name || profile.user_metadata?.full_name || profile.email.split('@')[0],
                    photoURL: profile.picture || profile.avatar_url || null
                  }
                }, '*');
                setTimeout(() => {
                  window.close();
                }, 1000);
              } else {
                window.location.href = '/';
              }
            </script>
          </body>
        </html>
      `);
    } catch (err: any) {
      console.error('Erreur Supabase Callback:', err);
      res.status(500).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Échec de l'Authentification</title>
            <meta charset="utf-8" />
            <style>
              body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #fdf2f2; color: #9b1c1c; }
              .card { text-align: center; padding: 2rem; background: white; border-radius: 1rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #fecaca; max-width: 450px; }
              h1 { color: #de2727; font-size: 1.5rem; margin-bottom: 0.5rem; }
              p { color: #4b5563; font-size: 0.875rem; line-height: 1.5; }
              code { background: #f3f4f6; padding: 0.25rem 0.5rem; border-radius: 0.375rem; font-family: monospace; font-size: 0.75rem; word-break: break-all; }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>Erreur de Connexion</h1>
              <p>Une erreur est survenue lors de la connexion avec Supabase :</p>
              <p><code>${err.message || err}</code></p>
              <p>Veuillez fermer cette fenêtre et réessayer.</p>
            </div>
          </body>
        </html>
      `);
    }
  });

  // ---------------- LINKEDIN OAUTH ENDPOINTS ----------------

  // Debug endpoint to help users diagnose LinkedIn configuration
  app.get('/api/auth/linkedin/debug', (req, res) => {
    const host = req.get('host') || '';
    const protocol = host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https';
    const reqRedirectUri = `${protocol}://${host}/api/auth/linkedin/callback`;
    const appUrlRedirectUri = process.env.APP_URL 
      ? `${process.env.APP_URL.endsWith('/') ? process.env.APP_URL.slice(0, -1) : process.env.APP_URL}/api/auth/linkedin/callback`
      : null;
    const finalRedirectUri = getRedirectUri(req, '/api/auth/linkedin/callback');

    const clientId = process.env.VITE_LINKEDIN_CLIENT_ID || process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.VITE_LINKEDIN_CLIENT_SECRET || process.env.LINKEDIN_CLIENT_SECRET;

    const mask = (val: string | undefined) => {
      if (!val) return 'Non défini / Vide';
      if (val.length <= 8) return '*'.repeat(val.length);
      return `${val.substring(0, 4)}...${val.substring(val.length - 4)} (longueur: ${val.length})`;
    };

    console.log("=== LINKEDIN AUTH DEBUG ===");
    console.log("Host header:", host);
    console.log("process.env.APP_URL:", process.env.APP_URL);
    console.log("Generated Request-based Redirect URI:", reqRedirectUri);
    console.log("Generated APP_URL-based Redirect URI:", appUrlRedirectUri);
    console.log("Final chosen Redirect URI:", finalRedirectUri);
    console.log("Client ID (masked):", mask(clientId));
    console.log("Client Secret (masked):", mask(clientSecret));
    console.log("===========================");

    res.json({
      environment: {
        APP_URL: process.env.APP_URL || null,
        hostHeader: host,
      },
      configuredKeys: {
        LINKEDIN_CLIENT_ID_present: !!process.env.LINKEDIN_CLIENT_ID,
        VITE_LINKEDIN_CLIENT_ID_present: !!process.env.VITE_LINKEDIN_CLIENT_ID,
        LINKEDIN_CLIENT_SECRET_present: !!process.env.LINKEDIN_CLIENT_SECRET,
        VITE_LINKEDIN_CLIENT_SECRET_present: !!process.env.VITE_LINKEDIN_CLIENT_SECRET,
        clientIdMasked: mask(clientId),
        clientSecretMasked: mask(clientSecret),
      },
      redirectUris: {
        requestBased: reqRedirectUri,
        appUrlBased: appUrlRedirectUri,
        finalChosen: finalRedirectUri,
      },
      instructions: "Veuillez vous assurer que 'finalChosen' est EXACTEMENT répertorié dans la console développeur de LinkedIn (LinkedIn Developer Portal -> Auth -> Authorized redirect URLs for 3-legged OAuth). Dans l'environnement AI Studio, nous vous suggérons d'enregistrer ces deux URIs dans votre application LinkedIn :\n1. https://ais-dev-k64ughw3p2e2xjs24kdye5-707578475350.europe-west2.run.app/api/auth/linkedin/callback\n2. https://ais-pre-k64ughw3p2e2xjs24kdye5-707578475350.europe-west2.run.app/api/auth/linkedin/callback"
    });
  });

  // Endpoint to get LinkedIn authorization URL
  app.get('/api/auth/linkedin/url', (req, res) => {
    const redirectUri = getRedirectUri(req, '/api/auth/linkedin/callback');
    const clientId = process.env.VITE_LINKEDIN_CLIENT_ID || process.env.LINKEDIN_CLIENT_ID;

    console.log("[LinkedIn Auth] url request:");
    console.log(" - host:", req.get('host'));
    console.log(" - redirectUri generated:", redirectUri);
    console.log(" - clientId resolved:", clientId ? `${clientId.substring(0, 4)}...` : 'undefined');

    if (!clientId) {
      return res.status(400).json({
        error: "Client ID LinkedIn non configuré. Veuillez définir LINKEDIN_CLIENT_ID dans vos variables d'environnement."
      });
    }

    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=openid%20profile%20email&state=linkedin_auth`;
    res.json({ url: authUrl });
  });

  // Callback endpoint for LinkedIn OAuth
  app.get('/api/auth/linkedin/callback', async (req, res) => {
    const code = req.query.code as string;
    const error = req.query.error as string;
    const errorDescription = req.query.error_description as string;
    const redirectUri = getRedirectUri(req, '/api/auth/linkedin/callback');
    const clientId = process.env.VITE_LINKEDIN_CLIENT_ID || process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.VITE_LINKEDIN_CLIENT_SECRET || process.env.LINKEDIN_CLIENT_SECRET;

    console.log("[LinkedIn Auth] callback received:");
    console.log(" - query code present:", !!code);
    console.log(" - query error:", error || 'none');
    console.log(" - query error_description:", errorDescription || 'none');
    console.log(" - redirectUri used for exchange:", redirectUri);
    console.log(" - clientId resolved:", clientId ? `${clientId.substring(0, 4)}...` : 'undefined');
    console.log(" - clientSecret resolved:", clientSecret ? `${clientSecret.substring(0, 4)}...` : 'undefined');

    if (error) {
      return res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Erreur d'authentification LinkedIn</title>
            <style>
              body { font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f9fafb; }
              .card { text-align: center; padding: 2rem; background: white; border-radius: 1rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #fecaca; max-width: 450px; }
              h1 { color: #de2727; font-size: 1.5rem; margin-bottom: 0.5rem; }
              p { color: #4b5563; font-size: 0.875rem; line-height: 1.5; }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>Erreur LinkedIn</h1>
              <p>${errorDescription || error}</p>
              <p>Veuillez fermer cette fenêtre et réessayer.</p>
            </div>
            <script>
              if (window.opener) {
                window.opener.postMessage({ 
                  type: 'LINKEDIN_AUTH_ERROR', 
                  error: ${JSON.stringify(errorDescription || error)} 
                }, window.location.origin);
              }
            </script>
          </body>
        </html>
      `);
    }

    if (!code) {
      return res.status(400).send("Code d'autorisation manquant.");
    }

    try {
      // Exchange code for Access Token
      const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: redirectUri,
          client_id: clientId || '',
          client_secret: clientSecret || '',
        }).toString(),
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        throw new Error(`Échec de l'échange de jeton : ${errorText}`);
      }

      const tokenData = await tokenResponse.json() as { access_token: string };
      const accessToken = tokenData.access_token;

      // Fetch user profile info
      const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!profileResponse.ok) {
        const errorText = await profileResponse.text();
        throw new Error(`Échec de la récupération du profil LinkedIn : ${errorText}`);
      }

      const profileData = await profileResponse.json() as any;

      // Render success page that postMessage's data back
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Connexion Réussie</title>
            <style>
              body { font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f9fafb; }
              .card { text-align: center; padding: 2rem; background: white; border-radius: 1rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #e5e7eb; max-width: 450px; }
              h1 { color: #0077b5; font-size: 1.5rem; margin-bottom: 0.5rem; }
              p { color: #4b5563; font-size: 0.875rem; line-height: 1.5; }
              .spinner { border: 3px solid #f3f3f3; border-top: 3px solid #0077b5; border-radius: 50%; width: 24px; height: 24px; animation: spin 1s linear infinite; margin: 1rem auto; }
              @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="spinner"></div>
              <h1>Connexion Réussie !</h1>
              <p>Votre profil LinkedIn a été importé avec succès. Transfert des données en cours...</p>
            </div>
            <script>
              const profile = ${JSON.stringify(profileData)};
              if (window.opener) {
                window.opener.postMessage({ type: 'LINKEDIN_AUTH_SUCCESS', profile: profile }, window.location.origin);
              }
              setTimeout(() => {
                window.close();
              }, 1500);
            </script>
          </body>
        </html>
      `);
    } catch (err: any) {
      console.error("LinkedIn callback error:", err);
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Erreur de Connexion</title>
            <style>
              body { font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f9fafb; }
              .card { text-align: center; padding: 2rem; background: white; border-radius: 1rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #fecaca; max-width: 450px; }
              h1 { color: #de2727; font-size: 1.5rem; margin-bottom: 0.5rem; }
              p { color: #4b5563; font-size: 0.875rem; line-height: 1.5; }
              code { background: #f3f4f6; padding: 0.25rem 0.5rem; border-radius: 0.375rem; font-family: monospace; font-size: 0.75rem; word-break: break-all; }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>Erreur de Connexion</h1>
              <p>Une erreur est survenue lors de la connexion avec LinkedIn :</p>
              <p><code>${err.message || err}</code></p>
              <p>Veuillez fermer cette fenêtre et réessayer.</p>
            </div>
            <script>
              if (window.opener) {
                window.opener.postMessage({ 
                  type: 'LINKEDIN_AUTH_ERROR', 
                  error: ${JSON.stringify(err.message || String(err))} 
                }, window.location.origin);
              }
            </script>
          </body>
        </html>
      `);
    }
  });

  // API to parse LinkedIn/CV pasted text using Gemini
  app.post('/api/import/linkedin-text', async (req, res) => {
    const { text, language = 'fr' } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Le contenu textuel est vide." });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: [
          `Voici les informations brutes extraites d'un profil ou CV (en texte libre) :\n\n\${text}\n\nAnalyse attentivement ce texte et structure-le de façon optimale au format JSON pour remplir un CV professionnel.`
        ],
        config: {
          systemInstruction: `Tu es un expert en recrutement et en rédaction de CV. Ton rôle est de parser des données textuelles provenant d'un profil LinkedIn ou d'un export PDF LinkedIn, et d'en extraire les informations de manière structurée pour générer un CV de haute qualité.
Langue demandée pour le CV structuré : \${language === 'fr' ? 'Français' : language === 'de' ? 'Allemand' : language === 'es' ? 'Espagnol' : 'Anglais'}. Si le texte d'origine est dans une autre langue, traduis de manière professionnelle les intitulés, résumés et descriptions pour correspondre à cette langue cible de manière naturelle.

Règles de structuration des sections :
1. Header :
- fullName : Nom et prénom de la personne. S'il n'est pas présent, laisse vide.
- title : Un titre professionnel accrocheur et cohérent avec l'expérience (ex: "Développeur Fullstack Senior").
- summary : Un court résumé percutant (2-3 phrases) écrit à la première personne ou de manière professionnelle.
- email, phone, location, website : Coordonnées de contact si trouvées.
2. Experience :
- Extrais l'historique professionnel. Chaque élément doit inclure 'role', 'company', 'period' (ex: "2021 - Présent" ou "Janv. 2018 - Déc. 2020"), 'location', et une 'description' détaillant les accomplissements principaux (rédige-les sous forme de puces claires si possible ou en un paragraphe fluide).
3. Education :
- Extrais le parcours académique/diplômes. Chaque élément doit inclure 'degree' (le diplôme), 'school' (l'établissement), 'period' (les années d'études), et 'location'.
4. Skills :
- Extrais une liste à plat de compétences techniques, méthodologiques et humaines clés (skillsList, un tableau de chaînes de caractères de max 12-15 compétences).`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              header: {
                type: Type.OBJECT,
                properties: {
                  fullName: { type: Type.STRING },
                  title: { type: Type.STRING },
                  email: { type: Type.STRING },
                  phone: { type: Type.STRING },
                  location: { type: Type.STRING },
                  website: { type: Type.STRING },
                  summary: { type: Type.STRING }
                },
                required: ["fullName", "title", "summary"]
              },
              experience: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    role: { type: Type.STRING },
                    company: { type: Type.STRING },
                    period: { type: Type.STRING },
                    location: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ["role", "company", "period", "description"]
                }
              },
              education: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    degree: { type: Type.STRING },
                    school: { type: Type.STRING },
                    period: { type: Type.STRING },
                    location: { type: Type.STRING }
                  },
                  required: ["degree", "school", "period"]
                }
              },
              skills: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["header", "experience", "education", "skills"]
          }
        }
      });

      const parsedJSON = JSON.parse(response.text);
      res.json(parsedJSON);
    } catch (err: any) {
      console.error("Gemini parse text error:", err);
      res.status(500).json({ error: "Une erreur est survenue lors de l'analyse IA de votre profil : " + (err.message || err) });
    }
  });

  // API to analyze CV compatibility with ATS using Gemini
  app.post('/api/cv/analyze', async (req, res) => {
    const { cvData } = req.body;

    if (!cvData) {
      return res.status(400).json({ error: "Les données du CV sont manquantes." });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: [
          `Voici le contenu du CV structuré au format JSON :\n\n${JSON.stringify(cvData, null, 2)}\n\nAnalyse ce CV par rapport aux exigences des systèmes ATS modernes (Applicant Tracking Systems) et fournis un rapport détaillé en français au format JSON.`
        ],
        config: {
          systemInstruction: `Tu es un expert en recrutement international, en algorithmes ATS et en optimisation de CV. Ton rôle est d'analyser de manière critique le CV fourni et de générer un diagnostic complet en français pour aider le candidat à maximiser son score de compatibilité avec les filtres automatisés (ATS) et les recruteurs humains.

Règles de diagnostic :
1. Score ATS (0-100) : Sois réaliste. Un CV vide ou peu détaillé doit avoir un score faible. Un CV bien fourni avec de bons descriptifs d'expérience doit avoir un score supérieur à 75.
2. Mots-clés trouvés : Identifie les compétences dures (hard skills), frameworks, méthodologies ou termes clés déjà présents.
3. Mots-clés manquants : En fonction du titre professionnel ciblé (présent dans l'en-tête), suggère 5 à 8 mots-clés stratégiques ou compétences ultra-pertinentes qui manquent ou mériteraient d'être ajoutés.
4. Évaluation par section : Analyse l'en-tête (coordonnées, titre, liens), le résumé (accroche), l'expérience (présence de verbes d'action, d'accomplissements quantifiés, clarté), la formation et les compétences.
5. Sois extrêmement constructif, précis et bienveillant. Toutes les suggestions et diagnostics doivent être rédigés en français professionnel sans jargon inutile.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER },
              matchingKeywords: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              missingKeywords: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              sectionEvaluations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    section: { type: Type.STRING },
                    status: { type: Type.STRING }, // 'good', 'warning', 'critical'
                    feedback: { type: Type.STRING },
                    suggestions: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    }
                  },
                  required: ["section", "status", "feedback", "suggestions"]
                }
              },
              formattingTips: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["score", "matchingKeywords", "missingKeywords", "sectionEvaluations", "formattingTips"]
          }
        }
      });

      const parsedJSON = JSON.parse(response.text);
      res.json(parsedJSON);
    } catch (err: any) {
      console.error("Gemini ATS analysis error:", err);
      res.status(500).json({ error: "Une erreur est survenue lors de l'analyse ATS de votre CV : " + (err.message || err) });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
