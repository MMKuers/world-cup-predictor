export const dynamic = "force-dynamic"

const allowedCompetitions = new Set([
  "PL",
  "CL",
])

export async function GET(request: Request) {
  const url = new URL(request.url)
  const requestedCompetition =
    url.searchParams
      .get("competition")
      ?.toUpperCase() || "PL"

  const competition =
    allowedCompetitions.has(requestedCompetition)
      ? requestedCompetition
      : "PL"

  const response = await fetch(
    `https://api.football-data.org/v4/competitions/${competition}/standings`,
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
