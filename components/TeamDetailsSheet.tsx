"use client"

import { useEffect, useState } from "react"
import { countryCodes } from "@/data/countryCodes"
import { CompetitionCode } from "@/components/competitions/config"

type Props = {
  team: string
  matches: any[]
  onClose: () => void
  competitionCode?: CompetitionCode
  competitionLabel?: string
  teamLogo?: string
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

type StandingRow = {
  position?: number
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

type StandingDetails = {
  position: number
  total?: StandingRow
  home?: StandingRow
  away?: StandingRow
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

function formatGoalDifference(value: number) {
  return value > 0
    ? `+${value}`
    : String(value)
}

function getFollowKey(competitionCode?: CompetitionCode) {
  return `followed-team-${competitionCode || "WC"}`
}

function getStoredFollowedTeams(competitionCode?: CompetitionCode) {
  if (typeof window === "undefined") {
    return []
  }

  const value = localStorage.getItem(
    getFollowKey(competitionCode)
  )

  if (!value) {
    return []
  }

  try {
    const teams = JSON.parse(value)
    return Array.isArray(teams)
      ? teams.filter(
          (teamName) =>
            typeof teamName === "string" &&
            teamName.trim()
        )
      : []
  } catch {
    return [value]
  }
}

function setStoredFollowedTeams(
  competitionCode: CompetitionCode | undefined,
  teams: string[]
) {
  localStorage.setItem(
    getFollowKey(competitionCode),
    JSON.stringify(teams)
  )
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

function getResultLetter(match: any, team: string) {
  const score = getScore(match)

  if (
    score.home === null ||
    score.away === null
  ) {
    return ""
  }

  const isHome =
    match.homeTeam?.name === team
  const teamScore = isHome
    ? score.home
    : score.away
  const opponentScore = isHome
    ? score.away
    : score.home

  if (teamScore > opponentScore) return "W"
  if (teamScore < opponentScore) return "L"
  return "D"
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
    <div className="flex items-center justify-between gap-3 border-t border-[#edf3ff] py-2 first:border-t-0 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <div className="truncate text-sm font-black text-[#102348]">
          {isHome ? "vs" : "at"} {opponent}
        </div>

        <div className="mt-0.5 truncate text-[11px] font-semibold text-[#71809a]">
          {formatDate(match.utcDate)} at {formatTime(match.utcDate)}
          {match.stadium ? ` - ${match.stadium}` : ""}
        </div>
      </div>

      <div className="flex-shrink-0 text-right">
        {hasScore ? (
          <div className="rounded-lg bg-[#f5f8fe] px-2 py-1 text-sm font-black text-[#102348]">
            {isHome
              ? `${score.home}-${score.away}`
              : `${score.away}-${score.home}`}
          </div>
        ) : (
          <div className="rounded-full bg-[#edf3ff] px-2 py-1 text-[10px] font-black uppercase text-[#4564a8]">
            {match.status === "IN_PLAY"
              ? "Live"
              : "Upcoming"}
          </div>
        )}
      </div>
    </div>
  )
}

function MiniRecord({
  label,
  row,
}: {
  label: string
  row?: StandingRow
}) {
  if (!row) {
    return null
  }

  return (
    <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2 ring-1 ring-[#edf3ff]">
      <span className="text-[10px] font-black uppercase text-[#71809a]">
        {label}
      </span>
      <span className="text-sm font-black text-[#102348]">
        {row.won}-{row.draw}-{row.lost}
      </span>
    </div>
  )
}

export default function TeamDetailsSheet({
  team,
  matches,
  onClose,
  competitionCode = "WC",
  competitionLabel = "World Cup",
  teamLogo,
}: Props) {
  const [standingDetails, setStandingDetails] =
    useState<StandingDetails | null>(null)
  const [followedTeams, setFollowedTeams] =
    useState<string[]>([])

  useEffect(() => {
    setFollowedTeams(
      getStoredFollowedTeams(competitionCode)
    )
  }, [competitionCode])

  useEffect(() => {
    if (competitionCode !== "PL") {
      setStandingDetails(null)
      return
    }

    async function loadStandings() {
      try {
        const response = await fetch(
          "/api/football/standings?competition=PL",
          { cache: "no-store" }
        )
        const data = await response.json()

        const findStanding = (type: string) =>
          data.standings?.find(
            (standing: any) =>
              standing.type === type
          )

        const totalStanding =
          findStanding("TOTAL") ||
          data.standings?.[0]
        const homeStanding =
          findStanding("HOME")
        const awayStanding =
          findStanding("AWAY")

        const totalTable =
          Array.isArray(totalStanding?.table)
            ? totalStanding.table
            : []

        const totalIndex =
          totalTable.findIndex(
            (row: StandingRow) =>
              row.team?.name === team
          )

        const totalRow =
          totalIndex >= 0
            ? totalTable[totalIndex]
            : undefined

        const homeRow =
          homeStanding?.table?.find(
            (row: StandingRow) =>
              row.team?.name === team
          )
        const awayRow =
          awayStanding?.table?.find(
            (row: StandingRow) =>
              row.team?.name === team
          )

        setStandingDetails(
          totalRow
            ? {
                position: totalIndex + 1,
                total: totalRow,
                home: homeRow,
                away: awayRow,
              }
            : null
        )
      } catch (error) {
        console.error(error)
        setStandingDetails(null)
      }
    }

    loadStandings()
  }, [competitionCode, team])

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
  const tableStats =
    standingDetails?.total

  const displayStats = tableStats
    ? {
        played: tableStats.playedGames,
        wins: tableStats.won,
        draws: tableStats.draw,
        losses: tableStats.lost,
        goalsFor: tableStats.goalsFor,
        goalsAgainst: tableStats.goalsAgainst,
        points: tableStats.points,
      }
    : stats

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
    .slice(0, 5)

  const form = recentResults
    .map((match) => getResultLetter(match, team))
    .filter(Boolean)

  const code = countryCodes[team.trim()]
  const goalDifference = tableStats
    ? tableStats.goalDifference
    : displayStats.goalsFor -
      displayStats.goalsAgainst
  const isFollowed = followedTeams.includes(team)
  const canFollow = competitionCode === "PL"

  const toggleFollow = () => {
    if (
      typeof window === "undefined" ||
      !canFollow
    ) {
      return
    }

    const nextTeams = isFollowed
      ? followedTeams.filter(
          (teamName) => teamName !== team
        )
      : [...followedTeams, team]

    setStoredFollowedTeams(
      competitionCode,
      nextTeams
    )
    setFollowedTeams(nextTeams)
    window.dispatchEvent(
      new CustomEvent("followed-team-change", {
        detail: {
          competitionCode,
          teams: nextTeams,
        },
      })
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-[#09162f]/55 px-3 pb-3 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Close team details"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <section className="relative mx-auto max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-white/10 bg-white shadow-2xl animate-in slide-in-from-bottom-4 duration-200">
        <div className="bg-gradient-to-br from-[#09162f] via-[#102348] to-[#172f63] px-4 py-4 text-white">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-white/20">
                {teamLogo ? (
                  <img
                    src={teamLogo}
                    alt={team}
                    className="h-9 w-9 object-contain"
                  />
                ) : code && (
                  <img
                    src={`https://flagcdn.com/w80/${code}.png`}
                    alt={team}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                )}
              </div>

              <div className="min-w-0">
                <h2 className="flex items-center gap-1.5 truncate text-xl font-black text-white">
                  <span className="truncate">{team}</span>
                  {isFollowed && (
                    <span className="flex-shrink-0 text-sm text-[#fbbf24]">
                      ★
                    </span>
                  )}
                </h2>

                <p className="text-xs font-bold text-[#b8c6df]">
                  {competitionCode === "WC"
                    ? `Group ${group}`
                    : competitionLabel}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-black text-white"
              aria-label="Close"
            >
              X
            </button>
          </div>

          {canFollow && (
            <button
              type="button"
              onClick={toggleFollow}
              className={`mt-3 w-full rounded-xl px-3 py-2 text-sm font-black transition ${
                isFollowed
                  ? "bg-white text-[#102348]"
                  : "bg-white/10 text-white ring-1 ring-white/15"
              }`}
            >
              {isFollowed
                ? "Following"
                : `Follow ${team}`}
            </button>
          )}
        </div>

        <div className="p-4">
          {standingDetails && (
            <div className="mb-3 flex items-center justify-between rounded-xl bg-[#f8fbff] px-3 py-2 ring-1 ring-[#edf3ff]">
              <span className="text-[10px] font-black uppercase text-[#71809a]">
                Table Position
              </span>
              <span className="text-sm font-black text-[#102348]">
                #{standingDetails.position}
              </span>
            </div>
          )}

          <div className="grid grid-cols-4 gap-2">
            <div className="rounded-lg bg-[#f8fbff] px-2 py-2 text-center ring-1 ring-[#edf3ff]">
              <div className="text-base font-black text-[#102348]">
                {displayStats.points}
              </div>
              <div className="text-[10px] font-black uppercase text-[#71809a]">
                Pts
              </div>
            </div>

            <div className="rounded-lg bg-[#f8fbff] px-2 py-2 text-center ring-1 ring-[#edf3ff]">
              <div className="text-base font-black text-[#102348]">
                {displayStats.wins}-{displayStats.draws}-{displayStats.losses}
              </div>
              <div className="text-[10px] font-black uppercase text-[#71809a]">
                W-D-L
              </div>
            </div>

            <div className="rounded-lg bg-[#f8fbff] px-2 py-2 text-center ring-1 ring-[#edf3ff]">
              <div className="text-base font-black text-[#102348]">
                {displayStats.goalsFor}-{displayStats.goalsAgainst}
              </div>
              <div className="text-[10px] font-black uppercase text-[#71809a]">
                GF-GA
              </div>
            </div>

            <div className="rounded-lg bg-[#f8fbff] px-2 py-2 text-center ring-1 ring-[#edf3ff]">
              <div className="text-base font-black text-[#102348]">
                {formatGoalDifference(goalDifference)}
              </div>
              <div className="text-[10px] font-black uppercase text-[#71809a]">
                GD
              </div>
            </div>
          </div>

          {(form.length > 0 || standingDetails) && (
            <div className="mt-3 grid gap-2">
              {form.length > 0 && (
                <div className="flex items-center justify-between rounded-lg bg-[#f8fbff] px-3 py-2 ring-1 ring-[#edf3ff]">
                  <span className="text-[10px] font-black uppercase text-[#71809a]">
                    Form
                  </span>
                  <div className="flex gap-1.5">
                    {form.map((result, index) => (
                      <span
                        key={`${result}-${index}`}
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-black ${
                          result === "W"
                            ? "bg-green-100 text-green-700"
                            : result === "D"
                            ? "bg-[#edf3ff] text-[#4564a8]"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {result}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {standingDetails && (
                <div className="grid grid-cols-2 gap-2">
                  <MiniRecord
                    label="Home"
                    row={standingDetails.home}
                  />
                  <MiniRecord
                    label="Away"
                    row={standingDetails.away}
                  />
                </div>
              )}
            </div>
          )}

          <div className="mt-4 grid gap-4">
            <div>
              <div className="mb-2 text-[11px] font-black uppercase text-[#71809a]">
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
              <div className="mb-2 text-[11px] font-black uppercase text-[#71809a]">
                Recent Results
              </div>

              <div className="rounded-xl bg-[#f8fbff] p-3 ring-1 ring-[#edf3ff]">
                {recentResults.length > 0 ? (
                  recentResults.slice(0, 3).map((match) => (
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
        </div>
      </section>
    </div>
  )
}
