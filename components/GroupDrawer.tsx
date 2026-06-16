"use client"

import { calculateStandings } from "@/lib/calculateStandings"
import { countryCodes } from "@/data/countryCodes"

type Props = {
  group: string | null
  standings: Record<string, any[]>
  onClose: () => void
}

export default function GroupDrawer({
  group,
  standings,
  onClose,
}: Props) {

  if (!group) return null

  

  const teams =
    standings[group] || []
console.log(
  "FIRST TEAM:",
  JSON.stringify(
    teams[0],
    null,
    2
  )
)
    console.log(
  "GROUP DRAWER TEAMS:",
  teams
)

  return (

    <>

      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/40"
      />

      {/* Drawer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-[32px] bg-white p-6 shadow-2xl">

        {/* Handle */}
        <div className="mb-5 flex justify-center">

          <div className="h-1.5 w-14 rounded-full bg-gray-300" />

        </div>

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-2xl font-bold text-[#102348]">
            Group {group}
          </h2>

          <button
            onClick={onClose}
            className="rounded-full bg-[#edf3ff] px-4 py-2 text-sm font-semibold text-[#102348]"
          >
            Close
          </button>

        </div>

        {/* Standings */}
        <div className="space-y-4">

          {teams.map((team, index) => (

            <div
              key={team.team}
              className="rounded-2xl bg-[#f3f7ff] p-4"
            >

              <div className="flex items-center justify-between">

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

                    <div className="text-lg font-bold text-[#102348]">
                      {team.team}
                    </div>

                    <div className="text-sm text-[#7b8baa]">
                      {team.played} Played
                    </div>

                  </div>

                </div>

                <div className="text-right">

                  <div className="text-2xl font-bold text-[#102348]">
                    {team.points}
                  </div>

                  <div className="text-xs font-semibold uppercase text-[#7b8baa]">
                    Points
                  </div>

                </div>

              </div>

              {/* Stats */}
              <div className="mt-4 grid grid-cols-5 gap-3 text-center">

                <div className="rounded-xl bg-white p-3">

                  <div className="text-lg font-bold text-[#102348]">
                    {team.wins}
                  </div>

                  <div className="text-xs text-[#7b8baa]">
                    W
                  </div>

                </div>

                <div className="rounded-xl bg-white p-3">

                  <div className="text-lg font-bold text-[#102348]">
                    {team.draws}
                  </div>

                  <div className="text-xs text-[#7b8baa]">
                    D
                  </div>

                </div>

                <div className="rounded-xl bg-white p-3">

                  <div className="text-lg font-bold text-[#102348]">
                    {team.losses}
                  </div>

                  <div className="text-xs text-[#7b8baa]">
                    L
                  </div>

                </div>

                <div className="rounded-xl bg-white p-3">

                  <div className="text-lg font-bold text-[#102348]">
                    {team.goalsFor}
                  </div>

                  <div className="text-xs text-[#7b8baa]">
                    GF
                  </div>

                </div>

                <div className="rounded-xl bg-white p-3">

                  <div className="text-lg font-bold text-[#102348]">
                    {team.goalDifference}
                  </div>

                  <div className="text-xs text-[#7b8baa]">
                    GD
                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </>

  )

}