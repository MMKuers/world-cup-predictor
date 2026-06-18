"use client"
import { useState } from "react"
import BottomNav from "@/components/BottomNav"
import AuthButton from "@/components/AuthButton"
import UsernameModal from "@/components/UsernameModal"
import ThirdPlaceTable from "@/components/ThirdPlaceTable"
import { calculateStandings } from "@/lib/calculateStandings"
import { countryCodes } from "@/data/countryCodes"
import GroupDrawer from "@/components/GroupDrawer"
import {
  generateBracket,
  KnockoutMatch,
} from "@/lib/generateBracket"
import { useEffect } from "react"
import { buildMatchesFromApi } from "@/lib/buildMatchesFromApi"

function TeamLine({
  team,
  score,
  winner,
}: {
  team: string
  score: number | null
  winner?: boolean
}) {
  const code =
    countryCodes[team]
  const isPlaceholder =
    (!code && team.includes("Group")) ||
    team.includes("Winner") ||
    team.includes("Loser") ||
    team.includes("Best 3rd") ||
    team === "TBD"

  return (
    <div
      className={`flex min-h-8 items-center justify-between gap-2 rounded-xl px-2.5 py-1.5 ${
        winner
          ? "bg-[#102348] text-white"
          : "bg-[#edf3ff] text-[#102348]"
      }`}
    >
      <div className="flex min-w-0 items-center gap-2">
        {code && (
          <img
            src={`https://flagcdn.com/w40/${code}.png`}
            alt={team}
            className="h-5 w-5 rounded-full object-cover"
          />
        )}

        <span
          className={`truncate text-xs font-semibold ${
            isPlaceholder
              ? "text-[#6f7f9d]"
              : ""
          }`}
        >
          {team}
        </span>
      </div>

      {score !== null && (
        <span className="flex-shrink-0 text-sm font-bold">
          {score}
        </span>
      )}
    </div>
  )
}

function MatchTile({
  match,
  tone = "light",
}: {
  match: KnockoutMatch
  tone?: "light" | "final" | "third"
}) {
  const isFinal = tone === "final"
  const winner = match.winner

  return (
    <div
      className={`rounded-2xl p-3 shadow-sm ring-1 ${
        isFinal
          ? "bg-[#102348] text-white ring-[#102348]"
          : tone === "third"
          ? "bg-white text-[#102348] ring-[#f5d28e]"
          : "bg-white text-[#102348] ring-[#dbe5f6]"
      }`}
    >
      <div
        className={`mb-2 flex items-center justify-between gap-2 text-[10px] font-bold uppercase ${
          isFinal
            ? "text-white/70"
            : "text-[#7b8baa]"
        }`}
      >
        <span>{match.label}</span>
        {match.status && (
          <span>{match.status}</span>
        )}
      </div>

      <div className="space-y-1.5">
        <TeamLine
          team={match.home}
          score={match.homeScore}
          winner={winner === match.home}
        />

        <TeamLine
          team={match.away}
          score={match.awayScore}
          winner={winner === match.away}
        />
      </div>
    </div>
  )
}

function RoundColumn({
  title,
  matches,
  offset = "",
}: {
  title: string
  matches: KnockoutMatch[]
  offset?: string
}) {
  return (
    <section className={`w-[198px] flex-shrink-0 ${offset}`}>
      <h2 className="mb-3 text-xs font-bold uppercase text-[#6f7f9d]">
        {title}
      </h2>

      <div className="space-y-2.5">
        {matches.map((match) => (
          <MatchTile
            key={match.id}
            match={match}
          />
        ))}
      </div>
    </section>
  )
}

