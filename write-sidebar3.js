const fs = require("fs");
const content = `"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"

export default function Sidebar({ eventId }: { eventId?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  const baseItems = [
    { href: "/dashboard", icon: "📊", label: "Dashboard" },
  ]

  const eventItems = eventId && eventId !== "new" ? [
    { href: "/events/" + eventId, icon: "📋", label: "Event Details" },
    { href: "/events/" + eventId + "/preview", icon: "👁️", label: "Preview" },
    { href: "/events/" + eventId + "/templates", icon: "🎨", label: "Templates" },
    { href: "/events/" + eventId + "/guests/new", icon: "👥", label: "Upload Wageni" },
    { href: "/events/" + eventId + "/send", icon: "📨", label: "Tuma" },
    { href: "/events/" + eventId + "/rsvp-list", icon: "✅", label: "RSVP" },
  ] : [
    { href: "/events/new", icon: "📋", label: "Event Details" },
    { href: "#", icon: "👁️", label: "Preview" },
    { href: "#", icon: "💰", label: "Pricing" },
    { href: "#", icon: "🎨", label: "Templates" },
    { href: "#", icon: "👥", label: "Upload Wageni" },
    { href: "#", icon: "📨", label: "Tuma" },
    { href: "#", icon: "✅", label: "RSVP" },
    { href: "/checkin", icon: "📷", label: "Scan" },
    { href: "#", icon: "👛", label: "Wallet" },
  ]

  const bottomItems = [
    { href: "/account", icon: "⚙️", label: "Account Settings" },
  ]

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/landing")
    router.refresh()
  }

  const activeStyle = { background: "rgba(255,215,0,0.15)", color: "#FFD700", border: "1px solid rgba(255,215,0,0.3)" }
  const inactiveStyle = { color: "#C9A84C" }
  const sidebarBg = { background: "linear-gradient(180deg, #1a1200 0%, #3d2b00 50%, #5c4000 100%)" }

  return (
    <aside style={sidebarBg} className={"text-white flex flex-col transition-all duration-300 min-h-screen shadow-xl flex-shrink-0 " + (collapsed ? "w-16" : "w-56")}>
      <div className="p-4 border-b border-yellow-900 flex items-center justify-between">
        {!collapsed && (
          <div>
            <span className="font-bold text-lg" style={{ color: "#FFD700" }}>🎉 InviteYetu</span>
            <p className="text-xs" style={{ color: "#8B6914" }}>Digital Invitations</p>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="hover:text-yellow-400 transition p-1 rounded text-lg" style={{ color: "#FFD700" }}>
          {collapsed ? "▶" : "✕"}
        </button>
      </div>

      <nav className="flex-1 py-3 space-y-0.5 px-2 overflow-y-auto">
        {baseItems.map((item) => (
          <Link key={item.href} href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-sm font-medium"
            style={pathname === item.href ? activeStyle : inactiveStyle}
          >
            <span className="text-base flex-shrink-0">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}

        {eventItems.map((item) => (
          <Link key={item.href + item.label} href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-sm font-medium"
            style={pathname === item.href ? activeStyle : inactiveStyle}
          >
            <span className="text-base flex-shrink-0">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}

        {bottomItems.map((item) => (
          <Link key={item.href} href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-sm font-medium"
            style={pathname === item.href ? activeStyle : inactiveStyle}
          >
            <span className="text-base flex-shrink-0">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="p-2 border-t border-yellow-900">
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-sm font-medium w-full"
          style={inactiveStyle}
        >
          <span className="text-base flex-shrink-0">🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}`;
fs.writeFileSync("components/Sidebar.tsx", content, "utf8");
console.log("Sidebar imeandikwa!");
