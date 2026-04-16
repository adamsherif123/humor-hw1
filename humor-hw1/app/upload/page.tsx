"use client"

import Link from "next/link"
import { useState } from "react"

type CaptionRecord = {
  id?: string
  content?: string
  [key: string]: unknown
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [cdnUrl, setCdnUrl] = useState("")
  const [captions, setCaptions] = useState<CaptionRecord[]>([])

  const onSubmit = async () => {
    setError("")
    setCaptions([])
    setCdnUrl("")

    if (!file) {
      setError("Pick an image first.")
      return
    }

    setLoading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)

      const res = await fetch("/api/pipeline", { method: "POST", body: fd })
      const json = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(json.error ?? "Request failed")
        return
      }

      setCdnUrl(json.cdnUrl ?? "")
      setCaptions(Array.isArray(json.captions) ? json.captions : [])
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message)
      } else {
        setError("Unknown error")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        ← Back
      </Link>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-3xl font-semibold tracking-tight">Upload image and generate captions</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          Step 1: choose an image file. Step 2: click Generate captions.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/heic"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="max-w-full text-sm"
          />
          <button
            onClick={onSubmit}
            disabled={loading || !file}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            {loading ? "Working..." : "Generate captions"}
          </button>
        </div>

        {error ? <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p> : null}
      </section>

      {cdnUrl ? (
        <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-medium">Uploaded image</h2>
          <img
            src={cdnUrl}
            alt="uploaded"
            className="mt-3 max-w-full rounded-xl border border-zinc-200 dark:border-zinc-700"
          />
        </section>
      ) : null}

      {captions.length ? (
        <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-medium">Generated captions</h2>
          <div className="mt-3 grid gap-2">
            {captions.map((c, idx) => (
              <div key={c.id ?? idx} className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
                <p className="text-sm text-zinc-900 dark:text-zinc-100">{c.content ?? JSON.stringify(c)}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  )
}
