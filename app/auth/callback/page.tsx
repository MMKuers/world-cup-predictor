"use client"

import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"

export default function AuthCallbackPage() {
  const [message, setMessage] =
    useState("Finishing sign in...")

  useEffect(() => {
    async function finishSignIn() {
      const params = new URLSearchParams(
        window.location.search
      )

      const hashParams = new URLSearchParams(
        window.location.hash.replace("#", "")
      )

      const code = params.get("code")
      const accessToken =
        hashParams.get("access_token")
      const refreshToken =
        hashParams.get("refresh_token")

      if (code) {
        const { error } =
          await supabase.auth.exchangeCodeForSession(code)

        if (error) {
          console.error(error)
          setMessage(
            "Google sign-in could not finish. Please try signing in again."
          )
          return
        }
      } else if (accessToken && refreshToken) {
        const { error } =
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

        if (error) {
          console.error(error)
          setMessage(
            "Google sign-in could not finish. Please try signing in again."
          )
          return
        }
      } else {
        const { data } =
          await supabase.auth.getSession()

        if (!data.session) {
          setMessage(
            "Google sign-in could not finish. Please try signing in again."
          )
          return
        }
      }

      window.location.replace("/")
    }

    finishSignIn()
  }, [])

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f7ff] px-6">
      <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-[#dbe5f6]">
        <div className="text-lg font-bold text-[#102348]">
          {message}
        </div>
      </div>
    </main>
  )
}
