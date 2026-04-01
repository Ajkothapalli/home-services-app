"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, IndianRupee, Clock, CheckCircle2, TrendingUp, CalendarCheck, MapPin, Navigation } from "lucide-react"
import { Button, Badge, Avatar } from "@/design-system"
import { MOCK_BOOKINGS, MOCK_EARNINGS, SERVICES, CUSTOMERS, WORKERS } from "@/lib/mock-data"
import { formatINR } from "@/lib/utils"

const SERVICE_IMAGES: Record<string, string> = {
  "seepage":  "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&q=80",
  "tiling":   "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80",
  "grouting": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  "welding":  "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=80",
}

export default function WorkerDashboard() {
  const worker = WORKERS[0]
  const myJobs = [...MOCK_BOOKINGS].filter((b) => b.workerId === worker.id)
  const activeJob = myJobs.find((b) => b.status === "en_route" || b.status === "in_progress")

  const totalEarned     = MOCK_EARNINGS.reduce((a, e) => a + e.amount, 0)
  const thisMonthEarned = MOCK_EARNINGS.filter((e) => e.date.includes("Apr")).reduce((a, e) => a + e.amount, 0)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 lg:py-8 space-y-6 lg:space-y-8">
      {/* Desktop header */}
      <div className="hidden lg:flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white"
              style={{ background: "linear-gradient(135deg, #0D5230, #2EB374)" }}>
              {worker.name.charAt(0)}
            </div>
            <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-400 border-2 border-white" />
          </div>
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
        const img      = SERVICE_IMAGES[activeJob.service]
        return (
          <Link href={`/worker/jobs/${activeJob.id}`}>
            <div
              className="relative overflow-hidden cursor-pointer"
              style={{
                borderRadius: "var(--radius-2xl)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                transition: "transform 300ms ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.01)" }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)" }}
            >
              {img && (
                <div className="absolute inset-0">
                  <img src={img} alt={service?.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(7,54,31,0.92), rgba(26,148,88,0.85))" }} />
                </div>
              )}
              {!img && (
                <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #07361F, #1A9458, #2EB374)" }} />
              )}
              <div className="relative flex items-center justify-between gap-4 px-5 py-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <Navigation className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white/70 uppercase tracking-wider">Active Job</p>
                    <p className="font-bold text-lg text-white">{service?.name}</p>
                    <p className="text-sm" style={{ color: "#9FE3BF" }}>{customer?.name} · {activeJob.slot.startTime}</p>
                    <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: "rgba(255,255,255,0.7)" }}>
                      <MapPin className="w-3 h-3" />{activeJob.address}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs text-white/70">View</span>
                </div>
              </div>
            </div>
          </Link>
        )
      })()}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: <IndianRupee className="w-5 h-5" />, label: "Total Earned",  value: formatINR(totalEarned),       color: "var(--color-brand-600)", bg: "linear-gradient(135deg, #EDFAF2, #D0F2DF)" },
          { icon: <TrendingUp  className="w-5 h-5" />, label: "This Month",    value: formatINR(thisMonthEarned),   color: "#B45309",                 bg: "linear-gradient(135deg, #FFFBEB, #FDE68A)" },
          { icon: <CheckCircle2 className="w-5 h-5" />,label: "Jobs Done",     value: String(worker.jobsCompleted), color: "#1D4ED8",                 bg: "linear-gradient(135deg, #EFF6FF, #BFDBFE)" },
        ].map((stat) => (
          <div key={stat.label} className="p-4 text-center"
            style={{ background: stat.bg, border: "1.5px solid var(--color-border-default)", borderRadius: "var(--radius-xl)" }}>
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
              const img      = SERVICE_IMAGES[b.service]
              return (
                <Link key={b.id} href={`/worker/jobs/${b.id}`}>
                  <div
                    className="flex items-center gap-4 px-4 py-4 cursor-pointer overflow-hidden"
                    style={{
                      backgroundColor: "var(--color-neutral-0)",
                      border: "1.5px solid var(--color-border-default)",
                      borderRadius: "var(--radius-xl)",
                      transition: "box-shadow 300ms ease, border-color 300ms ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.1)"
                      e.currentTarget.style.borderColor = "var(--color-brand-200)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "none"
                      e.currentTarget.style.borderColor = "var(--color-border-default)"
                    }}
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                      {img ? (
                        <img src={img} alt={service?.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full" style={{ background: "linear-gradient(135deg, #EDFAF2, #D0F2DF)" }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate" style={{ color: "var(--color-text-primary)" }}>{service?.name}</p>
                      <p className="text-xs truncate" style={{ color: "var(--color-text-secondary)" }}>
                        {customer?.name} · {b.slot.startTime}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 shrink-0" style={{ color: "var(--color-text-secondary)" }} />
                        <p className="text-xs truncate" style={{ color: "var(--color-text-secondary)" }}>{b.address}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
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
          <div
            className="flex items-center gap-4 p-5 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #EDFAF2, #D0F2DF)",
              border: "1.5px solid var(--color-brand-200)",
              borderRadius: "var(--radius-xl)",
              transition: "transform 300ms ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)" }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)" }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "var(--color-brand-100)" }}>
              <CalendarCheck className="w-6 h-6" style={{ color: "var(--color-brand-600)" }} />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: "var(--color-brand-900)" }}>Set Availability</p>
              <p className="text-xs" style={{ color: "var(--color-brand-700)" }}>Update your schedule</p>
            </div>
          </div>
        </Link>
        <Link href="/worker/earnings">
          <div
            className="flex items-center gap-4 p-5 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #FFFBEB, #FDE68A)",
              border: "1.5px solid #FDE68A",
              borderRadius: "var(--radius-xl)",
              transition: "transform 300ms ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)" }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)" }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "#FDE68A" }}>
              <IndianRupee className="w-6 h-6" style={{ color: "#92400E" }} />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: "#78350F" }}>Withdraw Earnings</p>
              <p className="text-xs" style={{ color: "#92400E" }}>1–2 business days</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
