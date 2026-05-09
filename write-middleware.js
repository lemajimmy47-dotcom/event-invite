const fs = require("fs");
const content = `import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isPublic = request.nextUrl.pathname.startsWith("/rsvp") ||
                   request.nextUrl.pathname.startsWith("/login") ||
                   request.nextUrl.pathname.startsWith("/landing") ||
                   request.nextUrl.pathname === "/" ||
                   request.nextUrl.pathname.startsWith("/api")

  if (!user && !isPublic) {
    return NextResponse.redirect(new URL("/landing", request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}`;
fs.writeFileSync("middleware.ts", content, "utf8");
console.log("Middleware imeandikwa!");
