import { ImageResponse } from "@vercel/og"
import { createClient } from "@/lib/supabase/server"
import QRCode from "qrcode"

export const runtime = "edge"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const supabase = await createClient()

  const { data: guest } = await supabase
    .from("guests")
    .select("*, events(*)")
    .eq("qr_token", token)
    .single()

  if (!guest) {
    return new Response("Guest not found", { status: 404 })
  }

  const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  const rsvpUrl = APP_URL + "/rsvp/" + guest.qr_token
  const qrDataUrl = await QRCode.toDataURL(rsvpUrl, {
    errorCorrectionLevel: "H",
    width: 200,
    margin: 2,
    color: { dark: "#1e293b", light: "#ffffff" }
  })

  const eventName = guest.events?.name ?? "Tukio"
  const eventDate = guest.events?.date
    ? new Date(guest.events.date).toLocaleDateString("sw-TZ", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    : ""
  const eventVenue = guest.events?.venue ?? ""

  const cardImageUrl = guest.events?.card_image_url

  return new ImageResponse(
    (
      <div
        style={{
          width: "800px",
          height: "600px",
          display: "flex",
          position: "relative",
          backgroundColor: "#fff0f5",
          fontFamily: "serif",
        }}
      >
        {cardImageUrl ? (
          <img
            src={cardImageUrl}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
              background: "linear-gradient(135deg, #fff0f5 0%, #fce4ec 50%, #f8bbd0 100%)",
              display: "flex"
            }}
          />
        )}

        <div
          style={{
            position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
            backgroundColor: "rgba(0,0,0,0.35)",
            display: "flex"
          }}
        />

        <div
          style={{
            position: "absolute", top: 0, left: 0, width: "560px", height: "100%",
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", padding: "40px", color: "white"
          }}
        >
          <div style={{ fontSize: "14px", letterSpacing: "4px", marginBottom: "8px", opacity: 0.9 }}>
            YOU ARE INVITED
          </div>
          <div style={{ fontSize: "42px", fontWeight: "bold", textAlign: "center", lineHeight: 1.2 }}>
            {eventName}
          </div>
          <div style={{ width: "60px", height: "2px", backgroundColor: "#f9a8d4", margin: "16px 0" }} />
          <div style={{ fontSize: "16px", textAlign: "center", opacity: 0.9 }}>{eventDate}</div>
          {eventVenue && (
            <div style={{ fontSize: "14px", textAlign: "center", opacity: 0.8, marginTop: "8px" }}>
              📍 {eventVenue}
            </div>
          )}
          <div style={{ marginTop: "24px", fontSize: "13px", opacity: 0.7 }}>Karibu sana,</div>
          <div style={{ fontSize: "22px", fontWeight: "bold", textAlign: "center", marginTop: "4px" }}>
            {guest.name}
          </div>
          {guest.guest_code && (
            <div style={{
              marginTop: "8px", fontSize: "12px", fontFamily: "monospace",
              backgroundColor: "rgba(255,255,255,0.2)", padding: "4px 12px",
              borderRadius: "20px", letterSpacing: "1px"
            }}>
              {guest.guest_code}
            </div>
          )}
        </div>

        <div
          style={{
            position: "absolute", right: "0", top: "0", width: "240px", height: "100%",
            backgroundColor: "rgba(255,255,255,0.95)",
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", padding: "24px"
          }}
        >
          <div style={{ fontSize: "11px", color: "#9ca3af", marginBottom: "12px", letterSpacing: "1px" }}>
            SCAN KWA RSVP
          </div>
          <img src={qrDataUrl} style={{ width: "160px", height: "160px" }} />
          <div style={{ marginTop: "16px", fontSize: "11px", color: "#6b7280", textAlign: "center" }}>
            Scan QR code hii kuthibitisha ufike wako
          </div>
          {guest.guest_code && (
            <div style={{
              marginTop: "12px", fontSize: "11px", fontFamily: "monospace",
              color: "#374151", backgroundColor: "#f3f4f6",
              padding: "6px 12px", borderRadius: "8px"
            }}>
              {guest.guest_code}
            </div>
          )}
        </div>
      </div>
    ),
    { width: 800, height: 600 }
  )
}