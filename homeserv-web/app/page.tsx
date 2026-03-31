"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, Shield, Star, Clock, CheckCircle2, Droplets, Grid3x3, Layers, Zap, Phone } from "lucide-react"
import { Button } from "@/design-system"
import { SERVICES } from "@/lib/mock-data"
import { formatINR } from "@/lib/utils"

const ICON_MAP: Record<string, React.ReactNode> = {
  droplets: <Droplets className="w-7 h-7" />,
  "grid-3x3": <Grid3x3 className="w-7 h-7" />,
  layers: <Layers className="w-7 h-7" />,
  zap: <Zap className="w-7 h-7" />,
}

const HOW_IT_WORKS = [
  { step: "1", title: "Choose a Service", desc: "Pick from seepage, tiling, grouting, or welding." },
  { step: "2", title: "Select a Slot",    desc: "Browse real-time availability and book a 30-min window." },
  { step: "3", title: "Pay & Relax",      desc: "Secure payment. Verified professional arrives on time." },
]

const TRUST = [
  { icon: <Shield className="w-4 h-4" />,       label: "Verified Professionals" },
  { icon: <Star className="w-4 h-4" />,          label: "4.8★ Avg Rating"        },
  { icon: <Clock className="w-4 h-4" />,         label: "On-Time Guarantee"      },
  { icon: <CheckCircle2 className="w-4 h-4" />,  label: "Transparent Pricing"    },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4"
        style={{
          backgroundColor: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--color-border-default)",
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #0D5230, #2EB374)" }}>
            <span className="text-white font-bold text-xs">HS</span>
          </div>
          <span className="font-bold text-base sm:text-lg" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
            HomeServ
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/auth/worker" className="hidden sm:block">
            <Button variant="ghost" size="sm">Join as Pro</Button>
          </Link>
          <Link href="/auth/worker" className="sm:hidden">
            <Button variant="ghost" size="sm">Pro</Button>
          </Link>
          <Link href="/auth/customer">
            <Button variant="primary" size="sm">Book Now</Button>
          </Link>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section
        className="relative flex flex-col items-center text-center px-5 sm:px-6 pt-12 sm:pt-20 pb-16 sm:pb-24 overflow-hidden"
        style={{ background: "linear-gradient(160deg, #EDFAF2 0%, #D0F2DF 35%, #9FE3BF 65%, #EDFAF2 100%)" }}
      >
        <div className="absolute top-0 left-0 w-72 h-72 rounded-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, #2EB374, transparent)", transform: "translate(-30%, -30%)" }} aria-hidden="true" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-15 pointer-events-none"
          style={{ background: "radial-gradient(circle, #0D5230, transparent)", transform: "translate(20%, 20%)" }} aria-hidden="true" />

        <span
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6"
          style={{ backgroundColor: "var(--color-brand-100)", color: "var(--color-brand-700)", border: "1px solid var(--color-brand-200)" }}
        >
          Mumbai&apos;s #1 Home Repair Platform
        </span>

        <h1
          className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight mb-5 sm:mb-6 max-w-3xl"
          style={{ color: "var(--color-brand-900)", fontFamily: "var(--font-sora)" }}
        >
          Home repairs,<br />
          <span style={{ background: "linear-gradient(135deg, #0D5230, #2EB374)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            done right.
          </span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-xl" style={{ color: "var(--color-neutral-700)" }}>
          Seepage repair, tiling, grouting, and welding — booked in under 2 minutes with verified professionals.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/auth/customer">
            <Button variant="primary" size="lg" iconRight={<ArrowRight className="w-5 h-5" />}>
              Book a Service
            </Button>
          </Link>
          <Link href="/auth/worker">
            <Button variant="outline" size="lg">Earn as a Pro</Button>
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-10">
          {TRUST.map((t) => (
            <span
              key={t.label}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{ backgroundColor: "rgba(255,255,255,0.7)", color: "var(--color-brand-700)", border: "1px solid var(--color-brand-200)" }}
            >
              <span style={{ color: "var(--color-brand-500)" }}>{t.icon}</span>
              {t.label}
            </span>
          ))}
        </div>
      </section>

      {/* ── Services ────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 py-10 sm:py-16 max-w-6xl mx-auto w-full">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
            Our Services
          </h2>
          <p className="text-base" style={{ color: "var(--color-text-secondary)" }}>
            Expert professionals for every home repair need
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((s) => (
            <Link key={s.id} href="/auth/customer" className="group block">
              <div
                className="relative flex flex-col p-6 h-full cursor-pointer transition-all duration-200 group-hover:scale-[1.02]"
                style={{
                  backgroundColor: "var(--color-neutral-0)",
                  border: "1.5px solid var(--color-border-default)",
                  borderRadius: "var(--radius-2xl)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                {s.badge && (
                  <span className="absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "linear-gradient(135deg, #1A9458, #2EB374)", color: "#fff" }}>
                    {s.badge}
                  </span>
                )}
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: "linear-gradient(135deg, #EDFAF2, #D0F2DF)", color: "var(--color-brand-600)" }}>
                  {ICON_MAP[s.icon]}
                </div>
                <h3 className="font-bold text-base mb-1" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
                  {s.name}
                </h3>
                <p className="text-xs leading-relaxed mb-4 flex-1" style={{ color: "var(--color-text-secondary)" }}>
                  {s.description}
                </p>
                <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid var(--color-border-default)" }}>
                  <span className="text-sm font-semibold" style={{ color: "var(--color-brand-600)" }}>
                    from {formatINR(s.priceFrom)}
                  </span>
                  <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>⭐ {s.rating}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 py-10 sm:py-16"
        style={{ backgroundColor: "var(--color-neutral-50)", borderTop: "1px solid var(--color-border-default)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
              Booked in 3 steps
            </h2>
            <p className="text-base" style={{ color: "var(--color-text-secondary)" }}>From tap to confirmed — under 2 minutes</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl text-white mb-4"
                  style={{ background: "linear-gradient(135deg, #0D5230, #2EB374)", boxShadow: "0 4px 18px rgba(26,148,88,0.3)" }}>
                  {item.step}
                </div>
                <h3 className="font-bold text-base mb-2" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
                  {item.title}
                </h3>
                <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ─────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 py-10 sm:py-14">
        <div
          className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5 px-6 sm:px-8 py-6 sm:py-8 rounded-[var(--radius-2xl)]"
          style={{ background: "linear-gradient(135deg, #0D5230, #1A9458, #2EB374)", boxShadow: "0 8px 32px rgba(26,148,88,0.3)" }}
        >
          <div>
            <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "var(--font-sora)" }}>Ready to fix it?</h2>
            <p className="text-sm" style={{ color: "#9FE3BF" }}>Professionals available today in Mumbai.</p>
          </div>
          <Link href="/auth/customer">
            <Button variant="secondary" size="lg" iconRight={<ArrowRight className="w-5 h-5" />}
              style={{ backgroundColor: "#fff", color: "#0D5230", minWidth: 180 }}>
              Book Now
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="px-6 py-8 mt-auto"
        style={{ backgroundColor: "var(--color-neutral-900)", color: "var(--color-neutral-400)" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #1A9458, #2EB374)" }}>
              <span className="text-white font-bold text-[9px]">HS</span>
            </div>
            <span className="text-sm font-semibold text-white">HomeServ</span>
          </div>
          <p className="text-xs text-center">© 2026 HomeServ. Mumbai, India.</p>
          <div className="flex items-center gap-1 text-xs">
            <Phone className="w-3 h-3" /><span>+91 98765 00000</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
