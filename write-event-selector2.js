const fs = require("fs");
const content = `"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Event = {
  id: string
  name: string
  date: string
  event_type: string
  venue?: string
}

export default function EventSelector({ events, currentEvent }: { events: Event[], currentEvent: Event | null }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const router = useRouter()

  const filtered = events.filter(e => 
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.event_type.toLowerCase().includes(search.toLowerCase())
  )

  if (!currentEvent && events.length === 0) return null

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 bg-white shadow-sm hover:border-gray-300 transition"
      >
        <span className="text-gray-400">📅</span>
        <div className="text-left">
          <p className="font-medium text-gray-900 text-xs">{currentEvent?.name || "Chagua Tukio"}</p>
          <p className="text-gray-400 text-xs">
            {currentEvent ? new Date(currentEvent.date).toLocaleDateString("sw-TZ", { day: "2-digit", month: "2-digit", year: "numeric" }) : ""}
          </p>
        </div>
        <span className={"text-gray-400 transition-transform duration-200 " + (open ? "rotate-180" : "")}>▾</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => { setOpen(false); setSearch("") }} />
          <div className="absolute right-0 top-12 z-20 bg-white rounded-2xl border border-gray-200 shadow-xl w-80 overflow-hidden">
            <div className="p-3 border-b border-gray-100">
              <button
                onClick={() => { setOpen(false); router.push("/events/new") }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                <span className="text-gray-400">+</span> Create New Event
              </button>
            </div>
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                <span className="text-gray-400 text-sm">🔍</span>
                <input
                  type="text"
                  placeholder="Search events..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="flex-1 bg-transparent text-sm focus:outline-none text-gray-700 placeholder-gray-400"
                  autoFocus
                />
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="text-center py-6 text-gray-400 text-sm">Hakuna matukio</div>
              ) : (
                filtered.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => {
                      setOpen(false)
                      setSearch("")
                      router.push("/events/" + event.id)
                    }}
                    className={"w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition text-left " + (currentEvent?.id === event.id ? "bg-blue-50" : "")}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 mt-0.5" style={{ background: "#EFF6FF" }}>
                      {event.event_type === "wedding" ? "💍" : event.event_type === "sendoff" ? "✈️" : event.event_type === "birthday" ? "🎂" : event.event_type === "graduation" ? "🎓" : event.event_type === "contribution" ? "💰" : event.event_type === "meeting" ? "💼" : "🎉"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={"font-medium text-sm truncate " + (currentEvent?.id === event.id ? "text-blue-700" : "text-gray-900")}>{event.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(event.date).toLocaleDateString("sw-TZ", { day: "2-digit", month: "2-digit", year: "numeric" })}
                        {event.venue ? " • " + event.venue : ""}
                      </p>
                    </div>
                    {currentEvent?.id === event.id && <span className="text-blue-500 text-xs mt-1">✓</span>}
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}`;
fs.writeFileSync("components/EventSelector.tsx", content, "utf8");
console.log("EventSelector imeandikwa!");
