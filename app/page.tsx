"use client"

import { useEffect, useState } from "react"
import MatchCard from "@/components/MatchCard"
import BottomNav from "@/components/BottomNav"

type Match = {
  id: number

  utcDate: string

  status: string

  score: {
    fullTime: {
      home: number | null
      away: number | null
    }
  }

  homeTeam: {
    name: string
  }

  awayTeam: {
    name: string
  }
}

export default function HomePage() {
  const [matches, setMatches] = useState<Match[]>([])

  useEffect(() => {
    async function fetchMatches() {
      const response = await fetch(
        "/api/football",
        
      )

      const data = await response.json()

      setMatches(data.matches.slice(0, 10))
    }

    fetchMatches()
  }, [])

  return (
    <main className="min-h-screen bg-black p-6 pb-24 text-white">
      <h1 className="mb-6 text-4xl font-bold">
        World Cup Predictor
      </h1>

      <div className="space-y-4">
        {matches.map((match) => (
         <MatchCard
  key={match.id}
  home={match.homeTeam.name}
  away={match.awayTeam.name}
  group="World Cup"
  status={match.status}
  kickoff={match.utcDate}
  homeScore={match.score.fullTime.home}
  awayScore={match.score.fullTime.away}
/>
        ))}
      </div>
      <BottomNav />
    </main>
  )
}