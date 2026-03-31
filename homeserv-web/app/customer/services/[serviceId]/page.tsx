"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowRight, Clock, Star, ChevronLeft, Droplets, Grid3x3, Layers, Zap, CheckCircle2 } from "lucide-react"
import { Button, Badge, Rating, Avatar } from "@/design-system"
import { SERVICES, WORKERS } from "@/lib/mock-data"
import { formatINR } from "@/lib/utils"

const ICON_MAP: Record<string, React.ReactNode> = {
  droplets:  <Droplets className="w-10 h-10" />,
  "grid-3x3": <Grid3x3 className="w-10 h-10" />,
  layers:    <Layers className="w-10 h-10" />,
  zap:       <Zap className="w-10 h-10" />,
}

const INCLUDES: Record<string, string[]> = {
  seepage:  ["Leak detection & inspection", "Crack sealing & waterproofing", "Pipe joint repair", "Post-work inspection"],
  tiling:   ["Surface preparation", "Adhesive & tile laying", "Grouting & finishing", "Clean-up included"],
  grouting: ["Old grout removal", "Re-grouting all joints", "Anti-fungal treatment", "Polishing & clean-up"],
  welding:  ["Material assessment", "Welding & fabrication", "Grinding & smoothing", "Rust-proofing coat"],
}

export default function ServiceDetailPage() {
  const params = useParams()
  const serviceId = params.serviceId as string
  const service = SERVICES.find((s) => s.id === serviceId)

  if (!service) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>Service not found</p>
        <Link href="/customer/services"><Button variant="outline">Back to Services</Button></Link>
      </div>
    )
  }

  const eligibleWorkers = WORKERS.filter((w) => (w.skills as readonly string[]).includes(service.id))

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 lg:py-8">
      {/* Back — desktop only */}
      <Link
        href="/customer/services"
        className="hidden lg:inline-flex items-center gap-1 text-sm font-semibold mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB374] rounded"
        style={{ color: "var(--color-brand-600)" }}
      >
        <ChevronLeft className="w-4 h-4" /> All Services
      </Link>

      {/* Hero card */}
      <div
        className="relative p-5 sm:p-8 mb-6"
        style={{
          background: "linear-gradient(135deg, #EDFAF2 0%, #D0F2DF 50%, #9FE3BF 100%)",
          borderRadius: "var(--radius-2xl)",
          border: "1.5px solid var(--color-brand-200)",
        }}
      >
        {service.badge && (
          <div className="absolute top-5 right-5">
            <Badge variant="default" badgeStyle="filled">{service.badge}</Badge>
          </div>
        )}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: "linear-gradient(135deg, #0D5230, #2EB374)", color: "#fff" }}
        >
          {ICON_MAP[service.icon]}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: "var(--color-brand-900)", fontFamily: "var(--font-sora)" }}>
          {service.name}
        </h1>
        <p className="text-base mb-5" style={{ color: "var(--color-brand-800)" }}>{service.description}</p>

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-1.5">
            <Rating value={service.rating} size="sm" showValue />
            <span className="text-sm" style={{ color: "var(--color-brand-700)" }}>({service.reviews} reviews)</span>
          </div>
          <span style={{ color: "var(--color-brand-400)" }}>·</span>
          <div className="flex items-center gap-1 text-sm" style={{ color: "var(--color-brand-700)" }}>
            <Clock className="w-4 h-4" />{service.duration}
          </div>
          <span style={{ color: "var(--color-brand-400)" }}>·</span>
          <span className="text-sm font-bold" style={{ color: "var(--color-brand-700)" }}>
            from {formatINR(service.priceFrom)}
          </span>
        </div>
      </div>

      {/* What's included */}
      <div
        className="p-6 mb-6"
        style={{
          backgroundColor: "var(--color-neutral-0)",
          border: "1.5px solid var(--color-border-default)",
          borderRadius: "var(--radius-xl)",
        }}
      >
        <h2 className="font-bold text-base mb-4" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
          What&apos;s included
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(INCLUDES[service.id] ?? []).map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm" style={{ color: "var(--color-text-primary)" }}>
              <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "var(--color-brand-500)" }} />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Available pros */}
      {eligibleWorkers.length > 0 && (
        <div
          className="p-6 mb-8"
          style={{
            backgroundColor: "var(--color-neutral-0)",
            border: "1.5px solid var(--color-border-default)",
            borderRadius: "var(--radius-xl)",
          }}
        >
          <h2 className="font-bold text-base mb-4" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
            Available Professionals
          </h2>
          <div className="space-y-4">
            {eligibleWorkers.map((w) => (
              <div key={w.id} className="flex items-center gap-3">
                <Avatar name={w.name} size="md" status="online" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>{w.name}</p>
                  <div className="flex items-center gap-2">
                    <Rating value={w.rating} size="sm" showValue />
                    <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                      {w.jobsCompleted} jobs · {w.distance}
                    </span>
                  </div>
                </div>
                <Badge variant="success" badgeStyle="soft" size="sm">{w.distance}</Badge>
              </div>
            ))}
          </div>
          <p className="text-xs mt-3" style={{ color: "var(--color-text-secondary)" }}>
            Best available professional will be auto-assigned after booking.
          </p>
        </div>
      )}

      {/* CTA */}
      <div className="sticky bottom-6 lg:static">
        <Link href={`/customer/book/${service.id}`}>
          <Button variant="primary" size="lg" fullWidth iconRight={<ArrowRight className="w-5 h-5" />}>
            Book Now — from {formatINR(service.priceFrom)}
          </Button>
        </Link>
      </div>
    </div>
  )
}
