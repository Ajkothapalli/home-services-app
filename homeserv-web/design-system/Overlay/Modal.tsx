"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  size?: "sm" | "md" | "lg" | "xl" | "full"
  children: React.ReactNode
}

const sizeClasses = {
  sm:   "max-w-sm",
  md:   "max-w-md",
  lg:   "max-w-lg",
  xl:   "max-w-2xl",
  full: "max-w-[95vw] max-h-[95vh]",
}

export function Modal({ open, onClose, title, description, size = "md", children }: ModalProps) {
  const closeRef    = React.useRef<HTMLButtonElement>(null)
  const titleId     = React.useId()
  const descId      = React.useId()

  // Close on Escape
  React.useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open, onClose])

  // Lock body scroll
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  // Move focus into modal when it opens (AA 2.4.3 / 2.1.2)
  React.useEffect(() => {
    if (open) {
      // small delay lets the DOM paint before focusing
      const id = setTimeout(() => closeRef.current?.focus(), 50)
      return () => clearTimeout(id)
    }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={description ? descId : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: "var(--color-surface-overlay)" }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={cn(
          "relative w-full shadow-2xl overflow-hidden",
          "animate-in fade-in zoom-in-95 duration-200",
          sizeClasses[size]
        )}
        style={{
          backgroundColor: "var(--color-surface-card)",
          borderRadius: "var(--radius-2xl)",
          border: "1px solid var(--color-border-default)",
        }}
      >
        {/* Header */}
        {(title || description) && (
          <div
            className="flex items-start justify-between gap-4 px-6 py-5"
            style={{ borderBottom: "1px solid var(--color-border-default)" }}
          >
            <div>
              {title && (
                <h2
                  id={titleId}
                  className="text-lg font-bold"
                  style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}
                >
                  {title}
                </h2>
              )}
              {description && (
                <p id={descId} className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
                  {description}
                </p>
              )}
            </div>
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Close modal"
              className="shrink-0 rounded-full p-1.5 transition-colors hover:bg-[var(--color-neutral-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB374] focus-visible:ring-offset-2"
              style={{ color: "var(--color-text-secondary)" }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Close button if no header */}
        {!title && !description && (
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 z-10 rounded-full p-1.5 transition-colors hover:bg-[var(--color-neutral-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB374] focus-visible:ring-offset-2"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Body */}
        <div className="px-6 py-6 overflow-y-auto max-h-[80vh]">{children}</div>
      </div>
    </div>
  )
}
