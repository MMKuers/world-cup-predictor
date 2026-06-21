"use client"

import type { CSSProperties } from "react"
import { useEffect, useState } from "react"

type Props = {
  matches: any[]
}

type UsaWin = {
  id: string
  opponent: string
  score: string
}

const confettiColors = [
  "#d72638",
  "#ffffff",
  "#1f4fa3",
]

function isUsaTeam(name: string) {
  const normalized = name
    .trim()
    .toLowerCase()

  return (
    normalized === "usa" ||
    normalized === "united states" ||
    normalized === "united states of america" ||
    normalized.includes("united states")
  )
}

function chicagoDateKey(date: Date) {
  return date.toLocaleDateString("en-CA", {
    timeZone: "America/Chicago",
  })
}

function dayNumber(dateKey: string) {
  return new Date(`${dateKey}T12:00:00`).getTime()
}

function getScore(match: any) {
  return {
    home:
      match.score?.fullTime?.home ??
      match.score?.regularTime?.home ??
      null,
    away:
      match.score?.fullTime?.away ??
      match.score?.regularTime?.away ??
      null,
  }
}

function getUsaWin(matches: any[]): UsaWin | null {
  const todayKey = chicagoDateKey(new Date())

  const usaWins = matches
    .filter((match) => {
      if (match.status !== "FINISHED") {
        return false
      }

      const home = match.homeTeam?.name || ""
      const away = match.awayTeam?.name || ""
      const usaIsHome = isUsaTeam(home)
      const usaIsAway = isUsaTeam(away)

      if (!usaIsHome && !usaIsAway) {
        return false
      }

      const matchDayKey = chicagoDateKey(
        new Date(match.utcDate)
      )

      const dayDiff = Math.round(
        (dayNumber(todayKey) - dayNumber(matchDayKey)) /
          86400000
      )

      if (dayDiff < 0 || dayDiff > 1) {
        return false
      }

      return (
        (usaIsHome && match.score?.winner === "HOME_TEAM") ||
        (usaIsAway && match.score?.winner === "AWAY_TEAM")
      )
    })
    .sort(
      (a, b) =>
        new Date(b.utcDate).getTime() -
        new Date(a.utcDate).getTime()
    )

  const match = usaWins[0]

  if (!match) {
    return null
  }

  const home = match.homeTeam?.name || ""
  const away = match.awayTeam?.name || ""
  const usaIsHome = isUsaTeam(home)
  const opponent = usaIsHome ? away : home
  const score = getScore(match)
  const usaScore = usaIsHome
    ? score.home
    : score.away
  const opponentScore = usaIsHome
    ? score.away
    : score.home

  return {
    id: String(match.id),
    opponent,
    score:
      usaScore !== null && opponentScore !== null
        ? `${usaScore}-${opponentScore}`
        : "",
  }
}

export default function UsaWinCelebration({
  matches,
}: Props) {
  const [usaWin, setUsaWin] =
    useState<UsaWin | null>(null)

  useEffect(() => {
    if (matches.length === 0) {
      return
    }

    const win = getUsaWin(matches)

    if (!win) {
      return
    }

    const storageKey =
      `usa-win-celebration-${win.id}`

    if (
      localStorage.getItem(storageKey) === "seen"
    ) {
      return
    }

    localStorage.setItem(storageKey, "seen")
    setUsaWin(win)
  }, [matches])

  if (!usaWin) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#102348]/35 px-4 backdrop-blur-sm">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 64 }).map(
          (_, index) => {
            const style = {
              left: `${(index * 17) % 100}%`,
              backgroundColor:
                confettiColors[
                  index % confettiColors.length
                ],
              animationDelay: `${(index % 12) * 0.08}s`,
              animationDuration: `${2.1 + (index % 8) * 0.12}s`,
              transform: `rotate(${index * 23}deg)`,
            } as CSSProperties

            return (
              <span
                key={index}
                className="usa-confetti-piece"
                style={style}
              />
            )
          }
        )}
      </div>

      <section
        aria-live="polite"
        className="relative w-full max-w-sm rounded-2xl bg-white p-5 text-center shadow-xl ring-1 ring-[#dbe5f6]"
      >
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#edf3ff] text-xl font-black text-[#102348] ring-1 ring-[#dbe5f6]">
          USA
        </div>

        <h2 className="text-3xl font-black text-[#102348]">
          USA Wins!
        </h2>

        <p className="mt-2 text-sm font-semibold text-[#4564a8]">
          {usaWin.score
            ? `Final: USA ${usaWin.score} ${usaWin.opponent}`
            : `Final: USA over ${usaWin.opponent}`}
        </p>

        <button
          type="button"
          onClick={() => setUsaWin(null)}
          className="mt-5 w-full rounded-full bg-[#102348] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#18376b]"
        >
          Let&apos;s go
        </button>
      </section>

      <style jsx>{`
        .usa-confetti-piece {
          position: absolute;
          top: -18px;
          width: 8px;
          height: 14px;
          border-radius: 2px;
          opacity: 0.95;
          animation-name: usaConfettiFall;
          animation-timing-function: ease-in;
          animation-fill-mode: forwards;
        }

        @keyframes usaConfettiFall {
          0% {
            transform: translate3d(0, -20px, 0) rotate(0deg);
            opacity: 1;
          }

          80% {
            opacity: 1;
          }

          100% {
            transform: translate3d(28px, 105vh, 0) rotate(420deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
