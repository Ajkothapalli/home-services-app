"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, CalendarDays, Clock, Bell, ChevronRight, Play } from "lucide-react"
import { Button, Badge } from "@/design-system"
import { SERVICES, MOCK_BOOKINGS, WORKERS } from "@/lib/mock-data"

// ── Seepage video card ────────────────────────────────────────────────────────
// Drop your video at /public/videos/seepage-repair.mp4
// Drop the thumbnail image at /public/images/seepage-thumb.jpg

function SeepageVideoCard({ serviceId, priceFrom }: { serviceId: string; priceFrom: number }) {
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const [hovered, setHovered] = React.useState(false)

  function onEnter() {
    setHovered(true)
    videoRef.current?.play()
  }

  function onLeave() {
    setHovered(false)
    const v = videoRef.current
    if (v) { v.pause(); v.currentTime = 0 }
  }

  return (
    <Link href={`/customer/services/${serviceId}`} className="block">
      <div
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onFocus={onEnter}
        onBlur={onLeave}
        className="rounded-xl overflow-visible cursor-pointer"
        style={{
          boxShadow: hovered
            ? "0 20px 48px rgba(13,82,48,0.22), 0 4px 16px rgba(13,82,48,0.12)"
            : "0 4px 18px rgba(13,82,48,0.10)",
          border: "1px solid rgba(46,179,116,0.14)",
          transform: hovered ? "scale(1.06)" : "scale(1)",
          transition: "transform 280ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 280ms ease",
          position: "relative",
          zIndex: hovered ? 10 : 1,
        }}
      >
        {/* Video / thumbnail area */}
        <div className="relative overflow-hidden rounded-t-xl" style={{ height: 140, backgroundColor: "#0a1a0f" }}>
          {/* Poster shown until video plays */}
          {!hovered && (
            <img
              src="/images/seepage-thumb.jpg"
              alt="Seepage Repair"
              className="w-full h-full object-cover"
              style={{ position: "absolute", inset: 0 }}
            />
          )}

          <video
            ref={videoRef}
            src="/videos/seepage-repair.mp4"
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
            style={{
              opacity: hovered ? 1 : 0,
              transition: "opacity 200ms ease",
            }}
          />

          {/* Play hint badge — visible at rest */}
          {!hovered && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}>
                <Play className="w-4 h-4 text-white ml-0.5" />
              </div>
            </div>
          )}

          {/* "Watch" label fades in on hover */}
          <div
            className="absolute top-2.5 left-2.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              color: "#6EE7B7",
              opacity: hovered ? 1 : 0,
              transition: "opacity 200ms ease",
            }}
          >
            Playing
          </div>
        </div>

        {/* Label area */}
        <div className="px-4 py-3 rounded-b-xl" style={{ backgroundColor: "var(--color-neutral-0)" }}>
          <p className="text-sm font-bold" style={{ color: "var(--color-text-primary)" }}>Seepage Repair</p>
          <p className="text-xs mt-0.5 font-semibold" style={{ color: "#0284C7" }}>
            from ₹{priceFrom.toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </Link>
  )
}

// ── Service illustrations ─────────────────────────────────────────────────────

