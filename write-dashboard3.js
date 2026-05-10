const fs = require("fs");
const content = `import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: events } = await supabase
    .from("events")
    .select("*, guests(count)")
    .order("created_at", { ascending: false })

  const eventList = events ?? []
  const totalGuests = eventList.reduce((sum, e) => sum + (e.guests?.[0]?.count ?? 0), 0)
  const latestEvent = eventList[0] ?? null

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Msaada / Support:</span>
          <a href="https://wa.me/255653578184" target="_blank" className="flex items-center gap-1 text-green-600 font-medium hover:text-green-700">
            💬 WhatsApp
          </a>
        </div>
        {latestEvent && (
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 bg-white shadow-sm">
            <span>📅</span>
            <div className="text-left">
              <p className="font-medium text-gray-900 text-xs">{latestEvent.name}</p>
              <p className="text-gray-400 text-xs">{new Date(latestEvent.date).toLocaleDateString("sw-TZ", { day: "2-digit", month: "2-digit", year: "numeric" })}</p>
            </div>
            <span className="text-gray-400">▾</span>
          </div>
        )}
      </header>

      <div className="flex-1 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            {latestEvent && <p className="text-gray-500 text-sm mt-1">Overview for {latestEvent.name}</p>}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg mb-3" style={{ background: "#1e3a5f" }}>📅</div>
              <p className="text-2xl font-bold text-gray-900">{eventList.length}</p>
              <p className="text-gray-500 text-sm mt-1">Total Events</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg mb-3" style={{ background: "#1e3a5f" }}>👥</div>
              <p className="text-2xl font-bold text-gray-900">{totalGuests}</p>
              <p className="text-gray-500 text-sm mt-1">Total Guests</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg mb-3" style={{ background: "#1e3a5f" }}>📨</div>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-gray-500 text-sm mt-1">Sent Cards</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg mb-3" style={{ background: "#1e3a5f" }}>💰</div>
              <p className="text-2xl font-bold text-gray-900">0 TSH</p>
              <p className="text-gray-500 text-sm mt-1">Total Spent</p>
            </div>
          </div>

          {eventList.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-3xl mx-auto mb-4">📅</div>
              <p className="text-xl font-semibold text-gray-900 mb-2">Hakuna Tukio Bado</p>
              <p className="text-gray-500 mb-6 text-sm">Unda tukio lako la kwanza sasa hivi</p>
              <Link href="/events/new" className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition" style={{ background: "linear-gradient(135deg, #B8960C, #FFD700)", color: "#1a1200" }}>
                + Unda Tukio Jipya
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">Event Details</h2>
                <Link href={"/events/" + latestEvent?.id} className="text-sm font-medium hover:underline" style={{ color: "#B8960C" }}>View All</Link>
              </div>
              {latestEvent && (
                <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Event Name</p>
                    <p className="font-semibold text-gray-900 text-sm">{latestEvent.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Category</p>
                    <p className="font-semibold text-gray-900 text-sm uppercase">{latestEvent.event_type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Date</p>
                    <p className="font-semibold text-gray-900 text-sm">{new Date(latestEvent.date).toLocaleDateString("sw-TZ", { day: "2-digit", month: "2-digit", year: "numeric" })}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Location</p>
                    <p className="font-semibold text-gray-900 text-sm">{latestEvent.venue || "Haijawekwa"}</p>
                  </div>
                </div>
              )}
              {eventList.length > 1 && (
                <div className="px-5 pb-5">
                  <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider">Matukio Mengine</p>
                  <div className="space-y-2">
                    {eventList.slice(1).map((event) => (
                      <Link key={event.id} href={"/events/" + event.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-yellow-300 hover:bg-yellow-50 transition">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{event.name}</p>
                          <p className="text-xs text-gray-400">{new Date(event.date).toLocaleDateString("sw-TZ")} {event.venue ? "• " + event.venue : ""}</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full uppercase" style={{ background: "#FFF8DC", color: "#B8960C" }}>{event.event_type}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-6 right-6">
        <Link href="/events/new" className="flex items-center gap-2 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:opacity-90 transition" style={{ background: "linear-gradient(135deg, #1e3a5f, #2d5a8e)", color: "white" }}>
          + Create Event
        </Link>
      </div>
    </div>
  )
}`;
fs.writeFileSync("app/dashboard/page.tsx", content, "utf8");
console.log("Dashboard imeandikwa!");
