const fs = require("fs");
const content = `"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

const eventTypeInfo: Record<string, { label: string; emoji: string }> = {
  wedding: { label: "HARUSI", emoji: "💍" },
  sendoff: { label: "SEND OFF", emoji: "✈️" },
  invitation: { label: "MWALIKO", emoji: "👥" },
  meeting: { label: "KIKAO", emoji: "💼" },
  contribution: { label: "MCHANGO", emoji: "💰" },
  ticket: { label: "TIKETI", emoji: "🎫" },
  custom: { label: "CUSTOM", emoji: "🎉" },
  bulksend: { label: "BULK SEND", emoji: "📨" },
}

function CreateEventForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const eventType = searchParams.get("type") || "wedding"
  const typeInfo = eventTypeInfo[eventType] || { label: "TUKIO", emoji: "🎉" }

  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    date: "",
    event_time: "",
    time_period: "Asubuhi",
    venue: "",
    coordinates: "",
    host_name: "",
    dress_code: "",
    rsvp_contact1: "",
    rsvp_contact2: "",
    rsvp_contact3: "",
    description: "",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from("events")
      .insert([{ ...form, event_type: eventType, template: eventType }])
      .select()
      .single()
    if (error) {
      alert("Hitilafu: " + error.message)
      setLoading(false)
      return
    }
    router.push("/events/" + data.id)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <span className="cursor-pointer hover:text-yellow-700" onClick={() => router.push("/dashboard")}>Dashboard</span>
          <span>›</span>
          <span className="cursor-pointer hover:text-yellow-700" onClick={() => router.push("/events/new")}>Create Event</span>
          <span>›</span>
          <span className="text-gray-900 font-medium">{typeInfo.label}</span>
        </div>

        <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          ← Back
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: "#FFF8DC" }}>
            {typeInfo.emoji}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Unda Tukio la {typeInfo.label}</h1>
            <p className="text-gray-500 text-sm">Jaza taarifa zote hapa chini</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-bold" style={{ background: "#B8960C" }}>1</span>
              Taarifa za Tukio
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jina la Tukio *</label>
                <input type="text" required placeholder="Mfano: Harusi ya John na Mary" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tarehe *</label>
                  <input type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Muda *</label>
                  <input type="time" required value={form.event_time} onChange={e => setForm({ ...form, event_time: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kipindi</label>
                <select value={form.time_period} onChange={e => setForm({ ...form, time_period: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm">
                  <option>Asubuhi</option>
                  <option>Mchana</option>
                  <option>Alasiri</option>
                  <option>Jioni</option>
                  <option>Usiku</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maelezo</label>
                <textarea rows={2} placeholder="Maelezo ya ziada..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-bold" style={{ background: "#B8960C" }}>2</span>
              Mahali (Location)
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jina la Ukumbi</label>
                <input type="text" placeholder="Mfano: Ramada Hotel, Dar es Salaam" value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coordinates (Google Maps)</label>
                <input type="text" placeholder="Mfano: -6.85, 39.27" value={form.coordinates} onChange={e => setForm({ ...form, coordinates: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-bold" style={{ background: "#B8960C" }}>3</span>
              Host na Maelezo
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jina la Host</label>
                <input type="text" placeholder="Mfano: Familia ya Bw. na Bi. John" value={form.host_name} onChange={e => setForm({ ...form, host_name: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dress Code</label>
                <input type="text" placeholder="Mfano: White and Gold" value={form.dress_code} onChange={e => setForm({ ...form, dress_code: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-bold" style={{ background: "#B8960C" }}>4</span>
              Mawasiliano ya RSVP
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Namba 1 *</label>
                <input type="tel" placeholder="0712345678" value={form.rsvp_contact1} onChange={e => setForm({ ...form, rsvp_contact1: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Namba 2</label>
                <input type="tel" placeholder="0755123456" value={form.rsvp_contact2} onChange={e => setForm({ ...form, rsvp_contact2: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Namba 3 (Optional)</label>
                <input type="tel" placeholder="0767123456" value={form.rsvp_contact3} onChange={e => setForm({ ...form, rsvp_contact3: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full text-white py-4 rounded-xl font-semibold text-lg hover:opacity-90 disabled:opacity-50 transition shadow-lg" style={{ background: "linear-gradient(135deg, #B8960C, #FFD700)" }}>
            {loading ? "Inaunda..." : "Unda Tukio ✓"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function CreateEventPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><p>Inapakia...</p></div>}>
      <CreateEventForm />
    </Suspense>
  )
}`;
fs.writeFileSync("app/events/create/page.tsx", content, "utf8");
console.log("Create event page imeandikwa!");
