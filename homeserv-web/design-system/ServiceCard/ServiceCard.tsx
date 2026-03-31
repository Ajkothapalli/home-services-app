"use client"

import * as React from "react"
import { Star, Clock, Droplets, Grid3x3, Layers, Zap, Wrench } from "lucide-react"
import { formatINR } from "@/lib/utils"
import { Button } from "../Button/Button"
import { Badge } from "../Badge/Badge"
import { Rating } from "../Rating/Rating"

export interface ServiceCardProps {
  id: string
  icon?: React.ReactNode
  iconName?: "droplets" | "grid-3x3" | "layers" | "zap"
  name: string
  description: string
  priceFrom: number
  rating: number
  reviewCount: number
  duration: string
  badge?: string
  onBook: () => void
}

const iconMap: Record<string, React.ReactNode> = {
  "droplets":  <Droplets className="w-7 h-7" />,
  "grid-3x3":  <Grid3x3 className="w-7 h-7" />,
  "layers":    <Layers className="w-7 h-7" />,
  "zap":       <Zap className="w-7 h-7" />,
}

export function ServiceCard({
  iconName,
  icon,
  name,
  description,
  priceFrom,
  rating,
  reviewCount,
  duration,
  badge,
  onBook,
}: ServiceCardProps) {
  const [hovered, setHovered] = React.useState(false)
  const renderedIcon = icon ?? (iconName ? iconMap[iconName] : <Wrench className="w-7 h-7" />)

  return (
    <div
      className="relative flex flex-col overflow-hidden cursor-default"
      style={{
        borderRadius: "var(--radius-2xl)",
        backgroundColor: "var(--color-surface-card)",
        border: "1.5px solid var(--color-border-default)",
        boxShadow: hovered ? "var(--shadow-xl)" : "var(--shadow-sm)",
        transform: hovered ? "scale(1.02) translateY(-2px)" : "scale(1)",
        transition: "box-shadow 250ms ease, transform 220ms ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Badge ribbon */}
      {badge && (
        <div className="absolute top-4 right-4 z-10">
          <Badge variant="default" size="sm" badgeStyle="filled">{badge}</Badge>
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        {/* Icon circle */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shrink-0"
          style={{
            background: hovered
              ? "linear-gradient(135deg, #0D5230, #2EB374)"
              : "linear-gradient(135deg, #EDFAF2, #D0F2DF)",
            color: hovered ? "#ffffff" : "var(--color-brand-600)",
            transition: "background 300ms ease, color 300ms ease",
          }}
        >
          {renderedIcon}
        </div>

        {/* Name + description */}
        <h3
          className="text-lg font-bold mb-1"
          style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}
        >
          {name}
        </h3>
        <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: "var(--color-text-secondary)" }}>
          {description}
        </p>

        {/* Divider */}
        <div className="my-3" style={{ borderTop: "1px solid var(--color-border-default)" }} />

        {/* Meta row */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <div className="flex items-center gap-1">
            <Rating value={rating} size="sm" showValue />
            <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
              ({reviewCount})
            </span>
          </div>
          <span style={{ color: "var(--color-neutral-300)" }}>·</span>
          <div className="flex items-center gap-1 text-xs" style={{ color: "var(--color-text-secondary)" }}>
            <Clock className="w-3.5 h-3.5" />
            {duration}
          </div>
          <span style={{ color: "var(--color-neutral-300)" }}>·</span>
          <span className="text-xs font-semibold" style={{ color: "var(--color-brand-600)" }}>
            from {formatINR(priceFrom)}
          </span>
        </div>

        {/* CTA */}
        <Button variant="primary" size="md" fullWidth onClick={onBook}>
          Book Now
        </Button>
      </div>
    </div>
  )
}
