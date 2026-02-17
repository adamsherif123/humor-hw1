import { createSupabaseServerClient } from "@/lib/supabase/server"

type CaptionRow = {
  content: string | null
  is_public?: boolean | null
  profile_id?: string | null
  image_id?: string | null
}

export default async function ListPage() {
  const supabase = await createSupabaseServerClient()

  // If you want belt-and-suspenders (middleware already blocks):
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return (
      <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Captions</h1>
        <p style={{ marginTop: 12 }}>You must be logged in to view this page.</p>
        <p style={{ marginTop: 10 }}>
          Go to <a href="/login">/login</a>
        </p>
      </main>
    )
  }

  const { data, error } = await supabase
    .from("captions")
    .select("content, is_public, profile_id, image_id")
    .limit(100)

  if (error) {
    return (
      <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Captions</h1>
        <p style={{ marginTop: 12 }}>Error loading captions:</p>
        <pre style={{ marginTop: 12 }}>{error.message}</pre>
      </main>
    )
  }

  const rows = (data ?? []) as CaptionRow[]

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Captions</h1>
      <p style={{ marginTop: 8 }}>Signed in as: {userData.user.email}</p>

      <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
        {rows.map((row, idx) => (
          <div
            key={`${row.image_id ?? "img"}-${idx}`}
            style={{ border: "1px solid #ddd", borderRadius: 12, padding: 14 }}
          >
            <div style={{ fontSize: 16, lineHeight: 1.4 }}>
              {row.content ?? <span style={{ opacity: 0.6 }}>(no content)</span>}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
