import QRCode from 'qrcode'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params

  const rsvpUrl = `${process.env.NEXT_PUBLIC_APP_URL}/rsvp/${token}`

  const qrBuffer = await QRCode.toBuffer(rsvpUrl, {
    errorCorrectionLevel: 'H',
    width: 300,
    margin: 2,
    color: {
      dark: '#1e293b',
      light: '#ffffff',
    },
  })

  return new NextResponse(qrBuffer as unknown as BodyInit, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000',
    },
  })
}