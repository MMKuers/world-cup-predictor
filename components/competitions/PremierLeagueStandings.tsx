"use client"

import { useEffect, useState } from "react"

type StandingRow = {
  position?: number
  rank?: number
  playedGames: number
  won: number
  draw: number
  lost: number
  points: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  team: {
    name: string
    crest?: string
  }
}

function formatGoalDifference(value: number) {
  return value > 0
    ? `+${value}`
    : String(value)
}

function getDisplayPosition(index: number) {
  return index + 1
}

function positionAccent(position: number) {
  if (position <= 5) {
    return "border-l-[#60a5fa]"
  }

  if (position >= 18) {
    return "border-l-[#e11d48]"
  }

  return "border-l-transparent"
}

function getStoredFollowedTeams() {
  if (typeof window === "undefined") {
    return []
  }

  const value = localStorage.getItem(
    "followed-team-PL"
  )

  if (!value) {
    return []
  }

  try {
    const teams = JSON.parse(value)
    return Array.isArray(teams)
      ? teams.filter(
          (team) =>
            typeof team === "string" &&
            team.trim()
        )
      : []
  } catch {
    return [value]
  }
}

export default function PremierLeagueStandings() {
  const [rows, setRows] =
    useState<StandingRow[]>([])
  const [isLoading, setIsLoading] =
    useState(true)
  const [message, setMessage] =
    useState("")
  const [followedTeams, setFollowedTeams] =
    useState<string[]>([])

  useEffect(() => {
    setFollowedTeams(
      getStoredFollowedTeams()
    )

    function handleFollowChange(event: Event) {
      const customEvent =
        event as CustomEvent<{
          competitionCode: string
          teams?: string[]
          team?: string
        }>

      if (
        customEvent.detail?.competitionCode !==
        "PL"
      ) {
        return
      }

      setFollowedTeams(
        customEvent.detail.teams ||
          (customEvent.detail.team
            ? [customEvent.detail.team]
            : [])
      )
    }

    window.addEventListener(
      "followed-team-change",
      handleFollowChange
    )

    return () => {
      window.removeEventListener(
        "followed-team-change",
        handleFollowChange
      )
    }
  }, [])

  useEffect(() => {

    async function loadStandings() {
      setIsLoading(true)
      setMessage("")

      try {
        const response =
          await fetch(
            "/api/football/standings?competition=PL",
            { cache: "no-store" }
          )

        const data =
          await response.json()

        const totalStanding =
          data.standings?.find(
            (standing: any) =>
              standing.type === "TOTAL"
          ) || data.standings?.[0]

        const table =
          Array.isArray(totalStanding?.table)
            ? totalStanding.table
            : []

        setRows(table)

        if (table.length === 0) {
          setMessage(
            data.message ||
            data.error ||
            "No Premier League standings returned."
          )
        }
      } catch (error) {
        console.error(error)
        setRows([])
        setMessage(
          "Could not load Premier League standings."
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadStandings()

  }, [])

  if (isLoading) {
    return (
      <div className="rounded-xl bg-white/95 p-4 text-sm font-bold text-[#6f7f9d] shadow-sm ring-1 ring-[#dbe5f6]">
        Loading Premier League standings...
      </div>
    )
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-xl bg-white/95 p-4 shadow-sm ring-1 ring-[#dbe5f6]">
        <div className="text-sm font-black text-[#102348]">
          No standings showing
        </div>

        <div className="mt-1 text-xs font-semibold text-[#6f7f9d]">
          {message ||
            "Premier League standings are not available right now."}
        </div>
      </div>
    )
  }

  return (
    <section>
      <div className="mb-2 flex items-end justify-between border-b border-[#dbe5f6] pb-2">
        <h2 className="text-sm font-black uppercase text-[#102348]">
          Premier League Standings
        </h2>

        <span className="text-[10px] font-black uppercase text-[#71809a]">
          Table
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#dbe5f6] bg-white/95 shadow-[0_8px_22px_rgba(16,35,72,0.08)]">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-[#09162f]">
            <tr className="text-[10px] uppercase text-[#b8c6df]">
              <th className="w-10 px-3 py-2.5 text-left font-black">
                #
              </th>
              <th className="px-2 py-2.5 text-left font-black">
                Club
              </th>
              <th className="px-1 py-2.5 text-center font-black">
                P
              </th>
              <th className="hidden px-2 py-2.5 text-center font-black sm:table-cell">
                W
              </th>
              <th className="hidden px-2 py-2.5 text-center font-black sm:table-cell">
                D
              </th>
              <th className="hidden px-2 py-2.5 text-center font-black sm:table-cell">
                L
              </th>
              <th className="px-1 py-2.5 text-center font-black">
                GD
              </th>
              <th className="px-3 py-2.5 text-right font-black">
                Pts
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => {
              const displayPosition =
                getDisplayPosition(index)
              const isFollowed =
                followedTeams.includes(
                  row.team.name
                )

              return (
                <tr
                  key={row.team.name}
                  className={`border-l-4 border-b border-[#edf3ff] last:border-b-0 ${positionAccent(displayPosition)} ${
                    isFollowed
                      ? "bg-[#fff8e8]"
                      : "bg-white"
                  }`}
                >
                  <td className="px-3 py-2.5 text-xs font-black text-[#71809a]">
                    {displayPosition}
                  </td>

                  <td className="min-w-0 px-2 py-2.5">
                    <div className="flex min-w-0 items-center gap-2">
                      {row.team.crest && (
                        <img
                          src={row.team.crest}
                          alt=""
                          className="h-6 w-6 flex-shrink-0 object-contain"
                        />
                      )}

                      <span className="truncate font-black text-[#102348]">
                        {row.team.name}
                      </span>

                      {isFollowed && (
                        <span className="flex-shrink-0 text-xs text-[#f59e0b]">
                          ★
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-1 py-2.5 text-center font-bold text-[#102348]">
                    {row.playedGames}
                  </td>
                  <td className="hidden px-2 py-2.5 text-center font-bold text-[#6f7f9d] sm:table-cell">
                    {row.won}
                  </td>
                  <td className="hidden px-2 py-2.5 text-center font-bold text-[#6f7f9d] sm:table-cell">
                    {row.draw}
                  </td>
                  <td className="hidden px-2 py-2.5 text-center font-bold text-[#6f7f9d] sm:table-cell">
                    {row.lost}
                  </td>
                  <td className="px-1 py-2.5 text-center font-bold text-[#102348]">
                    {formatGoalDifference(row.goalDifference)}
                  </td>
                  <td className="px-3 py-2.5 text-right text-base font-black text-[#102348]">
                    {row.points}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <div className="border-t border-[#edf3ff] bg-[#f8fbff] px-4 py-3">
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-bold text-[#6f7f9d]">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#60a5fa]" />
              <span>Top 5: Champions League</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#e11d48]" />
              <span>Bottom 3: Relegation</span>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-bold text-[#9aa8c0]">
            <span>P: Played</span>
            <span>GD: Goal Difference</span>
            <span>Pts: Points</span>
          </div>
        </div>
      </div>
    </section>
  )
}
