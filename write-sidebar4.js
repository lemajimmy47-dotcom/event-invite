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

  const activeStyle = { background: "rgba(255,215,0,0.15)", color: "#FFD700", border: "1px solid rgba(255,215,0,0.3)" }
  const inactiveStyle = { color: "#C9A84C" }
  const sidebarBg = { background: "linear-gradient(180deg, #1a1200 0%, #3d2b00 50%, #5c4000 100%)" }

  const isActive = (href: string) => pathname === href

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/landing")
    router.refresh()
  }

  const hasEvent = eventId && eventId !== "new"

  const topItems = [
    { href: "/dashboard", icon: "📊", label: "Dashboard" },
  ]

  const eventItems = hasEvent ? [
    { href: "/events/" + eventId, icon: "📋", label: "Event Details" },
    { href: "/events/" + eventId + "/preview", icon: "👁️", label: "Preview" },
    { href: "/events/" + eventId + "/templates", icon: "🎨", label: "Templates" },
    { href: "/events/" + eventId + "/guests", icon: "👥", label: "Upload Wageni" },
    { href: "/events/" + eventId + "/send", icon: "📨", label: "Tuma" },
    { href: "/events/" + eventId + "/rsvp-list", icon: "✅", label: "RSVP" },
    { href: "/checkin", icon: "📷", label: "Scan" },
  ] : [
    { href: "#", icon: "📋", label: "Event Details", disabled: true },
    { href: "#", icon: "👁️", label: "Preview", disabled: true },
    { href: "#", icon: "🎨", label: "Templates", disabled: true },
    { href: "#", icon: "👥", label: "Upload Wageni", disabled: true },
    { href: "#", icon: "📨", label: "Tuma", disabled: true },
    { href: "#", icon: "✅", label: "RSVP", disabled: true },
    { href: "/checkin", icon: "📷", label: "Scan" },
  ]

  const bottomItems = [
    { href: "/account", icon: "⚙️", label: "Account Settings" },
  ]

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
        {topItems.map((item) => (
          <Link key={item.href} href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-sm font-medium"
            style={isActive(item.href) ? activeStyle : inactiveStyle}
          >
            <span className="text-base flex-shrink-0">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}

        {!collapsed && (
          <div className="text-xs px-3 pt-3 pb-1 uppercase tracking-wider" style={{ color: "#8B6914" }}>
            {hasEvent ? "Tukio" : "Chagua Tukio Kwanza"}
          </div>
        )}

        {eventItems.map((item: any) => (
          item.disabled ? (
            <div key={item.label}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium cursor-not-allowed opacity-40"
              style={inactiveStyle}
              title="Chagua tukio kwanza"
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </div>
          ) : (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-sm font-medium"
              style={isActive(item.href) ? activeStyle : inactiveStyle}
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        ))}

        {!collapsed && <div className="text-xs px-3 pt-3 pb-1 uppercase tracking-wider" style={{ color: "#8B6914" }}>General</div>}

        {bottomItems.map((item) => (
          <Link key={item.href} href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-sm font-medium"
            style={isActive(item.href) ? activeStyle : inactiveStyle}
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
