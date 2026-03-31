"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ChevronLeft, MapPin, Phone, CheckCircle2, Clock, Navigation, AlertCircle } from "lucide-react"
import { Button, Badge, Avatar, Rating, useToast } from "@/design-system"
import { MOCK_BOOKINGS, SERVICES, CUSTOMERS, WORKERS } from "@/lib/mock-data"
import { formatINR, mockDelay } from "@/lib/utils"
import { format, parseISO } from "date-fns"

export default function WorkerJobDetailPage() {
  const params  = useParams()
  const toast   = useToast()
  const jobId   = params.jobId as string
  const booking = MOCK_BOOKINGS.find((b) => b.id === jobId)

  const [status, setStatus] = React.useState(booking?.status ?? "assigned")
  const [loading, setLoading] = React.useState(false)

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="font-bold" style={{ color: "var(--color-text-primary)" }}>Job not found</p>
        <Link href="/worker/jobs"><Button variant="outline">Back to Jobs</Button></Link>
      </div>
    )
  }

  const service  = SERVICES.find((s) => s.id === booking.service)
  const customer = CUSTOMERS.find((c) => c.id === booking.customerId)
  const worker   = WORKERS.find((w) => w.id === booking.workerId)

  async function handleStatusChange(newStatus: typeof status) {
    setLoading(true)
    await mockDelay(600)
    setStatus(newStatus)
    setLoading(false)
    if (newStatus === "in_progress") toast.success("Job started. Customer notified.")
    if (newStatus === "completed")   toast.success("Job marked as completed!")
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-5">
      <Link href="/worker/jobs"
        className="inline-flex items-center gap-1 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB374] rounded"
        style={{ color: "var(--color-brand-600)" }}>
        <ChevronLeft className="w-4 h-4" /> All Jobs
      </Link>

      {/* Job header */}
      <div
        className="p-5"
        style={{
          background: "linear-gradient(135deg, #EDFAF2, #D0F2DF)",
          border: "1.5px solid var(--color-brand-200)",
          borderRadius: "var(--radius-2xl)",
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "var(--color-brand-600)" }}>
              {booking.id}
            </p>
            <h1 className="text-xl font-bold" style={{ color: "var(--color-brand-900)", fontFamily: "var(--font-sora)" }}>
              {service?.name}
            </h1>
          </div>
          <Badge
            variant={status === "completed" ? "success" : status === "en_route" || status === "in_progress" ? "warning" : "info"}
            badgeStyle="soft"
          >
            {status.replace("_", " ")}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <div className="flex items-center gap-1" style={{ color: "var(--color-brand-700)" }}>
            <Clock className="w-4 h-4" />
            {format(parseISO(booking.slot.date), "EEE, d MMM")} · {booking.slot.startTime}
          </div>
          <div className="flex items-center gap-1" style={{ color: "var(--color-brand-700)" }}>
            <MapPin className="w-4 h-4" />
            {booking.address}
          </div>
        </div>
      </div>

      {/* Customer card */}
      {customer && (
        <div className="p-5"
          style={{
            backgroundColor: "var(--color-neutral-0)",
            border: "1.5px solid var(--color-border-default)",
            borderRadius: "var(--radius-xl)",
          }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--color-text-secondary)" }}>Customer</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar name={customer.name} size="md" />
              <div>
                <p className="font-semibold" style={{ color: "var(--color-text-primary)" }}>{customer.name}</p>
                <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{customer.address}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <a
                href={`tel:${customer.phone}`}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-[var(--color-brand-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB374]"
                style={{ border: "1.5px solid var(--color-brand-300)", color: "var(--color-brand-600)" }}
                aria-label={`Call ${customer.name}`}
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Job details */}
      <div className="p-5 space-y-3"
        style={{
          backgroundColor: "var(--color-neutral-0)",
          border: "1.5px solid var(--color-border-default)",
          borderRadius: "var(--radius-xl)",
        }}>
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-text-secondary)" }}>Job Details</p>
        {[
          { label: "Affected area", value: booking.affectedArea.join(", ") },
          { label: "Urgency",       value: booking.urgency },
          { label: "Earning",       value: formatINR(booking.quote.total) },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between text-sm">
            <span style={{ color: "var(--color-text-secondary)" }}>{label}</span>
            <span className="font-medium" style={{ color: "var(--color-text-primary)" }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      {status !== "completed" && status !== "cancelled" && (
        <div className="space-y-3">
          {status === "assigned" && (
            <Button variant="primary" size="lg" fullWidth loading={loading}
              iconLeft={<Navigation className="w-5 h-5" />}
              onClick={() => handleStatusChange("en_route")}>
              Start En Route
            </Button>
          )}
          {status === "en_route" && (
            <Button variant="primary" size="lg" fullWidth loading={loading}
              iconLeft={<Clock className="w-5 h-5" />}
              onClick={() => handleStatusChange("in_progress")}>
              Start Work
            </Button>
          )}
          {status === "in_progress" && (
            <Button variant="primary" size="lg" fullWidth loading={loading}
              iconLeft={<CheckCircle2 className="w-5 h-5" />}
              onClick={() => handleStatusChange("completed")}>
              Mark as Completed
            </Button>
          )}
        </div>
      )}

      {status === "completed" && (
        <div className="flex items-center gap-3 px-4 py-4 rounded-xl"
          style={{ backgroundColor: "var(--color-brand-50)", border: "1.5px solid var(--color-brand-200)" }}>
          <CheckCircle2 className="w-5 h-5" style={{ color: "var(--color-brand-600)" }} />
          <div>
            <p className="font-semibold" style={{ color: "var(--color-brand-800)" }}>Job Completed</p>
            <p className="text-xs" style={{ color: "var(--color-brand-600)" }}>
              {formatINR(booking.quote.total)} will be credited within 1–2 business days
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
