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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/dashboard" className="hover:text-yellow-700">Dashboard</Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">Event Details</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: "#FFF8DC" }}>
              {emoji}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{event.name}</h1>
              <p className="text-sm text-gray-500 uppercase tracking-wider">{event.event_type}</p>
            </div>
          </div>
          <Link href={"/events/" + id + "/edit"} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 hover:border-yellow-400 transition">
            ✏️ Edit Event
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center shadow-sm">
            <p className="text-2xl font-bold" style={{ color: "#B8960C" }}>{guestList.length}</p>
            <p className="text-gray-500 text-xs mt-1">Wageni Wote</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-green-600">{attending}</p>
            <p className="text-gray-500 text-xs mt-1">Watahudhuria</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-red-500">{notAttending}</p>
            <p className="text-gray-500 text-xs mt-1">Hawatahudhuria</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-purple-600">{checkedIn}</p>
            <p className="text-gray-500 text-xs mt-1">Wamefika</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-1">
              <span className="w-8 h-8 rounded-full text-white text-sm flex items-center justify-center font-bold" style={{ background: "#B8960C" }}>01</span>
              <h2 className="font-bold text-gray-900">Event Information</h2>
            </div>
          </div>
          <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Sender ID</p>
              <span className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-lg font-medium">{event.sender_id || event.event_type?.toUpperCase()}</span>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Event Name</p>
              <p className="font-semibold text-gray-900">{event.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Event Date</p>
              <p className="font-semibold text-gray-900">📅 {new Date(event.date).toLocaleDateString("sw-TZ", { day: "2-digit", month: "2-digit", year: "numeric" })}</p>
            </div>
            {event.event_time && (
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Start Time</p>
                <p className="font-semibold text-gray-900">🕐 {event.event_time} {event.time_period || ""}</p>
              </div>
            )}
            {event.description && (
              <div className="col-span-2">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Maelezo</p>
                <p className="text-gray-700 text-sm">{event.description}</p>
              </div>
            )}
          </div>
        </div>

        {event.religious_site && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full text-white text-sm flex items-center justify-center font-bold" style={{ background: "#B8960C" }}>02</span>
                <h2 className="font-bold text-gray-900">Religious Service Details</h2>
              </div>
            </div>
            <div className="p-6 grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Religious Site</p>
                <p className="font-semibold text-gray-900">⛪ {event.religious_site}</p>
              </div>
              {event.religious_time && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Service Time</p>
                  <p className="font-semibold text-gray-900">🕐 {event.religious_time}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full text-white text-sm flex items-center justify-center font-bold" style={{ background: "#B8960C" }}>03</span>
              <h2 className="font-bold text-gray-900">Location</h2>
            </div>
          </div>
          <div className="p-6 grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Event Hall Name</p>
              <p className="font-semibold text-gray-900">📍 {event.venue || "Haijawekwa"}</p>
            </div>
            {event.coordinates && (
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Coordinates</p>
                <a href={"https://maps.google.com/?q=" + event.coordinates} target="_blank" className="font-semibold text-blue-600 hover:underline text-sm">
                  🗺️ {event.coordinates}
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full text-white text-sm flex items-center justify-center font-bold" style={{ background: "#B8960C" }}>04</span>
              <h2 className="font-bold text-gray-900">Host & Details</h2>
            </div>
          </div>
          <div className="p-6 grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Host Name</p>
              <p className="font-semibold text-gray-900">👤 {event.host_name || "Haijawekwa"}</p>
            </div>
            {event.dress_code && (
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Dress Code</p>
                <span className="inline-block text-sm font-semibold px-3 py-1 rounded-lg" style={{ background: "#FFF8DC", color: "#B8960C" }}>
                  👗 {event.dress_code}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full text-white text-sm flex items-center justify-center font-bold" style={{ background: "#B8960C" }}>05</span>
              <h2 className="font-bold text-gray-900">RSVP Contacts</h2>
            </div>
          </div>
          <div className="p-6 grid grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">RSVP 1</p>
              <p className="font-semibold text-gray-900">📞 {event.rsvp_contact1 || "Haijawekwa"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">RSVP 2</p>
              <p className="font-semibold text-gray-900">{event.rsvp_contact2 ? "📞 " + event.rsvp_contact2 : <span className="text-gray-300">None</span>}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">RSVP 3</p>
              <p className="font-semibold text-gray-900">{event.rsvp_contact3 ? "📞 " + event.rsvp_contact3 : <span className="text-gray-300">None</span>}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full text-white text-sm flex items-center justify-center font-bold" style={{ background: "#B8960C" }}>06</span>
              <h2 className="font-bold text-gray-900">Orodha ya Wageni</h2>
            </div>
            <Link href={"/events/" + id + "/guests/new"} className="text-sm text-white px-4 py-2 rounded-xl font-medium hover:opacity-90 transition" style={{ background: "linear-gradient(135deg, #B8960C, #FFD700)", color: "#1a1200" }}>
              + Ongeza Wageni
            </Link>
          </div>
          {guestList.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">👥</p>
              <p className="text-gray-500">Hakuna wageni bado</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {guestList.map((guest) => {
                const rsvp = guest.rsvp_responses?.[0]?.status
                const isCheckedIn = guest.checkins?.length > 0
                const invitationLink = APP_URL + "/api/invitation/" + guest.qr_token
                const waMsg = "Karibu " + guest.name + "! Umealikwa kwenye " + event.name + ". Pakua invitation yako hapa: " + invitationLink
                const waLink = "https://wa.me/" + (guest.phone?.replace(/^0/, "255") ?? "") + "?text=" + encodeURIComponent(waMsg)
                const qrLink = "/api/qr/" + guest.qr_token
                return (
                  <div key={guest.id} className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: "linear-gradient(135deg, #B8960C, #FFD700)", color: "#1a1200" }}>
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
                        {guest.phone && <p className="text-gray-400 text-xs">📱 {guest.phone}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {guest.phone && (
                        <a href={waLink} target="_blank" rel="noopener noreferrer" className="text-xs bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition">
                          📲 WhatsApp
                        </a>
                      )}
                      <a href={invitationLink} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1.5 rounded-lg transition" style={{ background: "#FFF8DC", color: "#B8960C" }}>
                        🎫 Card
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

        <div className="mt-4 text-xs text-gray-400 text-center">
          Updated: {new Date(event.updated_at || event.created_at).toLocaleDateString()} • Created: {new Date(event.created_at).toLocaleDateString()}
        </div>
      </div>
    </div>
  )
}`;
fs.writeFileSync("app/events/[id]/page.tsx", content, "utf8");
console.log("Event details page imeandikwa!");
