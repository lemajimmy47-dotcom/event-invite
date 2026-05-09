import Link from "next/link"
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
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Simamia matukio na wageni wako</p>
          </div>
          <Link href="/events/new" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
            + Tukio Jipya
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
            <p className="text-3xl font-bold text-blue-600">{eventList.length}</p>
            <p className="text-gray-500 text-sm mt-1">Matukio</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
            <p className="text-3xl font-bold text-green-600">{totalGuests}</p>
            <p className="text-gray-500 text-sm mt-1">Wageni Wote</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
            <p className="text-3xl font-bold text-purple-600">0</p>
            <p className="text-gray-500 text-sm mt-1">RSVP</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
            <p className="text-3xl font-bold text-orange-600">0</p>
            <p className="text-gray-500 text-sm mt-1">Wamefika</p>
          </div>
        </div>

        {eventList.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
            <p className="text-6xl mb-4">🎉</p>
            <p className="text-xl font-semibold text-gray-900 mb-2">Hakuna matukio bado</p>
            <p className="text-gray-500 mb-6">Unda tukio lako la kwanza sasa hivi</p>
            <Link href="/events/new" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
              + Unda Tukio
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {eventList.map((event) => (
              <Link key={event.id} href={"/events/" + event.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">
                    {event.event_type === "wedding" ? "💍" : event.event_type === "birthday" ? "🎂" : event.event_type === "graduation" ? "🎓" : event.event_type === "sendoff" ? "✈️" : event.event_type === "kitchen" ? "🍽️" : "🎉"}
                  </div>
                  <div>
                    <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{event.event_type}</span>
                    <h2 className="text-lg font-semibold text-gray-900 mt-1">{event.name}</h2>
                    <p className="text-gray-500 text-sm">
                      📅 {new Date(event.date).toLocaleDateString("sw-TZ", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                      {event.venue && " • 📍 " + event.venue}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{event.guests?.[0]?.count ?? 0}</p>
                  <p className="text-gray-400 text-sm">wageni</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}