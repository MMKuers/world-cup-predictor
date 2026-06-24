export type CompetitionCode = "WC" | "PL" | "CL"

export const competitions: Array<{
  code: CompetitionCode
  label: string
}> = [
  {
    code: "WC",
    label: "World Cup",
  },
  {
    code: "PL",
    label: "Premier League",
  },
  {
    code: "CL",
    label: "Champions League",
  },
]

export function getCompetition(
  code: CompetitionCode
) {
  return (
    competitions.find(
      (competition) =>
        competition.code === code
    ) || competitions[0]
  )
}
