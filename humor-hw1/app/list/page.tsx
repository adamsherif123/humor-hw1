import Link from "next/link"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import VoteButtons from "./VoteButton"

type CaptionRow = {
  id: string
  content: string | null
  is_public?: boolean | null
  profile_id?: string | null
  image_id?: string | null
}

export default async function ListPage() {
  const supabase = await createSupabaseServerClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return (
      <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 mb-6"
        >
          ← Back
        </Link>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Captions</h1>
        <p style={{ marginTop: 12 }}>You must be logged in to view this page.</p>
        <p style={{ marginTop: 10 }}>
          Go to <a href="/login">/login</a>
        </p>
      </main>
    )
  }

  

  const { data: votedRows } = await supabase
    .from("caption_votes")
    .select("caption_id")
    .eq("profile_id", userData.user.id)
  const votedCaptionIds = new Set((votedRows ?? []).map((r) => r.caption_id))

  const { data, error } = await supabase
    .from("captions")
    .select("id, content, is_public, profile_id, image_id")
    .limit(100)

  if (error) {
    return (
      <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 mb-6"
        >
          ← Back
        </Link>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Captions</h1>
        <p style={{ marginTop: 12 }}>Error loading captions:</p>
        <pre style={{ marginTop: 12 }}>{error.message}</pre>
      </main>
    )
  }

  const allRows = (data ?? []) as CaptionRow[]
  const rows = allRows.filter((row) => !votedCaptionIds.has(row.id))

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 mb-6"
      >
        ← Back
      </Link>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Captions</h1>
      <p style={{ marginTop: 8 }}>Signed in as: {userData.user.email}</p>

      <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
        {rows.map((row) => (
          <div
            key={row.id}
            style={{ border: "1px solid #ddd", borderRadius: 12, padding: 14 }}
          >
            <div style={{ fontSize: 16, lineHeight: 1.4 }}>
              {row.content ?? <span style={{ opacity: 0.6 }}>(no content)</span>}
            </div>

            <VoteButtons captionId={row.id} />
          </div>
        ))}
      </div>
    </main>
  )
}
