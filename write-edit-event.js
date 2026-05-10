const fs = require("fs");
const content = `"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [eventId, setEventId] = useState("")
  const [form, setForm] = useState({
    name: "",
    date: "",
    event_time: "",
    time_period: "",
    venue: "",
    coordinates: "",
    host_name: "",
    dress_code: "",
    rsvp_contact1: "",
    rsvp_contact2: "",
    rsvp_contact3: "",
    description: "",
    religious_site: "",
    religious_time: "",
    sender_id: "",
    event_type: "",
  })

  useEffect(() => {
    async function load() {
      const { id } = await params
      setEventId(id)
      const supabase = createClient()
      const { data } = await supabase.from("events").select("*").eq("id", id).single()
      if (data) {
        setForm({
          name: data.name || "",
          date: data.date ? data.date.split("T")[0] : "",
          event_time: data.event_time || "",
          time_period: data.time_period || "",
          venue: data.venue || "",
          coordinates: data.coordinates || "",
          host_name: data.host_name || "",
          dress_code: data.dress_code || "",
          rsvp_contact1: data.rsvp_contact1 || "",
          rsvp_contact2: data.rsvp_contact2 || "",
          rsvp_contact3: data.rsvp_contact3 || "",
          description: data.description || "",
          religious_site: data.religious_site || "",
          religious_time: data.religious_time || "",
          sender_id: data.sender_id || "",
          event_type: data.event_type || "",
        })
      }
      setLoading(false)
    }
    load()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase
      .from("events")
      .update(form)
      .eq("id", eventId)
    if (error) {
      alert("Hitilafu: " + error.message)
      setSaving(false)
      return
    }
    router.push("/events/" + eventId)
  }

  async function handleDelete() {
    if (!confirm("Una uhakika unataka kufuta tukio hili? Wageni wote watafutwa pia!")) return
    const supabase = createClient()
    await supabase.from("events").delete().eq("id", eventId)
    router.push("/dashboard")
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen"><p className="text-gray-500">Inapakia...</p></div>

  const inputClass = "w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1"

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/dashboard" className="hover:text-yellow-700">Dashboard</Link>
          <span>›</span>
          <Link href={"/events/" + eventId} className="hover:text-yellow-700">Event Details</Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">Edit Event</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">✏️ Badilisha Tukio</h1>
            <p className="text-gray-500 text-sm mt-1">Sasisha taarifa za tukio lako</p>
          </div>
          <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-500 border border-red-200 hover:bg-red-50 transition">
            🗑️ Futa Tukio
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-bold" style={{ background: "#B8960C" }}>1</span>
              Taarifa za Tukio
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Sender ID</label>
                  <input type="text" value={form.sender_id} onChange={e => setForm({ ...form, sender_id: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Jina la Tukio *</label>
                  <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={labelClass}>Tarehe *</label>
                  <input type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Muda</label>
                  <input type="time" value={form.event_time} onChange={e => setForm({ ...form, event_time: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Kipindi</label>
                  <select value={form.time_period} onChange={e => setForm({ ...form, time_period: e.target.value })} className={inputClass}>
                    <option value="">Select</option>
                    <option>ASUBUHI</option>
                    <option>MCHANA</option>
                    <option>ALASIRI</option>
                    <option>JIONI</option>
                    <option>USIKU</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>Maelezo</label>
                <textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={inputClass} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-bold" style={{ background: "#B8960C" }}>2</span>
              Religious Service Details
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Religious Site</label>
                <input type="text" value={form.religious_site} onChange={e => setForm({ ...form, religious_site: e.target.value })} className={inputClass} placeholder="Kanisa/Msikiti" />
              </div>
              <div>
                <label className={labelClass}>Service Time</label>
                <input type="text" value={form.religious_time} onChange={e => setForm({ ...form, religious_time: e.target.value })} className={inputClass} placeholder="10:00 ASUBUHI" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-bold" style={{ background: "#B8960C" }}>3</span>
              Location
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Jina la Ukumbi</label>
                <input type="text" value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Coordinates</label>
                <input type="text" value={form.coordinates} onChange={e => setForm({ ...form, coordinates: e.target.value })} className={inputClass} placeholder="-6.85, 39.27" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-bold" style={{ background: "#B8960C" }}>4</span>
              Host & Details
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Host Name</label>
                <input type="text" value={form.host_name} onChange={e => setForm({ ...form, host_name: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Dress Code</label>
                <input type="text" value={form.dress_code} onChange={e => setForm({ ...form, dress_code: e.target.value })} className={inputClass} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-bold" style={{ background: "#B8960C" }}>5</span>
              RSVP Contacts
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelClass}>Contact 1</label>
                <input type="tel" value={form.rsvp_contact1} onChange={e => setForm({ ...form, rsvp_contact1: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Contact 2</label>
                <input type="tel" value={form.rsvp_contact2} onChange={e => setForm({ ...form, rsvp_contact2: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Contact 3</label>
                <input type="tel" value={form.rsvp_contact3} onChange={e => setForm({ ...form, rsvp_contact3: e.target.value })} className={inputClass} />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => router.back()} className="flex-1 py-3 rounded-xl font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
              Rudi
            </button>
            <button type="submit" disabled={saving} className="flex-1 py-3 rounded-xl font-bold hover:opacity-90 disabled:opacity-50 transition shadow-lg" style={{ background: "linear-gradient(135deg, #B8960C, #FFD700)", color: "#1a1200" }}>
              {saving ? "Inahifadhi..." : "Hifadhi Mabadiliko ✓"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}`;
fs.writeFileSync("app/events/[id]/edit/page.tsx", content, "utf8");
console.log("Edit event page imeandikwa!");
