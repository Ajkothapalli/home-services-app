"use client"

import * as React from "react"
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

export type ToastVariant = "success" | "error" | "warning" | "info"

interface ToastItem {
  id: string
  variant: ToastVariant
  message: string
}

// ── Context ───────────────────────────────────────────────────────────────────
interface ToastContextValue {
  success: (message: string) => void
  error:   (message: string) => void
  warning: (message: string) => void
  info:    (message: string) => void
}

const ToastContext = React.createContext<ToastContextValue | null>(null)

// ── Toast config ──────────────────────────────────────────────────────────────
const toastConfig: Record<ToastVariant, {
  icon: React.ReactNode
  bg: string
  border: string
  iconColor: string
  textColor: string
}> = {
  success: {
    icon: <CheckCircle2 className="w-5 h-5 shrink-0" />,
    bg: "var(--color-brand-50)",
    border: "var(--color-brand-200)",
    iconColor: "var(--color-brand-600)",
    textColor: "var(--color-brand-800)",
  },
  error: {
    icon: <AlertCircle className="w-5 h-5 shrink-0" />,
    bg: "var(--color-error-50)",
    border: "#fecaca",
    iconColor: "var(--color-error-500)",
    textColor: "var(--color-error-700)",
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5 shrink-0" />,
    bg: "var(--color-warning-50)",
    border: "#fde68a",
    iconColor: "var(--color-warning-500)",
    textColor: "var(--color-warning-700)",
  },
  info: {
    icon: <Info className="w-5 h-5 shrink-0" />,
    bg: "var(--color-info-50)",
    border: "#bfdbfe",
    iconColor: "var(--color-info-500)",
    textColor: "#1e40af",
  },
}

// ── Individual Toast ──────────────────────────────────────────────────────────
function ToastEl({ item, onRemove }: { item: ToastItem; onRemove: (id: string) => void }) {
  const cfg = toastConfig[item.variant]

  React.useEffect(() => {
    const t = setTimeout(() => onRemove(item.id), 4000)
    return () => clearTimeout(t)
  }, [item.id, onRemove])

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        "flex items-start gap-3 px-4 py-3 min-w-[280px] max-w-sm w-full",
        "animate-in slide-in-from-top-2 fade-in duration-300",
        "shadow-lg"
      )}
      style={{
        backgroundColor: cfg.bg,
        border: `1.5px solid ${cfg.border}`,
        borderRadius: "var(--radius-xl)",
      }}
    >
      <span style={{ color: cfg.iconColor, marginTop: 1 }}>{cfg.icon}</span>
      <p className="flex-1 text-sm font-medium" style={{ color: cfg.textColor }}>
        {item.message}
      </p>
      <button
        onClick={() => onRemove(item.id)}
        aria-label="Dismiss"
        className="shrink-0 rounded-full p-0.5 transition-opacity hover:opacity-60"
        style={{ color: cfg.iconColor }}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

// ── Toaster (render this once at the root layout) ─────────────────────────────
export function Toaster({ children }: { children?: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([])

  const remove = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const add = React.useCallback((variant: ToastVariant, message: string) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev.slice(-2), { id, variant, message }]) // max 3
  }, [])

  const ctx = React.useMemo<ToastContextValue>(() => ({
    success: (m) => add("success", m),
    error:   (m) => add("error",   m),
    warning: (m) => add("warning", m),
    info:    (m) => add("info",    m),
  }), [add])

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      {/* Fixed toast stack */}
      <div
        className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 items-end pointer-events-none"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastEl item={t} onRemove={remove} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used inside <Toaster />")
  return ctx
}
