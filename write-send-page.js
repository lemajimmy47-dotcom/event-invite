const fs = require("fs");
const content = `"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
  const router = useRouter()
  const [eventId, setEventId] = useState("")
  const [event, setEvent] = useState<any>(null)
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentGuest, setCurrentGuest] = useState("")
  const [done, setDone] = useState(false)
  const [sentList, setSentList] = useState<string[]>([])
  const [filter, setFilter] = useState("all")
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

  const filteredGuests = guests.filter(g => {
    if (!g.phone) return false
    if (filter === "pending") return !g.rsvp_responses?.[0]?.status
    if (filter === "attending") return g.rsvp_responses?.[0]?.status === "attending"
    return true
  })

  async function sendAll() {
    setSending(true)
    setDone(false)
    setProgress(0)
    setSentList([])
    const total = filteredGuests.length
    let count = 0
    for (const guest of filteredGuests) {
      if (!guest.phone) continue
      setCurrentGuest(guest.name)
      const invitationLink = APP_URL + "/api/invitation/" + guest.qr_token
      const msg = "Karibu " + guest.name + "! Umealikwa kwenye " + event?.name + ". Pakua invitation yako hapa: " + invitationLink
      const waLink = "https://wa.me/" + guest.phone.replace(/^0/, "255") + "?text=" + encodeURIComponent(msg)
      window.open(waLink, "_blank")
      count++
      setProgress(Math.round((count / total) * 100))
      setSentList(prev => [...prev, guest.name])
      await new Promise(r => setTimeout(r, 2000))
    }
    setSending(false)
    setDone(true)
    setCurrentGuest("")
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen"><p className="text-gray-500">Inapakia...</p></div>

  const withPhone = filteredGuests.length
  const withoutPhone = guests.filter(g => !g.phone).length

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/dashboard" className="hover:text-yellow-700">Dashboard</Link>
          <span>›</span>
          <Link href={"/events/" + eventId} className="hover:text-yellow-700">Event Details</Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">Tuma Mialiko</span>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">📨 Tuma Mialiko</h1>
          <p className="text-sm text-gray-500 mt-1">{event?.name}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center shadow-sm">
            <p className="text-2xl font-bold" style={{ color: "#B8960C" }}>{guests.length}</p>
            <p className="text-gray-500 text-xs mt-1">Wageni Wote</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-green-600">{withPhone}</p>
            <p className="text-gray-500 text-xs mt-1">Wana Simu</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-red-500">{withoutPhone}</p>
            <p className="text-gray-500 text-xs mt-1">Hawana Simu</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">⚙️ Chagua Wageni wa Kutuma</h3>
          <div className="grid grid-cols-3 gap-3 mb-6">
            <button onClick={() => setFilter("all")} className={"p-3 rounded-xl border-2 text-sm font-medium transition " + (filter === "all" ? "border-yellow-400 bg-yellow-50 text-yellow-800" : "border-gray-200 text-gray-600 hover:border-gray-300")}>
              👥 Wageni Wote<br/>
              <span className="text-lg font-bold">{guests.filter(g => g.phone).length}</span>
            </button>
            <button onClick={() => setFilter("pending")} className={"p-3 rounded-xl border-2 text-sm font-medium transition " + (filter === "pending" ? "border-yellow-400 bg-yellow-50 text-yellow-800" : "border-gray-200 text-gray-600 hover:border-gray-300")}>
              ⏳ Hawajajibu<br/>
              <span className="text-lg font-bold">{guests.filter(g => !g.rsvp_responses?.[0]?.status && g.phone).length}</span>
            </button>
            <button onClick={() => setFilter("attending")} className={"p-3 rounded-xl border-2 text-sm font-medium transition " + (filter === "attending" ? "border-yellow-400 bg-yellow-50 text-yellow-800" : "border-gray-200 text-gray-600 hover:border-gray-300")}>
              ✅ Watahudhuria<br/>
              <span className="text-lg font-bold">{guests.filter(g => g.rsvp_responses?.[0]?.status === "attending" && g.phone).length}</span>
            </button>
          </div>

          {sending && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Inatuma kwa <strong>{currentGuest}</strong>...</p>
                <p className="text-sm font-bold" style={{ color: "#B8960C" }}>{progress}%</p>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div className="h-3 rounded-full transition-all duration-500" style={{ width: progress + "%", background: "linear-gradient(135deg, #B8960C, #FFD700)" }}></div>
              </div>
              <p className="text-xs text-gray-400 mt-2">Imetuma: {sentList.length} / {filteredGuests.length}</p>
            </div>
          )}

          {done && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-center">
              <p className="text-3xl mb-2">🎉</p>
              <p className="font-semibold text-green-800">Imekamilika! Umetuma mialiko {sentList.length} kwa wageni!</p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>💡 Muhimu:</strong> WhatsApp itafunguka kwa kila mgeni mmoja mmoja. Hakikisha browser yako inaruhusu popups. Mialiko {filteredGuests.length} itumwe.
            </p>
          </div>

          <button
            onClick={sendAll}
            disabled={sending || filteredGuests.length === 0}
            className="w-full py-4 rounded-xl font-bold text-lg hover:opacity-90 disabled:opacity-50 transition shadow-lg flex items-center justify-center gap-3"
            style={{ background: "linear-gradient(135deg, #B8960C, #FFD700)", color: "#1a1200" }}
          >
            {sending ? (
              <>⏳ Inatuma... ({sentList.length}/{filteredGuests.length})</>
            ) : (
              <>📲 Tuma Mialiko Yote ({filteredGuests.length})</>
            )}
          </button>
        </div>

        {sentList.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">✅ Waliotumwa</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {sentList.map((name, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-green-500">✓</span>
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}`;
fs.writeFileSync("app/events/[id]/send/page.tsx", content, "utf8");
console.log("Send page imeandikwa!");
