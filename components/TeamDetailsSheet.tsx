"use client"

import { countryCodes } from "@/data/countryCodes"

type Props = {
  team: string
  matches: any[]
  onClose: () => void
}

type TeamStats = {
  played: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  points: number
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "America/Chicago",
  })
}

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Chicago",
  })
}

function getScore(match: any) {
  return {
    home:
      match.score?.fullTime?.home ??
      match.score?.regularTime?.home ??
      null,
    away:
      match.score?.fullTime?.away ??
      match.score?.regularTime?.away ??
      null,
  }
}

function getOpponent(match: any, team: string) {
  return match.homeTeam?.name === team
    ? match.awayTeam?.name
    : match.homeTeam?.name
}

function calculateTeamStats(
  team: string,
  matches: any[]
): TeamStats {
  return matches.reduce(
    (stats, match) => {
      if (match.status !== "FINISHED") {
        return stats
      }

      const score = getScore(match)

      if (
        score.home === null ||
        score.away === null
      ) {
        return stats
      }

      const isHome =
        match.homeTeam?.name === team
      const teamScore = isHome
        ? score.home
        : score.away
      const opponentScore = isHome
        ? score.away
        : score.home

      stats.played += 1
      stats.goalsFor += teamScore
      stats.goalsAgainst += opponentScore

      if (teamScore > opponentScore) {
        stats.wins += 1
        stats.points += 3
      } else if (
        teamScore < opponentScore
      ) {
        stats.losses += 1
      } else {
        stats.draws += 1
        stats.points += 1
      }

      return stats
    },
    {
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
    }
  )
}

function MatchRow({
  match,
  team,
}: {
  match: any
  team: string
}) {
  const opponent =
    getOpponent(match, team) || "TBD"
  const isHome =
    match.homeTeam?.name === team
  const score = getScore(match)
  const hasScore =
    score.home !== null &&
    score.away !== null

  return (
    <div className="flex items-center justify-between gap-3 border-t border-[#edf3ff] py-2.5 first:border-t-0 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-[#102348]">
          {isHome ? "vs" : "at"} {opponent}
        </div>

        <div className="mt-0.5 truncate text-xs text-[#6f7f9d]">
          {formatDate(match.utcDate)} at {formatTime(match.utcDate)}
          {match.stadium ? ` - ${match.stadium}` : ""}
        </div>
      </div>

      <div className="flex-shrink-0 text-right">
        {hasScore ? (
          <div className="text-sm font-bold text-[#102348]">
            {isHome
              ? `${score.home}-${score.away}`
              : `${score.away}-${score.home}`}
          </div>
        ) : (
          <div className="rounded-full bg-[#edf3ff] px-2 py-1 text-[11px] font-semibold text-[#4564a8]">
            {match.status === "IN_PLAY"
              ? "Live"
              : "Upcoming"}
          </div>
        )}
      </div>
    </div>
  )
}

export default function TeamDetailsSheet({
  team,
  matches,
  onClose,
}: Props) {
  const teamMatches = matches
    .filter(
      (match) =>
        match.homeTeam?.name === team ||
        match.awayTeam?.name === team
    )
    .sort(
      (a, b) =>
        new Date(a.utcDate).getTime() -
        new Date(b.utcDate).getTime()
    )

  const group =
    teamMatches.find((match) => match.group)
      ?.group?.replace("GROUP_", "") || "TBD"

  const stats =
    calculateTeamStats(team, teamMatches)

  const upcomingMatches = teamMatches
    .filter(
      (match) =>
        match.status !== "FINISHED"
    )
    .slice(0, 3)

  const recentResults = [...teamMatches]
    .filter(
      (match) =>
        match.status === "FINISHED"
    )
    .sort(
      (a, b) =>
        new Date(b.utcDate).getTime() -
        new Date(a.utcDate).getTime()
    )
    .slice(0, 3)

  const code = countryCodes[team.trim()]
  const goalDifference =
    stats.goalsFor - stats.goalsAgainst

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-[#102348]/35 px-3 pb-3 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Close team details"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <section className="relative mx-auto w-full max-w-md rounded-2xl bg-white p-4 shadow-xl ring-1 ring-[#dbe5f6] animate-in slide-in-from-bottom-4 duration-200">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#f3f7ff] ring-1 ring-[#dbe5f6]">
              {code && (
                <img
                  src={`https://flagcdn.com/w80/${code}.png`}
                  alt={team}
                  className="h-8 w-8 rounded-full object-cover"
                />
              )}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-xl font-bold text-[#102348]">
                {team}
              </h2>

              <p className="text-xs font-semibold text-[#6f7f9d]">
                Group {group}
              </p>
            </div>
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

        <div className="grid grid-cols-4 gap-2">
          <div className="rounded-xl bg-[#f8fbff] px-2 py-2 text-center ring-1 ring-[#edf3ff]">
            <div className="text-base font-bold text-[#102348]">
              {stats.points}
            </div>
            <div className="text-[10px] font-semibold uppercase text-[#6f7f9d]">
              Pts
            </div>
          </div>

          <div className="rounded-xl bg-[#f8fbff] px-2 py-2 text-center ring-1 ring-[#edf3ff]">
            <div className="text-base font-bold text-[#102348]">
              {stats.wins}-{stats.draws}-{stats.losses}
            </div>
            <div className="text-[10px] font-semibold uppercase text-[#6f7f9d]">
              W-D-L
            </div>
          </div>

          <div className="rounded-xl bg-[#f8fbff] px-2 py-2 text-center ring-1 ring-[#edf3ff]">
            <div className="text-base font-bold text-[#102348]">
              {stats.goalsFor}-{stats.goalsAgainst}
            </div>
            <div className="text-[10px] font-semibold uppercase text-[#6f7f9d]">
              GF-GA
            </div>
          </div>

          <div className="rounded-xl bg-[#f8fbff] px-2 py-2 text-center ring-1 ring-[#edf3ff]">
            <div className="text-base font-bold text-[#102348]">
              {goalDifference > 0
                ? `+${goalDifference}`
                : goalDifference}
            </div>
            <div className="text-[10px] font-semibold uppercase text-[#6f7f9d]">
              GD
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4">
          <div>
            <div className="mb-2 text-xs font-bold uppercase text-[#6f7f9d]">
              Next Matches
            </div>

            <div className="rounded-xl bg-[#f8fbff] p-3 ring-1 ring-[#edf3ff]">
              {upcomingMatches.length > 0 ? (
                upcomingMatches.map((match) => (
                  <MatchRow
                    key={`upcoming-${match.id}`}
                    match={match}
                    team={team}
                  />
                ))
              ) : (
                <div className="text-sm text-[#6f7f9d]">
                  No upcoming matches listed.
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="mb-2 text-xs font-bold uppercase text-[#6f7f9d]">
              Recent Results
            </div>

            <div className="rounded-xl bg-[#f8fbff] p-3 ring-1 ring-[#edf3ff]">
              {recentResults.length > 0 ? (
                recentResults.map((match) => (
                  <MatchRow
                    key={`result-${match.id}`}
                    match={match}
                    team={team}
                  />
                ))
              ) : (
                <div className="text-sm text-[#6f7f9d]">
                  Results will show here once matches finish.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
