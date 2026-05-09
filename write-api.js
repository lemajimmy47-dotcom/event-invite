const fs = require("fs");
const content = `import { createClient } from "@/lib/supabase/server"
import QRCode from "qrcode"

export async function GET(request, { params }) {
  const { token } = await params
  const supabase = await createClient()
  const { data: guest } = await supabase.from("guests").select("*, events(*)").eq("qr_token", token).single()
  if (!guest) return new Response("Guest not found", { status: 404 })
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const rsvpUrl = APP_URL + "/rsvp/" + guest.qr_token
  const qrDataUrl = await QRCode.toDataURL(rsvpUrl, { errorCorrectionLevel: "H", width: 200, margin: 2 })
  const eventName = guest.events?.name || "Tukio"
  const eventDate = guest.events?.date ? new Date(guest.events.date).toLocaleDateString("sw-TZ", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : ""
  const eventVenue = guest.events?.venue || ""
  const cardImageUrl = guest.events?.card_image_url || ""
  const guestName = guest.name || ""
  const guestCode = guest.guest_code || ""
  const bgHtml = cardImageUrl ? "<img class=\\"bg\\" src=\\"" + cardImageUrl + "\\" />" : "<div class=\\"bg\\" style=\\"background:linear-gradient(135deg,#fce4ec,#f8bbd0);\\"></div>"
  const venueHtml = eventVenue ? "<div class=\\"venue\\">📍 " + eventVenue + "</div>" : ""
  const codeHtml = guestCode ? "<div class=\\"code\\">" + guestCode + "</div>" : ""
  const codeBoxHtml = guestCode ? "<div class=\\"guest-code-box\\">" + guestCode + "</div>" : ""
  const html = "<!DOCTYPE html><html><head><meta charset=\\"utf-8\\"><title>Invitation - " + guestName + "</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Georgia,serif;background:#f8f0f5;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;padding:20px;}.card{width:800px;max-width:100%;border-radius:16px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.2);display:flex;position:relative;min-height:500px;}.bg{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;}.overlay{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.4);}.left{position:relative;z-index:2;flex:1;padding:50px 40px;color:white;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;}.invited{font-size:12px;letter-spacing:4px;opacity:0.8;margin-bottom:10px;}.event-name{font-size:36px;font-weight:bold;line-height:1.2;margin-bottom:16px;}.divider{width:60px;height:2px;background:#f9a8d4;margin:0 auto 16px;}.date{font-size:15px;opacity:0.9;margin-bottom:8px;}.venue{font-size:13px;opacity:0.75;margin-bottom:24px;}.welcome{font-size:13px;opacity:0.7;margin-bottom:6px;}.guest-name{font-size:22px;font-weight:bold;}.code{margin-top:10px;font-size:11px;font-family:monospace;background:rgba(255,255,255,0.2);padding:4px 14px;border-radius:20px;}.right{position:relative;z-index:2;width:220px;background:rgba(255,255,255,0.95);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:30px 20px;}.scan-label{font-size:10px;color:#9ca3af;letter-spacing:2px;margin-bottom:14px;}.qr-img{width:150px;height:150px;}.qr-hint{margin-top:14px;font-size:10px;color:#6b7280;text-align:center;line-height:1.5;}.guest-code-box{margin-top:14px;font-size:10px;font-family:monospace;color:#374151;background:#f3f4f6;padding:6px 12px;border-radius:8px;}.download-btn{margin-top:30px;background:#ec4899;color:white;border:none;padding:12px 32px;border-radius:8px;font-size:14px;cursor:pointer;text-decoration:none;display:inline-block;}</style></head><body><div class=\\"card\\">" + bgHtml + "<div class=\\"overlay\\"></div><div class=\\"left\\"><div class=\\"invited\\">YOU ARE INVITED</div><div class=\\"event-name\\">" + eventName + "</div><div class=\\"divider\\"></div><div class=\\"date\\">📅 " + eventDate + "</div>" + venueHtml + "<div class=\\"welcome\\">Karibu sana,</div><div class=\\"guest-name\\">" + guestName + "</div>" + codeHtml + "</div><div class=\\"right\\"><div class=\\"scan-label\\">SCAN KWA RSVP</div><img class=\\"qr-img\\" src=\\"" + qrDataUrl + "\\" alt=\\"QR\\" /><div class=\\"qr-hint\\">Scan QR code hii kuthibitisha ufike wako</div>" + codeBoxHtml + "</div></div><a class=\\"download-btn\\" href=\\"javascript:window.print()\\">🖨️ Print / Download</a></body></html>"
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } })
}`;
fs.writeFileSync("app/api/invitation/[token]/route.ts", content, "utf8");
console.log("Imefanikiwa!");
