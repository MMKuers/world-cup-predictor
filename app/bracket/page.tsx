"use client"

import BottomNav from "@/components/BottomNav"

const countryCodes: Record<string, string> = {
  Mexico: "mx",
  "South Africa": "za",
  "Korea Republic": "kr",
  Czechia: "cz",
  Canada: "ca",
  Bosnia: "ba",
  Qatar: "qa",
  Switzerland: "ch",
  Brazil: "br",
  Morocco: "ma",
  Haiti: "ht",
  Scotland: "gb",
  USA: "us",
  Paraguay: "py",
  Australia: "au",
  Tunisia: "tn",
  France: "fr",
  Japan: "jp",
  Nigeria: "ng",
  Norway: "no",
  Argentina: "ar",
  Poland: "pl",
  Ghana: "gh",
  Iceland: "is",
  England: "gb",
  Denmark: "dk",
  Cameroon: "cm",
  Peru: "pe",
  Spain: "es",
  Chile: "cl",
  Senegal: "sn",
  "New Zealand": "nz",
  Germany: "de",
  Croatia: "hr",
  Iran: "ir",
  "Costa Rica": "cr",
  Portugal: "pt",
  Serbia: "rs",
  Egypt: "eg",
  Netherlands: "nl",
  Uruguay: "uy",
  Algeria: "dz",
  Finland: "fi",
  Italy: "it",
  Colombia: "co",
  Ecuador: "ec",
  "Saudi Arabia": "sa",
}

const groups = [
  {
    name: "Group A",
    teams: [
      "Mexico",
      "South Africa",
      "Korea Republic",
      "Czechia",
    ],
  },
  {
    name: "Group B",
    teams: [
      "Canada",
      "Bosnia",
      "Qatar",
      "Switzerland",
    ],
  },
  {
    name: "Group C",
    teams: [
      "Brazil",
      "Morocco",
      "Haiti",
      "Scotland",
    ],
  },
  {
    name: "Group D",
    teams: [
      "USA",
      "Paraguay",
      "Australia",
      "Tunisia",
    ],
  },
  {
    name: "Group E",
    teams: [
      "France",
      "Japan",
      "Nigeria",
      "Norway",
    ],
  },
  {
    name: "Group F",
    teams: [
      "Argentina",
      "Poland",
      "Ghana",
      "Iceland",
    ],
  },
  {
    name: "Group G",
    teams: [
      "England",
      "Denmark",
      "Cameroon",
      "Peru",
    ],
  },
  {
    name: "Group H",
    teams: [
      "Spain",
      "Chile",
      "Senegal",
      "New Zealand",
    ],
  },
  {
    name: "Group I",
    teams: [
      "Germany",
      "Croatia",
      "Iran",
      "Costa Rica",
    ],
  },
  {
    name: "Group J",
    teams: [
      "Portugal",
      "Serbia",
      "Egypt",
      "Canada",
    ],
  },
  {
    name: "Group K",
    teams: [
      "Netherlands",
      "Uruguay",
      "Algeria",
      "Finland",
    ],
  },
  {
    name: "Group L",
    teams: [
      "Italy",
      "Colombia",
      "Ecuador",
      "Saudi Arabia",
    ],
  },
]

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
  return (
    <main className="min-h-screen bg-[#f3f7ff] p-6 pb-24">

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-[#102348]">
          Tournament
        </h1>

        <p className="mt-2 text-[#6f7f9d]">
          World Cup 2026 Progression
        </p>

      </div>

      <div className="overflow-x-auto">

        <div className="flex min-w-[2200px] items-start gap-20 pb-20">

          {/* GROUPS */}
          <div className="w-[320px] flex-shrink-0">

            <h2 className="mb-5 text-lg font-bold text-[#102348]">
              Groups
            </h2>

            <div className="space-y-6">

              {groups.map((group) => (

                <div
                  key={group.name}
                  className="rounded-[28px] bg-white p-5 shadow-sm"
                >

                  <div className="mb-4 flex items-center justify-between">

                    <div className="text-lg font-bold text-[#102348]">
                      {group.name}
                    </div>

                    <div className="text-sm font-semibold text-[#7b8baa]">
                      PTS
                    </div>

                  </div>

                  <div className="space-y-4">

                    {group.teams.map((team, index) => (

                      <div
                        key={team}
                        className="flex items-center justify-between"
                      >

                        <div className="flex items-center gap-3">

                          <div className="w-5 text-sm font-bold text-[#7b8baa]">
                            {index + 1}
                          </div>

                          <div className="flex items-center gap-3">

                            {countryCodes[team] && (
                              <img
                                src={`https://flagcdn.com/w40/${countryCodes[team]}.png`}
                                alt={team}
                                className="h-5 w-5 rounded-full object-cover"
                              />
                            )}

                            <div className="font-semibold text-[#102348]">
                              {team}
                            </div>

                          </div>

                        </div>

                        <div className="text-sm font-bold text-[#102348]">
                          0
                        </div>

                      </div>

                    ))}

                  </div>

                </div>

              ))}

            </div>

          </div>

         {/* R32 */}
<div className="w-[260px] flex-shrink-0">

  <h2 className="mb-5 text-lg font-bold text-[#102348]">
    R32
  </h2>

  <div className="space-y-8 pt-8">

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
          <div className="relative w-[260px] flex-shrink-0">

            <h2 className="mb-5 text-lg font-bold text-[#102348]">
              R16
            </h2>

            {/* CONNECTORS */}
            <div className="absolute left-[-40px] top-[140px] h-[180px] w-10 border-t-2 border-b-2 border-r-2 border-[#cad7f2]" />

            <div className="absolute left-[-40px] top-[500px] h-[180px] w-10 border-t-2 border-b-2 border-r-2 border-[#cad7f2]" />

            <div className="absolute left-[-40px] top-[860px] h-[180px] w-10 border-t-2 border-b-2 border-r-2 border-[#cad7f2]" />

            <div className="absolute left-[-40px] top-[1220px] h-[180px] w-10 border-t-2 border-b-2 border-r-2 border-[#cad7f2]" />

            <div className="flex h-[3200px] flex-col justify-around py-[220px]">

              {roundOf16.map((match, index) => (

                <div
                  key={index}
                  className="rounded-[28px] bg-white p-5 shadow-sm"
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
          <div className="w-[260px] flex-shrink-0">

            <h2 className="mb-5 text-lg font-bold text-[#102348]">
              QF
            </h2>

            <div className="flex h-[3200px] flex-col justify-around py-[520px]">

              {quarterfinals.map((match, index) => (

                <div
                  key={index}
                  className="rounded-[28px] bg-white p-5 shadow-sm"
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
          <div className="w-[260px] flex-shrink-0">

            <h2 className="mb-5 text-lg font-bold text-[#102348]">
              SF
            </h2>

            <div className="flex h-[3200px] flex-col justify-around py-[920px]">

              {semifinals.map((match, index) => (

                <div
                  key={index}
                  className="rounded-[28px] bg-white p-5 shadow-sm"
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
          <div className="w-[280px] flex-shrink-0">

            <h2 className="mb-5 text-lg font-bold text-[#102348]">
              Final
            </h2>

            <div className="flex h-[3200px] items-center">

              <div className="rounded-[32px] bg-[#102348] p-6 text-white shadow-sm">

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

      </div>

      <BottomNav />

    </main>
  )
}