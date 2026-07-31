import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Serve JSON parsing middleware
  app.use(express.json());

  // API Route for Supabase OAuth URL
  app.get('/api/auth/supabase/url', (req, res) => {
    const redirectUri = `${req.protocol}://${req.get('host')}/api/auth/supabase/callback`;
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
    const redirectUri = `${req.protocol}://${req.get('host')}/api/auth/supabase/callback`;

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
