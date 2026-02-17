"use client"

import { useState } from "react"
import { createSupabaseBrowserClient } from "../../lib/supabase/browser"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setLoading(true)
    const supabase = createSupabaseBrowserClient()

    const redirectTo = `${window.location.origin}/auth/callback` // MUST be exactly this path
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    })

    setLoading(false)
  }

  return (
    <main style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Login Required</h1>
      <p style={{ marginTop: 10, opacity: 0.8 }}>
        This route is protected. Sign in with Google to continue.
      </p>

      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        style={{
          marginTop: 16,
          padding: "12px 16px",
          borderRadius: 10,
          border: "1px solid #ddd",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        {loading ? "Redirecting..." : "Sign in with Google"}
      </button>
    </main>
  )
}
