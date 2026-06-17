"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function BottomNav() {

  const pathname =
    usePathname()

  return (

    <div className="fixed bottom-0 left-0 right-0 border-t border-[#dbe5f6] bg-white/95 px-4 py-3 backdrop-blur">

      <div className="mx-auto flex max-w-md items-center justify-around">

        <Link
          href="/"
          className={`flex flex-col items-center text-xs font-semibold transition ${
            pathname === "/"
              ? "text-[#102348]"
              : "text-[#7b8baa]"
          }`}
        >
          
          <span>
            Matches
          </span>
        </Link>

        <Link
  href="/predictions"
  className={`flex flex-col items-center text-xs font-semibold transition ${
    pathname === "/predictions"
      ? "text-[#102348]"
      : "text-[#7b8baa]"
  }`}
>
  
  <span>
    Predictions
  </span>
</Link>

<Link
  href="/bracket"
  className={`flex flex-col items-center text-xs font-semibold transition ${
    pathname === "/bracket"
      ? "text-[#102348]"
      : "text-[#7b8baa]"
  }`}
>
  
  <span>
    Bracket
  </span>
</Link>

      </div>

    </div>
  )
}