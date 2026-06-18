"use client"

import { supabase } from "@/lib/supabase"
import { syncAuthUser } from "@/lib/authUser"
import { startGoogleSignIn } from "@/lib/googleSignIn"
import { useEffect, useState } from "react"

type AuthUser = {
  id: string
  username: string
  email: string
}

export default function AuthButton() {
  const [authUser, setAuthUser] =
    useState<AuthUser | null>(null)
  const [isSigningIn, setIsSigningIn] =
    useState(false)
  const [signInError, setSignInError] =
    useState("")

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
    setIsSigningIn(true)
    setSignInError("")

    try {
      await startGoogleSignIn()
    } catch (error) {
      console.error(error)
      setIsSigningIn(false)
      setSignInError(
        "Google sign-in could not open. Refresh and try again."
      )
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem("wc-user")
    localStorage.removeItem("user-id")
    localStorage.removeItem("wc-google-user")
    localStorage.removeItem("wc-nickname-linked")
    localStorage.removeItem("wc-nickname-confirmed")
    setAuthUser(null)
  }

  if (!authUser) {
    return (
      <div className="flex flex-col items-end gap-1">
        <button
          onClick={signIn}
          disabled={isSigningIn}
          className="rounded-full bg-white px-3 py-2 text-xs font-bold text-[#102348] shadow-sm ring-1 ring-[#dbe5f6] disabled:opacity-60"
        >
          {isSigningIn
            ? "Opening..."
            : "Sign in"}
        </button>

        {signInError && (
          <div className="max-w-[160px] text-right text-[10px] font-semibold text-red-600">
            {signInError}
          </div>
        )}
      </div>
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
