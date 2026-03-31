"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, CalendarX, Droplets, Grid3x3, Layers, Zap } from "lucide-react"
import { Badge, EmptyState, Button } from "@/design-system"
import { MOCK_BOOKINGS, SERVICES, WORKERS } from "@/lib/mock-data"
import type { BookingStatus } from "@/lib/mock-data"
import { formatINR } from "@/lib/utils"

const ICON_MAP: Record<string, React.ReactNode> = {
  droplets:  <Droplets className="w-5 h-5" />,
  "grid-3x3": <Grid3x3 className="w-5 h-5" />,
  layers:    <Layers className="w-5 h-5" />,
  zap:       <Zap className="w-5 h-5" />,
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
        My Bookings
      </h1>

      {/* Tabs */}
      <div
        className="flex gap-1 p-1 mb-6"
        role="tablist"
        aria-label="Booking tabs"
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
        <div className="space-y-3">
          {filtered.map((b) => {
            const service = SERVICES.find((s) => s.id === b.service)
            const worker  = WORKERS.find((w) => w.id === b.workerId)
            const cfg     = STATUS_CFG[b.status]
            return (
              <Link key={b.id} href={`/customer/bookings/${b.id}`}>
                <div
                  className="flex items-center justify-between gap-4 px-5 py-5 cursor-pointer transition-all hover:bg-[var(--color-neutral-50)]"
                  style={{
                    backgroundColor: "var(--color-neutral-0)",
                    border: "1.5px solid var(--color-border-default)",
                    borderRadius: "var(--radius-xl)",
                    boxShadow: "var(--shadow-xs)",
                  }}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: "linear-gradient(135deg, #EDFAF2, #D0F2DF)", color: "var(--color-brand-600)" }}>
                      {ICON_MAP[service?.icon ?? "droplets"]}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold truncate" style={{ color: "var(--color-text-primary)" }}>{service?.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                        {b.slot.date} · {b.slot.startTime} · {worker?.name}
                      </p>
                      <p className="text-xs font-semibold mt-1" style={{ color: "var(--color-brand-600)" }}>
                        {formatINR(b.quote.total)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={cfg.color} badgeStyle="soft" size="sm">{cfg.label}</Badge>
                    <ArrowRight className="w-4 h-4" style={{ color: "var(--color-text-secondary)" }} />
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
