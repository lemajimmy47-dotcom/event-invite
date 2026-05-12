"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"

export default function Sidebar({ eventId }: { eventId?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [firstEventId, setFirstEventId] = useState<string | null>(null)

  useEffect(() => {
    async function loadFirstEvent() {
      const supabase = createClient()
      const { data } = await supabase
        .from("events")
        .select("id")
        .order("created_at", { ascending: false })
        .limit(1)
        .single()
      if (data) setFirstEventId(data.id)
    }
    loadFirstEvent()
  }, [])

  const activeId = eventId && eventId !== "new" ? eventId : firstEventId

  const activeStyle = { background: "rgba(255,215,0,0.15)", color: "#FFD700", border: "1px solid rgba(255,215,0,0.3)" }
  const inactiveStyle = { color: "#C9A84C" }
  const disabledStyle = { color: "#5a4a2a", cursor: "not-allowed" }
  const sidebarBg = { background: "linear-gradient(180deg, #1a1200 0%, #3d2b00 50%, #5c4000 100%)" }

  const isActive = (href: string) => pathname === href

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/landing")
    router.refresh()
  }

  const eventItems = [
    { label: "Event Details", icon: "📋", path: activeId ? "/events/" + activeId : null },
    { label: "Preview", icon: "👁️", path: activeId ? "/events/" + activeId + "/preview" : null },
    { label: "Templates", icon: "🎨", path: activeId ? "/events/" + activeId + "/templates" : null },{ label: "Card Designer", icon: "✏️", path: activeId ? "/events/" + activeId + "/editor" : null },
    { label: "Upload Wageni", icon: "👥", path: activeId ? "/events/" + activeId + "/guests" : null },
    { label: "Tuma", icon: "📨", path: activeId ? "/events/" + activeId + "/send" : null },
    { label: "RSVP", icon: "✅", path: activeId ? "/events/" + activeId + "/rsvp-list" : null },
    { label: "Scan", icon: "📷", path: "/checkin" },
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
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-sm font-medium"
          style={isActive("/dashboard") ? activeStyle : inactiveStyle}
        >
          <span className="text-base flex-shrink-0">📊</span>
          {!collapsed && <span>Dashboard</span>}
        </Link>

        {!collapsed && (
          <div className="text-xs px-3 pt-3 pb-1 uppercase tracking-wider" style={{ color: "#8B6914" }}>
            {activeId ? "Tukio" : "Chagua Tukio Kwanza"}
          </div>
        )}

        {eventItems.map((item) => (
          item.path ? (
            <Link
              key={item.label}
              href={item.path}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-sm font-medium"
              style={isActive(item.path) ? activeStyle : inactiveStyle}
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ) : (
            <div
              key={item.label}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium opacity-30"
              style={disabledStyle}
              title="Unda tukio kwanza"
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </div>
          )
        ))}

        {!collapsed && <div className="text-xs px-3 pt-3 pb-1 uppercase tracking-wider" style={{ color: "#8B6914" }}>General</div>}

        <Link
          href="/account"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-sm font-medium"
          style={isActive("/account") ? activeStyle : inactiveStyle}
        >
          <span className="text-base flex-shrink-0">⚙️</span>
          {!collapsed && <span>Account Settings</span>}
        </Link>
      </nav>

      <div className="p-2 border-t border-yellow-900">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-sm font-medium w-full"
          style={inactiveStyle}
        >
          <span className="text-base flex-shrink-0">🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}