"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, ClipboardList, MapPin, Clock, IndianRupee } from "lucide-react"
import { Badge, EmptyState } from "@/design-system"
import { MOCK_BOOKINGS, SERVICES, CUSTOMERS, WORKERS } from "@/lib/mock-data"
import type { BookingStatus } from "@/lib/mock-data"
import { formatINR } from "@/lib/utils"

const SERVICE_IMAGES: Record<string, string> = {
  "seepage":  "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&q=80",
  "tiling":   "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80",
  "grouting": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  "welding":  "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=80",
}

const STATUS_CFG: Record<BookingStatus, { label: string; color: "info" | "warning" | "success" | "error" | "neutral" }> = {
  pending:     { label: "New",         color: "info"    },
  confirmed:   { label: "Confirmed",   color: "info"    },
  assigned:    { label: "Assigned",    color: "info"    },
  en_route:    { label: "En Route",    color: "warning" },
  in_progress: { label: "In Progress", color: "warning" },
  completed:   { label: "Completed",   color: "success" },
  cancelled:   { label: "Cancelled",   color: "error"   },
}

type Tab = "new" | "active" | "completed"
const worker = WORKERS[0]

export default function WorkerJobsPage() {
  const [tab, setTab] = React.useState<Tab>("new")
  const myJobs = [...MOCK_BOOKINGS].filter((b) => b.workerId === worker.id)

  const filtered = myJobs.filter((b) => {
    if (tab === "new")       return ["pending", "confirmed", "assigned"].includes(b.status)
    if (tab === "active")    return ["en_route", "in_progress"].includes(b.status)
    if (tab === "completed") return ["completed", "cancelled"].includes(b.status)
    return false
  })

  const counts = {
    new:       myJobs.filter((b) => ["pending", "confirmed", "assigned"].includes(b.status)).length,
    active:    myJobs.filter((b) => ["en_route", "in_progress"].includes(b.status)).length,
    completed: myJobs.filter((b) => ["completed", "cancelled"].includes(b.status)).length,
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 lg:py-8">
      <h1 className="hidden lg:block text-2xl font-bold mb-6" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
        My Jobs
      </h1>

      {/* Tabs with counts */}
      <div
        className="flex gap-1 p-1 mb-6"
        role="tablist"
        style={{ backgroundColor: "var(--color-neutral-100)", borderRadius: "var(--radius-full)", width: "fit-content" }}
      >
        {(["new", "active", "completed"] as Tab[]).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className="px-4 py-1.5 text-sm font-semibold capitalize transition-all focus-visible:outline-none"
            style={{
              borderRadius: "var(--radius-full)",
              backgroundColor: tab === t ? "var(--color-neutral-0)" : "transparent",
              color: tab === t ? "var(--color-brand-700)" : "var(--color-text-secondary)",
              boxShadow: tab === t ? "var(--shadow-sm)" : "none",
            }}
          >
            {t}
            {counts[t] > 0 && (
              <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full"
                style={{
                  background: tab === t ? "var(--color-brand-100)" : "var(--color-neutral-200)",
                  color: tab === t ? "var(--color-brand-700)" : "var(--color-text-secondary)",
                }}>
                {counts[t]}
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<ClipboardList className="w-10 h-10" />}
          title={`No ${tab} jobs`}
          description={tab === "new" ? "New bookings assigned to you will appear here." : `No ${tab} jobs at this time.`}
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((b) => {
            const service  = SERVICES.find((s) => s.id === b.service)
            const customer = CUSTOMERS.find((c) => c.id === b.customerId)
            const cfg      = STATUS_CFG[b.status]
            const img      = SERVICE_IMAGES[b.service]
            return (
              <Link key={b.id} href={`/worker/jobs/${b.id}`}>
                <div
                  className="overflow-hidden cursor-pointer"
                  style={{
                    backgroundColor: "var(--color-neutral-0)",
                    border: "1.5px solid var(--color-border-default)",
                    borderRadius: "var(--radius-2xl)",
                    transition: "box-shadow 300ms ease, border-color 300ms ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.12)"
                    e.currentTarget.style.borderColor = "var(--color-brand-200)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none"
                    e.currentTarget.style.borderColor = "var(--color-border-default)"
                  }}
                >
                  <div className="flex gap-4 p-4">
                    {/* Service photo */}
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                      {img ? (
                        <img src={img} alt={service?.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full" style={{ background: "linear-gradient(135deg, #EDFAF2, #D0F2DF)" }} />
                      )}
                      {/* Status dot */}
                      <div className="absolute top-2 right-2">
                        <Badge variant={cfg.color} badgeStyle="soft" size="sm">{cfg.label}</Badge>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-bold text-base leading-tight" style={{ color: "var(--color-text-primary)" }}>
                          {service?.name}
                        </h3>
                      </div>
                      <p className="text-sm mb-2" style={{ color: "var(--color-text-secondary)" }}>{customer?.name}</p>

                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" style={{ color: "var(--color-text-secondary)" }} />
                          <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                            {b.slot.date} · {b.slot.startTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--color-text-secondary)" }} />
                          <span className="text-xs truncate" style={{ color: "var(--color-text-secondary)" }}>{b.address}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px solid var(--color-border-default)" }}>
                        <div className="flex items-center gap-1">
                          <IndianRupee className="w-3.5 h-3.5" style={{ color: "var(--color-brand-600)" }} />
                          <span className="text-sm font-bold" style={{ color: "var(--color-brand-600)" }}>
                            {formatINR(b.quote.total)}
                          </span>
                        </div>
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
