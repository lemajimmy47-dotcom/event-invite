const fs = require("fs");
const content = `"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"

const navItems = [
  { href: "/dashboard", icon: "📊", label: "Dashboard" },
  { href: "/events/new", icon: "📋", label: "Event Details" },
  { href: "/checkin", icon: "📷", label: "Scan" },
  { href: "/account", icon: "⚙️", label: "Account Settings" },
]

export default function Sidebar({ eventId }: { eventId?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  const eventNavItems = eventId && eventId !== "new" ? [
    { href: "/events/" + eventId, icon: "📋", label: "Event Details" },
    { href: "/events/" + eventId + "/preview", icon: "👁️", label: "Preview" },
    { href: "/events/" + eventId + "/templates", icon: "🎨", label: "Templates" },
    { href: "/events/" + eventId + "/guests/new", icon: "👥", label: "Upload Wageni" },
    { href: "/events/" + eventId + "/send", icon: "📨", label: "Tuma" },
    { href: "/events/" + eventId + "/rsvp-list", icon: "✅", label: "RSVP" },
  ] : []

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/landing")
    router.refresh()
  }

  return (
    <aside style={{ background: "linear-gradient(180deg, #1a1200 0%, #3d2b00 50%, #5c4000 100%)" }} className={"text-white flex flex-col transition-all duration-300 min-h-screen shadow-xl " + (collapsed ? "w-16" : "w-56")}>
      <div className="p-4 border-b border-yellow-800 flex items-center justify-between">
        {!collapsed && (
          <div>
            <span className="font-bold text-lg" style={{ color: "#FFD700" }}>🎉 InviteYetu</span>
            <p className="text-xs" style={{ color: "#B8960C" }}>Digital Invitations</p>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="hover:text-yellow-400 transition p-1 rounded" style={{ color: "#FFD700" }}>
          {collapsed ? "▶" : "✕"}
        </button>
      </div>

      <nav className="flex-1 py-4 space-y-1 px-2">
        {navItems.slice(0, 1).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={"flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-sm font-medium " + (pathname === item.href ? "text-white" : "hover:text-yellow-300")}
            style={pathname === item.href ? { background: "rgba(255,215,0,0.2)", color: "#FFD700", border: "1px solid rgba(255,215,0,0.3)" } : { color: "#C9A84C" }}
          >
            <span className="text-lg flex-shrink-0">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}

        {eventNavItems.length > 0 && (
          <>
            {!collapsed && <div className="text-xs px-3 pt-4 pb-1 uppercase tracking-wider" style={{ color: "#8B6914" }}>Tukio</div>}
            {eventNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={"flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-sm font-medium"}
                style={pathname === item.href ? { background: "rgba(255,215,0,0.2)", color: "#FFD700", border: "1px solid rgba(255,215,0,0.3)" } : { color: "#C9A84C" }}
              >
                <span className="text-lg flex-shrink-0">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </>
        )}

        {!collapsed && <div className="text-xs px-3 pt-4 pb-1 uppercase tracking-wider" style={{ color: "#8B6914" }}>General</div>}
        {navItems.slice(1).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={"flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-sm font-medium"}
            style={pathname === item.href ? { background: "rgba(255,215,0,0.2)", color: "#FFD700", border: "1px solid rgba(255,215,0,0.3)" } : { color: "#C9A84C" }}
          >
            <span className="text-lg flex-shrink-0">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="p-2 border-t border-yellow-900">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-sm font-medium w-full hover:text-yellow-300"
          style={{ color: "#C9A84C" }}
        >
          <span className="text-lg flex-shrink-0">🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}`;
fs.writeFileSync("components/Sidebar.tsx", content, "utf8");
console.log("Sidebar imeandikwa!");
