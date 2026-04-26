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

type ImageRow = {
  id: string
  [key: string]: unknown
}

function resolveImageUrl(image: ImageRow | undefined): string | null {
  if (!image) return null
  const candidates = [
    image.url,
    image.cdn_url,
    image.image_url,
    image.image_path,
    image.path,
  ]
  for (const value of candidates) {
    if (typeof value === "string" && value.length > 0) {
      return value
    }
  }
  return null
}

export default async function ListPage() {
  const supabase = await createSupabaseServerClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return (
      <main className="mx-auto w-full max-w-4xl px-6 py-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          ← Back
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight">Captions</h1>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">You must be logged in to view this page.</p>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          Go to <a href="/login" className="underline">/login</a>
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
      <main className="mx-auto w-full max-w-4xl px-6 py-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          ← Back
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight">Captions</h1>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">Error loading captions:</p>
        <pre className="mt-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {error.message}
        </pre>
      </main>
    )
  }

  const allRows = (data ?? []) as CaptionRow[]
  const rows = allRows.filter((row) => !votedCaptionIds.has(row.id))
  const imageIds = rows
    .map((row) => row.image_id)
    .filter((id): id is string => typeof id === "string" && id.length > 0)

  const { data: imageData } = imageIds.length
    ? await supabase.from("images").select("*").in("id", imageIds)
    : { data: [] as ImageRow[] }
  const imageById = new Map((imageData ?? []).map((image) => [image.id, image as ImageRow]))

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        ← Back
      </Link>

      <header className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-3xl font-semibold tracking-tight">Caption voting</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          Pick a caption and vote once. After your vote, that caption disappears from this list.
        </p>
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">Signed in as: {userData.user.email}</p>
      </header>

      {rows.length === 0 ? (
        <section className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-medium">You are done for now</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            You have already voted on every caption currently shown. Check back later for new captions.
          </p>
        </section>
      ) : (
        <div className="mt-4 grid gap-3">
          {rows.map((row) => (
            <article
              key={row.id}
              className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="grid gap-3 md:grid-cols-[180px_1fr] md:items-start">
                {(() => {
                  const imageUrl = row.image_id
                    ? resolveImageUrl(imageById.get(row.image_id))
                    : null
                  return imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Caption image"
                      className="h-32 w-full rounded-lg border border-zinc-200 object-cover dark:border-zinc-700 md:h-28"
                    />
                  ) : (
                    <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 text-xs text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 md:h-28">
                      No image available
                    </div>
                  )
                })()}
                <p className="text-base leading-7 text-zinc-900 dark:text-zinc-100">
                  {row.content ?? <span className="text-zinc-500">(no content)</span>}
                </p>
              </div>
              <VoteButtons captionId={row.id} />
            </article>
          ))}
        </div>
      )}
    </main>
  )
}
