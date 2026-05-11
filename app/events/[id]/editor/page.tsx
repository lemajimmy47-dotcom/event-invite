"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

export default function CardEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const [eventId, setEventId] = useState("")
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dragging, setDragging] = useState<string | null>(null)
  const [cardImage, setCardImage] = useState<HTMLImageElement | null>(null)

  const [settings, setSettings] = useState({
    qr_position_x: 0.75,
    qr_position_y: 0.75,
    qr_size: 15,
    name_position_x: 0.5,
    name_position_y: 0.6,
    name_font_size: 24,
    name_color: "#ffffff",
    show_date: true,
    show_venue: true,
    show_dress_code: true,
    show_contacts: true,
    card_text_color: "#ffffff",
  })

  useEffect(() => {
    async function load() {
      const { id } = await params
      setEventId(id)
      const supabase = createClient()
      const { data: ev } = await supabase.from("events").select("*").eq("id", id).single()
      if (ev) {
        setEvent(ev)
        setSettings({
          qr_position_x: ev.qr_position_x ?? 0.75,
          qr_position_y: ev.qr_position_y ?? 0.75,
          qr_size: ev.qr_size ?? 15,
          name_position_x: ev.name_position_x ?? 0.5,
          name_position_y: ev.name_position_y ?? 0.6,
          name_font_size: ev.name_font_size ?? 24,
          name_color: ev.name_color ?? "#ffffff",
          show_date: ev.show_date ?? true,
          show_venue: ev.show_venue ?? true,
          show_dress_code: ev.show_dress_code ?? true,
          show_contacts: ev.show_contacts ?? true,
          card_text_color: ev.card_text_color ?? "#ffffff",
        })
        if (ev.card_image_url) {
          const img = new Image()
          img.crossOrigin = "anonymous"
          img.onload = () => setCardImage(img)
          img.src = ev.card_image_url
        }
      }
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    drawCanvas()
  }, [settings, cardImage])

  function drawCanvas() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const W = canvas.width
    const H = canvas.height

    ctx.clearRect(0, 0, W, H)

    if (cardImage) {
      ctx.drawImage(cardImage, 0, 0, W, H)
    } else {
      ctx.fillStyle = "#1e3a5f"
      ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = "rgba(255,255,255,0.1)"
      ctx.fillRect(20, 20, W-40, H-40)
    }

    const qrX = settings.qr_position_x * W
    const qrY = settings.qr_position_y * H
    const qrS = (settings.qr_size / 100) * W

    ctx.fillStyle = "white"
    ctx.fillRect(qrX - qrS/2 - 4, qrY - qrS/2 - 4, qrS + 8, qrS + 8)
    ctx.fillStyle = "#333"
    ctx.fillRect(qrX - qrS/2, qrY - qrS/2, qrS, qrS)

    const qrPattern = [
      [0,0],[1,0],[2,0],[0,1],[2,1],[0,2],[1,2],[2,2],
      [5,0],[6,0],[7,0],[5,1],[7,1],[5,2],[6,2],[7,2],
      [0,5],[1,5],[2,5],[0,6],[2,6],[0,7],[1,7],[2,7],
    ]
    const cell = qrS / 8
    ctx.fillStyle = "white"
    qrPattern.forEach(([x, y]) => {
      ctx.fillRect(qrX - qrS/2 + x*cell, qrY - qrS/2 + y*cell, cell*0.8, cell*0.8)
    })

    ctx.fillStyle = "rgba(255,215,0,0.8)"
    ctx.beginPath()
    ctx.arc(qrX - qrS/2 - 8, qrY - qrS/2 - 8, 5, 0, Math.PI * 2)
    ctx.fill()

    const nameX = settings.name_position_x * W
    const nameY = settings.name_position_y * H

    ctx.font = "bold " + settings.name_font_size + "px Georgia, serif"
    ctx.fillStyle = settings.name_color
    ctx.textAlign = "center"
    ctx.shadowColor = "rgba(0,0,0,0.5)"
    ctx.shadowBlur = 4

    ctx.fillText("JINA LA MGENI", nameX, nameY)

    ctx.shadowBlur = 0
    ctx.font = "14px Arial"
    ctx.fillStyle = settings.card_text_color
    ctx.globalAlpha = 0.8

    let yOffset = nameY + 30
    const lineH = 22

    if (settings.show_date && event?.date) {
      ctx.fillText("📅 " + new Date(event.date).toLocaleDateString("sw-TZ", {day:"2-digit", month:"long", year:"numeric"}), nameX, yOffset)
      yOffset += lineH
    }
    if (settings.show_venue && event?.venue) {
      ctx.fillText("📍 " + event.venue, nameX, yOffset)
      yOffset += lineH
    }
    if (settings.show_dress_code && event?.dress_code) {
      ctx.fillText("👗 " + event.dress_code, nameX, yOffset)
      yOffset += lineH
    }

    ctx.globalAlpha = 1

    ctx.fillStyle = "rgba(255,215,0,0.6)"
    ctx.beginPath()
    ctx.arc(nameX - ctx.measureText("JINA LA MGENI").width/2 - 10, nameY, 4, 0, Math.PI*2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(nameX + ctx.measureText("JINA LA MGENI").width/2 + 10, nameY, 4, 0, Math.PI*2)
    ctx.fill()
  }

  function getCanvasPos(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    return {
      x: (e.clientX - rect.left) * scaleX / canvas.width,
      y: (e.clientY - rect.top) * scaleY / canvas.height
    }
  }

  function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    const pos = getCanvasPos(e)
    const qrDist = Math.abs(pos.x - settings.qr_position_x) + Math.abs(pos.y - settings.qr_position_y)
    const nameDist = Math.abs(pos.x - settings.name_position_x) + Math.abs(pos.y - settings.name_position_y)
    if (qrDist < 0.08) setDragging("qr")
    else if (nameDist < 0.08) setDragging("name")
  }

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!dragging) return
    const pos = getCanvasPos(e)
    const x = Math.max(0.05, Math.min(0.95, pos.x))
    const y = Math.max(0.05, Math.min(0.95, pos.y))
    if (dragging === "qr") setSettings(s => ({ ...s, qr_position_x: x, qr_position_y: y }))
    else if (dragging === "name") setSettings(s => ({ ...s, name_position_x: x, name_position_y: y }))
  }

  function handleMouseUp() { setDragging(null) }

  async function saveSettings() {
    setSaving(true)
    const supabase = createClient()
    await supabase.from("events").update(settings).eq("id", eventId)
    setSaving(false)
    setSaved(true)
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

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <span>›</span>
          <Link href={"/events/" + eventId} className="hover:underline">Event Details</Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">Card Editor</span>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">🎨 Card Editor</h1>
          <p className="text-sm text-gray-500 mt-1">Buruta QR code na jina la mgeni mahali unapotaka kwenye kadi</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">🖼️ Preview ya Kadi</h3>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block"></span> QR Code
                  <span className="w-3 h-3 rounded-full bg-blue-400 inline-block ml-2"></span> Jina
                </div>
              </div>
              <div className="p-4">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4 text-xs text-blue-700">
                  💡 <strong>Buruta</strong> QR code au jina la mgeni kwenye picha uweke mahali unapotaka
                </div>
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={600}
                  className="w-full rounded-xl border border-gray-200 cursor-crosshair"
                  style={{ maxHeight: "600px", objectFit: "contain" }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-4">📐 Mipangilio ya QR Code</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Ukubwa wa QR (%)</label>
                  <input type="range" min="5" max="40" value={settings.qr_size}
                    onChange={e => setSettings(s => ({ ...s, qr_size: Number(e.target.value) }))}
                    className="w-full accent-yellow-500"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Ndogo</span>
                    <span className="font-medium text-gray-700">{settings.qr_size}%</span>
                    <span>Kubwa</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">X Position</label>
                    <input type="range" min="5" max="95" value={Math.round(settings.qr_position_x * 100)}
                      onChange={e => setSettings(s => ({ ...s, qr_position_x: Number(e.target.value) / 100 }))}
                      className="w-full accent-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Y Position</label>
                    <input type="range" min="5" max="95" value={Math.round(settings.qr_position_y * 100)}
                      onChange={e => setSettings(s => ({ ...s, qr_position_y: Number(e.target.value) / 100 }))}
                      className="w-full accent-yellow-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-4">✍️ Mipangilio ya Jina</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Ukubwa wa Maandishi</label>
                  <input type="range" min="12" max="48" value={settings.name_font_size}
                    onChange={e => setSettings(s => ({ ...s, name_font_size: Number(e.target.value) }))}
                    className="w-full accent-yellow-500"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Ndogo</span>
                    <span className="font-medium text-gray-700">{settings.name_font_size}px</span>
                    <span>Kubwa</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Rangi ya Jina</label>
                    <input type="color" value={settings.name_color}
                      onChange={e => setSettings(s => ({ ...s, name_color: e.target.value }))}
                      className="w-full h-9 rounded-lg border border-gray-200 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Rangi ya Maandishi</label>
                    <input type="color" value={settings.card_text_color}
                      onChange={e => setSettings(s => ({ ...s, card_text_color: e.target.value }))}
                      className="w-full h-9 rounded-lg border border-gray-200 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-4">📋 Maandishi ya Kuonyesha</h3>
              <div className="space-y-2">
                {[
                  { key: "show_date", label: "📅 Tarehe" },
                  { key: "show_venue", label: "📍 Ukumbi" },
                  { key: "show_dress_code", label: "👗 Dress Code" },
                  { key: "show_contacts", label: "📞 Mawasiliano" },
                ].map(item => (
                  <label key={item.key} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings[item.key as keyof typeof settings] as boolean}
                      onChange={e => setSettings(s => ({ ...s, [item.key]: e.target.checked }))}
                      className="w-4 h-4 rounded accent-yellow-500"
                    />
                    <span className="text-sm text-gray-700">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={saveSettings}
              disabled={saving}
              className="w-full py-3 rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-50 transition shadow-lg"
              style={{ background: "linear-gradient(135deg, #B8960C, #FFD700)", color: "#1a1200" }}
            >
              {saving ? "Inahifadhi..." : saved ? "✅ Imehifadhiwa!" : "💾 Hifadhi Mipangilio"}
            </button>

            <Link
              href={"/events/" + eventId + "/templates"}
              className="block w-full text-center py-3 rounded-xl font-medium text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
            >
              🖼️ Badilisha Template
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}