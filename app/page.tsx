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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dceaff_0,#f3f7ff_34%,#eef3fb_68%,#e9eef8_100%)] px-3 pb-20 text-[#102348]">
      <UsernameModal />

      <div className="sticky top-0 z-40 -mx-3 mb-4 bg-gradient-to-b from-[#09162f] via-[#102348] to-[#102348]/95 px-3 pt-3 pb-3 shadow-[0_16px_36px_rgba(8,22,47,0.22)] backdrop-blur">
        <div className="mx-auto max-w-xl">
          <div className="rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.13),rgba(255,255,255,0.03))] px-4 py-3 shadow-inner shadow-white/5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="mb-1 h-1 w-10 rounded-full bg-gradient-to-r from-[#e11d48] via-white to-[#60a5fa]" />

                <h1 className="text-[1.35rem] font-black leading-tight text-white">
                  MK's World Cup App
                </h1>

                <p className="mt-1 truncate text-xs font-semibold text-[#b8c6df]">
                  {subtitle}
                </p>
              </div>

              {allowPredictions && (
                <div className="mt-1 flex-shrink-0 rounded-xl bg-white px-3 py-2 text-right shadow-sm">
                  <div className="text-[10px] font-black uppercase leading-none text-[#71809a]">
                    Points
                  </div>
                  <div className="mt-0.5 text-base font-black leading-none text-[#102348]">
                    {totalPoints}
                  </div>
                </div>
              )}
            </div>

            <CompetitionSwitcher
              selectedCompetition={selectedCompetition}
              onSelectCompetition={setSelectedCompetition}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-xl">
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
      </div>

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
