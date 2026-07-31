import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const rawRedirect = req.nextUrl.searchParams.get('redirectTo') || '/'
  const origin = req.nextUrl.origin

  let redirectTo = '/'

  try {
    const decoded = decodeURIComponent(rawRedirect)

    if (decoded.startsWith('/')) {
      redirectTo = decoded
    } else {
      const parsed = new URL(decoded)
      if (parsed.origin === origin) {
        redirectTo = parsed.pathname + parsed.search + parsed.hash
      }
    }
  } catch (e) {
    redirectTo = '/'
  }

  return NextResponse.redirect(redirectTo)
}
