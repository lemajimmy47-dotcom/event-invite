const fs = require("fs");
const content = `"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

export default function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const [eventId, setEventId] = useState("")
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("kadi")

  useEffect(() => {
    async function load() {
      const { id } = await params
      setEventId(id)
      const supabase = createClient()
      const { data: ev } = await supabase.from("events").select("*").eq("id", id).single()
      setEvent(ev)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="flex items-center justify-center min-h-screen"><p className="text-gray-500">Inapakia...</p></div>

  const guestName = "Guest Name"
  const date = event ? new Date(event.date).toLocaleDateString("sw-TZ", { day: "2-digit", month: "2-digit", year: "numeric" }) : ""
  const time = event?.event_time || ""
  const period = event?.time_period || ""
  const venue = event?.venue || ""
  const name = event?.name || ""
  const dressCode = event?.dress_code || ""
  const host = event?.host_name || ""
  const rsvp1 = event?.rsvp_contact1 || ""
  const rsvp2 = event?.rsvp_contact2 || ""
  const category = event?.event_type?.toUpperCase() || ""

  const tabs = [
    { id: "kadi", label: "Kadi Preview", emoji: "🎫" },
    { id: "ukumbusho", label: "Ukumbusho Preview", emoji: "🔔" },
    { id: "shukrani", label: "Shukrani Preview", emoji: "🙏" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Msaada / Support:</span>
          <a href="https://wa.me/255653578184" target="_blank" className="flex items-center gap-1 text-green-600 font-medium">💬 WhatsApp</a>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">Preview</span>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">👁️ Message Preview</h1>
          <p className="text-sm text-gray-500 mt-1">Live Mockup & Configuration</p>
          <div className="mt-3 flex items-center gap-4 text-sm">
            <span className="text-gray-500">Event: <strong className="text-gray-900">{name}</strong></span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">Category: <strong style={{ color: "#B8960C" }}>{category}</strong></span>
          </div>
        </div>

        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={"px-4 py-3 text-sm font-medium border-b-2 transition -mb-px " + (activeTab === tab.id ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700")}
            >
              {tab.emoji} {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "kadi" && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-gray-900">🎫 Kadi Preview</h2>
                <p className="text-xs text-gray-400 mt-0.5">Template: kadi {event?.event_type}</p>
              </div>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 font-mono text-sm leading-relaxed">
                <p className="text-gray-800 whitespace-pre-wrap">{name} wanakualika <strong>{guestName}</strong></p>
                <br/>
                <p className="text-gray-700">Tarehe: <strong>{date}</strong></p>
                <p className="text-gray-700">Ukumbi: <strong>{venue || "—"}</strong></p>
                <p className="text-gray-700">Saa: <strong>{time} {period}</strong></p>
                <p className="text-gray-700">Kadi no: <strong>01 (DOUBLE)</strong></p>
                {dressCode && <p className="text-gray-700">Dress Code: <strong>{dressCode}</strong></p>}
                {(rsvp1 || rsvp2) && (
                  <p className="text-gray-700">Mawasiliano: <strong>{[rsvp1, rsvp2].filter(Boolean).join(" / ")}</strong></p>
                )}
                <br/>
                <p className="text-gray-700">Link ya kadi: <span className="text-blue-500 underline">https://inviteyetu.app/rsvp/...</span></p>
                <br/>
                <p className="text-gray-600 italic">Karibu sana, tafadhali fika na kadi hii.</p>
              </div>

              <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-xs text-blue-700">
                  <strong>💡 Jinsi inavyotumwa:</strong> Kila mgeni atapokea ujumbe huu WhatsApp yenye jina lake na link yake ya kipekee ya kadi.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "ukumbusho" && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">🔔 Ukumbusho Preview</h2>
              <p className="text-xs text-gray-400 mt-0.5">Template: kadi ukumbusho</p>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 font-mono text-sm leading-relaxed">
                <p className="text-gray-800">Habari <strong>{guestName}</strong>,</p>
                <br/>
                <p className="text-gray-700">Unakumbushwa kuhudhuria tukio la</p>
                <p className="text-gray-900 font-bold">{name}</p>
                <br/>
                <p className="text-gray-700">Tarehe: <strong>{date}</strong></p>
                <p className="text-gray-700">Saa: <strong>{time} {period}</strong></p>
                <p className="text-gray-700">Ukumbi: <strong>{venue || "—"}</strong></p>
                <br/>
                <p className="text-gray-600 italic">Uwepo wako ni Muhimu Kwetu, Tafadhali fika bila kukosa.</p>
              </div>

              <div className="mt-4 bg-orange-50 border border-orange-100 rounded-xl p-4">
                <p className="text-xs text-orange-700">
                  <strong>💡 Lini kutuma:</strong> Tuma ukumbusho siku 1-2 kabla ya tukio kuhakikisha wageni hawasahau.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "shukrani" && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">🙏 Shukrani Preview</h2>
              <p className="text-xs text-gray-400 mt-0.5">Template: kadi shukrani</p>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 font-mono text-sm leading-relaxed">
                <p className="text-gray-800">Habari <strong>{guestName}</strong></p>
                <br/>
                <p className="text-gray-700">Tunapenda kutoa shukrani za dhati kwa ushirikiano wako katika kufanikisha</p>
                <p className="text-gray-900 font-bold">{name}</p>
                <br/>
                <p className="text-gray-700">kwa uliyehudhuria au kuchangia kwa njia yoyote.</p>
                <br/>
                <p className="text-gray-700">Mungu akubariki na akuongezee zaidi.</p>
                <br/>
                <p className="text-gray-700">Kutoka kwa <strong>{host || name}</strong></p>
                <p className="text-gray-700">na kamati ya Maandalizi.</p>
              </div>

              <div className="mt-4 bg-green-50 border border-green-100 rounded-xl p-4">
                <p className="text-xs text-green-700">
                  <strong>💡 Lini kutuma:</strong> Tuma shukrani siku 1-2 baada ya tukio kukamilika.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <Link href={"/events/" + eventId + "/send"} className="flex-1 text-center py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition" style={{ background: "linear-gradient(135deg, #1e3a5f, #2d5a8e)", color: "white" }}>
            📨 Tuma Kadi
          </Link>
          <Link href={"/events/" + eventId + "/guests"} className="flex-1 text-center py-3 rounded-xl font-semibold text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition">
            👥 Simamia Wageni
          </Link>
        </div>
      </div>
    </div>
  )
}`;
fs.writeFileSync("app/events/[id]/preview/page.tsx", content, "utf8");
console.log("Preview page imeandikwa!");
