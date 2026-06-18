"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

import { getThirdPlaceTeams } from "@/lib/getThirdPlaceTeams"
import { countryCodes } from "@/data/countryCodes"

type Props = {
  standings: Record<string, any[]>
}

export default function ThirdPlaceTable({
  standings,
}: Props) {

  const [expanded, setExpanded] =
    useState(false)

  const thirdPlaceTeams =
    getThirdPlaceTeams(standings)

  return (

    <div className="mb-5 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#dbe5f6]">

      <button
        onClick={() =>
          setExpanded(!expanded)
        }
        className="flex w-full items-center justify-between gap-3 text-left"
      >

        <div className="min-w-0">

          <div className="text-base font-bold text-[#102348]">
            Best 3rd-Place Qualifiers
          </div>

          <div className="mt-1 text-xs text-[#7b8baa]">
            Top 8 third-place teams advance to R32
          </div>

        </div>

        <div className="flex flex-shrink-0 items-center gap-2">
          <div className="rounded-full bg-[#edf3ff] px-2.5 py-1 text-xs font-bold text-[#102348]">
            {Math.min(
              thirdPlaceTeams.length,
              8
            )}/8
          </div>

          {expanded ? (
            <ChevronUp
              className="text-[#102348]"
              size={20}
            />
          ) : (
            <ChevronDown
              className="text-[#102348]"
              size={20}
            />
          )}
        </div>

      </button>

      {expanded && (

        <div className="mt-4 space-y-2">

          {thirdPlaceTeams.map(
            (team, index) => (

              <div
                key={`${team.group}-${team.team}`}
                className="flex items-center justify-between gap-3 rounded-xl bg-[#f8fbff] px-3 py-2 ring-1 ring-[#edf3ff]"
              >

                <div className="flex min-w-0 items-center gap-3">

                  <div className="w-5 text-sm font-bold text-[#7b8baa]">
                    {index + 1}
                  </div>

                  {countryCodes[team.team] && (

                    <img
                      src={`https://flagcdn.com/w40/${countryCodes[team.team]}.png`}
                      alt={team.team}
                      className="h-7 w-7 rounded-full object-cover"
                    />

                  )}

                  <div className="min-w-0">

                    <div className="truncate text-sm font-bold text-[#102348]">
                      {team.team}
                    </div>

                    <div className="text-xs text-[#7b8baa]">

                      Group {team.group} • {team.points} pts • {team.goalDifference} GD

                    </div>

                  </div>

                </div>

                {index < 8 ? (

                  <div className="flex-shrink-0 rounded-full bg-[#dff7e8] px-2.5 py-1 text-[10px] font-bold text-[#15803d]">
                    IN
                  </div>

                ) : (

                  <div className="flex-shrink-0 rounded-full bg-[#ffe4e6] px-2.5 py-1 text-[10px] font-bold text-[#be123c]">
                    OUT
                  </div>

                )}

              </div>

            )
          )}

        </div>

      )}

    </div>

  )

}