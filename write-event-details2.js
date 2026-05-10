const fs = require("fs");
const content = `import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"

type Props = { params: Promise<{ id: string }> }

export default async function EventPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: event } = await supabase.from("events").select("*").eq("id", id).single()
  if (!event) notFound()

  const { data: guests } = await supabase
    .from("guests")
    .select("*, rsvp_responses(*), checkins(*)")
    .eq("event_id", id)
    .order("created_at", { ascending: false })

  const guestList = guests ?? []
  const attending = guestList.filter(g => g.rsvp_responses?.[0]?.status === "attending").length
  const notAttending = guestList.filter(g => g.rsvp_responses?.[0]?.status === "not_attending").length
  const checkedIn = guestList.filter(g => g.checkins?.length > 0).length
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

  const eventTypeEmoji: Record<string, string> = {
    wedding: "💍", sendoff: "✈️", invitation: "👥", meeting: "💼",
    contribution: "💰", ticket: "🎫", custom: "🎉", bulksend: "📨"
  }
  const emoji = eventTypeEmoji[event.event_type] || "🎉"

  const sectionStyle = { background: "#1e3a5f" }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Msaada / Support:</span>
          <a href="https://wa.me/255653578184" target="_blank" className="flex items-center gap-1 text-green-600 font-medium">💬 WhatsApp</a>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">Event Details</span>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl" style={{ background: "#1e3a5f" }}>
            {emoji}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{event.name}</h1>
            <p className="text-sm text-gray-500 uppercase tracking-wider font-medium">{event.event_type}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={sectionStyle}>01</div>
              <h2 className="font-bold text-gray-900">Event Information</h2>
            </div>
            <div className="px-6 py-5 grid grid-cols-2 gap-8">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Sender ID</p>
                <span className="inline-block border border-gray-300 text-gray-700 text-sm px-3 py-1 rounded-lg font-medium">{event.sender_id || event.event_type?.toUpperCase()}</span>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Event Name</p>
                <p className="font-semibold text-gray-900">{event.name}</p>
              </div>
            </div>
            <div className="px-6 pb-5 border-t border-gray-50">
              <div className="grid grid-cols-4 gap-4 mt-4">
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-blue-700">{guestList.length}</p>
                  <p className="text-xs text-gray-500 mt-1">Wageni</p>
                </div>
                <div className="bg-green-50 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-green-700">{attending}</p>
                  <p className="text-xs text-gray-500 mt-1">Watahudhuria</p>
                </div>
                <div className="bg-red-50 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-red-600">{notAttending}</p>
                  <p className="text-xs text-gray-500 mt-1">Hawatahudhuria</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-purple-700">{checkedIn}</p>
                  <p className="text-xs text-gray-500 mt-1">Wamefika</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={sectionStyle}>02</div>
              <h2 className="font-bold text-gray-900">Event Timing</h2>
            </div>
            <div className="px-6 py-5 grid grid-cols-3 gap-8">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Event Date</p>
                <p className="font-bold text-gray-900 flex items-center gap-2">
                  <span className="text-gray-400">📅</span>
                  {new Date(event.date).toLocaleDateString("sw-TZ", { day: "2-digit", month: "2-digit", year: "numeric" })}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Start Time</p>
                <p className="font-bold text-gray-900 flex items-center gap-2">
                  <span className="text-gray-400">🕐</span>
                  {event.event_time || "Haijawekwa"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Time Period</p>
                <p className="font-bold text-gray-900">{event.time_period || "—"}</p>
              </div>
            </div>
          </div>

          {event.religious_site && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={sectionStyle}>03</div>
                <h2 className="font-bold text-gray-900">Religious Service</h2>
              </div>
              <div className="px-6 py-5 grid grid-cols-2 gap-8">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Religious Site</p>
                  <p className="font-semibold text-gray-900">⛪ {event.religious_site}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Service Time</p>
                  <p className="font-semibold text-gray-900">🕐 {event.religious_time || "—"}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={sectionStyle}>04</div>
              <h2 className="font-bold text-gray-900">Event Location</h2>
            </div>
            <div className="px-6 py-5 grid grid-cols-2 gap-8">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Event Hall Name</p>
                <p className="font-bold text-gray-900 flex items-center gap-2">
                  <span className="text-gray-400">📍</span>
                  {event.venue || <span className="text-gray-300 font-normal italic">Haijawekwa</span>}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Coordinates</p>
                {event.coordinates ? (
                  <a href={"https://maps.google.com/?q=" + event.coordinates} target="_blank" className="font-semibold text-blue-600 hover:underline text-sm">
                    🗺️ {event.coordinates}
                  </a>
                ) : (
                  <p className="text-gray-300 italic text-sm">Coordinates not provided</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={sectionStyle}>05</div>
              <h2 className="font-bold text-gray-900">Host & Details</h2>
            </div>
            <div className="px-6 py-5 grid grid-cols-2 gap-8">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Host Name</p>
                <p className="font-semibold text-gray-900 flex items-center gap-2">
                  <span className="text-gray-400">👤</span>
                  {event.host_name || <span className="text-gray-300 font-normal italic">Host not listed</span>}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Dress Code</p>
                {event.dress_code ? (
                  <div className="border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 inline-flex items-center gap-2">
                    <span>👗</span> {event.dress_code}
                  </div>
                ) : (
                  <p className="text-gray-300 italic text-sm border border-gray-100 rounded-xl px-4 py-2 inline-block">Standard criteria protocol applies.</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={sectionStyle}>06</div>
              <h2 className="font-bold text-gray-900">RSVP Contacts</h2>
            </div>
            <div className="px-6 py-5 grid grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-xl p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">RSVP 1</p>
                <p className="font-semibold text-gray-900 flex items-center gap-2">
                  <span className="text-gray-400">📞</span>
                  {event.rsvp_contact1 || <span className="text-gray-300 font-normal italic">None</span>}
                </p>
              </div>
              <div className="border border-gray-200 rounded-xl p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">RSVP 2</p>
                <p className="font-semibold text-gray-900 flex items-center gap-2">
                  <span className="text-gray-400">📞</span>
                  {event.rsvp_contact2 || <span className="text-gray-300 font-normal italic">None</span>}
                </p>
              </div>
              <div className="border border-gray-200 rounded-xl p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">RSVP 3</p>
                <p className="font-semibold text-gray-900 flex items-center gap-2">
                  <span className="text-gray-400">📞</span>
                  {event.rsvp_contact3 || <span className="text-gray-300 font-normal italic">None</span>}
                </p>
              </div>
            </div>
            <div className="px-6 pb-4 flex items-center justify-between text-xs text-gray-400">
              <span>Updated: {new Date(event.updated_at || event.created_at).toLocaleDateString()}</span>
              <span>Created: {new Date(event.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={sectionStyle}>07</div>
                <h2 className="font-bold text-gray-900">Orodha ya Wageni</h2>
              </div>
              <Link href={"/events/" + id + "/guests/new"} className="text-sm text-white px-4 py-2 rounded-xl font-medium hover:opacity-90 transition" style={{ background: "linear-gradient(135deg, #1e3a5f, #2d5a8e)" }}>
                + Ongeza Wageni
              </Link>
            </div>
            {guestList.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-3">👥</p>
                <p className="text-gray-500 text-sm">Hakuna wageni bado</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {guestList.map((guest) => {
                  const rsvp = guest.rsvp_responses?.[0]?.status
                  const isCheckedIn = guest.checkins?.length > 0
                  const invitationLink = APP_URL + "/api/invitation/" + guest.qr_token
                  const waMsg = "Karibu " + guest.name + "! Umealikwa kwenye " + event.name + ". Pakua invitation yako hapa: " + invitationLink
                  const waLink = "https://wa.me/" + (guest.phone?.replace(/^0/, "255") ?? "") + "?text=" + encodeURIComponent(waMsg)
                  return (
                    <div key={guest.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: "#1e3a5f" }}>
                          {guest.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium text-gray-900 text-sm">{guest.name}</p>
                            {guest.guest_code && <span className="text-xs font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{guest.guest_code}</span>}
                            {isCheckedIn && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">✓ Amefika</span>}
                            <span className={"text-xs px-2 py-0.5 rounded-full " + (rsvp === "attending" ? "bg-green-100 text-green-700" : rsvp === "not_attending" ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500")}>
                              {rsvp === "attending" ? "✅ Atahudhuria" : rsvp === "not_attending" ? "❌ Hatahudhuria" : "⏳ Hajajibu"}
                            </span>
                          </div>
                          {guest.phone && <p className="text-gray-400 text-xs mt-0.5">📱 {guest.phone}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {guest.phone && (
                          <a href={waLink} target="_blank" rel="noopener noreferrer" className="text-xs text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition" style={{ background: "#25D366" }}>
                            📲
                          </a>
                        )}
                        <a href={invitationLink} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1.5 rounded-lg transition" style={{ background: "#FFF8DC", color: "#B8960C" }}>
                          🎫
                        </a>
                        <Link href={"/events/" + id + "/guests/" + guest.id} className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition">
                          ✏️
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 right-6">
        <Link href={"/events/" + id + "/edit"} className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold shadow-lg hover:opacity-90 transition text-sm" style={{ background: "linear-gradient(135deg, #1e3a5f, #2d5a8e)", color: "white" }}>
          ✏️ Edit Event
        </Link>
      </div>
    </div>
  )
}`;
fs.writeFileSync("app/events/[id]/page.tsx", content, "utf8");
console.log("Event details page imeandikwa!");
