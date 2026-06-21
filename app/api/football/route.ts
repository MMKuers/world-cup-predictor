export const dynamic = "force-dynamic"

const allowedCompetitions = new Set([
  "WC",
  "PL",
  "CL",
])

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

  const response = await fetch(
    `https://api.football-data.org/v4/competitions/${competition}/matches`,
    {
      headers: {
        "X-Auth-Token":
          process.env.NEXT_PUBLIC_FOOTBALL_API_KEY!,
      },
      cache: "no-store",
    }
  )

  const data = await response.json()

  return Response.json(data)
}
