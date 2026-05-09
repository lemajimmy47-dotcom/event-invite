"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function EditGuestPage({ params }: { params: Promise<{ id: string; guestId: string }> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [form, setForm] = useState({ name: "", phone: "", email: "" })
  const [eventId, setEventId] = useState("")
  const [guestId, setGuestId] = useState("")

  useEffect(() => {
    async function load() {
      const { id, guestId } = await params
      setEventId(id)
      setGuestId(guestId)
      const supabase = createClient()
      const { data } = await supabase.from("guests").select("*").eq("id", guestId).single()
      if (data) {
        setForm({ name: data.name, phone: data.phone ?? "", email: data.email ?? "" })
      }
      setFetching(false)
    }
    load()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase
      .from("guests")
      .update({ name: form.name, phone: form.phone || null, email: form.email || null })
      .eq("id", guestId)
    if (error) {
      alert("Hitilafu: " + error.message)
    } else {
      router.push("/events/" + eventId)
    }
    setLoading(false)
  }

  async function handleDelete() {
    if (!confirm("Una uhakika unataka kumfuta mgeni huyu?")) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from("guests").delete().eq("id", guestId)
    router.push("/events/" + eventId)
  }

  if (fetching) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Inapakia...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-8">
        <div className="mb-6">
          <p className="text-blue-600 text-sm cursor-pointer hover:underline" onClick={() => router.back()}>
            Rudi
          </p>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Hariri Mgeni</h1>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jina Kamili *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Namba ya Simu</label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              placeholder="0712345678"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Barua Pepe</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="amina@gmail.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? "Inahifadhi..." : "Hifadhi Mabadiliko"}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-100 text-red-600 px-6 py-3 rounded-lg font-medium hover:bg-red-200 disabled:opacity-50 transition"
            >
              Futa
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}