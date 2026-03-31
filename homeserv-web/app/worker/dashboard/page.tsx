"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, IndianRupee, Clock, CheckCircle2, TrendingUp, Droplets, Grid3x3, Layers, Zap, CalendarCheck } from "lucide-react"
import { Button, Badge, Avatar } from "@/design-system"
import { MOCK_BOOKINGS, MOCK_EARNINGS, SERVICES, CUSTOMERS, WORKERS } from "@/lib/mock-data"
import { formatINR } from "@/lib/utils"

const ICON_MAP: Record<string, React.ReactNode> = {
  droplets:   <Droplets className="w-5 h-5" />,
  "grid-3x3": <Grid3x3 className="w-5 h-5" />,
  layers:     <Layers className="w-5 h-5" />,
  zap:        <Zap className="w-5 h-5" />,
}

export default function WorkerDashboard() {
  const worker = WORKERS[0]

  // Jobs assigned to this worker
  const myJobs = [...MOCK_BOOKINGS].filter((b) => b.workerId === worker.id)
  const activeJob = myJobs.find((b) => b.status === "en_route" || b.status === "in_progress")

  const totalEarned  = MOCK_EARNINGS.reduce((a, e) => a + e.amount, 0)
  const thisMonthEarned = MOCK_EARNINGS.filter((e) => e.date.includes("Apr")).reduce((a, e) => a + e.amount, 0)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 lg:py-8 space-y-6 lg:space-y-8">
      {/* Header — desktop only */}
      <div className="hidden lg:flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar name={worker.name} size="lg" status="online" />
          <div>
            <p className="text-xs font-medium mb-0.5" style={{ color: "var(--color-text-secondary)" }}>Good morning,</p>
            <h1 className="text-xl font-bold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
              {worker.name}
            </h1>
          </div>
        </div>
        <Badge variant="success" badgeStyle="soft" dot>Available</Badge>
      </div>

      {/* Active job banner */}
      {activeJob && (() => {
        const service  = SERVICES.find((s) => s.id === activeJob.service)
        const customer = CUSTOMERS.find((c) => c.id === activeJob.customerId)
        return (
          <Link href={`/worker/jobs/${activeJob.id}`}>
            <div
              className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer transition-all hover:scale-[1.01]"
              style={{
                background: "linear-gradient(135deg, #07361F, #1A9458, #2EB374)",
                borderRadius: "var(--radius-2xl)",
                boxShadow: "0 8px 28px rgba(26,148,88,0.3)",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  {ICON_MAP[service?.icon ?? "droplets"]}
                </div>
                <div>
                  <p className="text-xs font-bold text-white/70 uppercase tracking-wider">Active Job</p>
                  <p className="font-bold text-white">{service?.name}</p>
                  <p className="text-xs" style={{ color: "#9FE3BF" }}>{customer?.name} · {activeJob.slot.startTime}</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-white shrink-0" />
            </div>
          </Link>
        )
      })()}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: <IndianRupee className="w-5 h-5" />, label: "Total Earned",  value: formatINR(totalEarned),      color: "var(--color-brand-600)" },
          { icon: <TrendingUp  className="w-5 h-5" />, label: "This Month",    value: formatINR(thisMonthEarned),  color: "#B45309" },
          { icon: <CheckCircle2 className="w-5 h-5" />,label: "Jobs Done",     value: String(worker.jobsCompleted), color: "#1D4ED8" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-4 text-center"
            style={{
              backgroundColor: "var(--color-neutral-0)",
              border: "1.5px solid var(--color-border-default)",
              borderRadius: "var(--radius-xl)",
              boxShadow: "var(--shadow-xs)",
            }}
          >
            <span style={{ color: stat.color }}>{stat.icon}</span>
            <p className="text-lg font-bold mt-1" style={{ color: "var(--color-text-primary)" }}>{stat.value}</p>
            <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Today's jobs */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
            Today&apos;s Jobs
          </h2>
          <Link href="/worker/jobs" className="text-sm font-semibold" style={{ color: "var(--color-brand-600)" }}>
            All jobs
          </Link>
        </div>

        {myJobs.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <CalendarCheck className="w-10 h-10 mb-3" style={{ color: "var(--color-neutral-300)" }} />
            <p className="font-semibold" style={{ color: "var(--color-text-primary)" }}>No jobs today</p>
            <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
              Update your availability to get more bookings
            </p>
            <Link href="/worker/availability" className="mt-4">
              <Button variant="outline" size="sm">Set Availability</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {myJobs.map((b) => {
              const service  = SERVICES.find((s) => s.id === b.service)
              const customer = CUSTOMERS.find((c) => c.id === b.customerId)
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
                          {customer?.name} · {b.slot.startTime} · {b.address}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        variant={b.status === "completed" ? "success" : b.status === "en_route" ? "warning" : "info"}
                        badgeStyle="soft" size="sm"
                      >
                        {b.status.replace("_", " ")}
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

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/worker/availability">
          <div className="flex flex-col items-center gap-2 p-5 text-center cursor-pointer transition-all hover:scale-[1.02]"
            style={{
              backgroundColor: "var(--color-neutral-0)",
              border: "1.5px solid var(--color-border-default)",
              borderRadius: "var(--radius-xl)",
            }}>
            <CalendarCheck className="w-7 h-7" style={{ color: "var(--color-brand-500)" }} />
            <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>Set Availability</p>
          </div>
        </Link>
        <Link href="/worker/earnings">
          <div className="flex flex-col items-center gap-2 p-5 text-center cursor-pointer transition-all hover:scale-[1.02]"
            style={{
              backgroundColor: "var(--color-neutral-0)",
              border: "1.5px solid var(--color-border-default)",
              borderRadius: "var(--radius-xl)",
            }}>
            <IndianRupee className="w-7 h-7" style={{ color: "var(--color-brand-500)" }} />
            <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>Withdraw Earnings</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
