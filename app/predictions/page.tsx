"use client"

import { useEffect, useState } from "react"
import BottomNav from "@/components/BottomNav"
import { supabase } from "@/lib/supabase"

export default function PredictionsPage() {

  const [dbPredictions, setDbPredictions] =
  useState<any[]>([])
  const [matches, setMatches] =
  useState<any[]>([])
const [username, setUsername] =
  useState("")



if (matches.length > 0) {
  

}
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
      console.log("FIRST DB PREDICTION:", data?.[0])
const matchResponse =
  await fetch("/api/football")

const matchData =
  await matchResponse.json()

setMatches(matchData.matches)
setUsername(
  localStorage.getItem("wc-user") || ""
)

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

  matches.forEach((match) => {

  

 const matchKey =
  `${match.homeTeam.name}-${match.awayTeam.name}`

const predictionRow =
  dbPredictions.find(
    (p) =>
      p.match_key === matchKey &&
      p.username === username
  )



const prediction =
  predictionRow?.prediction || null

  if (prediction) {

        totalPredictions++

        const kickoffDate =
  new Date(match.utcDate)

        const isLocked =
          new Date() > kickoffDate

        if (isLocked) {
          lockedPredictions++
        } else {
          upcomingPredictions++
        }
const earnedPoints =
  match.status === "FINISHED"
    ? (
        (match.score.winner === "HOME_TEAM" &&
          prediction === match.homeTeam.name) ||
        (match.score.winner === "AWAY_TEAM" &&
          prediction === match.awayTeam.name) ||
        (match.score.winner === "DRAW" &&
          prediction === "Draw")
      )
      ? 3
      : 0
    : 0

totalPoints += earnedPoints
        predictedMatches.push({
  id: match.id,
  home: match.homeTeam.name,
  away: match.awayTeam.name,
  prediction,
  kickoff: match.utcDate,
          locked: isLocked,

     status:
  match.status !== "FINISHED"
    ? "Pending"
    : match.score.winner === null
    ? "Pending"
    : (
        (match.score.winner === "HOME_TEAM" &&
          prediction === match.homeTeam.name) ||
        (match.score.winner === "AWAY_TEAM" &&
          prediction === match.awayTeam.name) ||
        (match.score.winner === "DRAW" &&
          prediction === "Draw")
      )
    ? "Correct"
    : "Incorrect",

points:
  match.score.winner === null
    ? 0
    : (
        (match.score.winner === "HOME_TEAM" &&
          prediction === match.homeTeam.name) ||
        (match.score.winner === "AWAY_TEAM" &&
          prediction === match.awayTeam.name) ||
        (match.score.winner === "DRAW" &&
          prediction === "Draw")
      )
    ? 3
    : 0,
        })

      }

    }
  )
const leaderboardMap: Record<string, number> = {}

dbPredictions.forEach((prediction) => {

  if (!leaderboardMap[prediction.username]) {
    leaderboardMap[prediction.username] = 0
  }

  const match = matches.find(
    (m) =>
      `${m.homeTeam.name}-${m.awayTeam.name}` ===
      prediction.match_key
  )

  if (!match) return

  if (match.score?.winner === null) return

  const correct =
    (match.score.winner === "HOME_TEAM" &&
      prediction.prediction === match.homeTeam.name) ||

    (match.score.winner === "AWAY_TEAM" &&
      prediction.prediction === match.awayTeam.name) ||

    (match.score.winner === "DRAW" &&
      prediction.prediction === "Draw")

  if (correct) {
    leaderboardMap[prediction.username] += 3
  }
})

const leaderboard = Object.entries(
  leaderboardMap
)
  .map(([name, points]) => ({
    name,
    points,
  }))
  .sort(
    (a: any, b: any) => b.points - a.points
  )
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

  {username ? (

  <p className="mt-2 text-[#6f7f9d]">

    {username}'s tournament predictions

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