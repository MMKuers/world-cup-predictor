import { calculateStandings } from "@/lib/calculateStandings"

export function getThirdPlaceTeams() {

  const standings =
    calculateStandings()

  const thirdPlaceTeams =
    Object.values(standings)
      .map((group, index) => ({
  ...group[2],
  group: String.fromCharCode(
    65 + index
  ),
}))
      .filter(Boolean)

  thirdPlaceTeams.sort((a, b) => {

    // Points
    if (b.points !== a.points) {
      return b.points - a.points
    }

    // Goal Difference
    if (
      b.goalDifference !==
      a.goalDifference
    ) {
      return (
        b.goalDifference -
        a.goalDifference
      )
    }

    // Goals For
    return (
      b.goalsFor -
      a.goalsFor
    )

  })

  return thirdPlaceTeams

}