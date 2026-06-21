"use client"

import CompetitionMatchView from "@/components/competitions/CompetitionMatchView"

export default function PremierLeagueView() {
  return (
    <CompetitionMatchView
      competitionCode="PL"
      competitionLabel="Premier League"
      allowPredictions={false}
    />
  )
}
