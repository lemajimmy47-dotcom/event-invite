"use client"

import { useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function CheckinPage() {
  const [mode, setMode] = useState<"scan" | "code">("scan")
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [guestCode, setGuestCode] = useState("")
  const [preview, setPreview] = useState<any>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<any>(null)
  const doneRef = useRef(false)

  async function searchGuest(identifier: string, type: "token" | "code") {
    setLoading(true)
    const supabase = createClient()
    let query = supabase.from("guests").select("*, events(*), checkins(*)")
    if (type === "token") {
      const clean = identifier.includes("/rsvp/") ? identifier.split("/rsvp/")[1] : identifier
      query = query.eq("qr_token", clean)
    } else {
      query = query.eq("guest_code", identifier.toUpperCase().trim())
    }
    const { data: guest } = await query.single()
    if (!guest) {
      setResult({ type: "notfound", message: type === "code" ? "Code hii haipatikani!" : "Mgeni huyu hayupo kwenye orodha!" })
      setLoading(false)
      return
    }
    setPreview(guest)
    setLoading(false)
  }

  async function confirmCheckin() {
    if (!preview) return
    setLoading(true)

    if (preview.checkins?.length > 0) {
      setResult({ type: "already", message: "Tayari amecheckin!", name: preview.name, code: preview.guest_code, event: preview.events?.name })
      setPreview(null)
      setLoading(false)
      return
    }

    const supabase = createClient()
    await supabase.from("checkins").insert([{ guest_id: preview.id }])
    setResult({ type: "success", message: "Check-in imefanikiwa!", name: preview.name, code: preview.guest_code, event: preview.events?.name })
    setPreview(null)
    setLoading(false)
  }

  async function handleCodeSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!guestCode.trim()) return
    stopScanner()
    await searchGuest(guestCode, "code")
  }

  async function startScanner() {
    setResult(null)
    setPreview(null)
    doneRef.current = false
    setScanning(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } }
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      scanLoop()
    } catch (err: any) {
      setResult({ type: "error", message: "Imeshindwa kufungua camera: " + err.message })
      setScanning(false)
    }
  }

  function scanLoop() {
    timerRef.current = setInterval(async () => {
      const video = videoRef.current
      const canvas = canvasRef.current
      if (!video || !canvas || video.readyState < 2) return
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const jsQR = (await import("jsqr")).default
      const code = jsQR(imageData.data, imageData.width, imageData.height)
      if (code?.data && !doneRef.current) {
        doneRef.current = true
        clearInterval(timerRef.current)
        stopScanner()
        await searchGuest(code.data, "token")
      }
    }, 300)
  }

  function stopScanner() {
    clearInterval(timerRef.current)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    setScanning(false)
  }

  function reset() {
    setResult(null)
    setPreview(null)
    setGuestCode("")
    doneRef.current = false
  }

  useEffect(() => { return () => stopScanner() }, [])

  const colors: any = {
    success: "bg-green-50 border-green-400",
    already: "bg-yellow-50 border-yellow-400",
    notfound: "bg-red-50 border-red-400",
    error: "bg-red-50 border-red-400",
  }
  const emojis: any = { success: "✅", already: "⚠️", notfound: "❌", error: "📵" }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Check-in Scanner</h1>
          <p className="text-gray-500 text-sm">Scan QR code au andika nambari ya mgeni</p>
        </div>

        <div className="flex bg-white border border-gray-200 rounded-lg p-1 mb-6">
          <button
            onClick={() => { setMode("scan"); reset(); stopScanner() }}
            className={"flex-1 py-2 rounded-md text-sm font-medium transition " + (mode === "scan" ? "bg-blue-600 text-white" : "text-gray-500")}
          >
            📷 Scan QR
          </button>
          <button
            onClick={() => { setMode("code"); reset(); stopScanner() }}
            className={"flex-1 py-2 rounded-md text-sm font-medium transition " + (mode === "code" ? "bg-blue-600 text-white" : "text-gray-500")}
          >
            ⌨️ Andika Code
          </button>
        </div>

        {result && (
          <div className={"rounded-2xl border-2 p-6 mb-6 text-center " + colors[result.type]}>
            <p className="text-5xl mb-3">{emojis[result.type]}</p>
            {result.name && <p className="text-xl font-bold text-gray-900 mb-1">{result.name}</p>}
            {result.code && <p className="text-xs font-mono text-gray-500 mb-1">{result.code}</p>}
            {result.event && <p className="text-sm text-gray-500 mb-2">{result.event}</p>}
            <p className="font-semibold text-gray-700">{result.message}</p>
            <button
              onClick={() => { reset(); if (mode === "scan") startScanner() }}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              Endelea
            </button>
          </div>
        )}

        {preview && !result && (
          <div className="bg-white rounded-2xl border-2 border-blue-300 p-6 mb-6">
            <p className="text-center text-gray-500 text-sm mb-4">Thibitisha mgeni huyu:</p>
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-blue-600">
                  {preview.name.charAt(0)}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{preview.name}</p>
              {preview.guest_code && (
                <p className="text-xs font-mono text-gray-400 mt-1 bg-gray-50 rounded-lg py-1 px-3 inline-block border border-gray-200">
                  {preview.guest_code}
                </p>
              )}
              {preview.phone && <p className="text-gray-400 text-sm mt-2">📱 {preview.phone}</p>}
              <p className="text-gray-500 text-sm mt-1">{preview.events?.name}</p>
              {preview.checkins?.length > 0 && (
                <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                  <p className="text-yellow-700 text-sm font-medium">⚠️ Tayari amecheckin</p>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={reset}
                className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
              >
                Kataa
              </button>
              <button
                onClick={confirmCheckin}
                disabled={loading}
                className="flex-1 bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 disabled:opacity-50 transition"
              >
                {loading ? "Inahifadhi..." : "✅ Thibitisha"}
              </button>
            </div>
          </div>
        )}

        {mode === "scan" && !preview && !result && (
          <>
            {scanning && (
              <div className="bg-black rounded-2xl overflow-hidden mb-4">
                <video ref={videoRef} className="w-full" playsInline muted />
                <canvas ref={canvasRef} className="hidden" />
                <div className="p-4 text-center">
                  <p className="text-white text-sm mb-3">Lenga QR code ya mgeni</p>
                  <button onClick={stopScanner} className="bg-red-500 text-white px-6 py-2 rounded-lg text-sm">
                    Simamisha
                  </button>
                </div>
              </div>
            )}
            {!scanning && (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <p className="text-6xl mb-4">📷</p>
                <p className="text-gray-600 mb-6">Bonyeza kuanza kuscan QR codes za wageni</p>
                <button onClick={startScanner} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold text-lg hover:bg-blue-700 transition">
                  Anza Scanner
                </button>
              </div>
            )}
          </>
        )}

        {mode === "code" && !preview && !result && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-6xl text-center mb-4">⌨️</p>
            <p className="text-gray-600 text-center mb-6">Andika nambari ya mgeni</p>
            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <input
                type="text"
                value={guestCode}
                onChange={e => setGuestCode(e.target.value.toUpperCase())}
                placeholder="EVNT-2026-001-0001"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                autoFocus
              />
              <button
                type="submit"
                disabled={loading || !guestCode.trim()}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {loading ? "Inatafuta..." : "Tafuta Mgeni"}
              </button>
            </form>
          </div>
        )}

        {loading && !preview && !result && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 text-center">
              <p className="text-gray-700 font-medium">Inatafuta...</p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}