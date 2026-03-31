"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, CalendarDays, CheckCircle2, Clock, Droplets, Grid3x3, Layers, Zap } from "lucide-react"
import { Button, Badge, Rating, EmptyState } from "@/design-system"
import { SERVICES, MOCK_BOOKINGS, WORKERS } from "@/lib/mock-data"
import { formatINR } from "@/lib/utils"

const ICON_MAP: Record<string, React.ReactNode> = {
  droplets: <Droplets className="w-6 h-6" />,
  "grid-3x3": <Grid3x3 className="w-6 h-6" />,
  layers: <Layers className="w-6 h-6" />,
  zap: <Zap className="w-6 h-6" />,
}

const STATUS_CONFIG = {
  en_route:    { label: "On the way",    color: "warning" as const, icon: <Clock className="w-3.5 h-3.5" /> },
  in_progress: { label: "In Progress",  color: "info"    as const, icon: <Clock className="w-3.5 h-3.5" /> },
  upcoming:    { label: "Upcoming",     color: "info"    as const, icon: <CalendarDays className="w-3.5 h-3.5" /> },
  completed:   { label: "Completed",   color: "success" as const, icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  cancelled:   { label: "Cancelled",   color: "error"   as const, icon: null },
  confirmed:   { label: "Confirmed",   color: "success" as const, icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  pending:     { label: "Pending",     color: "neutral" as const, icon: null },
  assigned:    { label: "Assigned",    color: "success" as const, icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
}

export default function CustomerDashboard() {
  const customerName = "Priya"
  const activeBooking = MOCK_BOOKINGS.find((b) => b.status === "en_route" || b.status === "in_progress")
  const recentBookings = [...MOCK_BOOKINGS].slice(0, 3)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium mb-1" style={{ color: "var(--color-text-secondary)" }}>Good morning,</p>
          <h1 className="text-2xl font-bold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
            {customerName} 👋
          </h1>
        </div>
        <Link href="/customer/services">
          <Button variant="primary" size="sm" iconRight={<ArrowRight className="w-4 h-4" />}>
            Book Service
          </Button>
        </Link>
      </div>

      {/* ── Active booking banner ──────────────────────────────────────── */}
      {activeBooking && (() => {
        const service = SERVICES.find((s) => s.id === activeBooking.service)
        const worker  = WORKERS.find((w) => w.id === activeBooking.workerId)
        const cfg     = STATUS_CONFIG[activeBooking.status]
        return (
          <Link href={`/customer/bookings/${activeBooking.id}`}>
            <div
              className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer transition-all hover:scale-[1.01]"
              style={{
                background: "linear-gradient(135deg, #0D5230, #1A9458, #2EB374)",
                borderRadius: "var(--radius-2xl)",
                boxShadow: "0 8px 28px rgba(26,148,88,0.3)",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  {ICON_MAP[service?.icon ?? "droplets"]}
                </div>
                <div>
                  <p className="text-xs font-bold text-white/70 uppercase tracking-wider">{cfg.label}</p>
                  <p className="font-bold text-white">{service?.name}</p>
                  <p className="text-xs" style={{ color: "#9FE3BF" }}>
                    {worker?.name} · {activeBooking.slot.startTime}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-white shrink-0" />
            </div>
          </Link>
        )
      })()}

      {/* ── Quick stats ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Bookings", value: MOCK_BOOKINGS.length },
          { label: "Upcoming",       value: MOCK_BOOKINGS.filter((b) => ["confirmed","assigned","en_route"].includes(b.status)).length },
          { label: "Completed",      value: MOCK_BOOKINGS.filter((b) => b.status === "completed").length },
        ].map((stat) => (
          <div key={stat.label}
            className="flex flex-col items-center justify-center p-4 text-center"
            style={{
              backgroundColor: "var(--color-neutral-0)",
              border: "1.5px solid var(--color-border-default)",
              borderRadius: "var(--radius-xl)",
              boxShadow: "var(--shadow-xs)",
            }}>
            <p className="text-2xl font-bold" style={{ color: "var(--color-brand-600)" }}>{stat.value}</p>
            <p className="text-xs mt-1" style={{ color: "var(--color-text-secondary)" }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── Book a service ─────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
            Our Services
          </h2>
          <Link href="/customer/services" className="text-sm font-semibold" style={{ color: "var(--color-brand-600)" }}>
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SERVICES.map((s) => (
            <Link key={s.id} href={`/customer/services/${s.id}`}>
              <div
                className="flex flex-col items-center p-4 text-center cursor-pointer transition-all hover:scale-[1.03]"
                style={{
                  backgroundColor: "var(--color-neutral-0)",
                  border: "1.5px solid var(--color-border-default)",
                  borderRadius: "var(--radius-xl)",
                  boxShadow: "var(--shadow-xs)",
                }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: "linear-gradient(135deg, #EDFAF2, #D0F2DF)", color: "var(--color-brand-600)" }}>
                  {ICON_MAP[s.icon]}
                </div>
                <p className="text-xs font-bold" style={{ color: "var(--color-text-primary)" }}>{s.name}</p>
                <p className="text-[11px] mt-1" style={{ color: "var(--color-brand-600)" }}>
                  from {formatINR(s.priceFrom)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Recent bookings ────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
            Recent Bookings
          </h2>
          <Link href="/customer/bookings" className="text-sm font-semibold" style={{ color: "var(--color-brand-600)" }}>
            See all
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <EmptyState
            icon={<CalendarDays className="w-10 h-10" />}
            title="No bookings yet"
            description="Book your first home service to get started."
            action={<Link href="/customer/services"><Button variant="primary" size="sm">Browse Services</Button></Link>}
          />
        ) : (
          <div className="space-y-3">
            {recentBookings.map((b) => {
              const service = SERVICES.find((s) => s.id === b.service)
              const worker  = WORKERS.find((w) => w.id === b.workerId)
              const cfg     = STATUS_CONFIG[b.status]
              return (
                <Link key={b.id} href={`/customer/bookings/${b.id}`}>
                  <div
                    className="flex items-center justify-between gap-4 px-4 py-4 cursor-pointer transition-all hover:bg-[var(--color-neutral-50)]"
                    style={{
                      backgroundColor: "var(--color-neutral-0)",
                      border: "1.5px solid var(--color-border-default)",
                      borderRadius: "var(--radius-xl)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: "linear-gradient(135deg, #EDFAF2, #D0F2DF)", color: "var(--color-brand-600)" }}>
                        {ICON_MAP[service?.icon ?? "droplets"]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>{service?.name}</p>
                        <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                          {b.slot.date} · {b.slot.startTime} · {worker?.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={cfg.color} badgeStyle="soft" size="sm">
                        {cfg.label}
                      </Badge>
                      <ArrowRight className="w-4 h-4" style={{ color: "var(--color-text-secondary)" }} />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
