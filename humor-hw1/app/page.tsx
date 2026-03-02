import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center px-6">
      <main className="w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Captions
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          View and vote on captions.
        </p>
        <Link
          href="/list"
          className="mt-8 inline-flex items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 px-6 py-3 text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          Go to list
        </Link>
      </main>
    </div>
  )
}
