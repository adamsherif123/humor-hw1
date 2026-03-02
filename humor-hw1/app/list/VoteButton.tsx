"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function VoteButtons({ captionId }: { captionId: string }) {
  const router = useRouter()
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle")
  const [message, setMessage] = useState<string>("")

  const sendVote = async (vote: 1 | -1) => {
    setStatus("loading")
    setMessage("")

    const res = await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ captionId, vote }),
    })

    const json = await res.json().catch(() => ({}))

    if (!res.ok) {
      setStatus("error")
      setMessage(json.error ?? "Vote failed")
      return
    }

    setStatus("done")
    setMessage("Vote recorded")
    router.refresh()
    setTimeout(() => {
      setStatus("idle")
      setMessage("")
    }, 1200)
  }

  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 10 }}>
      <button
        onClick={() => sendVote(1)}
        disabled={status === "loading"}
        style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #ddd", cursor: "pointer" }}
      >
        👍 Upvote
      </button>

      <button
        onClick={() => sendVote(-1)}
        disabled={status === "loading"}
        style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #ddd", cursor: "pointer" }}
      >
        👎 Downvote
      </button>

      {message ? <span style={{ fontSize: 12, opacity: 0.8 }}>{message}</span> : null}
    </div>
  )
}
