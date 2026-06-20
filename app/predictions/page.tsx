"use client"

import { useEffect, useState } from "react"
import BottomNav from "@/components/BottomNav"
import { supabase } from "@/lib/supabase"
import {
  buildLeaderboard,
  buildUsersById,
  getCurrentPlayerKey,
  getPlayerKeyFromName,
} from "@/lib/predictionScoring"

export default function PredictionsPage() {

  const [dbPredictions, setDbPredictions] =
  useState<any[]>([])
  const [dbUsers, setDbUsers] =
  useState<any[]>([])
  const [matches, setMatches] =
  useState<any[]>([])
const [username, setUsername] =
  useState("")

const [userId, setUserId] =
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

      const { data: users } =
        await supabase
          .from("users")
          .select("*")
          

      console.log("SUPABASE DATA:", data)
      console.log("SUPABASE ERROR:", error)
console.log(
  "LOCAL USER ID:",
  localStorage.getItem("user-id")
)
      setDbPredictions(data || [])
      setDbUsers(users || [])
      console.log("FIRST DB PREDICTION:", data?.[0])
const matchResponse =
  await fetch("/api/football")

const matchData =
  await matchResponse.json()

setMatches(matchData.matches)
console.log(
  "API MATCH KEYS:",
  matchData.matches.map(
    (m: any) =>
      `${m.homeTeam.name}-${m.awayTeam.name}`
  )
)
setUsername(
  localStorage.getItem("wc-user") || ""
)

setUserId(
  localStorage.getItem("user-id") || ""
)
console.log(
  "USER ID:",
  localStorage.getItem("user-id")
)
console.log(
  "FIRST PREDICTION USER ID:",
  data?.[0]?.user_id
)
    }

    loadPredictions()

  }, [])


  let totalPredictions = 0
  let lockedPredictions = 0
  let upcomingPredictions = 0

  const usersById =
    buildUsersById(dbUsers)

  const playerKey =
    getCurrentPlayerKey(
      userId,
      username,
      usersById
    )

