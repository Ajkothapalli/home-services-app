import * as React from "react"
import { cn } from "@/lib/utils"

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center px-8 py-16 rounded-[var(--radius-2xl)]",
        className
      )}
      style={{
        border: "2px dashed var(--color-border-default)",
        backgroundColor: "var(--color-neutral-50)",
      }}
    >
      {icon && (
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-5 shrink-0"
          style={{ backgroundColor: "var(--color-brand-50)" }}
        >
          <span style={{ color: "var(--color-brand-400)" }}>{icon}</span>
        </div>
      )}
      <h3
        className="text-lg font-bold mb-2"
        style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}
      >
        {title}
      </h3>
      {description && (
        <p className="text-sm max-w-xs mb-6" style={{ color: "var(--color-text-secondary)" }}>
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  )
}
