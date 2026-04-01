"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, ClipboardList, CalendarCheck, TrendingUp, User, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/worker/dashboard",    label: "Dashboard",   icon: LayoutDashboard },
  { href: "/worker/jobs",         label: "Jobs",        icon: ClipboardList   },
  { href: "/worker/availability", label: "Schedule",    icon: CalendarCheck   },
  { href: "/worker/earnings",     label: "Earnings",    icon: TrendingUp      },
  { href: "/worker/profile",      label: "Profile",     icon: User            },
]

function getPageMeta(pathname: string): { title: string; back: boolean } {
  if (pathname.startsWith("/worker/jobs/")) return { title: "Job Details", back: true }
  if (pathname === "/worker/dashboard")    return { title: "Dashboard",    back: false }
  if (pathname === "/worker/jobs")         return { title: "My Jobs",      back: false }
  if (pathname === "/worker/availability") return { title: "Schedule",     back: false }
  if (pathname === "/worker/earnings")     return { title: "Earnings",     back: false }
  if (pathname === "/worker/profile")      return { title: "Profile",      back: false }
  return { title: "Pro Portal", back: false }
}

export default function WorkerLayout({ children }: { children: React.ReactNode }) {
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
          <img src="/images/logo.png" alt="HomeServ" className="w-16 h-16 rounded-xl object-cover shrink-0" aria-hidden="true" />
          {!collapsed && (
            <div>
              <p className="font-bold text-sm truncate" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>HomeServ</p>
              <p className="text-[10px] font-medium" style={{ color: "var(--color-brand-600)" }}>Pro Portal</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1" aria-label="Worker navigation">
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
                  background: active ? "linear-gradient(135deg, #07361F, #1A9458)" : undefined,
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
          className="lg:hidden sticky top-0 z-30 flex items-center gap-3 px-4 h-14 shrink-0"
          style={{
            backgroundColor: "rgba(244,251,247,0.9)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(46,179,116,0.12)",
          }}
        >
          {meta.back ? (
            <button onClick={() => router.back()}
              className="w-9 h-9 rounded-xl flex items-center justify-center -ml-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB374]"
              style={{ color: "var(--color-brand-600)" }}
              aria-label="Go back">
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <img src="/images/logo.png" alt="HomeServ" className="w-16 h-16 rounded-xl object-cover shrink-0" />
          )}
          <span className="font-bold text-base" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
            {meta.title}
          </span>
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
              #F4FBF7
            `,
          }}
        >
          {children}
        </main>
      </div>

      {/* ── Mobile Bottom Tab Bar ─────────────────────────────────────────── */}
      <nav className="fixed bottom-0 inset-x-0 lg:hidden z-40 flex"
        aria-label="Worker navigation"
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
