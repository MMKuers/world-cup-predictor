"use client"

import {
  useEffect,
  useRef,
  useState,
} from "react"
import MatchCard from "@/components/MatchCard"
import TeamDetailsSheet from "@/components/TeamDetailsSheet"
import UsaWinCelebration from "@/components/UsaWinCelebration"
import { CompetitionCode } from "@/components/competitions/config"

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

function getFollowKey(competitionCode: CompetitionCode) {
  return `followed-team-${competitionCode}`
}

function getStoredFollowedTeams(competitionCode: CompetitionCode) {
  if (typeof window === "undefined") {
    return []
  }

  const value = localStorage.getItem(
    getFollowKey(competitionCode)
  )

  if (!value) {
    return []
  }

  try {
    const teams = JSON.parse(value)
    return Array.isArray(teams)
      ? teams.filter(
          (team) =>
            typeof team === "string" &&
            team.trim()
        )
      : []
  } catch {
    return [value]
  }
}

type Props = {
  competitionCode: CompetitionCode
  competitionLabel: string
  allowPredictions: boolean
  showUsaCelebration?: boolean
  onMatchesLoaded?: (matches: any[]) => void
}

type SelectedTeam = {
  name: string
  logo?: string
}

export default function CompetitionMatchView({
  competitionCode,
  competitionLabel,
  allowPredictions,
  showUsaCelebration = false,
  onMatchesLoaded,
}: Props) {
  const [matches, setMatches] =
    useState<any[]>([])
  const [selectedDate, setSelectedDate] =
    useState("")
  const [selectedTeam, setSelectedTeam] =
    useState<SelectedTeam | null>(null)
  const [followedTeams, setFollowedTeams] =
    useState<string[]>([])
  const [isLoadingMatches, setIsLoadingMatches] =
    useState(false)
  const [matchLoadMessage, setMatchLoadMessage] =
    useState("")
  const dateStripRef =
    useRef<HTMLDivElement>(null)

  useEffect(() => {
    setFollowedTeams(
      getStoredFollowedTeams(competitionCode)
    )

    function handleFollowChange(event: Event) {
      const customEvent =
        event as CustomEvent<{
          competitionCode: CompetitionCode
          teams?: string[]
          team?: string
        }>

      if (
        customEvent.detail?.competitionCode !==
        competitionCode
      ) {
        return
      }

      setFollowedTeams(
        customEvent.detail.teams ||
          (customEvent.detail.team
            ? [customEvent.detail.team]
            : [])
      )
    }

    window.addEventListener(
      "followed-team-change",
      handleFollowChange
    )

    return () => {
      window.removeEventListener(
        "followed-team-change",
        handleFollowChange
      )
    }
  }, [competitionCode])

  useEffect(() => {

    async function loadMatches() {

      setIsLoadingMatches(true)
      setMatchLoadMessage("")

      try {
        const response =
          await fetch(
            `/api/football?competition=${competitionCode}`,
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
            `No ${competitionLabel} matches returned.`
          )
        }

        console.log("API RESPONSE:", data)
        console.log("API STATUS:", selectedMatches[0]?.status)
        console.log("API SCORE:", selectedMatches[0]?.score)

        setMatches(selectedMatches)
        setSelectedDate("")
        onMatchesLoaded?.(selectedMatches)

        const nullMatch = selectedMatches.find(
          (match: any) =>
            !match.homeTeam?.name ||
            !match.awayTeam?.name
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
            status: nullMatch?.status,
          }
        )
      } catch (error) {
        console.error(error)
        setMatches([])
        setSelectedDate("")
        setMatchLoadMessage(
          `Could not load ${competitionLabel} matches.`
        )
        onMatchesLoaded?.([])
      } finally {
        setIsLoadingMatches(false)
      }
    }

    loadMatches()

  }, [
    competitionCode,
    competitionLabel,
    onMatchesLoaded,
  ])

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

  const liveMatches =
    matches.filter(
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

      if (availableDates.includes(today)) {
        setSelectedDate(today)
      } else {
        setSelectedDate(
          availableDates[0]
        )
      }
    }

    if (
      selectedDate &&
      availableDates.length > 0 &&
      !availableDates.includes(selectedDate)
    ) {
      setSelectedDate(availableDates[0])
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

  const openTeamDetails = (
    name: string,
    logo?: string
  ) => {
    setSelectedTeam({ name, logo })
  }

  const renderMatchCard = (
    match: any,
    key: string
  ) => (
    <MatchCard
      key={key}
      home={match.homeTeam?.name || ""}
      away={match.awayTeam?.name || ""}
      group={
        competitionCode === "WC"
          ? match.group
          : competitionLabel
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
      homeLogo={match.homeTeam?.crest}
      awayLogo={match.awayTeam?.crest}
      isHomeFollowed={followedTeams.includes(
        match.homeTeam?.name
      )}
      isAwayFollowed={followedTeams.includes(
        match.awayTeam?.name
      )}
      onTeamClick={(team) =>
        openTeamDetails(
          team,
          team === match.homeTeam?.name
            ? match.homeTeam?.crest
            : match.awayTeam?.crest
        )
      }
    />
  )

  return (
    <>
      {showUsaCelebration && (
        <UsaWinCelebration matches={matches} />
      )}

      <div className="sticky top-[150px] z-30 -mx-3 mb-4 bg-[#eef3fb]/90 px-3 pb-3 pt-1 backdrop-blur">
        <div
          ref={dateStripRef}
          className="overflow-x-auto pb-0.5 scrollbar-hide"
        >
          <div className="flex gap-1.5">
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
                  className={`whitespace-nowrap rounded-xl px-3 py-1.5 text-[11px] font-black transition ${
                    selectedDate === date
                      ? "bg-[#102348] text-white shadow-sm"
                      : "bg-white/90 text-[#102348] ring-1 ring-[#dbe5f6]"
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

      <div className="space-y-5">
        {isLoadingMatches && (
          <div className="rounded-xl bg-white/95 p-4 text-sm font-bold text-[#6f7f9d] shadow-sm ring-1 ring-[#dbe5f6]">
            Loading {competitionLabel} matches...
          </div>
        )}

        {!isLoadingMatches && matches.length === 0 && (
          <div className="rounded-xl bg-white/95 p-4 shadow-sm ring-1 ring-[#dbe5f6]">
            <div className="text-sm font-black text-[#102348]">
              No matches showing
            </div>

            <div className="mt-1 text-xs font-semibold text-[#6f7f9d]">
              {matchLoadMessage ||
                `No ${competitionLabel} matches are available right now.`}
            </div>
          </div>
        )}

        {!isLoadingMatches && liveMatches.length > 0 && (
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#e11d48]" />
              <h2 className="text-sm font-black uppercase text-[#e11d48]">
                Live Now
              </h2>
            </div>

            <div className="space-y-2.5">
              {liveMatches.map((match) =>
                renderMatchCard(
                  match,
                  `live-${match.id}`
                )
              )}
            </div>
          </div>
        )}

        {!isLoadingMatches && Object.entries(groupedMatches)
          .filter(
            ([date]) =>
              date === selectedDate
          )
          .map(([date, dateMatches]) => {
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
                <div className="mb-2 flex items-end justify-between border-b border-[#dbe5f6] pb-2">
                  <h2 className="text-sm font-black uppercase text-[#102348]">
                    {formattedDate}
                  </h2>

                  <span className="text-[10px] font-black uppercase text-[#71809a]">
                    {dateMatches.length} matches
                  </span>
                </div>

                <div className="space-y-2.5">
                  {dateMatches.map((match) =>
                    renderMatchCard(
                      match,
                      String(match.id)
                    )
                  )}
                </div>
              </div>
            )
          })}
      </div>

      {selectedTeam && (
        <TeamDetailsSheet
          team={selectedTeam.name}
          teamLogo={selectedTeam.logo}
          matches={matches}
          competitionCode={competitionCode}
          competitionLabel={competitionLabel}
          onClose={() =>
            setSelectedTeam(null)
          }
        />
      )}
    </>
  )
}
