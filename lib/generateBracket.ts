import { getThirdPlaceTeams } from "@/lib/getThirdPlaceTeams"

export type KnockoutMatch = {
  id: number | string
  round: string
  label: string
  home: string
  away: string
  homeScore: number | null
  awayScore: number | null
  winner: string | null
  loser: string | null
  status?: string
  kickoff?: string
}

type Slot = {
  id: number
  label: string
  home: string
  away: string
}

const roundOf32Slots: Slot[] = [
  {
    id: 73,
    label: "Match 73",
    home: "Runner-up Group A",
    away: "Runner-up Group B",
  },
  {
    id: 74,
    label: "Match 74",
    home: "Winner Group E",
    away: "Best 3rd A/B/C/D/F",
  },
  {
    id: 75,
    label: "Match 75",
    home: "Winner Group F",
    away: "Runner-up Group C",
  },
  {
    id: 76,
    label: "Match 76",
    home: "Winner Group C",
    away: "Runner-up Group F",
  },
  {
    id: 77,
    label: "Match 77",
    home: "Winner Group I",
    away: "Best 3rd C/D/F/G/H",
  },
  {
    id: 78,
    label: "Match 78",
    home: "Runner-up Group E",
    away: "Runner-up Group I",
  },
  {
    id: 79,
    label: "Match 79",
    home: "Winner Group A",
    away: "Best 3rd C/E/F/H/I",
  },
  {
    id: 80,
    label: "Match 80",
    home: "Winner Group L",
    away: "Best 3rd E/H/I/J/K",
  },
  {
    id: 81,
    label: "Match 81",
    home: "Winner Group D",
    away: "Best 3rd B/E/F/I/J",
  },
  {
    id: 82,
    label: "Match 82",
    home: "Winner Group G",
    away: "Best 3rd A/E/H/I/J",
  },
  {
    id: 83,
    label: "Match 83",
    home: "Runner-up Group K",
    away: "Runner-up Group L",
  },
  {
    id: 84,
    label: "Match 84",
    home: "Winner Group H",
    away: "Runner-up Group J",
  },
  {
    id: 85,
    label: "Match 85",
    home: "Winner Group B",
    away: "Best 3rd E/F/G/I/J",
  },
  {
    id: 86,
    label: "Match 86",
    home: "Winner Group J",
    away: "Runner-up Group H",
  },
  {
    id: 87,
    label: "Match 87",
    home: "Winner Group K",
    away: "Best 3rd D/E/I/J/L",
  },
  {
    id: 88,
    label: "Match 88",
    home: "Runner-up Group D",
    away: "Runner-up Group G",
  },
]

function getScore(match: any) {
  return {
    home:
      match.score?.fullTime?.home ??
      match.score?.regularTime?.home ??
      match.score?.fullTime?.homeTeam ??
      null,
    away:
      match.score?.fullTime?.away ??
      match.score?.regularTime?.away ??
      match.score?.fullTime?.awayTeam ??
      null,
  }
}

function getWinner(
  home: string,
  away: string,
  homeScore: number | null,
  awayScore: number | null,
  apiWinner?: string
) {
  if (apiWinner === "HOME_TEAM") return home
  if (apiWinner === "AWAY_TEAM") return away

  if (
    homeScore === null ||
    awayScore === null
  ) {
    return null
  }

  if (homeScore > awayScore) return home
  if (awayScore > homeScore) return away

  return null
}

function getLoser(
  home: string,
  away: string,
  winner: string | null
) {
  if (!winner) return null
  if (winner === home) return away
  if (winner === away) return home
  return null
}

function normalizeStage(stage = "") {
  return stage
    .toUpperCase()
    .replaceAll(" ", "_")
    .replaceAll("-", "_")
}

function matchRound(stage = "") {
  const normalized = normalizeStage(stage)

  if (
    normalized.includes("32") ||
    normalized === "LAST_32"
  ) {
    return "R32"
  }

  if (
    normalized.includes("16") ||
    normalized === "LAST_16" ||
    normalized === "ROUND_OF_16"
  ) {
    return "R16"
  }

  if (normalized.includes("QUARTER")) {
    return "QF"
  }

  if (normalized.includes("SEMI")) {
    return "SF"
  }

  if (
    normalized.includes("THIRD") ||
    normalized.includes("3RD")
  ) {
    return "THIRD"
  }

  if (normalized.includes("FINAL")) {
    return "FINAL"
  }

  return ""
}

