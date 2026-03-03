import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export const runtime = "nodejs"

const BASE_URL = "https://api.almostcrackd.ai"

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
])

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient()

  // must be logged in
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  // must have JWT access token
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
  const token = sessionData.session?.access_token
  if (sessionError || !token) {
    return NextResponse.json({ error: "Missing access token" }, { status: 401 })
  }

  // read file from multipart/form-data
  const form = await req.formData()
  const file = form.get("file")
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 })
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: `Unsupported content type: ${file.type}` }, { status: 400 })
  }

  // STEP 1: presign
  const presignRes = await fetch(`${BASE_URL}/pipeline/generate-presigned-url`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ contentType: file.type }),
  })

  if (!presignRes.ok) {
    const text = await presignRes.text()
    return NextResponse.json({ error: `Presign failed: ${text}` }, { status: 400 })
  }

  const { presignedUrl, cdnUrl } = await presignRes.json()

  // STEP 2: PUT bytes to presignedUrl
  const putRes = await fetch(presignedUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  })

  if (!putRes.ok) {
    const text = await putRes.text().catch(() => "")
    return NextResponse.json({ error: `Upload PUT failed: ${putRes.status} ${text}` }, { status: 400 })
  }

  // STEP 3: register URL
  const registerRes = await fetch(`${BASE_URL}/pipeline/upload-image-from-url`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ imageUrl: cdnUrl, isCommonUse: false }),
  })

  if (!registerRes.ok) {
    const text = await registerRes.text()
    return NextResponse.json({ error: `Register failed: ${text}` }, { status: 400 })
  }

  const { imageId } = await registerRes.json()

  // STEP 4: generate captions
  const captionsRes = await fetch(`${BASE_URL}/pipeline/generate-captions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ imageId }),
  })

  if (!captionsRes.ok) {
    const text = await captionsRes.text()
    return NextResponse.json({ error: `Generate captions failed: ${text}` }, { status: 400 })
  }

  const captions = await captionsRes.json()
  return NextResponse.json({ ok: true, cdnUrl, imageId, captions })
}