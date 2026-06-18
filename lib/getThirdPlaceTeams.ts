import { calculateStandings } from "@/lib/calculateStandings"

export function getThirdPlaceTeams(
  standings = calculateStandings()
) {

  const thirdPlaceTeams =
    Object.entries(standings)
      .sort(([a], [b]) =>
        a.localeCompare(b)
      )
      .map(([groupName, group]) => {
        const team = group[2]

        if (!team) return null

        return {
          ...team,
          group: groupName,
        }
      })
      .filter(Boolean) as any[]

  thirdPlaceTeams.sort((a, b) => {

    if (b.points !== a.points) {
      return b.points - a.points
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

  })

  return thirdPlaceTeams

}