function fromApiMatch(
  match: any,
  round: string,
  label: string
): KnockoutMatch {
  const score = getScore(match)
  const home =
    match.homeTeam?.name || "TBD"
  const away =
    match.awayTeam?.name || "TBD"
  const winner = getWinner(
    home,
    away,
    score.home,
    score.away,
    match.score?.winner
  )

  return {
    id: match.id,
    round,
    label,
    home,
    away,
    homeScore: score.home,
    awayScore: score.away,
    winner,
    loser: getLoser(home, away, winner),
    status: match.status,
    kickoff: match.utcDate,
  }
}

function placeholderMatch(
  slot: Slot,
  round: string
): KnockoutMatch {
  return {
    id: slot.id,
    round,
    label: slot.label,
    home: slot.home,
    away: slot.away,
    homeScore: null,
    awayScore: null,
    winner: null,
    loser: null,
  }
}

function buildRound(
  apiMatches: any[],
  round: string,
  fallbackSlots: Slot[],
  labelPrefix: string
) {
  const matches = apiMatches
    .filter(
      (match) =>
        matchRound(match.stage) === round
    )
    .sort(
      (a, b) =>
        new Date(a.utcDate).getTime() -
        new Date(b.utcDate).getTime()
    )

  if (matches.length > 0) {
    return matches.map((match, index) =>
      fromApiMatch(
        match,
        round,
        `${labelPrefix} ${index + 1}`
      )
    )
  }

  return fallbackSlots.map((slot) =>
    placeholderMatch(slot, round)
  )
}

function winnerLabel(
  match: KnockoutMatch | undefined
) {
  return match?.winner ||
    `Winner ${match?.label || "TBD"}`
}

function loserLabel(
  match: KnockoutMatch | undefined
) {
  return match?.loser ||
    `Loser ${match?.label || "TBD"}`
}

function linkedRound(
  previousRound: KnockoutMatch[],
  round: string,
  labelPrefix: string
) {
  const count = previousRound.length / 2

  return Array.from({ length: count }).map(
    (_, index) => {
      const first =
        previousRound[index * 2]
      const second =
        previousRound[index * 2 + 1]

      return placeholderMatch(
        {
          id: `${round}-${index + 1}` as any,
          label: `${labelPrefix} ${index + 1}`,
          home: winnerLabel(first),
          away: winnerLabel(second),
        },
        round
      )
    }
  )
}

export function generateBracket(
  standings: Record<string, any[]>,
  apiMatches: any[] = []
) {
  const thirdPlaceTeams =
    getThirdPlaceTeams(standings)

  const roundOf32 = buildRound(
    apiMatches,
    "R32",
    roundOf32Slots,
    "R32"
  )

  const roundOf16 = buildRound(
    apiMatches,
    "R16",
    linkedRound(
      roundOf32,
      "R16",
      "R16"
    ) as any,
    "R16"
  )

  const quarterfinals = buildRound(
    apiMatches,
    "QF",
    linkedRound(
      roundOf16,
      "QF",
      "QF"
    ) as any,
    "QF"
  )

  const semifinals = buildRound(
    apiMatches,
    "SF",
    linkedRound(
      quarterfinals,
      "SF",
      "Semifinal"
    ) as any,
    "Semifinal"
  )

  const apiFinal = apiMatches.find(
    (match) =>
      matchRound(match.stage) === "FINAL"
  )

  const final = apiFinal
    ? fromApiMatch(
        apiFinal,
        "FINAL",
        "Final"
      )
    : placeholderMatch(
        {
          id: 401,
          label: "Final",
          home: winnerLabel(semifinals[0]),
          away: winnerLabel(semifinals[1]),
        },
        "FINAL"
      )

  const apiThirdPlace = apiMatches.find(
    (match) =>
      matchRound(match.stage) === "THIRD"
  )

  const thirdPlace = apiThirdPlace
    ? fromApiMatch(
        apiThirdPlace,
        "THIRD",
        "Third Place"
      )
    : placeholderMatch(
        {
          id: 402,
          label: "Third Place",
          home: loserLabel(semifinals[0]),
          away: loserLabel(semifinals[1]),
        },
        "THIRD"
      )

  return {
    roundOf32,
    roundOf16,
    quarterfinals,
    semifinals,
    final,
    thirdPlace,
    thirdPlaceTeams,
  }
}
