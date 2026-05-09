const fs = require("fs");
const content = `"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import TemplatePicker from "@/components/TemplatePicker"
import CardPreview from "@/components/CardPreview"

export default function NewEventPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [template, setTemplate] = useState("wedding")
  const [form, setForm] = useState({
    name: "",
    event_type: "wedding",
    date: "",
    venue: "",
    description: "",
    host_name: "",
    dress_code: "",
    rsvp_contact1: "",
    rsvp_contact2: "",
    rsvp_contact3: "",
    coordinates: "",
    event_time: "",
    time_period: "Asubuhi"
  })

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from("events")
      .insert([{ ...form, template }])
      .select()
      .single()
    if (error) {
      alert("Hitilafu: " + error.message)
      setLoading(false)
      return
    }
    router.push("/events/" + data.id)
  }

  const eventDate = form.date ? new Date(form.date).toLocaleDateString("sw-TZ", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : ""

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Unda Tukio Jipya</h1>
          <p className="text-gray-500 text-sm mt-1">Jaza taarifa zote za tukio lako</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <TemplatePicker selected={template} onChange={(id) => { setTemplate(id); setForm({ ...form, event_type: id }) }} />

            <form onSubmit={handleSubmit} className="space-y-4">

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">1</span>
                  Taarifa za Tukio
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jina la Tukio *</label>
                    <input type="text" required placeholder="Mfano: Harusi ya John na Mary" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tarehe *</label>
                      <input type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Muda *</label>
                      <input type="time" required value={form.event_time} onChange={e => setForm({ ...form, event_time: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kipindi</label>
                    <select value={form.time_period} onChange={e => setForm({ ...form, time_period: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Asubuhi</option>
                      <option>Mchana</option>
                      <option>Alasiri</option>
                      <option>Jioni</option>
                      <option>Usiku</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Maelezo</label>
                    <textarea rows={2} placeholder="Maelezo ya ziada..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">2</span>
                  Mahali (Location)
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jina la Ukumbi</label>
                    <input type="text" placeholder="Mfano: Ramada Hotel, Dar es Salaam" value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Coordinates (Google Maps)</label>
                    <input type="text" placeholder="Mfano: -6.85, 39.27" value={form.coordinates} onChange={e => setForm({ ...form, coordinates: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">3</span>
                  Host na Maelezo
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jina la Host</label>
                    <input type="text" placeholder="Mfano: Familia ya Bw. na Bi. John" value={form.host_name} onChange={e => setForm({ ...form, host_name: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dress Code</label>
                    <input type="text" placeholder="Mfano: White & Gold" value={form.dress_code} onChange={e => setForm({ ...form, dress_code: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">4</span>
                  Mawasiliano ya RSVP
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Namba 1</label>
                    <input type="tel" placeholder="0712345678" value={form.rsvp_contact1} onChange={e => setForm({ ...form, rsvp_contact1: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Namba 2</label>
                    <input type="tel" placeholder="0755123456" value={form.rsvp_contact2} onChange={e => setForm({ ...form, rsvp_contact2: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Namba 3 (Optional)</label>
                    <input type="tel" placeholder="0767123456" value={form.rsvp_contact3} onChange={e => setForm({ ...form, rsvp_contact3: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 disabled:opacity-50 transition">
                {loading ? "Inaunda..." : "Unda Tukio ✓"}
              </button>
            </form>
          </div>

          <div className="lg:sticky lg:top-6 h-fit">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">👁️ Preview ya Card</h3>
            <CardPreview
              templateId={template}
              eventName={form.name}
              eventDate={eventDate}
              eventVenue={form.venue}
              guestName="Jina la Mgeni"
              guestCode="EVNT-2026-001-0001"
            />
            {form.host_name && (
              <div className="mt-4 bg-white rounded-xl border border-gray-200 p-4 space-y-2">
                {form.host_name && <p className="text-sm text-gray-600">👤 <strong>Host:</strong> {form.host_name}</p>}
                {form.dress_code && <p className="text-sm text-gray-600">👗 <strong>Dress Code:</strong> {form.dress_code}</p>}
                {form.venue && <p className="text-sm text-gray-600">📍 <strong>Venue:</strong> {form.venue}</p>}
                {form.rsvp_contact1 && <p className="text-sm text-gray-600">📞 <strong>RSVP:</strong> {form.rsvp_contact1}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}`;
fs.writeFileSync("app/events/new/page.tsx", content, "utf8");
console.log("New event form imeandikwa!");
