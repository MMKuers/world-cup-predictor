"use client"

import CompetitionMatchView from "@/components/competitions/CompetitionMatchView"

export default function ChampionsLeagueView() {
  return (
    <CompetitionMatchView
      competitionCode="CL"
      competitionLabel="Champions League"
      allowPredictions={false}
    />
  )
}
