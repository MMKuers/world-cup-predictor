"use client"

import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"

export default function UsernameModal() {

  const [name, setName] = useState("")
  const [showModal, setShowModal] =
    useState(false)

  useEffect(() => {

  const existingName =
  localStorage.getItem("wc-user")

const existingUserId =
  localStorage.getItem("user-id")

if (
  !existingName ||
  !existingUserId
) {
  setShowModal(true)
}

}, [])

  const saveName = async () => {

  if (!name.trim()) return

  const { data: existingUsers } =
    await supabase
      .from("users")
      .select("*")
      .eq("username", name.trim())
      .limit(1)

  const existingUser =
    existingUsers?.[0]

  if (existingUser) {

    localStorage.setItem(
      "wc-user",
      existingUser.username
    )

    localStorage.setItem(
      "user-id",
      existingUser.id
    )

  } else {

    const { data: newUser, error } =
      await supabase
        .from("users")
        .insert({
          username: name.trim(),
        })
        .select()
        .single()

    if (error) {
      console.error(error)
      return
    }

    localStorage.setItem(
      "wc-user",
      newUser.username
    )

    localStorage.setItem(
      "user-id",
      newUser.id
    )

  }

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