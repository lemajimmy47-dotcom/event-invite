"use client"

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
    sender_id: eventType === "wedding" ? "HARUSI" : eventType === "sendoff" ? "SEND OFF" : eventType === "invitation" ? "MWALIKO" : eventType === "meeting" ? "KIKAO" : eventType === "contribution" ? "MCHANGO" : eventType === "ticket" ? "TIKETI" : eventType === "bulksend" ? "BULK SEND" : "",
    name: "",
    date: "",
    event_time: "",
    time_period: "",
    religious_site: "",
    religious_time: "",
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
      .insert([{ 
        name: form.name,
        date: form.date,
        event_time: form.event_time,
        time_period: form.time_period,
        venue: form.venue,
        coordinates: form.coordinates,
        host_name: form.host_name,
        dress_code: form.dress_code,
        rsvp_contact1: form.rsvp_contact1,
        rsvp_contact2: form.rsvp_contact2,
        rsvp_contact3: form.rsvp_contact3,
        description: form.description,
        event_type: eventType,
        template: eventType
      }])
      .select()
      .single()
    if (error) {
      alert("Hitilafu: " + error.message)
      setLoading(false)
      return
    }
    router.push("/events/" + data.id)
  }

  const inputClass = "w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm placeholder:text-gray-300"
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1"

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span className="cursor-pointer hover:text-yellow-700" onClick={() => router.push("/dashboard")}>Dashboard</span>
          <span>›</span>
          <span className="cursor-pointer hover:text-yellow-700" onClick={() => router.push("/events/new")}>Create Event</span>
        </div>
        <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">← Back</button>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Unda Tukio la {typeInfo.emoji} {typeInfo.label}</h1>
        <p className="text-gray-500 text-sm mb-6">Jaza taarifa za tukio hapa chini</p>

        <div className="bg-blue-50 border-l-4 border-blue-400 rounded-xl p-4 mb-6 flex gap-3">
          <span className="text-2xl">💡</span>
          <p className="text-sm text-blue-800">
            <strong>Mwongozo:</strong> Tumia mifano kama guide yako ili ujumbe usomeke vizuri kwenye <strong>WhatsApp</strong>. Pia, kagua <strong>Preview Page</strong> kuhakikisha uandishi umekaa sawa.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Event Information</h3>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className={labelClass}>Sender ID</label>
                {eventType === "custom" ? (
                  <select value={form.sender_id} onChange={e => setForm({ ...form, sender_id: e.target.value })} className={inputClass}>
                    <option value="">Chagua Aina ya Tukio</option>
                    <option value="HARUSI">HARUSI</option>
                    <option value="SEND OFF">SEND OFF</option>
                    <option value="MWALIKO">MWALIKO</option>
                    <option value="KIKAO">KIKAO</option>
                    <option value="MCHANGO">MCHANGO</option>
                    <option value="TIKETI">TIKETI</option>
                    <option value="BULK SEND">BULK SEND</option>
                  </select>
                ) : (
                  <input type="text" value={form.sender_id} readOnly className={inputClass + " bg-gray-50 cursor-not-allowed"} />
                )}
              </div>
              <div>
                <label className={labelClass}>Event Name *</label>
                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder={"Mfano: " + typeInfo.label + " YA JAMES NA SARAH"} />
                <p className="text-xs text-gray-400 mt-1">Mfano: {typeInfo.label} YA JAMES NA SARAH</p>
              </div>
            </div>

            <h4 className="font-medium text-gray-700 mb-3 mt-4">Date & Time</h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelClass}>Date * (Tarehe ya Siku ya Tukio)</label>
                <input type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Time * (Saa ya Kuanza)</label>
                <input type="time" required value={form.event_time} onChange={e => setForm({ ...form, event_time: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Period *</label>
                <select value={form.time_period} onChange={e => setForm({ ...form, time_period: e.target.value })} className={inputClass}>
                  <option value="">Select period</option>
                  <option>ASUBUHI</option>
                  <option>MCHANA</option>
                  <option>ALASIRI</option>
                  <option>JIONI</option>
                  <option>USIKU</option>
                </select>
              </div>
            </div>
          </div>

          {eventType === "wedding" && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Religious Service Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Religious Site</label>
                  <input type="text" value={form.religious_site} onChange={e => setForm({ ...form, religious_site: e.target.value })} className={inputClass} placeholder="Kanisa la Mtakatifu Petro - Tabata" />
                  <p className="text-xs text-gray-400 mt-1">Mfano: Kanisa la Mtakatifu Petro - Tabata</p>
                </div>
                <div>
                  <label className={labelClass}>Service Time</label>
                  <input type="text" value={form.religious_time} onChange={e => setForm({ ...form, religious_time: e.target.value })} className={inputClass} placeholder="10:00 ASUBUHI" />
                  <p className="text-xs text-gray-400 mt-1">Mfano: 10:00 ASUBUHI</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Location</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Event Hall Name</label>
                <input type="text" value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} className={inputClass} placeholder="Hangaya Hall - Tabata Segerea" />
                <p className="text-xs text-gray-400 mt-1">Mfano: Hangaya Hall - Tabata Segerea</p>
              </div>
              <div>
                <label className={labelClass}>Coordinates (Optional)</label>
                <input type="text" value={form.coordinates} onChange={e => setForm({ ...form, coordinates: e.target.value })} className={inputClass} placeholder="-6.7467, 39.1652" />
                <p className="text-xs text-gray-400 mt-1">Mfano: -6.7467, 39.1652</p>
                <a href="https://maps.google.com" target="_blank" className="text-xs text-blue-500 hover:underline">Jinsi ya kupata coordinates? Tazama hapa</a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Host & Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Host Name</label>
                <input type="text" value={form.host_name} onChange={e => setForm({ ...form, host_name: e.target.value })} className={inputClass} placeholder="Familia ya Bw & Bi John Mwanga" />
                <p className="text-xs text-gray-400 mt-1">Mfano: Familia ya Bw & Bi John Mwanga</p>
              </div>
              <div>
                <label className={labelClass}>Dress Code</label>
                <input type="text" value={form.dress_code} onChange={e => setForm({ ...form, dress_code: e.target.value })} className={inputClass} placeholder="White, Blue & Gold" />
                <p className="text-xs text-gray-400 mt-1">Mfano: White, Blue & Gold</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">RSVP Contacts</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Contact 1</label>
                <input type="tel" value={form.rsvp_contact1} onChange={e => setForm({ ...form, rsvp_contact1: e.target.value })} className={inputClass} placeholder="Robert Mwangi: 0712345678" />
                <p className="text-xs text-gray-400 mt-1">Mfano: Robert Mwangi: 0712345678</p>
              </div>
              <div>
                <label className={labelClass}>Contact 2</label>
                <input type="tel" value={form.rsvp_contact2} onChange={e => setForm({ ...form, rsvp_contact2: e.target.value })} className={inputClass} placeholder="0755987654" />
                <p className="text-xs text-gray-400 mt-1">Mfano: 0755987654</p>
              </div>
              <div>
                <label className={labelClass}>Contact 3</label>
                <input type="tel" value={form.rsvp_contact3} onChange={e => setForm({ ...form, rsvp_contact3: e.target.value })} className={inputClass} placeholder="Optional" />
                <p className="text-xs text-gray-400 mt-1">Mfano: Optional</p>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full text-white py-4 rounded-xl font-semibold text-lg hover:opacity-90 disabled:opacity-50 transition shadow-lg" style={{ background: "linear-gradient(135deg, #B8960C, #FFD700)", color: "#1a1200" }}>
            {loading ? "Inaunda..." : "Create Event ✓"}
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
}