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

  minute?: number
  livePhase?: string
  allowPredictions?: boolean
  homeLogo?: string
  awayLogo?: string
  onTeamClick?: (team: string) => void
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
  minute,
  livePhase,
  allowPredictions = true,
  homeLogo,
  awayLogo,
  onTeamClick,
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

    if (!allowPredictions) {
      setAllPredictions([])
      return
    }

    async function loadPredictions() {

      const { data, error } =
        await supabase
          .from("predictions")
          .select("id,user_id,username,prediction")
          .eq("match_key", storageKey)

      if (error) {
        console.error(error)
        return
      }

      setAllPredictions(data || [])

      const currentUserId =
        localStorage.getItem("user-id")

      const currentPrediction =
        data?.find(
          (pick) =>
            pick.user_id === currentUserId
        )

      if (currentPrediction?.prediction) {
        setPrediction(
          currentPrediction.prediction
        )

        localStorage.setItem(
          storageKey,
          currentPrediction.prediction
        )
      }

    }

    loadPredictions()

  }, [storageKey, allowPredictions])

  const kickoffDate =
    new Date(kickoff)

  const isLocked =
    new Date() > kickoffDate

  const formattedTime = new Date(
    kickoff
  ).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })

  const savePrediction = async (
    value: string
  ) => {
    if (!allowPredictions) {
      return
    }

    setPrediction(value)

    localStorage.setItem(
      storageKey,
      value
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
          prediction: value,
          points: 0,
        },
        {
          onConflict: "user_id,match_key",
        }
      )
  }

  const statusLabel =
    status === "LIVE"
      ? minute
        ? `${minute}'`
        : livePhase || "LIVE"
      : status === "HALFTIME"
      ? "HT"
      : status

  const contextLabel =
    group?.startsWith("GROUP_")
      ? `Group ${group.replace("GROUP_", "")}`
      : group

  const showScore =
    status === "FINAL" ||
    status === "LIVE" ||
    status === "HALFTIME"

  const scoreClass =
    status === "LIVE"
      ? "text-red-600"
      : status === "HALFTIME"
      ? "text-orange-600"
      : "text-[#102348]"

  const openTeamDetails = (
    team: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation()

    if (!team || !onTeamClick) {
      return
    }

    onTeamClick(team)
  }

  return (
    <div
      onClick={() => {
        if (allowPredictions) {
          setExpanded(!expanded)
        }
      }}
      className={`w-full rounded-2xl bg-white px-4 py-3 text-left shadow-sm ring-1 ring-[#dbe5f6] transition duration-200 hover:-translate-y-[1px] hover:shadow-md active:scale-[0.995] ${
        allowPredictions
          ? "cursor-pointer"
          : "cursor-default"
      }`}
    >
      <div className="flex items-start justify-between gap-3">

        <div className="min-w-0 flex-1">

          {contextLabel && (
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full bg-[#edf3ff] px-2.5 py-1 text-[11px] font-semibold text-[#4f6ea8]">
                {contextLabel}
              </span>
            </div>
          )}

          <div className="space-y-3">

            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#f3f7ff]">
                {homeLogo ? (
                  <img
                    src={homeLogo}
                    alt={home}
                    className="h-6 w-6 object-contain"
                  />
                ) : homeCode && (
                  <img
                    src={`https://flagcdn.com/w40/${homeCode}.png`}
                    alt={home}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                )}
              </div>

              <div className="flex min-w-0 flex-1 items-center justify-between">
                <button
                  type="button"
                  onClick={(event) =>
                    openTeamDetails(home, event)
                  }
                  className="w-fit max-w-full truncate text-left text-base font-semibold text-[#102348] underline-offset-4 hover:underline focus:outline-none focus:underline"
                >
                  {home}
                </button>

                {showScore && (
                  <div
                    className={`ml-2 w-8 flex-shrink-0 text-right text-xl font-bold ${scoreClass}`}
                  >
                    {homeScore}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#f3f7ff]">
                {awayLogo ? (
                  <img
                    src={awayLogo}
                    alt={away}
                    className="h-6 w-6 object-contain"
                  />
                ) : awayCode && (
                  <img
                    src={`https://flagcdn.com/w40/${awayCode}.png`}
                    alt={away}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                )}
              </div>

              <div className="flex min-w-0 flex-1 items-center justify-between">
                <button
                  type="button"
                  onClick={(event) =>
                    openTeamDetails(away, event)
                  }
                  className="w-fit max-w-full truncate text-left text-base font-semibold text-[#102348] underline-offset-4 hover:underline focus:outline-none focus:underline"
                >
                  {away}
                </button>

                {showScore && (
                  <div
                    className={`ml-2 w-8 flex-shrink-0 text-right text-xl font-bold ${scoreClass}`}
                  >
                    {awayScore}
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        <div className="w-[76px] flex-shrink-0 text-right">
          <div className="whitespace-nowrap text-base font-bold leading-none text-[#102348]">
            {formattedTime}
          </div>

          <div className="mt-1.5 truncate text-[11px] text-[#6f7f9d]">
            {stadium}
          </div>

          <div
            className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              status === "LIVE"
                ? "bg-red-100 text-red-600"
                : status === "HALFTIME"
                ? "bg-orange-100 text-orange-600"
                : status === "FINAL"
                ? "bg-green-100 text-green-600"
                : "bg-[#edf3ff] text-[#4564a8]"
            }`}
          >
            {status === "LIVE" && (
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
            )}

            {statusLabel}
          </div>
        </div>

      </div>

      {allowPredictions && expanded && (
        <div className="mt-4 border-t border-[#edf3ff] pt-4 animate-in fade-in duration-300">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-xs font-semibold uppercase text-[#6f7f9d]">
              Predict Winner
            </div>

            {prediction && (
              <div className="rounded-full bg-[#edf3ff] px-2.5 py-1 text-[11px] font-semibold text-[#102348]">
                Picked: {prediction}
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              home,
              "Draw",
              away,
            ].map((option) => {
              const isSelected =
                prediction === option

              return (
                <button
                  key={option}
                  disabled={isLocked}
                  onClick={async (e) => {
                    e.stopPropagation()
                    await savePrediction(option)
                  }}
                  className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                    isLocked && !isSelected
                      ? "cursor-not-allowed opacity-40 grayscale"
                      : ""
                  } ${
                    isSelected
                      ? isLocked
                        ? "bg-[#4b5563] text-white"
                        : "bg-[#102348] text-white"
                      : "bg-[#edf3ff] text-[#102348]"
                  }`}
                >
                  {option}
                </button>
              )
            })}
          </div>

          {prediction && (
            <>
              <div className="mt-3 text-xs text-[#4564a8]">
                Your prediction:{" "}
                <span className="font-semibold">
                  {prediction}
                </span>
              </div>

              <div className="mt-4 rounded-xl bg-[#f8fbff] p-3 ring-1 ring-[#edf3ff]">
                <div className="mb-3 text-xs font-bold uppercase text-[#102348]">
                  Community Picks
                </div>

                {allPredictions.length === 0 ? (
                  <div className="text-xs text-gray-500">
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
                          <div className="mb-1 flex justify-between text-xs">