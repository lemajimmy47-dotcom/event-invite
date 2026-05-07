"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function AddGuestsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [mode, setMode] = useState<"manual" | "bulk">("manual")
  const [loading, setLoading] = useState(false)
  const [manual, setManual] = useState({ name: "", phone: "", email: "" })
  const [bulkText, setBulkText] = useState("")

  async function getEventId() {
    const { id } = await params
    return id
  }

  async function handleManual(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const event_id = await getEventId()
    const supabase = createClient()
    const { error } = await supabase.from("guests").insert([{ ...manual, event_id }])
    if (error) {
      alert("Hitilafu: " + error.message)
    } else {
      router.push("/events/" + event_id)
    }
    setLoading(false)
  }

  async function handleBulk(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const event_id = await getEventId()
    const supabase = createClient()
    const lines = bulkText.trim().split("\n").filter(l => l.trim())
    const guests = lines.map(line => {
      const parts = line.split(",").map(p => p.trim())
      return { event_id, name: parts[0] || "", phone: parts[1] || null, email: parts[2] || null }
    }).filter(g => g.name)
    if (guests.length === 0) {
      alert("Hakuna wageni walioandikwa vizuri")
      setLoading(false)
      return
    }
    const { error } = await supabase.from("guests").insert(guests)
    if (error) {
      alert("Hitilafu: " + error.message)
    } else {
      router.push("/events/" + event_id)
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-8">
        <div className="mb-6">
          <p className="text-blue-600 text-sm cursor-pointer hover:underline" onClick={() => router.back()}>
            Rudi
          </p>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Ongeza Wageni</h1>
        </div>
        <div className="flex bg-white border border-gray-200 rounded-lg p-1 mb-6">
          <button
            onClick={() => setMode("manual")}
            className={"flex-1 py-2 rounded-md text-sm font-medium transition " + (mode === "manual" ? "bg-blue-600 text-white" : "text-gray-500")}
          >
            Mmoja Mmoja
          </button>
          <button
            onClick={() => setMode("bulk")}
            className={"flex-1 py-2 rounded-md text-sm font-medium transition " + (mode === "bulk" ? "bg-blue-600 text-white" : "text-gray-500")}
          >
            Bulk Paste
          </button>
        </div>
        {mode === "manual" ? (
          <form onSubmit={handleManual} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jina Kamili *</label>
              <input
                type="text"
                required
                placeholder="Mfano: Amina Hassan"
                value={manual.name}
                onChange={e => setManual({ ...manual, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Namba ya Simu</label>
              <input
                type="tel"
                placeholder="Mfano: 0712345678"
                value={manual.phone}
                onChange={e => setManual({ ...manual, phone: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Barua Pepe</label>
              <input
                type="email"
                placeholder="Mfano: amina@gmail.com"
                value={manual.email}
                onChange={e => setManual({ ...manual, email: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? "Inahifadhi..." : "Ongeza Mgeni"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleBulk} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Andika Wageni</label>
              <p className="text-xs text-gray-400 mb-2">Format: Jina, Namba, Email (mstari mmoja = mgeni mmoja)</p>
              <textarea
                rows={10}
                required
                placeholder={"Amina Hassan, 0712345678\nJohn Doe, 0787654321\nFatuma Ali"}
                value={bulkText}
                onChange={e => setBulkText(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
              Wageni: <strong>{bulkText.trim().split("\n").filter(l => l.trim()).length}</strong>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? "Inahifadhi..." : "Ongeza Wageni Wote"}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}