export function buildMatchesFromApi(
  apiMatches: any[]
) {
  return apiMatches.map((match) => ({
    id: match.id,
    stage: "GROUP",
    date: match.utcDate,
    kickoff: match.utcDate,
    stadium: "",

    home: match.homeTeam?.name,
    away: match.awayTeam?.name,

    group:
      match.group?.replace("GROUP_", "") || "",

    homeScore:
      match.score?.fullTime?.home ?? null,

    awayScore:
      match.score?.fullTime?.away ?? null,

    winner:
      match.score?.winner ?? null,
  }))
}