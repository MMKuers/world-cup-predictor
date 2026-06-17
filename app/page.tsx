"use client"

import MatchCard from "@/components/MatchCard"
import BottomNav from "@/components/BottomNav"
import { supabase } from "@/lib/supabase"
import UsernameModal from "@/components/UsernameModal"
import { calculateStandings } from "@/lib/calculateStandings"
import {
  buildUsersById,
  calculatePlayerPoints,
  getCurrentPlayerKey,
} from "@/lib/predictionScoring"
import {
  useState,
  useEffect,
  useRef,
} from "react"

export default function HomePage() {
 const [username, setUsername] =
  useState("")

const [totalPoints, setTotalPoints] =
  useState(0)
const [matches, setMatches] = useState<any[]>([])
const [selectedDate, setSelectedDate] =
  useState("")
  const dateStripRef =
  useRef<HTMLDivElement>(null)
useEffect(() => {
  setUsername(
    localStorage.getItem("wc-user") || ""
  )
}, [])
useEffect(() => {

  async function loadMatches() {

    const response =
      await fetch("/api/football")

    const data =
      await response.json()

    console.log("API STATUS:", data.matches[0]?.status)
console.log("API SCORE:", data.matches[0]?.score)

setMatches(data.matches)

const userId =
  localStorage.getItem("user-id") || ""

const currentUsername =
  localStorage.getItem("wc-user") || ""

if (userId || currentUsername) {

  const { data: predictions, error } =
    await supabase
      .from("predictions")
      .select("*")

  const { data: users } =
    await supabase
      .from("users")
      .select("*")

  if (error) {
    console.error(error)
  } else {
    const usersById =
      buildUsersById(users || [])

    const playerKey =
      getCurrentPlayerKey(
        userId,
        currentUsername,
        usersById
      )

    setTotalPoints(
      calculatePlayerPoints({
        predictions: predictions || [],
        matches: data.matches,
        usersById,
        playerKey,
        currentUserId: userId,
        currentUsername,
      })
    )
  }

}
const nullMatch = data.matches.find(
  (m: any) =>
    !m.homeTeam?.name ||
    !m.awayTeam?.name
)

console.log(
  "FIRST NULL MATCH DETAILS",
  {
    id: nullMatch?.id,
    stage: nullMatch?.stage,
    group: nullMatch?.group,
    matchday: nullMatch?.matchday,
    homeTeam: nullMatch?.homeTeam,
    awayTeam: nullMatch?.awayTeam,
    status: nullMatch?.status
  }
)
  }

  loadMatches()

}, [])


  const groupedMatches: Record<string, any[]> =
  matches
    .filter(
      (match) =>
        match.status !== "IN_PLAY" &&
        match.status !== "PAUSED"
    )
    .reduce((acc, match) => {
    

    const date =
  new Date(match.utcDate)
    .toLocaleDateString("en-CA", {
      timeZone: "America/Chicago",
    })

    if (!acc[date]) {
      acc[date] = []
    }

    acc[date].push(match)

    return acc

  }, {} as Record<string, any[]>)
  const liveMatches = matches.filter(
     
  (match) =>
    match.status === "IN_PLAY" ||
    match.status === "PAUSED"
)
const availableDates =
  Object.keys(groupedMatches).sort()
  useEffect(() => {

  if (
    availableDates.length > 0 &&
    !selectedDate
  ) {

    const today =
      new Date()
        .toLocaleDateString(
          "en-CA",
          {
            timeZone:
              "America/Chicago",
          }
        )

    if (
      availableDates.includes(today)
    ) {
      setSelectedDate(today)
    } else {
      setSelectedDate(
        availableDates[0]
      )
    }

  }

}, [
  availableDates,
  selectedDate,
])
useEffect(() => {

  if (
    !selectedDate ||
    !dateStripRef.current
  ) {
    return
  }

  const activeButton =
    dateStripRef.current.querySelector(
      "[data-active='true']"
    ) as HTMLElement | null

  if (!activeButton) return

  activeButton.scrollIntoView({
    behavior: "smooth",
    inline: "center",
    block: "nearest",
  })

}, [selectedDate])
if (matches.length > 0) {
  console.log(
    "STATUS:",
    matches[0].status
  )

  console.log(
    "SCORE:",
    matches[0].score
  )
}
  return (
    <main className="min-h-screen bg-[#f3f7ff] p-6 pb-24">
<UsernameModal />
      <div className="sticky top-0 z-40 -mx-6 mb-6 bg-[#f3f7ff] px-6 pt-4 pb-4">

  <h1 className="text-4xl font-bold text-[#102348]">
    MK's World Cup App
  </h1>

  
  {username ? (

  <p className="mt-2 text-[#6f7f9d]">
    {username}'s predictions and match picks
  </p>

) : (

  <p className="mt-2 text-[#6f7f9d]">
    Make your predictions for every match
  </p>

)}
<div className="mt-4">

  <div className="inline-flex items-center rounded-full bg-[#102348] px-5 py-3 text-sm font-bold text-white shadow-sm">
    {totalPoints} pts
  </div>
<div
  ref={dateStripRef}
  className="overflow-x-auto pb-2 scrollbar-hide"
>

  <div className="flex gap-3">

    {availableDates.map(
      (date) => (

        <button
  key={date}
  data-active={
    selectedDate === date
  }
          onClick={() =>
            setSelectedDate(date)
          }
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
            selectedDate === date
              ? "bg-[#102348] text-white"
              : "bg-white text-[#102348]"
          }`}
        >

          {new Date(
            date + "T12:00:00"
          ).toLocaleDateString(
            "en-US",
            {
              month: "short",
              day: "numeric",
            }
          )}

        </button>

      )
    )}

  </div>

</div>
</div>
</div>
      

      <div className="space-y-10">
       
        {liveMatches.length > 0 && (

  <div>

    <h2 className="mb-4 text-xl font-bold text-red-600">
      🔴 Live Now
    </h2>

    <div className="space-y-4">

      {liveMatches.map((match) => (

        <MatchCard
          key={`live-${match.id}`}
          home={match.homeTeam?.name || ""}
          away={match.awayTeam?.name || ""}
          group={match.group}
          stadium={match.stadium}
          status={
            match.status === "PAUSED"
              ? "HALFTIME"
              : "LIVE"
          }
          kickoff={match.utcDate}
          homeScore={match.score?.fullTime?.home}
          awayScore={match.score?.fullTime?.away}
          minute={match.minute}
        />

      ))}

    </div>

  </div>

)}

        {Object.entries(groupedMatches)
  .filter(
    ([date]) =>
      date === selectedDate
  )
  .map(
  ([date, matches]) => {

           /* const formattedDate =
              new Date(date).toLocaleDateString(
                "en-US",
                {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                }
              )*/
             const formattedDate =
  new Date(date + "T12:00:00")
    .toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        month: "long",
        day: "numeric",
      }
    )

            return (
              <div key={date}>

                <div className="mb-4">
                  <h2 className="text-xl font-bold text-[#102348]">
                    {formattedDate}
                  </h2>
                </div>

                <div className="space-y-4">

                  {matches.map((match) => (
                    <MatchCard
  key={match.id}
  home={match.homeTeam?.name || ""}
  away={match.awayTeam?.name || ""}
  group={match.group}
  stadium={match.stadium}

  status={
  match.status === "FINISHED"
    ? "FINAL"
    : match.status === "IN_PLAY"
    ? "LIVE"
    : match.status === "PAUSED"
    ? "HALFTIME"
    : "UPCOMING"
}

 kickoff={match.utcDate}

  homeScore={match.score?.fullTime?.home}
awayScore={match.score?.fullTime?.away}
minute={match.minute}
/>
                  ))}

                </div>

              </div>
            )
          }
        )}

      </div>

      <BottomNav />

    </main>
  )
}