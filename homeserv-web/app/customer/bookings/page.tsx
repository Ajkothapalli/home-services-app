"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, CalendarX, Calendar, Clock, MapPin, User } from "lucide-react"
import { Badge, EmptyState, Button, Avatar } from "@/design-system"
import { MOCK_BOOKINGS, SERVICES, WORKERS } from "@/lib/mock-data"
import type { BookingStatus } from "@/lib/mock-data"
import { formatINR } from "@/lib/utils"

const SERVICE_IMAGES: Record<string, string> = {
  "seepage":  "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&q=80",
  "tiling":   "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80",
  "grouting": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  "welding":  "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=80",
}

const STATUS_CFG: Record<BookingStatus, { label: string; color: "info" | "warning" | "success" | "error" | "neutral" }> = {
  pending:     { label: "Pending",     color: "neutral"  },
  confirmed:   { label: "Confirmed",   color: "info"     },
  assigned:    { label: "Assigned",    color: "info"     },
  en_route:    { label: "On the way",  color: "warning"  },
  in_progress: { label: "In Progress", color: "warning"  },
  completed:   { label: "Completed",   color: "success"  },
  cancelled:   { label: "Cancelled",   color: "error"    },
}

type Tab = "upcoming" | "past" | "cancelled"
const TAB_STATUSES: Record<Tab, BookingStatus[]> = {
  upcoming:  ["pending", "confirmed", "assigned", "en_route", "in_progress"],
  past:      ["completed"],
  cancelled: ["cancelled"],
}

export default function BookingsPage() {
  const [tab, setTab] = React.useState<Tab>("upcoming")
  const filtered = [...MOCK_BOOKINGS].filter((b) => TAB_STATUSES[tab].includes(b.status))

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 lg:py-8">
      <h1 className="hidden lg:block text-2xl font-bold mb-6" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
        My Bookings
      </h1>

      {/* Tabs */}
      <div
        className="flex gap-1 p-1 mb-6"
        role="tablist"
        style={{ backgroundColor: "var(--color-neutral-100)", borderRadius: "var(--radius-full)", width: "fit-content" }}
      >
        {(["upcoming", "past", "cancelled"] as Tab[]).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className="px-4 py-1.5 text-sm font-semibold capitalize transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB374]"
            style={{
              borderRadius: "var(--radius-full)",
              backgroundColor: tab === t ? "var(--color-neutral-0)" : "transparent",
              color: tab === t ? "var(--color-brand-700)" : "var(--color-text-secondary)",
              boxShadow: tab === t ? "var(--shadow-sm)" : "none",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<CalendarX className="w-10 h-10" />}
          title={`No ${tab} bookings`}
          description={tab === "upcoming" ? "Book your first service to get started." : `You have no ${tab} bookings.`}
          action={
            tab === "upcoming"
              ? <Link href="/customer/services"><Button variant="primary" size="sm">Browse Services</Button></Link>
              : undefined
          }
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((b) => {
            const service = SERVICES.find((s) => s.id === b.service)
            const worker  = WORKERS.find((w) => w.id === b.workerId)
            const cfg     = STATUS_CFG[b.status]
            const img     = SERVICE_IMAGES[b.service]
            return (
              <Link key={b.id} href={`/customer/bookings/${b.id}`}>
                <div
                  className="overflow-hidden cursor-pointer"
                  style={{
                    backgroundColor: "var(--color-neutral-0)",
                    border: "1.5px solid var(--color-border-default)",
                    borderRadius: "var(--radius-2xl)",
                    boxShadow: "var(--shadow-xs)",
                    transition: "box-shadow 300ms ease, border-color 300ms ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.12)"
                    e.currentTarget.style.borderColor = "var(--color-brand-200)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "var(--shadow-xs)"
                    e.currentTarget.style.borderColor = "var(--color-border-default)"
                  }}
                >
                  <div className="flex gap-4 p-4">
                    {/* Service photo thumbnail */}
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                      {img ? (
                        <img src={img} alt={service?.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full" style={{ background: "linear-gradient(135deg, #EDFAF2, #D0F2DF)" }} />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h3 className="font-bold text-base leading-tight" style={{ color: "var(--color-text-primary)" }}>
                          {service?.name}
                        </h3>
                        <Badge variant={cfg.color} badgeStyle="soft" size="sm">{cfg.label}</Badge>
                      </div>

                      <div className="flex flex-col gap-1 mb-2">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--color-text-secondary)" }} />
                          <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                            {b.slot.date}
                          </span>
                          <Clock className="w-3.5 h-3.5 shrink-0 ml-2" style={{ color: "var(--color-text-secondary)" }} />
                          <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                            {b.slot.startTime}
                          </span>
                        </div>
                        {worker && (
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--color-text-secondary)" }} />
                            <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{worker.name}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold" style={{ color: "var(--color-brand-600)" }}>
                          {formatINR(b.quote.total)}
                        </span>
                        <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: "var(--color-brand-600)" }}>
                          View details <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
