import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Simple in-memory rate limiter for demonstration
// Note: In a real serverless environment (Vercel), this map is per-lambda instance.
// For a robust solution, use Redis (e.g., Upstash).
const rateLimit = new Map<string, { count: number; lastReset: number }>()

const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS = 100 // 100 requests per minute

function isRateLimited(ip: string) {
  const now = Date.now()
  const record = rateLimit.get(ip) || { count: 0, lastReset: now }

  if (now - record.lastReset > RATE_LIMIT_WINDOW) {
    record.count = 0
    record.lastReset = now
  }

  if (record.count >= MAX_REQUESTS) {
    return true
  }

  record.count++
  rateLimit.set(ip, record)
  return false
}

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAuthPage = req.nextUrl.pathname.startsWith("/login")
  const isApiAuthRoute = req.nextUrl.pathname.startsWith("/api/auth")
  const isPublicResource = req.nextUrl.pathname.match(/\.(svg|png|jpg|jpeg|gif|webp)$/)

  // Rate Limiting
  const ip = req.headers.get("x-forwarded-for") || "unknown"
  if (isRateLimited(ip)) {
    return new NextResponse("Too Many Requests", { status: 429 })
  }

  // Auth Logic
  if (isApiAuthRoute || isPublicResource) {
    return NextResponse.next()
  }

  if (isAuthPage) {
    if (isLoggedIn) {
      return Response.redirect(new URL("/", req.nextUrl))
    }
    return NextResponse.next()
  }

  if (!isLoggedIn) {
    return Response.redirect(new URL("/login", req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
