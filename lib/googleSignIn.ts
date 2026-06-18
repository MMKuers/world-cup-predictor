import { supabase } from "@/lib/supabase"

export async function startGoogleSignIn() {
  const { error } =
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          prompt: "select_account",
        },
      },
    })

  if (error) {
    throw error
  }
}
