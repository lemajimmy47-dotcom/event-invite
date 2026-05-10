const fs = require("fs");
const content = `"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

type Guest = {
  id: string
  name: string
  phone: string | null
  guest_code: string | null
  rsvp_responses: { status: string; responded_at: string }[]
  checkins: { checked_in_at: string }[]
}

export default function RSVPDashboard({ params }: { params: Promise<{ id: string }> }) {
  const [eventId, setEventId] = useState("")
  const [eventName, setEventName] = useState("")
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    async function load() {
      const { id } = await params
      setEventId(id)
      const supabase = createClient()
      const { data: event } = await supabase.from("events").select("name").eq("id", id).single()
      if (event) setEventName(event.name)
      const { data } = await supabase
        .from("guests")
        .select("*, rsvp_responses(*), checkins(*)")
        .eq("event_id", id)
        .order("created_at", { ascending: false })
      setGuests(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const attending = guests.filter(g => g.rsvp_responses?.[0]?.status === "attending")
  const notAttending = guests.filter(g => g.rsvp_responses?.[0]?.status === "not_attending")
  const pending = guests.filter(g => !g.rsvp_responses?.[0]?.status)
  const checkedIn = guests.filter(g => g.checkins?.length > 0)

  const filtered = filter === "attending" ? attending
    : filter === "not_attending" ? notAttending
    : filter === "pending" ? pending
    : filter === "checkedin" ? checkedIn
    : guests

  const attendingPct = guests.length ? Math.round((attending.length / guests.length) * 100) : 0
  const notAttendingPct = guests.length ? Math.round((notAttending.length / guests.length) * 100) : 0
  const pendingPct = guests.length ? Math.round((pending.length / guests.length) * 100) : 0
  const checkedInPct = attending.length ? Math.round((checkedIn.length / attending.length) * 100) : 0

  if (loading) return <div className="flex items-center justify-center min-h-screen"><p className="text-gray-500">Inapakia...</p></div>

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/dashboard" className="hover:text-yellow-700">Dashboard</Link>
          <span>›</span>
          <Link href={"/events/" + eventId} className="hover:text-yellow-700">Event Details</Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">RSVP</span>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">✅ RSVP Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">{eventName}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div onClick={() => setFilter("all")} className={"bg-white rounded-2xl border-2 p-5 text-center cursor-pointer transition " + (filter === "all" ? "border-yellow-400 shadow-md" : "border-gray-200 hover:border-gray-300")}>
            <p className="text-3xl font-bold" style={{ color: "#B8960C" }}>{guests.length}</p>
            <p className="text-gray-500 text-xs mt-1">Wageni Wote</p>
            <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
              <div className="h-1.5 rounded-full" style={{ width: "100%", background: "#B8960C" }}></div>
            </div>
          </div>
          <div onClick={() => setFilter("attending")} className={"bg-white rounded-2xl border-2 p-5 text-center cursor-pointer transition " + (filter === "attending" ? "border-green-400 shadow-md" : "border-gray-200 hover:border-gray-300")}>
            <p className="text-3xl font-bold text-green-600">{attending.length}</p>
            <p className="text-gray-500 text-xs mt-1">Watahudhuria</p>
            <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
              <div className="h-1.5 rounded-full bg-green-500" style={{ width: attendingPct + "%" }}></div>
            </div>
            <p className="text-xs text-gray-400 mt-1">{attendingPct}%</p>
          </div>
          <div onClick={() => setFilter("not_attending")} className={"bg-white rounded-2xl border-2 p-5 text-center cursor-pointer transition " + (filter === "not_attending" ? "border-red-400 shadow-md" : "border-gray-200 hover:border-gray-300")}>
            <p className="text-3xl font-bold text-red-500">{notAttending.length}</p>
            <p className="text-gray-500 text-xs mt-1">Hawatahudhuria</p>
            <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
              <div className="h-1.5 rounded-full bg-red-500" style={{ width: notAttendingPct + "%" }}></div>
            </div>
            <p className="text-xs text-gray-400 mt-1">{notAttendingPct}%</p>
          </div>
          <div onClick={() => setFilter("pending")} className={"bg-white rounded-2xl border-2 p-5 text-center cursor-pointer transition " + (filter === "pending" ? "border-gray-400 shadow-md" : "border-gray-200 hover:border-gray-300")}>
            <p className="text-3xl font-bold text-gray-500">{pending.length}</p>
            <p className="text-gray-500 text-xs mt-1">Hawajajibu</p>
            <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
              <div className="h-1.5 rounded-full bg-gray-400" style={{ width: pendingPct + "%" }}></div>
            </div>
            <p className="text-xs text-gray-400 mt-1">{pendingPct}%</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">📊 Check-in Progress</h3>
          <div className="flex items-center gap-4 mb-2">
            <div className="flex-1 bg-gray-100 rounded-full h-4">
              <div className="h-4 rounded-full transition-all duration-500" style={{ width: checkedInPct + "%", background: "linear-gradient(135deg, #B8960C, #FFD700)" }}></div>
            </div>
            <span className="text-sm font-bold" style={{ color: "#B8960C" }}>{checkedInPct}%</span>
          </div>
          <p className="text-sm text-gray-500">
            <strong style={{ color: "#B8960C" }}>{checkedIn.length}</strong> kati ya <strong>{attending.length}</strong> watakaokuja wamefika
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">
              {filter === "all" ? "Wageni Wote" : filter === "attending" ? "✅ Watahudhuria" : filter === "not_attending" ? "❌ Hawatahudhuria" : filter === "pending" ? "⏳ Hawajajibu" : "Wamefika"}
              <span className="ml-2 text-sm font-normal text-gray-400">({filtered.length})</span>
            </h3>
            <button onClick={() => setFilter("all")} className="text-xs text-gray-400 hover:text-gray-600">
              Onyesha wote
            </button>
          </div>
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">📋</p>
              <p className="text-gray-500">Hakuna wageni katika kundi hili</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map((guest, index) => {
                const rsvp = guest.rsvp_responses?.[0]
                const isCheckedIn = guest.checkins?.length > 0
                const respondedAt = rsvp?.responded_at ? new Date(rsvp.responded_at).toLocaleDateString("sw-TZ") : null
                const checkedInAt = guest.checkins?.[0]?.checked_in_at ? new Date(guest.checkins[0].checked_in_at).toLocaleTimeString("sw-TZ", { hour: "2-digit", minute: "2-digit" }) : null
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
                          {isCheckedIn && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">✓ Amefika {checkedInAt && "@ " + checkedInAt}</span>}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          {guest.phone && <p className="text-gray-400 text-xs">📱 {guest.phone}</p>}
                          {respondedAt && <p className="text-gray-300 text-xs">• Alijibu: {respondedAt}</p>}
                        </div>
                      </div>
                    </div>
                    <span className={"text-xs px-3 py-1.5 rounded-full font-medium " + (rsvp?.status === "attending" ? "bg-green-100 text-green-700" : rsvp?.status === "not_attending" ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500")}>
                      {rsvp?.status === "attending" ? "✅ Atahudhuria" : rsvp?.status === "not_attending" ? "❌ Hatahudhuria" : "⏳ Hajajibu"}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}`;
fs.writeFileSync("app/events/[id]/rsvp-list/page.tsx", content, "utf8");
console.log("RSVP page imeandikwa!");
