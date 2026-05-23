"use client"

import MatchCard from "@/components/MatchCard"
import BottomNav from "@/components/BottomNav"
import { groupStageMatches } from "@/data/matches"

export default function HomePage() {

  let totalPoints = 0

  groupStageMatches.forEach(
    (match) => {

      const prediction =
        localStorage.getItem(
          `${match.home}-${match.away}`
        )

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

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#102348]">
          World Cup Predictor
        </h1>

        <p className="mt-2 text-[#6f7f9d]">
          FIFA World Cup 2026
        </p>
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
<div className="mb-6 rounded-3xl bg-[#102348] px-6 py-5 text-white shadow-sm">

  <div className="text-sm text-white/70">
    Your Fantasy Score
  </div>

  <div className="mt-1 text-4xl font-bold">
    {totalPoints} pts
  </div>

</div>
                <div className="space-y-4">

                  {matches.map((match) => (
                    <MatchCard
                      key={match.id}
                      home={match.home}
                      away={match.away}
                      group={match.group}
                      stadium={match.stadium}
                      status="Scheduled"
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