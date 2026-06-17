type Prediction = {
  user_id?: string | null
  username?: string | null
  match_key: string
  prediction: string
}

type Match = {
  homeTeam: {
    name: string
  }
  awayTeam: {
    name: string
  }
  score?: {
    winner?: string | null
  }
}

type PlayerScoreInput = {
  predictions: Prediction[]
  matches: Match[]
  usersById: Record<string, string>
  playerKey: string
  currentUserId: string
  currentUsername: string
}

const leaderboardAliases: Record<string, string> = {
  mileaminitemarv: "MileAMinuteMarv",
  mileaminutemarv: "MileAMinuteMarv",
  mileaminutemarvs: "MileAMinuteMarv",
}

export function buildUsersById(users: any[]) {
  const usersById: Record<string, string> = {}

  users.forEach((user) => {
    usersById[user.id] = user.username
  })

  return usersById
}

export function normalizeLeaderboardName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
}

function getCanonicalName(name: string) {
  const normalizedName =
    normalizeLeaderboardName(name)

  return (
    leaderboardAliases[normalizedName] ||
    name.trim()
  )
}

export function getPlayerKeyFromName(name: string) {
  return normalizeLeaderboardName(
    getCanonicalName(name)
  )
}

export function getCurrentPlayerKey(
  userId: string,
  username: string,
  usersById: Record<string, string>
) {
  const displayName =
    username || usersById[userId] || ""

  if (displayName) {
    return getPlayerKeyFromName(displayName)
  }

  return userId ? `user-${userId}` : ""
}

function getPredictionPlayer(
  prediction: Prediction,
  usersById: Record<string, string>,
  currentUserId: string,
  currentUsername: string
) {
  const rawDisplayName =
    prediction.user_id === currentUserId
      ? currentUsername ||
        usersById[prediction.user_id] ||
        prediction.username ||
        ""
      : usersById[prediction.user_id || ""] ||
        prediction.username ||
        ""

  if (!rawDisplayName) {
    return null
  }

  const name = getCanonicalName(rawDisplayName)
  const key = getPlayerKeyFromName(name)

  return {
    key,
    name,
    userId: prediction.user_id || "",
  }
}

function isCorrectPrediction(
  prediction: Prediction,
  match: Match
) {
  if (match.score?.winner === null) return false
  if (!match.score?.winner) return false

  return (
    (match.score.winner === "HOME_TEAM" &&
      prediction.prediction === match.homeTeam.name) ||
    (match.score.winner === "AWAY_TEAM" &&
      prediction.prediction === match.awayTeam.name) ||
    (match.score.winner === "DRAW" &&
      prediction.prediction === "Draw")
  )
}

export function calculatePlayerPoints({
  predictions,
  matches,
  usersById,
  playerKey,
  currentUserId,
  currentUsername,
}: PlayerScoreInput) {
  const correctMatchKeys = new Set<string>()

  predictions.forEach((prediction) => {
    const player = getPredictionPlayer(
      prediction,
      usersById,
      currentUserId,
      currentUsername
    )

    if (!player || player.key !== playerKey) {
      return
    }

    const match = matches.find(
      (m) =>
        `${m.homeTeam.name}-${m.awayTeam.name}` ===
        prediction.match_key
    )

    if (!match) return

    if (isCorrectPrediction(prediction, match)) {
      correctMatchKeys.add(prediction.match_key)
    }
  })

  return correctMatchKeys.size * 3
}

export function buildLeaderboard(
  predictions: Prediction[],
  matches: Match[],
  usersById: Record<string, string>,
  currentUserId: string,
  currentUsername: string
) {
  const leaderboardMap: Record<
    string,
    {
      name: string
      correctMatchKeys: Set<string>
      userIds: string[]
    }
  > = {}

  predictions.forEach((prediction) => {
    const player = getPredictionPlayer(
      prediction,
      usersById,
      currentUserId,
      currentUsername
    )

    if (!player) return

    if (!leaderboardMap[player.key]) {
      leaderboardMap[player.key] = {
        name: player.name,
        correctMatchKeys: new Set<string>(),
        userIds: [],
      }
    }

    if (
      player.userId &&
      !leaderboardMap[player.key].userIds.includes(
        player.userId
      )
    ) {
      leaderboardMap[player.key].userIds.push(
        player.userId
      )
    }

    if (player.userId === currentUserId && currentUsername) {
      leaderboardMap[player.key].name =
        getCanonicalName(currentUsername)
    }

    const match = matches.find(
      (m) =>
        `${m.homeTeam.name}-${m.awayTeam.name}` ===
        prediction.match_key
    )

    if (!match) return

    if (isCorrectPrediction(prediction, match)) {
      leaderboardMap[player.key].correctMatchKeys.add(
        prediction.match_key
      )
    }
  })

  return Object.entries(leaderboardMap)
    .map(([id, player]) => ({
      id,
      name: player.name,
      points: player.correctMatchKeys.size * 3,
      userIds: player.userIds,
    }))
    .sort(
      (a, b) => b.points - a.points
    )
    .map((player, index) => ({
      rank: index + 1,
      id: player.id,
      name: player.name,
      points: player.points,
      you: player.userIds.includes(currentUserId),
    }))
}