function SeepageIllustration() {
  return (
    <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Background blobs */}
      <ellipse cx="160" cy="30" rx="55" ry="55" fill="#BAE6FD" fillOpacity=".35" />
      <ellipse cx="40" cy="110" rx="45" ry="45" fill="#38BDF8" fillOpacity=".2" />
      {/* Pipe horizontal */}
      <rect x="20" y="58" width="120" height="22" rx="11" fill="#0EA5E9" />
      <rect x="20" y="58" width="120" height="10" rx="8" fill="#38BDF8" />
      {/* Pipe cap left */}
      <rect x="12" y="52" width="18" height="34" rx="6" fill="#0284C7" />
      {/* Pipe vertical down */}
      <rect x="108" y="80" width="22" height="38" rx="11" fill="#0EA5E9" />
      <rect x="108" y="80" width="22" height="10" rx="4" fill="#38BDF8" />
      {/* Crack on pipe */}
      <path d="M70 62 l4 8 l-3 6" stroke="#0369A1" strokeWidth="1.5" strokeLinecap="round" />
      {/* Water drops */}
      <path d="M72 82 Q72 90 68 92 Q64 90 64 82 Q64 76 68 72 Q72 76 72 82Z" fill="#7DD3FC" />
      <path d="M90 88 Q90 95 87 97 Q84 95 84 88 Q84 83 87 79 Q90 83 90 88Z" fill="#BAE6FD" />
      <path d="M80 96 Q80 101 78 103 Q76 101 76 96 Q76 93 78 90 Q80 93 80 96Z" fill="#38BDF8" />
      {/* Wrench */}
      <g transform="translate(140,28) rotate(35)">
        <rect x="-4" y="-22" width="8" height="40" rx="3" fill="#0369A1" />
        <path d="M-8,-22 Q0,-32 8,-22 L4,-18 L-4,-18Z" fill="#0284C7" />
        <path d="M-8,18 Q0,28 8,18 L4,14 L-4,14Z" fill="#0284C7" />
      </g>
      {/* Water ripples at bottom */}
      <path d="M95 118 Q108 112 122 118 Q136 124 150 118" stroke="#BAE6FD" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M100 126 Q113 120 127 126 Q141 132 155 126" stroke="#7DD3FC" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  )
}

function TilingIllustration() {
  return (
    <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Background */}
      <ellipse cx="150" cy="25" rx="60" ry="55" fill="#FDE68A" fillOpacity=".4" />
      {/* Tile grid — 3×3 */}
      {[0,1,2].map(col => [0,1,2].map(row => (
        <rect
          key={`${col}-${row}`}
          x={28 + col * 36} y={18 + row * 32}
          width="32" height="28" rx="3"
          fill={((col + row) % 2 === 0) ? "#FEF3C7" : "#FDE68A"}
          stroke="#F59E0B" strokeWidth="1.5"
        />
      )))}
      {/* Trowel handle */}
      <rect x="128" y="22" width="10" height="50" rx="5" fill="#92400E" />
      {/* Trowel blade */}
      <path d="M122 70 L138 70 L142 105 L118 105 Z" fill="#D97706" />
      <path d="M122 70 L138 70 L140 78 L120 78 Z" fill="#B45309" />
      {/* Mortar on trowel */}
      <ellipse cx="130" cy="88" rx="10" ry="6" fill="#E5E7EB" fillOpacity=".8" />
      {/* Scattered tile chips */}
      <rect x="148" y="95" width="14" height="12" rx="2" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1.2" transform="rotate(-12,155,101)" />
      <rect x="158" y="60" width="10" height="9" rx="2" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.2" transform="rotate(8,163,64)" />
      {/* Sparkle dots */}
      <circle cx="170" cy="110" r="3" fill="#F59E0B" fillOpacity=".5" />
      <circle cx="18" cy="100" r="2.5" fill="#FDE68A" />
    </svg>
  )
}

function GroutingIllustration() {
  return (
    <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Background blob */}
      <ellipse cx="40" cy="35" rx="55" ry="50" fill="#DDD6FE" fillOpacity=".4" />
      <ellipse cx="168" cy="115" rx="40" ry="35" fill="#C4B5FD" fillOpacity=".25" />
      {/* Tile grid with grout lines */}
      {[0,1,2,3].map(col => [0,1].map(row => (
        <rect
          key={`${col}-${row}`}
          x={20 + col * 32} y={22 + row * 36}
          width="28" height="30" rx="2"
          fill="#EDE9FE"
          stroke="#7C3AED" strokeWidth="2"
        />
      )))}
      {/* Grout float tool */}
      <rect x="140" y="35" width="46" height="26" rx="5" fill="#6D28D9" />
      <rect x="140" y="35" width="46" height="12" rx="5" fill="#7C3AED" />
      <rect x="154" y="18" width="18" height="22" rx="4" fill="#4C1D95" />
      <rect x="158" y="14" width="10" height="8" rx="3" fill="#6D28D9" />
      {/* Grout being applied — squiggle */}
      <path d="M148 96 Q160 88 172 96 Q184 104 184 96" stroke="#A78BFA" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M148 108 Q160 100 172 108" stroke="#C4B5FD" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Grout texture on tiles */}
      <line x1="52" y1="22" x2="52" y2="94" stroke="#7C3AED" strokeWidth="2" />
      <line x1="84" y1="22" x2="84" y2="94" stroke="#7C3AED" strokeWidth="2" />
      <line x1="20" y1="58" x2="148" y2="58" stroke="#7C3AED" strokeWidth="2" />
    </svg>
  )
}

