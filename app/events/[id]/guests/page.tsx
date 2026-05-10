"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

type Guest = {
  id: string
  name: string
  phone: string | null
  email: string | null
  guest_code: string | null
  qr_token: string
  rsvp_responses: { status: string }[]
  checkins: { id: string }[]
}

export default function GuestsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [eventId, setEventId] = useState("")
  const [eventName, setEventName] = useState("")
  const [guests, setGuests] = useState<Guest[]>([])
  const [filtered, setFiltered] = useState<Guest[]>([])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [sentCount, setSentCount] = useState(0)
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://event-invite-rouge.vercel.app"

  useEffect(() => {
    async function load() {
      const { id } = await params
      setEventId(id)
      const supabase = createClient()
      const { data: event } = await supabase.from("events").select("*").eq("id", id).single()
      if (event) setEventName(event.name)
      const { data } = await supabase
        .from("guests")
        .select("*, rsvp_responses(*), checkins(*)")
        .eq("event_id", id)
        .order("created_at", { ascending: false })
      setGuests(data || [])
      setFiltered(data || [])
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    let list = guests
    if (search) {
      list = list.filter(g => g.name.toLowerCase().includes(search.toLowerCase()) || g.phone?.includes(search) || g.guest_code?.includes(search))
    }
    if (filter === "attending") list = list.filter(g => g.rsvp_responses?.[0]?.status === "attending")
    else if (filter === "not_attending") list = list.filter(g => g.rsvp_responses?.[0]?.status === "not_attending")
    else if (filter === "pending") list = list.filter(g => !g.rsvp_responses?.[0]?.status)
    else if (filter === "checkedin") list = list.filter(g => g.checkins?.length > 0)
    setFiltered(list)
  }, [search, filter, guests])

  async function sendAllWhatsApp() {
    setSending(true)
    setSentCount(0)
    const supabase = createClient()
    const { data: event } = await supabase.from("events").select("*").eq("id", eventId).single()
    let count = 0
    for (const guest of filtered) {
      if (!guest.phone) continue
      const invitationLink = APP_URL + "/api/invitation/" + guest.qr_token
      const msg = "Karibu " + guest.name + "! Umealikwa kwenye " + (event?.name || eventName) + ". Pakua invitation yako hapa: " + invitationLink
      const waLink = "https://wa.me/" + guest.phone.replace(/^0/, "255") + "?text=" + encodeURIComponent(msg)
      window.open(waLink, "_blank")
      count++
      setSentCount(count)
      await new Promise(r => setTimeout(r, 1500))
    }
    setSending(false)
    alert("Imekamilika! Umetuma kwa wageni " + count)
  }

  function exportCSV() {
    const headers = ["Jina", "Simu", "Email", "Code", "RSVP", "Amefika"]
    const rows = guests.map(g => [
      g.name,
      g.phone || "",
      g.email || "",
      g.guest_code || "",
      g.rsvp_responses?.[0]?.status || "pending",
      g.checkins?.length > 0 ? "Ndiyo" : "Hapana"
    ])
    const csv = [headers, ...rows].map(r => r.join(",")).join(String.fromCharCode(10))
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "wageni-" + eventName + ".csv"
    a.click()
  }

  const attending = guests.filter(g => g.rsvp_responses?.[0]?.status === "attending").length
  const notAttending = guests.filter(g => g.rsvp_responses?.[0]?.status === "not_attending").length
  const pending = guests.filter(g => !g.rsvp_responses?.[0]?.status).length
  const checkedIn = guests.filter(g => g.checkins?.length > 0).length

  if (loading) return <div className="flex items-center justify-center min-h-screen"><p className="text-gray-500">Inapakia...</p></div>

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/dashboard" className="hover:text-yellow-700">Dashboard</Link>
          <span>›</span>
          <Link href={"/events/" + eventId} className="hover:text-yellow-700">Event Details</Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">Upload Wageni</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">👥 Upload Wageni</h1>
            <p className="text-sm text-gray-500 mt-1">{eventName}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 hover:border-yellow-400 bg-white transition">
              📊 Export CSV
            </button>
            <Link href={"/events/" + eventId + "/guests/new"} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white hover:opacity-90 transition" style={{ background: "linear-gradient(135deg, #B8960C, #FFD700)", color: "#1a1200" }}>
              + Ongeza Wageni
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div onClick={() => setFilter("all")} className={"bg-white rounded-2xl border p-4 text-center cursor-pointer transition " + (filter === "all" ? "border-yellow-400 shadow-md" : "border-gray-200 hover:border-gray-300")}>
            <p className="text-2xl font-bold" style={{ color: "#B8960C" }}>{guests.length}</p>
            <p className="text-gray-500 text-xs mt-1">Wageni Wote</p>
          </div>
          <div onClick={() => setFilter("attending")} className={"bg-white rounded-2xl border p-4 text-center cursor-pointer transition " + (filter === "attending" ? "border-green-400 shadow-md" : "border-gray-200 hover:border-gray-300")}>
            <p className="text-2xl font-bold text-green-600">{attending}</p>
            <p className="text-gray-500 text-xs mt-1">Watahudhuria</p>
          </div>
          <div onClick={() => setFilter("not_attending")} className={"bg-white rounded-2xl border p-4 text-center cursor-pointer transition " + (filter === "not_attending" ? "border-red-400 shadow-md" : "border-gray-200 hover:border-gray-300")}>
            <p className="text-2xl font-bold text-red-500">{notAttending}</p>
            <p className="text-gray-500 text-xs mt-1">Hawatahudhuria</p>
          </div>
          <div onClick={() => setFilter("pending")} className={"bg-white rounded-2xl border p-4 text-center cursor-pointer transition " + (filter === "pending" ? "border-gray-400 shadow-md" : "border-gray-200 hover:border-gray-300")}>
            <p className="text-2xl font-bold text-gray-500">{pending}</p>
            <p className="text-gray-500 text-xs mt-1">Hawajajibu</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100 flex items-center gap-3 flex-wrap">
            <div className="flex-1 min-w-48">
              <input
                type="text"
                placeholder="🔍 Tafuta mgeni kwa jina, simu, au code..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Inaonyesha: <strong>{filtered.length}</strong> / {guests.length}</span>
            </div>
            {filtered.filter(g => g.phone).length > 0 && (
              <button
                onClick={sendAllWhatsApp}
                disabled={sending}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-green-500 hover:bg-green-600 disabled:opacity-50 transition"
              >
                {sending ? "Inatuma " + sentCount + "..." : "📲 Tuma Wote WhatsApp (" + filtered.filter(g => g.phone).length + ")"}
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">👥</p>
              <p className="text-gray-500">Hakuna wageni wanaolingana na utafutaji</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map((guest, index) => {
                const rsvp = guest.rsvp_responses?.[0]?.status
                const isCheckedIn = guest.checkins?.length > 0
                const invitationLink = APP_URL + "/api/invitation/" + guest.qr_token
                const waMsg = "Karibu " + guest.name + "! Pakua invitation yako: " + invitationLink
                const waLink = "https://wa.me/" + (guest.phone?.replace(/^0/, "255") ?? "") + "?text=" + encodeURIComponent(waMsg)
                return (
                  <div key={guest.id} className="p-4 flex items-center justify-between gap-3 hover:bg-gray-50 transition">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 w-6 text-center">{index + 1}</span>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: "linear-gradient(135deg, #B8960C, #FFD700)", color: "#1a1200" }}>
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
                          📲
                        </a>
                      )}
                      <a href={invitationLink} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1.5 rounded-lg transition" style={{ background: "#FFF8DC", color: "#B8960C" }}>
                        🎫
                      </a>
                      <Link href={"/events/" + eventId + "/guests/" + guest.id} className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition">
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
  )
}