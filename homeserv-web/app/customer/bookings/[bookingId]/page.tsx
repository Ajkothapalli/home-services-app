"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ChevronLeft, Clock, MapPin, CheckCircle2, Phone,
  MessageCircle, Download, Star, AlertTriangle, Navigation,
} from "lucide-react"
import { Button, Badge, Avatar, Rating, useToast } from "@/design-system"
import { MOCK_BOOKINGS, SERVICES, WORKERS, canReschedule, canCancel } from "@/lib/mock-data"
import { formatINR, mockDelay } from "@/lib/utils"
import { format, parseISO } from "date-fns"

const STATUS_CFG = {
  pending:     { label: "Pending Payment",      color: "neutral"  as const, icon: <Clock className="w-4 h-4" /> },
  confirmed:   { label: "Booking Confirmed",    color: "info"     as const, icon: <CheckCircle2 className="w-4 h-4" /> },
  assigned:    { label: "Professional Assigned",color: "success"  as const, icon: <CheckCircle2 className="w-4 h-4" /> },
  en_route:    { label: "Professional is on the way", color: "warning" as const, icon: <Navigation className="w-4 h-4" /> },
  in_progress: { label: "Work in Progress",     color: "warning"  as const, icon: <Clock className="w-4 h-4" /> },
  completed:   { label: "Job Completed",        color: "success"  as const, icon: <CheckCircle2 className="w-4 h-4" /> },
  cancelled:   { label: "Booking Cancelled",    color: "error"    as const, icon: <AlertTriangle className="w-4 h-4" /> },
}

const TIMELINE_STEPS = [
  { key: "pending",     label: "Booking Confirmed"    },
  { key: "assigned",    label: "Professional Assigned" },
  { key: "en_route",    label: "Professional En Route" },
  { key: "in_progress", label: "Work Started"          },
  { key: "completed",   label: "Job Completed"         },
]

const STATUS_ORDER = ["pending", "confirmed", "assigned", "en_route", "in_progress", "completed"]

