"use client"

import { useEffect, useState } from "react"
import {
  CalendarDays,
  Table2,
} from "lucide-react"
import BottomNav from "@/components/BottomNav"
import ChampionsLeagueView from "@/components/competitions/ChampionsLeagueView"
import CompetitionSwitcher from "@/components/CompetitionSwitcher"
import PremierLeagueView from "@/components/competitions/PremierLeagueView"
import UsernameModal from "@/components/UsernameModal"
import WorldCupView from "@/components/competitions/WorldCupView"
import {
  CompetitionCode,
  getCompetition,
} from "@/components/competitions/config"

export default function HomePage() {
  const [username, setUsername] =
    useState("")
  const [totalPoints, setTotalPoints] =
    useState(0)
  const [selectedCompetition, setSelectedCompetition] =
    useState<CompetitionCode>("WC")
  const [premierLeagueView, setPremierLeagueView] =
    useState<"matches" | "standings">("matches")

  const currentCompetition =
    getCompetition(selectedCompetition)

  const allowPredictions =
    selectedCompetition === "WC"

  useEffect(() => {
    setUsername(
      localStorage.getItem("wc-user") || ""
    )
  }, [])

  useEffect(() => {
    if (selectedCompetition !== "PL") {
      setPremierLeagueView("matches")
    }
  }, [selectedCompetition])

  const subtitle = username
    ? allowPredictions
      ? `${username}'s predictions and match picks`
      : selectedCompetition === "PL" && premierLeagueView === "standings"
      ? "Premier League standings"
      : `${currentCompetition.label} matches and updates`
    : allowPredictions
    ? "Make your predictions for every match"
    : selectedCompetition === "PL" && premierLeagueView === "standings"
    ? "Premier League standings"
    : `${currentCompetition.label} matches and updates`

  const premierLeagueNavItems = [
    {
      label: "Matches",
      Icon: CalendarDays,
      isActive: premierLeagueView === "matches",
      onClick: () =>
        setPremierLeagueView("matches"),
    },
    {
      label: "Standings",
      Icon: Table2,
      isActive: premierLeagueView === "standings",
      onClick: () =>
        setPremierLeagueView("standings"),
    },
  ]

  return (
    <main className="min-h-screen bg-[#f3f7ff] p-4 pb-20">
      <UsernameModal />

      <div className="sticky top-0 z-40 -mx-4 mb-4 bg-[#f3f7ff]/95 px-4 pt-3 pb-3 backdrop-blur">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-[#102348]">
              MK's World Cup App
            </h1>

            <p className="mt-1 truncate text-sm text-[#6f7f9d]">
              {subtitle}
            </p>
          </div>

          {allowPredictions && (
            <div className="mt-1 flex-shrink-0 rounded-full bg-[#102348] px-3 py-2 text-xs font-bold text-white shadow-sm">
              {totalPoints} pts
            </div>
          )}
        </div>

        <CompetitionSwitcher
          selectedCompetition={selectedCompetition}
          onSelectCompetition={setSelectedCompetition}
        />
      </div>

      {selectedCompetition === "WC" && (
        <WorldCupView
          onPointsChange={setTotalPoints}
        />
      )}

      {selectedCompetition === "PL" && (
        <PremierLeagueView
          view={premierLeagueView}
        />
      )}

      {selectedCompetition === "CL" && (
        <ChampionsLeagueView />
      )}

      <BottomNav
        hidePicks={!allowPredictions}
        items={
          selectedCompetition === "PL"
            ? premierLeagueNavItems
            : undefined
        }
      />
    </main>
  )
}
