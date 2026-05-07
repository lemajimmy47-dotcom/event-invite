'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const EVENT_TYPES = ['wedding', 'birthday', 'corporate', 'graduation', 'other']

export default function NewEventPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    event_type: 'wedding',
    date: '',
    venue: '',
    description: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    const { data, error } = await supabase
      .from('events')
      .insert([form])
      .select()
      .single()

    if (error) {
      alert('Hitilafu: ' + error.message)
      setLoading(false)
      return
    }

    router.push(`/events/${data.id}`)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-8">
        <div className="mb-6">
          <a href="/" className="text-blue-600 hover:underline text-sm">← Rudi nyumbani</a>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Unda Tukio Jipya</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jina la Tukio *</label>
            <input
              type="text"
              required
              placeholder="Mfano: Harusi ya John na Mary"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aina ya Tukio *</label>
            <select
              value={form.event_type}
              onChange={e => setForm({ ...form, event_type: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {EVENT_TYPES.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tarehe na Wakati *</label>
            <input
              type="datetime-local"
              required
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mahali (Venue)</label>
            <input
              type="text"
              placeholder="Mfano: Mlimani City Hall, Dar es Salaam"
              value={form.venue}
              onChange={e => setForm({ ...form, venue: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Maelezo</label>
            <textarea
              rows={3}
              placeholder="Maelezo ya ziada kuhusu tukio..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? 'Inahifadhi...' : 'Unda Tukio'}
          </button>
        </form>
      </div>
    </main>
  )
}