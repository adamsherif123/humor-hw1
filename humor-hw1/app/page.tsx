import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-12 dark:bg-zinc-950">
      <main className="mx-auto w-full max-w-3xl">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Caption Ranking App
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Rate captions in two quick steps
          </h1>
          <p className="mt-3 max-w-xl text-sm text-zinc-600 dark:text-zinc-300">
            New here? Start by opening the caption list, then press upvote or downvote on any caption.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/list"
              className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Start rating captions
            </Link>
            <Link
              href="/upload"
              className="inline-flex items-center justify-center rounded-lg border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              Upload image and generate captions
            </Link>
          </div>

          <div className="mt-8 grid gap-3 text-sm text-zinc-600 dark:text-zinc-300 sm:grid-cols-3">
            <div className="rounded-lg bg-zinc-100 px-3 py-2 dark:bg-zinc-800">1) Open list</div>
            <div className="rounded-lg bg-zinc-100 px-3 py-2 dark:bg-zinc-800">2) Pick a caption</div>
            <div className="rounded-lg bg-zinc-100 px-3 py-2 dark:bg-zinc-800">3) Submit your vote</div>
          </div>
        </div>
      </main>
    </div>
  )
}
