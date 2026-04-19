import { NextResponse, type NextRequest } from 'next/server'

// Auth disabled — re-enable by restoring Supabase auth checks here
export function proxy(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
