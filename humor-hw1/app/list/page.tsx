import { supabase } from "@/lib/supabaseClient"

type CaptionRow = {
  content: string | null
  is_public?: boolean | null
  profile_id?: string | null
  image_id?: string | null
}

export default async function ListPage() {
  const { data, error } = await supabase
    .from("captions")
    .select("content, is_public, profile_id, image_id")
    .order("content", { ascending: true })
    .limit(100)

  if (error) {
    return (
      <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Captions</h1>
        <p style={{ marginTop: 12 }}>
          Error reading from <code>captions</code>:
        </p>
        <pre
          style={{
            marginTop: 12,
            padding: 12,
            borderRadius: 8,
            background: "#111",
            color: "#fff",
            overflowX: "auto",
          }}
        >
          {error.message}
        </pre>
        <p style={{ marginTop: 12 }}>
          Most common fixes: wrong table name, or the table blocks anon SELECT via RLS/policies.
        </p>
      </main>
    )
  }

  const rows = (data ?? []) as CaptionRow[]

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Captions</h1>
      <p style={{ marginTop: 8 }}>
        Showing up to 100 rows from <code>captions</code>
      </p>

      <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
        {rows.map((row, idx) => (
          <div
            key={`${row.image_id ?? "img"}-${idx}`}
            style={{
              border: "1px solid #ddd",
              borderRadius: 12,
              padding: 14,
            }}
          >
            <div style={{ fontSize: 16, lineHeight: 1.4 }}>
              {row.content ?? <span style={{ opacity: 0.6 }}>(no content)</span>}
            </div>

            <div style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>
              {typeof row.is_public !== "undefined" ? (
                <span>public: {String(row.is_public)}</span>
              ) : null}
              {row.image_id ? <span> • image_id: {row.image_id}</span> : null}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
