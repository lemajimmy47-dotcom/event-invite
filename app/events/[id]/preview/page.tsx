"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

export default function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const [eventId, setEventId] = useState("")
  const [event, setEvent] = useState<any>(null)
  const [guests, setGuests] = useState<any[]>([])
  const [selectedGuest, setSelectedGuest] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://event-invite-rouge.vercel.app"

  useEffect(() => {
    async function load() {
      const { id } = await params
      setEventId(id)
      const supabase = createClient()
      const { data: ev } = await supabase.from("events").select("*").eq("id", id).single()
      setEvent(ev)
      const { data: gs } = await supabase.from("guests").select("*").eq("event_id", id).order("created_at", { ascending: false })
      setGuests(gs || [])
      if (gs && gs.length > 0) setSelectedGuest(gs[0])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="flex items-center justify-center min-h-screen"><p className="text-gray-500">Inapakia...</p></div>

  const invitationLink = selectedGuest ? APP_URL + "/api/invitation/" + selectedGuest.qr_token : ""
  const rsvpLink = selectedGuest ? APP_URL + "/rsvp/" + selectedGuest.qr_token : ""

  const eventTypeEmoji: Record<string, string> = {
    wedding: "💍", sendoff: "✈️", invitation: "👥", meeting: "💼",
    contribution: "💰", ticket: "🎫", custom: "🎉", bulksend: "📨"
  }
  const emoji = event ? (eventTypeEmoji[event.event_type] || "🎉") : "🎉"

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/dashboard" className="hover:text-yellow-700">Dashboard</Link>
          <span>›</span>
          <Link href={"/events/" + eventId} className="hover:text-yellow-700">Event Details</Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">Preview</span>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">👁️ Preview ya Mwaliko</h1>
          <p className="text-sm text-gray-500 mt-1">{event?.name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">👥 Chagua Mgeni</h3>
              {guests.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-400 text-sm">Hakuna wageni bado</p>
                  <Link href={"/events/" + eventId + "/guests/new"} className="text-xs text-yellow-700 hover:underline mt-2 block">+ Ongeza Wageni</Link>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {guests.map((guest) => (
                    <button
                      key={guest.id}
                      onClick={() => setSelectedGuest(guest)}
                      className={"w-full flex items-center gap-3 p-3 rounded-xl text-left transition " + (selectedGuest?.id === guest.id ? "border-2 border-yellow-400 bg-yellow-50" : "border border-gray-200 hover:border-gray-300")}
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: "linear-gradient(135deg, #B8960C, #FFD700)", color: "#1a1200" }}>
                        {guest.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{guest.name}</p>
                        {guest.guest_code && <p className="text-xs font-mono text-gray-400">{guest.guest_code}</p>}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedGuest && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">🔗 Links za Mgeni</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Invitation Card</p>
                    <a href={invitationLink} target="_blank" className="text-xs text-blue-600 hover:underline break-all">{invitationLink}</a>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">RSVP Link</p>
                    <a href={rsvpLink} target="_blank" className="text-xs text-blue-600 hover:underline break-all">{rsvpLink}</a>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <a href={invitationLink} target="_blank" className="flex-1 text-center text-xs py-2 rounded-lg font-medium hover:opacity-90 transition" style={{ background: "linear-gradient(135deg, #B8960C, #FFD700)", color: "#1a1200" }}>
                      🎫 Ona Card
                    </a>
                    <a href={rsvpLink} target="_blank" className="flex-1 text-center text-xs py-2 rounded-lg font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition">
                      ✅ Ona RSVP
                    </a>
                  </div>
                  {selectedGuest.phone && (
                    
                      href={"https://wa.me/" + selectedGuest.phone.replace(/^0/, "255") + "?text=" + encodeURIComponent("Karibu " + selectedGuest.name + "! Umealikwa kwenye " + event?.name + ". Pakua invitation yako hapa: " + invitationLink)}
                      target="_blank"
                      className="block w-full text-center text-xs py-2 rounded-lg font-medium bg-green-500 text-white hover:bg-green-600 transition"
                    >
                      📲 Tuma WhatsApp
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 text-sm">🎫 Preview ya Invitation Card</h3>
                {selectedGuest && (
                  <span className="text-xs text-gray-400">{selectedGuest.name}</span>
                )}
              </div>
              {selectedGuest ? (
                <div className="p-4">
                  <iframe
                    src={invitationLink}
                    className="w-full rounded-xl border border-gray-200"
                    style={{ height: "500px" }}
                    title="Invitation Preview"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center p-16 text-center">
                  <div>
                    <p className="text-5xl mb-4">🎫</p>
                    <p className="text-gray-500">Chagua mgeni kushoto kuona preview ya card yake</p>
                  </div>
                </div>
              )}
            </div>

            {event && (
              <div className="mt-4 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4 text-sm">📋 Muhtasari wa Tukio</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Tukio</p>
                    <p className="font-medium text-gray-900">{emoji} {event.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Tarehe</p>
                    <p className="font-medium text-gray-900">📅 {new Date(event.date).toLocaleDateString("sw-TZ", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
                  </div>
                  {event.venue && (
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Mahali</p>
                      <p className="font-medium text-gray-900">📍 {event.venue}</p>
                    </div>
                  )}
                  {event.dress_code && (
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Dress Code</p>
                      <p className="font-medium" style={{ color: "#B8960C" }}>👗 {event.dress_code}</p>
                    </div>
                  )}
                  {event.host_name && (
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Host</p>
                      <p className="font-medium text-gray-900">👤 {event.host_name}</p>
                    </div>
                  )}
                  {event.rsvp_contact1 && (
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">RSVP</p>
                      <p className="font-medium text-gray-900">📞 {event.rsvp_contact1}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}