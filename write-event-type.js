const fs = require("fs");
const content = `"use client"

import { useRouter } from "next/navigation"

const eventTypes = [
  { id: "wedding", label: "HARUSI", desc: "Wedding event", emoji: "💍", color: "#be185d" },
  { id: "sendoff", label: "SEND OFF", desc: "Pre-marriage ceremony", emoji: "✈️", color: "#0369a1" },
  { id: "invitation", label: "MWALIKO", desc: "Invitation event", emoji: "👥", color: "#7c3aed" },
  { id: "meeting", label: "KIKAO", desc: "Meeting event", emoji: "💼", color: "#0f766e" },
  { id: "contribution", label: "MCHANGO", desc: "Contribution event", emoji: "💰", color: "#b45309" },
  { id: "ticket", label: "TIKETI", desc: "Ticket Event", emoji: "🎫", color: "#dc2626" },
  { id: "custom", label: "CUSTOM", desc: "Custom Event", emoji: "🎉", color: "#059669" },
  { id: "bulksend", label: "BULK SEND", desc: "Bulk SMS Sending", emoji: "📨", color: "#4f46e5" },
]

export default function NewEventPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span className="hover:text-yellow-700 cursor-pointer" onClick={() => router.push("/dashboard")}>Dashboard</span>
            <span>›</span>
            <span className="text-gray-900 font-medium">Create Event</span>
          </div>
          <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Unda Tukio Jipya</h1>
          <p className="text-gray-500 text-sm mt-1">Chagua aina ya tukio unalotaka kuunda</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {eventTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => router.push("/events/create?type=" + type.id)}
                className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-yellow-400 hover:shadow-md transition text-left group"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: type.color + "20" }}>
                  {type.emoji}
                </div>
                <div>
                  <p className="font-bold text-gray-900 group-hover:text-yellow-700 transition">{type.label}</p>
                  <p className="text-sm text-gray-500">{type.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}`;
fs.writeFileSync("app/events/new/page.tsx", content, "utf8");
console.log("Event type selector imeandikwa!");
