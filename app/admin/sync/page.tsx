"use client"

import { supabase } from "@/lib/supabase"

export default function SyncPage() {

  async function syncPredictions() {

    const username =
      localStorage.getItem("wc-user")

    if (!username) {
      alert("No username found")
      return
    }

    let synced = 0

    for (const key of Object.keys(localStorage)) {

      const prediction =
        localStorage.getItem(key)

      if (!prediction) continue

      if (
        key === "wc-user" ||
        key.startsWith("sb-")
      ) {
        continue
      }

      const { error } =
        await supabase
          .from("predictions")
          .upsert(
            {
              username,
              match_key: key,
              prediction,
              points: 0,
            },
            {
              onConflict:
                "username,match_key",
            }
          )

      if (!error) {
        synced++
      }
    }

    alert(
      `Synced ${synced} predictions`
    )
  }

  return (
    <main className="min-h-screen bg-[#f3f7ff] p-8">

      <h1 className="mb-6 text-3xl font-bold">
        Prediction Recovery
      </h1>

      <button
        onClick={syncPredictions}
        className="rounded-xl bg-[#102348] px-6 py-4 font-semibold text-white"
      >
        Sync My Predictions
      </button>

    </main>
  )
}