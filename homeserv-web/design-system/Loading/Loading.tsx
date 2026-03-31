import * as React from "react"
import { cn } from "@/lib/utils"
import type { AvatarProps } from "../Avatar/Avatar"

// ── Spinner ───────────────────────────────────────────────────────────────────
export interface SpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  color?: string
  className?: string
}

const spinnerSizes = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
}

export function Spinner({ size = "md", color, className }: SpinnerProps) {
  return (
    <svg
      className={cn("animate-spin", spinnerSizes[size], className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-label="Loading"
      role="status"
    >
      <circle
        className="opacity-20"
        cx="12" cy="12" r="10"
        stroke={color ?? "var(--color-brand-500)"}
        strokeWidth="4"
      />
      <path
        className="opacity-90"
        fill={color ?? "var(--color-brand-500)"}
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}

// ── Skeleton base ─────────────────────────────────────────────────────────────
function SkeletonBase({ className, style, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-2xl", className)}
      style={{ backgroundColor: "var(--color-neutral-200)", ...style }}
      aria-hidden="true"
      {...props}
    />
  )
}

// ── SkeletonText ──────────────────────────────────────────────────────────────
export function SkeletonText({ lines = 3, width }: { lines?: number; width?: string }) {
  return (
    <div className="space-y-2.5" aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBase
          key={i}
          className="h-4"
          style={{ width: i === lines - 1 ? width ?? "60%" : "100%" }}
        />
      ))}
    </div>
  )
}

// ── SkeletonAvatar ────────────────────────────────────────────────────────────
const avatarSizePx: Record<NonNullable<AvatarProps["size"]>, number> = {
  xs: 24, sm: 32, md: 40, lg: 56, xl: 72, "2xl": 96,
}

export function SkeletonAvatar({ size = "md" }: { size?: AvatarProps["size"] }) {
  const px = avatarSizePx[size ?? "md"]
  return (
    <SkeletonBase
      className="rounded-full shrink-0"
      style={{ width: px, height: px }}
    />
  )
}

// ── SkeletonCard ──────────────────────────────────────────────────────────────
export function SkeletonCard({ height = 180 }: { height?: number }) {
  return (
    <div
      className="rounded-[var(--radius-xl)] overflow-hidden p-5 space-y-4"
      style={{
        border: "1px solid var(--color-border-default)",
        backgroundColor: "var(--color-neutral-0)",
      }}
      aria-hidden="true"
    >
      <SkeletonBase style={{ height, borderRadius: "var(--radius-lg)" }} />
      <SkeletonText lines={2} />
      <SkeletonBase className="h-9 w-28 rounded-full" />
    </div>
  )
}

// ── SkeletonButton ────────────────────────────────────────────────────────────
export function SkeletonButton({ width = 120 }: { width?: number }) {
  return <SkeletonBase className="h-11 rounded-full" style={{ width }} />
}
