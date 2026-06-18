"use client"

import { supabase } from "@/lib/supabase"
import { syncAuthUser } from "@/lib/authUser"
import { useEffect, useState } from "react"

type AuthUser = {
  id: string
  username: string
  email: string
}

export default function AuthButton() {
  const [authUser, setAuthUser] =
    useState<AuthUser | null>(null)

  useEffect(() => {
    async function loadUser() {
      const user = await syncAuthUser()
      setAuthUser(user)
    }

    loadUser()

    const { data } =
      supabase.auth.onAuthStateChange(
        async () => {
          const user = await syncAuthUser()
          setAuthUser(user)
        }
      )

    return () => {
      data.subscription.unsubscribe()
    }
  }, [])

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem("wc-user")
    localStorage.removeItem("user-id")
    localStorage.removeItem("wc-nickname-linked")
    localStorage.removeItem("wc-nickname-confirmed")
    setAuthUser(null)
  }

  if (!authUser) {
    return (
      <button
        onClick={signIn}
        className="rounded-full bg-white px-3 py-2 text-xs font-bold text-[#102348] shadow-sm ring-1 ring-[#dbe5f6]"
      >
        Sign in
      </button>
    )
  }

  return (
    <button
      onClick={signOut}
      className="max-w-[150px] truncate rounded-full bg-white px-3 py-2 text-xs font-bold text-[#102348] shadow-sm ring-1 ring-[#dbe5f6]"
      title="Sign out"
    >
      {authUser.username}
    </button>
  )
}
