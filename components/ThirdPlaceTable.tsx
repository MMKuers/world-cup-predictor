"use client"

import { useState } from "react"

export default function ThirdPlaceTable() {

  const [expanded, setExpanded] =
    useState(false)

  const teams = [
    ["Portugal", 6],
    ["Japan", 5],
    ["Ghana", 4],
    ["Norway", 4],
    ["Morocco", 3],
    ["Sweden", 3],
    ["Qatar", 2],
    ["Iran", 2],
    ["Austria", 1],
    ["Wales", 1],
    ["Chile", 0],
    ["Canada", 0],
  ]

  return (

    <div className="mb-8 rounded-[32px] bg-white p-6 shadow-sm">

      <button
        onClick={() =>
          setExpanded(!expanded)
        }
        className="flex w-full items-center justify-between text-left"
      >

        <div>

          <h2 className="text-2xl font-bold text-[#102348]">
            Best 3rd Place Teams
          </h2>

          <p className="mt-2 text-[#6f7f9d]">
            Top 8 third-place teams advance
            to the knockout stage.
          </p>

        </div>

       <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edf3ff] text-2xl font-medium text-[#102348]">

  {expanded ? "−" : "+"}

</div>

      </button>

    

      {/* EXPANDED */}
      {expanded && (

        <div className="mt-6 border-t border-[#e7eefb] pt-6">

          <div className="grid gap-3">

            {teams.map(([team, pts], index) => (

              <div
                key={team}
                className="flex items-center justify-between rounded-2xl bg-[#f8fbff] px-4 py-3"
              >

                <div className="flex items-center gap-3">

                  <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                    index < 8
                      ? "bg-[#dcfce7] text-[#166534]"
                      : "bg-[#fee2e2] text-[#991b1b]"
                  }`}>

                    {index + 1}

                  </div>

                  <div className="font-semibold text-[#102348]">
                    {team}
                  </div>

                </div>

                <div className="flex items-center gap-4">

                  <div className="text-sm font-bold text-[#102348]">
                    {pts} pts
                  </div>

                  {index < 8 ? (

                    <span className="rounded-full bg-[#dcfce7] px-3 py-1 text-xs font-semibold text-[#166534]">
                      Qualified
                    </span>

                  ) : (

                    <span className="rounded-full bg-[#fee2e2] px-3 py-1 text-xs font-semibold text-[#991b1b]">
                      Eliminated
                    </span>

                  )}

                </div>

              </div>

            ))}

          </div>

        </div>

      )}

    </div>

  )
}