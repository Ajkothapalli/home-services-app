"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, ClipboardList, Droplets, Grid3x3, Layers, Zap } from "lucide-react"
import { Badge, EmptyState, Button } from "@/design-system"
import { MOCK_BOOKINGS, SERVICES, CUSTOMERS, WORKERS } from "@/lib/mock-data"
import type { BookingStatus } from "@/lib/mock-data"
import { formatINR } from "@/lib/utils"

const ICON_MAP: Record<string, React.ReactNode> = {
  droplets:   <Droplets className="w-5 h-5" />,
  "grid-3x3": <Grid3x3 className="w-5 h-5" />,
  layers:     <Layers className="w-5 h-5" />,
  zap:        <Zap className="w-5 h-5" />,
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

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
        My Jobs
      </h1>

      {/* Tabs */}
      <div
        className="flex gap-1 p-1 mb-6"
        role="tablist"
        aria-label="Job tabs"
        style={{ backgroundColor: "var(--color-neutral-100)", borderRadius: "var(--radius-full)", width: "fit-content" }}
      >
        {(["new", "active", "completed"] as Tab[]).map((t) => (
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

      {filtered.length === 0 ? (
        <EmptyState
          icon={<ClipboardList className="w-10 h-10" />}
          title={`No ${tab} jobs`}
          description={tab === "new" ? "New bookings assigned to you will appear here." : `No ${tab} jobs at this time.`}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => {
            const service  = SERVICES.find((s) => s.id === b.service)
            const customer = CUSTOMERS.find((c) => c.id === b.customerId)
            const cfg      = STATUS_CFG[b.status]
            return (
              <Link key={b.id} href={`/worker/jobs/${b.id}`}>
                <div
                  className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer transition-all hover:bg-[var(--color-neutral-50)]"
                  style={{
                    backgroundColor: "var(--color-neutral-0)",
                    border: "1.5px solid var(--color-border-default)",
                    borderRadius: "var(--radius-xl)",
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: "linear-gradient(135deg, #EDFAF2, #D0F2DF)", color: "var(--color-brand-600)" }}>
                      {ICON_MAP[service?.icon ?? "droplets"]}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold truncate" style={{ color: "var(--color-text-primary)" }}>{service?.name}</p>
                      <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                        {customer?.name} · {b.slot.date} · {b.slot.startTime}
                      </p>
                      <p className="text-xs font-semibold" style={{ color: "var(--color-brand-600)" }}>
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
