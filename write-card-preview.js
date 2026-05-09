const fs = require("fs");
const content = `"use client"

import { getTemplate } from "@/lib/templates"

type Props = {
  templateId: string
  eventName: string
  eventDate: string
  eventVenue: string
  guestName?: string
  guestCode?: string
  cardImageUrl?: string
}

export default function CardPreview({ templateId, eventName, eventDate, eventVenue, guestName, guestCode, cardImageUrl }: Props) {
  const template = getTemplate(templateId)

  return (
    <div className="rounded-2xl overflow-hidden shadow-xl" style={{ background: template.bgGradient, minHeight: "300px" }}>
      <div className="relative" style={{ minHeight: "300px" }}>
        {cardImageUrl && (
          <img src={cardImageUrl} className="absolute inset-0 w-full h-full object-cover" alt="bg" />
        )}
        <div className="absolute inset-0" style={{ background: cardImageUrl ? "rgba(0,0,0,0.45)" : "transparent" }} />
        <div className="relative z-10 flex h-full">
          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
            <div className="text-4xl mb-3">{template.emoji}</div>
            <div className="text-xs font-medium tracking-widest mb-2 uppercase" style={{ color: cardImageUrl ? "rgba(255,255,255,0.8)" : template.textColor }}>
              You Are Invited
            </div>
            <div className="text-2xl font-bold mb-3" style={{ color: cardImageUrl ? "white" : template.primaryColor }}>
              {eventName || "Jina la Tukio"}
            </div>
            <div className="w-12 h-0.5 mb-3" style={{ background: template.accentColor }} />
            <div className="text-sm mb-1" style={{ color: cardImageUrl ? "rgba(255,255,255,0.9)" : template.textColor }}>
              📅 {eventDate || "Tarehe ya Tukio"}
            </div>
            {eventVenue && (
              <div className="text-xs mb-4" style={{ color: cardImageUrl ? "rgba(255,255,255,0.75)" : template.textColor }}>
                📍 {eventVenue}
              </div>
            )}
            {guestName && (
              <div className="mt-3">
                <div className="text-xs mb-1" style={{ color: cardImageUrl ? "rgba(255,255,255,0.7)" : template.textColor }}>Karibu sana,</div>
                <div className="text-lg font-bold" style={{ color: cardImageUrl ? "white" : template.primaryColor }}>{guestName}</div>
                {guestCode && (
                  <div className="text-xs font-mono mt-1 px-3 py-1 rounded-full inline-block" style={{ background: "rgba(255,255,255,0.2)", color: cardImageUrl ? "white" : template.textColor }}>
                    {guestCode}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="w-32 flex flex-col items-center justify-center p-4" style={{ background: "rgba(255,255,255,0.92)" }}>
            <div className="text-xs text-gray-400 mb-2 text-center tracking-wider">SCAN RSVP</div>
            <div className="w-20 h-20 rounded-lg flex items-center justify-center" style={{ background: template.secondaryColor }}>
              <span className="text-2xl">{template.emoji}</span>
            </div>
            <div className="text-xs text-gray-400 mt-2 text-center">QR Code</div>
          </div>
        </div>
      </div>
    </div>
  )
}`;
fs.writeFileSync("components/CardPreview.tsx", content, "utf8");
console.log("CardPreview imeandikwa!");
