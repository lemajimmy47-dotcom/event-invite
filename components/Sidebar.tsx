"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"

const navItems = [
  { href: "/dashboard", icon: "📊", label: "Dashboard" },
  { href: "/events", icon: "📋", label: "Matukio" },
  { href: "/checkin", icon: "📷", label: "Scan Check-in" },
  { href: "/account", icon: "⚙️", label: "Account Settings" },
]

export default function Sidebar({ eventId }: { eventId?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  const eventNavItems = eventId ? [
    { href: "/events/" + eventId, icon: "📋", label: "Event Details" },
    { href: "/events/" + eventId + "/preview", icon: "👁️", label: "Preview" },
    { href: "/events/" + eventId + "/templates", icon: "🎨", label: "Templates" },
    { href: "/events/" + eventId + "/guests/new", icon: "👥", label: "Upload Wageni" },
    { href: "/events/" + eventId + "/send", icon: "📨", label: "Tuma" },
    { href: "/events/" + eventId + "/rsvp", icon: "✅", label: "RSVP" },
  ] : []

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/landing")
    router.refresh()
  }

  return (
    <aside className={"bg-blue-900 text-white flex flex-col transition-all duration-300 min-h-screen " + (collapsed ? "w-16" : "w-56")}>
      <div className="p-4 border-b border-blue-800 flex items-center justify-between">
        {!collapsed && <span className="font-bold text-lg">🎉 InviteYetu</span>}
        <button onClick={() => setCollapsed(!collapsed)} className="text-blue-300 hover:text-white transition p-1 rounded">
          {collapsed ? "→" : "←"}
        </button>
      </div>

      <nav className="flex-1 py-4 space-y-1 px-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={"flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-sm font-medium " + (pathname === item.href ? "bg-blue-700 text-white" : "text-blue-200 hover:bg-blue-800 hover:text-white")}
          >
            <span className="text-lg flex-shrink-0">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}

        {eventNavItems.length > 0 && (
          <>
            {!collapsed && <div className="text-xs text-blue-400 px-3 pt-4 pb-1 uppercase tracking-wider">Tukio</div>}
            {eventNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={"flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-sm font-medium " + (pathname === item.href ? "bg-blue-700 text-white" : "text-blue-200 hover:bg-blue-800 hover:text-white")}
              >
                <span className="text-lg flex-shrink-0">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </>
        )}
      </nav>

      <div className="p-2 border-t border-blue-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-sm font-medium text-blue-200 hover:bg-blue-800 hover:text-white w-full"
        >
          <span className="text-lg flex-shrink-0">🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}