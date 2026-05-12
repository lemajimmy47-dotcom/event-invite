const fs = require("fs");
const content = `"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

export default function CardEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const [eventId, setEventId] = useState("")
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState("content")
  const [cardImage, setCardImage] = useState<HTMLImageElement | null>(null)
  const [dragging, setDragging] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [card, setCard] = useState({
    card_type: "SINGLE",
    single_color: "#1e3a5f",
    double_color: "#FFD700",
    card_title: "",
    card_subtitle: "",
    card_host_text: "",
    card_event_label: "Itakayofanyika",
    card_color1: "#D4B483",
    card_color2: "#C9A84C",
    card_color3: "#B8960C",
    card_show_colors: true,
    qr_position_x: 0.15,
    qr_position_y: 0.85,
    qr_size: 15,
    name_color: "#FFD700",
    name_font_size: 28,
    card_text_color: "#ffffff",
    show_date: true,
    show_venue: true,
    show_dress_code: true,
    show_contacts: true,
  })

  useEffect(() => {
    async function load() {
      const { id } = await params
      setEventId(id)
      const supabase = createClient()
      const { data: ev } = await supabase.from("events").select("*").eq("id", id).single()
      if (ev) {
        setEvent(ev)
        setCard(prev => ({
          ...prev,
          card_type: ev.card_type || "SINGLE",
          card_title: ev.card_title || ev.name || "",
          card_subtitle: ev.card_subtitle || "",
          card_host_text: ev.card_host_text || ev.host_name || "",
          card_event_label: ev.card_event_label || "Itakayofanyika",
          card_color1: ev.card_color1 || "#D4B483",
          card_color2: ev.card_color2 || "#C9A84C",
          card_color3: ev.card_color3 || "#B8960C",
          card_show_colors: ev.card_show_colors ?? true,
          qr_position_x: ev.qr_position_x || 0.15,
          qr_position_y: ev.qr_position_y || 0.85,
          qr_size: ev.qr_size || 15,
          name_color: ev.name_color || "#FFD700",
          name_font_size: ev.name_font_size || 28,
          card_text_color: ev.card_text_color || "#ffffff",
          show_date: ev.show_date ?? true,
          show_venue: ev.show_venue ?? true,
          show_dress_code: ev.show_dress_code ?? true,
          show_contacts: ev.show_contacts ?? true,
        }))
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

  useEffect(() => { drawCanvas() }, [card, cardImage, event])

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
      const grad = ctx.createLinearGradient(0, 0, 0, H)
      grad.addColorStop(0, "#0a1628")
      grad.addColorStop(1, "#1e3a5f")
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W, H)
    }

    if (card.card_type === "DOUBLE") {
      ctx.fillStyle = card.double_color
      ctx.font = "bold 20px Arial"
      ctx.textAlign = "right"
      ctx.shadowColor = "rgba(0,0,0,0.5)"
      ctx.shadowBlur = 4
      ctx.fillText("Double", W - 15, 30)
      ctx.shadowBlur = 0
    } else {
      ctx.fillStyle = card.single_color
      ctx.font = "bold 20px Arial"
      ctx.textAlign = "right"
      ctx.shadowColor = "rgba(0,0,0,0.5)"
      ctx.shadowBlur = 4
      ctx.fillText("Single", W - 15, 30)
      ctx.shadowBlur = 0
    }

    ctx.textAlign = "center"
    let y = 80

    if (card.card_host_text) {
      ctx.font = "15px Georgia"
      ctx.fillStyle = card.card_text_color
      ctx.globalAlpha = 0.9
      const words = card.card_host_text.split(" ")
      let line = ""
      for (const word of words) {
        const test = line + word + " "
        if (ctx.measureText(test).width > W - 60 && line !== "") {
          ctx.fillText(line.trim(), W/2, y)
          y += 22
          line = word + " "
        } else {
          line = test
        }
      }
      if (line) { ctx.fillText(line.trim(), W/2, y); y += 30 }
      ctx.globalAlpha = 1
    }

    ctx.font = "bold " + card.name_font_size + "px Georgia"
    ctx.fillStyle = card.name_color
    ctx.shadowColor = "rgba(0,0,0,0.5)"
    ctx.shadowBlur = 6
    ctx.fillText("JINA LA MGENI", W/2, y)
    ctx.shadowBlur = 0

    ctx.strokeStyle = card.name_color
    ctx.globalAlpha = 0.5
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.moveTo(W/2 - 130, y + 8)
    ctx.lineTo(W/2 + 130, y + 8)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.globalAlpha = 1
    y += 35

    if (card.card_subtitle) {
      ctx.font = "15px Georgia"
      ctx.fillStyle = card.card_text_color
      ctx.globalAlpha = 0.85
      ctx.fillText(card.card_subtitle, W/2, y)
      y += 28
      ctx.globalAlpha = 1
    }

    if (card.card_title) {
      ctx.font = "bold 22px Georgia"
      ctx.fillStyle = card.name_color
      ctx.fillText(card.card_title, W/2, y)
      y += 35
    }

    if (card.card_event_label) {
      ctx.font = "italic 13px Georgia"
      ctx.fillStyle = card.card_text_color
      ctx.globalAlpha = 0.7
      ctx.fillText(card.card_event_label, W/2, y)
      y += 28
      ctx.globalAlpha = 1
    }

    if (card.show_date && event?.date) {
      const d = new Date(event.date)
      const days = ["Jumapili","Jumatatu","Jumanne","Jumatano","Alhamisi","Ijumaa","Jumamosi"]
      const months = ["JANUARI","FEBRUARI","MACHI","APRILI","MEI","JUNI","JULAI","AGOSTI","SEPTEMBA","OKTOBA","NOVEMBA","DESEMBA"]
      ctx.strokeStyle = card.card_text_color
      ctx.lineWidth = 1
      ctx.globalAlpha = 0.4
      ctx.beginPath(); ctx.moveTo(W/2 - 100, y - 8); ctx.lineTo(W/2 - 35, y - 8); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(W/2 + 35, y - 8); ctx.lineTo(W/2 + 100, y - 8); ctx.stroke()
      ctx.globalAlpha = 1
      ctx.font = "bold 12px Arial"; ctx.fillStyle = card.card_text_color
      ctx.fillText(days[d.getDay()].toUpperCase(), W/2 - 60, y)
      ctx.font = "bold 38px Georgia"; ctx.fillStyle = card.name_color
      ctx.fillText(String(d.getDate()).padStart(2,"0"), W/2, y + 10)
      ctx.font = "bold 12px Arial"; ctx.fillStyle = card.card_text_color
      ctx.fillText(String(d.getFullYear()), W/2 + 60, y)
      y += 22
      ctx.font = "bold 13px Arial"
      ctx.fillText(months[d.getMonth()], W/2, y)
      y += 35
    }

    if (card.show_venue && event?.venue) {
      ctx.font = "bold 13px Arial"; ctx.fillStyle = card.card_text_color; ctx.globalAlpha = 1
      ctx.fillText(event.venue.toUpperCase(), W/2, y); y += 20
      if (event?.event_time) {
        ctx.font = "13px Arial"; ctx.globalAlpha = 0.8
        ctx.fillText(event.event_time + " " + (event.time_period||""), W/2, y); y += 30
      }
      ctx.globalAlpha = 1
    }

    if (card.show_dress_code && event?.dress_code) {
      ctx.font = "12px Arial"; ctx.fillStyle = card.card_text_color; ctx.globalAlpha = 0.7
      ctx.fillText("COLOR CODES", W/2, y); y += 18
      ctx.font = "bold 14px Georgia"; ctx.fillStyle = card.name_color; ctx.globalAlpha = 1
      ctx.fillText(event.dress_code, W/2, y); y += 20
      if (card.card_show_colors) {
        const colors = [card.card_color1, card.card_color2, card.card_color3]
        const boxW = 60; const boxH = 20
        const totalW = colors.length * (boxW + 8)
        let bx = W/2 - totalW/2
        colors.forEach(color => {
          ctx.fillStyle = color; ctx.globalAlpha = 1
          ctx.beginPath(); ctx.roundRect(bx, y, boxW, boxH, 4); ctx.fill()
          bx += boxW + 8
        })
        y += 35
      }
    }

    if (card.show_contacts && (event?.rsvp_contact1 || event?.rsvp_contact2 || event?.rsvp_contact3)) {
      ctx.font = "bold 13px Arial"; ctx.fillStyle = card.card_text_color; ctx.globalAlpha = 1
      ctx.fillText("Mawasiliano:", W/2, y); y += 20
      ctx.font = "12px Arial"; ctx.globalAlpha = 0.85
      if (event?.rsvp_contact1) { ctx.fillText(event.rsvp_contact1, W/2, y); y += 18 }
      if (event?.rsvp_contact2) { ctx.fillText(event.rsvp_contact2, W/2, y); y += 18 }
      if (event?.rsvp_contact3) { ctx.fillText(event.rsvp_contact3, W/2, y); y += 18 }
    }

    const qrX = card.qr_position_x * W
    const qrY = card.qr_position_y * H
    const qrS = (card.qr_size / 100) * W
    ctx.globalAlpha = 1
    ctx.fillStyle = "white"
    ctx.fillRect(qrX - qrS/2 - 4, qrY - qrS/2 - 4, qrS + 8, qrS + 8)
    ctx.fillStyle = "#000"
    ctx.fillRect(qrX - qrS/2, qrY - qrS/2, qrS, qrS)
    const cell = qrS / 8
    ctx.fillStyle = "white"
    const qrPattern: [number,number][] = [[0,0],[1,0],[2,0],[0,1],[2,1],[0,2],[1,2],[2,2],[5,0],[6,0],[7,0],[5,1],[7,1],[5,2],[6,2],[7,2],[0,5],[1,5],[2,5],[0,6],[2,6],[0,7],[1,7],[2,7]]
    qrPattern.forEach(([px,py]) => {
      ctx.fillRect(qrX - qrS/2 + px*cell, qrY - qrS/2 + py*cell, cell*0.8, cell*0.8)
    })
    ctx.strokeStyle = "#FFD700"; ctx.lineWidth = 2; ctx.globalAlpha = 0.8
    ctx.strokeRect(qrX - qrS/2 - 6, qrY - qrS/2 - 6, qrS + 12, qrS + 12)
    ctx.globalAlpha = 1

    ctx.font = "10px Arial"; ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.textAlign = "center"
    ctx.fillText("QR CODE", qrX, qrY + qrS/2 + 16)
  }

  function getCanvasPos(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    let clientX, clientY
    if ("touches" in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }
    return {
      x: (clientX - rect.left) / rect.width,
      y: (clientY - rect.top) / rect.height
    }
  }

  function handleStart(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    const pos = getCanvasPos(e)
    const qrDist = Math.sqrt(Math.pow(pos.x - card.qr_position_x, 2) + Math.pow(pos.y - card.qr_position_y, 2))
    if (qrDist < 0.12) setDragging("qr")
  }

  function handleMove(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    if (!dragging) return
    e.preventDefault()
    const pos = getCanvasPos(e)
    const x = Math.max(0.05, Math.min(0.95, pos.x))
    const y = Math.max(0.05, Math.min(0.95, pos.y))
    setCard(s => ({ ...s, qr_position_x: x, qr_position_y: y }))
  }

  function handleEnd() { setDragging(null) }

  async function saveSettings() {
    setSaving(true)
    const supabase = createClient()
    await supabase.from("events").update(card).eq("id", eventId)
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen"><p>Inapakia...</p></div>

  const inputCls = "w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
  const labelCls = "block text-xs font-medium text-gray-500 mb-1"

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Msaada / Support:</span>
          <a href="https://wa.me/255653578184" target="_blank" className="text-green-600 font-medium">💬 WhatsApp</a>
        </div>
        <button onClick={saveSettings} disabled={saving} className="px-5 py-2 rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-50 transition shadow" style={{ background: "linear-gradient(135deg, #B8960C, #FFD700)", color: "#1a1200" }}>
          {saving ? "Inahifadhi..." : saved ? "✅ Imehifadhiwa!" : "💾 Hifadhi"}
        </button>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <span>›</span>
          <Link href={"/events/" + eventId} className="hover:underline">Event Details</Link>
          <span>›</span>
          <span className="font-medium text-gray-900">🎨 Card Designer</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 text-sm">🖼️ Preview — Buruta QR code</h3>
                <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setCard(s => ({ ...s, card_type: "SINGLE" }))}
                    className={"px-4 py-1.5 rounded-lg text-xs font-bold transition " + (card.card_type === "SINGLE" ? "bg-white shadow text-gray-900" : "text-gray-400")}
                  >
                    Single
                  </button>
                  <button
                    onClick={() => setCard(s => ({ ...s, card_type: "DOUBLE" }))}
                    className={"px-4 py-1.5 rounded-lg text-xs font-bold transition " + (card.card_type === "DOUBLE" ? "bg-white shadow text-gray-900" : "text-gray-400")}
                  >
                    Double
                  </button>
                </div>
              </div>
              <div className="p-4 bg-gray-900 rounded-b-2xl">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={600}
                  className="w-full rounded-xl border-2 border-yellow-500 cursor-crosshair touch-none"
                  onMouseDown={handleStart}
                  onMouseMove={handleMove}
                  onMouseUp={handleEnd}
                  onMouseLeave={handleEnd}
                  onTouchStart={handleStart}
                  onTouchMove={handleMove}
                  onTouchEnd={handleEnd}
                />
                <p className="text-xs text-gray-400 text-center mt-2">💡 Buruta QR code (fremu ya dhahabu) kwenda mahali unapotaka — inafanya kazi simu pia!</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
              {[["content","📝 Maandishi"],["design","🎨 Rangi"],["position","📐 QR Nafasi"]].map(([id, label]) => (
                <button key={id} onClick={() => setActiveTab(id)} className={"flex-1 py-2 rounded-lg text-xs font-medium transition " + (activeTab === id ? "bg-white shadow text-gray-900" : "text-gray-500")}>
                  {label}
                </button>
              ))}
            </div>

            {activeTab === "content" && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-3">
                <div>
                  <label className={labelCls}>Maandishi ya Host (juu)</label>
                  <textarea rows={3} value={card.card_host_text} onChange={e => setCard(s => ({ ...s, card_host_text: e.target.value }))} className={inputCls} placeholder="Familia ya Christopher Mapunda wa Dar Es Salaam wanayofuraha kukualika" />
                </div>
                <div>
                  <label className={labelCls}>Maandishi chini ya Jina la Mgeni</label>
                  <input type="text" value={card.card_subtitle} onChange={e => setCard(s => ({ ...s, card_subtitle: e.target.value }))} className={inputCls} placeholder="kwenye send-off ya binti yao" />
                </div>
                <div>
                  <label className={labelCls}>Jina Kuu la Tukio</label>
                  <input type="text" value={card.card_title} onChange={e => setCard(s => ({ ...s, card_title: e.target.value }))} className={inputCls} placeholder="CHRISTINA MAPUNDA" />
                </div>
                <div>
                  <label className={labelCls}>Maneno kabla ya Tarehe</label>
                  <input type="text" value={card.card_event_label} onChange={e => setCard(s => ({ ...s, card_event_label: e.target.value }))} className={inputCls} placeholder="Itakayofanyika" />
                </div>
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-500">Vipengele vya Kuonyesha:</p>
                  {[["show_date","📅 Tarehe"],["show_venue","📍 Ukumbi & Saa"],["show_dress_code","👗 Dress Code & Rangi"],["show_contacts","📞 Mawasiliano"]].map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={card[key as keyof typeof card] as boolean} onChange={e => setCard(s => ({ ...s, [key]: e.target.checked }))} className="w-4 h-4 rounded accent-yellow-500" />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "design" && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Rangi ya "Single"</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={card.single_color} onChange={e => setCard(s => ({ ...s, single_color: e.target.value }))} className="w-10 h-9 rounded-lg border cursor-pointer" />
                      <span className="text-xs text-gray-500 font-mono">{card.single_color}</span>
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Rangi ya "Double"</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={card.double_color} onChange={e => setCard(s => ({ ...s, double_color: e.target.value }))} className="w-10 h-9 rounded-lg border cursor-pointer" />
                      <span className="text-xs text-gray-500 font-mono">{card.double_color}</span>
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Rangi ya Jina la Mgeni</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={card.name_color} onChange={e => setCard(s => ({ ...s, name_color: e.target.value }))} className="w-10 h-9 rounded-lg border cursor-pointer" />
                      <span className="text-xs text-gray-500 font-mono">{card.name_color}</span>
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Rangi ya Maandishi</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={card.card_text_color} onChange={e => setCard(s => ({ ...s, card_text_color: e.target.value }))} className="w-10 h-9 rounded-lg border cursor-pointer" />
                      <span className="text-xs text-gray-500 font-mono">{card.card_text_color}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Ukubwa wa Jina ({card.name_font_size}px)</label>
                  <input type="range" min="16" max="48" value={card.name_font_size} onChange={e => setCard(s => ({ ...s, name_font_size: Number(e.target.value) }))} className="w-full accent-yellow-500" />
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <label className={labelCls + " mb-0"}>Vibox vya Rangi (Dress Code)</label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input type="checkbox" checked={card.card_show_colors} onChange={e => setCard(s => ({ ...s, card_show_colors: e.target.checked }))} className="accent-yellow-500" />
                      <span className="text-xs text-gray-500">Onyesha</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[["card_color1","Rangi 1"],["card_color2","Rangi 2"],["card_color3","Rangi 3"]].map(([key, label]) => (
                      <div key={key} className="text-center">
                        <input type="color" value={card[key as keyof typeof card] as string} onChange={e => setCard(s => ({ ...s, [key]: e.target.value }))} className="w-full h-12 rounded-xl border-2 border-gray-200 cursor-pointer" />
                        <p className="text-xs text-gray-400 mt-1">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "position" && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
                <div>
                  <label className={labelCls}>Ukubwa wa QR ({card.qr_size}%)</label>
                  <input type="range" min="8" max="35" value={card.qr_size} onChange={e => setCard(s => ({ ...s, qr_size: Number(e.target.value) }))} className="w-full accent-yellow-500" />
                  <div className="flex justify-between text-xs text-gray-400"><span>Ndogo</span><span>Kubwa</span></div>
                </div>
                <div>
                  <label className={labelCls}>Msimamo wa Pembeni (X: {Math.round(card.qr_position_x * 100)}%)</label>
                  <input type="range" min="5" max="95" value={Math.round(card.qr_position_x * 100)} onChange={e => setCard(s => ({ ...s, qr_position_x: Number(e.target.value) / 100 }))} className="w-full accent-yellow-500" />
                  <div className="flex justify-between text-xs text-gray-400"><span>← Kushoto</span><span>Kulia →</span></div>
                </div>
                <div>
                  <label className={labelCls}>Msimamo wa Juu/Chini (Y: {Math.round(card.qr_position_y * 100)}%)</label>
                  <input type="range" min="5" max="95" value={Math.round(card.qr_position_y * 100)} onChange={e => setCard(s => ({ ...s, qr_position_y: Number(e.target.value) / 100 }))} className="w-full accent-yellow-500" />
                  <div className="flex justify-between text-xs text-gray-400"><span>↑ Juu</span><span>Chini ↓</span></div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                  <p className="text-xs text-yellow-800">💡 Unaweza pia kuburuta QR code moja kwa moja kwenye canvas — inafanya kazi kwenye simu pia!</p>
                </div>
              </div>
            )}

            <Link href={"/events/" + eventId + "/templates"} className="block w-full text-center py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
              🖼️ Badilisha Template ya Picha
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}`;
fs.writeFileSync("app/events/[id]/editor/page.tsx", content, "utf8");
console.log("Card Designer imeandikwa!");
