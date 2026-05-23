"use client"

import { useState } from "react"

type Props = {
  home: string
  away: string
  group: string

  status: string
  kickoff: string

  homeScore: number | null
  awayScore: number | null
}

export default function MatchCard({
  home,
  away,
  group,
  status,
  kickoff,
  homeScore,
  awayScore,
}: Props) {
  const storageKey = `${home}-${away}`

const [selectedTeam, setSelectedTeam] =
  useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem(storageKey) || ""
      )
    }

    return ""
  })

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full bg-zinc-800 px-3 py-1 text-sm text-zinc-300">
          {group}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => {
  setSelectedTeam(home)

  localStorage.setItem(
    storageKey,
    home
  )
}}
          className={`rounded-xl p-6 text-xl font-bold transition ${
            selectedTeam === home
              ? "bg-green-500 text-black"
              : "bg-zinc-800 text-white hover:bg-zinc-700"
          }`}
        >
          {home}
        </button>

        <button
          onClick={() => {
  setSelectedTeam(away)

  localStorage.setItem(
    storageKey,
    away
  )
}}
          className={`rounded-xl p-6 text-xl font-bold transition ${
            selectedTeam === away
              ? "bg-green-500 text-black"
              : "bg-zinc-800 text-white hover:bg-zinc-700"
          }`}
        >
          {away}
        </button>
      </div>

      {selectedTeam && (
        <div className="mt-6 text-center text-green-400">
          You picked {selectedTeam}
        </div>
      )}
    </div>
  )
}