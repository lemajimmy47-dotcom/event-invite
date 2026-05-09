"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

type Props = { params: Promise<{ token: string }> }

export default function RSVPPage({ params }: Props) {
  const [guest, setGuest] = useState<any>(null)
  const [event, setEvent] = useState<any>(null)
  const [rsvp, setRsvp] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    async function load() {
      const { token } = await params
      const supabase = createClient()
      const { data } = await supabase
        .from("guests")
        .select("*, events(*), rsvp_responses(*)")
        .eq("qr_token", token)
        .single()
      if (data) {
        setGuest(data)
        setEvent(data.events)
        const existingRsvp = data.rsvp_responses?.[0]?.status ?? null
        setRsvp(existingRsvp)
        if (existingRsvp) setDone(true)
      }
      setLoading(false)
    }
    load()
  }, [])

  async function handleRSVP(choice: "attending" | "not_attending") {
    setSubmitting(true)
    const supabase = createClient()
    await supabase.from("rsvp_responses").insert([{ guest_id: guest.id, status: choice }])
    setRsvp(choice)
    setDone(true)
    setSubmitting(false)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-blue-50 flex items-center justify-center">
        <p className="text-gray-500">Inapakia...</p>
      </main>
    )
  }

  if (!guest) {
    return (
      <main className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
          <p className="text-5xl mb-4">❌</p>
          <p className="text-gray-700 font-medium">Mwaliko haukupatikana</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md overflow-hidden">
        <div className="bg-blue-600 p-6 text-white text-center">
          <p className="text-4xl mb-2">🎉</p>
          <h1 className="text-xl font-bold">{event?.name}</h1>
          <p className="text-blue-200 text-sm mt-1">
            {event && new Date(event.date).toLocaleDateString("sw-TZ", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
          {event?.venue && <p className="text-blue-200 text-sm">📍 {event.venue}</p>}
        </div>
        <div className="p-6">
          <p className="text-center text-gray-600 mb-1">Karibu sana,</p>
          <p className="text-center text-2xl font-bold text-gray-900 mb-1">{guest.name}!</p>
          {guest.guest_code && (
            <p className="text-center text-xs font-mono text-gray-400 bg-gray-50 rounded-lg py-1 px-3 mb-6 border border-gray-200">
              Nambari yako: {guest.guest_code}
            </p>
          )}

          {done ? (
            <div className="text-center py-4">
              <p className="text-5xl mb-4">{rsvp === "attending" ? "✅" : "😔"}</p>
              <p className="text-lg font-semibold text-gray-800">
                {rsvp === "attending" ? "Asante! Tutakuona huko!" : "Asante kwa kutuarifu!"}
              </p>
              <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-sm text-gray-500">Jibu lako:</p>
                <p className={"text-sm font-semibold mt-1 " + (rsvp === "attending" ? "text-green-600" : "text-red-500")}>
                  {rsvp === "attending" ? "✅ Nitahudhuria" : "❌ Siwezi kuja"}
                </p>
                <p className="text-xs text-gray-400 mt-2">Umeshajisajili — huwezi kubadilisha jibu tena</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-center text-gray-600 mb-4">Je, utahudhuria tukio hili?</p>
              <button
                onClick={() => handleRSVP("attending")}
                disabled={submitting}
                className="w-full bg-green-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-green-600 disabled:opacity-50 transition"
              >
                ✅ Ndiyo, Nitahudhuria!
              </button>
              <button
                onClick={() => handleRSVP("not_attending")}
                disabled={submitting}
                className="w-full bg-red-100 text-red-600 py-4 rounded-xl font-semibold text-lg hover:bg-red-200 disabled:opacity-50 transition"
              >
                ❌ Hapana, Siwezi Kuja
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}