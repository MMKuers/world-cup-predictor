"use client"
import { useState } from "react"
import BottomNav from "@/components/BottomNav"
import UsernameModal from "@/components/UsernameModal"
import ThirdPlaceTable from "@/components/ThirdPlaceTable"
import { calculateStandings } from "@/lib/calculateStandings"
import { countryCodes } from "@/data/countryCodes"
import GroupDrawer from "@/components/GroupDrawer"




const roundOf32 = [
  ["1A", "2B"],
  ["1C", "2D"],
  ["1E", "2F"],
  ["1G", "2H"],
  ["1I", "2J"],
  ["1K", "2L"],
  ["1B", "2A"],
  ["1D", "2C"],
  ["1F", "2E"],
  ["1H", "2G"],
  ["1J", "2I"],
  ["1L", "2K"],
  ["Wild Card 1", "Wild Card 2"],
  ["Wild Card 3", "Wild Card 4"],
  ["Wild Card 5", "Wild Card 6"],
  ["Wild Card 7", "Wild Card 8"],
]

const roundOf16 = [
  ["Winner M1", "Winner M2"],
  ["Winner M3", "Winner M4"],
  ["Winner M5", "Winner M6"],
  ["Winner M7", "Winner M8"],
  ["Winner M9", "Winner M10"],
  ["Winner M11", "Winner M12"],
  ["Winner M13", "Winner M14"],
  ["Winner M15", "Winner M16"],
]

const quarterfinals = [
  ["Winner R16-1", "Winner R16-2"],
  ["Winner R16-3", "Winner R16-4"],
  ["Winner R16-5", "Winner R16-6"],
  ["Winner R16-7", "Winner R16-8"],
]

const semifinals = [
  ["Winner QF-1", "Winner QF-2"],
  ["Winner QF-3", "Winner QF-4"],
]

