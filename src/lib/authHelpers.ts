import { supabase } from "./supabase";

/**
 * Lance le flux d'authentification OAuth avec Supabase pour Google.
 * 
 * @param options Configuration optionnelle
 * @returns Une promesse avec l'URL de connexion ou une erreur
 */
export async function signInWithGoogle(options?: { usePopup?: boolean }) {
  const redirectTo = `${window.location.origin}/auth/callback`;

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        skipBrowserRedirect: options?.usePopup ?? true,
      },
    });

    if (error) {
      console.error("[AuthHelper] Erreur d'initialisation de la connexion Google :", error);
      throw error;
    }

    if (options?.usePopup !== false && data?.url) {
      const popup = window.open(
        data.url,
        "google_oauth_popup",
        "width=600,height=700,status=no,resizable=yes,scrollbars=yes"
      );

      if (!popup) {
        throw new Error(
          "Le pop-up de connexion Google a été bloqué par votre navigateur. Veuillez autoriser les pop-ups pour ce site."
        );
      }
      return { url: data.url, popup };
    }

    return { url: data?.url || null, popup: null };
  } catch (error) {
    console.error("[AuthHelper] Échec de l'authentification Google :", error);
    throw error;
  }
}
