"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

import { getThirdPlaceTeams } from "@/lib/getThirdPlaceTeams"
import { countryCodes } from "@/data/countryCodes"

export default function ThirdPlaceTable() {

  const [expanded, setExpanded] =
    useState(false)

  const thirdPlaceTeams =
    getThirdPlaceTeams()

  return (

    <div className="mb-8 rounded-[28px] bg-white p-5 shadow-sm">

      <button
        onClick={() =>
          setExpanded(!expanded)
        }
        className="flex w-full items-center justify-between"
      >

        <div>

          <div className="text-lg font-bold text-[#102348]">
            Best 3rd Place Teams
          </div>

          <div className="mt-1 text-sm text-[#7b8baa]">
            Top 8 advance to knockout stage
          </div>

        </div>

        <div>

          {expanded ? (
            <ChevronUp
              className="text-[#102348]"
              size={22}
            />
          ) : (
            <ChevronDown
              className="text-[#102348]"
              size={22}
            />
          )}

        </div>

      </button>

      {expanded && (

        <div className="mt-6 space-y-4">

          {thirdPlaceTeams.map(
            (team, index) => (

              <div
                key={team.team}
                className="flex items-center justify-between rounded-2xl bg-[#f3f7ff] p-4"
              >

                <div className="flex items-center gap-4">

                  <div className="text-lg font-bold text-[#7b8baa]">
                    {index + 1}
                  </div>

                  {countryCodes[team.team] && (

                    <img
                      src={`https://flagcdn.com/w80/${countryCodes[team.team]}.png`}
                      alt={team.team}
                      className="h-10 w-10 rounded-full object-cover"
                    />

                  )}

                  <div>

                    <div className="font-bold text-[#102348]">
                      {team.team}
                    </div>

                    <div className="text-sm text-[#7b8baa]">

                      {team.points} pts •{" "}
                      {team.goalDifference} GD

                    </div>

                  </div>

                </div>

                {index < 8 ? (

                  <div className="rounded-full bg-[#dff7e8] px-3 py-1 text-xs font-bold text-[#15803d]">
                    QUALIFIED
                  </div>

                ) : (

                  <div className="rounded-full bg-[#ffe4e6] px-3 py-1 text-xs font-bold text-[#be123c]">
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