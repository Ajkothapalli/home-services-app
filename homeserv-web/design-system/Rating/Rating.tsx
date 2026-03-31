"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface RatingProps {
  value: number
  max?: number
  interactive?: boolean
  onChange?: (value: number) => void
  size?: "sm" | "md" | "lg"
  showValue?: boolean
  className?: string
}

const starSizes = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-7 h-7" }
const textSizes = { sm: "text-xs", md: "text-sm", lg: "text-lg" }

function Star({
  fill,
  size,
  interactive,
  ariaLabel,
  onMouseEnter,
  onClick,
}: {
  fill: "full" | "half" | "empty"
  size: "sm" | "md" | "lg"
  interactive?: boolean
  ariaLabel?: string
  onMouseEnter?: () => void
  onClick?: () => void
}) {
  const dim = starSizes[size]
  const filled  = fill === "full"  ? "#F5A623" : "none"
  const stroked = fill === "empty" ? "var(--color-neutral-300)" : "#F5A623"

  if (!interactive) {
    // Decorative star — parent container carries the accessible label
    return (
      <svg
        className={dim}
        viewBox="0 0 24 24"
        fill={filled}
        stroke={stroked}
        strokeWidth={1.8}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {fill === "half" ? (
          <>
            <defs>
              <linearGradient id="half-fill">
                <stop offset="50%" stopColor="#F5A623" />
                <stop offset="50%" stopColor="none" stopOpacity={0} />
              </linearGradient>
            </defs>
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill="url(#half-fill)"
              stroke="#F5A623"
              strokeWidth={1.8}
            />
          </>
        ) : (
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        )}
      </svg>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      aria-label={ariaLabel}
      className={cn(
        "relative shrink-0 transition-transform rounded-sm",
        "cursor-pointer hover:scale-110",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5A623] focus-visible:ring-offset-1"
      )}
    >
      <svg
        className={dim}
        viewBox="0 0 24 24"
        fill={filled}
        stroke={stroked}
        strokeWidth={1.8}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    </button>
  )
}

export function Rating({
  value,
  max = 5,
  interactive = false,
  onChange,
  size = "md",
  showValue = false,
  className,
}: RatingProps) {
  const [hovered, setHovered] = React.useState<number | null>(null)
  const display = hovered ?? value

  function getFill(index: number): "full" | "half" | "empty" {
    const pos = index + 1
    if (display >= pos) return "full"
    if (display >= pos - 0.5) return "half"
    return "empty"
  }

  // Keyboard: arrow left/right to change value (AA 2.1.1)
  function handleKeyDown(e: React.KeyboardEvent) {
    if (!interactive) return
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault()
      onChange?.(Math.min(max, value + 1))
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault()
      onChange?.(Math.max(1, value - 1))
    }
  }

  if (!interactive) {
    // Display-only: announce as image with label (AA 1.1.1)
    return (
      <div
        className={cn("inline-flex items-center gap-1", className)}
        role="img"
        aria-label={`${value.toFixed(1)} out of ${max} stars`}
      >
        {Array.from({ length: max }).map((_, i) => (
          <Star key={i} fill={getFill(i)} size={size} />
        ))}
        {showValue && (
          <span
            className={cn("font-semibold ml-1", textSizes[size])}
            style={{ color: "var(--color-text-primary)" }}
            aria-hidden="true"
          >
            {value.toFixed(1)}
          </span>
        )}
      </div>
    )
  }

  return (
    <div
      className={cn("inline-flex items-center gap-1", className)}
      onMouseLeave={() => setHovered(null)}
      onKeyDown={handleKeyDown}
      role="group"
      aria-label={`Rating: ${value} out of ${max} stars. Use arrow keys to adjust.`}
    >
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          fill={getFill(i)}
          size={size}
          interactive
          ariaLabel={`${i + 1} out of ${max} star${i + 1 === 1 ? "" : "s"}`}
          onMouseEnter={() => setHovered(i + 1)}
          onClick={() => onChange?.(i + 1)}
        />
      ))}
      {showValue && (
        <span
          className={cn("font-semibold ml-1", textSizes[size])}
          style={{ color: "var(--color-text-primary)" }}
          aria-hidden="true"
        >
          {value.toFixed(1)}
        </span>
      )}
    </div>
  )
}
