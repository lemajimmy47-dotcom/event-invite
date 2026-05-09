import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import CardUpload from "@/components/CardUpload"

type Props = { params: Promise<{ id: string }> }

export default async function EventPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: event } = await supabase.from("events").select("*").eq("id", id).single()
  if (!event) notFound()
  const { data: guests } = await supabase.from("guests").select("*, rsvp_responses(*), checkins(*)").eq("event_id", id).order("created_at", { ascending: false })
  const guestList = guests ?? []
  const attending = guestList.filter(g => g.rsvp_responses?.[0]?.status === "attending").length
  const notAttending = guestList.filter(g => g.rsvp_responses?.[0]?.status === "not_attending").length
  const checkedIn = guestList.filter(g => g.checkins?.length > 0).length
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 my-6">
          <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{event.event_type}</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">{event.name}</h1>
          <p className="text-gray-500 mt-1">{new Date(event.date).toLocaleDateString("sw-TZ", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
          {event.venue && <p className="text-gray-500">📍 {event.venue}</p>}
          {event.description && <p className="text-gray-400 text-sm mt-2">{event.description}</p>}
        </div>

        <CardUpload eventId={id} currentUrl={event.card_image_url} />

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border p-4 text-center"><p className="text-2xl font-bold text-blue-600">{guestList.length}</p><p className="text-gray-500 text-xs mt-1">Wageni Wote</p></div>
          <div className="bg-white rounded-xl border p-4 text-center"><p className="text-2xl font-bold text-green-600">{attending}</p><p className="text-gray-500 text-xs mt-1">Watahudhuria</p></div>
          <div className="bg-white rounded-xl border p-4 text-center"><p className="text-2xl font-bold text-red-600">{notAttending}</p><p className="text-gray-500 text-xs mt-1">Hawatahudhuria</p></div>
          <div className="bg-white rounded-xl border p-4 text-center"><p className="text-2xl font-bold text-purple-600">{checkedIn}</p><p className="text-gray-500 text-xs mt-1">Wamefika</p></div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Orodha ya Wageni</h2>
            <Link href={"/events/" + id + "/guests/new"} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">+ Ongeza Wageni</Link>
          </div>
          {guestList.length === 0 ? (
            <div className="text-center py-12"><p className="text-gray-400">Hakuna wageni bado</p></div>
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
                  <div key={guest.id} className="p-4 flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-gray-900">{guest.name}</p>
                        {guest.guest_code && (
                          <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full border border-gray-200">{guest.guest_code}</span>
                        )}
                        <Link href={"/events/" + id + "/guests/" + guest.id} className="text-xs text-gray-400 hover:text-blue-600 border border-gray-200 px-2 py-0.5 rounded hover:border-blue-300 transition">
                          ✏️ Hariri
                        </Link>
                      </div>
                      {guest.phone && <p className="text-gray-400 text-sm">📱 {guest.phone}</p>}
                      {guest.email && <p className="text-gray-400 text-sm">✉️ {guest.email}</p>}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {isCheckedIn && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">✓ Amefika</span>}
                        <span className={"text-xs px-2 py-1 rounded-full " + (rsvp === "attending" ? "bg-green-100 text-green-700" : rsvp === "not_attending" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-500")}>
                          {rsvp === "attending" ? "✅ Atahudhuria" : rsvp === "not_attending" ? "❌ Hatahudhuria" : "⏳ Hajajibu"}
                        </span>
                      </div>
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {guest.phone && (
                          <a href={waLink} target="_blank" rel="noopener noreferrer" className="text-xs bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition">
                            📲 Tuma WhatsApp
                          </a>
                        )}
                        <a href={invitationLink} target="_blank" rel="noopener noreferrer" className="text-xs bg-pink-100 text-pink-700 px-3 py-1.5 rounded-lg hover:bg-pink-200 transition">
                          🎫 Ona Card
                        </a>
                        <a href={qrLink} download={"QR-" + guest.name + ".png"} className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-200 transition">
                          ⬇ Download QR
                        </a>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-center">
                      <img src={qrLink} alt={"QR ya " + guest.name} width={80} height={80} className="rounded-lg border border-gray-200" />
                      <p className="text-xs text-gray-400 mt-1">QR Code</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
