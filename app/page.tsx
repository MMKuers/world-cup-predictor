"use client"

import MatchCard from "@/components/MatchCard"
import TeamDetailsSheet from "@/components/TeamDetailsSheet"
import BottomNav from "@/components/BottomNav"
import UsaWinCelebration from "@/components/UsaWinCelebration"
import { supabase } from "@/lib/supabase"
import UsernameModal from "@/components/UsernameModal"
import { calculateStandings } from "@/lib/calculateStandings"
import {
  buildLeaderboard,
  buildUsersById,
  getCurrentPlayerKey,
} from "@/lib/predictionScoring"
import {
  useState,
  useEffect,
  useRef,
} from "react"

const competitions = [
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

function scoreValue(value: any) {
  return typeof value === "number"
    ? value
    : null
}

function hasHalfTimeScore(match: any) {
  return (
    scoreValue(match.score?.halfTime?.home) !== null ||
    scoreValue(match.score?.halfTime?.away) !== null ||
    scoreValue(match.score?.halfTime?.homeTeam) !== null ||
    scoreValue(match.score?.halfTime?.awayTeam) !== null
  )
}

function getLivePhase(match: any) {
  if (match.status === "PAUSED") {
    return "HT"
  }

  if (typeof match.minute === "number") {
    return match.minute > 45
      ? "2nd Half"
      : "1st Half"
  }

  return hasHalfTimeScore(match)
    ? "2nd Half"
    : "1st Half"
}

export default function HomePage() {
 const [username, setUsername] =
  useState("")

const [totalPoints, setTotalPoints] =
  useState(0)
const [matches, setMatches] = useState<any[]>([])
const [selectedDate, setSelectedDate] =
  useState("")
const [selectedTeam, setSelectedTeam] =
  useState("")
const [selectedCompetition, setSelectedCompetition] =
  useState("WC")
const [isLoadingMatches, setIsLoadingMatches] =
  useState(false)
const [matchLoadMessage, setMatchLoadMessage] =
  useState("")
  const dateStripRef =
  useRef<HTMLDivElement>(null)

const currentCompetition =
  competitions.find(
    (competition) =>
      competition.code === selectedCompetition
  ) || competitions[0]

const allowPredictions =
  selectedCompetition === "WC"

useEffect(() => {
  setUsername(
    localStorage.getItem("wc-user") || ""
  )
}, [])
useEffect(() => {

  async function loadMatches() {

    setIsLoadingMatches(true)
    setMatchLoadMessage("")

    try {
      const response =
        await fetch(
          `/api/football?competition=${selectedCompetition}`,
          { cache: "no-store" }
        )

      const data =
        await response.json()

      const selectedMatches =
        Array.isArray(data.matches)
          ? data.matches
          : []

      if (selectedMatches.length === 0) {
        setMatchLoadMessage(
          data.message ||
          data.error ||
          `No ${currentCompetition.label} matches returned.`
        )
      }

      console.log("API RESPONSE:", data)
      console.log("API STATUS:", selectedMatches[0]?.status)
console.log("API SCORE:", selectedMatches[0]?.score)

setMatches(selectedMatches)
setSelectedDate("")

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

    const scoreMatches =
      selectedCompetition === "WC"
        ? selectedMatches
        : await fetch(
            "/api/football?competition=WC",
            { cache: "no-store" }
          )
            .then((worldCupResponse) =>
              worldCupResponse.json()
            )
            .then((worldCupData) =>
              worldCupData.matches || []
            )

    const leaderboard =
      buildLeaderboard(
        predictions || [],
        scoreMatches,
        usersById,
        userId,
        currentUsername
      )

    const currentPlayer =
      leaderboard.find(
        (player) =>
          player.you ||
          player.id === playerKey
      )

    setTotalPoints(
      currentPlayer?.points || 0
    )
  }

}
const nullMatch = selectedMatches.find(
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
    } catch (error) {
      console.error(error)
      setMatches([])
      setSelectedDate("")
      setMatchLoadMessage(
        `Could not load ${currentCompetition.label} matches.`
      )
    } finally {
      setIsLoadingMatches(false)
    }
  }

  loadMatches()

}, [selectedCompetition, currentCompetition.label])


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
    <main className="min-h-screen bg-[#f3f7ff] p-4 pb-20">
<UsernameModal />
<UsaWinCelebration matches={matches} />
      <div className="sticky top-0 z-40 -mx-4 mb-4 bg-[#f3f7ff]/95 px-4 pt-3 pb-3 backdrop-blur">

  <div className="flex items-start justify-between gap-3">
    <div className="min-w-0">
      <h1 className="text-2xl font-bold text-[#102348]">
        MK's World Cup App
      </h1>

      {username ? (

      <p className="mt-1 truncate text-sm text-[#6f7f9d]">
        {username}'s predictions and match picks
      </p>

    ) : (

      <p className="mt-1 text-sm text-[#6f7f9d]">
        Make your predictions for every match
      </p>

    )}
    </div>

    {allowPredictions && (
      <div className="mt-1 flex-shrink-0 rounded-full bg-[#102348] px-3 py-2 text-xs font-bold text-white shadow-sm">
        {totalPoints} pts
      </div>
    )}
  </div>

<div className="mt-3">
  <div className="overflow-x-auto pb-1 scrollbar-hide">
    <div className="flex gap-2">
      {competitions.map((competition) => (
        <button
          key={competition.code}
          type="button"
          onClick={() =>
            setSelectedCompetition(competition.code)
          }
          className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold transition active:scale-95 ${
            selectedCompetition === competition.code
              ? "bg-[#102348] text-white"
              : "bg-white text-[#102348] ring-1 ring-[#dbe5f6]"
          }`}
        >
          {competition.label}
        </button>
      ))}
    </div>
  </div>
</div>

<div className="mt-3">
<div
  ref={dateStripRef}
  className="overflow-x-auto pb-1 scrollbar-hide"
>

  <div className="flex gap-2">

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
          className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            selectedDate === date
              ? "bg-[#102348] text-white"
              : "bg-white text-[#102348] ring-1 ring-[#dbe5f6]"
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
      

      <div className="space-y-6">

        {isLoadingMatches && (
          <div className="rounded-2xl bg-white p-4 text-sm font-semibold text-[#6f7f9d] shadow-sm ring-1 ring-[#dbe5f6]">
            Loading {currentCompetition.label} matches...
          </div>
        )}

        {!isLoadingMatches && matches.length === 0 && (
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#dbe5f6]">
            <div className="text-sm font-bold text-[#102348]">
              No matches showing
            </div>

            <div className="mt-1 text-xs font-semibold text-[#6f7f9d]">
              {matchLoadMessage ||
                `No ${currentCompetition.label} matches are available right now.`}
            </div>
          </div>
        )}
       
        {!isLoadingMatches && liveMatches.length > 0 && (

  <div>

    <h2 className="mb-3 text-lg font-bold text-red-600">
      Live Now
    </h2>

    <div className="space-y-3">

      {liveMatches.map((match) => (

        <MatchCard
          key={`live-${match.id}`}
          home={match.homeTeam?.name || ""}
          away={match.awayTeam?.name || ""}
          group={
            selectedCompetition === "WC"
              ? match.group
              : currentCompetition.label
          }
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
          livePhase={getLivePhase(match)}
          allowPredictions={allowPredictions}
          onTeamClick={setSelectedTeam}
        />

      ))}

    </div>

  </div>

)}

        {!isLoadingMatches && Object.entries(groupedMatches)
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

                <div className="mb-3">
                  <h2 className="text-lg font-bold text-[#102348]">
                    {formattedDate}
                  </h2>
                </div>

                <div className="space-y-3">

                  {matches.map((match) => (
                    <MatchCard
  key={match.id}
  home={match.homeTeam?.name || ""}
  away={match.awayTeam?.name || ""}
  group={
    selectedCompetition === "WC"
      ? match.group
      : currentCompetition.label
  }
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
livePhase={
  match.status === "IN_PLAY" ||
  match.status === "PAUSED"
    ? getLivePhase(match)
    : undefined
}
allowPredictions={allowPredictions}
onTeamClick={setSelectedTeam}
/>
                  ))}

                </div>

              </div>
            )
          }
        )}

      </div>

      {selectedTeam && (
        <TeamDetailsSheet
          team={selectedTeam}
          matches={matches}
          onClose={() =>
            setSelectedTeam("")
          }
        />
      )}

      <BottomNav hidePicks={!allowPredictions} />

    </main>
  )
}