import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps {
  variant?: "default" | "success" | "warning" | "error" | "info" | "neutral"
  size?: "sm" | "md" | "lg"
  badgeStyle?: "filled" | "soft" | "outline"
  dot?: boolean
  children: React.ReactNode
  className?: string
}

type ColorSet = {
  filled: React.CSSProperties
  soft: React.CSSProperties
  outline: React.CSSProperties
  dot: string
}

const colorMap: Record<NonNullable<BadgeProps["variant"]>, ColorSet> = {
  default: {
    filled:  { background: "linear-gradient(135deg, #1A9458, #2EB374)", color: "#fff" },
    soft:    { backgroundColor: "var(--color-brand-50)", color: "var(--color-brand-700)", border: "1px solid var(--color-brand-200)" },
    outline: { backgroundColor: "transparent", color: "var(--color-brand-600)", border: "1.5px solid var(--color-brand-400)" },
    dot: "var(--color-brand-500)",
  },
  success: {
    filled:  { backgroundColor: "var(--color-success-500)", color: "#fff" },
    soft:    { backgroundColor: "var(--color-success-50)", color: "var(--color-success-700)", border: "1px solid #bbf7d0" },
    outline: { backgroundColor: "transparent", color: "var(--color-success-700)", border: "1.5px solid var(--color-success-500)" },
    dot: "var(--color-success-500)",
  },
  warning: {
    filled:  { backgroundColor: "var(--color-warning-500)", color: "#fff" },
    soft:    { backgroundColor: "var(--color-warning-50)", color: "var(--color-warning-700)", border: "1px solid #fde68a" },
    outline: { backgroundColor: "transparent", color: "var(--color-warning-700)", border: "1.5px solid var(--color-warning-500)" },
    dot: "var(--color-warning-500)",
  },
  error: {
    filled:  { backgroundColor: "var(--color-error-500)", color: "#fff" },
    soft:    { backgroundColor: "var(--color-error-50)", color: "var(--color-error-700)", border: "1px solid #fecaca" },
    outline: { backgroundColor: "transparent", color: "var(--color-error-700)", border: "1.5px solid var(--color-error-500)" },
    dot: "var(--color-error-500)",
  },
  info: {
    filled:  { backgroundColor: "var(--color-info-500)", color: "#fff" },
    soft:    { backgroundColor: "var(--color-info-50)", color: "#1d4ed8", border: "1px solid #bfdbfe" },
    outline: { backgroundColor: "transparent", color: "#1d4ed8", border: "1.5px solid var(--color-info-500)" },
    dot: "var(--color-info-500)",
  },
  neutral: {
    filled:  { backgroundColor: "var(--color-neutral-600)", color: "#fff" },
    soft:    { backgroundColor: "var(--color-neutral-100)", color: "var(--color-neutral-600)", border: "1px solid var(--color-neutral-200)" },
    outline: { backgroundColor: "transparent", color: "var(--color-neutral-500)", border: "1.5px solid var(--color-neutral-300)" },
    dot: "var(--color-neutral-400)",
  },
}

const sizeClasses = {
  sm: "text-[10px] px-2 py-0.5 gap-1",
  md: "text-xs px-2.5 py-1 gap-1.5",
  lg: "text-sm px-3 py-1.5 gap-2",
}

const dotSizes = { sm: "w-1.5 h-1.5", md: "w-2 h-2", lg: "w-2.5 h-2.5" }

export function Badge({
  variant = "default",
  size = "md",
  badgeStyle = "soft",
  dot = false,
  children,
  className,
}: BadgeProps) {
  const colors = colorMap[variant][badgeStyle]

  return (
    <span
      className={cn(
        "inline-flex items-center font-semibold rounded-full",
        sizeClasses[size],
        className
      )}
      style={colors}
    >
      {dot && (
        <span
          className={cn("rounded-full shrink-0", dotSizes[size])}
          style={{ backgroundColor: colorMap[variant].dot }}
        />
      )}
      {children}
    </span>
  )
}
