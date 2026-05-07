import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: events } = await supabase
    .from('events')
    .select('*, guests(count)')
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Event Invite System</h1>
            <p className="text-gray-500 mt-1">Simamia matukio na wageni wako</p>
          </div>
          <Link
            href="/events/new"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            + Tukio Jipya
          </Link>
        </div>

        {events?.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
            <p className="text-5xl mb-4">🎉</p>
            <p className="text-gray-500 text-lg">Hakuna matukio bado</p>
            <Link href="/events/new" className="text-blue-600 mt-2 inline-block hover:underline">
              Unda tukio lako la kwanza
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {events?.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {event.event_type}
                  </span>
                  <h2 className="text-xl font-semibold text-gray-900 mt-2">{event.name}</h2>
                  <p className="text-gray-500 text-sm mt-1">
                    📅 {new Date(event.date).toLocaleDateString('sw-TZ', {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                  {event.venue && <p className="text-gray-400 text-sm">📍 {event.venue}</p>}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    {(event.guests as any)?.[0]?.count ?? 0}
                  </p>
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