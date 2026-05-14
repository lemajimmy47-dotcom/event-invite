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
  card_type: string | null
  rsvp_responses: { status: string }[]
  checkins: { id: string }[]
}

export default function GuestsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [eventId, setEventId] = useState("")
  const [eventName, setEventName] = useState("")
  const [eventType, setEventType] = useState("")
  const [guests, setGuests] = useState<Guest[]>([])
  const [filtered, setFiltered] = useState<Guest[]>([])
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("ALL")
  const [showDuplicates, setShowDuplicates] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [newGuest, setNewGuest] = useState({ name: "", phone: "", email: "", card_type: "SINGLE" })
  const [bulkText, setBulkText] = useState("")
  const [addLoading, setAddLoading] = useState(false)
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://event-invite-rouge.vercel.app"

  useEffect(() => {
    async function load() {
      const { id } = await params
      setEventId(id)
      const supabase = createClient()
      const { data: event } = await supabase.from("events").select("*").eq("id", id).single()
      if (event) { setEventName(event.name); setEventType(event.event_type?.toUpperCase() || "") }
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
    if (search) list = list.filter(g => g.name.toLowerCase().includes(search.toLowerCase()) || g.phone?.includes(search) || g.guest_code?.includes(search))
    if (typeFilter === "SINGLE") list = list.filter(g => !g.card_type || g.card_type === "SINGLE")
    if (typeFilter === "DOUBLE") list = list.filter(g => g.card_type === "DOUBLE")
    if (showDuplicates) {
      const names = list.map(g => g.name.toLowerCase())
      list = list.filter(g => names.filter(n => n === g.name.toLowerCase()).length > 1)
    }
    setFiltered(list)
  }, [search, typeFilter, showDuplicates, guests])

  const duplicateCount = guests.filter(g => {
    const names = guests.map(x => x.name.toLowerCase())
    return names.filter(n => n === g.name.toLowerCase()).length > 1
  }).length

  async function handleAddGuest(e: React.FormEvent) {
    e.preventDefault()
    setAddLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from("guests").insert([{ ...newGuest, event_id: eventId }])
    if (error) { alert("Hitilafu: " + error.message) }
    else {
      const { data } = await supabase.from("guests").select("*, rsvp_responses(*), checkins(*)").eq("event_id", eventId).order("created_at", { ascending: false })
      setGuests(data || [])
      setNewGuest({ name: "", phone: "", email: "", card_type: "SINGLE" })
      setShowAddModal(false)
    }
    setAddLoading(false)
  }

  async function handleBulkUpload(e: React.FormEvent) {
    e.preventDefault()
    setAddLoading(true)
    const supabase = createClient()
    const lines = bulkText.trim().split(String.fromCharCode(10)).filter(l => l.trim())
    const guestList = lines.map(line => {
      const parts = line.split(",").map(p => p.trim())
      return { event_id: eventId, name: parts[0] || "", phone: parts[1] || null, email: parts[2] || null, card_type: parts[3]?.toUpperCase() === "DOUBLE" ? "DOUBLE" : "SINGLE" }
    }).filter(g => g.name)
    if (guestList.length === 0) { alert("Hakuna wageni"); setAddLoading(false); return }
    const { error } = await supabase.from("guests").insert(guestList)
    if (error) { alert("Hitilafu: " + error.message) }
    else {
      const { data } = await supabase.from("guests").select("*, rsvp_responses(*), checkins(*)").eq("event_id", eventId).order("created_at", { ascending: false })
      setGuests(data || [])
      setBulkText("")
      setShowBulkModal(false)
    }
    setAddLoading(false)
  }

  async function deleteGuest(guestId: string) {
    if (!confirm("Futa mgeni huyu?")) return
    const supabase = createClient()
    await supabase.from("guests").delete().eq("id", guestId)
    setGuests(prev => prev.filter(g => g.id !== guestId))
  }

  async function changeCardType(guestId: string, type: string) {
    const supabase = createClient()
    await supabase.from("guests").update({ card_type: type }).eq("id", guestId)
    setGuests(prev => prev.map(g => g.id === guestId ? { ...g, card_type: type } : g))
  }

  function exportCSV() {
    const headers = ["Jina", "Simu", "Email", "Code", "Card Type", "RSVP", "Amefika"]
    const rows = guests.map(g => [g.name, g.phone||"", g.email||"", g.guest_code||"", g.card_type||"SINGLE", g.rsvp_responses?.[0]?.status||"pending", g.checkins?.length > 0 ? "Ndiyo" : "Hapana"])
    const csv = [headers, ...rows].map(r => r.join(",")).join(String.fromCharCode(10))
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a"); a.href = url; a.download = "wageni.csv"; a.click()
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen"><p className="text-gray-500">Inapakia...</p></div>

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Msaada / Support:</span>
          <a href="https://wa.me/255653578184" target="_blank" className="text-green-600 font-medium">💬 WhatsApp</a>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">Upload Guests</span>
        </div>

        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl" style={{ background: "#1e3a5f" }}>👥</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Upload Guests</h1>
              <p className="text-sm font-medium" style={{ color: "#1e3a5f" }}>
                {eventName} <span className="text-gray-400">({eventType})</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-0 bg-gray-900 text-white rounded-xl overflow-hidden text-sm">
            <div className="px-5 py-3 border-r border-gray-700 text-center">
              <p className="font-bold text-lg">{guests.length}</p>
              <p className="text-gray-400 text-xs uppercase tracking-wider">Uploads</p>
            </div>
            <div className="px-5 py-3 border-r border-gray-700 text-center">
              <p className="font-bold text-lg">{guests.length}</p>
              <p className="text-gray-400 text-xs uppercase tracking-wider">Guests</p>
            </div>
            <div className="px-5 py-3 text-center">
              <p className="font-bold text-lg">{guests.filter(g => g.card_type === "DOUBLE").length}</p>
              <p className="text-gray-400 text-xs uppercase tracking-wider">Double</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button onClick={() => setShowAddModal(true)} className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:border-yellow-400 hover:bg-yellow-50 transition text-sm">
            + ADD GUEST
          </button>
          <button onClick={() => setShowBulkModal(true)} className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:border-yellow-400 hover:bg-yellow-50 transition text-sm">
            📋 BULK UPLOAD
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center gap-3 flex-wrap">
            <p className="font-bold text-gray-900 text-sm uppercase tracking-wider">
              GUESTS ({filtered.length}/{guests.length})
            </p>
            <div className="flex-1 min-w-48">
              <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2">
                <span className="text-gray-400 text-sm">🔍</span>
                <input type="text" placeholder="Search guests..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 text-sm focus:outline-none text-gray-700 placeholder-gray-400" />
              </div>
            </div>
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none font-medium text-gray-700">
              <option value="ALL">ALL TYPES</option>
              <option value="SINGLE">SINGLE</option>
              <option value="DOUBLE">DOUBLE</option>
            </select>
            <label className="flex items-center gap-2 cursor-pointer border border-gray-200 rounded-xl px-3 py-2">
              <input type="checkbox" checked={showDuplicates} onChange={e => setShowDuplicates(e.target.checked)} className="accent-yellow-500" />
              <span className="text-sm text-gray-600">DUPLICATES ({duplicateCount})</span>
            </label>
            <button onClick={() => { const { data } = {}; window.location.reload() }} className="border border-gray-200 rounded-xl p-2 hover:bg-gray-50 transition" title="Refresh">🔄</button>
            <button onClick={exportCSV} className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold text-white bg-green-500 hover:bg-green-600 transition">
              ⬇ EXPORT
            </button>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-3xl mx-auto mb-4">👥</div>
              <p className="text-gray-400 font-medium uppercase tracking-wider text-sm">
                {guests.length === 0 ? "NO GUESTS UPLOADED YET. ADD GUESTS ABOVE." : "HAKUNA WAGENI WANAOLINGANA"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filtered.map((guest, index) => {
                const rsvp = guest.rsvp_responses?.[0]?.status
                const isCheckedIn = guest.checkins?.length > 0
                const invitationLink = APP_URL + "/api/invitation/" + guest.qr_token
                const waLink = "https://wa.me/" + (guest.phone?.replace(/^0/, "255") ?? "") + "?text=" + encodeURIComponent("Karibu " + guest.name + "! Pakua invitation: " + invitationLink)
                return (
                  <div key={guest.id} className="px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition">
                    <span className="text-xs text-gray-300 w-6 text-center flex-shrink-0">{index + 1}</span>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: "#1e3a5f" }}>
                      {guest.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900 text-sm">{guest.name}</p>
                        {guest.guest_code && <span className="text-xs font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{guest.guest_code}</span>}
                        {isCheckedIn && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">✓ Amefika</span>}
                        <span className={"text-xs px-2 py-0.5 rounded-full " + (rsvp === "attending" ? "bg-green-100 text-green-700" : rsvp === "not_attending" ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-400")}>
                          {rsvp === "attending" ? "✅ Atahudhuria" : rsvp === "not_attending" ? "❌ Hatahudhuria" : "⏳ Hajajibu"}
                        </span>
                      </div>
                      {guest.phone && <p className="text-gray-400 text-xs mt-0.5">📱 {guest.phone}</p>}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <select
                        value={guest.card_type || "SINGLE"}
                        onChange={e => changeCardType(guest.id, e.target.value)}
                        className="border border-gray-200 rounded-lg px-2 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-yellow-400"
                      >
                        <option value="SINGLE">Single</option>
                        <option value="DOUBLE">Double</option>
                      </select>
                      {guest.phone && (
                        <a href={waLink} target="_blank" rel="noopener noreferrer" className="text-xs bg-green-500 text-white px-2 py-1.5 rounded-lg hover:bg-green-600 transition">📲</a>
                      )}
                      <a href={invitationLink} target="_blank" rel="noopener noreferrer" className="text-xs px-2 py-1.5 rounded-lg transition" style={{ background: "#FFF8DC", color: "#B8960C" }}>🎫</a>
                      <Link href={"/events/" + eventId + "/guests/" + guest.id} className="text-xs bg-gray-100 text-gray-600 px-2 py-1.5 rounded-lg hover:bg-gray-200 transition">✏️</Link>
                      <button onClick={() => deleteGuest(guest.id)} className="text-xs bg-red-50 text-red-500 px-2 py-1.5 rounded-lg hover:bg-red-100 transition">🗑️</button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">+ Add Single Guest</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>
            <form onSubmit={handleAddGuest} className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Guest Name *</label>
                <input type="text" required value={newGuest.name} onChange={e => setNewGuest(s => ({ ...s, name: e.target.value }))} placeholder="Eugen Mamboya" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Phone Number *</label>
                <input type="tel" required value={newGuest.phone} onChange={e => setNewGuest(s => ({ ...s, phone: e.target.value }))} placeholder="255123456789 or 0712345678" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                <p className="text-xs text-gray-400 mt-1">International format (e.g. 255123456789). Tanzania 07/06 is converted to 255</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Card Type</label>
                <select value={newGuest.card_type} onChange={e => setNewGuest(s => ({ ...s, card_type: e.target.value }))} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400">
                  <option value="SINGLE">SINGLE</option>
                  <option value="DOUBLE">DOUBLE</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={addLoading} className="flex-1 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50 transition" style={{ background: "linear-gradient(135deg, #1e3a5f, #2d5a8e)", color: "white" }}>
                  {addLoading ? "Inaongeza..." : "ADD GUEST"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showBulkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">📋 Bulk Upload</h3>
              <button onClick={() => setShowBulkModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>
            <form onSubmit={handleBulkUpload} className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Andika Wageni</label>
                <p className="text-xs text-gray-400 mb-2">Format: Jina, Simu, Email, CardType (SINGLE/DOUBLE)</p>
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-yellow-400" placeholder="Amina Hassan, 0712345678, , SINGLE" />
              </div>
              <div className="bg-blue-50 rounded-xl p-3 text-sm text-blue-700">
                Wageni: <strong>{bulkText.trim().split("
").filter(l => l.trim()).length}</strong>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowBulkModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={addLoading} className="flex-1 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50 transition" style={{ background: "linear-gradient(135deg, #1e3a5f, #2d5a8e)", color: "white" }}>
                  {addLoading ? "Inaongeza..." : "UPLOAD WOTE"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}