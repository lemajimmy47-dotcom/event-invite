"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

type Guest = {
  id: string
  name: string
  phone: string | null
  qr_token: string
  rsvp_responses: { status: string }[]
}

export default function SendPage({ params }: { params: Promise<{ id: string }> }) {
  const [eventId, setEventId] = useState("")
  const [event, setEvent] = useState<any>(null)
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("rsvp")
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [sending, setSending] = useState(false)
  const [sentIds, setSentIds] = useState<Set<string>>(new Set())
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://event-invite-rouge.vercel.app"

  useEffect(() => {
    async function load() {
      const { id } = await params
      setEventId(id)
      const supabase = createClient()
      const { data: ev } = await supabase.from("events").select("*").eq("id", id).single()
      setEvent(ev)
      const { data } = await supabase
        .from("guests")
        .select("*, rsvp_responses(*)")
        .eq("event_id", id)
        .order("created_at", { ascending: false })
      setGuests(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const allWithPhone = guests.filter(g => g.phone)
  const pendingGuests = guests.filter(g => !g.rsvp_responses?.[0]?.status && g.phone)
  const attendingGuests = guests.filter(g => g.rsvp_responses?.[0]?.status === "attending" && g.phone)

  const displayGuests = activeTab === "rsvp" ? allWithPhone : attendingGuests

  function getMsg(guest: Guest, type: string) {
    if (type === "rsvp") {
      const rsvpLink = APP_URL + "/rsvp/" + guest.qr_token
      return "Habari " + guest.name + "! Umealikwa kwenye *" + event?.name + "*. Je, utahudhuria? Jibu hapa: " + rsvpLink
    } else {
      const cardLink = APP_URL + "/api/invitation/" + guest.qr_token
      const shortCode = guest.qr_token.substring(0, 6).toUpperCase()
      const nl = String.fromCharCode(10)
      const contacts = [event?.rsvp_contact1, event?.rsvp_contact2, event?.rsvp_contact3].filter(Boolean).join(", ")
      return "Habari " + guest.name + "," + nl + nl +
        (event?.host_name ? event.host_name + " wanakufuraha kukualika" : event?.name + " wanakualika") + nl + nl +
        "Tarehe: " + new Date(event?.date).toLocaleDateString("sw-TZ", {day:"2-digit", month:"long", year:"numeric"}) + nl +
        (event?.venue ? "Ukumbi: " + event?.venue + nl : "") +
        (event?.event_time ? "Saa: " + event?.event_time + " " + (event?.time_period||"") + nl : "") +
        (event?.dress_code ? "Dress Code: " + event?.dress_code + nl : "") +
        (contacts ? "Mawasiliano: " + contacts + nl : "") + nl +
        "Tafadhali Kumbuka kuja na kadi hii mlangoni" + nl + nl +
        "Kumbukumbu ya Mwaliko: " + shortCode + nl + nl +
        "Kadi yako: " + cardLink
    }
  }

  function sendOne(guest: Guest) {
    const phone = guest.phone!.replace(/^0/, "255")
    const msg = getMsg(guest, activeTab)
    const waLink = "https://wa.me/" + phone + "?text=" + encodeURIComponent(msg)
    window.open(waLink, "_blank")
    setSentIds(prev => new Set([...prev, guest.id]))
  }

  async function sendSelected() {
    const toSend = displayGuests.filter(g => selected.has(g.id))
    if (toSend.length === 0) return
    setSending(true)
    for (const guest of toSend) {
      sendOne(guest)
      await new Promise(r => setTimeout(r, 2000))
    }
    setSending(false)
    setSelected(new Set())
  }

  async function sendAll() {
    setSending(true)
    for (const guest of displayGuests) {
      sendOne(guest)
      await new Promise(r => setTimeout(r, 2000))
    }
    setSending(false)
  }

  function toggleSelect(id: string) {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelected(next)
  }

  function toggleAll() {
    if (selected.size === displayGuests.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(displayGuests.map(g => g.id)))
    }
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen"><p className="text-gray-500">Inapakia...</p></div>

  const rsvpStatus = (guest: Guest) => {
    const s = guest.rsvp_responses?.[0]?.status
    if (s === "attending") return { label: "✅ Atahudhuria", cls: "bg-green-100 text-green-700" }
    if (s === "not_attending") return { label: "❌ Hatahudhuria", cls: "bg-red-100 text-red-600" }
    return { label: "⏳ Hajajibu", cls: "bg-gray-100 text-gray-500" }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Msaada / Support:</span>
          <a href="https://wa.me/255653578184" target="_blank" className="flex items-center gap-1 text-green-600 font-medium">💬 WhatsApp</a>
        </div>
      </header>

      <div className="max-w-3xl mx-auto p-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <span>›</span>
          <Link href={"/events/" + eventId} className="hover:underline">Event Details</Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">Tuma</span>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">📨 Tuma Mialiko</h1>
          <p className="text-sm text-gray-500 mt-1">{event?.name}</p>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-gray-900">{guests.length}</p>
            <p className="text-gray-500 text-xs mt-1">Wageni Wote</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-gray-500">{pendingGuests.length}</p>
            <p className="text-gray-500 text-xs mt-1">Hawajajibu</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-green-600">{attendingGuests.length}</p>
            <p className="text-gray-500 text-xs mt-1">Watahudhuria</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center shadow-sm">
            <p className="text-2xl font-bold" style={{ color: "#B8960C" }}>{sentIds.size}</p>
            <p className="text-gray-500 text-xs mt-1">Wametumwa</p>
          </div>
        </div>

        <div className="flex gap-2 mb-4 border-b border-gray-200">
          <button
            onClick={() => { setActiveTab("rsvp"); setSelected(new Set()) }}
            className={"px-4 py-3 text-sm font-medium border-b-2 transition -mb-px " + (activeTab === "rsvp" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700")}
          >
            📋 Hatua 1 — Tuma RSVP ({allWithPhone.length})
          </button>
          <button
            onClick={() => { setActiveTab("card"); setSelected(new Set()) }}
            className={"px-4 py-3 text-sm font-medium border-b-2 transition -mb-px " + (activeTab === "card" ? "border-green-600 text-green-600" : "border-transparent text-gray-500 hover:text-gray-700")}
          >
            🎫 Hatua 2 — Tuma Card ({attendingGuests.length})
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selected.size === displayGuests.length && displayGuests.length > 0}
                onChange={toggleAll}
                className="w-4 h-4 rounded cursor-pointer"
              />
              <span className="text-sm text-gray-600">
                {selected.size > 0 ? selected.size + " wamechaguliwa" : "Chagua wote"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {selected.size > 0 && (
                <button
                  onClick={sendSelected}
                  disabled={sending}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-50 transition"
                  style={{ background: "linear-gradient(135deg, #1e3a5f, #2d5a8e)" }}
                >
                  {sending ? "Inatuma..." : (activeTab === "rsvp" ? "📋" : "🎫") + " Tuma Waliochaguliwa (" + selected.size + ")"}
                </button>
              )}
              <button
                onClick={sendAll}
                disabled={sending || displayGuests.length === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-50 transition"
                style={{ background: activeTab === "rsvp" ? "linear-gradient(135deg, #1e3a5f, #2d5a8e)" : "linear-gradient(135deg, #059669, #10b981)" }}
              >
                {sending ? "Inatuma..." : (activeTab === "rsvp" ? "📋" : "🎫") + " Tuma Wote (" + displayGuests.length + ")"}
              </button>
            </div>
          </div>

          {displayGuests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">{activeTab === "card" ? "⏳" : "👥"}</p>
              <p className="text-gray-500 font-medium">
                {activeTab === "card" ? "Hakuna waliokubali bado — tuma RSVP kwanza" : "Hakuna wageni wenye simu"}
              </p>
              {activeTab === "card" && (
                <button onClick={() => setActiveTab("rsvp")} className="mt-3 text-sm text-blue-600 hover:underline">
                  ← Rudi Hatua 1
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {displayGuests.map((guest) => {
                const status = rsvpStatus(guest)
                const isSent = sentIds.has(guest.id)
                return (
                  <div key={guest.id} className={"flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition " + (isSent ? "bg-green-50" : "")}>
                    <input
                      type="checkbox"
                      checked={selected.has(guest.id)}
                      onChange={() => toggleSelect(guest.id)}
                      className="w-4 h-4 rounded cursor-pointer flex-shrink-0"
                    />
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: "#1e3a5f" }}>
                      {guest.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-gray-900 text-sm">{guest.name}</p>
                        <span className={"text-xs px-2 py-0.5 rounded-full " + status.cls}>{status.label}</span>
                        {isSent && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✓ Imetumwa</span>}
                      </div>
                      {guest.phone && <p className="text-gray-400 text-xs mt-0.5">📱 {guest.phone}</p>}
                    </div>
                    <button
                      onClick={() => sendOne(guest)}
                      className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white hover:opacity-90 transition"
                      style={{ background: activeTab === "rsvp" ? "#1e3a5f" : "#059669" }}
                    >
                      📲 Tuma
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}