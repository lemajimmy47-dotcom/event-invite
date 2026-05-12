const fs = require("fs");
const content = `"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

const POSITIONS = [
  { id: "top-left", label: "Juu Kushoto" },
  { id: "top-center", label: "Juu Katikati" },
  { id: "top-right", label: "Juu Kulia" },
  { id: "middle-left", label: "Katikati Kushoto" },
  { id: "middle-center", label: "Katikati" },
  { id: "middle-right", label: "Katikati Kulia" },
  { id: "bottom-left", label: "Chini Kushoto" },
  { id: "bottom-center", label: "Chini Katikati" },
  { id: "bottom-right", label: "Chini Kulia" },
  { id: "custom", label: "Custom (Card Designer)" },
]

export default function TemplatesPage({ params }: { params: Promise<{ id: string }> }) {
  const [eventId, setEventId] = useState("")
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [cardUrl, setCardUrl] = useState("")
  const [uploaded, setUploaded] = useState(false)
  const [uploadedAt, setUploadedAt] = useState("")
  const [guestNamePos, setGuestNamePos] = useState("middle-center")
  const [qrPos, setQrPos] = useState("bottom-left")
  const [cardTypePos, setCardTypePos] = useState("top-right")

  useEffect(() => {
    async function load() {
      const { id } = await params
      setEventId(id)
      const supabase = createClient()
      const { data: ev } = await supabase.from("events").select("*").eq("id", id).single()
      setEvent(ev)
      if (ev?.card_image_url) {
        setCardUrl(ev.card_image_url)
        setUploaded(true)
        setUploadedAt(new Date(ev.updated_at || ev.created_at).toLocaleDateString("sw-TZ", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }))
      }
      if (ev?.guest_name_position) setGuestNamePos(ev.guest_name_position)
      if (ev?.qr_code_position) setQrPos(ev.qr_code_position)
      if (ev?.card_type_position) setCardTypePos(ev.card_type_position)
      setLoading(false)
    }
    load()
  }, [])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) { alert("Picha ni kubwa sana! Upeo ni 10MB"); return }
    setUploading(true)
    const supabase = createClient()
    const fileName = eventId + "-card-" + Date.now() + "." + file.name.split(".").pop()
    const { error: uploadError } = await supabase.storage.from("cards").upload(fileName, file, { upsert: true })
    if (uploadError) { alert("Hitilafu: " + uploadError.message); setUploading(false); return }
    const { data: urlData } = supabase.storage.from("cards").getPublicUrl(fileName)
    const publicUrl = urlData.publicUrl
    await supabase.from("events").update({ card_image_url: publicUrl }).eq("id", eventId)
    setCardUrl(publicUrl)
    setUploaded(true)
    setUploadedAt(new Date().toLocaleDateString("sw-TZ", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }))
    setUploading(false)
  }

  async function handleDelete() {
    if (!confirm("Una uhakika unataka kufuta template hii?")) return
    const supabase = createClient()
    await supabase.from("events").update({ card_image_url: null }).eq("id", eventId)
    setCardUrl(""); setUploaded(false)
  }

  async function savePositions() {
    setSaving(true)
    const supabase = createClient()
    await supabase.from("events").update({
      guest_name_position: guestNamePos,
      qr_code_position: qrPos,
      card_type_position: cardTypePos,
    }).eq("id", eventId)
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 3000)
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
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <span>›</span>
          <Link href={"/events/" + eventId} className="hover:underline">Event Details</Link>
          <span>›</span>
          <Link href="#" className="hover:underline">Templates</Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">Kadi Template</span>
        </div>

        <button onClick={() => window.history.back()} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          ← Back to Templates
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">🎨 Kadi Template</h1>
          <p className="text-sm font-medium mt-1" style={{ color: "#B8960C" }}>
            {event?.name} <span className="uppercase">({event?.event_type})</span>
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-4">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: "#1e3a5f" }}>1</div>
              <div>
                <h2 className="font-bold text-gray-900">Kadi Template</h2>
                <span className="text-xs font-semibold text-red-500 uppercase tracking-wider">Required</span>
              </div>
            </div>
            {uploaded && (
              <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                ✓ Uploaded
              </span>
            )}
          </div>

          <div className="p-5">
            {!uploaded ? (
              <label className="block cursor-pointer">
                <div className={"border-2 border-dashed rounded-2xl p-12 text-center transition " + (uploading ? "border-yellow-400 bg-yellow-50" : "border-gray-300 hover:border-yellow-400 hover:bg-yellow-50")}>
                  {uploading ? (
                    <div>
                      <div className="w-12 h-12 rounded-full border-4 border-yellow-400 border-t-transparent animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600 font-medium">Inapakia...</p>
                    </div>
                  ) : (
                    <div>
                      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-3xl mx-auto mb-4">⬆️</div>
                      <p className="font-semibold text-gray-700 mb-1">Click kupakia Kadi Template</p>
                      <p className="text-gray-400 text-sm">PNG, JPG, au JPEG (Max 10MB)</p>
                      <p className="text-red-400 text-xs mt-2 font-medium uppercase tracking-wider">Required Size: 1200 x 1800 px</p>
                    </div>
                  )}
                </div>
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
              </label>
            ) : (
              <div>
                <div className="relative rounded-2xl overflow-hidden border border-gray-200 mb-4 bg-gray-900">
                  <img src={cardUrl} alt="Card Template" className="w-full object-contain max-h-80" />
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-3 flex items-center justify-between">
                    <span className="text-white text-xs font-medium bg-black/30 px-2 py-1 rounded-lg">Mode: portrait (1200x1800)</span>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3 border border-gray-200 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Custom Template</p>
                    <p className="text-xs text-gray-400">Uploaded {uploadedAt}</p>
                  </div>
                  <div className="flex gap-2">
                    <label className="cursor-pointer">
                      <div className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition border border-blue-200">
                        {uploading ? "Inapakia..." : "🔄 Replace"}
                      </div>
                      <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
                    </label>
                    <button onClick={handleDelete} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition border border-red-200">
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {uploaded && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-4">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">📐 Position Settings</h2>
              <p className="text-xs text-gray-400 mt-1">Chagua nafasi ya kila kipengele kwenye kadi</p>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">👤 Guest Name Position</label>
                <select value={guestNamePos} onChange={e => setGuestNamePos(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400">
                  {POSITIONS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">📱 QR Code Position</label>
                <select value={qrPos} onChange={e => setQrPos(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400">
                  {POSITIONS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">🏷️ Card Type Position</label>
                <select value={cardTypePos} onChange={e => setCardTypePos(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400">
                  {POSITIONS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                <p className="text-xs text-blue-700">
                  💡 Unataka nafasi sahihi zaidi? Tumia <Link href={"/events/" + eventId + "/editor"} className="font-bold underline">Card Designer</Link> kwa drag & drop.
                </p>
              </div>

              <button onClick={savePositions} disabled={saving} className="w-full py-3 rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-50 transition shadow" style={{ background: "linear-gradient(135deg, #B8960C, #FFD700)", color: "#1a1200" }}>
                {saving ? "Inahifadhi..." : saved ? "✅ Imehifadhiwa!" : "💾 Hifadhi Position Settings"}
              </button>
            </div>
          </div>
        )}

        {uploaded && (
          <div className="flex gap-3">
            <Link href={"/events/" + eventId + "/editor"} className="flex-1 text-center py-3 rounded-xl font-semibold text-sm text-white hover:opacity-90 transition" style={{ background: "linear-gradient(135deg, #1e3a5f, #2d5a8e)" }}>
              ✏️ Card Designer
            </Link>
            <Link href={"/events/" + eventId + "/preview"} className="flex-1 text-center py-3 rounded-xl font-semibold text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition">
              👁️ Ona Preview
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}`;
fs.writeFileSync("app/events/[id]/templates/page.tsx", content, "utf8");
console.log("Templates page imeandikwa!");
