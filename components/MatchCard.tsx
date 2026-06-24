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
  isHomeFollowed?: boolean
  isAwayFollowed?: boolean
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
  isHomeFollowed = false,
  isAwayFollowed = false,
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
      ? "text-[#e11d48]"
      : status === "HALFTIME"
      ? "text-[#c2410c]"
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
      className={`w-full overflow-hidden rounded-xl border border-[#dbe5f6] bg-white/95 text-left shadow-[0_8px_22px_rgba(16,35,72,0.08)] transition duration-200 hover:-translate-y-[1px] hover:shadow-[0_14px_30px_rgba(16,35,72,0.12)] active:scale-[0.995] ${
        allowPredictions
          ? "cursor-pointer"
          : "cursor-default"
      }`}
    >
      <div className="flex items-center justify-between gap-2 border-b border-[#edf3ff] bg-gradient-to-r from-[#f8fbff] to-white px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          {contextLabel && (
            <span className="truncate rounded-full bg-[#102348] px-2 py-0.5 text-[10px] font-black uppercase text-white">
              {contextLabel}
            </span>
          )}
        </div>

        <div className="flex flex-shrink-0 items-center gap-1.5 text-[10px] font-black uppercase text-[#71809a]">
          <span>{formattedTime}</span>
          <span className="text-[#c5d1e4]">/</span>
          <span
            className={`rounded-full px-2 py-0.5 ${
              status === "LIVE"
                ? "bg-[#ffe4e6] text-[#e11d48]"
                : status === "HALFTIME"
                ? "bg-orange-100 text-orange-700"
                : status === "FINAL"
                ? "bg-green-100 text-green-700"
                : "bg-[#edf3ff] text-[#4564a8]"
            }`}
          >
            {status === "LIVE" && "● "}
            {statusLabel}
          </span>
        </div>
      </div>

      <div className="px-3 py-2.5">
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#f3f7ff] ring-1 ring-[#e6edf8]">
              {homeLogo ? (
                <img
                  src={homeLogo}
                  alt={home}
                  className="h-5 w-5 object-contain"
                />
              ) : homeCode && (
                <img
                  src={`https://flagcdn.com/w40/${homeCode}.png`}
                  alt={home}
                  className="h-5 w-5 rounded-full object-cover"
                />
              )}
            </div>

            <div className="flex min-w-0 flex-1 items-center justify-between">
              <button
                type="button"
                onClick={(event) =>
                  openTeamDetails(home, event)
                }
                className="flex w-fit max-w-full items-center gap-1.5 truncate text-left text-sm font-black text-[#102348] underline-offset-4 hover:underline focus:outline-none focus:underline"
              >
                <span className="truncate">{home}</span>
                {isHomeFollowed && (
                  <span className="flex-shrink-0 text-xs text-[#f59e0b]">
                    ★
                  </span>
                )}
              </button>

              {showScore && (
                <div
                  className={`ml-2 flex h-7 min-w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#f5f8fe] px-2 text-lg font-black ${scoreClass}`}
                >
                  {homeScore}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#f3f7ff] ring-1 ring-[#e6edf8]">
              {awayLogo ? (
                <img
                  src={awayLogo}
                  alt={away}
                  className="h-5 w-5 object-contain"
                />
              ) : awayCode && (
                <img
                  src={`https://flagcdn.com/w40/${awayCode}.png`}
                  alt={away}
                  className="h-5 w-5 rounded-full object-cover"
                />
              )}
            </div>

            <div className="flex min-w-0 flex-1 items-center justify-between">
              <button
                type="button"
                onClick={(event) =>
                  openTeamDetails(away, event)
                }
                className="flex w-fit max-w-full items-center gap-1.5 truncate text-left text-sm font-black text-[#102348] underline-offset-4 hover:underline focus:outline-none focus:underline"
              >
                <span className="truncate">{away}</span>
                {isAwayFollowed && (
                  <span className="flex-shrink-0 text-xs text-[#f59e0b]">
                    ★
                  </span>
                )}
              </button>

              {showScore && (
                <div
                  className={`ml-2 flex h-7 min-w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#f5f8fe] px-2 text-lg font-black ${scoreClass}`}
                >
                  {awayScore}
                </div>
              )}
            </div>
          </div>
        </div>

        {stadium && (
          <div className="mt-2 truncate text-[11px] font-semibold text-[#71809a]">
            {stadium}
          </div>
        )}
      </div>

      {allowPredictions && expanded && (
        <div className="border-t border-[#edf3ff] bg-[#f8fbff] px-3 py-3 animate-in fade-in duration-300">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[11px] font-black uppercase text-[#71809a]">
              Predict Winner
            </div>

            {prediction && (
              <div className="rounded-full bg-white px-2.5 py-1 text-[11px] font-black text-[#102348] ring-1 ring-[#dbe5f6]">
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
                  className={`rounded-lg px-3 py-2 text-xs font-black transition ${
                    isLocked && !isSelected
                      ? "cursor-not-allowed opacity-40 grayscale"
                      : ""
                  } ${
                    isSelected
                      ? isLocked
                        ? "bg-[#4b5563] text-white"
                        : "bg-[#102348] text-white"
                      : "bg-white text-[#102348] ring-1 ring-[#dbe5f6]"
                  }`}
                >
                  {option}
                </button>
              )
            })}
          </div>

          {prediction && (
            <>
              <div className="mt-3 text-xs font-semibold text-[#4564a8]">
                Your prediction:{" "}
                <span className="font-black">
                  {prediction}
                </span>
              </div>

              <div className="mt-4 rounded-xl bg-white p-3 ring-1 ring-[#edf3ff]">
                <div className="mb-3 text-[11px] font-black uppercase text-[#102348]">
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
                            <span className="font-bold text-[#102348]">
                              {option}
                            </span>

                            <span className="font-semibold text-[#4564a8]">
                              {picks.length} picks
                            </span>
                          </div>

                          <div className="h-1.5 overflow-hidden rounded-full bg-[#edf3ff]">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#102348] to-[#e11d48]"
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
                      className="mt-1 text-xs font-black text-[#4564a8]"
                    >
                      {showCommunityDetails
                        ? "Hide Individual Picks"
                        : "View Individual Picks"}
                    </button>

                    {showCommunityDetails && (
                      <div className="mt-3 border-t border-[#edf3ff] pt-3">
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
                              className="mb-3"
                            >
                              <div className="mb-1 text-sm font-black text-[#102348]">
                                {option}
                              </div>

                              <div className="space-y-1">
                                {picks.map(
                                  (pick) => (
                                    <div
                                      key={pick.id}
                                      className="text-xs text-[#4564a8]"
                                    >
                                      - {pick.username}
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
            <div className="mt-2 text-xs font-bold text-[#e11d48]">
              Predictions locked
            </div>
          )}
        </div>
      )}
    </div>
  )
}
