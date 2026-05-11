const fs = require("fs");
const content = `"use client"

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
  const [sending, setSending] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentGuest, setCurrentGuest] = useState("")
  const [done, setDone] = useState(false)
  const [sentList, setSentList] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("rsvp")
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
  const notAttending = guests.filter(g => g.rsvp_responses?.[0]?.status === "not_attending").length
  const pending = guests.filter(g => !g.rsvp_responses?.[0]?.status).length

  async function sendMessages(guestList: Guest[], type: "rsvp" | "card") {
    setSending(true)
    setDone(false)
    setProgress(0)
    setSentList([])
    const total = guestList.length
    let count = 0

    for (const guest of guestList) {
      if (!guest.phone) continue
      setCurrentGuest(guest.name)

      const phone = guest.phone.replace(/^0/, "255")
      let msg = ""

      if (type === "rsvp") {
        const rsvpLink = APP_URL + "/rsvp/" + guest.qr_token
        msg = "Habari " + guest.name + "!" +
          " Umealikwa kwenye *" + event?.name + "*." +
          " Je, utahudhuria?" +
          " Jibu hapa: " + rsvpLink
      } else {
        const cardLink = APP_URL + "/api/invitation/" + guest.qr_token
        msg = "Karibu " + guest.name + "!" +
          " Hii ni kadi yako ya mwaliko ya *" + event?.name + "*." +
          " Pakua hapa: " + cardLink
      }

      const waLink = "https://wa.me/" + phone + "?text=" + encodeURIComponent(msg)
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
            <p className="text-2xl font-bold text-gray-500">{pending}</p>
            <p className="text-gray-500 text-xs mt-1">Hawajajibu</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-green-600">{attendingGuests.length}</p>
            <p className="text-gray-500 text-xs mt-1">Watahudhuria</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-red-500">{notAttending}</p>
            <p className="text-gray-500 text-xs mt-1">Hawatahudhuria</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => { setActiveTab("rsvp"); setDone(false); setSentList([]) }}
            className={"px-4 py-3 text-sm font-medium border-b-2 transition -mb-px " + (activeTab === "rsvp" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700")}
          >
            📋 Hatua 1 — Tuma RSVP
          </button>
          <button
            onClick={() => { setActiveTab("card"); setDone(false); setSentList([]) }}
            className={"px-4 py-3 text-sm font-medium border-b-2 transition -mb-px " + (activeTab === "card" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700")}
          >
            🎫 Hatua 2 — Tuma Card
          </button>
        </div>

        {activeTab === "rsvp" && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-2">📋 Tuma RSVP Link Kwanza</h3>
            <p className="text-sm text-gray-500 mb-6">Tuma link ya RSVP kwa wageni wote ili wajulishe kama watakuja au la. Baada ya majibu, tuma card kwa waliokubali tu.</p>

            <div className="bg-gray-50 rounded-xl p-4 mb-6 font-mono text-xs text-gray-600 leading-relaxed border border-gray-200">
              <p className="font-semibold text-gray-700 mb-2">📱 Mfano wa ujumbe:</p>
              <p>Habari <strong>[Jina la Mgeni]</strong>!</p>
              <p>Umealikwa kwenye <strong>{event?.name}</strong>.</p>
              <p>Je, utahudhuria?</p>
              <p>Jibu hapa: <span className="text-blue-500">https://inviteyetu.app/rsvp/...</span></p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div
                className="p-4 rounded-xl border-2 border-blue-200 bg-blue-50 text-center cursor-pointer"
              >
                <p className="text-2xl font-bold text-blue-700">{allWithPhone.length}</p>
                <p className="text-sm text-blue-600 font-medium">Wageni Wote (wana simu)</p>
              </div>
              <div className="p-4 rounded-xl border-2 border-orange-200 bg-orange-50 text-center">
                <p className="text-2xl font-bold text-orange-600">{pendingGuests.length}</p>
                <p className="text-sm text-orange-600 font-medium">Hawajajibu</p>
              </div>
            </div>

            {sending && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Inatuma kwa <strong>{currentGuest}</strong>...</p>
                  <p className="text-sm font-bold text-blue-600">{progress}%</p>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div className="h-3 rounded-full bg-blue-500 transition-all duration-500" style={{ width: progress + "%" }}></div>
                </div>
                <p className="text-xs text-gray-400 mt-1">Imetuma: {sentList.length} / {allWithPhone.length}</p>
              </div>
            )}

            {done && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 text-center">
                <p className="text-3xl mb-2">🎉</p>
                <p className="font-semibold text-green-800">Imekamilika! RSVP links {sentList.length} zimetumwa!</p>
                <p className="text-sm text-green-600 mt-1">Subiri majibu kisha nenda Hatua 2 kutuma card</p>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4">
              <p className="text-xs text-blue-700">
                <strong>💡 Muhimu:</strong> WhatsApp itafunguka kwa kila mgeni mmoja mmoja. Hakikisha browser inaruhusu popups.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => sendMessages(pendingGuests, "rsvp")}
                disabled={sending || pendingGuests.length === 0}
                className="flex-1 py-3 rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-50 transition shadow-sm border-2 border-orange-400 text-orange-700 bg-orange-50"
              >
                {sending ? "Inatuma..." : "📋 Tuma kwa Hawajajibu (" + pendingGuests.length + ")"}
              </button>
              <button
                onClick={() => sendMessages(allWithPhone, "rsvp")}
                disabled={sending || allWithPhone.length === 0}
                className="flex-1 py-3 rounded-xl font-bold text-sm text-white hover:opacity-90 disabled:opacity-50 transition shadow-sm"
                style={{ background: "linear-gradient(135deg, #1e3a5f, #2d5a8e)" }}
              >
                {sending ? "Inatuma..." : "📋 Tuma Wote (" + allWithPhone.length + ")"}
              </button>
            </div>
          </div>
        )}

        {activeTab === "card" && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-2">🎫 Tuma Card ya Mwaliko</h3>
            <p className="text-sm text-gray-500 mb-6">Tuma card ya mwaliko kwa wageni waliokubali kuja. Card ina QR code yao ya kipekee.</p>

            <div className="bg-gray-50 rounded-xl p-4 mb-6 font-mono text-xs text-gray-600 leading-relaxed border border-gray-200">
              <p className="font-semibold text-gray-700 mb-2">📱 Mfano wa ujumbe:</p>
              <p>Karibu <strong>[Jina la Mgeni]</strong>!</p>
              <p>Hii ni kadi yako ya mwaliko ya <strong>{event?.name}</strong>.</p>
              <p>Pakua hapa: <span className="text-blue-500">https://inviteyetu.app/invitation/...</span></p>
            </div>

            {attendingGuests.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-4xl mb-3">⏳</p>
                <p className="font-semibold text-gray-700">Hakuna waliokubali bado</p>
                <p className="text-sm text-gray-500 mt-1">Tuma RSVP kwanza upate majibu</p>
                <button
                  onClick={() => setActiveTab("rsvp")}
                  className="mt-4 text-sm text-blue-600 hover:underline"
                >
                  ← Rudi Hatua 1
                </button>
              </div>
            ) : (
              <>
                <div className="p-4 rounded-xl border-2 border-green-200 bg-green-50 text-center mb-6">
                  <p className="text-3xl font-bold text-green-700">{attendingGuests.length}</p>
                  <p className="text-sm text-green-600 font-medium">Waliokubali — Watapokea Card</p>
                </div>

                {sending && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600">Inatuma kwa <strong>{currentGuest}</strong>...</p>
                      <p className="text-sm font-bold text-green-600">{progress}%</p>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3">
                      <div className="h-3 rounded-full bg-green-500 transition-all duration-500" style={{ width: progress + "%" }}></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Imetuma: {sentList.length} / {attendingGuests.length}</p>
                  </div>
                )}

                {done && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 text-center">
                    <p className="text-3xl mb-2">🎉</p>
                    <p className="font-semibold text-green-800">Imekamilika! Cards {sentList.length} zimetumwa!</p>
                  </div>
                )}

                <div className="bg-green-50 border border-green-100 rounded-xl p-3 mb-4">
                  <p className="text-xs text-green-700">
                    <strong>💡 Muhimu:</strong> Card itatumwa kwa wageni {attendingGuests.length} waliokubali tu. Kila card ina QR code ya kipekee.
                  </p>
                </div>

                <button
                  onClick={() => sendMessages(attendingGuests, "card")}
                  disabled={sending}
                  className="w-full py-4 rounded-xl font-bold text-lg text-white hover:opacity-90 disabled:opacity-50 transition shadow-lg"
                  style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}
                >
                  {sending ? "Inatuma... (" + sentList.length + "/" + attendingGuests.length + ")" : "🎫 Tuma Cards (" + attendingGuests.length + ")"}
                </button>
              </>
            )}
          </div>
        )}

        {sentList.length > 0 && (
          <div className="mt-4 bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">✅ Waliotumwa ({sentList.length})</h3>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
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