function WeldingIllustration() {
  return (
    <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Background glow */}
      <radialGradient id="weld-glow" cx="50%" cy="70%" r="50%">
        <stop offset="0%" stopColor="#FEF08A" stopOpacity=".6" />
        <stop offset="100%" stopColor="#FB923C" stopOpacity="0" />
      </radialGradient>
      <ellipse cx="100" cy="98" rx="70" ry="45" fill="url(#weld-glow)" />
      {/* Metal workpiece */}
      <rect x="30" y="90" width="140" height="22" rx="4" fill="#374151" />
      <rect x="30" y="90" width="140" height="8" rx="4" fill="#4B5563" />
      {/* Weld bead */}
      <path d="M55 90 Q65 84 75 90 Q85 96 95 90 Q105 84 115 90 Q125 96 135 90 Q145 84 155 90"
        stroke="#F97316" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      {/* Welding torch body */}
      <rect x="118" y="38" width="14" height="46" rx="7" fill="#1F2937" transform="rotate(20,125,61)" />
      <rect x="118" y="38" width="14" height="20" rx="7" fill="#374151" transform="rotate(20,125,61)" />
      {/* Torch tip nozzle */}
      <path d="M133 72 L140 86 L128 86 Z" fill="#6B7280" transform="rotate(20,134,79)" />
      {/* Arc flash — bright center */}
      <circle cx="100" cy="91" r="6" fill="#FEF9C3" />
      <circle cx="100" cy="91" r="3.5" fill="white" />
      {/* Sparks radiating */}
      {[0,40,80,120,160,200,240,300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180
        const len = [18, 12, 22, 10, 16, 14, 20, 11][i]
        return (
          <line key={angle}
            x1="100" y1="91"
            x2={100 + Math.cos(rad) * len}
            y2={91 + Math.sin(rad) * len}
            stroke={i % 2 === 0 ? "#FDE047" : "#FB923C"}
            strokeWidth="1.5" strokeLinecap="round"
          />
        )
      })}
      {/* Floating spark dots */}
      <circle cx="82" cy="74" r="2" fill="#FDE047" />
      <circle cx="118" cy="70" r="1.5" fill="#FB923C" />
      <circle cx="75" cy="82" r="1.5" fill="#FEF08A" />
      <circle cx="126" cy="80" r="2.5" fill="#FDE047" />
      <circle cx="90" cy="66" r="1.5" fill="#FB923C" />
      <circle cx="112" cy="64" r="1" fill="#FDE047" />
      {/* Helmet outline top */}
      <path d="M55 50 Q55 22 100 22 Q145 22 145 50 L145 72 Q145 84 132 84 L68 84 Q55 84 55 72 Z"
        fill="#1F2937" stroke="#374151" strokeWidth="1.5" />
      <path d="M70 56 L130 56 L132 80 L68 80 Z" fill="#111827" />
      {/* Helmet visor — golden tinted */}
      <rect x="72" y="56" width="56" height="22" rx="4" fill="#92400E" fillOpacity=".7" />
      <rect x="72" y="56" width="56" height="8" rx="4" fill="#B45309" fillOpacity=".5" />
    </svg>
  )
}

