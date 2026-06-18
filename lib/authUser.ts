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

  if (matchingUser) {
    localStorage.setItem("wc-user", matchingUser.username)
    localStorage.setItem("user-id", matchingUser.id)
    localStorage.setItem("wc-google-user", authUser.id)
    localStorage.setItem("wc-nickname-linked", authUser.id)
    localStorage.removeItem("wc-nickname-confirmed")

    return {
      id: matchingUser.id,
      username: matchingUser.username,
      email: authUser.email || "",
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
  localStorage.setItem("wc-google-user", authUser.id)
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

  const linkedNickname =
    localStorage.getItem("wc-nickname-linked") === authUser.id

  const localUserId =
    localStorage.getItem("user-id") || ""

  const localUsername =
    localStorage.getItem("wc-user") || ""

  if (
    linkedNickname &&
    localUserId &&
    localUsername
  ) {
    return {
      id: localUserId,
      username: localUsername,
      email: authUser.email || "",
    }
  }

  const { data: existingAuthUser } =
    await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .maybeSingle()

  if (existingAuthUser) {
    localStorage.setItem("wc-user", existingAuthUser.username)
    localStorage.setItem("user-id", existingAuthUser.id)

    return {
      id: existingAuthUser.id,
      username: existingAuthUser.username,
      email: authUser.email || "",
    }
  }

  return {
    id: authUser.id,
    username: getDisplayName(authUser),
    email: authUser.email || "",
  }
}
