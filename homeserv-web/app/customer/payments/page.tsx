"use client"

import * as React from "react"
import { CreditCard, Download, TrendingUp, Wallet, CheckCircle2, Clock } from "lucide-react"
import { Badge, Button, EmptyState } from "@/design-system"
import { MOCK_BOOKINGS, SERVICES } from "@/lib/mock-data"
import { formatINR } from "@/lib/utils"
import { format, parseISO } from "date-fns"

const SERVICE_IMAGES: Record<string, string> = {
  "seepage":  "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=200&q=80",
  "tiling":   "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200&q=80",
  "grouting": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80",
  "welding":  "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=200&q=80",
}

const PAYMENT_METHOD_ICON: Record<string, React.ReactNode> = {
  upi:    <span className="text-xs font-black" style={{ color: "#5F259F" }}>UPI</span>,
  card:   <CreditCard className="w-4 h-4" />,
  cash:   <Wallet className="w-4 h-4" />,
}

export default function PaymentsPage() {
  const payments = [...MOCK_BOOKINGS].map((b) => ({
    id:      b.id,
    service: SERVICES.find((s) => s.id === b.service)?.name ?? b.service,
    serviceId: b.service,
    date:    b.payment.paidAt,
    method:  b.payment.method,
    status:  b.payment.status,
    amount:  b.quote.total,
  }))

  const paidPayments    = payments.filter((p) => p.status === "paid")
  const pendingPayments = payments.filter((p) => p.status !== "paid")
  const total           = paidPayments.reduce((a, p) => a + p.amount, 0)
  const pendingTotal    = pendingPayments.reduce((a, p) => a + p.amount, 0)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 lg:py-8">
      <h1 className="hidden lg:block text-2xl font-bold mb-2" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
        Payments
      </h1>
      <p className="text-sm mb-6 hidden lg:block" style={{ color: "var(--color-text-secondary)" }}>
        All your transactions in one place
      </p>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div
          className="p-5"
          style={{
            background: "linear-gradient(135deg, #0D5230, #1A9458, #2EB374)",
            borderRadius: "var(--radius-2xl)",
            boxShadow: "0 8px 28px rgba(26,148,88,0.3)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#9FE3BF" }}>Total Spent</p>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mb-1">{formatINR(total)}</p>
          <p className="text-xs" style={{ color: "#9FE3BF" }}>{paidPayments.length} completed</p>
        </div>

        <div
          className="p-5"
          style={{
            background: "linear-gradient(135deg, #FFFBEB, #FEF3C7)",
            border: "1.5px solid #FDE68A",
            borderRadius: "var(--radius-2xl)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#92400E" }}>Pending</p>
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#FDE68A" }}>
              <Clock className="w-4 h-4" style={{ color: "#92400E" }} />
            </div>
          </div>
          <p className="text-2xl font-bold" style={{ color: "#78350F" }}>{formatINR(pendingTotal)}</p>
          <p className="text-xs" style={{ color: "#92400E" }}>{pendingPayments.length} pending</p>
        </div>
      </div>

      {/* Transaction list */}
      {payments.length === 0 ? (
        <EmptyState
          icon={<CreditCard className="w-10 h-10" />}
          title="No payments yet"
          description="Your transactions will appear here after you book a service."
        />
      ) : (
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: "var(--color-text-secondary)" }}>
            All Transactions
          </h2>
          <div
            className="overflow-hidden"
            style={{
              backgroundColor: "var(--color-neutral-0)",
              border: "1.5px solid var(--color-border-default)",
              borderRadius: "var(--radius-2xl)",
            }}
          >
            {payments.map((p, i) => {
              const img = SERVICE_IMAGES[p.serviceId]
              return (
                <div
                  key={p.id}
                  className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[var(--color-neutral-50)]"
                  style={{ borderTop: i > 0 ? "1px solid var(--color-border-default)" : "none" }}
                >
                  {/* Service photo */}
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                    {img ? (
                      <img src={img} alt={p.service} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, #EDFAF2, #D0F2DF)" }}>
                        <CreditCard className="w-5 h-5" style={{ color: "var(--color-brand-600)" }} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: "var(--color-text-primary)" }}>
                      {p.service}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                        {format(parseISO(p.date), "d MMM yyyy")}
                      </span>
                      <span style={{ color: "var(--color-neutral-300)" }}>·</span>
                      <div className="flex items-center gap-1" style={{ color: "var(--color-text-secondary)" }}>
                        {PAYMENT_METHOD_ICON[p.method] ?? <Wallet className="w-3.5 h-3.5" />}
                        <span className="text-xs capitalize">{p.method}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="font-bold text-sm" style={{ color: "var(--color-text-primary)" }}>
                        {formatINR(p.amount)}
                      </p>
                      <Badge
                        variant={p.status === "paid" ? "success" : "warning"}
                        badgeStyle="soft"
                        size="sm"
                      >
                        {p.status}
                      </Badge>
                    </div>
                    <button
                      aria-label={`Download invoice for ${p.id}`}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--color-neutral-100)] focus-visible:outline-none"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
