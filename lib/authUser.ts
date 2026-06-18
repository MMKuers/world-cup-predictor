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

async function getAuthUser() {
  const { data } =
    await supabase.auth.getUser()

  return data.user
}

async function saveAuthUserRow(
  authUser: any,
  username: string
) {
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
      return false
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
      return false
    }
  }

  return true
}

export async function linkNicknameToAuthUser(
  nickname: string
) {
  const authUser = await getAuthUser()

  if (!authUser) {
    return null
  }

  const username = nickname.trim()

  if (!username) {
    return null
  }

  const { data: matchingUsers } =
    await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .limit(1)

  const matchingUser =
    matchingUsers?.[0]

  if (
    matchingUser &&
    matchingUser.id !== authUser.id
  ) {
    const { error: predictionError } = await supabase
      .from("predictions")
      .update({ user_id: authUser.id })
      .eq("user_id", matchingUser.id)

    if (predictionError) {
      console.error(predictionError)
      return null
    }

    const { error: authUserDeleteError } = await supabase
      .from("users")
      .delete()
      .eq("id", authUser.id)

    if (authUserDeleteError) {
      console.error(authUserDeleteError)
    }

    const { error: matchingUserDeleteError } = await supabase
      .from("users")
      .delete()
      .eq("id", matchingUser.id)

    if (matchingUserDeleteError) {
      console.error(matchingUserDeleteError)
      return null
    }
  }

  const savedUser = await saveAuthUserRow(
    authUser,
    username
  )

  if (!savedUser) {
    return null
  }

  localStorage.setItem("wc-user", username)
  localStorage.setItem("user-id", authUser.id)
  localStorage.setItem("wc-nickname-linked", authUser.id)
  localStorage.removeItem("wc-nickname-confirmed")

  return {
    id: authUser.id,
    username,
    email: authUser.email || "",
  }
}

export async function syncAuthUser() {
  const authUser = await getAuthUser()

  if (!authUser) {
    return null
  }

  const { data: existingAuthUser } =
    await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .maybeSingle()

  const linkedNickname =
    localStorage.getItem("wc-nickname-linked") === authUser.id

  const username =
    existingAuthUser?.username ||
    localStorage.getItem("wc-user") ||
    getDisplayName(authUser)

  if (existingAuthUser || linkedNickname) {
    localStorage.setItem("wc-user", username)
    localStorage.setItem("user-id", authUser.id)
  }

  return {
    id: authUser.id,
    username,
    email: authUser.email || "",
  }
}
