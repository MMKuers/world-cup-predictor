"use client"

import { useCallback } from "react"
import CompetitionMatchView from "@/components/competitions/CompetitionMatchView"
import { supabase } from "@/lib/supabase"
import {
  buildLeaderboard,
  buildUsersById,
  getCurrentPlayerKey,
} from "@/lib/predictionScoring"

type Props = {
  onPointsChange: (points: number) => void
}

export default function WorldCupView({
  onPointsChange,
}: Props) {
  const updatePoints =
    useCallback(async (matches: any[]) => {
      const userId =
        localStorage.getItem("user-id") || ""

      const currentUsername =
        localStorage.getItem("wc-user") || ""

      if (!userId && !currentUsername) {
        onPointsChange(0)
        return
      }

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
        return
      }

      const usersById =
        buildUsersById(users || [])

      const playerKey =
        getCurrentPlayerKey(
          userId,
          currentUsername,
          usersById
        )

      const leaderboard =
        buildLeaderboard(
          predictions || [],
          matches,
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

      onPointsChange(
        currentPlayer?.points || 0
      )
    }, [onPointsChange])

  return (
    <CompetitionMatchView
      competitionCode="WC"
      competitionLabel="World Cup"
      allowPredictions={true}
      showUsaCelebration={true}
      onMatchesLoaded={updatePoints}
    />
  )
}
