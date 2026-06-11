export const dynamic = "force-dynamic"

export async function GET() {
  const response = await fetch(
    "https://api.football-data.org/v4/competitions/WC/matches",
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