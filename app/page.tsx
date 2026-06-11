"use client"

import MatchCard from "@/components/MatchCard"
import BottomNav from "@/components/BottomNav"

import UsernameModal from "@/components/UsernameModal"
import { calculateStandings } from "@/lib/calculateStandings"
import { useState, useEffect } from "react"

export default function HomePage() {
 const [username, setUsername] =
  useState("")

const [totalPoints, setTotalPoints] =
  useState(0)
const [matches, setMatches] = useState<any[]>([])
useEffect(() => {
  setUsername(
    localStorage.getItem("wc-user") || ""
  )
}, [])
useEffect(() => {

  async function loadMatches() {

    const response =
      await fetch("/api/football")

    const data =
      await response.json()

    console.log("API STATUS:", data.matches[0]?.status)
console.log("API SCORE:", data.matches[0]?.score)

setMatches(data.matches)
  }

  loadMatches()

}, [])

useEffect(() => {

  let points = 0

 matches.forEach((match) => {

  const prediction =
    localStorage.getItem(
      `${match.homeTeam?.name}-${match.awayTeam?.name}`
    )

  if (!prediction) return

  const correct =
    (match.score?.winner === "HOME_TEAM" &&
      prediction === match.homeTeam?.name) ||

    (match.score?.winner === "AWAY_TEAM" &&
      prediction === match.awayTeam?.name) ||

    (match.score?.winner === "DRAW" &&
      prediction === "Draw")

  if (correct) {
    points += 3
  }

})

  setTotalPoints(points)

}, [matches])


  const groupedMatches: Record<string, any[]> =
  matches.reduce((acc, match) => {

    const date =
  new Date(match.utcDate)
    .toLocaleDateString("en-CA", {
      timeZone: "America/Chicago",
    })

    if (!acc[date]) {
      acc[date] = []
    }

    acc[date].push(match)

    return acc

  }, {} as Record<string, any[]>)
if (matches.length > 0) {
  console.log(
    "STATUS:",
    matches[0].status
  )

  console.log(
    "SCORE:",
    matches[0].score
  )
}
  return (
    <main className="min-h-screen bg-[#f3f7ff] p-6 pb-24">
<UsernameModal />
      <div className="mb-8">

  <h1 className="text-4xl font-bold text-[#102348]">
    MK's World Cup App
  </h1>

  
  {username ? (

  <p className="mt-2 text-[#6f7f9d]">
    {username}'s predictions and match picks
  </p>

) : (

  <p className="mt-2 text-[#6f7f9d]">
    Make your predictions for every match
  </p>

)}

</div>
      <div className="sticky top-4 z-40 mb-6 flex justify-end">

  <div className="rounded-full bg-[#102348] px-5 py-3 text-sm font-bold text-white shadow-lg">
    {totalPoints} pts
  </div>

</div>

      <div className="space-y-10">

        {Object.entries(groupedMatches).map(
  ([date, matches]) => {

           /* const formattedDate =
              new Date(date).toLocaleDateString(
                "en-US",
                {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                }
              )*/
             const formattedDate =
  new Date(date + "T12:00:00")
    .toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        month: "long",
        day: "numeric",
      }
    )

            return (
              <div key={date}>

                <div className="mb-4">
                  <h2 className="text-xl font-bold text-[#102348]">
                    {formattedDate}
                  </h2>
                </div>

                <div className="space-y-4">

                  {matches.map((match) => (
                    <MatchCard
  key={match.id}
  home={match.homeTeam?.name || ""}
  away={match.awayTeam?.name || ""}
  group={match.group}
  stadium={match.stadium}

  status={
    match.status === "FINISHED"
      ? "FINAL"
      : new Date() >
        new Date(match.utcDate)
      ? "LIVE"
      : "UPCOMING"
  }

 kickoff={match.utcDate}

  homeScore={null}
  awayScore={null}
/>
                  ))}

                </div>

              </div>
            )
          }
        )}

      </div>

      <BottomNav />

    </main>
  )
}