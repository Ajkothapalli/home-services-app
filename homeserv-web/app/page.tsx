"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Shield, Star, Clock, CheckCircle2, Phone, MapPin, IndianRupee, Users } from "lucide-react"
import { Button } from "@/design-system"
import { SERVICES } from "@/lib/mock-data"
import { formatINR } from "@/lib/utils"

// Unsplash images per service
const SERVICE_IMAGES: Record<string, string> = {
  "seepage-repair": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
  "tiling":         "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800&q=80",
  "grouting":       "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  "welding":        "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80",
}

// Hero background — fallback poster for video
const HERO_BG = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=85"

// Trust / social proof photos
const WORKER_AVATARS = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80",
  "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=80&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80",
]

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Describe your issue",
    desc: "Tell us what needs fixing — area, urgency, and a quick photo.",
    img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
  },
  {
    step: "02",
    title: "Pick a time slot",
    desc: "Browse live availability and lock a 30-minute window that suits you.",
    img: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80",
  },
  {
    step: "03",
    title: "Sit back & relax",
    desc: "Your verified professional arrives on time. Pay securely after the job.",
    img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80",
  },
]

const STATS = [
  { icon: <Users className="w-5 h-5" />,        value: "500+",  label: "Verified Pros"     },
  { icon: <Star className="w-5 h-5" />,          value: "4.8★",  label: "Average Rating"    },
  { icon: <CheckCircle2 className="w-5 h-5" />,  value: "12k+",  label: "Jobs Completed"    },
  { icon: <Clock className="w-5 h-5" />,         value: "< 2h",  label: "Avg Response Time" },
]

