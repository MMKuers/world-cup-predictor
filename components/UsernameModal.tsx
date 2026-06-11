"use client"

import { useEffect, useState } from "react"

export default function UsernameModal() {

  const [name, setName] = useState("")
  const [showModal, setShowModal] =
    useState(false)

  useEffect(() => {

    const existingName =
      localStorage.getItem("wc-user")

    if (!existingName) {
      setShowModal(true)
    }

  }, [])

  const saveName = () => {

    if (!name.trim()) return

    localStorage.setItem(
  "wc-user",
  name.trim().toLowerCase()
)

    setShowModal(false)

  }

  if (!showModal) {
    return null
  }

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">

      <div className="w-full max-w-md rounded-[32px] bg-white p-8 shadow-2xl">

        <h2 className="text-3xl font-bold text-[#102348]">
          Welcome
        </h2>

        <p className="mt-3 text-[#6f7f9d]">
          Enter your name to start making
          your World Cup predictions.
        </p>

        <input
  value={name}
  onChange={(e) =>
    setName(e.target.value)
  }
  placeholder="Your name"
  className="mt-6 w-full rounded-2xl border border-[#dbe5f6] px-5 py-4 text-lg text-black placeholder:text-gray-400 outline-none"
/>

        <button
          onClick={saveName}
          className="mt-5 w-full rounded-2xl bg-[#102348] py-4 text-lg font-semibold text-white transition hover:opacity-90"
        >
          Continue
        </button>

      </div>

    </div>

  )
}