const SERVICE_ILLUSTRATIONS: Record<string, { component: React.ReactNode; bg: string; accent: string }> = {
  "seepage-repair": {
    component: <SeepageIllustration />,
    bg: "linear-gradient(145deg, #E0F2FE 0%, #BAE6FD 50%, #7DD3FC 100%)",
    accent: "#0284C7",
  },
  "tiling": {
    component: <TilingIllustration />,
    bg: "linear-gradient(145deg, #FFFBEB 0%, #FEF3C7 50%, #FDE68A 100%)",
    accent: "#D97706",
  },
  "grouting": {
    component: <GroutingIllustration />,
    bg: "linear-gradient(145deg, #F5F3FF 0%, #EDE9FE 50%, #DDD6FE 100%)",
    accent: "#7C3AED",
  },
  "welding": {
    component: <WeldingIllustration />,
    bg: "linear-gradient(145deg, #FFF7ED 0%, #FFEDD5 50%, #FED7AA 100%)",
    accent: "#EA580C",
  },
}

// Fallback for any service not in the map
const FALLBACK_ILLUSTRATION = SERVICE_ILLUSTRATIONS["seepage-repair"]

// ─────────────────────────────────────────────────────────────────────────────

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
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })
}

export default function CustomerDashboard() {
  const customerName   = "Priya"
  const activeBooking  = MOCK_BOOKINGS.find((b) => b.status === "en_route" || b.status === "in_progress")
  const recentBookings = MOCK_BOOKINGS.slice(0, 3)

  const totalBookings     = MOCK_BOOKINGS.length
  const upcomingBookings  = MOCK_BOOKINGS.filter((b) => ["confirmed", "assigned", "en_route"].includes(b.status)).length
  const completedBookings = MOCK_BOOKINGS.filter((b) => b.status === "completed").length

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-12">

      {/* ── Header (desktop only — mobile uses layout sticky header) ────────── */}
      <div className="hidden lg:flex items-center justify-between pt-8 pb-6">
        <div>
          <p className="text-sm mb-0.5" style={{ color: "var(--color-text-secondary)" }}>
            {getGreeting()},
          </p>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
            {customerName} 👋
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-colors hover:bg-[var(--color-neutral-100)]"
            style={{ border: "1.5px solid var(--color-border-default)", backgroundColor: "var(--color-neutral-0)" }}
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" style={{ color: "var(--color-text-secondary)" }} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E05C2A]" />
          </button>
          <Link href="/customer/services">
            <Button variant="primary" size="sm" iconRight={<ArrowRight className="w-4 h-4" />}>
              Book Now
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile top spacing */}
      <div className="lg:hidden pt-4" />

      {/* ── Active booking banner ────────────────────────────────────────────── */}
      {activeBooking && (() => {
        const service = SERVICES.find((s) => s.id === activeBooking.service)
        const worker  = WORKERS.find((w) => w.id === activeBooking.workerId)
        const illus   = SERVICE_ILLUSTRATIONS[activeBooking.service] ?? FALLBACK_ILLUSTRATION
        return (
          <Link href={`/customer/bookings/${activeBooking.id}`} className="block mb-8">
            <div
              className="relative overflow-hidden rounded-2xl flex items-center justify-between gap-4 px-6 py-5 cursor-pointer transition-transform hover:scale-[1.01]"
              style={{
                background: "linear-gradient(120deg, #052E16 0%, #065F46 45%, #047857 100%)",
                boxShadow: "0 10px 36px rgba(4,46,22,0.28)",
              }}
            >
              {/* Decorative illustration — muted in corner */}
              <div className="absolute right-0 top-0 bottom-0 w-36 opacity-20 pointer-events-none select-none">
                {illus.component}
              </div>

              <div className="relative">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest mb-2 px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#6EE7B7" }}>
                  <Clock className="w-3 h-3" /> On the way
                </span>
                <p className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>{service?.name}</p>
                <p className="text-sm mt-0.5" style={{ color: "#A7F3D0" }}>
                  {worker?.name} &nbsp;·&nbsp; Today at {activeBooking.slot.startTime}
                </p>
              </div>

              <div className="relative shrink-0 w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
                <ArrowRight className="w-5 h-5 text-white" />
              </div>
            </div>
          </Link>
        )
      })()}

      {/* ── Stats ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 mb-10">
        {[
          { label: "Total",    value: totalBookings,     accent: "#2EB374" },
          { label: "Upcoming", value: upcomingBookings,  accent: "#3B82F6" },
          { label: "Done",     value: completedBookings, accent: "#10B981" },
        ].map((s) => (
          <div key={s.label}
            className="flex flex-col items-center py-5 rounded-xl"
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid rgba(46,179,116,0.14)",
              boxShadow: "0 2px 12px rgba(13,82,48,0.07)",
            }}>
            <p className="text-3xl font-bold tracking-tight" style={{ color: s.accent, fontFamily: "var(--font-sora)" }}>
              {s.value}
            </p>
            <p className="text-xs mt-1 font-medium" style={{ color: "var(--color-text-secondary)" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Services ────────────────────────────────────────────────────────── */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
            Our Services
          </h2>
          <Link href="/customer/services" className="flex items-center gap-1 text-sm font-semibold" style={{ color: "var(--color-brand-600)" }}>
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" style={{ overflow: "visible" }}>
          {SERVICES.map((s) => {
            // Seepage gets the video card treatment
            if (s.id === "seepage-repair") {
              return (
                <div key={s.id} style={{ overflow: "visible" }}>
                  <SeepageVideoCard serviceId={s.id} priceFrom={s.priceFrom} />
                </div>
              )
            }

            const illus = SERVICE_ILLUSTRATIONS[s.id] ?? FALLBACK_ILLUSTRATION
            return (
              <Link key={s.id} href={`/customer/services/${s.id}`} className="block group">
                <div
                  className="rounded-xl overflow-hidden transition-transform duration-200 group-hover:scale-[1.02]"
                  style={{
                    boxShadow: "0 4px 18px rgba(13,82,48,0.10)",
                    border: "1px solid rgba(46,179,116,0.14)",
                  }}
                >
                  <div className="relative flex items-center justify-center px-4 pt-5 pb-2" style={{ background: illus.bg, height: 140 }}>
                    <div className="w-full h-full">
                      {illus.component}
                    </div>
                  </div>
                  <div className="px-4 py-3" style={{ backgroundColor: "var(--color-neutral-0)" }}>
                    <p className="text-sm font-bold" style={{ color: "var(--color-text-primary)" }}>{s.name}</p>
                    <p className="text-xs mt-0.5 font-semibold" style={{ color: illus.accent }}>
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
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
            Recent Bookings
          </h2>
          <Link href="/customer/bookings" className="flex items-center gap-1 text-sm font-semibold" style={{ color: "var(--color-brand-600)" }}>
            See all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-14 rounded-xl text-center"
            style={{ backgroundColor: "var(--color-neutral-0)", border: "1.5px dashed var(--color-border-default)" }}>
            <CalendarDays className="w-8 h-8" style={{ color: "var(--color-neutral-400)" }} />
            <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>No bookings yet</p>
            <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>Book your first home service to get started</p>
            <Link href="/customer/services"><Button variant="primary" size="sm">Browse Services</Button></Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl" style={{ border: "1px solid rgba(46,179,116,0.14)", backgroundColor: "#ffffff", boxShadow: "0 2px 16px rgba(13,82,48,0.07)" }}>
            {recentBookings.map((b, idx) => {
              const service = SERVICES.find((s) => s.id === b.service)
              const worker  = WORKERS.find((w) => w.id === b.workerId)
              const cfg     = STATUS_CONFIG[b.status]
              const illus   = SERVICE_ILLUSTRATIONS[b.service] ?? FALLBACK_ILLUSTRATION
              const isLast  = idx === recentBookings.length - 1
              return (
                <Link key={b.id} href={`/customer/bookings/${b.id}`} className="block">
                  <div
                    className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-[#F4FBF7]"
                    style={!isLast ? { borderBottom: "1px solid rgba(46,179,116,0.10)" } : {}}
                  >
                    {/* Illustration thumbnail */}
                    <div
                      className="w-12 h-12 rounded-lg overflow-hidden shrink-0 flex items-center justify-center"
                      style={{ background: illus.bg }}
                    >
                      <div className="w-11 h-11 scale-[1.4] origin-center">
                        {illus.component}
                      </div>
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
  )
}