const leaderboard =
  buildLeaderboard(
    dbPredictions,
    matches,
    usersById,
    userId,
    username
  )

  const currentPlayer =
    leaderboard.find(
      (player) =>
        player.you ||
        player.id === playerKey
    )

  const totalPoints =
    currentPlayer?.points || 0

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

  function predictionBelongsToCurrentPlayer(
    prediction: any
  ) {
    if (prediction.user_id === userId) {
      return true
    }

    const displayName =
      usersById[prediction.user_id || ""] ||
      prediction.username ||
      ""

    if (!displayName || !playerKey) {
      return false
    }

    return getPlayerKeyFromName(displayName) === playerKey
  }

  matches.forEach((match) => {

  

 const matchKey =
  `${match.homeTeam.name}-${match.awayTeam.name}`

  const predictionRow =
  dbPredictions.find(
    (p) =>
      p.match_key === matchKey &&
      predictionBelongsToCurrentPlayer(p)
  )

console.log("CURRENT USER ID:", userId)

console.log(
  "MATCHING PREDICTIONS:",
  dbPredictions.filter(
    p => predictionBelongsToCurrentPlayer(p)
  ).length
)

console.log("CURRENT USER ID:", userId)

console.log(
  "MATCHING PREDICTIONS:",
  dbPredictions.filter(
    p => predictionBelongsToCurrentPlayer(p)
  ).length
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
  return (
    <main className="min-h-screen bg-[#f3f7ff] p-4 pb-20">

      <div className="mb-5">

  <h1 className="text-2xl font-bold text-[#102348]">
    MK's World Cup App
  </h1>
 

  {username ? (

  <p className="mt-1 truncate text-sm text-[#6f7f9d]">

    {username}'s tournament predictions

  </p>

) : (

    <p className="mt-1 text-sm text-[#6f7f9d]">
      Track your World Cup predictions
    </p>

  )}

</div>

      <div className="mb-4 rounded-2xl bg-[#102348] p-4 text-white shadow-sm">

  <div className="text-xs font-semibold uppercase text-white/70">
    Fantasy Score
  </div>

  <div className="mt-1 text-3xl font-bold">
    {totalPoints} pts
  </div>

</div>

<div className="mt-5">

  <div className="grid grid-cols-3 gap-3">

    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#dbe5f6]">

      <div className="text-xs font-semibold uppercase text-[#6f7f9d]">
        Picks
      </div>

      <div className="mt-1 text-2xl font-bold text-[#102348]">
        {totalPredictions}
      </div>

    </div>

    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#dbe5f6]">

      <div className="text-xs font-semibold uppercase text-[#6f7f9d]">
        Locked
      </div>

      <div className="mt-1 text-2xl font-bold text-[#102348]">
        {lockedPredictions}
      </div>

    </div>

    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#dbe5f6]">

      <div className="text-xs font-semibold uppercase text-[#6f7f9d]">
        Open
      </div>

      <div className="mt-1 text-2xl font-bold text-[#102348]">
        {upcomingPredictions}
      </div>

    </div>

  </div>

  <div className="mt-6">

    <h2 className="mb-3 text-xl font-bold text-[#102348]">
      Leaderboard
    </h2>

    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#dbe5f6]">

      <div className="grid grid-cols-3 border-b border-[#edf3ff] px-4 py-3 text-[11px] font-semibold uppercase text-[#6f7f9d]">

        <div>Rank</div>

        <div>Player</div>

        <div className="text-right">
          Points
        </div>

      </div>

      {leaderboard.map((player) => (

        <div
          key={player.id}
          className={`grid grid-cols-3 items-center border-b border-[#edf3ff] px-4 py-3 last:border-b-0 ${
            player.you
              ? "bg-[#edf3ff]"
              : "bg-white"
          }`}
        >

          <div
            className={`text-sm font-bold ${
              player.you
                ? "text-[#102348]"
                : "text-[#6f7f9d]"
            }`}
          >
            #{player.rank}
          </div>

          <div>

            <div className="truncate text-sm font-semibold text-[#102348]">
              {player.name}
            </div>

            {player.you && (
              <div className="text-[11px] text-[#4564a8]">
                You
              </div>
            )}

          </div>

          <div className="text-right text-base font-bold text-[#102348]">
            {player.points}
          </div>

        </div>

      ))}

      <button
        className="w-full border-t border-[#edf3ff] bg-white px-4 py-3 text-xs font-semibold text-[#102348] transition hover:bg-[#f8fbff]"
      >
        Show Full Leaderboard
      </button>

    </div>

  </div>

  <div className="mt-6">

    <h2 className="mb-3 text-xl font-bold text-[#102348]">
      Your Picks
    </h2>

    <div className="space-y-3">

      {predictedMatches.map(
        (match) => (

          <div
            key={match.id}
            className={`rounded-2xl p-4 shadow-sm ring-1 ring-[#dbe5f6] ${
              match.status === "Correct"
                ? "bg-green-50"
                : match.status === "Incorrect"
                ? "bg-red-50"
                : "bg-white"
            }`}
          >

            <div className="flex items-center justify-between gap-3">

              <div className="min-w-0">

                <div className="truncate text-base font-semibold text-[#102348]">
                  {match.home} vs {match.away}
                </div>

                <div className="text-xs text-[#6f7f9d]">
                  {new Date(match.kickoff).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </div>

                <div className="mt-1 text-xs text-[#6f7f9d]">
                  Pick:
                  <span className="ml-1 font-semibold text-[#102348]">
                    {match.prediction}
                  </span>
                </div>

                <div className="mt-1 text-xs font-semibold text-[#102348]">
                  {match.points} pts
                </div>

              </div>

              <div
                className={`flex-shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
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
