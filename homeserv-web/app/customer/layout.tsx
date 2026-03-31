"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutGrid, Wrench, CalendarDays, CreditCard, User, ChevronLeft, ChevronRight, Bell, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/customer/dashboard", label: "Home",     icon: LayoutGrid  },
  { href: "/customer/services",  label: "Services", icon: Wrench      },
  { href: "/customer/bookings",  label: "Bookings", icon: CalendarDays },
  { href: "/customer/payments",  label: "Payments", icon: CreditCard  },
  { href: "/customer/profile",   label: "Profile",  icon: User        },
]

function getPageMeta(pathname: string): { title: string; back: boolean } {
  if (pathname.startsWith("/customer/bookings/")) return { title: "Booking Details", back: true }
  if (pathname.startsWith("/customer/book/"))     return { title: "Book Service",    back: true }
  if (pathname.startsWith("/customer/services/")) return { title: "Service Details", back: true }
  if (pathname === "/customer/dashboard") return { title: "Home", back: false }
  if (pathname === "/customer/services")  return { title: "Services",    back: false }
  if (pathname === "/customer/bookings")  return { title: "My Bookings", back: false }
  if (pathname === "/customer/payments")  return { title: "Payments",    back: false }
  if (pathname === "/customer/profile")   return { title: "Profile",     back: false }
  return { title: "HomeServ", back: false }
}

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false)
  const pathname = usePathname()
  const router   = useRouter()
  const meta     = getPageMeta(pathname)

  return (
    <div className="flex h-full min-h-screen">

      {/* ── Desktop Sidebar ──────────────────────────────────────────────── */}
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
        <div className="flex items-center gap-3 px-4 py-5 shrink-0"
          style={{ borderBottom: "1px solid rgba(46,179,116,0.10)" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #0D5230, #2EB374)" }} aria-hidden="true">
            <span className="text-white font-bold text-sm">HS</span>
          </div>
          {!collapsed && (
            <span className="font-bold text-base truncate" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
              HomeServ
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1" aria-label="Customer navigation">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href)
            return (
              <Link key={href} href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB374]",
                  !active && "hover:bg-[rgba(46,179,116,0.08)]"
                )}
                style={{
                  background: active ? "linear-gradient(135deg, #0D5230, #1A9458)" : undefined,
                  color: active ? "#fff" : "var(--color-text-secondary)",
                  boxShadow: active ? "0 2px 12px rgba(26,148,88,0.25)" : undefined,
                }}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span className="text-sm font-semibold truncate">{label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Collapse toggle */}
        <button onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="mx-2 mb-4 flex items-center justify-center h-9 rounded-xl transition-colors hover:bg-[rgba(46,179,116,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB374]"
          style={{ color: "var(--color-text-secondary)" }}>
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!collapsed && <span className="ml-2 text-xs font-medium">Collapse</span>}
        </button>
      </aside>

      {/* ── Right column ─────────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col">

        {/* ── Mobile sticky header ──────────────────────────────────────── */}
        <header
          className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-14 shrink-0"
          style={{
            backgroundColor: "rgba(244,251,247,0.9)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(46,179,116,0.12)",
          }}
        >
          <div className="flex items-center gap-3">
            {meta.back ? (
              <button onClick={() => router.back()}
                className="w-9 h-9 rounded-xl flex items-center justify-center -ml-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB374]"
                style={{ color: "var(--color-brand-600)" }}
                aria-label="Go back">
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #0D5230, #2EB374)" }}>
                <span className="text-white font-bold text-xs">HS</span>
              </div>
            )}
            <span className="font-bold text-base" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
              {meta.title}
            </span>
          </div>

          {/* Right action */}
          {!meta.back && pathname === "/customer/dashboard" && (
            <button className="relative w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ border: "1.5px solid rgba(46,179,116,0.2)", backgroundColor: "white" }}
              aria-label="Notifications">
              <Bell className="w-4 h-4" style={{ color: "var(--color-text-secondary)" }} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E05C2A]" />
            </button>
          )}
        </header>

        {/* ── Main content ──────────────────────────────────────────────── */}
        <main
          className="flex-1 overflow-y-auto pb-20 lg:pb-0"
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
      </div>

      {/* ── Mobile Bottom Tab Bar ─────────────────────────────────────────── */}
      <nav className="fixed bottom-0 inset-x-0 lg:hidden z-40 flex"
        aria-label="Customer navigation"
        style={{
          backgroundColor: "rgba(244,251,247,0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(46,179,116,0.15)",
          boxShadow: "0 -4px 24px rgba(13,82,48,0.08)",
        }}
      >
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link key={href} href={href}
              className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB374] focus-visible:ring-inset"
              aria-current={active ? "page" : undefined}
            >
              <Icon className="w-5 h-5"
                style={{ color: active ? "var(--color-brand-600)" : "var(--color-neutral-400)" }} />
              <span className="text-[10px] font-semibold"
                style={{ color: active ? "var(--color-brand-600)" : "var(--color-neutral-400)" }}>
                {label}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
