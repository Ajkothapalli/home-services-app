"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, CalendarDays, Clock, Bell, ChevronRight, CheckCircle2, Zap } from "lucide-react"
import { Button, Badge } from "@/design-system"
import { SERVICES, MOCK_BOOKINGS, WORKERS } from "@/lib/mock-data"

// ── Seepage video card ────────────────────────────────────────────────────────
function SeepageVideoCard({ serviceId, priceFrom }: { serviceId: string; priceFrom: number }) {
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const [hovered, setHovered] = React.useState(false)

  function onEnter() { setHovered(true); videoRef.current?.play() }
  function onLeave() {
    setHovered(false)
    const v = videoRef.current
    if (v) { v.pause(); v.currentTime = 0 }
  }

  return (
    <Link href={`/customer/services/${serviceId}`} className="block h-full">
      <div
        onMouseEnter={onEnter} onMouseLeave={onLeave}
        onFocus={onEnter} onBlur={onLeave}
        className="relative h-full rounded-2xl overflow-hidden cursor-pointer"
        style={{
          boxShadow: hovered ? "0 16px 40px rgba(13,82,48,0.22)" : "0 2px 12px rgba(13,82,48,0.10)",
          transition: "box-shadow 300ms ease",
          minHeight: 180,
        }}
      >
        <img src="/images/seepage-thumb.jpg" alt="Seepage Repair"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transform: hovered ? "scale(1.05)" : "scale(1)", transition: "transform 600ms ease" }}
        />
        <video ref={videoRef} src="/videos/seepage-repair.mp4" muted loop playsInline preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: hovered ? 1 : 0, transition: "opacity 300ms ease" }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(4,14,8,0.85) 0%, rgba(4,14,8,0.2) 55%, transparent 100%)" }} />
        {hovered && (
          <div className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{ backgroundColor: "rgba(0,0,0,0.5)", color: "#6EE7B7" }}>
            Playing
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-3.5">
          <p className="text-sm font-bold text-white">Seepage Repair</p>
          <p className="text-xs font-semibold mt-0.5" style={{ color: "#6EE7B7" }}>from ₹{priceFrom.toLocaleString("en-IN")}</p>
        </div>
      </div>
    </Link>
  )
}

