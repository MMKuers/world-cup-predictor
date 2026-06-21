"use client"

import { countryCodes } from "@/data/countryCodes"

type Props = {
  group: string | null
  standings: Record<string, any[]>
  onClose: () => void
}

function StatChip({
  label,
  value,
}: {
  label: string
  value: number
}) {
  return (
    <div className="rounded-xl bg-white px-2 py-2 text-center ring-1 ring-[#edf3ff]">
      <div className="text-sm font-bold text-[#102348]">
        {value}
      </div>

      <div className="text-[10px] font-semibold uppercase text-[#7b8baa]">
        {label}
      </div>
    </div>
  )
}

export default function GroupDrawer({
  group,
  standings,
  onClose,
}: Props) {

  if (!group) return null

  const teams =
    standings[group] || []

  return (

    <div className="fixed inset-0 z-50 flex items-end bg-[#102348]/35 px-3 pb-3 backdrop-blur-sm">

      <button
        type="button"
        aria-label="Close group standings"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <section className="relative mx-auto max-h-[82vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-4 shadow-xl ring-1 ring-[#dbe5f6] animate-in slide-in-from-bottom-4 duration-200">

        <div className="mb-3 flex items-start justify-between gap-3">

          <div>
            <h2 className="text-xl font-bold text-[#102348]">
              Group {group}
            </h2>

            <p className="mt-1 text-xs font-semibold text-[#6f7f9d]">
              Standings and form
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#edf3ff] text-sm font-bold text-[#102348]"
            aria-label="Close"
          >
            X
          </button>

        </div>

        <div className="space-y-2">

          {teams.map((team, index) => (

            <div
              key={team.team}
              className="rounded-2xl bg-[#f8fbff] p-3 ring-1 ring-[#edf3ff]"
            >

              <div className="flex items-center justify-between gap-3">

                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-[#7b8baa] ring-1 ring-[#edf3ff]">
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
                      {team.played} played
                    </div>

                  </div>

                </div>

                <div className="flex-shrink-0 text-right">

                  <div className="text-lg font-bold text-[#102348]">
                    {team.points}
                  </div>

                  <div className="text-[10px] font-semibold uppercase text-[#7b8baa]">
                    Pts
                  </div>

                </div>

              </div>

              <div className="mt-3 grid grid-cols-5 gap-2">
                <StatChip
                  label="W"
                  value={team.wins}
                />
                <StatChip
                  label="D"
                  value={team.draws}
                />
                <StatChip
                  label="L"
                  value={team.losses}
                />
                <StatChip
                  label="GF"
                  value={team.goalsFor}
                />
                <StatChip
                  label="GD"
                  value={team.goalDifference}
                />
              </div>

            </div>

          ))}

        </div>

      </section>

    </div>

  )

}