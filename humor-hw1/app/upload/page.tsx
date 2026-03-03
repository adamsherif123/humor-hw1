"use client"

import { useState } from "react"
import Link from "next/link"

type CaptionRecord = {
  id?: string
  content?: string
  [key: string]: any
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
    } catch (e: any) {
      setError(e?.message ?? "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 mb-6"
      >
        ← Back
      </Link>

      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Upload Image → Generate Captions</h1>
      <p style={{ marginTop: 8, opacity: 0.8 }}>
        This uses the staging pipeline API and requires login.
      </p>

      <div style={{ marginTop: 16, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/heic"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <button
          onClick={onSubmit}
          disabled={loading || !file}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #ddd",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          {loading ? "Working..." : "Generate Captions"}
        </button>
      </div>

      {error ? <p style={{ marginTop: 12, color: "crimson" }}>{error}</p> : null}

      {cdnUrl ? (
        <div style={{ marginTop: 18 }}>
          <p style={{ opacity: 0.8 }}>Uploaded image:</p>
          <img
            src={cdnUrl}
            alt="uploaded"
            style={{ maxWidth: "100%", borderRadius: 12, border: "1px solid #ddd" }}
          />
        </div>
      ) : null}

      {captions.length ? (
        <div style={{ marginTop: 18 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>Generated Captions</h2>
          <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
            {captions.map((c, idx) => (
              <div key={c.id ?? idx} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
                <div style={{ fontSize: 16 }}>{c.content ?? JSON.stringify(c)}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </main>
  )
}