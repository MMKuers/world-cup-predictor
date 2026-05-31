"use client"

import { useEffect, useState } from "react"
import BottomNav from "@/components/BottomNav"
import { groupStageMatches } from "@/data/matches"
import { supabase } from "@/lib/supabase"

export default function PredictionsPage() {

  const [dbPredictions, setDbPredictions] =
  useState<any[]>([])

  useEffect(() => {

    console.log("LOADING PREDICTIONS")

    async function loadPredictions() {

      const { data, error } =
        await supabase
          .from("predictions")
          .select("*")

      console.log("SUPABASE DATA:", data)
      console.log("SUPABASE ERROR:", error)

      setDbPredictions(data || [])

    }

    loadPredictions()

  }, [])


  let totalPredictions = 0
  let lockedPredictions = 0
  let upcomingPredictions = 0
  let totalPoints = 0

  const predictedMatches: {
    id: number
    home: string
    away: string
    prediction: string
    kickoff: string
    locked: boolean
    status: string
    points: number
  }[] = []

  groupStageMatches.forEach(
    (match) => {

      const prediction =
        typeof window !== "undefined"
          ? localStorage.getItem(
              `${match.home}-${match.away}`
            )
            
          : null

      if (prediction) {

        totalPredictions++

        const kickoffDate =
          new Date(match.kickoff)

        const isLocked =
          new Date() > kickoffDate

        if (isLocked) {
          lockedPredictions++
        } else {
          upcomingPredictions++
        }
totalPoints +=
  match.winner === null
    ? 0
    : prediction === match.winner
    ? 3
    : 0
        predictedMatches.push({
          id: match.id,
          home: match.home,
          away: match.away,
          prediction,
          kickoff: match.kickoff,
          locked: isLocked,

          status:
            match.winner === null
              ? "Pending"
              : prediction === match.winner
              ? "Correct"
              : "Incorrect",

          points:
            match.winner === null
              ? 0
              : prediction === match.winner
              ? 3
              : 0,
        })

      }

    }
  )
const leaderboard = Object.values(
  dbPredictions.reduce((acc: any, prediction: any) => {
    if (!acc[prediction.username]) {
      acc[prediction.username] = {
        name: prediction.username,
        points: 0,
      }
    }

    acc[prediction.username].points +=
      prediction.points || 0

    return acc
  }, {})
)
  .sort((a: any, b: any) => b.points - a.points)
  .map((player: any, index) => ({
    rank: index + 1,
    name: player.name,
    points: player.points,
    you:
      typeof window !== "undefined" &&
      player.name === localStorage.getItem("wc-user"),
  }))
  return (
    <main className="min-h-screen bg-[#f3f7ff] p-6 pb-24">

      <div className="mb-8">

  <h1 className="text-4xl font-bold text-[#102348]">
    MK's World Cup App
  </h1>

  {typeof window !== "undefined" &&
  localStorage.getItem("wc-user") ? (

    <p className="mt-2 text-[#6f7f9d]">

      {localStorage.getItem("wc-user")}'s tournament predictions

    </p>

  ) : (

    <p className="mt-2 text-[#6f7f9d]">
      Track your World Cup predictions
    </p>

  )}

</div>

      <div className="mb-6 rounded-[28px] bg-[#102348] p-6 text-white shadow-sm">

  <div className="text-sm text-white/70">
    Fantasy Score
  </div>

  <div className="mt-2 text-5xl font-bold">
    {totalPoints} pts
  </div>

</div>

<div className="mt-8">

  <div className="grid grid-cols-2 gap-4">

    <div className="rounded-[28px] bg-[#102348] p-5 text-white shadow-sm">

      <div className="text-sm text-white/70">
        Total Picks
      </div>

      <div className="mt-2 text-4xl font-bold">
        {totalPredictions}
      </div>

    </div>

    <div className="rounded-[28px] bg-[#dfe9ff] p-5 shadow-sm">

      <div className="text-sm text-[#6f7f9d]">
        Locked Picks
      </div>

      <div className="mt-2 text-4xl font-bold text-[#102348]">
        {lockedPredictions}
      </div>

    </div>

    <div className="col-span-2 rounded-[28px] bg-white p-5 shadow-sm">

      <div className="text-sm text-[#6f7f9d]">
        Upcoming Picks
      </div>

      <div className="mt-2 text-4xl font-bold text-[#102348]">
        {upcomingPredictions}
      </div>

    </div>

  </div>

  <div className="mt-8">

    <h2 className="mb-4 text-2xl font-bold text-[#102348]">
      Leaderboard
    </h2>

    <div className="overflow-hidden rounded-[28px] bg-white shadow-sm">

      <div className="grid grid-cols-3 border-b border-[#edf3ff] px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#6f7f9d]">

        <div>Rank</div>

        <div>Player</div>

        <div className="text-right">
          Points
        </div>

      </div>

      {leaderboard.map((player) => (

        <div
          key={player.rank}
          className={`grid grid-cols-3 items-center border-b border-[#edf3ff] px-5 py-4 last:border-b-0 ${
            player.you
              ? "bg-[#edf3ff]"
              : "bg-white"
          }`}
        >

          <div
            className={`font-bold ${
              player.you
                ? "text-[#102348]"
                : "text-[#6f7f9d]"
            }`}
          >
            #{player.rank}
          </div>

          <div>

            <div className="font-semibold text-[#102348]">
              {player.name}
            </div>

            {player.you && (
              <div className="text-xs text-[#4564a8]">
                You
              </div>
            )}

          </div>

          <div className="text-right text-lg font-bold text-[#102348]">
            {player.points}
          </div>

        </div>

      ))}

      <button
        className="w-full border-t border-[#edf3ff] bg-white px-5 py-4 text-sm font-semibold text-[#102348] transition hover:bg-[#f8fbff]"
      >
        Show Full Leaderboard
      </button>

    </div>

  </div>

  <div className="mt-8">

    <h2 className="mb-4 text-2xl font-bold text-[#102348]">
      Your Picks
    </h2>

    <div className="space-y-4">

      {predictedMatches.map(
        (match) => (

          <div
            key={match.id}
            className={`rounded-[28px] p-5 shadow-sm ${
              match.status === "Correct"
                ? "bg-green-50"
                : match.status === "Incorrect"
                ? "bg-red-50"
                : "bg-white"
            }`}
          >

            <div className="flex items-center justify-between">

              <div>

                <div className="text-lg font-semibold text-[#102348]">
                  {match.home} vs {match.away}
                </div>

                <div className="text-sm text-[#6f7f9d]">
                  {new Date(match.kickoff).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </div>

                <div className="mt-2 text-sm text-[#6f7f9d]">
                  Your pick:
                  <span className="ml-1 font-semibold text-[#102348]">
                    {match.prediction}
                  </span>
                </div>

                <div className="mt-2 text-sm font-semibold text-[#102348]">
                  {match.points} pts
                </div>

              </div>

              <div
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  match.status === "Correct"
                    ? "bg-green-100 text-green-600"
                    : match.status === "Incorrect"
                    ? "bg-red-100 text-red-600"
                    : match.locked
                    ? "bg-orange-100 text-orange-600"
                    : "bg-[#edf3ff] text-[#4564a8]"
                }`}
              >
                {match.status === "Pending"
                  ? match.locked
                    ? "Locked"
                    : "Upcoming"
                  : match.status}
              </div>

            </div>

          </div>

        )
      )}

    </div>

  </div>

</div>

<BottomNav />
    </main>
  )
}