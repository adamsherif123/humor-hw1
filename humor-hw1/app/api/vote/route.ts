import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient()

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const captionId = body.captionId as string | undefined
  const vote = body.vote as number | undefined // 1 or -1

  if (!captionId || (vote !== 1 && vote !== -1)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const now = new Date().toISOString()
  const { error: insertError } = await supabase.from("caption_votes").insert({
    caption_id: captionId,
    profile_id: userData.user.id,
    vote_value: vote,
    created_datetime_utc: now,
    modified_datetime_utc: now,
  })

  if (insertError) {
    const isDuplicate =
      insertError.code === "23505" ||
      insertError.message?.includes("duplicate key") ||
      insertError.message?.includes("caption_votes_user_caption_unique")
    const message = isDuplicate
      ? "This comment has already been voted on."
      : insertError.message
    return NextResponse.json({ error: message }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}