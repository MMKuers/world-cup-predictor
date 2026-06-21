"use client"

import {
  CompetitionCode,
  competitions,
} from "@/components/competitions/config"

type Props = {
  selectedCompetition: CompetitionCode
  onSelectCompetition: (
    competition: CompetitionCode
  ) => void
}

export default function CompetitionSwitcher({
  selectedCompetition,
  onSelectCompetition,
}: Props) {
  return (
    <div className="mt-3">
      <div className="overflow-x-auto pb-0.5 scrollbar-hide">
        <div className="flex gap-1.5 rounded-full bg-[#071227]/55 p-1 ring-1 ring-white/10">
          {competitions.map((competition) => (
            <button
              key={competition.code}
              type="button"
              onClick={() =>
                onSelectCompetition(competition.code)
              }
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-black transition active:scale-95 ${
                selectedCompetition === competition.code
                  ? "bg-white text-[#102348] shadow-sm"
                  : "text-[#b8c6df] hover:bg-white/10 hover:text-white"
              }`}
            >
              {competition.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
