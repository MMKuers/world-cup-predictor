"use client"
import { useState } from "react"
import { countryCodes } from "@/data/countryCodes"

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

  const storageKey =
    `${home}-${away}`

  const [prediction, setPrediction] =
    useState(() => {

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

  const kickoffDate =
    new Date(kickoff)

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
      onClick={() =>
        setExpanded(!expanded)
      }
      className="w-full cursor-pointer rounded-[28px] bg-[#dfe9ff] px-5 py-4 text-left shadow-sm transition duration-200 hover:-translate-y-[2px] hover:shadow-md active:scale-[0.99]"
    >

      <div className="flex items-start justify-between">

        <div className="flex-1">

          <div className="mb-5">
            <span className="rounded-full bg-[#edf3ff] px-3 py-1 text-xs font-semibold text-[#4f6ea8]">
              Group {group}
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

              <div className="text-[20px] font-semibold text-[#102348]">
                {home}
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

              <div className="text-[20px] font-semibold text-[#102348]">
                {away}
              </div>

            </div>

          </div>

        </div>

        <div className="ml-4 text-right">

          <div className="text-[11px] uppercase tracking-wide text-[#6f7f9d]">
            {formattedDate}
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
              onClick={(e) => {
                e.stopPropagation()

                setPrediction(home)

                localStorage.setItem(
                  storageKey,
                  home
                )
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
              onClick={(e) => {
                e.stopPropagation()

                setPrediction("Draw")

                localStorage.setItem(
                  storageKey,
                  "Draw"
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
              onClick={(e) => {
                e.stopPropagation()

                setPrediction(away)

                localStorage.setItem(
                  storageKey,
                  away
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
            <div className="mt-4 text-sm text-[#4564a8]">
              Your prediction:{" "}
              <span className="font-semibold">
                {prediction}
              </span>
            </div>
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