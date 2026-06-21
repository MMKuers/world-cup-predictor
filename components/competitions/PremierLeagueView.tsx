"use client"

import CompetitionMatchView from "@/components/competitions/CompetitionMatchView"
import PremierLeagueStandings from "@/components/competitions/PremierLeagueStandings"

type Props = {
  view: "matches" | "standings"
}

export default function PremierLeagueView({
  view,
}: Props) {
  if (view === "standings") {
    return <PremierLeagueStandings />
  }

  return (
    <CompetitionMatchView
      competitionCode="PL"
      competitionLabel="Premier League"
      allowPredictions={false}
    />
  )
}
