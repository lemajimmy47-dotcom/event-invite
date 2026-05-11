const fs = require("fs");
const content = `"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

export default function TemplatesPage({ params }: { params: Promise<{ id: string }> }) {
  const [eventId, setEventId] = useState("")
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [cardUrl, setCardUrl] = useState("")
  const [uploaded, setUploaded] = useState(false)

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
      }
      setLoading(false)
    }
    load()
  }, [])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    
    if (file.size > 10 * 1024 * 1024) {
      alert("Picha ni kubwa sana! Upeo ni 10MB")
      return
    }

    setUploading(true)
    setUploaded(false)
    
    const supabase = createClient()
    const fileName = eventId + "-card-" + Date.now() + "." + file.name.split(".").pop()
    
    const { error: uploadError } = await supabase.storage
      .from("cards")
      .upload(fileName, file, { upsert: true })
    
    if (uploadError) {
      alert("Hitilafu ya kupakia: " + uploadError.message)
      setUploading(false)
      return
    }
    
    const { data: urlData } = supabase.storage.from("cards").getPublicUrl(fileName)
    const publicUrl = urlData.publicUrl
    
    const { error: updateError } = await supabase
      .from("events")
      .update({ card_image_url: publicUrl })
      .eq("id", eventId)
    
    if (updateError) {
      alert("Hitilafu ya kuhifadhi: " + updateError.message)
      setUploading(false)
      return
    }
    
    setCardUrl(publicUrl)
    setUploaded(true)
    setUploading(false)
  }

  async function handleDelete() {
    if (!confirm("Una uhakika unataka kufuta template hii?")) return
    const supabase = createClient()
    await supabase.from("events").update({ card_image_url: null }).eq("id", eventId)
    setCardUrl("")
    setUploaded(false)
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
          <span className="text-gray-900 font-medium">Upload Card</span>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">🎨 Templates</h1>
          <p className="text-sm text-gray-500 mt-1">
            {event?.name} <span className="uppercase font-medium" style={{ color: "#B8960C" }}>({event?.event_type})</span>
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: "#1e3a5f" }}>1</div>
              <div>
                <h2 className="font-bold text-gray-900">Kadi</h2>
                <span className="text-xs font-medium text-red-500 uppercase tracking-wider">Required</span>
              </div>
            </div>
            {uploaded && (
              <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                ✓ Uploaded
              </span>
            )}
          </div>

          <div className="p-6">
            {!uploaded ? (
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-yellow-400 hover:bg-yellow-50 transition">
                  {uploading ? (
                    <div>
                      <div className="w-12 h-12 rounded-full border-4 border-yellow-400 border-t-transparent animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600 font-medium">Inapakia...</p>
                      <p className="text-gray-400 text-sm mt-1">Tafadhali subiri</p>
                    </div>
                  ) : (
                    <div>
                      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-3xl mx-auto mb-4">⬆️</div>
                      <p className="font-semibold text-gray-700 mb-1">Click kupakia Kadi Template</p>
                      <p className="text-gray-400 text-sm">PNG, JPG, au JPEG (Max 10MB)</p>
                      <p className="text-red-400 text-xs mt-2 font-medium">REQUIRED SIZE: 1200 X 1800 PX</p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            ) : (
              <div>
                <div className="relative rounded-2xl overflow-hidden border border-gray-200 mb-4">
                  <img src={cardUrl} alt="Card Template" className="w-full object-contain max-h-96" />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <a href={cardUrl} target="_blank" className="bg-white text-gray-700 text-xs px-3 py-1.5 rounded-lg shadow hover:bg-gray-50 transition font-medium">
                      👁️ Ona
                    </a>
                    <button onClick={handleDelete} className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg shadow hover:bg-red-600 transition font-medium">
                      🗑️ Futa
                    </button>
                  </div>
                </div>

                <label className="block cursor-pointer">
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-yellow-400 hover:bg-yellow-50 transition">
                    {uploading ? (
                      <p className="text-gray-500 text-sm">Inapakia...</p>
                    ) : (
                      <p className="text-gray-500 text-sm">🔄 Badilisha template — Click hapa kupakia mpya</p>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
            )}
          </div>

          {uploaded && (
            <div className="px-6 pb-6">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-xs text-blue-700">
                  <strong>💡 Jinsi inavyofanya kazi:</strong> Template hii itatumika kama background ya kadi za mwaliko za wageni wako. Jina la mgeni na QR code vitawekwa juu ya picha hii automatically.
                </p>
              </div>
            </div>
          )}
        </div>

        {uploaded && (
          <div className="mt-6 flex gap-3">
            <Link href={"/events/" + eventId + "/preview"} className="flex-1 text-center py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition" style={{ background: "linear-gradient(135deg, #1e3a5f, #2d5a8e)", color: "white" }}>
              👁️ Ona Preview
            </Link>
            <Link href={"/events/" + eventId + "/guests"} className="flex-1 text-center py-3 rounded-xl font-semibold text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition">
              👥 Simamia Wageni
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}`;
fs.writeFileSync("app/events/[id]/templates/page.tsx", content, "utf8");
console.log("Templates page imeandikwa!");
