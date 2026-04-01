"use client"

import * as React from "react"
import { IndianRupee, Clock, TrendingUp, ArrowUpRight, Banknote, CheckCircle2, Building2 } from "lucide-react"
import { Button, Badge, Input, useToast } from "@/design-system"
import { MOCK_EARNINGS } from "@/lib/mock-data"
import { formatINR, mockDelay } from "@/lib/utils"

const SERVICE_IMAGES: Record<string, string> = {
  "Seepage Repair":  "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=200&q=80",
  "Tiling":          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200&q=80",
  "Grouting":        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80",
  "Welding":         "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=200&q=80",
}

type Tab = "all" | "paid" | "pending"

export default function WorkerEarningsPage() {
  const toast = useToast()
  const [tab, setTab]               = React.useState<Tab>("all")
  const [withdrawAmt, setWithdrawAmt] = React.useState("")
  const [withdrawing, setWithdrawing] = React.useState(false)

  const totalEarned = MOCK_EARNINGS.reduce((a, e) => a + e.amount, 0)
  const pending     = MOCK_EARNINGS.filter((e) => e.status === "pending").reduce((a, e) => a + e.amount, 0)
  const thisMonth   = MOCK_EARNINGS.filter((e) => e.date.includes("Apr")).reduce((a, e) => a + e.amount, 0)

  const filtered = MOCK_EARNINGS.filter((e) => tab === "all" ? true : e.status === tab)

  async function handleWithdraw() {
    if (!withdrawAmt || Number(withdrawAmt) <= 0) {
      toast.error("Enter a valid amount"); return
    }
    setWithdrawing(true)
    await mockDelay(1200)
    setWithdrawing(false)
    toast.success(`₹${withdrawAmt} withdrawal initiated. 1–2 business days.`)
    setWithdrawAmt("")
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 lg:py-8 space-y-6 lg:space-y-8">
      <h1 className="hidden lg:block text-2xl font-bold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
        Earnings
      </h1>

      {/* Hero earnings card */}
      <div
        className="relative overflow-hidden p-6"
        style={{
          background: "linear-gradient(135deg, #0D5230, #1A9458, #2EB374)",
          borderRadius: "var(--radius-2xl)",
          boxShadow: "0 8px 32px rgba(26,148,88,0.35)",
        }}
      >
        {/* Background pattern */}
        <div className="absolute top-0 right-0 w-48 h-48 opacity-10"
          style={{ background: "radial-gradient(circle, white 0%, transparent 70%)", transform: "translate(20%, -20%)" }} />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#9FE3BF" }}>Total Earned</p>
          <p className="text-4xl font-bold text-white mb-1">{formatINR(totalEarned)}</p>
          <p className="text-sm" style={{ color: "#9FE3BF" }}>Lifetime earnings · {MOCK_EARNINGS.length} jobs</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Pending Clearance", value: formatINR(pending),   icon: <Clock       className="w-5 h-5" />, color: "#B45309", bg: "linear-gradient(135deg, #FFFBEB, #FDE68A)" },
          { label: "This Month",        value: formatINR(thisMonth), icon: <TrendingUp   className="w-5 h-5" />, color: "#1D4ED8", bg: "linear-gradient(135deg, #EFF6FF, #BFDBFE)" },
        ].map((stat) => (
          <div key={stat.label} className="p-5 flex items-center gap-4"
            style={{ background: stat.bg, border: "1.5px solid var(--color-border-default)", borderRadius: "var(--radius-xl)" }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.7)", color: stat.color }}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>{stat.value}</p>
              <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Transaction list */}
      <div>
        <div
          className="flex gap-1 p-1 mb-4"
          role="tablist"
          style={{ backgroundColor: "var(--color-neutral-100)", borderRadius: "var(--radius-full)", width: "fit-content" }}
        >
          {(["all", "paid", "pending"] as Tab[]).map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
              className="px-4 py-1.5 text-sm font-semibold capitalize transition-all focus-visible:outline-none"
              style={{
                borderRadius: "var(--radius-full)",
                backgroundColor: tab === t ? "var(--color-neutral-0)" : "transparent",
                color: tab === t ? "var(--color-brand-700)" : "var(--color-text-secondary)",
                boxShadow: tab === t ? "var(--shadow-sm)" : "none",
              }}>
              {t}
            </button>
          ))}
        </div>

        <div className="overflow-hidden" style={{
          backgroundColor: "var(--color-neutral-0)",
          border: "1.5px solid var(--color-border-default)",
          borderRadius: "var(--radius-2xl)",
        }}>
          {filtered.map((e, i) => {
            const img = SERVICE_IMAGES[e.service]
            return (
              <div key={e.id} className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[var(--color-neutral-50)]"
                style={{ borderTop: i > 0 ? "1px solid var(--color-border-default)" : "none" }}>
                {/* Service photo */}
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                  {img ? (
                    <img src={img} alt={e.service} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, #EDFAF2, #D0F2DF)" }}>
                      <Banknote className="w-5 h-5" style={{ color: "var(--color-brand-600)" }} />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: "var(--color-text-primary)" }}>{e.service}</p>
                  <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                    {e.customerName} · {e.date}
                  </p>
                  <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{e.ref}</p>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <p className="font-bold text-sm" style={{ color: "var(--color-text-primary)" }}>
                    {formatINR(e.amount)}
                  </p>
                  <Badge
                    variant={e.status === "paid" ? "success" : e.status === "pending" ? "warning" : "info"}
                    badgeStyle="soft" size="sm"
                  >
                    {e.status}
                  </Badge>
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <p className="text-center text-sm py-8" style={{ color: "var(--color-text-secondary)" }}>
              No {tab} transactions
            </p>
          )}
        </div>
      </div>

      {/* Withdraw section */}
      <div className="p-6 space-y-4"
        style={{
          backgroundColor: "var(--color-neutral-0)",
          border: "1.5px solid var(--color-border-default)",
          borderRadius: "var(--radius-2xl)",
        }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #EDFAF2, #D0F2DF)" }}>
            <Building2 className="w-5 h-5" style={{ color: "var(--color-brand-600)" }} />
          </div>
          <div>
            <p className="font-bold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
              Withdraw to Bank
            </p>
            <div className="flex items-center gap-2 text-xs" style={{ color: "var(--color-text-secondary)" }}>
              HDFC Bank ···· 4521
              <button className="text-xs font-semibold underline" style={{ color: "var(--color-brand-600)" }}
                onClick={() => toast.info("Bank update coming soon")}>
                Change
              </button>
            </div>
          </div>
        </div>

        <Input
          label="Withdraw Amount"
          type="number"
          inputMode="numeric"
          placeholder="Enter amount"
          value={withdrawAmt}
          onChange={(e) => setWithdrawAmt(e.target.value)}
          prefix={<IndianRupee className="w-4 h-4" />}
          helperText={`Available balance: ${formatINR(totalEarned - pending)}`}
        />

        <Button variant="primary" size="lg" fullWidth loading={withdrawing}
          iconLeft={!withdrawing ? <ArrowUpRight className="w-5 h-5" /> : undefined}
          onClick={handleWithdraw}>
          Withdraw to Bank
        </Button>

        <p className="text-xs text-center" style={{ color: "var(--color-text-secondary)" }}>
          Processed in 1–2 business days · Zero withdrawal fees
        </p>
      </div>
    </div>
  )
}