// ── Service illustrations ─────────────────────────────────────────────────────
function SeepageIllustration() {
  return (
    <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="160" cy="30" rx="55" ry="55" fill="#BAE6FD" fillOpacity=".35" />
      <ellipse cx="40" cy="110" rx="45" ry="45" fill="#38BDF8" fillOpacity=".2" />
      <rect x="20" y="58" width="120" height="22" rx="11" fill="#0EA5E9" />
      <rect x="20" y="58" width="120" height="10" rx="8" fill="#38BDF8" />
      <rect x="12" y="52" width="18" height="34" rx="6" fill="#0284C7" />
      <rect x="108" y="80" width="22" height="38" rx="11" fill="#0EA5E9" />
      <rect x="108" y="80" width="22" height="10" rx="4" fill="#38BDF8" />
      <path d="M70 62 l4 8 l-3 6" stroke="#0369A1" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M72 82 Q72 90 68 92 Q64 90 64 82 Q64 76 68 72 Q72 76 72 82Z" fill="#7DD3FC" />
      <path d="M90 88 Q90 95 87 97 Q84 95 84 88 Q84 83 87 79 Q90 83 90 88Z" fill="#BAE6FD" />
      <path d="M80 96 Q80 101 78 103 Q76 101 76 96 Q76 93 78 90 Q80 93 80 96Z" fill="#38BDF8" />
      <g transform="translate(140,28) rotate(35)">
        <rect x="-4" y="-22" width="8" height="40" rx="3" fill="#0369A1" />
        <path d="M-8,-22 Q0,-32 8,-22 L4,-18 L-4,-18Z" fill="#0284C7" />
        <path d="M-8,18 Q0,28 8,18 L4,14 L-4,14Z" fill="#0284C7" />
      </g>
      <path d="M95 118 Q108 112 122 118 Q136 124 150 118" stroke="#BAE6FD" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M100 126 Q113 120 127 126 Q141 132 155 126" stroke="#7DD3FC" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  )
}

function TilingIllustration() {
  return (
    <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="150" cy="25" rx="60" ry="55" fill="#FDE68A" fillOpacity=".4" />
      {[0,1,2].map(col => [0,1,2].map(row => (
        <rect key={`${col}-${row}`} x={28 + col * 36} y={18 + row * 32} width="32" height="28" rx="3"
          fill={((col + row) % 2 === 0) ? "#FEF3C7" : "#FDE68A"} stroke="#F59E0B" strokeWidth="1.5" />
      )))}
      <rect x="128" y="22" width="10" height="50" rx="5" fill="#92400E" />
      <path d="M122 70 L138 70 L142 105 L118 105 Z" fill="#D97706" />
      <path d="M122 70 L138 70 L140 78 L120 78 Z" fill="#B45309" />
      <ellipse cx="130" cy="88" rx="10" ry="6" fill="#E5E7EB" fillOpacity=".8" />
      <rect x="148" y="95" width="14" height="12" rx="2" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1.2" transform="rotate(-12,155,101)" />
      <circle cx="170" cy="110" r="3" fill="#F59E0B" fillOpacity=".5" />
    </svg>
  )
}

function GroutingIllustration() {
  return (
    <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="40" cy="35" rx="55" ry="50" fill="#DDD6FE" fillOpacity=".4" />
      <ellipse cx="168" cy="115" rx="40" ry="35" fill="#C4B5FD" fillOpacity=".25" />
      {[0,1,2,3].map(col => [0,1].map(row => (
        <rect key={`${col}-${row}`} x={20 + col * 32} y={22 + row * 36} width="28" height="30" rx="2"
          fill="#EDE9FE" stroke="#7C3AED" strokeWidth="2" />
      )))}
      <rect x="140" y="35" width="46" height="26" rx="5" fill="#6D28D9" />
      <rect x="140" y="35" width="46" height="12" rx="5" fill="#7C3AED" />
      <rect x="154" y="18" width="18" height="22" rx="4" fill="#4C1D95" />
      <path d="M148 96 Q160 88 172 96 Q184 104 184 96" stroke="#A78BFA" strokeWidth="3" strokeLinecap="round" fill="none" />
      <line x1="52" y1="22" x2="52" y2="94" stroke="#7C3AED" strokeWidth="2" />
      <line x1="84" y1="22" x2="84" y2="94" stroke="#7C3AED" strokeWidth="2" />
      <line x1="20" y1="58" x2="148" y2="58" stroke="#7C3AED" strokeWidth="2" />
    </svg>
  )
}

function WeldingIllustration() {
  return (
    <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <radialGradient id="weld-glow" cx="50%" cy="70%" r="50%">
        <stop offset="0%" stopColor="#FEF08A" stopOpacity=".6" />
        <stop offset="100%" stopColor="#FB923C" stopOpacity="0" />
      </radialGradient>
      <ellipse cx="100" cy="98" rx="70" ry="45" fill="url(#weld-glow)" />
      <rect x="30" y="90" width="140" height="22" rx="4" fill="#374151" />
      <rect x="30" y="90" width="140" height="8" rx="4" fill="#4B5563" />
      <path d="M55 90 Q65 84 75 90 Q85 96 95 90 Q105 84 115 90 Q125 96 135 90 Q145 84 155 90"
        stroke="#F97316" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <rect x="118" y="38" width="14" height="46" rx="7" fill="#1F2937" transform="rotate(20,125,61)" />
      <circle cx="100" cy="91" r="6" fill="#FEF9C3" />
      <circle cx="100" cy="91" r="3.5" fill="white" />
      {[0,40,80,120,160,200,240,300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180
        const len = [18, 12, 22, 10, 16, 14, 20, 11][i]
        return <line key={angle} x1="100" y1="91" x2={100 + Math.cos(rad) * len} y2={91 + Math.sin(rad) * len}
          stroke={i % 2 === 0 ? "#FDE047" : "#FB923C"} strokeWidth="1.5" strokeLinecap="round" />
      })}
      <path d="M55 50 Q55 22 100 22 Q145 22 145 50 L145 72 Q145 84 132 84 L68 84 Q55 84 55 72 Z"
        fill="#1F2937" stroke="#374151" strokeWidth="1.5" />
      <rect x="72" y="56" width="56" height="22" rx="4" fill="#92400E" fillOpacity=".7" />
    </svg>
  )
}

const SERVICE_ILLUSTRATIONS: Record<string, { component: React.ReactNode; bg: string; accent: string }> = {
  "seepage-repair": { component: <SeepageIllustration />, bg: "linear-gradient(145deg,#E0F2FE,#BAE6FD,#7DD3FC)", accent: "#0284C7" },
  "tiling":         { component: <TilingIllustration />,  bg: "linear-gradient(145deg,#FFFBEB,#FEF3C7,#FDE68A)", accent: "#D97706" },
  "grouting":       { component: <GroutingIllustration />, bg: "linear-gradient(145deg,#F5F3FF,#EDE9FE,#DDD6FE)", accent: "#7C3AED" },
  "welding":        { component: <WeldingIllustration />,  bg: "linear-gradient(145deg,#FFF7ED,#FFEDD5,#FED7AA)", accent: "#EA580C" },
}
const FALLBACK_ILLUSTRATION = SERVICE_ILLUSTRATIONS["seepage-repair"]