export default function BookingDetailPage() {
  const params    = useParams()
  const toast     = useToast()
  const bookingId = params.bookingId as string

  const booking = MOCK_BOOKINGS.find((b) => b.id === bookingId)

  const [reviewRating, setReviewRating] = React.useState(0)
  const [reviewText,   setReviewText]   = React.useState("")
  const [reviewed,     setReviewed]     = React.useState(false)
  const [submitting,   setSubmitting]   = React.useState(false)

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="font-bold" style={{ color: "var(--color-text-primary)" }}>Booking not found</p>
        <Link href="/customer/bookings"><Button variant="outline">Back to Bookings</Button></Link>
      </div>
    )
  }

  const service = SERVICES.find((s) => s.id === booking.service)
  const worker  = WORKERS.find((w) => w.id === booking.workerId)
  const cfg     = STATUS_CFG[booking.status]
  const currentStep = STATUS_ORDER.indexOf(booking.status)

  const showMap     = booking.status === "en_route"
  const showReview  = booking.status === "completed" && !reviewed

  const bookingForCancel = { ...booking, rescheduleCount: 0 }

  async function handleReview(e: React.FormEvent) {
    e.preventDefault()
    if (reviewRating === 0) { toast.error("Please give a star rating"); return }
    setSubmitting(true)
    await mockDelay(800)
    setSubmitting(false)
    setReviewed(true)
    toast.success("Review submitted. Thank you!")
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 lg:py-8 space-y-4 lg:space-y-6">
      {/* Back — desktop only; mobile uses layout header */}
      <Link
        href="/customer/bookings"
        className="hidden lg:inline-flex items-center gap-1 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB374] rounded"
        style={{ color: "var(--color-brand-600)" }}
      >
        <ChevronLeft className="w-4 h-4" /> My Bookings
      </Link>

      {/* Status banner */}
      <div
        className="flex items-center gap-3 px-5 py-4"
        style={{
          background: booking.status === "en_route"
            ? "linear-gradient(135deg, #FFFBEB, #FDE68A)"
            : booking.status === "completed"
              ? "linear-gradient(135deg, #F0FDF4, #BBF7D0)"
              : booking.status === "cancelled"
                ? "linear-gradient(135deg, #FEF2F2, #FECACA)"
                : "linear-gradient(135deg, #EFF6FF, #BFDBFE)",
          borderRadius: "var(--radius-xl)",
          border: `1.5px solid ${booking.status === "en_route" ? "#FDE68A" : booking.status === "completed" ? "#BBF7D0" : booking.status === "cancelled" ? "#FECACA" : "#BFDBFE"}`,
        }}
      >
        <span style={{
          color: booking.status === "en_route" ? "#B45309"
            : booking.status === "completed" ? "var(--color-brand-600)"
            : booking.status === "cancelled" ? "var(--color-error-600)"
            : "#1D4ED8"
        }}>
          {cfg.icon}
        </span>
        <div>
          <p className="font-bold text-sm" style={{
            color: booking.status === "en_route" ? "#92400E"
              : booking.status === "completed" ? "var(--color-brand-800)"
              : booking.status === "cancelled" ? "var(--color-error-700)"
              : "#1E3A8A"
          }}>
            {cfg.label}
          </p>
          <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
            {service?.name} · {format(parseISO(booking.slot.date), "EEE, d MMM")} · {booking.slot.startTime}
          </p>
        </div>
        <div className="ml-auto">
          <Badge variant={cfg.color} badgeStyle="soft" size="sm">{booking.id}</Badge>
        </div>
      </div>

      {/* Professional card */}
      {worker && (
        <div
          className="p-5"
          style={{
            backgroundColor: "var(--color-neutral-0)",
            border: "1.5px solid var(--color-border-default)",
            borderRadius: "var(--radius-xl)",
          }}
        >
          <div className="flex items-center gap-4">
            <Avatar name={worker.name} size="lg" status={booking.status === "en_route" || booking.status === "in_progress" ? "online" : undefined} />
            <div className="flex-1">
              <p className="font-bold" style={{ color: "var(--color-text-primary)" }}>{worker.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <Rating value={worker.rating} size="sm" showValue />
                <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                  {worker.jobsCompleted} jobs
                </span>
              </div>
              <p className="text-xs mt-1" style={{ color: "var(--color-text-secondary)" }}>{worker.distance} away</p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-[var(--color-brand-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB374]"
                style={{ border: "1.5px solid var(--color-brand-300)", color: "var(--color-brand-600)" }}
                aria-label={`Call ${worker.name}`}
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-[var(--color-brand-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB374]"
                style={{ border: "1.5px solid var(--color-brand-300)", color: "var(--color-brand-600)" }}
                aria-label={`Message ${worker.name}`}
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live map mock (en_route) */}
      {showMap && (
        <div
          className="p-5 text-center"
          style={{
            background: "linear-gradient(135deg, #EDFAF2, #D0F2DF)",
            border: "1.5px solid var(--color-brand-200)",
            borderRadius: "var(--radius-xl)",
          }}
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Navigation className="w-5 h-5 animate-bounce" style={{ color: "var(--color-brand-600)" }} />
            <p className="font-bold" style={{ color: "var(--color-brand-800)" }}>
              {worker?.name} is on the way
            </p>
          </div>
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="font-bold text-2xl" style={{ color: "var(--color-brand-700)" }}>~8 min</span>
            <span style={{ color: "var(--color-brand-500)" }}>·</span>
            <span style={{ color: "var(--color-brand-700)" }}>2.3 km away</span>
          </div>
          <p className="text-xs mt-3" style={{ color: "var(--color-brand-600)" }}>
            <MapPin className="inline w-3 h-3 mr-1" />
            {booking.address}
          </p>
        </div>
      )}

      {/* Timeline */}
      <div
        className="p-5"
        style={{
          backgroundColor: "var(--color-neutral-0)",
          border: "1.5px solid var(--color-border-default)",
          borderRadius: "var(--radius-xl)",
        }}
      >
        <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "var(--color-text-secondary)" }}>
          Job Timeline
        </p>
        <div className="space-y-0">
          {TIMELINE_STEPS.map((ts, i) => {
            const stepIndex  = STATUS_ORDER.indexOf(ts.key)
            const isDone     = currentStep >= stepIndex && booking.status !== "cancelled"
            const isCurrent  = STATUS_ORDER[currentStep] === ts.key
            const isLast     = i === TIMELINE_STEPS.length - 1
            return (
              <div key={ts.key} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: isDone ? "linear-gradient(135deg, #1A9458, #2EB374)" : "var(--color-neutral-100)",
                      border: isCurrent && !isDone ? "2px solid var(--color-brand-500)" : "none",
                    }}
                  >
                    {isDone
                      ? <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      : <div className="w-2 h-2 rounded-full" style={{ backgroundColor: isCurrent ? "var(--color-brand-500)" : "var(--color-neutral-300)" }} />
                    }
                  </div>
                  {!isLast && (
                    <div className="w-0.5 h-8 mt-1" style={{ backgroundColor: isDone ? "var(--color-brand-300)" : "var(--color-neutral-200)" }} />
                  )}
                </div>
                <div className="pb-6 pt-0.5">
                  <p className="text-sm font-semibold" style={{ color: isDone ? "var(--color-text-primary)" : "var(--color-text-disabled)" }}>
                    {ts.label}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Review (completed) */}
      {showReview && (
        <form
          onSubmit={handleReview}
          className="p-5 space-y-4"
          style={{
            backgroundColor: "var(--color-neutral-0)",
            border: "1.5px solid var(--color-brand-200)",
            borderRadius: "var(--radius-xl)",
          }}
        >
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5" style={{ color: "#F5A623" }} />
            <p className="font-bold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
              How was the service?
            </p>
          </div>
          <Rating interactive value={reviewRating} onChange={setReviewRating} size="lg" />
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--color-text-primary)" }}>
              Comment <span className="font-normal text-xs" style={{ color: "var(--color-text-secondary)" }}>(optional)</span>
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience…"
              className="w-full rounded-lg px-4 py-3 text-sm outline-none resize-none"
              rows={3}
              style={{
                border: "2px solid var(--color-neutral-400)",
                color: "var(--color-text-primary)",
                backgroundColor: "var(--color-neutral-0)",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-brand-600)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(19,114,63,0.2)" }}
              onBlur={(e)  => { e.currentTarget.style.borderColor = "var(--color-neutral-400)"; e.currentTarget.style.boxShadow = "none" }}
            />
          </div>
          <Button type="submit" variant="primary" loading={submitting}>Submit Review</Button>
        </form>
      )}

      {reviewed && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl"
          style={{ backgroundColor: "var(--color-brand-50)", border: "1px solid var(--color-brand-200)" }}>
          <CheckCircle2 className="w-4 h-4" style={{ color: "var(--color-brand-600)" }} />
          <p className="text-sm font-medium" style={{ color: "var(--color-brand-700)" }}>
            Review submitted. Thank you!
          </p>
        </div>
      )}

      {/* Payment summary */}
      <div
        className="p-5"
        style={{
          backgroundColor: "var(--color-neutral-0)",
          border: "1.5px solid var(--color-border-default)",
          borderRadius: "var(--radius-xl)",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-text-secondary)" }}>Payment</p>
          <Badge
            variant={booking.payment.status === "paid" ? "success" : "warning"}
            badgeStyle="soft"
            size="sm"
          >
            {booking.payment.status}
          </Badge>
        </div>
        <p className="font-bold text-lg mb-1" style={{ color: "var(--color-text-primary)" }}>
          {formatINR(booking.quote.total)}
        </p>
        <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
          Paid via {booking.payment.method} ·{" "}
          {format(parseISO(booking.payment.paidAt), "d MMM yyyy")}
        </p>
        <Button variant="ghost" size="sm" iconLeft={<Download className="w-4 h-4" />} className="mt-3">
          Download Invoice
        </Button>
      </div>

      {/* Actions */}
      {(canReschedule(bookingForCancel) || canCancel(bookingForCancel)) && (
        <div className="flex gap-3">
          {canReschedule(bookingForCancel) && (
            <Button variant="outline" size="sm" fullWidth onClick={() => toast.info("Reschedule flow coming soon")}>
              Reschedule
            </Button>
          )}
          {canCancel(bookingForCancel) && (
            <Button variant="destructive" size="sm" fullWidth onClick={() => toast.error("Cancellation flow coming soon")}>
              Cancel Booking
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
