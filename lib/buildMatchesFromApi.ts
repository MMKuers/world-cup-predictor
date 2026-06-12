export function buildMatchesFromApi(
  apiMatches: any[]
) {
  return apiMatches.map((match) => ({
    home: match.homeTeam?.name,
    away: match.awayTeam?.name,

    group:
      match.group?.replace(
        "GROUP_",
        ""
      ) || "",

    homeScore:
      match.score?.fullTime?.home,

    awayScore:
      match.score?.fullTime?.away,

    winner:
      match.score?.winner,
  }))
}