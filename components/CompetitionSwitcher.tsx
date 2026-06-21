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
      <div className="overflow-x-auto pb-1 scrollbar-hide">
        <div className="flex gap-2">
          {competitions.map((competition) => (
            <button
              key={competition.code}
              type="button"
              onClick={() =>
                onSelectCompetition(competition.code)
              }
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold transition active:scale-95 ${
                selectedCompetition === competition.code
                  ? "bg-[#102348] text-white"
                  : "bg-white text-[#102348] ring-1 ring-[#dbe5f6]"
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
