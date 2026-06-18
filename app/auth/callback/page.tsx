"use client"

import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"

function wait(ms: number) {
  return new Promise((resolve) =>
    setTimeout(resolve, ms)
  )
}

export default function AuthCallbackPage() {
  const [message, setMessage] =
    useState("Finishing sign in...")
  const [canRetry, setCanRetry] =
    useState(false)

  useEffect(() => {
    async function finishSignIn() {
      try {
        const params = new URLSearchParams(
          window.location.search
        )

        const hashParams = new URLSearchParams(
          window.location.hash.replace("#", "")
        )

        const code = params.get("code")
        const errorDescription =
          params.get("error_description") ||
          hashParams.get("error_description")
        const accessToken =
          hashParams.get("access_token")
        const refreshToken =
          hashParams.get("refresh_token")

        if (errorDescription) {
          setMessage(errorDescription)
          setCanRetry(true)
          return
        }

        if (code) {
          const { error } =
            await supabase.auth.exchangeCodeForSession(code)

          if (error) {
            console.error(error)
            setMessage(
              "Google sign-in could not finish. Please try signing in again."
            )
            setCanRetry(true)
            return
          }
        }

        if (accessToken && refreshToken) {
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
            setCanRetry(true)
            return
          }
        }

        for (let attempt = 0; attempt < 10; attempt++) {
          const { data } =
            await supabase.auth.getSession()

          if (data.session) {
            window.location.replace("/")
            return
          }

          await wait(300)
        }

        setMessage(
          "Google sign-in reached the app, but the session was not saved. Please try again."
        )
        setCanRetry(true)
      } catch (error) {
        console.error(error)
        setMessage(
          "Google sign-in could not finish. Please try signing in again."
        )
        setCanRetry(true)
      }
    }

    finishSignIn()
  }, [])

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f7ff] px-6">
      <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-[#dbe5f6]">
        <div className="text-lg font-bold text-[#102348]">
          {message}
        </div>

        {canRetry && (
          <button
            onClick={() =>
              window.location.replace("/")
            }
            className="mt-4 rounded-full bg-[#102348] px-4 py-2 text-sm font-bold text-white"
          >
            Back to app
          </button>
        )}
      </div>
    </main>
  )
}
