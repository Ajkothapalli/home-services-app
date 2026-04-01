"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowRight, CalendarDays, Clock, Bell, ChevronRight,
  CheckCircle2, Zap, CreditCard, User, Wrench, MapPin,
  Search, Star, Layers2, Phone, IndianRupee, Navigation,
} from "lucide-react"
import { Button, Badge, Rating } from "@/design-system"
import { SERVICES, MOCK_BOOKINGS, WORKERS } from "@/lib/mock-data"
import { formatINR } from "@/lib/utils"

const SERVICE_IMAGES: Record<string, string> = {
  "seepage":  "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&q=80",
  "tiling":   "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
  "grouting": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  "welding":  "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80",
}
const FALLBACK_IMAGE = SERVICE_IMAGES["seepage"]

const STATUS_CONFIG = {
  en_route:    { label: "On the way",  color: "warning" as const },
  in_progress: { label: "In Progress", color: "info"    as const },
  upcoming:    { label: "Upcoming",    color: "info"    as const },
  completed:   { label: "Completed",   color: "success" as const },
  cancelled:   { label: "Cancelled",   color: "error"   as const },
  confirmed:   { label: "Confirmed",   color: "success" as const },
  pending:     { label: "Pending",     color: "neutral" as const },
  assigned:    { label: "Assigned",    color: "success" as const },
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 17) return "Good afternoon"
  return "Good evening"
}

function formatBookingDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYOUT A — Bento / dark-hero style (current)
// ─────────────────────────────────────────────────────────────────────────────
function LayoutA() {
  const customerName   = "Priya"
  const activeBooking  = MOCK_BOOKINGS.find((b) => b.status === "en_route" || b.status === "in_progress")
  const recentBookings = MOCK_BOOKINGS.slice(0, 3)
  const upcomingCount  = MOCK_BOOKINGS.filter((b) => ["confirmed", "assigned", "en_route"].includes(b.status)).length
  const completedCount = MOCK_BOOKINGS.filter((b) => b.status === "completed").length

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Hero greeting */}
      <div className="relative overflow-hidden px-5 sm:px-8 pt-8 pb-7 mb-6"
        style={{ background: "linear-gradient(135deg, #052E16 0%, #065F46 55%, #059669 100%)" }}>
        <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, white, transparent 70%)" }} />
        <div className="relative flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium mb-1" style={{ color: "#A7F3D0" }}>{getGreeting()} 👋</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>{customerName}</h1>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                style={{ backgroundColor: "rgba(255,255,255,0.12)", color: "#D1FAE5" }}>
                <CalendarDays className="w-3 h-3" />{MOCK_BOOKINGS.length} bookings
              </span>
              {upcomingCount > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: "rgba(255,255,255,0.12)", color: "#D1FAE5" }}>
                  <Clock className="w-3 h-3" />{upcomingCount} upcoming
                </span>
              )}
              {completedCount > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: "rgba(255,255,255,0.12)", color: "#D1FAE5" }}>
                  <CheckCircle2 className="w-3 h-3" />{completedCount} done
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button className="relative w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }}>
              <Bell className="w-5 h-5 text-white" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#F97316]" />
            </button>
            <Link href="/customer/services" className="hidden sm:block">
              <Button variant="primary" size="sm" iconRight={<ArrowRight className="w-4 h-4" />}>Book Now</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 space-y-8">
        {/* Active booking */}
        {activeBooking && (() => {
          const service = SERVICES.find((s) => s.id === activeBooking.service)
          const worker  = WORKERS.find((w) => w.id === activeBooking.workerId)
          const imgSrc  = SERVICE_IMAGES[activeBooking.service] ?? FALLBACK_IMAGE
          return (
            <Link href={`/customer/bookings/${activeBooking.id}`} className="block">
              <div className="relative overflow-hidden rounded-2xl cursor-pointer"
                style={{ boxShadow: "0 8px 32px rgba(4,46,22,0.3)", transition: "transform 300ms ease" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.01)" }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)" }}>
                <img src={imgSrc} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0"
                  style={{ background: "linear-gradient(105deg, rgba(4,20,10,0.92) 0%, rgba(4,60,30,0.75) 60%, rgba(4,60,30,0.5) 100%)" }} />
                <div className="relative px-6 py-5 flex items-center justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest mb-2 px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#6EE7B7" }}>
                      <Clock className="w-3 h-3" /> On the way
                    </span>
                    <p className="text-xl font-bold text-white mb-0.5" style={{ fontFamily: "var(--font-sora)" }}>{service?.name}</p>
                    <p className="text-sm" style={{ color: "#A7F3D0" }}>{worker?.name} · Today at {activeBooking.slot.startTime}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <MapPin className="w-3.5 h-3.5" style={{ color: "#6EE7B7" }} />
                      <p className="text-xs truncate" style={{ color: "#A7F3D0" }}>{activeBooking.address}</p>
                    </div>
                  </div>
                  <div className="shrink-0 w-11 h-11 rounded-full bg-white/20 flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            </Link>
          )
        })()}

        {/* Quick book */}
        {!activeBooking && (
          <Link href="/customer/services" className="block">
            <div className="relative overflow-hidden rounded-2xl px-6 py-5 flex items-center justify-between gap-4 cursor-pointer"
              style={{ background: "linear-gradient(120deg,#F0FDF4 0%,#DCFCE7 100%)", border: "1.5px solid rgba(46,179,116,0.2)", transition: "box-shadow 300ms ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 28px rgba(46,179,116,0.2)" }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none" }}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4" style={{ color: "#2EB374" }} />
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#2EB374" }}>Quick book</span>
                </div>
                <p className="text-base font-bold" style={{ color: "#0D1B12", fontFamily: "var(--font-sora)" }}>Need something fixed?</p>
                <p className="text-sm mt-0.5" style={{ color: "#4B7A5E" }}>Verified pros available today · under 2 min to book</p>
              </div>
              <div className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#0D5230,#2EB374)" }}>
                <ArrowRight className="w-5 h-5 text-white" />
              </div>
            </div>
          </Link>
        )}

        {/* Quick links */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { href: "/customer/bookings", icon: <CalendarDays className="w-5 h-5" />, label: "Bookings", bg: "linear-gradient(135deg,#EFF6FF,#BFDBFE)", color: "#1D4ED8" },
            { href: "/customer/payments", icon: <CreditCard   className="w-5 h-5" />, label: "Payments", bg: "linear-gradient(135deg,#FEF3C7,#FDE68A)", color: "#92400E" },
            { href: "/customer/services", icon: <Wrench       className="w-5 h-5" />, label: "Services", bg: "linear-gradient(135deg,#EDFAF2,#D0F2DF)", color: "#065F46" },
            { href: "/customer/profile",  icon: <User         className="w-5 h-5" />, label: "Profile",  bg: "linear-gradient(135deg,#FDF4FF,#E9D5FF)", color: "#6B21A8" },
          ].map((item) => (
            <Link key={item.href} href={item.href}>
              <div className="flex flex-col items-center gap-2 py-4 rounded-2xl cursor-pointer text-center"
                style={{ background: item.bg, border: "1.5px solid rgba(0,0,0,0.05)", transition: "transform 250ms ease, box-shadow 250ms ease" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.1)" }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none" }}>
                <span style={{ color: item.color }}>{item.icon}</span>
                <p className="text-xs font-semibold" style={{ color: item.color }}>{item.label}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Services bento */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>Our Services</h2>
            <Link href="/customer/services" className="flex items-center gap-1 text-sm font-semibold" style={{ color: "var(--color-brand-600)" }}>
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {SERVICES.map((s, i) => {
              const imgSrc  = SERVICE_IMAGES[s.id] ?? FALLBACK_IMAGE
              const isWide  = i === 0 || i === 3
              const hClass  = isWide ? "h-56 sm:h-64 lg:h-72" : "h-52 sm:h-60"
              return (
                <Link key={s.id} href={`/customer/services/${s.id}`}
                  className={`block ${isWide ? "col-span-2 lg:col-span-2" : "col-span-1"}`}>
                  <div className={`relative ${hClass} rounded-2xl cursor-pointer`}
                    style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.12)", transition: "transform 500ms cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 500ms cubic-bezier(0.25,0.46,0.45,0.94)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)"
                      e.currentTarget.style.boxShadow = "0 18px 44px rgba(0,0,0,0.22)"
                      const img = e.currentTarget.querySelector<HTMLImageElement>("img")
                      if (img) img.style.transform = "scale(1.08)"
                      const arrow = e.currentTarget.querySelector<HTMLDivElement>("[data-arrow]")
                      if (arrow) arrow.style.opacity = "1"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)"
                      e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.12)"
                      const img = e.currentTarget.querySelector<HTMLImageElement>("img")
                      if (img) img.style.transform = "scale(1)"
                      const arrow = e.currentTarget.querySelector<HTMLDivElement>("[data-arrow]")
                      if (arrow) arrow.style.opacity = "0"
                    }}>
                    <div className="absolute inset-0 overflow-hidden rounded-2xl">
                      <img src={imgSrc} alt={s.name} className="absolute inset-0 w-full h-full object-cover"
                        style={{ transform: "scale(1)", transition: "transform 500ms cubic-bezier(0.25,0.46,0.45,0.94)", willChange: "transform" }} />
                      <div className="absolute inset-0"
                        style={{ background: "linear-gradient(to top, rgba(4,14,8,0.9) 0%, rgba(4,14,8,0.25) 55%, transparent 100%)" }} />
                    </div>
                    {s.badge && (
                      <span className="absolute top-3.5 left-3.5 z-10 text-[10px] font-bold px-2.5 py-1 rounded-full"
                        style={{ background: "linear-gradient(135deg,#1A9458,#2EB374)", color: "#fff" }}>{s.badge}</span>
                    )}
                    <div data-arrow className="absolute top-3.5 right-3.5 z-10 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", opacity: 0, transition: "opacity 300ms ease" }}>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 z-10 p-4 sm:p-5">
                      {isWide && <p className="text-xs mb-1.5" style={{ color: "#86EFAC" }}>⭐ {s.rating} · {s.duration}</p>}
                      <div className="flex items-end justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className={`font-bold text-white leading-tight ${isWide ? "text-xl sm:text-2xl" : "text-base sm:text-lg"}`}
                            style={{ fontFamily: "var(--font-sora)" }}>{s.name}</h3>
                          {isWide && <p className="text-xs mt-1 line-clamp-2" style={{ color: "#D1FAE5" }}>{s.description}</p>}
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-[10px] font-medium mb-0.5" style={{ color: "#A7F3D0" }}>from</p>
                          <p className={`font-bold text-white ${isWide ? "text-lg" : "text-base"}`}>{formatINR(s.priceFrom)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Recent bookings */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>Recent Bookings</h2>
            <Link href="/customer/bookings" className="flex items-center gap-1 text-sm font-semibold" style={{ color: "var(--color-brand-600)" }}>
              See all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {MOCK_BOOKINGS.slice(0, 3).length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-14 rounded-2xl text-center"
              style={{ border: "1.5px dashed var(--color-border-default)" }}>
              <CalendarDays className="w-8 h-8" style={{ color: "var(--color-neutral-400)" }} />
              <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>No bookings yet</p>
              <Link href="/customer/services"><Button variant="primary" size="sm">Browse Services</Button></Link>
            </div>
          ) : (
            <div className="space-y-3">
              {MOCK_BOOKINGS.slice(0, 3).map((b) => {
                const service = SERVICES.find((s) => s.id === b.service)
                const worker  = WORKERS.find((w) => w.id === b.workerId)
                const cfg     = STATUS_CONFIG[b.status]
                const imgSrc  = SERVICE_IMAGES[b.service] ?? FALLBACK_IMAGE
                return (
                  <Link key={b.id} href={`/customer/bookings/${b.id}`} className="block">
                    <div className="flex items-center gap-4 p-4"
                      style={{ backgroundColor: "#fff", border: "1.5px solid var(--color-border-default)", borderRadius: "var(--radius-2xl)", boxShadow: "0 1px 8px rgba(13,82,48,0.06)", transition: "box-shadow 200ms ease, border-color 200ms ease" }}
                      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(13,82,48,0.14)"; e.currentTarget.style.borderColor = "var(--color-brand-200)" }}
                      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 8px rgba(13,82,48,0.06)"; e.currentTarget.style.borderColor = "var(--color-border-default)" }}>
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                        <img src={imgSrc} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold truncate mb-0.5" style={{ color: "var(--color-text-primary)" }}>{service?.name}</p>
                        <p className="text-xs truncate" style={{ color: "var(--color-text-secondary)" }}>
                          {formatBookingDate(b.slot.date)} · {b.slot.startTime} · {worker?.name}
                        </p>
                        <p className="text-xs font-semibold mt-1" style={{ color: "var(--color-brand-600)" }}>{formatINR(b.quote.total)}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <Badge variant={cfg.color} badgeStyle="soft" size="sm">{cfg.label}</Badge>
                        <ChevronRight className="w-4 h-4" style={{ color: "var(--color-neutral-400)" }} />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYOUT B — Clean / card-deck / horizontal-scroll style
// ─────────────────────────────────────────────────────────────────────────────
function LayoutB() {
  const customerName   = "Priya"
  const activeBooking  = MOCK_BOOKINGS.find((b) => b.status === "en_route" || b.status === "in_progress")
  const completedCount = MOCK_BOOKINGS.filter((b) => b.status === "completed").length
  const upcomingCount  = MOCK_BOOKINGS.filter((b) => ["confirmed", "assigned", "en_route"].includes(b.status)).length

  return (
    <div className="max-w-4xl mx-auto pb-20" style={{ backgroundColor: "#F8FAF9" }}>

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-5 sm:px-8 pt-6 pb-4">
        <div>
          <p className="text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>{getGreeting()}</p>
          <h1 className="text-xl font-bold mt-0.5" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
            {customerName} 👋
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative w-10 h-10 rounded-full flex items-center justify-center bg-white"
            style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.08)", border: "1px solid rgba(0,0,0,0.06)" }}>
            <Bell className="w-5 h-5" style={{ color: "var(--color-text-secondary)" }} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#F97316]" />
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center text-white font-bold text-sm"
            style={{ background: "linear-gradient(135deg,#0D5230,#2EB374)" }}>
            {customerName.charAt(0)}
          </div>
        </div>
      </div>

      {/* ── Search bar ── */}
      <div className="px-5 sm:px-8 mb-6">
        <Link href="/customer/services">
          <div className="flex items-center gap-3 px-4 py-3.5 bg-white rounded-2xl cursor-pointer"
            style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.07)", border: "1.5px solid rgba(0,0,0,0.06)" }}>
            <Search className="w-4 h-4 shrink-0" style={{ color: "var(--color-text-secondary)" }} />
            <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>What needs fixing today?</span>
            <span className="ml-auto text-xs font-semibold px-3 py-1 rounded-full"
              style={{ background: "linear-gradient(135deg,#0D5230,#2EB374)", color: "white" }}>Book</span>
          </div>
        </Link>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-3 gap-3 px-5 sm:px-8 mb-6">
        {[
          { label: "Total Bookings", value: String(MOCK_BOOKINGS.length), icon: <CalendarDays className="w-4 h-4" />, color: "#1D4ED8",  bg: "#EFF6FF" },
          { label: "Upcoming",       value: String(upcomingCount),        icon: <Clock        className="w-4 h-4" />, color: "#0D5230",  bg: "#EDFAF2" },
          { label: "Completed",      value: String(completedCount),       icon: <CheckCircle2 className="w-4 h-4" />, color: "#92400E", bg: "#FEF3C7" },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col items-center py-4 px-2 rounded-2xl text-center bg-white"
            style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.06)", border: "1.5px solid rgba(0,0,0,0.04)" }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2"
              style={{ background: stat.bg, color: stat.color }}>
              {stat.icon}
            </div>
            <p className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>{stat.value}</p>
            <p className="text-[10px] font-medium mt-0.5 leading-tight" style={{ color: "var(--color-text-secondary)" }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── Active booking card ── */}
      {activeBooking && (() => {
        const service = SERVICES.find((s) => s.id === activeBooking.service)
        const worker  = WORKERS.find((w) => w.id === activeBooking.workerId)
        const imgSrc  = SERVICE_IMAGES[activeBooking.service] ?? FALLBACK_IMAGE
        return (
          <div className="px-5 sm:px-8 mb-6">
            <Link href={`/customer/bookings/${activeBooking.id}`}>
              <div className="relative overflow-hidden rounded-3xl cursor-pointer"
                style={{ boxShadow: "0 12px 40px rgba(4,46,22,0.25)", transition: "transform 300ms ease" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)" }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)" }}>
                <img src={imgSrc} alt="" className="w-full h-44 object-cover" />
                <div className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(4,20,10,0.95) 0%, rgba(4,20,10,0.4) 50%, transparent 100%)" }} />
                {/* Live pill */}
                <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: "rgba(249,115,22,0.9)", backdropFilter: "blur(8px)" }}>
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span className="text-xs font-bold text-white uppercase tracking-wide">Live · On the way</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-white font-bold text-lg" style={{ fontFamily: "var(--font-sora)" }}>{service?.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
                          {worker?.name.charAt(0)}
                        </div>
                        <p className="text-sm" style={{ color: "#A7F3D0" }}>{worker?.name} · {activeBooking.slot.startTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-4 py-2 rounded-full"
                      style={{ backgroundColor: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}>
                      <Navigation className="w-4 h-4 text-white" />
                      <span className="text-sm font-semibold text-white">Track</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )
      })()}

      {/* ── Services — horizontal scroll cards ── */}
      <div className="mb-8">
        <div className="flex items-center justify-between px-5 sm:px-8 mb-4">
          <h2 className="text-base font-bold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
            Services
          </h2>
          <Link href="/customer/services" className="text-sm font-semibold" style={{ color: "var(--color-brand-600)" }}>
            See all →
          </Link>
        </div>

        {/* Horizontal scroll strip */}
        <div className="flex gap-4 overflow-x-auto px-5 sm:px-8 pb-3"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {SERVICES.map((s) => {
            const imgSrc = SERVICE_IMAGES[s.id] ?? FALLBACK_IMAGE
            return (
              <Link key={s.id} href={`/customer/services/${s.id}`} className="block shrink-0">
                <div className="relative w-52 h-64 rounded-2xl overflow-hidden cursor-pointer"
                  style={{
                    boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                    transition: "transform 400ms cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 400ms ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-6px)"
                    e.currentTarget.style.boxShadow = "0 16px 36px rgba(0,0,0,0.2)"
                    const img = e.currentTarget.querySelector<HTMLImageElement>("img")
                    if (img) img.style.transform = "scale(1.08)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.12)"
                    const img = e.currentTarget.querySelector<HTMLImageElement>("img")
                    if (img) img.style.transform = "scale(1)"
                  }}>
                  <img src={imgSrc} alt={s.name} className="absolute inset-0 w-full h-full object-cover"
                    style={{ transform: "scale(1)", transition: "transform 400ms cubic-bezier(0.25,0.46,0.45,0.94)", willChange: "transform" }} />
                  <div className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgba(4,14,8,0.92) 0%, rgba(4,14,8,0.15) 55%, transparent 100%)" }} />
                  {s.badge && (
                    <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: "linear-gradient(135deg,#1A9458,#2EB374)", color: "#fff" }}>{s.badge}</span>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-base font-bold text-white mb-1" style={{ fontFamily: "var(--font-sora)" }}>{s.name}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-white/80">{s.rating}</span>
                      </div>
                      <span className="text-sm font-bold" style={{ color: "#86EFAC" }}>{formatINR(s.priceFrom)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* ── Recent bookings ── timeline style ── */}
      <div className="px-5 sm:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>Recent Bookings</h2>
          <Link href="/customer/bookings" className="text-sm font-semibold" style={{ color: "var(--color-brand-600)" }}>See all →</Link>
        </div>

        <div className="space-y-3">
          {MOCK_BOOKINGS.slice(0, 4).map((b, idx) => {
            const service = SERVICES.find((s) => s.id === b.service)
            const worker  = WORKERS.find((w) => w.id === b.workerId)
            const cfg     = STATUS_CONFIG[b.status]
            const imgSrc  = SERVICE_IMAGES[b.service] ?? FALLBACK_IMAGE
            const accentColors = ["#2EB374", "#3B82F6", "#F59E0B", "#8B5CF6"]
            const accent = accentColors[idx % accentColors.length]
            return (
              <Link key={b.id} href={`/customer/bookings/${b.id}`} className="block">
                <div className="flex items-center gap-4 bg-white rounded-2xl overflow-hidden cursor-pointer"
                  style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1.5px solid rgba(0,0,0,0.05)", transition: "box-shadow 200ms ease, transform 200ms ease" }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.12)"; e.currentTarget.style.transform = "translateY(-1px)" }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "translateY(0)" }}>
                  {/* Left accent bar */}
                  <div className="w-1 self-stretch shrink-0" style={{ backgroundColor: accent }} />
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 my-3">
                    <img src={imgSrc} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 py-3">
                    <p className="font-bold truncate text-sm" style={{ color: "var(--color-text-primary)" }}>{service?.name}</p>
                    <p className="text-xs truncate mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                      {formatBookingDate(b.slot.date)} · {b.slot.startTime}
                    </p>
                    <p className="text-xs font-semibold mt-0.5" style={{ color: accent }}>{formatINR(b.quote.total)}</p>
                  </div>
                  <div className="pr-4 flex flex-col items-end gap-2">
                    <Badge variant={cfg.color} badgeStyle="soft" size="sm">{cfg.label}</Badge>
                    <ChevronRight className="w-4 h-4" style={{ color: "var(--color-neutral-400)" }} />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Page — toggle between layouts
// ─────────────────────────────────────────────────────────────────────────────
export default function CustomerDashboard() {
  const [layout, setLayout] = React.useState<"A" | "B">("A")

  return (
    <>
      {/* ── Layout switcher tab (remove when done choosing) ── */}
      <div className="sticky top-0 z-40 flex justify-center py-2.5 px-4"
        style={{ backgroundColor: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <div className="flex gap-1 p-1 rounded-full"
          style={{ backgroundColor: "#F3F4F6" }}>
          {(["A", "B"] as const).map((l) => (
            <button key={l} onClick={() => setLayout(l)}
              className="px-5 py-1.5 rounded-full text-sm font-semibold transition-all"
              style={{
                backgroundColor: layout === l ? "white" : "transparent",
                color: layout === l ? "#0D5230" : "#6B7280",
                boxShadow: layout === l ? "0 1px 6px rgba(0,0,0,0.1)" : "none",
              }}>
              Layout {l}
            </button>
          ))}
        </div>
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-medium px-2 py-1 rounded"
          style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}>
          A/B test — remove tab when done
        </span>
      </div>

      {layout === "A" ? <LayoutA /> : <LayoutB />}
    </>
  )
}
