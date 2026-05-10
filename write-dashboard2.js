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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Msaada / Support:</span>
          <a href="https://wa.me/255653578184" target="_blank" className="flex items-center gap-1 text-green-600 font-medium hover:text-green-700">
            💬 WhatsApp
          </a>
        </div>
        <div className="flex items-center gap-3">
          <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400">
            <option>📅 Chagua Tukio</option>
            {eventList.map(e => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
        </div>
      </header>

      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Simamia matukio na wageni wako</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center shadow-sm">
            <p className="text-3xl font-bold" style={{ color: "#B8960C" }}>{eventList.length}</p>
            <p className="text-gray-500 text-sm mt-1">Matukio</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center shadow-sm">
            <p className="text-3xl font-bold" style={{ color: "#B8960C" }}>{totalGuests}</p>
            <p className="text-gray-500 text-sm mt-1">Wageni Wote</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center shadow-sm">
            <p className="text-3xl font-bold" style={{ color: "#B8960C" }}>0</p>
            <p className="text-gray-500 text-sm mt-1">RSVP</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center shadow-sm">
            <p className="text-3xl font-bold" style={{ color: "#B8960C" }}>0</p>
            <p className="text-gray-500 text-sm mt-1">Wamefika</p>
          </div>
        </div>

        {eventList.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-3xl mx-auto mb-4">📅</div>
            <p className="text-xl font-semibold text-gray-900 mb-2">Hakuna Tukio Lililochaguliwa</p>
            <p className="text-gray-500 mb-6 text-sm">Chagua tukio lililopo au tengeneza jipya kuona dashboard</p>
            <Link href="/events/new" className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition" style={{ background: "linear-gradient(135deg, #B8960C, #FFD700)" }}>
              + Unda Tukio Jipya
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {eventList.map((event) => (
              <Link key={event.id} href={"/events/" + event.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: "linear-gradient(135deg, #FFF8DC, #FFD700)" }}>
                    {event.event_type === "wedding" ? "💍" : event.event_type === "birthday" ? "🎂" : event.event_type === "graduation" ? "🎓" : event.event_type === "sendoff" ? "✈️" : event.event_type === "kitchen" ? "🍽️" : "🎉"}
                  </div>
                  <div>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "#FFF8DC", color: "#B8960C" }}>{event.event_type}</span>
                    <h2 className="text-lg font-semibold text-gray-900 mt-1 group-hover:text-yellow-700 transition">{event.name}</h2>
                    <p className="text-gray-500 text-sm">
                      📅 {new Date(event.date).toLocaleDateString("sw-TZ", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                      {event.venue && " • 📍 " + event.venue}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold" style={{ color: "#B8960C" }}>{event.guests?.[0]?.count ?? 0}</p>
                  <p className="text-gray-400 text-sm">wageni</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-6 right-6">
        <Link href="/events/new" className="flex items-center gap-2 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:opacity-90 transition" style={{ background: "linear-gradient(135deg, #B8960C, #FFD700)" }}>
          + Unda Tukio
        </Link>
      </div>
    </div>
  )
}`;
fs.writeFileSync("app/dashboard/page.tsx", content, "utf8");
console.log("Dashboard imeandikwa!");
