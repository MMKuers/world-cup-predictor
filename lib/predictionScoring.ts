type Prediction = {
  user_id?: string | null
  username?: string | null
  match_key: string
  prediction: string
  predicted_home_score?: number | null
  predicted_away_score?: number | null
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
    fullTime?: {
      home?: number | null
      away?: number | null
    }
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

function getActualScore(match: Match) {
  const home = match.score?.fullTime?.home
  const away = match.score?.fullTime?.away

  if (
    typeof home !== "number" ||
    typeof away !== "number"
  ) {
    return null
  }

  return { home, away }
}

function isExactScore(
  prediction: Prediction,
  match: Match
) {
  const actualScore = getActualScore(match)

  if (!actualScore) return false

  return (
    prediction.predicted_home_score === actualScore.home &&
    prediction.predicted_away_score === actualScore.away
  )
}

export function calculatePredictionPoints(
  prediction: Prediction,
  match: Match
) {
  if (!isCorrectPrediction(prediction, match)) {
    return 0
  }

  return isExactScore(prediction, match)
    ? 5
    : 3
}

export function calculatePlayerPoints({
  predictions,
  matches,
  usersById,
  playerKey,
  currentUserId,
  currentUsername,
}: PlayerScoreInput) {
  const pointsByMatch = new Map<string, number>()

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

    const points = calculatePredictionPoints(
      prediction,
      match
    )

    const previousPoints =
      pointsByMatch.get(prediction.match_key) || 0

    pointsByMatch.set(
      prediction.match_key,
      Math.max(previousPoints, points)
    )
  })

  return Array.from(pointsByMatch.values())
    .reduce((total, points) => total + points, 0)
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
      pointsByMatch: Map<string, number>
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
        pointsByMatch: new Map<string, number>(),
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

    const points = calculatePredictionPoints(
      prediction,
      match
    )

    const previousPoints =
      leaderboardMap[player.key].pointsByMatch.get(
        prediction.match_key
      ) || 0

    leaderboardMap[player.key].pointsByMatch.set(
      prediction.match_key,
      Math.max(previousPoints, points)
    )
  })

  return Object.entries(leaderboardMap)
    .map(([id, player]) => ({
      id,
      name: player.name,
      points: Array.from(
        player.pointsByMatch.values()
      ).reduce(
        (total, points) => total + points,
        0
      ),
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
