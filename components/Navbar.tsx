"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()

  if (pathname === "/login") return null

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-blue-600 font-bold text-lg">
            🎉 EventInvite
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className={"text-sm font-medium transition " + (pathname === "/" ? "text-blue-600" : "text-gray-500 hover:text-gray-900")}
            >
              Matukio
            </Link>
            <Link
              href="/events/new"
              className={"text-sm font-medium transition " + (pathname === "/events/new" ? "text-blue-600" : "text-gray-500 hover:text-gray-900")}
            >
              + Tukio Jipya
            </Link>
            <Link
              href="/checkin"
              className={"text-sm font-medium transition " + (pathname === "/checkin" ? "text-blue-600" : "text-gray-500 hover:text-gray-900")}
            >
              📷 Check-in
            </Link>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 hover:text-red-700 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
        >
          Toka
        </button>
      </div>
    </nav>
  )
}