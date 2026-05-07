export type EventType = 'wedding' | 'birthday' | 'corporate' | 'graduation' | 'other'

export interface Event {
  id: string
  name: string
  event_type: EventType
  date: string
  venue: string | null
  description: string | null
  created_at: string
}

export interface Guest {
  id: string
  event_id: string
  name: string
  phone: string | null
  email: string | null
  qr_token: string
  created_at: string
}

export interface RsvpResponse {
  id: string
  guest_id: string
  status: 'attending' | 'not_attending' | 'pending'
  responded_at: string
}

export interface Checkin {
  id: string
  guest_id: string
  checked_in_at: string
}