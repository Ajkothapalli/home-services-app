"use client"

import * as React from "react"
import Link from "next/link"
import { Search, Star, Clock, ChevronRight, Sparkles } from "lucide-react"
import { Badge, Rating } from "@/design-system"
import { SERVICES } from "@/lib/mock-data"
import { formatINR } from "@/lib/utils"

const SERVICE_IMAGES: Record<string, string> = {
  "seepage":  "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&q=80",
  "tiling":   "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
  "grouting": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  "welding":  "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80",
}

export default function ServicesPage() {
  const [query, setQuery] = React.useState("")

  const filtered = SERVICES.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.description.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 lg:py-8">
      {/* Header */}
      <div className="hidden lg:block mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5" style={{ color: "var(--color-brand-500)" }} />
          <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--color-brand-600)" }}>
            Our Services
          </span>
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
          What do you need fixed?
        </h1>
        <p className="text-base" style={{ color: "var(--color-text-secondary)" }}>
          Verified professionals across India · Same-day availability
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-8 max-w-lg">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none" style={{ color: "var(--color-text-secondary)" }}>
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          placeholder="Search services…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 text-sm bg-white border outline-none transition-all"
          style={{
            borderColor: "var(--color-border-default)",
            borderRadius: "var(--radius-xl)",
            color: "var(--color-text-primary)",
            boxShadow: "var(--shadow-xs)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--color-border-focus)"
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(46,179,116,0.15)"
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--color-border-default)"
            e.currentTarget.style.boxShadow = "var(--shadow-xs)"
          }}
        />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-semibold mb-2" style={{ color: "var(--color-text-primary)" }}>No services found</p>
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>Try a different search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
          {filtered.map((s) => {
            const img = SERVICE_IMAGES[s.id]
            return (
              <Link key={s.id} href={`/customer/services/${s.id}`} className="block">
                <div
                  className="group cursor-pointer overflow-hidden"
                  style={{
                    borderRadius: "var(--radius-2xl)",
                    border: "1.5px solid var(--color-border-default)",
                    boxShadow: "var(--shadow-sm)",
                    backgroundColor: "var(--color-neutral-0)",
                    transition: "transform 500ms cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 500ms cubic-bezier(0.25,0.46,0.45,0.94)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)"
                    e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.15)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "var(--shadow-sm)"
                  }}
                >
                  {/* Photo */}
                  <div className="relative h-48 overflow-hidden">
                    {img ? (
                      <img
                        src={img}
                        alt={s.name}
                        className="w-full h-full object-cover"
                        style={{
                          transform: "scale(1)",
                          transition: "transform 500ms cubic-bezier(0.25,0.46,0.45,0.94)",
                          willChange: "transform",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.06)" }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)" }}
                      />
                    ) : (
                      <div className="w-full h-full" style={{ background: "linear-gradient(135deg, #EDFAF2, #D0F2DF)" }} />
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)" }} />
                    {/* Price badge */}
                    <div className="absolute bottom-3 left-4">
                      <span className="text-white font-bold text-lg drop-shadow">
                        from {formatINR(s.priceFrom)}
                      </span>
                    </div>
                    {s.badge && (
                      <div className="absolute top-3 right-3">
                        <Badge variant="default" badgeStyle="filled" size="sm">{s.badge}</Badge>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h2 className="font-bold text-lg leading-tight" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
                        {s.name}
                      </h2>
                      <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, #EDFAF2, #D0F2DF)" }}>
                        <ChevronRight className="w-4 h-4" style={{ color: "var(--color-brand-600)" }} />
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--color-text-secondary)" }}>
                      {s.description}
                    </p>
                    <div className="flex items-center gap-4 pt-3" style={{ borderTop: "1px solid var(--color-border-default)" }}>
                      <div className="flex items-center gap-1.5">
                        <Rating value={s.rating} size="sm" showValue />
                        <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>({s.reviews})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" style={{ color: "var(--color-text-secondary)" }} />
                        <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{s.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
