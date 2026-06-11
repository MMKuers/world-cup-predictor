export async function GET() {
  const response = await fetch(
    "https://api.football-data.org/v4/competitions/WC/matches",
    {
      headers: {
        "X-Auth-Token":
          process.env.NEXT_PUBLIC_FOOTBALL_API_KEY!,
      },
    }
  )

  const data = await response.json()
const completed =
  data.matches.find(
    (m: any) => m.status === "FINISHED"
  )

console.log(
  "FIRST COMPLETED MATCH:",
  completed
)
  return Response.json(data)
}