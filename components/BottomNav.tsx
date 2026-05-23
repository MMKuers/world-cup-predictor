export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-zinc-800 bg-zinc-900">
      <div className="flex justify-around p-4 text-sm">
        <button className="text-green-400">
          Home
        </button>

        <button className="text-zinc-400">
          Predictions
        </button>

        <button className="text-zinc-400">
          Leaderboard
        </button>

        <button className="text-zinc-400">
          Profile
        </button>
      </div>
    </div>
  )
}