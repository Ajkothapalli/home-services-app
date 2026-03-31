"use client"

import * as React from "react"
import { X } from "lucide-react"

export interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  const closeRef = React.useRef<HTMLButtonElement>(null)
  const titleId  = React.useId()

  React.useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open, onClose])

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  // Move focus into sheet when it opens (AA 2.4.3)
  React.useEffect(() => {
    if (open) {
      const id = setTimeout(() => closeRef.current?.focus(), 50)
      return () => clearTimeout(id)
    }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: "var(--color-surface-overlay)" }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet — slides up from bottom */}
      <div
        className="relative w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300"
        style={{
          backgroundColor: "var(--color-surface-card)",
          borderRadius: "var(--radius-2xl) var(--radius-2xl) 0 0",
          border: "1px solid var(--color-border-default)",
          borderBottom: "none",
          boxShadow: "0 -8px 32px rgba(0,0,0,0.18)",
        }}
      >
        {/* Drag handle — decorative */}
        <div className="flex justify-center pt-3 pb-1" aria-hidden="true">
          <div
            className="w-10 h-1 rounded-full"
            style={{ backgroundColor: "var(--color-neutral-300)" }}
          />
        </div>

        {/* Header */}
        {title && (
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: "1px solid var(--color-border-default)" }}
          >
            <h2
              id={titleId}
              className="text-lg font-bold"
              style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}
            >
              {title}
            </h2>
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Close"
              className="rounded-full p-1.5 transition-colors hover:bg-[var(--color-neutral-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB374] focus-visible:ring-offset-2"
              style={{ color: "var(--color-text-secondary)" }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* If no title, place hidden close button for focus target */}
        {!title && (
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 z-10 rounded-full p-1.5 transition-colors hover:bg-[var(--color-neutral-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB374] focus-visible:ring-offset-2"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  )
}
