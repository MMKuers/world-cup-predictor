export const dynamic = "force-dynamic"

const allowedCompetitions = new Set([
  "WC",
  "PL",
  "CL",
])

async function fetchCompetitionMatches(
  competition: string,
  season?: number
) {
  const searchParams = new URLSearchParams()

  if (season) {
    searchParams.set("season", String(season))
  }

  const queryString = searchParams.toString()

  const response = await fetch(
    `https://api.football-data.org/v4/competitions/${competition}/matches${
      queryString ? `?${queryString}` : ""
    }`,
    {
      headers: {
        "X-Auth-Token":
          process.env.NEXT_PUBLIC_FOOTBALL_API_KEY!,
      },
      cache: "no-store",
    }
  )

  return response.json()
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const requestedCompetition =
    url.searchParams
      .get("competition")
      ?.toUpperCase() || "WC"

  const competition =
    allowedCompetitions.has(requestedCompetition)
      ? requestedCompetition
      : "WC"

  const data =
    await fetchCompetitionMatches(competition)

  if (
    competition !== "WC" &&
    Array.isArray(data.matches) &&
    data.matches.length === 0
  ) {
    const previousSeason =
      new Date().getUTCFullYear() - 1

    const fallbackData =
      await fetchCompetitionMatches(
        competition,
        previousSeason
      )

    if (
      Array.isArray(fallbackData.matches) &&
      fallbackData.matches.length > 0
    ) {
      return Response.json({
        ...fallbackData,
        fallbackSeason: previousSeason,
      })
    }
  }

  return Response.json(data)
}