const STATUS_CONFIG = {
  en_route:    { label: "On the way",  color: "warning" as const },
  in_progress: { label: "In Progress", color: "info"    as const },
  upcoming:    { label: "Upcoming",    color: "info"    as const },
  completed:   { label: "Completed",  color: "success" as const },
  cancelled:   { label: "Cancelled",  color: "error"   as const },
  confirmed:   { label: "Confirmed",  color: "success" as const },
  pending:     { label: "Pending",    color: "neutral" as const },
  assigned:    { label: "Assigned",   color: "success" as const },
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
  const recentBookings = MOCK_BOOKINGS.slice(0, 3)
  const upcomingCount  = MOCK_BOOKINGS.filter((b) => ["confirmed", "assigned", "en_route"].includes(b.status)).length
  const completedCount = MOCK_BOOKINGS.filter((b) => b.status === "completed").length

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">

      {/* ── Desktop header ──────────────────────────────────────────────────── */}
      <div className="hidden lg:flex items-center justify-between pt-8 pb-2">
        <div>
          <p className="text-sm font-medium mb-0.5" style={{ color: "var(--color-text-secondary)" }}>
            {getGreeting()}
          </p>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
            {customerName} 👋
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ border: "1.5px solid var(--color-border-default)", backgroundColor: "var(--color-neutral-0)" }}
            aria-label="Notifications">
            <Bell className="w-5 h-5" style={{ color: "var(--color-text-secondary)" }} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E05C2A]" />
          </button>
          <Link href="/customer/services">
            <Button variant="primary" size="sm" iconRight={<ArrowRight className="w-4 h-4" />}>Book a Service</Button>
          </Link>
        </div>
      </div>
      <div className="lg:hidden pt-4" />

      {/* ── Stats strip ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 mt-4 mb-6 flex-wrap">
        <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold"
          style={{ backgroundColor: "rgba(46,179,116,0.1)", color: "#0D5230" }}>
          <CalendarDays className="w-3.5 h-3.5" />
          {MOCK_BOOKINGS.length} total bookings
        </div>
        {upcomingCount > 0 && (
          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold"
            style={{ backgroundColor: "rgba(59,130,246,0.10)", color: "#1D4ED8" }}>
            <Clock className="w-3.5 h-3.5" />
            {upcomingCount} upcoming
          </div>
        )}
        {completedCount > 0 && (
          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold"
            style={{ backgroundColor: "rgba(16,185,129,0.10)", color: "#065F46" }}>
            <CheckCircle2 className="w-3.5 h-3.5" />
            {completedCount} completed
          </div>
        )}
      </div>

      {/* ── Active booking banner ────────────────────────────────────────────── */}
      {activeBooking && (() => {
        const service = SERVICES.find((s) => s.id === activeBooking.service)
        const worker  = WORKERS.find((w) => w.id === activeBooking.workerId)
        const illus   = SERVICE_ILLUSTRATIONS[activeBooking.service] ?? FALLBACK_ILLUSTRATION
        return (
          <Link href={`/customer/bookings/${activeBooking.id}`} className="block mb-7">
            <div className="relative overflow-hidden rounded-2xl px-6 py-5 cursor-pointer"
              style={{
                background: "linear-gradient(120deg,#052E16 0%,#065F46 45%,#047857 100%)",
                boxShadow: "0 10px 36px rgba(4,46,22,0.28)",
              }}>
              <div className="absolute right-0 top-0 bottom-0 w-36 opacity-20 pointer-events-none">
                {illus.component}
              </div>
              <div className="relative flex items-center justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest mb-2 px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#6EE7B7" }}>
                    <Clock className="w-3 h-3" /> On the way
                  </span>
                  <p className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>{service?.name}</p>
                  <p className="text-sm mt-0.5" style={{ color: "#A7F3D0" }}>
                    {worker?.name} · Today at {activeBooking.slot.startTime}
                  </p>
                </div>
                <div className="shrink-0 w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </Link>
        )
      })()}

      {/* ── Book a service CTA (when no active booking) ─────────────────────── */}
      {!activeBooking && (
        <Link href="/customer/services" className="block mb-7">
          <div className="relative overflow-hidden rounded-2xl px-6 py-5 flex items-center justify-between gap-4"
            style={{
              background: "linear-gradient(120deg,#F0FDF4 0%,#DCFCE7 100%)",
              border: "1.5px solid rgba(46,179,116,0.2)",
              boxShadow: "0 2px 16px rgba(46,179,116,0.08)",
            }}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4" style={{ color: "#2EB374" }} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#2EB374" }}>Quick book</span>
              </div>
              <p className="text-base font-bold" style={{ color: "#0D1B12", fontFamily: "var(--font-sora)" }}>
                Need something fixed?
              </p>
              <p className="text-sm mt-0.5" style={{ color: "#4B7A5E" }}>
                Verified pros available today · under 2 min to book
              </p>
            </div>
            <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#0D5230,#2EB374)" }}>
              <ArrowRight className="w-5 h-5 text-white" />
            </div>
          </div>
        </Link>
      )}

      {/* ── Services ────────────────────────────────────────────────────────── */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
            Our Services
          </h2>
          <Link href="/customer/services" className="flex items-center gap-1 text-sm font-semibold" style={{ color: "var(--color-brand-600)" }}>
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" style={{ overflow: "visible" }}>
          {SERVICES.map((s) => {
            if (s.id === "seepage") {
              return (
                <div key={s.id} className="h-44" style={{ overflow: "visible" }}>
                  <SeepageVideoCard serviceId={s.id} priceFrom={s.priceFrom} />
                </div>
              )
            }
            const illus = SERVICE_ILLUSTRATIONS[s.id] ?? FALLBACK_ILLUSTRATION
            return (
              <Link key={s.id} href={`/customer/services/${s.id}`} className="block group">
                <div className="relative h-44 rounded-2xl overflow-hidden cursor-pointer"
                  style={{
                    boxShadow: "0 2px 12px rgba(13,82,48,0.10)",
                    transition: "box-shadow 300ms ease",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 12px 32px rgba(13,82,48,0.18)")}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 2px 12px rgba(13,82,48,0.10)")}
                >
                  {/* Full-bleed illustration bg */}
                  <div className="absolute inset-0 flex items-center justify-center p-4" style={{ background: illus.bg }}>
                    <div className="w-full h-full">{illus.component}</div>
                  </div>
                  {/* Gradient overlay for text legibility */}
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(15,23,18,0.75) 0%, rgba(15,23,18,0.1) 50%, transparent 100%)" }} />
                  {/* Text at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 px-3.5 pb-3.5">
                    <p className="text-sm font-bold text-white leading-tight">{s.name}</p>
                    <p className="text-xs font-semibold mt-0.5" style={{ color: "#86EFAC" }}>
                      from ₹{s.priceFrom.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── Recent Bookings ──────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
            Recent Bookings
          </h2>
          <Link href="/customer/bookings" className="flex items-center gap-1 text-sm font-semibold" style={{ color: "var(--color-brand-600)" }}>
            See all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-14 rounded-2xl text-center"
            style={{ backgroundColor: "var(--color-neutral-0)", border: "1.5px dashed var(--color-border-default)" }}>
            <CalendarDays className="w-8 h-8" style={{ color: "var(--color-neutral-400)" }} />
            <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>No bookings yet</p>
            <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>Book your first home service to get started</p>
            <Link href="/customer/services"><Button variant="primary" size="sm">Browse Services</Button></Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {recentBookings.map((b) => {
              const service = SERVICES.find((s) => s.id === b.service)
              const worker  = WORKERS.find((w) => w.id === b.workerId)
              const cfg     = STATUS_CONFIG[b.status]
              const illus   = SERVICE_ILLUSTRATIONS[b.service] ?? FALLBACK_ILLUSTRATION
              return (
                <Link key={b.id} href={`/customer/bookings/${b.id}`} className="block group">
                  <div className="flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all"
                    style={{
                      backgroundColor: "#ffffff",
                      border: "1px solid rgba(46,179,116,0.12)",
                      boxShadow: "0 1px 8px rgba(13,82,48,0.06)",
                      transition: "box-shadow 200ms ease, border-color 200ms ease",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(13,82,48,0.12)"
                      ;(e.currentTarget as HTMLElement).style.borderColor = "rgba(46,179,116,0.3)"
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 8px rgba(13,82,48,0.06)"
                      ;(e.currentTarget as HTMLElement).style.borderColor = "rgba(46,179,116,0.12)"
                    }}
                  >
                    {/* Illustration thumbnail */}
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
                      style={{ background: illus.bg }}>
                      <div className="w-11 h-11 scale-[1.4] origin-center">{illus.component}</div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: "var(--color-text-primary)" }}>
                        {service?.name}
                      </p>
                      <p className="text-xs mt-0.5 truncate" style={{ color: "var(--color-text-secondary)" }}>
                        {formatBookingDate(b.slot.date)} · {b.slot.startTime} · {worker?.name}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={cfg.color} badgeStyle="soft" size="sm">{cfg.label}</Badge>
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                        style={{ color: "var(--color-neutral-400)" }} />
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
