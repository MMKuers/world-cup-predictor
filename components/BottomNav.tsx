"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  CalendarDays,
  Trophy,
} from "lucide-react"

const navItems = [
  {
    href: "/",
    label: "Matches",
    Icon: CalendarDays,
  },
  {
    href: "/predictions",
    label: "Picks",
    Icon: BarChart3,
  },
  {
    href: "/bracket",
    label: "Bracket",
    Icon: Trophy,
  },
]

export default function BottomNav() {

  const pathname =
    usePathname()

  return (

    <div className="fixed bottom-4 left-0 right-0 z-40 px-4">

      <nav className="mx-auto flex max-w-sm items-center justify-between gap-2 rounded-full bg-white/95 p-2 shadow-[0_12px_40px_rgba(16,35,72,0.18)] ring-1 ring-[#dbe5f6] backdrop-blur">

        {navItems.map(({ href, label, Icon }) => {
          const isActive =
            pathname === href

          return (
            <Link
              key={href}
              href={href}
              className={`flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold transition active:scale-95 ${
                isActive
                  ? "bg-[#102348] text-white shadow-sm"
                  : "text-[#6f7f9d] hover:bg-[#edf3ff] hover:text-[#102348]"
              }`}
              aria-current={
                isActive ? "page" : undefined
              }
            >
              <Icon
                size={15}
                strokeWidth={2.3}
                className="flex-shrink-0"
              />

              <span className="truncate">
                {label}
              </span>
            </Link>
          )
        })}

      </nav>

    </div>
  )
}