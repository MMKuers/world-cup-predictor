import { supabase } from "@/lib/supabase"

export async function startGoogleSignIn() {
  const { data, error } =
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
        skipBrowserRedirect: true,
        queryParams: {
          prompt: "select_account",
        },
      },
    })

  if (error) {
    throw error
  }

  if (data.url) {
    window.location.assign(data.url)
    return
  }

  throw new Error("Google sign-in did not return a redirect URL.")
}
