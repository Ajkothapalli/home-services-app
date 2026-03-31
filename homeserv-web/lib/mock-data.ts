import { addDays, format, isWeekend } from "date-fns"

export const SERVICES = [
  {
    id: "seepage",
    name: "Seepage Repair",
    icon: "droplets",
    priceFrom: 1200,
    duration: "2–4 hrs",
    rating: 4.8,
    reviews: 312,
    badge: "Most Booked",
    description:
      "Fix active water leakage, pipe seepage, and damp walls with guaranteed waterproofing.",
  },
  {
    id: "tiling",
    name: "Tiling",
    icon: "grid-3x3",
    priceFrom: 1800,
    duration: "4–8 hrs",
    rating: 4.7,
    reviews: 189,
    badge: undefined,
    description:
      "New tile installation or repair for floors, walls, bathrooms, and kitchens.",
  },
  {
    id: "grouting",
    name: "Grouting",
    icon: "layers",
    priceFrom: 800,
    duration: "1–3 hrs",
    rating: 4.9,
    reviews: 94,
    badge: "Top Rated",
    description:
      "Regrout bathroom and kitchen tiles to prevent leakage and restore appearance.",
  },
  {
    id: "welding",
    name: "Welding",
    icon: "zap",
    priceFrom: 1500,
    duration: "2–5 hrs",
    rating: 4.6,
    reviews: 67,
    badge: undefined,
    description:
      "Gate fabrication, railing repair, grill welding, and structural metalwork.",
  },
] as const

export type ServiceId = (typeof SERVICES)[number]["id"]

export const WORKERS = [
  {
    id: "w1",
    name: "Ramesh Kumar",
    avatar: "/avatars/ramesh.jpg",
    rating: 4.8,
    reviews: 127,
    jobsCompleted: 312,
    skills: ["seepage", "tiling"] as ServiceId[],
    city: "Mumbai",
    experience: 7,
    distance: "2.3 km",
    phone: "+91 98765 11111",
    tags: ["Punctual", "Clean Work", "Polite"],
  },
  {
    id: "w2",
    name: "Suresh Patel",
    avatar: "/avatars/suresh.jpg",
    rating: 4.9,
    reviews: 83,
    jobsCompleted: 205,
    skills: ["grouting", "tiling"] as ServiceId[],
    city: "Mumbai",
    experience: 5,
    distance: "1.8 km",
    phone: "+91 98765 22222",
    tags: ["Top Rated", "Fast", "Detailed"],
  },
  {
    id: "w3",
    name: "Arjun Singh",
    avatar: "/avatars/arjun.jpg",
    rating: 4.6,
    reviews: 54,
    jobsCompleted: 167,
    skills: ["welding"] as ServiceId[],
    city: "Mumbai",
    experience: 9,
    distance: "4.1 km",
    phone: "+91 98765 33333",
    tags: ["Expert", "Heavy-duty", "Reliable"],
  },
] as const

export const CUSTOMERS = [
  {
    id: "c1",
    name: "Priya Sharma",
    phone: "+91 98765 43210",
    address: "12B, Andheri West, Mumbai 400058",
  },
  {
    id: "c2",
    name: "Ajay Mehta",
    phone: "+91 91234 56789",
    address: "5, Bandra East, Mumbai 400051",
  },
] as const

export interface TimeSlot {
  id: string
  date: string       // ISO "2026-04-01"
  startTime: string  // "09:00"
  endTime: string    // "09:30"
  status: "available" | "booked" | "blocked" | "selected"
  providerId?: string
}

// Time slots per day (30-min intervals, 9 AM – 6 PM)
const DAY_SLOTS = [
  { start: "09:00", end: "09:30" },
  { start: "09:30", end: "10:00" },
  { start: "10:00", end: "10:30" },
  { start: "10:30", end: "11:00" },
  { start: "11:00", end: "11:30" },
  { start: "14:00", end: "14:30" },
  { start: "14:30", end: "15:00" },
  { start: "15:00", end: "15:30" },
  { start: "15:30", end: "16:00" },
  { start: "16:00", end: "16:30" },
  { start: "16:30", end: "17:00" },
]

// Generate 14 days ahead, skip Sundays, random booked slots to simulate real availability
export function generateMockSlots(providerId: string): TimeSlot[] {
  const slots: TimeSlot[] = []
  // Deterministic "random" using providerId hash so renders are stable
  const seed = providerId.charCodeAt(providerId.length - 1)

  for (let i = 0; i <= 14; i++) {
    const date = addDays(new Date(), i)
    if (date.getDay() === 0) continue // skip Sundays
    const dateStr = format(date, "yyyy-MM-dd")

    DAY_SLOTS.forEach((t, slotIdx) => {
      // Mark some slots as booked deterministically
      const isBooked = (seed + i + slotIdx) % 5 === 0
      slots.push({
        id: `${providerId}-${dateStr}-${t.start.replace(":", "")}`,
        date: dateStr,
        startTime: t.start,
        endTime: t.end,
        status: isBooked ? "booked" : "available",
        providerId,
      })
    })
  }
  return slots
}