export default function BracketPage() {

  const standings =
    calculateStandings()
    const [
  selectedGroup,
  setSelectedGroup,
] = useState<string | null>(null)

  return (
    <main className="min-h-screen bg-[#f3f7ff] p-6 pb-24">

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-[#102348]">
  MK's World Cup App
</h1>

       <p className="mt-2 text-[#6f7f9d]">
  World Cup 2026 Bracket
</p>

      </div>
<ThirdPlaceTable />
      <div className="overflow-x-auto">

  <div className="flex min-w-[1800px] items-start gap-10 pb-20">

    

       {/* GROUPS */}
<div className="w-[300px] flex-shrink-0">

  <h2 className="mb-6 text-lg font-bold text-[#102348]">
    Groups
  </h2>

  <div className="space-y-6">

    {Object.entries(standings).map(
      ([groupName, teams]) => (

        <div
  key={groupName}
  onClick={() =>
    setSelectedGroup(groupName)
  }
  className="cursor-pointer rounded-[28px] bg-white p-5 shadow-sm transition hover:scale-[1.02]"
>

          <div className="mb-4 flex items-center justify-between">

            <div className="text-lg font-bold text-[#102348]">
              Group {groupName}
            </div>

            <div className="text-sm font-semibold text-[#7b8baa]">
              PTS
            </div>

          </div>

          <div className="space-y-4">

            {teams.map(
              (team, index) => (

                <div
                  key={team.team}
                  className="flex items-center justify-between"
                >

                  <div className="flex items-center gap-3">

                    <div className="w-5 text-sm font-bold text-[#7b8baa]">
                      {index + 1}
                    </div>

                    <div className="flex items-center gap-3">

                      {countryCodes[team.team] && (
                        <img
                          src={`https://flagcdn.com/w40/${countryCodes[team.team]}.png`}
                          alt={team.team}
                          className="h-6 w-6 rounded-full object-cover"
                        />
                      )}

                      <div>

                        <div className="font-semibold text-[#102348]">
                          {team.team}
                        </div>

                        <div className="text-xs text-[#7b8baa]">

                          {team.played}P •{" "}
                          {team.wins}W •{" "}
                          {team.draws}D •{" "}
                          {team.losses}L •{" "}
                          {team.goalDifference}GD

                        </div>

                      </div>

                    </div>

                  </div>

                  <div className="text-sm font-bold text-[#102348]">
                    {team.points}
                  </div>

                </div>

              )
            )}

          </div>

        </div>

      )
    )}

  </div>

</div>
    {/* R32 */}
    <div className="relative w-[240px] flex-shrink-0">

      <h2 className="mb-6 text-lg font-bold text-[#102348]">
        R32
      </h2>

      <div className="space-y-[34px] pt-[6px]">

        {roundOf32.map((match, index) => (

          <div
            key={index}
            className="rounded-[28px] bg-white p-5 shadow-sm"
          >

            <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#7b8baa]">
              Match {index + 1}
            </div>

            <div className="space-y-4">

              <div className="rounded-2xl bg-[#edf3ff] px-4 py-3 font-semibold text-[#102348]">
                {match[0]}
              </div>

              <div className="rounded-2xl bg-[#edf3ff] px-4 py-3 font-semibold text-[#102348]">
                {match[1]}
              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

    {/* R16 */}
    <div className="w-[240px] flex-shrink-0">

      <h2 className="mb-6 text-lg font-bold text-[#102348]">
        R16
      </h2>

      <div className="space-y-16">

        {roundOf16.map((match, index) => (

          <div
            key={index}
            className="relative rounded-[28px] bg-white p-5 shadow-sm"
          >

            
            <div className="space-y-4">

              <div className="rounded-2xl bg-[#edf3ff] px-4 py-3 font-semibold text-[#102348]">
                {match[0]}
              </div>

              <div className="rounded-2xl bg-[#edf3ff] px-4 py-3 font-semibold text-[#102348]">
                {match[1]}
              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

    {/* QF */}
    <div className="w-[240px] flex-shrink-0 pt-12">

      <h2 className="mb-6 text-lg font-bold text-[#102348]">
        QF
      </h2>

      <div className="space-y-24">

        {quarterfinals.map((match, index) => (

          <div
            key={index}
            className="relative rounded-[28px] bg-white p-5 shadow-sm"
          >


            <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#7b8baa]">
              Quarterfinal {index + 1}
            </div>

            <div className="space-y-4">

              <div className="rounded-2xl bg-[#edf3ff] px-4 py-3 font-semibold text-[#102348]">
                {match[0]}
              </div>

              <div className="rounded-2xl bg-[#edf3ff] px-4 py-3 font-semibold text-[#102348]">
                {match[1]}
              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

    {/* SF */}
    <div className="w-[240px] flex-shrink-0 pt-24">

      <h2 className="mb-6 text-lg font-bold text-[#102348]">
        SF
      </h2>

      <div className="space-y-32">

        {semifinals.map((match, index) => (

          <div
            key={index}
            className="relative rounded-[28px] bg-white p-5 shadow-sm"
          >


            <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#7b8baa]">
              Semifinal
            </div>

            <div className="space-y-4">

              <div className="rounded-2xl bg-[#edf3ff] px-4 py-3 font-semibold text-[#102348]">
                {match[0]}
              </div>

              <div className="rounded-2xl bg-[#edf3ff] px-4 py-3 font-semibold text-[#102348]">
                {match[1]}
              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

    {/* FINAL */}
    <div className="w-[260px] flex-shrink-0 pt-40">

      <h2 className="mb-6 text-lg font-bold text-[#102348]">
        Final
      </h2>

      <div className="relative rounded-[32px] bg-[#102348] p-6 text-white shadow-sm">


        <div className="mb-5 text-sm font-semibold text-white/70">
          World Cup Final
        </div>

        <div className="space-y-4">

          <div className="rounded-2xl bg-white/10 px-4 py-4 text-lg font-bold">
            TBD
          </div>

          <div className="text-center text-sm text-white/50">
            vs
          </div>

          <div className="rounded-2xl bg-white/10 px-4 py-4 text-lg font-bold">
            TBD
          </div>

        </div>

      </div>

      <div className="mt-8 flex justify-center">

        <div className="rounded-full bg-[#fcb53a] px-6 py-3 text-sm font-bold text-[#102348] shadow-sm">
          🏆 Champion
        </div>

      </div>

    </div>

  </div>

</div>

      
<GroupDrawer
  group={selectedGroup}
  onClose={() =>
    setSelectedGroup(null)
  }
/>
      <BottomNav />

    </main>
  )
}