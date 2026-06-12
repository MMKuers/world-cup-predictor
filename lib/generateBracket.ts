import { calculateStandings } from "@/lib/calculateStandings"
import { getThirdPlaceTeams } from "@/lib/getThirdPlaceTeams"

export type KnockoutMatch = {
  id: number
  round: string
  home: string
  away: string
  homeScore: number | null
  awayScore: number | null
  winner: string | null
}

export function generateBracket(
  standings: Record<string, any[]>
) {



  const first =
    (group: string) =>
      standings[group]?.[0]?.team || "TBD"

  const second =
    (group: string) =>
      standings[group]?.[1]?.team || "TBD"

    const thirdPlaceTeams =
  getThirdPlaceTeams()

const third =
  (index: number) =>
    thirdPlaceTeams[index]?.team || "TBD"

  const roundOf32: KnockoutMatch[] = [

  {
    id: 1,
    round: "R32",
    home: first("A"),
    away: third(7),
    homeScore: null,
    awayScore: null,
    winner: null,
  },

  {
    id: 2,
    round: "R32",
    home: second("B"),
    away: second("C"),
    homeScore: null,
    awayScore: null,
    winner: null,
  },

  {
    id: 3,
    round: "R32",
    home: first("D"),
    away: third(6),
    homeScore: null,
    awayScore: null,
    winner: null,
  },

  {
    id: 4,
    round: "R32",
    home: first("E"),
    away: second("F"),
    homeScore: null,
    awayScore: null,
    winner: null,
  },

  {
    id: 5,
    round: "R32",
    home: first("G"),
    away: third(5),
    homeScore: null,
    awayScore: null,
    winner: null,
  },

  {
    id: 6,
    round: "R32",
    home: second("H"),
    away: second("I"),
    homeScore: null,
    awayScore: null,
    winner: null,
  },

  {
    id: 7,
    round: "R32",
    home: first("J"),
    away: third(4),
    homeScore: null,
    awayScore: null,
    winner: null,
  },

  {
    id: 8,
    round: "R32",
    home: first("K"),
    away: second("L"),
    homeScore: null,
    awayScore: null,
    winner: null,
  },

  {
    id: 9,
    round: "R32",
    home: first("B"),
    away: third(3),
    homeScore: null,
    awayScore: null,
    winner: null,
  },

  {
    id: 10,
    round: "R32",
    home: second("A"),
    away: second("D"),
    homeScore: null,
    awayScore: null,
    winner: null,
  },

  {
    id: 11,
    round: "R32",
    home: first("C"),
    away: third(2),
    homeScore: null,
    awayScore: null,
    winner: null,
  },

  {
    id: 12,
    round: "R32",
    home: second("E"),
    away: second("G"),
    homeScore: null,
    awayScore: null,
    winner: null,
  },

  {
    id: 13,
    round: "R32",
    home: first("F"),
    away: third(1),
    homeScore: null,
    awayScore: null,
    winner: null,
  },

  {
    id: 14,
    round: "R32",
    home: second("H"),
    away: second("J"),
    homeScore: null,
    awayScore: null,
    winner: null,
  },

  {
    id: 15,
    round: "R32",
    home: first("I"),
    away: third(0),
    homeScore: null,
    awayScore: null,
    winner: null,
  },

  {
    id: 16,
    round: "R32",
    home: second("K"),
    away: first("L"),
    homeScore: null,
    awayScore: null,
    winner: null,
  },

]
const winner = (
  match: KnockoutMatch
) => {

  if (
    match.homeScore === null ||
    match.awayScore === null
  ) {
    return "TBD"
  }

  if (
    match.homeScore >
    match.awayScore
  ) {
    return match.home
  }

  if (
    match.awayScore >
    match.homeScore
  ) {
    return match.away
  }

  return "TBD"

}

const roundOf16: KnockoutMatch[] = [

  {
    id: 101,
    round: "R16",
    home: winner(roundOf32[0]),
    away: winner(roundOf32[1]),
    homeScore: null,
    awayScore: null,
    winner: null,
  },

  {
    id: 102,
    round: "R16",
    home: winner(roundOf32[2]),
    away: winner(roundOf32[3]),
    homeScore: null,
    awayScore: null,
    winner: null,
  },

  {
    id: 103,
    round: "R16",
    home: winner(roundOf32[4]),
    away: winner(roundOf32[5]),
    homeScore: null,
    awayScore: null,
    winner: null,
  },

  {
    id: 104,
    round: "R16",
    home: winner(roundOf32[6]),
    away: winner(roundOf32[7]),
    homeScore: null,
    awayScore: null,
    winner: null,
  },

  {
    id: 105,
    round: "R16",
    home: winner(roundOf32[8]),
    away: winner(roundOf32[9]),
    homeScore: null,
    awayScore: null,
    winner: null,
  },

  {
    id: 106,
    round: "R16",
    home: winner(roundOf32[10]),
    away: winner(roundOf32[11]),
    homeScore: null,
    awayScore: null,
    winner: null,
  },

  {
    id: 107,
    round: "R16",
    home: winner(roundOf32[12]),
    away: winner(roundOf32[13]),
    homeScore: null,
    awayScore: null,
    winner: null,
  },

  {
    id: 108,
    round: "R16",
    home: winner(roundOf32[14]),
    away: winner(roundOf32[15]),
    homeScore: null,
    awayScore: null,
    winner: null,
  },

]
 
const quarterfinals: KnockoutMatch[] = [

  {
    id: 201,
    round: "QF",
    home: winner(roundOf16[0]),
    away: winner(roundOf16[1]),
    homeScore: null,
    awayScore: null,
    winner: null,
  },

  {
    id: 202,
    round: "QF",
    home: winner(roundOf16[2]),
    away: winner(roundOf16[3]),
    homeScore: null,
    awayScore: null,
    winner: null,
  },

  {
    id: 203,
    round: "QF",
    home: winner(roundOf16[4]),
    away: winner(roundOf16[5]),
    homeScore: null,
    awayScore: null,
    winner: null,
  },

  {
    id: 204,
    round: "QF",
    home: winner(roundOf16[6]),
    away: winner(roundOf16[7]),
    homeScore: null,
    awayScore: null,
    winner: null,
  },

]

const semifinals: KnockoutMatch[] = [

  {
    id: 301,
    round: "SF",
    home: winner(quarterfinals[0]),
    away: winner(quarterfinals[1]),
    homeScore: null,
    awayScore: null,
    winner: null,
  },

  {
    id: 302,
    round: "SF",
    home: winner(quarterfinals[2]),
    away: winner(quarterfinals[3]),
    homeScore: null,
    awayScore: null,
    winner: null,
  },

]

const final: KnockoutMatch = {

  id: 401,
  round: "FINAL",

  home: winner(semifinals[0]),
  away: winner(semifinals[1]),

  homeScore: null,
  awayScore: null,

  winner: null,

}

return {
  roundOf32,
  roundOf16,
  quarterfinals,
  semifinals,
  final,
}
}