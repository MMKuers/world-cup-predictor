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

function getDisplayPosition(
  row: StandingRow,
  index: number
) {
  return row.position || row.rank || index + 1
}

function positionAccent(position: number) {
  if (position <= 5) {
    return "border-l-[#93c5fd]"
  }

  if (position >= 18) {
    return "border-l-[#ef4444]"
  }

  return "border-l-transparent"
}

export default function PremierLeagueStandings() {
  const [rows, setRows] =
    useState<StandingRow[]>([])
  const [isLoading, setIsLoading] =
    useState(true)
  const [message, setMessage] =
    useState("")

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
      <div className="rounded-2xl bg-white p-4 text-sm font-semibold text-[#6f7f9d] shadow-sm ring-1 ring-[#dbe5f6]">
        Loading Premier League standings...
      </div>
    )
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#dbe5f6]">
        <div className="text-sm font-bold text-[#102348]">
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
      <h2 className="mb-3 text-lg font-bold text-[#102348]">
        Premier League Standings
      </h2>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#dbe5f6]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#edf3ff] text-[11px] uppercase text-[#6f7f9d]">
                <th className="w-10 px-3 py-3 text-left font-bold">
                  #
                </th>
                <th className="px-2 py-3 text-left font-bold">
                  Club
                </th>
                <th className="px-2 py-3 text-center font-bold">
                  P
                </th>
                <th className="hidden px-2 py-3 text-center font-bold sm:table-cell">
                  W
                </th>
                <th className="hidden px-2 py-3 text-center font-bold sm:table-cell">
                  D
                </th>
                <th className="hidden px-2 py-3 text-center font-bold sm:table-cell">
                  L
                </th>
                <th className="px-2 py-3 text-center font-bold">
                  GD
                </th>
                <th className="px-3 py-3 text-right font-bold">
                  Pts
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, index) => {
                const displayPosition =
                  getDisplayPosition(row, index)

                return (
                  <tr
                    key={row.team.name}
                    className={`border-l-4 border-b border-[#edf3ff] last:border-b-0 ${positionAccent(displayPosition)}`}
                  >
                    <td className="px-3 py-3 text-xs font-bold text-[#6f7f9d]">
                      {displayPosition}
                    </td>

                    <td className="px-2 py-3">
                      <div className="flex min-w-0 items-center gap-2">
                        {row.team.crest && (
                          <img
                            src={row.team.crest}
                            alt=""
                            className="h-6 w-6 flex-shrink-0 object-contain"
                          />
                        )}

                        <span className="truncate font-bold text-[#102348]">
                          {row.team.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-2 py-3 text-center font-semibold text-[#102348]">
                      {row.playedGames}
                    </td>
                    <td className="hidden px-2 py-3 text-center font-semibold text-[#6f7f9d] sm:table-cell">
                      {row.won}
                    </td>
                    <td className="hidden px-2 py-3 text-center font-semibold text-[#6f7f9d] sm:table-cell">
                      {row.draw}
                    </td>
                    <td className="hidden px-2 py-3 text-center font-semibold text-[#6f7f9d] sm:table-cell">
                      {row.lost}
                    </td>
                    <td className="px-2 py-3 text-center font-semibold text-[#102348]">
                      {formatGoalDifference(row.goalDifference)}
                    </td>
                    <td className="px-3 py-3 text-right text-base font-black text-[#102348]">
                      {row.points}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
