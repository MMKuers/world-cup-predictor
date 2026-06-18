"use client"

import { supabase } from "@/lib/supabase"
import {
  linkNicknameToAuthUser,
  syncAuthUser,
} from "@/lib/authUser"
import { useEffect, useState } from "react"

type AuthUser = {
  id: string
  username: string
  email: string
}

export default function UsernameModal() {

  const [name, setName] = useState("")
  const [showModal, setShowModal] =
    useState(false)
  const [authUser, setAuthUser] =
    useState<AuthUser | null>(null)
  const [isSigningIn, setIsSigningIn] =
    useState(false)

  function shouldConfirmNickname(
    user: AuthUser | null
  ) {
    return (
      user &&
      localStorage.getItem("wc-nickname-confirmed") !== user.id
    )
  }

  useEffect(() => {

  async function checkIdentity() {
    const user = await syncAuthUser()

    setAuthUser(user)

    const existingName =
  localStorage.getItem("wc-user")

const existingUserId =
  localStorage.getItem("user-id")

if (user) {
  setName(existingName || user.username)
  setShowModal(!!shouldConfirmNickname(user))
  return
}

if (
  !existingName ||
  !existingUserId
) {
  setShowModal(true)
}
  }

  checkIdentity()

  const { data } =
    supabase.auth.onAuthStateChange(
      async () => {
        const user = await syncAuthUser()
        setAuthUser(user)

        if (user) {
          setName(
            localStorage.getItem("wc-user") ||
            user.username
          )
          setShowModal(!!shouldConfirmNickname(user))
        }
      }
    )

  return () => {
    data.subscription.unsubscribe()
  }

}, [])

  const signInWithGoogle = async () => {
    setIsSigningIn(true)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    })

    if (error) {
      console.error(error)
      setIsSigningIn(false)
    }
  }

  const saveName = async () => {

  if (!name.trim()) return

  if (authUser) {
    const linkedUser =
      await linkNicknameToAuthUser(
        name.trim()
      )

    if (!linkedUser) {
      return
    }

    setAuthUser(linkedUser)
    setShowModal(false)
    window.location.reload()
    return
  }

  const { data: existingUsers } =
    await supabase
      .from("users")
      .select("*")
      .eq("username", name.trim())
      .limit(1)

  const existingUser =
    existingUsers?.[0]

  if (existingUser) {

    localStorage.setItem(
      "wc-user",
      existingUser.username
    )

    localStorage.setItem(
      "user-id",
      existingUser.id
    )

  } else {

    const { data: newUser, error } =
      await supabase
        .from("users")
        .insert({
          username: name.trim(),
        })
        .select()
        .single()

    if (error) {
      console.error(error)
      return
    }

    localStorage.setItem(
      "wc-user",
      newUser.username
    )

    localStorage.setItem(
      "user-id",
      newUser.id
    )

  }

  setShowModal(false)

}

  if (!showModal) {
    return null
  }

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">

      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-[#dbe5f6]">

        <h2 className="text-2xl font-bold text-[#102348]">
          {authUser
            ? "Choose your app nickname"
            : "Welcome"}
        </h2>

        <p className="mt-2 text-sm text-[#6f7f9d]">
          {authUser
            ? "Use the nickname already on the leaderboard so your existing picks connect to this Google login."
            : "Sign in with Google or enter your name to start making World Cup predictions."}
        </p>

        {!authUser && (
          <>
            <button
              onClick={signInWithGoogle}
              disabled={isSigningIn}
              className="mt-5 w-full rounded-2xl bg-[#102348] py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSigningIn
                ? "Opening Google..."
                : "Continue with Google"}
            </button>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#edf3ff]" />
              <div className="text-xs font-semibold uppercase text-[#7b8baa]">
                or
              </div>
              <div className="h-px flex-1 bg-[#edf3ff]" />
            </div>
          </>
        )}

        <input
  value={name}
  onChange={(e) =>
    setName(e.target.value)
  }
  placeholder="Your nickname"
  className="w-full rounded-2xl border border-[#dbe5f6] px-4 py-3 text-base text-black placeholder:text-gray-400 outline-none"
/>

        <button
          onClick={saveName}
          className="mt-3 w-full rounded-2xl bg-[#edf3ff] py-3 text-sm font-bold text-[#102348] transition hover:bg-[#dbe5f6]"
        >
          {authUser
            ? "Link nickname"
            : "Continue without Google"}
        </button>

      </div>

    </div>

  )
}
