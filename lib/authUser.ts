import { supabase } from "@/lib/supabase"

function getDisplayName(user: any) {
  return (
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.preferred_username ||
    user?.email?.split("@")[0] ||
    "World Cup Friend"
  )
}

export async function syncAuthUser() {
  const { data } =
    await supabase.auth.getUser()

  const authUser = data.user

  if (!authUser) {
    return null
  }

  const username = getDisplayName(authUser)

  const { data: existingUser } =
    await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .maybeSingle()

  if (!existingUser) {
    const { error } = await supabase
      .from("users")
      .insert({
        id: authUser.id,
        username,
      })

    if (error) {
      console.error(error)
    }
  } else if (
    existingUser.username !== username
  ) {
    const { error } = await supabase
      .from("users")
      .update({ username })
      .eq("id", authUser.id)

    if (error) {
      console.error(error)
    }
  }

  localStorage.setItem("wc-user", username)
  localStorage.setItem("user-id", authUser.id)

  return {
    id: authUser.id,
    username,
    email: authUser.email || "",
  }
}
