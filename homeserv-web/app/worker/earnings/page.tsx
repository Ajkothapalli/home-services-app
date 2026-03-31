"use client"

import * as React from "react"
import { IndianRupee, Clock, TrendingUp, ArrowUpRight } from "lucide-react"
import { Button, Badge, Input, useToast } from "@/design-system"
import { MOCK_EARNINGS } from "@/lib/mock-data"
import { formatINR, mockDelay } from "@/lib/utils"

type Tab = "all" | "paid" | "pending"

export default function WorkerEarningsPage() {
  const toast = useToast()
  const [tab, setTab]               = React.useState<Tab>("all")
  const [withdrawAmt, setWithdrawAmt] = React.useState("")
  const [withdrawing, setWithdrawing] = React.useState(false)

  const totalEarned  = MOCK_EARNINGS.reduce((a, e) => a + e.amount, 0)
  const pending      = MOCK_EARNINGS.filter((e) => e.status === "pending").reduce((a, e) => a + e.amount, 0)
  const thisMonth    = MOCK_EARNINGS.filter((e) => e.date.includes("Apr")).reduce((a, e) => a + e.amount, 0)

  const filtered = MOCK_EARNINGS.filter((e) =>
    tab === "all" ? true : e.status === tab
  )

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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <h1 className="text-2xl font-bold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
        Earnings
      </h1>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Earned",       value: formatINR(totalEarned), icon: <IndianRupee className="w-5 h-5" />, color: "var(--color-brand-600)",  bg: "linear-gradient(135deg, #EDFAF2, #D0F2DF)" },
          { label: "Pending Clearance",  value: formatINR(pending),     icon: <Clock       className="w-5 h-5" />, color: "#B45309",                  bg: "linear-gradient(135deg, #FFFBEB, #FDE68A)" },
          { label: "This Month",         value: formatINR(thisMonth),   icon: <TrendingUp   className="w-5 h-5" />, color: "#1D4ED8",                  bg: "linear-gradient(135deg, #EFF6FF, #BFDBFE)" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-4 flex flex-col"
            style={{ background: stat.bg, border: "1.5px solid var(--color-border-default)", borderRadius: "var(--radius-xl)" }}
          >
            <span style={{ color: stat.color }}>{stat.icon}</span>
            <p className="text-lg font-bold mt-2" style={{ color: "var(--color-text-primary)" }}>{stat.value}</p>
            <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div>
        <div
          className="flex gap-1 p-1 mb-5"
          role="tablist"
          aria-label="Earnings filter"
          style={{ backgroundColor: "var(--color-neutral-100)", borderRadius: "var(--radius-full)", width: "fit-content" }}
        >
          {(["all", "paid", "pending"] as Tab[]).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className="px-4 py-1.5 text-sm font-semibold capitalize transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB374]"
              style={{
                borderRadius: "var(--radius-full)",
                backgroundColor: tab === t ? "var(--color-neutral-0)" : "transparent",
                color: tab === t ? "var(--color-brand-700)" : "var(--color-text-secondary)",
                boxShadow: tab === t ? "var(--shadow-sm)" : "none",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <div
          className="overflow-hidden"
          style={{
            backgroundColor: "var(--color-neutral-0)",
            border: "1.5px solid var(--color-border-default)",
            borderRadius: "var(--radius-xl)",
          }}
        >
          {filtered.map((e, i) => (
            <div
              key={e.id}
              className="flex items-center justify-between gap-4 px-5 py-4"
              style={{ borderTop: i > 0 ? "1px solid var(--color-border-default)" : "none" }}
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>{e.service}</p>
                <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                  {e.customerName} · {e.date} · {e.ref}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Badge
                  variant={e.status === "paid" ? "success" : e.status === "pending" ? "warning" : "info"}
                  badgeStyle="soft" size="sm"
                >
                  {e.status}
                </Badge>
                <p className="font-bold text-sm" style={{ color: "var(--color-text-primary)" }}>
                  {formatINR(e.amount)}
                </p>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-sm py-8" style={{ color: "var(--color-text-secondary)" }}>
              No {tab} transactions
            </p>
          )}
        </div>
      </div>

      {/* Withdraw section */}
      <div
        className="p-6 space-y-4"
        style={{
          backgroundColor: "var(--color-neutral-0)",
          border: "1.5px solid var(--color-border-default)",
          borderRadius: "var(--radius-xl)",
        }}
      >
        <div className="flex items-center justify-between">
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

        <Button
          variant="primary"
          size="lg"
          fullWidth
          loading={withdrawing}
          iconLeft={!withdrawing ? <ArrowUpRight className="w-5 h-5" /> : undefined}
          onClick={handleWithdraw}
        >
          Withdraw to Bank
        </Button>

        <p className="text-xs text-center" style={{ color: "var(--color-text-secondary)" }}>
          Processed in 1–2 business days
        </p>
      </div>
    </div>
  )
}
