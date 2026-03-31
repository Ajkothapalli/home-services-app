"use client"

import * as React from "react"
import { CreditCard, Download, ChevronDown } from "lucide-react"
import { Badge, Button, EmptyState } from "@/design-system"
import { MOCK_BOOKINGS, SERVICES } from "@/lib/mock-data"
import { formatINR } from "@/lib/utils"
import { format, parseISO } from "date-fns"

export default function PaymentsPage() {
  const payments = [...MOCK_BOOKINGS].map((b) => ({
    id:     b.id,
    service: SERVICES.find((s) => s.id === b.service)?.name ?? b.service,
    date:   b.payment.paidAt,
    method: b.payment.method,
    status: b.payment.status,
    amount: b.quote.total,
  }))

  const total = payments.filter((p) => p.status === "paid").reduce((a, p) => a + p.amount, 0)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 lg:py-8">
      <h1 className="hidden lg:block text-2xl font-bold mb-2" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
        Payments
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--color-text-secondary)" }}>All your transactions in one place</p>

      {/* Summary card */}
      <div
        className="flex items-center justify-between p-6 mb-6"
        style={{
          background: "linear-gradient(135deg, #0D5230, #1A9458, #2EB374)",
          borderRadius: "var(--radius-2xl)",
          boxShadow: "0 8px 28px rgba(26,148,88,0.3)",
        }}
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#9FE3BF" }}>Total Spent</p>
          <p className="text-3xl font-bold text-white">{formatINR(total)}</p>
          <p className="text-xs mt-1" style={{ color: "#9FE3BF" }}>{payments.length} transactions</p>
        </div>
        <CreditCard className="w-12 h-12" style={{ color: "rgba(255,255,255,0.3)" }} />
      </div>

      {/* Transactions list */}
      {payments.length === 0 ? (
        <EmptyState
          icon={<CreditCard className="w-10 h-10" />}
          title="No payments yet"
          description="Your transactions will appear here after you book a service."
        />
      ) : (
        <div
          className="overflow-hidden"
          style={{
            backgroundColor: "var(--color-neutral-0)",
            border: "1.5px solid var(--color-border-default)",
            borderRadius: "var(--radius-xl)",
          }}
        >
          {payments.map((p, i) => (
            <div
              key={p.id}
              className="flex items-center justify-between gap-4 px-5 py-4"
              style={{ borderTop: i > 0 ? "1px solid var(--color-border-default)" : "none" }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "linear-gradient(135deg, #EDFAF2, #D0F2DF)", color: "var(--color-brand-600)" }}
                >
                  <CreditCard className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: "var(--color-text-primary)" }}>
                    {p.service}
                  </p>
                  <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                    {format(parseISO(p.date), "d MMM yyyy")} · {p.method} · {p.id}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Badge
                  variant={p.status === "paid" ? "success" : "warning"}
                  badgeStyle="soft"
                  size="sm"
                >
                  {p.status}
                </Badge>
                <p className="font-bold text-sm" style={{ color: "var(--color-text-primary)" }}>
                  {formatINR(p.amount)}
                </p>
                <button
                  aria-label={`Download invoice for ${p.id}`}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--color-neutral-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB374]"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
