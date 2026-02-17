import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_ANON_KEY
  if (!url || !key) return response

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  // Refresh session / read user (important for SSR auth)
  const { data } = await supabase.auth.getUser()
  const user = data.user

  const isProtectedRoute = request.nextUrl.pathname.startsWith("/list")
  const isLoginRoute = request.nextUrl.pathname.startsWith("/login")
  const isCallbackRoute = request.nextUrl.pathname.startsWith("/auth/callback")

  if (isProtectedRoute && !user && !isLoginRoute && !isCallbackRoute) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = "/login"
    redirectUrl.search = "" // keep it clean
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: ["/list/:path*", "/auth/callback", "/login"],
}
