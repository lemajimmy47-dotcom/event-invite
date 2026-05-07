"use client"

import { useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function CheckinPage() {
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<any>(null)
  const doneRef = useRef(false)

  async function handleToken(token: string) {
    if (doneRef.current) return
    doneRef.current = true
    setLoading(true)
    stopScanner()

    const clean = token.includes("/rsvp/") ? token.split("/rsvp/")[1] : token
    const supabase = createClient()

    const { data: guest } = await supabase
      .from("guests")
      .select("*, events(*), checkins(*)")
      .eq("qr_token", clean)
      .single()

    if (!guest) {
      setResult({ type: "notfound", message: "Mgeni huyu hayupo kwenye orodha!" })
      setLoading(false)
      return
    }

    if (guest.checkins?.length > 0) {
      setResult({ type: "already", message: "Tayari amecheckin!", name: guest.name, event: guest.events?.name })
      setLoading(false)
      return
    }

    await supabase.from("checkins").insert([{ guest_id: guest.id }])
    setResult({ type: "success", message: "Check-in imefanikiwa!", name: guest.name, event: guest.events?.name })
    setLoading(false)
  }

  async function startScanner() {
    setResult(null)
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

      if (code?.data) {
        clearInterval(timerRef.current)
        await handleToken(code.data)
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

  useEffect(() => { return () => stopScanner() }, [])

  const colors: any = {
    success: "bg-green-50 border-green-400",
    already: "bg-yellow-50 border-yellow-400",
    notfound: "bg-red-50 border-red-400",
    error: "bg-red-50 border-red-400",
  }
  const emojis: any = { success: "?", already: "??", notfound: "?", error: "??" }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Check-in Scanner</h1>
            <p className="text-gray-500 text-sm">Scan QR code ya mgeni</p>
          </div>
          <a href="/" className="text-blue-600 text-sm">? Nyumbani</a>
        </div>

        {result && (
          <div className={"rounded-2xl border-2 p-6 mb-6 text-center " + colors[result.type]}>
            <p className="text-5xl mb-3">{emojis[result.type]}</p>
            {result.name && <p className="text-xl font-bold text-gray-900 mb-1">{result.name}</p>}
            {result.event && <p className="text-sm text-gray-500 mb-2">{result.event}</p>}
            <p className="font-semibold text-gray-700">{result.message}</p>
            <button
              onClick={startScanner}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              Scan Nyingine
            </button>
          </div>
        )}

        {scanning && (
          <div className="bg-black rounded-2xl overflow-hidden mb-4">
            <video ref={videoRef} className="w-full" playsInline muted />
            <canvas ref={canvasRef} className="hidden" />
            <div className="p-4 text-center">
              <p className="text-white text-sm mb-3">Lenga QR code ya mgeni</p>
              <button
                onClick={stopScanner}
                className="bg-red-500 text-white px-6 py-2 rounded-lg text-sm font-medium"
              >
                Simamisha
              </button>
            </div>
          </div>
        )}

        {!scanning && !result && (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <p className="text-6xl mb-4">??</p>
            <p className="text-gray-600 mb-6">Bonyeza kuanza kuscan QR codes za wageni</p>
            <button
              onClick={startScanner}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold text-lg hover:bg-blue-700 transition"
            >
              Anza Scanner
            </button>
          </div>
        )}

        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 text-center">
              <p className="text-gray-700 font-medium">Inathibitisha...</p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
