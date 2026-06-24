"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  CalendarDays,
  Trophy,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

type NavItem = {
  href?: string
  label: string
  Icon: LucideIcon
  isActive?: boolean
  onClick?: () => void
}

const navItems: NavItem[] = [
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

export default function BottomNav({
  hidePicks = false,
  items,
}: {
  hidePicks?: boolean
  items?: NavItem[]
}) {

  const pathname =
    usePathname()

  const visibleNavItems =
    items || (
      hidePicks
        ? navItems.filter(
            (item) => item.label !== "Picks"
          )
        : navItems
    )

  return (

    <div className="fixed bottom-4 left-0 right-0 z-40 px-4">

      <nav className="mx-auto flex max-w-sm items-center justify-between gap-1.5 rounded-full bg-[#09162f]/95 p-1.5 shadow-[0_18px_48px_rgba(8,22,47,0.32)] ring-1 ring-white/10 backdrop-blur">

        {visibleNavItems.map(({ href, label, Icon, isActive, onClick }) => {
          const active =
            isActive ?? pathname === href

          const className =
            `flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-black transition active:scale-95 ${
              active
                ? "bg-white text-[#102348] shadow-sm"
                : "text-[#b8c6df] hover:bg-white/10 hover:text-white"
            }`

          const content = (
            <>
              <Icon
                size={15}
                strokeWidth={2.4}
                className="flex-shrink-0"
              />

              <span className="truncate">
                {label}
              </span>
            </>
          )

          if (onClick) {
            return (
              <button
                key={label}
                type="button"
                onClick={onClick}
                className={className}
                aria-current={
                  active ? "page" : undefined
                }
              >
                {content}
              </button>
            )
          }

          return (
            <Link
              key={href || label}
              href={href || "/"}
              className={className}
              aria-current={
                active ? "page" : undefined
              }
            >
              {content}
            </Link>
          )
        })}

      </nav>

    </div>
  )
}