export default function BracketPage() {
  const [matches, setMatches] =
  useState<any[]>([])
useEffect(() => {

  async function loadMatches() {

    const response =
      await fetch("/api/football")

    const data =
      await response.json()

    setMatches(data.matches)

  }

  loadMatches()

}, [])
const apiMatches =
  buildMatchesFromApi(matches)
const standings =
  calculateStandings(apiMatches)
    


    const knockoutMatches =
  generateBracket(standings, matches)
  const {
  roundOf32,
  roundOf16,
  quarterfinals,
  semifinals,
  final,
  thirdPlace,
} = knockoutMatches





    const [
  selectedGroup,
  setSelectedGroup,
] = useState<string | null>(null)

  return (
    <main className="min-h-screen bg-[#f3f7ff] p-4 pb-24">

      <UsernameModal />

      <div className="mb-4 flex items-start justify-between gap-3">

        <div className="min-w-0">

        <h1 className="text-2xl font-bold text-[#102348]">
  Bracket
</h1>

       <p className="mt-1 text-sm text-[#6f7f9d]">
  Groups, qualifiers, and knockout path
</p>

        </div>

        <div className="flex-shrink-0">
          <AuthButton />
        </div>

      </div>

      <div className="mb-4 -mx-1 overflow-x-auto px-1 pt-3 pb-3 scrollbar-hide">
        <div className="flex items-center gap-2">
        {[
          "Groups",
          "3rd Place",
          "R32",
          "R16",
          "QF",
          "SF",
          "Final",
        ].map((item) => (
          <a
            key={item}
            href={`#${item
              .toLowerCase()
              .replaceAll(" ", "-")}`}
            className="whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-xs font-bold leading-none text-[#102348] ring-1 ring-[#dbe5f6] transition active:scale-95"
          >
            {item}
          </a>
        ))}
        </div>
      </div>

      <ThirdPlaceTable standings={standings} />

      <div className="overflow-x-auto pb-4">

  <div className="flex min-w-[1580px] items-start gap-3 pb-20">

    

       <section id="groups" className="w-[255px] flex-shrink-0">

  <h2 className="mb-3 text-xs font-bold uppercase text-[#6f7f9d]">
    Groups
  </h2>

  <div className="space-y-2.5">

    {Object.entries(standings)
  .sort(([a], [b]) =>
    a.localeCompare(b)
  )
  .map(
      ([groupName, teams]) => (

        <div
  key={groupName}
  onClick={() =>
    setSelectedGroup(groupName)
  }
  className="cursor-pointer rounded-2xl bg-white p-3 shadow-sm ring-1 ring-[#dbe5f6] transition hover:-translate-y-[1px] hover:shadow-md"
>

          <div className="mb-2.5 flex items-center justify-between">

            <div className="text-sm font-bold text-[#102348]">
              Group {groupName}
            </div>

            <div className="text-[10px] font-semibold text-[#7b8baa]">
              PTS
            </div>

          </div>

          <div className="space-y-2.5">

            {teams.map(
              (team, index) => (

                <div
                  key={team.team}
                  className="flex items-center justify-between gap-2"
                >

                  <div className="flex min-w-0 items-center gap-2">

                    <div className="w-4 text-xs font-bold text-[#7b8baa]">
                      {index + 1}
                    </div>

                    {countryCodes[team.team] && (
                      <img
                        src={`https://flagcdn.com/w40/${countryCodes[team.team]}.png`}
                        alt={team.team}
                        className="h-5 w-5 rounded-full object-cover"
                      />
                    )}

                    <div className="min-w-0">

                      <div className="truncate text-xs font-semibold text-[#102348]">
                        {team.team}
                      </div>

                      <div className="text-[10px] text-[#7b8baa]">

                        {team.played}P • {team.wins}W • {team.draws}D • {team.losses}L • {team.goalDifference}GD

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

</section>
    <section id="r32">
      <RoundColumn
        title="R32"
        matches={roundOf32}
      />
    </section>

    <section id="r16">
      <RoundColumn
        title="R16"
        matches={roundOf16}
      />
    </section>

    <section id="qf">
      <RoundColumn
        title="Quarterfinals"
        matches={quarterfinals}
        offset="pt-8"
      />
    </section>

    <section id="sf">
      <RoundColumn
        title="Semifinals"
        matches={semifinals}
        offset="pt-16"
      />
    </section>

    <section id="final" className="w-[220px] flex-shrink-0 pt-24">

      <h2 className="mb-3 text-xs font-bold uppercase text-[#6f7f9d]">
        Final
      </h2>

      <MatchTile
        match={final}
        tone="final"
      />

      <div className="mt-3 rounded-full bg-[#fcb53a] px-4 py-2 text-center text-xs font-bold text-[#102348] shadow-sm">
        Champion decided July 19
      </div>

      <div id="3rd-place" className="mt-6">
        <h2 className="mb-3 text-xs font-bold uppercase text-[#6f7f9d]">
          Third Place
        </h2>

        <MatchTile
          match={thirdPlace}
          tone="third"
        />

        <p className="mt-2 text-xs text-[#7b8baa]">
          Semifinal losers meet July 18.
        </p>
      </div>

    </section>

  </div>

</div>

      
<GroupDrawer
  group={selectedGroup}
  standings={standings}
  onClose={() =>
    setSelectedGroup(null)
  }
/>
      <BottomNav />

    </main>
  )
}