const TESTIMONIALS = [
  {
    name: "Anjali S.",
    location: "Bandra, Mumbai",
    text: "The plumber arrived within 90 minutes and fixed our seepage issue completely. Transparent pricing, zero surprises.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80",
  },
  {
    name: "Rohit M.",
    location: "Powai, Mumbai",
    text: "Booked a tiling job on Sunday evening, professional was here Monday morning. Outstanding quality work.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&q=80",
  },
  {
    name: "Meera P.",
    location: "Andheri, Mumbai",
    text: "Finally a platform that respects your time. Got the exact slot I wanted and the job was done in 2 hours.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80",
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#FAFAF9" }}>

      {/* ── Navbar ───────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-8 py-3.5"
        style={{
          backgroundColor: "rgba(255,255,255,0.94)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #0D5230, #2EB374)" }}>
            <span className="text-white font-bold text-xs">HS</span>
          </div>
          <span className="font-bold text-base sm:text-lg" style={{ color: "#0D1B12", fontFamily: "var(--font-sora)" }}>
            HomeServ
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium" style={{ color: "#4B5563" }}>
          <a href="#services" className="hover:text-[#1A9458] transition-colors">Services</a>
          <a href="#how-it-works" className="hover:text-[#1A9458] transition-colors">How it works</a>
          <a href="#reviews" className="hover:text-[#1A9458] transition-colors">Reviews</a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/auth/worker" className="hidden sm:block">
            <Button variant="ghost" size="sm">Join as Pro</Button>
          </Link>
          <Link href="/auth/customer">
            <Button variant="primary" size="sm">Book Now</Button>
          </Link>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">
        {/* Full-bleed background video */}
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover object-center"
            poster={HERO_BG}
          >
            <source src="/videos/hero-bg.mp4" type="video/mp4" />
          </video>
          {/* Dark gradient overlay — left heavy so text is legible */}
          <div className="absolute inset-0" style={{
            background: "linear-gradient(105deg, rgba(4,20,10,0.88) 0%, rgba(7,40,20,0.72) 45%, rgba(10,60,30,0.35) 75%, transparent 100%)"
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 py-20 w-full">
          <div className="max-w-2xl">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-7"
              style={{ backgroundColor: "rgba(46,179,116,0.2)", color: "#6EE7B7", border: "1px solid rgba(46,179,116,0.35)" }}>
              <MapPin className="w-3 h-3" /> Mumbai&apos;s #1 Home Repair Platform
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] mb-6 text-white"
              style={{ fontFamily: "var(--font-sora)" }}>
              Home repairs,<br />
              <span style={{
                background: "linear-gradient(135deg, #5DCB96, #2EB374, #9FE3BF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                done right.
              </span>
            </h1>

            <p className="text-base sm:text-lg mb-8 leading-relaxed" style={{ color: "#D1FAE5" }}>
              Seepage, tiling, grouting & welding — booked in under 2 minutes.<br className="hidden sm:block" />
              Verified professionals. Transparent pricing.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link href="/auth/customer">
                <Button variant="primary" size="lg" iconRight={<ArrowRight className="w-5 h-5" />}>
                  Book a Service
                </Button>
              </Link>
              <Link href="/auth/worker">
                <button className="h-12 px-6 rounded-xl font-semibold text-sm border-2 transition-all hover:bg-white/10"
                  style={{ borderColor: "rgba(255,255,255,0.35)", color: "white" }}>
                  Earn as a Pro →
                </button>
              </Link>
            </div>

            {/* Social proof avatars */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {WORKER_AVATARS.map((src, i) => (
                  <div key={i} className="w-9 h-9 rounded-full border-2 border-white/30 overflow-hidden">
                    <Image src={src} alt="Pro" width={36} height={36} className="object-cover" />
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-bold text-white">500+ verified pros</p>
                <p className="text-xs" style={{ color: "#A7F3D0" }}>available in Mumbai today</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating stats card — bottom right on desktop */}
        <div className="hidden lg:flex absolute bottom-10 right-10 gap-4 z-10">
          {STATS.map((s) => (
            <div key={s.label}
              className="flex flex-col items-center px-5 py-4 rounded-2xl min-w-[100px]"
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}>
              <span style={{ color: "#6EE7B7" }}>{s.icon}</span>
              <p className="text-2xl font-bold text-white mt-1" style={{ fontFamily: "var(--font-sora)" }}>{s.value}</p>
              <p className="text-[10px] font-medium mt-0.5" style={{ color: "#A7F3D0" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats bar (mobile) ───────────────────────────────────────────── */}
      <div className="lg:hidden grid grid-cols-4 divide-x"
        style={{ backgroundColor: "#052E16" }}>
        {STATS.map((s) => (
          <div key={s.label} className="flex flex-col items-center py-4 px-2 text-center">
            <p className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>{s.value}</p>
            <p className="text-[9px] font-medium mt-0.5" style={{ color: "#6EE7B7" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Services ─────────────────────────────────────────────────────── */}
      <section id="services" className="px-4 sm:px-8 py-16 sm:py-24 max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 inline-block"
            style={{ backgroundColor: "#EDFAF2", color: "#1A9458" }}>
            What we fix
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: "#0D1B12", fontFamily: "var(--font-sora)" }}>
            Every home repair, covered.
          </h2>
          <p className="text-base sm:text-lg max-w-xl mx-auto" style={{ color: "#6B7280" }}>
            Expert professionals for the jobs that matter most — done properly, the first time.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
          {SERVICES.map((s, i) => {
            const img = SERVICE_IMAGES[s.id] ?? SERVICE_IMAGES["seepage-repair"]
            const isWide = i === 0 // first card spans 2 cols on lg
            return (
              <Link
                key={s.id}
                href="/auth/customer"
                className={`group block ${isWide ? "sm:col-span-2 lg:col-span-1" : ""}`}
              >
                <div
                  className="relative overflow-hidden rounded-2xl h-64 sm:h-72 cursor-pointer"
                  style={{
                    boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
                    transition: "transform 600ms cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 600ms cubic-bezier(0.25,0.46,0.45,0.94)",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-6px)"
                    e.currentTarget.style.boxShadow = "0 20px 48px rgba(0,0,0,0.22)"
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.10)"
                  }}
                >
                  <Image
                    src={img}
                    alt={s.name}
                    fill
                    className="object-cover group-hover:scale-110"
                    style={{ transition: "transform 600ms cubic-bezier(0.25,0.46,0.45,0.94)", willChange: "transform" }}
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                  {/* Dark gradient from bottom — lightens slightly on hover */}
                  <div className="absolute inset-0 transition-opacity duration-400 group-hover:opacity-80" style={{
                    background: "linear-gradient(to top, rgba(4,14,8,0.88) 0%, rgba(4,14,8,0.3) 50%, transparent 100%)"
                  }} />

                  {/* Badge */}
                  {s.badge && (
                    <span className="absolute top-4 left-4 text-[10px] font-bold px-2.5 py-1 rounded-full transition-transform duration-300 group-hover:scale-105"
                      style={{ background: "linear-gradient(135deg,#1A9458,#2EB374)", color: "#fff" }}>
                      {s.badge}
                    </span>
                  )}

                  {/* Arrow chip top right — slides in from right */}
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                    style={{ backgroundColor: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)" }}>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>

                  {/* Content — slides up slightly on hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 transition-transform duration-400 group-hover:-translate-y-1">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xs font-semibold mb-1" style={{ color: "#6EE7B7" }}>
                          ⭐ {s.rating} · {s.duration}
                        </p>
                        <h3 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>
                          {s.name}
                        </h3>
                        <p className="text-xs mt-1 leading-relaxed line-clamp-2" style={{ color: "#D1FAE5" }}>
                          {s.description}
                        </p>
                      </div>
                      <div className="shrink-0 ml-4 text-right">
                        <p className="text-xs font-medium mb-0.5" style={{ color: "#A7F3D0" }}>from</p>
                        <p className="text-lg font-bold text-white">{formatINR(s.priceFrom)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-16 sm:py-24 overflow-hidden"
        style={{ background: "linear-gradient(180deg, #F0FAF5 0%, #FFFFFF 100%)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 inline-block"
              style={{ backgroundColor: "#EDFAF2", color: "#1A9458" }}>
              Simple process
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: "#0D1B12", fontFamily: "var(--font-sora)" }}>
              Booked in 3 steps
            </h2>
            <p className="text-base" style={{ color: "#6B7280" }}>From tap to confirmed — under 2 minutes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
            {HOW_IT_WORKS.map((item, i) => (
              <div key={item.step} className="group relative">

                <div
                  className="rounded-2xl overflow-hidden"
                  style={{
                    boxShadow: "0 4px 24px rgba(13,82,48,0.08)",
                    border: "1px solid rgba(46,179,116,0.10)",
                    transition: "transform 600ms cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 600ms cubic-bezier(0.25,0.46,0.45,0.94)",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-8px)"
                    e.currentTarget.style.boxShadow = "0 24px 48px rgba(13,82,48,0.18)"
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "0 4px 24px rgba(13,82,48,0.08)"
                  }}
                >
                  {/* Photo */}
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={item.img}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110"
                      style={{ transition: "transform 600ms cubic-bezier(0.25,0.46,0.45,0.94)", willChange: "transform" }}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 transition-opacity duration-400 group-hover:opacity-60"
                      style={{ background: "linear-gradient(to top, rgba(4,14,8,0.5) 0%, transparent 60%)" }} />
                    {/* Step number */}
                    <div className="absolute top-4 left-4 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-transform duration-400 group-hover:scale-110"
                      style={{ background: "linear-gradient(135deg,#0D5230,#2EB374)", color: "#fff", fontFamily: "var(--font-sora)", boxShadow: "0 4px 14px rgba(13,82,48,0.4)" }}>
                      {item.step}
                    </div>
                  </div>

                  {/* Text */}
                  <div className="p-5 transition-colors duration-300 group-hover:bg-[#F0FAF5]" style={{ backgroundColor: "#fff" }}>
                    <h3 className="font-bold text-base mb-2" style={{ color: "#0D1B12", fontFamily: "var(--font-sora)" }}>
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section id="reviews" className="py-16 sm:py-24 px-4 sm:px-8" style={{ backgroundColor: "#FAFAF9" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 inline-block"
              style={{ backgroundColor: "#EDFAF2", color: "#1A9458" }}>
              Real reviews
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: "#0D1B12", fontFamily: "var(--font-sora)" }}>
              What our customers say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="flex flex-col p-6 rounded-2xl"
                style={{ backgroundColor: "#fff", border: "1px solid rgba(46,179,116,0.12)", boxShadow: "0 2px 16px rgba(13,82,48,0.07)" }}>
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed flex-1 mb-5" style={{ color: "#374151" }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                    <Image src={t.avatar} alt={t.name} width={40} height={40} className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: "#0D1B12" }}>{t.name}</p>
                    <p className="text-xs" style={{ color: "#9CA3AF" }}>{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-8 py-10 sm:py-16">
        <div className="max-w-5xl mx-auto relative overflow-hidden rounded-3xl"
          style={{ boxShadow: "0 20px 60px rgba(13,82,48,0.25)" }}>
          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1400&q=80"
              alt="Clean modern home"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(105deg, rgba(4,20,10,0.92) 0%, rgba(10,60,30,0.82) 50%, rgba(10,60,30,0.65) 100%)" }} />
          </div>

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 px-8 sm:px-12 py-12 sm:py-14">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#6EE7B7" }}>
                Available today in Mumbai
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-sora)" }}>
                Ready to fix it<br />once and for all?
              </h2>
              <p className="text-base" style={{ color: "#A7F3D0" }}>
                Join 12,000+ homeowners who trust HomeServ.
              </p>
            </div>
            <div className="flex flex-col gap-3 shrink-0">
              <Link href="/auth/customer">
                <Button variant="primary" size="lg" iconRight={<ArrowRight className="w-5 h-5" />}
                  style={{ minWidth: 200 }}>
                  Book a Service
                </Button>
              </Link>
              <Link href="/auth/worker">
                <button className="h-12 px-6 rounded-xl font-semibold text-sm border-2 transition-all hover:bg-white/10 w-full"
                  style={{ borderColor: "rgba(255,255,255,0.3)", color: "white" }}>
                  Earn ₹40k+/month as a Pro
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="mt-auto" style={{ backgroundColor: "#0A1A0F" }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pb-10"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#1A9458,#2EB374)" }}>
                  <span className="text-white font-bold text-xs">HS</span>
                </div>
                <span className="font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>HomeServ</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                Mumbai&apos;s trusted platform for home repairs — fast, verified, and transparent.
              </p>
            </div>

            {/* Links */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#4B5563" }}>Services</p>
              <ul className="space-y-2 text-sm" style={{ color: "#9CA3AF" }}>
                <li><a href="#" className="hover:text-white transition-colors">Seepage Repair</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tiling</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Grouting</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Welding</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#4B5563" }}>Contact</p>
              <div className="space-y-2 text-sm" style={{ color: "#9CA3AF" }}>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 shrink-0" />
                  <span>+91 98765 00000</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>Mumbai, Maharashtra</span>
                </div>
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-3.5 h-3.5 shrink-0" />
                  <span>GST-compliant invoices</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6">
            <p className="text-xs" style={{ color: "#4B5563" }}>© 2026 HomeServ Technologies Pvt. Ltd. Mumbai, India.</p>
            <div className="flex gap-4 text-xs" style={{ color: "#4B5563" }}>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Refund Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
