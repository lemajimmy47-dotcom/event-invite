const fs = require("fs");
const content = `"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Event = {
  id: string
  name: string
  date: string
  event_type: string
}

export default function EventSelector({ events, currentEvent }: { events: Event[], currentEvent: Event | null }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  if (!currentEvent) return null

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 bg-white shadow-sm hover:border-yellow-400 transition"
      >
        <span>📅</span>
        <div className="text-left">
          <p className="font-medium text-gray-900 text-xs">{currentEvent.name}</p>
          <p className="text-gray-400 text-xs">{new Date(currentEvent.date).toLocaleDateString("sw-TZ", { day: "2-digit", month: "2-digit", year: "numeric" })}</p>
        </div>
        <span className={"text-gray-400 transition-transform " + (open ? "rotate-180" : "")}>▾</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-12 z-20 bg-white rounded-2xl border border-gray-200 shadow-xl w-72 overflow-hidden">
            <div className="p-3 border-b border-gray-100">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Matukio Yako</p>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {events.map((event) => (
                <button
                  key={event.id}
                  onClick={() => {
                    setOpen(false)
                    router.push("/events/" + event.id)
                  }}
                  className={"w-full flex items-center gap-3 p-3 hover:bg-yellow-50 transition text-left " + (event.id === currentEvent.id ? "bg-yellow-50" : "")}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0" style={{ background: "#FFF8DC" }}>
                    {event.event_type === "wedding" ? "💍" : event.event_type === "sendoff" ? "✈️" : event.event_type === "birthday" ? "🎂" : event.event_type === "graduation" ? "🎓" : event.event_type === "contribution" ? "💰" : event.event_type === "meeting" ? "💼" : "🎉"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{event.name}</p>
                    <p className="text-xs text-gray-400">{new Date(event.date).toLocaleDateString("sw-TZ", { day: "2-digit", month: "2-digit", year: "numeric" })}</p>
                  </div>
                  {event.id === currentEvent.id && <span style={{ color: "#B8960C" }}>✓</span>}
                </button>
              ))}
            </div>
            <div className="p-3 border-t border-gray-100">
              <button
                onClick={() => { setOpen(false); router.push("/events/new") }}
                className="w-full text-center text-sm font-medium py-2 rounded-xl transition hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #B8960C, #FFD700)", color: "#1a1200" }}
              >
                + Unda Tukio Jipya
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}`;
fs.writeFileSync("components/EventSelector.tsx", content, "utf8");
console.log("EventSelector imeandikwa!");
