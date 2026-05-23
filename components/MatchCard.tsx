"use client"

type Props = {
  home: string
  away: string
  group: string
  stadium: string

  status: string
  kickoff: string

  homeScore: number | null
  awayScore: number | null
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
}: Props) {
  const countryCodes: Record<string, string> = {
    Brazil: "br",
    Germany: "de",
    Argentina: "ar",
    France: "fr",
    Spain: "es",
    England: "gb",
    Portugal: "pt",
    Mexico: "mx",
    Canada: "ca",
    Japan: "jp",
    Australia: "au",
    Morocco: "ma",
    Croatia: "hr",
    Netherlands: "nl",
    Belgium: "be",
    Uruguay: "uy",
    Colombia: "co",
    Denmark: "dk",
    Switzerland: "ch",
    Poland: "pl",
    Serbia: "rs",
    Ghana: "gh",
    Senegal: "sn",
    Cameroon: "cm",
    Tunisia: "tn",
    Iran: "ir",
    Ecuador: "ec",
    Wales: "gb",
    USA: "us",
    "United States": "us",
    "South Korea": "kr",
    "Republic of Korea": "kr",
    "Korea Republic": "kr",
    "Saudi Arabia": "sa",
    "South Africa": "za",
    Czechia: "cz",
    "Bosnia and Herzegovina": "ba",
    Paraguay: "py",
    Haiti: "ht",
    Qatar: "qa",
    Scotland: "gb",
    Turkey: "tr",
    "Curaçao": "cw",
    "Côte d'Ivoire": "ci",
  }

  const homeCode = countryCodes[home]
  const awayCode = countryCodes[away]

  const formattedDate = new Date(
    kickoff
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })

  const formattedTime = new Date(
    kickoff
  ).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })

  return (
    <button className="w-full rounded-[28px] bg-[#dfe9ff] px-5 py-4 text-left shadow-sm transition duration-200 hover:-translate-y-[2px] hover:shadow-md active:scale-[0.99]">

      <div className="flex items-start justify-between">

        <div className="flex-1">

          <div className="mb-5">
            <span className="rounded-full bg-[#edf3ff] px-3 py-1 text-xs font-semibold text-[#4f6ea8]">
              Group {group}
            </span>
          </div>

          <div className="space-y-5">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm">
                {homeCode && (
                  <img
                    src={`https://flagcdn.com/w80/${homeCode}.png`}
                    alt={home}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                )}
              </div>

              <div className="text-[20px] font-semibold text-[#102348]">
                {home}
              </div>

            </div>

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm">
                {awayCode && (
                  <img
                    src={`https://flagcdn.com/w80/${awayCode}.png`}
                    alt={away}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                )}
              </div>

              <div className="text-[20px] font-semibold text-[#102348]">
                {away}
              </div>

            </div>

          </div>

        </div>

        <div className="ml-4 text-right">

          <div className="text-[11px] uppercase tracking-wide text-[#6f7f9d]">
            {formattedDate}
          </div>

          <div className="mt-1 text-[22px] font-bold leading-none text-[#102348]">
            {formattedTime}
          </div>

          <div className="mt-2 text-[12px] text-[#6f7f9d]">
            {stadium}
          </div>

          <div className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-[#4564a8]">
            {status}
          </div>

        </div>

      </div>

    </button>
  )
}