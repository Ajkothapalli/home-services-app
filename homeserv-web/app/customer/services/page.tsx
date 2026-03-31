"use client"

import * as React from "react"
import Link from "next/link"
import { Search, Droplets, Grid3x3, Layers, Zap } from "lucide-react"
import { Input, Rating, Badge } from "@/design-system"
import { SERVICES } from "@/lib/mock-data"
import { formatINR } from "@/lib/utils"

const ICON_MAP: Record<string, React.ReactNode> = {
  droplets:  <Droplets className="w-8 h-8" />,
  "grid-3x3": <Grid3x3 className="w-8 h-8" />,
  layers:    <Layers className="w-8 h-8" />,
  zap:       <Zap className="w-8 h-8" />,
}

export default function ServicesPage() {
  const [query, setQuery] = React.useState("")

  const filtered = SERVICES.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.description.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
          Services
        </h1>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Verified professionals for every home repair need
        </p>
      </div>

      {/* Search */}
      <div className="mb-8 max-w-md">
        <Input
          placeholder="Search services…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          prefix={<Search className="w-4 h-4" />}
          aria-label="Search services"
        />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-semibold mb-2" style={{ color: "var(--color-text-primary)" }}>No services found</p>
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>Try a different search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {filtered.map((s) => (
            <Link key={s.id} href={`/customer/services/${s.id}`} className="group block">
              <div
                className="relative flex gap-5 p-5 cursor-pointer transition-all duration-200 group-hover:scale-[1.01]"
                style={{
                  backgroundColor: "var(--color-neutral-0)",
                  border: "1.5px solid var(--color-border-default)",
                  borderRadius: "var(--radius-2xl)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                {s.badge && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="default" badgeStyle="filled" size="sm">{s.badge}</Badge>
                  </div>
                )}

                {/* Icon */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: "linear-gradient(135deg, #EDFAF2, #D0F2DF)", color: "var(--color-brand-600)" }}
                >
                  {ICON_MAP[s.icon]}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-base mb-1" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
                    {s.name}
                  </h2>
                  <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--color-text-secondary)" }}>
                    {s.description}
                  </p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Rating value={s.rating} size="sm" showValue />
                    <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>({s.reviews})</span>
                    <span style={{ color: "var(--color-neutral-300)" }}>·</span>
                    <span className="text-xs font-semibold" style={{ color: "var(--color-brand-600)" }}>
                      from {formatINR(s.priceFrom)}
                    </span>
                    <span style={{ color: "var(--color-neutral-300)" }}>·</span>
                    <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{s.duration}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