// Return the first available slot across all dates
export function findNextAvailableSlot(slots: TimeSlot[]): TimeSlot | undefined {
  return slots.find((s) => s.status === "available")
}

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "assigned"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "en_route"

export const MOCK_BOOKINGS = [
  {
    id: "HS-2041",
    customerId: "c1",
    workerId: "w1",
    service: "seepage" as ServiceId,
    affectedArea: ["Bathroom"],
    urgency: "urgent",
    address: "12B, Andheri West, Mumbai",
    slot: { date: "2026-04-01", startTime: "10:00", endTime: "10:30" },
    status: "en_route" as BookingStatus,
    rescheduleCount: 0,
    quote: {
      serviceCharge: 2400,
      labourCharge: 1800,
      visitCharge: 0,
      gst: 756,
      total: 4956,
    },
    payment: {
      method: "UPI",
      status: "paid",
      paidAt: "2026-03-30T10:32:00Z",
    },
  },
  {
    id: "HS-2038",
    customerId: "c1",
    workerId: "w2",
    service: "tiling" as ServiceId,
    affectedArea: ["Kitchen"],
    urgency: "routine",
    address: "12B, Andheri West, Mumbai",
    slot: { date: "2026-03-28", startTime: "09:00", endTime: "09:30" },
    status: "completed" as BookingStatus,
    rescheduleCount: 0,
    quote: {
      serviceCharge: 4200,
      labourCharge: 1200,
      visitCharge: 0,
      gst: 972,
      total: 5400,
    },
    payment: {
      method: "Card",
      status: "paid",
      paidAt: "2026-03-27T14:15:00Z",
    },
  },
] as const

export const MOCK_EARNINGS = [
  {
    id: "e1",
    ref: "HS-2038",
    service: "Tiling",
    customerName: "Priya Sharma",
    date: "Mar 28, 2026",
    amount: 5400,
    status: "paid" as "paid" | "pending" | "processing",
  },
  {
    id: "e2",
    ref: "HS-2039",
    service: "Grouting",
    customerName: "Raj Verma",
    date: "Mar 29, 2026",
    amount: 1800,
    status: "paid" as "paid" | "pending" | "processing",
  },
  {
    id: "e3",
    ref: "HS-2041",
    service: "Seepage Repair",
    customerName: "Ajay Mehta",
    date: "Apr 01, 2026",
    amount: 4956,
    status: "pending" as "paid" | "pending" | "processing",
  },
] as const

// Auto-assign best worker for a service: highest rating, then lowest workload
export function assignWorker(serviceId: ServiceId) {
  const eligible = WORKERS.filter((w) => (w.skills as readonly string[]).includes(serviceId))
  return eligible.sort((a, b) => b.rating - a.rating)[0] ?? WORKERS[0]
}

// Calculate quote
export function calcQuote(priceFrom: number) {
  const serviceCharge = priceFrom
  const visitCharge   = 149   // waived on confirm in UI
  const gst           = Math.round(serviceCharge * 0.18)
  const total         = serviceCharge + gst
  return { serviceCharge, visitCharge, gst, total }
}

// Booking state machine — allowed transitions
export const BOOKING_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  pending:     ["confirmed", "cancelled"],
  confirmed:   ["assigned",  "cancelled"],
  assigned:    ["in_progress", "cancelled"],
  in_progress: ["completed"],
  completed:   [],
  cancelled:   [],
  en_route:    ["in_progress", "cancelled"],
}

export function canReschedule(booking: { status: BookingStatus; rescheduleCount: number; slot: { date: string; startTime: string } }): boolean {
  if (booking.rescheduleCount >= 1) return false
  if (!["confirmed", "assigned"].includes(booking.status)) return false
  // Must be > 3 hours before slot
  const slotDateTime = new Date(`${booking.slot.date}T${booking.slot.startTime}:00`)
  const now = new Date()
  const hoursUntil = (slotDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)
  return hoursUntil > 3
}

export function canCancel(booking: { status: BookingStatus; slot: { date: string; startTime: string } }): boolean {
  if (!["confirmed", "assigned", "pending"].includes(booking.status)) return false
  const slotDateTime = new Date(`${booking.slot.date}T${booking.slot.startTime}:00`)
  const now = new Date()
  const hoursUntil = (slotDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)
  return hoursUntil > 2
}
