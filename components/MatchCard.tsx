"use client"
import { useEffect, useState } from "react"
import { countryCodes } from "@/data/countryCodes"
import { supabase } from "@/lib/supabase"

type Props = {
  home: string
  away: string
  group: string
  stadium: string

  status: string
  kickoff: string

  homeScore: number | null
  awayScore: number | null
}

export default function MatchCard({
  home,
  away,
  group,
  stadium,
  status,
  kickoff,
  homeScore,
  awayScore,
}: Props) {
 

  const homeCode =
  countryCodes[home.trim()]

const awayCode =
  countryCodes[away.trim()]

 const [expanded, setExpanded] =
  useState(false)

  const [showCommunityDetails, setShowCommunityDetails] =
  useState(false)

const storageKey =
  `${home}-${away}`

const [prediction, setPrediction] =
  useState(() => {
console.log(
  "LOCAL PREDICTION:",
  storageKey,
  localStorage.getItem(storageKey)
)
    if (
      typeof window !== "undefined"
    ) {
      return (
        localStorage.getItem(
          storageKey
        ) || ""
      )
    }

    return ""
  })

const [allPredictions, setAllPredictions] =
  useState<any[]>([])

useEffect(() => {

  async function loadPredictions() {

    const { data, error } =
      await supabase
        .from("predictions")
        .select("*")
        .eq("match_key", storageKey)

   if (error) {
  console.error(error)
  return
}

console.log(
  "MATCH PREDICTIONS:",
  storageKey,
  data
)

setAllPredictions(data || [])

  }

  loadPredictions()

}, [storageKey])

const kickoffDate =
  new Date(kickoff)
    useEffect(() => {

  async function loadPredictions() {

    const { data, error } =
      await supabase
        .from("predictions")
        .select("username,prediction")
        .eq("match_key", storageKey)

    if (error) {
      console.error(error)
      return
    }

    setAllPredictions(data || [])

  }

  loadPredictions()

}, [storageKey])

  const isLocked =
    new Date() > kickoffDate

  const formattedDate = new Date(
    kickoff
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })

  const formattedTime = new Date(
    kickoff
  ).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })

  return (
    <div
  onClick={() => {
  setExpanded(!expanded)
}}
  className="w-full cursor-pointer rounded-[28px] bg-[#dfe9ff] px-5 py-4 text-left shadow-sm transition duration-200 hover:-translate-y-[2px] hover:shadow-md active:scale-[0.99]"
>

      <div className="flex items-start justify-between">

        <div className="flex-1">

          <div className="mb-5">
            <span className="rounded-full bg-[#edf3ff] px-3 py-1 text-xs font-semibold text-[#4f6ea8]">
              Group {group?.replace("GROUP_", "") ?? ""}
            </span>
          </div>

          <div className="space-y-5">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm">
               {homeCode && (
  
 
  <img
    src={`https://flagcdn.com/w40/${homeCode}.png`}
    alt={home}
    className="h-8 w-8 rounded-full object-cover shadow-sm"
  />
)}
              </div>

              <div className="flex w-full items-center justify-between">

  <div className="text-[20px] font-semibold text-[#102348]">
    {home}
  </div>

  {status === "FINAL" && (
  <div className="w-8 text-right text-3xl font-bold text-[#102348]">
    {homeScore}
  </div>
)}

</div>

            </div>

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm">
                {awayCode && (
                  <img
                    src={`https://flagcdn.com/w40/${awayCode}.png`}
                    alt={away}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                )}
              </div>

              <div className="flex w-full items-center justify-between">

  <div className="text-[20px] font-semibold text-[#102348]">
    {away}
  </div>

  {status === "FINAL" && (
  <div className="w-8 text-right text-3xl font-bold text-[#102348]">
    {awayScore}
  </div>
)}

</div>

            </div>

          </div>

        </div>

        <div className="ml-4 text-right">

          <div className="text-[11px] uppercase tracking-wide text-[#6f7f9d]">
  {stadium}
</div>

          <div className="mt-1 text-[22px] font-bold leading-none text-[#102348]">
            {formattedTime}
          </div>

          <div className="mt-2 text-[12px] text-[#6f7f9d]">
            {stadium}
          </div>

        <div
  className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
    status === "LIVE"
      ? "bg-red-100 text-red-600"
      : status === "FINAL"
      ? "bg-green-100 text-green-600"
      : "bg-white text-[#4564a8]"
  }`}
>

  {status === "LIVE" && (
    <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
  )}

  {status}

</div>

        </div>

      </div>

      {expanded && (

<div className="mt-6 border-t border-[#cad7f2] pt-5 animate-in fade-in duration-300">
          <div className="mb-3 text-sm font-semibold text-[#5c6b8a]">
            Predict Winner
          </div>
          <div className="mb-4 flex items-center justify-between">

  <div className="text-xs font-medium text-[#6f7f9d]">
    {isLocked
      ? "Predictions Closed"
      : "Predictions Open"}
  </div>

  {prediction && (
    <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#102348]">
      Picked: {prediction}
    </div>
  )}

</div>

          <div className="grid grid-cols-3 gap-2">

            <button
              disabled={isLocked}
             onClick={async (e) => {

  e.stopPropagation()

  setPrediction(home)

  localStorage.setItem(
    storageKey,
    home
  )

  console.log("STARTING INSERT")

  const { data, error } =
    await supabase
  .from("predictions")
  .upsert(
    {
  user_id:
    localStorage.getItem("user-id"),

  username:
    localStorage.getItem("wc-user"),

  match_key: storageKey,
  prediction: home,
  points: 0,
},
    {
      onConflict: "user_id,match_key",
    }
  )

  console.log("SUPABASE DATA:", data)
  console.log("SUPABASE ERROR:", error)

}}
              
              className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                isLocked
                  ? "cursor-not-allowed opacity-40 grayscale"
                  : ""
              } ${
                prediction === home
                  ? "bg-[#102348] text-white"
                  : "bg-white text-[#102348]"
              }`}
            >
              {home}
            </button>

            <button
              disabled={isLocked}
              onClick={async (e) => {
  e.stopPropagation()

  setPrediction("Draw")

  localStorage.setItem(
    storageKey,
    "Draw"
  )

  await supabase
    .from("predictions")
    .upsert(
      {
  user_id:
    localStorage.getItem("user-id"),

  username:
    localStorage.getItem("wc-user"),

  match_key: storageKey,
  prediction: "Draw",
  points: 0,
},
      {
        onConflict: "user_id,match_key",
      }
    )
}}
              className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                isLocked
                  ? "cursor-not-allowed opacity-40 grayscale"
                  : ""
              } ${
                prediction === "Draw"
                  ? "bg-[#102348] text-white"
                  : "bg-white text-[#102348]"
              }`}
            >
              Draw
            </button>

            <button
              disabled={isLocked}
              onClick={async (e) => {
  e.stopPropagation()

  setPrediction(away)

  localStorage.setItem(
    storageKey,
    away
  )

  await supabase
    .from("predictions")
    .upsert(
      {
  user_id:
    localStorage.getItem("user-id"),

  username:
    localStorage.getItem("wc-user"),

  match_key: storageKey,
  prediction: away,
  points: 0,
},
      {
        onConflict: "user_id,match_key",
      }
    )
}}
              className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                isLocked
                  ? "cursor-not-allowed opacity-50"
                  : ""
              } ${
                prediction === away
                  ? "bg-[#102348] text-white"
                  : "bg-white text-[#102348]"
              }`}
            >
              {away}
            </button>

          </div>

          {prediction && (
  <>
    <div className="mt-4 text-sm text-[#4564a8]">
      Your prediction:{" "}
      <span className="font-semibold">
        {prediction}
      </span>
    </div>

   <div className="mt-4 rounded-2xl bg-white p-4">

  <div className="mb-4 text-sm font-bold text-[#102348]">
    Community Picks
  </div>

  {allPredictions.length === 0 ? (

    <div className="text-sm text-gray-500">
      No predictions yet
    </div>

  ) : (

    <>
      {[
        home,
        "Draw",
        away,
      ].map((option) => {

        const picks =
          allPredictions.filter(
            (p) =>
              p.prediction === option
          )

        const percentage =
          Math.round(
            (picks.length /
              allPredictions.length) *
              100
          )

        return (

          <div
            key={option}
            className="mb-3"
          >

            <div className="mb-1 flex justify-between text-sm">

              <span className="font-medium text-[#102348]">
                {option}
              </span>

              <span className="text-[#4564a8]">
                {picks.length} picks
              </span>

            </div>

            <div className="h-2 overflow-hidden rounded-full bg-[#edf3ff]">

              <div
                className="h-full rounded-full bg-[#102348]"
                style={{
                  width: `${percentage}%`,
                }}
              />

            </div>

          </div>

        )

      })}

      <button
        onClick={(e) => {
          e.stopPropagation()
          setShowCommunityDetails(
            !showCommunityDetails
          )
        }}
        className="mt-2 text-sm font-semibold text-[#4564a8]"
      >
        {showCommunityDetails
          ? "Hide Individual Picks"
          : "View Individual Picks"}
      </button>

      {showCommunityDetails && (

        <div className="mt-4 border-t border-[#edf3ff] pt-4">

          {[
            home,
            "Draw",
            away,
          ].map((option) => {

            const picks =
              allPredictions.filter(
                (p) =>
                  p.prediction === option
              )

            if (
              picks.length === 0
            ) {
              return null
            }

            return (

              <div
                key={option}
                className="mb-4"
              >

                <div className="mb-2 font-semibold text-[#102348]">
                  {option}
                </div>

                <div className="space-y-1">

                  {picks.map(
                    (pick) => (

                      <div
                        key={pick.id}
                        className="text-sm text-[#4564a8]"
                      >
                        • {pick.username}
                      </div>

                    )
                  )}

                </div>

              </div>

            )

          })}

        </div>

      )}

    </>

  )}

</div>
  </>
)}

          {isLocked && (
            <div className="mt-2 text-xs font-medium text-red-500">
              Predictions locked
            </div>
          )}

        </div>

      )}

    </div>
  )
}