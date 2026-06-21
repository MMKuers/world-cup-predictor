import { getThirdPlaceTeams } from "@/lib/getThirdPlaceTeams"

type TeamStatus = {
  label: string
  tone: "safe" | "watch" | "danger" | "neutral"
}

function teamKey(team: string) {
  return team.trim().toLowerCase()
}

function isGroupComplete(teams: any[]) {
  return (
    teams.length >= 4 &&
    teams.every((team) => team.played >= 3)
  )
}

export function getBracketStatuses(
  standings: Record<string, any[]>
) {
  const statusByTeam: Record<string, TeamStatus> = {}
  const thirdPlaceTeams =
    getThirdPlaceTeams(standings)
  const advancedThirdPlaceTeams =
    new Set(
      thirdPlaceTeams
        .slice(0, 8)
        .map((team) => teamKey(team.team))
    )

  Object.entries(standings).forEach(
    ([, teams]) => {
      const groupComplete =
        isGroupComplete(teams)

      teams.forEach((team, index) => {
        const key = teamKey(team.team)

        if (index < 2) {
          statusByTeam[key] = groupComplete
            ? {
                label: "Advanced",
                tone: "safe",
              }
            : {
                label: "Advancing",
                tone: "safe",
              }

          return
        }

        if (index === 2) {
          statusByTeam[key] = groupComplete
            ? advancedThirdPlaceTeams.has(key)
              ? {
                  label: "Advanced",
                  tone: "safe",
                }
              : {
                  label: "Eliminated",
                  tone: "danger",
                }
            : {
                label: "3rd race",
                tone: "watch",
              }

          return
        }

        statusByTeam[key] = groupComplete
          ? {
              label: "Eliminated",
              tone: "danger",
            }
          : {
              label: "Chasing",
              tone: "neutral",
            }
      })
    }
  )

  return statusByTeam
}

export function getTeamStatus(
  statusByTeam: Record<string, TeamStatus>,
  team: string
) {
  return statusByTeam[teamKey(team)] || null
}
