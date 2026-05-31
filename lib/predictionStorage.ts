export function savePredictions(
  predictions: any
) {

  if (typeof window === "undefined")
    return

  localStorage.setItem(
    "worldCupPredictions",
    JSON.stringify(predictions)
  )

}

export function loadPredictions() {

  if (typeof window === "undefined")
    return null

  const saved =
    localStorage.getItem(
      "worldCupPredictions"
    )

  if (!saved)
    return null

  return JSON.parse(saved)

}

export function clearPredictions() {

  if (typeof window === "undefined")
    return

  localStorage.removeItem(
    "worldCupPredictions"
  )

}