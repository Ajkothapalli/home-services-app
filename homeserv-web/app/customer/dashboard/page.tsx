"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowRight, CalendarDays, Clock, Bell, ChevronRight,
  CheckCircle2, Search, Star, MapPin, Navigation,
  CreditCard, User, Wrench, Shield, Zap,
} from "lucide-react"
import { Button, Badge } from "@/design-system"
import { SERVICES, MOCK_BOOKINGS, WORKERS } from "@/lib/mock-data"
import { formatINR } from "@/lib/utils"

const SERVICE_IMAGES: Record<string, string> = {
  "seepage":  "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&q=80",
  "tiling":   "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
  "grouting": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  "welding":  "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80",
}
const FALLBACK_IMAGE = SERVICE_IMAGES["seepage"]

// Social proof data per service
const SERVICE_SOCIAL: Record<string, { pros: number; jobs: string }> = {
  "seepage":  { pros: 48,  jobs: "3.2k+" },
  "tiling":   { pros: 62,  jobs: "4.8k+" },
  "grouting": { pros: 35,  jobs: "2.1k+" },
  "welding":  { pros: 29,  jobs: "1.7k+" },
}

// Worker avatar thumbnails for social proof
const WORKER_AVATARS = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80",
  "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=80&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80",
]

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

export default function CustomerDashboard() {
  const customerName   = "Priya"
  const activeBooking  = MOCK_BOOKINGS.find((b) => b.status === "en_route" || b.status === "in_progress")
  const completedCount = MOCK_BOOKINGS.filter((b) => b.status === "completed").length
  const upcomingCount  = MOCK_BOOKINGS.filter((b) => ["confirmed", "assigned", "en_route"].includes(b.status)).length
  const [query, setQuery] = React.useState("")

  const filteredServices = SERVICES.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.description.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="max-w-4xl mx-auto pb-24">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-5 sm:px-8 pt-6 pb-5">
        <div>
          <p className="text-xs font-medium" style={{ color: "#4B7A5E" }}>{getGreeting()}</p>
          <h1 className="text-xl font-bold mt-0.5" style={{ color: "#0D1B12", fontFamily: "var(--font-sora)" }}>
            {customerName} 👋
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="relative w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "rgba(255,255,255,0.8)", boxShadow: "0 1px 8px rgba(0,0,0,0.1)", border: "1px solid rgba(255,255,255,0.9)" }}
          >
            <Bell className="w-5 h-5" style={{ color: "#0D5230" }} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#F97316]" />
          </button>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
            style={{ background: "linear-gradient(135deg,#0D5230,#2EB374)", boxShadow: "0 2px 10px rgba(13,82,48,0.4)" }}
          >
            {customerName.charAt(0)}
          </div>
        </div>
      </div>


      {/* ── Search bar ── */}
      <div className="px-5 sm:px-8 mb-5 relative">
        <div
          className="flex items-center gap-3 px-4 py-3.5"
          style={{
            backgroundColor: "white",
            boxShadow: query ? "0 6px 24px rgba(13,82,48,0.14)" : "0 2px 16px rgba(13,82,48,0.08)",
            border: `1.5px solid ${query ? "rgba(46,179,116,0.4)" : "rgba(46,179,116,0.12)"}`,
            borderRadius: query && filteredServices.length > 0 ? "1rem 1rem 0 0" : "1rem",
            transition: "box-shadow 250ms ease, border-color 250ms ease",
          }}
        >
          <Search className="w-4 h-4 shrink-0" style={{ color: "#2EB374" }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services…"
            className="flex-1 text-sm bg-transparent outline-none"
            style={{ color: "#0D1B12" }}
          />
          {query ? (
            <button onClick={() => setQuery("")} className="text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{ background: "#F3F4F6", color: "#6B7280" }}>
              Clear
            </button>
          ) : (
            <span className="text-xs font-bold px-3 py-1.5 rounded-full text-white shrink-0"
              style={{ background: "linear-gradient(135deg,#0D5230,#2EB374)" }}>
              Book Now
            </span>
          )}
        </div>

        {/* Dropdown suggestions */}
        {query && filteredServices.length > 0 && (
          <div className="absolute left-5 right-5 sm:left-8 sm:right-8 z-50 overflow-hidden"
            style={{
              backgroundColor: "white",
              border: "1.5px solid rgba(46,179,116,0.4)",
              borderTop: "none",
              borderRadius: "0 0 1rem 1rem",
              boxShadow: "0 16px 40px rgba(13,82,48,0.16)",
            }}>
            {filteredServices.map((s, i) => {
              const img = SERVICE_IMAGES[s.id] ?? FALLBACK_IMAGE
              return (
                <Link key={s.id} href={`/customer/services/${s.id}`} onClick={() => setQuery("")}>
                  <div
                    className="flex items-center gap-4 px-4 py-3 cursor-pointer transition-colors hover:bg-[#F0FDF4]"
                    style={{ borderTop: i > 0 ? "1px solid rgba(46,179,116,0.08)" : "none" }}
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                      <img src={img} alt={s.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm" style={{ color: "#0D1B12" }}>{s.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs" style={{ color: "#6B7280" }}>{s.rating}</span>
                        </div>
                        <span style={{ color: "#D1D5DB" }}>·</span>
                        <span className="text-xs" style={{ color: "#6B7280" }}>{s.duration}</span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold" style={{ color: "#2EB374" }}>{formatINR(s.priceFrom)}</p>
                      <p className="text-[10px]" style={{ color: "#9CA3AF" }}>onwards</p>
                    </div>
                    <ArrowRight className="w-4 h-4 shrink-0" style={{ color: "#D1D5DB" }} />
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* No results */}
        {query && filteredServices.length === 0 && (
          <div className="absolute left-5 right-5 sm:left-8 sm:right-8 z-50 px-4 py-6 text-center"
            style={{
              backgroundColor: "white",
              border: "1.5px solid rgba(46,179,116,0.4)",
              borderTop: "none",
              borderRadius: "0 0 1rem 1rem",
              boxShadow: "0 16px 40px rgba(13,82,48,0.16)",
            }}>
            <p className="text-sm font-semibold" style={{ color: "#374151" }}>No services found</p>
            <p className="text-xs mt-1" style={{ color: "#9CA3AF" }}>Try &ldquo;seepage&rdquo;, &ldquo;tiling&rdquo; or &ldquo;welding&rdquo;</p>
          </div>
        )}
      </div>

      {/* ── Trust strip ── */}
      <div className="px-5 sm:px-8 mb-6">
        <div
          className="flex items-center justify-between gap-3 px-1 py-1 overflow-x-auto"
        >
          {[
            { icon: <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />, value: "4.8★", label: "Avg Rating" },
            { icon: <Shield className="w-3.5 h-3.5" style={{ color: "#2EB374" }} />, value: "500+", label: "Verified Pros" },
            { icon: <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#2EB374" }} />, value: "12k+", label: "Jobs Done" },
            { icon: <Zap className="w-3.5 h-3.5" style={{ color: "#F59E0B" }} />, value: "< 2h", label: "Response" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-1.5 shrink-0">
              {s.icon}
              <span className="text-xs font-bold" style={{ color: "#0D1B12" }}>{s.value}</span>
              <span className="text-xs" style={{ color: "#6B7280" }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-3 gap-3 px-5 sm:px-8 mb-6">
        {[
          { label: "Total",     value: String(MOCK_BOOKINGS.length), icon: <CalendarDays className="w-4 h-4" />, color: "#1D4ED8",  bg: "linear-gradient(135deg,#EFF6FF,#BFDBFE)" },
          { label: "Upcoming",  value: String(upcomingCount),        icon: <Clock        className="w-4 h-4" />, color: "#065F46",  bg: "linear-gradient(135deg,#EDFAF2,#D0F2DF)" },
          { label: "Completed", value: String(completedCount),       icon: <CheckCircle2 className="w-4 h-4" />, color: "#92400E", bg: "linear-gradient(135deg,#FEF3C7,#FDE68A)" },
        ].map((stat) => (
          <div key={stat.label}
            className="flex flex-col items-center py-4 px-2 rounded-2xl text-center"
            style={{ background: stat.bg, boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2 bg-white/60"
              style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <p className="text-xl font-bold" style={{ color: "#0D1B12" }}>{stat.value}</p>
            <p className="text-[10px] font-medium mt-0.5" style={{ color: stat.color }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── Active booking ── */}
      {activeBooking && (() => {
        const service = SERVICES.find((s) => s.id === activeBooking.service)
        const worker  = WORKERS.find((w) => w.id === activeBooking.workerId)
        const imgSrc  = SERVICE_IMAGES[activeBooking.service] ?? FALLBACK_IMAGE
        return (
          <div className="px-5 sm:px-8 mb-7">
            <Link href={`/customer/bookings/${activeBooking.id}`}>
              <div className="relative overflow-hidden rounded-3xl cursor-pointer"
                style={{ boxShadow: "0 12px 40px rgba(4,46,22,0.25)", transition: "transform 300ms ease" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)" }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)" }}>
                <img src={imgSrc} alt="" className="w-full h-44 object-cover" />
                <div className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(4,20,10,0.95) 0%, rgba(4,20,10,0.3) 60%, transparent 100%)" }} />
                <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: "rgba(249,115,22,0.9)", backdropFilter: "blur(8px)" }}>
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span className="text-xs font-bold text-white uppercase tracking-wide">Live · On the way</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
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
            </Link>
          </div>
        )
      })()}

      {/* ── Services 2×2 grid ── */}
      <div className="px-5 sm:px-8 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold" style={{ color: "#0D1B12", fontFamily: "var(--font-sora)" }}>Our Services</h2>
            <p className="text-xs mt-0.5" style={{ color: "#4B7A5E" }}>Tap to book a verified professional</p>
          </div>
          <Link href="/customer/services" className="text-sm font-semibold" style={{ color: "#2EB374" }}>
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {SERVICES.map((s) => {
            const imgSrc = SERVICE_IMAGES[s.id] ?? FALLBACK_IMAGE
            const social = SERVICE_SOCIAL[s.id] ?? { pros: 30, jobs: "1k+" }
            return (
              <Link key={s.id} href={`/customer/services/${s.id}`} className="block">
                <div
                  className="relative rounded-2xl overflow-hidden cursor-pointer"
                  style={{
                    height: "clamp(220px, 32vw, 300px)",
                    boxShadow: "0 6px 24px rgba(0,0,0,0.14)",
                    transition: "transform 500ms cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 500ms ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)"
                    e.currentTarget.style.boxShadow = "0 18px 44px rgba(0,0,0,0.24)"
                    const img = e.currentTarget.querySelector<HTMLImageElement>("img.svc-photo")
                    if (img) img.style.transform = "scale(1.09)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.14)"
                    const img = e.currentTarget.querySelector<HTMLImageElement>("img.svc-photo")
                    if (img) img.style.transform = "scale(1)"
                  }}
                >
                  {/* Photo */}
                  <img
                    src={imgSrc}
                    alt={s.name}
                    className="svc-photo absolute inset-0 w-full h-full object-cover"
                    style={{ transform: "scale(1)", transition: "transform 500ms cubic-bezier(0.25,0.46,0.45,0.94)", willChange: "transform" }}
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgba(4,10,6,0.95) 0%, rgba(4,10,6,0.45) 50%, rgba(0,0,0,0.1) 100%)" }} />

                  {/* Top row */}
                  <div className="absolute top-0 left-0 right-0 flex items-start justify-between p-3">
                    {s.badge ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: "linear-gradient(135deg,#1A9458,#2EB374)", color: "#fff" }}>
                        {s.badge}
                      </span>
                    ) : <span />}
                    {/* Pros available chip */}
                    <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full"
                      style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)", color: "#86EFAC" }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                      {social.pros} pros
                    </span>
                  </div>

                  {/* Bottom content */}
                  <div className="absolute bottom-0 left-0 right-0 p-3.5">
                    {/* Social proof: worker avatars + jobs count */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex -space-x-1.5">
                        {WORKER_AVATARS.slice(0, 3).map((src, i) => (
                          <div key={i} className="w-5 h-5 rounded-full overflow-hidden ring-1 ring-white/30">
                            <img src={src} alt="" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                      <span className="text-[10px] font-medium" style={{ color: "#A7F3D0" }}>
                        {social.jobs} jobs done
                      </span>
                    </div>

                    {/* Service name */}
                    <h3 className="text-base font-bold text-white leading-tight mb-1.5"
                      style={{ fontFamily: "var(--font-sora)" }}>
                      {s.name}
                    </h3>

                    {/* Rating + duration */}
                    <div className="flex items-center gap-2 mb-2.5">
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map((n) => (
                          <Star key={n} className={`w-3 h-3 ${n <= Math.round(s.rating) ? "fill-yellow-400 text-yellow-400" : "text-white/30"}`} />
                        ))}
                        <span className="text-xs text-white/70 ml-0.5">{s.rating}</span>
                      </div>
                      <span className="text-white/40 text-xs">·</span>
                      <span className="text-xs" style={{ color: "rgba(255,255,255,0.65)" }}>{s.reviews} reviews</span>
                    </div>

                    {/* Price + duration row */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-medium" style={{ color: "#86EFAC" }}>Starting from</p>
                        <p className="text-base font-bold text-white">{formatINR(s.priceFrom)}</p>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                        style={{ backgroundColor: "rgba(46,179,116,0.25)", backdropFilter: "blur(6px)", border: "1px solid rgba(46,179,116,0.4)" }}>
                        <Clock className="w-3 h-3" style={{ color: "#86EFAC" }} />
                        <span className="text-xs font-semibold" style={{ color: "#86EFAC" }}>{s.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* ── Quick links ── */}
      <div className="grid grid-cols-4 gap-3 px-5 sm:px-8 mb-8">
        {[
          { href: "/customer/bookings", icon: <CalendarDays className="w-5 h-5" />, label: "Bookings", bg: "linear-gradient(135deg,#EFF6FF,#BFDBFE)", color: "#1D4ED8" },
          { href: "/customer/payments", icon: <CreditCard   className="w-5 h-5" />, label: "Payments", bg: "linear-gradient(135deg,#FEF3C7,#FDE68A)", color: "#92400E" },
          { href: "/customer/services", icon: <Wrench       className="w-5 h-5" />, label: "Services", bg: "linear-gradient(135deg,#EDFAF2,#D0F2DF)", color: "#065F46" },
          { href: "/customer/profile",  icon: <User         className="w-5 h-5" />, label: "Profile",  bg: "linear-gradient(135deg,#FDF4FF,#E9D5FF)", color: "#6B21A8" },
        ].map((item) => (
          <Link key={item.href} href={item.href}>
            <div className="flex flex-col items-center gap-2 py-4 rounded-2xl cursor-pointer text-center"
              style={{ background: item.bg, boxShadow: "0 1px 8px rgba(0,0,0,0.06)", transition: "transform 250ms ease, box-shadow 250ms ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.1)" }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 8px rgba(0,0,0,0.06)" }}>
              <span style={{ color: item.color }}>{item.icon}</span>
              <p className="text-xs font-semibold" style={{ color: item.color }}>{item.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Recent bookings — timeline style ── */}
      <div className="px-5 sm:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold" style={{ color: "#0D1B12", fontFamily: "var(--font-sora)" }}>Recent Bookings</h2>
          <Link href="/customer/bookings" className="text-sm font-semibold" style={{ color: "#2EB374" }}>See all →</Link>
        </div>

        <div className="space-y-3">
          {MOCK_BOOKINGS.slice(0, 4).map((b, idx) => {
            const service = SERVICES.find((s) => s.id === b.service)
            const worker  = WORKERS.find((w) => w.id === b.workerId)
            const cfg     = STATUS_CONFIG[b.status]
            const imgSrc  = SERVICE_IMAGES[b.service] ?? FALLBACK_IMAGE
            const accents = ["#2EB374", "#3B82F6", "#F59E0B", "#8B5CF6"]
            const accent  = accents[idx % accents.length]
            return (
              <Link key={b.id} href={`/customer/bookings/${b.id}`} className="block">
                <div className="flex items-center gap-4 rounded-2xl overflow-hidden cursor-pointer px-4"
                  style={{ backgroundColor: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", transition: "box-shadow 200ms ease, transform 200ms ease" }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.12)"; e.currentTarget.style.transform = "translateY(-1px)" }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "translateY(0)" }}>
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 my-3">
                    <img src={imgSrc} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 py-3">
                    <p className="font-bold truncate text-sm" style={{ color: "#0D1B12" }}>{service?.name}</p>
                    <p className="text-xs truncate mt-0.5" style={{ color: "#6B7280" }}>
                      {formatBookingDate(b.slot.date)} · {b.slot.startTime} · {worker?.name}
                    </p>
                    <p className="text-xs font-semibold mt-0.5" style={{ color: "var(--color-brand-600)" }}>{formatINR(b.quote.total)}</p>
                  </div>
                  <div className="pr-4 flex flex-col items-end gap-2">
                    <Badge variant={cfg.color} badgeStyle="soft" size="sm">{cfg.label}</Badge>
                    <ChevronRight className="w-4 h-4" style={{ color: "#9CA3AF" }} />
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
