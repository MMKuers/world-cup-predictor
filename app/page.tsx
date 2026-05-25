"use client"

import MatchCard from "@/components/MatchCard"
import BottomNav from "@/components/BottomNav"
import { groupStageMatches } from "@/data/matches"
import UsernameModal from "@/components/UsernameModal"
import { calculateStandings } from "@/lib/calculateStandings"


export default function HomePage() {

  let totalPoints = 0

  groupStageMatches.forEach(
    (match) => {

      const prediction =
  typeof window !== "undefined"
    ? localStorage.getItem(
        `${match.home}-${match.away}`
      )
    : null

      if (
        prediction &&
        prediction === match.winner
      ) {
        totalPoints += 3
      }

    }
  )

  const groupedMatches =
    groupStageMatches.reduce((acc, match) => {

      if (!acc[match.date]) {
        acc[match.date] = []
      }

      acc[match.date].push(match)

      return acc

    }, {} as Record<string, typeof groupStageMatches>)

  return (
    <main className="min-h-screen bg-[#f3f7ff] p-6 pb-24">
<UsernameModal />
      <div className="mb-8">

  <h1 className="text-4xl font-bold text-[#102348]">
    MK's World Cup App
  </h1>

  {typeof window !== "undefined" &&
  localStorage.getItem("wc-user") ? (

    <p className="mt-2 text-[#6f7f9d]">

      {localStorage.getItem("wc-user")}'s predictions and match picks

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

            const formattedDate =
              new Date(date).toLocaleDateString(
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
  home={match.home}
  away={match.away}
  group={match.group}
  stadium={match.stadium}

  status={
    match.winner
      ? "FINAL"
      : new Date() >
        new Date(match.kickoff)
      ? "LIVE"
      : "UPCOMING"
  }

  kickoff={match.kickoff}

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