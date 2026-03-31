"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutGrid, Wrench, CalendarDays, CreditCard, User, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/customer/dashboard", label: "Home",     icon: LayoutGrid  },
  { href: "/customer/services",  label: "Services", icon: Wrench      },
  { href: "/customer/bookings",  label: "Bookings", icon: CalendarDays },
  { href: "/customer/payments",  label: "Payments", icon: CreditCard  },
  { href: "/customer/profile",   label: "Profile",  icon: User        },
]

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false)
  const pathname = usePathname()

  return (
    <div className="flex h-full min-h-screen">
      {/* ── Desktop Sidebar ─────────────────────────────────────────────── */}
      <aside
        className="hidden lg:flex flex-col shrink-0 transition-all duration-300 ease-in-out"
        style={{
          width: collapsed ? 72 : 240,
          background: "linear-gradient(180deg, #F0FAF5 0%, #FFFFFF 30%)",
          borderRight: "1.5px solid rgba(46,179,116,0.12)",
          boxShadow: "2px 0 16px rgba(13,82,48,0.06)",
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-4 py-5 shrink-0"
          style={{ borderBottom: "1px solid var(--color-border-default)" }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #0D5230, #2EB374)" }}
            aria-hidden="true"
          >
            <span className="text-white font-bold text-sm">HS</span>
          </div>
          {!collapsed && (
            <span className="font-bold text-base truncate" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
              HomeServ
            </span>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 px-2 space-y-1" aria-label="Customer navigation">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB374]",
                  active
                    ? "text-white"
                    : "hover:bg-[var(--color-neutral-100)]"
                )}
                style={{
                  background: active ? "linear-gradient(135deg, #0D5230, #1A9458)" : undefined,
                  color: active ? "#fff" : "var(--color-text-secondary)",
                  boxShadow: active ? "0 2px 12px rgba(26,148,88,0.25)" : undefined,
                }}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && (
                  <span className="text-sm font-semibold truncate">{label}</span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="mx-2 mb-4 flex items-center justify-center h-9 rounded-xl transition-colors hover:bg-[var(--color-neutral-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB374]"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!collapsed && <span className="ml-2 text-xs font-medium">Collapse</span>}
        </button>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <main
        className="flex-1 min-w-0 overflow-y-auto pb-20 lg:pb-0"
        style={{
          background: `
            radial-gradient(ellipse at 15% 0%,   rgba(208,242,223,0.55) 0%, transparent 45%),
            radial-gradient(ellipse at 85% 5%,   rgba(186,230,253,0.30) 0%, transparent 40%),
            radial-gradient(ellipse at 90% 80%,  rgba(212,242,223,0.40) 0%, transparent 45%),
            radial-gradient(ellipse at 10% 90%,  rgba(253,230,138,0.18) 0%, transparent 40%),
            radial-gradient(ellipse at 50% 50%,  rgba(237,250,242,0.60) 0%, transparent 70%),
            #F4FBF7
          `,
        }}
      >
        {children}
      </main>

      {/* ── Mobile Bottom Tab Bar ────────────────────────────────────────── */}
      <nav
        className="fixed bottom-0 inset-x-0 lg:hidden z-40 flex"
        aria-label="Customer navigation"
        style={{
          backgroundColor: "rgba(244,251,247,0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(46,179,116,0.15)",
          boxShadow: "0 -4px 24px rgba(13,82,48,0.08)",
        }}
      >
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB374] focus-visible:ring-inset"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon
                className="w-5 h-5"
                style={{ color: active ? "var(--color-brand-600)" : "var(--color-neutral-400)" }}
              />
              {active && (
                <span className="text-[10px] font-bold" style={{ color: "var(--color-brand-600)" }}>
                  {label}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
