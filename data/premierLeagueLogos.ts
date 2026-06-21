const premierLeagueLogoByTeam: Record<string, string> = {
  "AFC Bournemouth": "/team-logos/premier-league/bournemouth.svg",
  "Arsenal FC": "/team-logos/premier-league/arsenal.svg",
  "Aston Villa FC": "/team-logos/premier-league/aston-villa.svg",
  "Brentford FC": "/team-logos/premier-league/brentford.svg",
  "Brighton & Hove Albion FC": "/team-logos/premier-league/brighton.svg",
  "Chelsea FC": "/team-logos/premier-league/chelsea.svg",
  "Coventry City FC": "/team-logos/premier-league/coventry-city.svg",
  "Crystal Palace FC": "/team-logos/premier-league/crystal-palace.svg",
  "Everton FC": "/team-logos/premier-league/everton.svg",
  "Fulham FC": "/team-logos/premier-league/fulham.svg",
  "Hull City AFC": "/team-logos/premier-league/hull-city.svg",
  "Hull City FC": "/team-logos/premier-league/hull-city.svg",
  "Ipswich Town FC": "/team-logos/premier-league/ipswich.svg",
  "Leeds United FC": "/team-logos/premier-league/leeds-united.svg",
  "Liverpool FC": "/team-logos/premier-league/liverpool.svg",
  "Manchester City FC": "/team-logos/premier-league/manchester-city.svg",
  "Manchester United FC": "/team-logos/premier-league/manchester-united.svg",
  "Newcastle United FC": "/team-logos/premier-league/newcastle.svg",
  "Nottingham Forest FC": "/team-logos/premier-league/nottingham-forest.svg",
  "Sunderland AFC": "/team-logos/premier-league/sunderland.svg",
  "Sunderland FC": "/team-logos/premier-league/sunderland.svg",
  "Tottenham Hotspur FC": "/team-logos/premier-league/tottenham.svg",
}

export function getPremierLeagueLogo(
  teamName: string
) {
  return premierLeagueLogoByTeam[teamName.trim()]
}
