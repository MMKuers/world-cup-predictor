import { groupStageMatches } from "@/data/matches"

type TeamStats = {
  team: string
  group: string
  played: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
}

export function calculateStandings() {

  const table: Record<string, TeamStats> = {}

  groupStageMatches.forEach((match) => {

    const {
      home,
      away,
      group,
      homeScore,
      awayScore,
    } = match

    if (!table[home]) {

      table[home] = {
        team: home,
        group,
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
                goalDifference: 0,
        points: 0,
      }

    }

    if (!table[away]) {

      table[away] = {
        team: away,
        group,
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
      }

    }

    // Skip matches without scores
    if (
      homeScore === null ||
      awayScore === null
    ) {
      return
    }

    const homeTeam = table[home]
    const awayTeam = table[away]

    homeTeam.played += 1
    awayTeam.played += 1

    homeTeam.goalsFor += homeScore
    homeTeam.goalsAgainst += awayScore

    awayTeam.goalsFor += awayScore
    awayTeam.goalsAgainst += homeScore

    homeTeam.goalDifference =
      homeTeam.goalsFor -
      homeTeam.goalsAgainst

    awayTeam.goalDifference =
      awayTeam.goalsFor -
      awayTeam.goalsAgainst

    if (homeScore > awayScore) {

      homeTeam.wins += 1
      awayTeam.losses += 1

      homeTeam.points += 3

    } else if (
      awayScore > homeScore
    ) {

      awayTeam.wins += 1
      homeTeam.losses += 1

      awayTeam.points += 3

    } else {

      homeTeam.draws += 1
      awayTeam.draws += 1

      homeTeam.points += 1
      awayTeam.points += 1

    }

  })

  // Group standings
  const grouped: Record<
    string,
    TeamStats[]
  > = {}

  Object.values(table).forEach(
    (team) => {

      if (!grouped[team.group]) {
        grouped[team.group] = []
      }

      grouped[team.group].push(team)

    }
  )

  // Sort standings
  Object.keys(grouped).forEach(
    (group) => {

      grouped[group].sort(
        (a, b) => {

          if (
            b.points !== a.points
          ) {
            return (
              b.points - a.points
            )
          }

          if (
            b.goalDifference !==
            a.goalDifference
          ) {
            return (
              b.goalDifference -
              a.goalDifference
            )
          }

          return (
            b.goalsFor -
            a.goalsFor
          )

        }
      )

    }
  )

  return grouped

}