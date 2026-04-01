"use client"

import * as React from "react"
import { User, Phone, Mail, MapPin, LogOut, ChevronRight, Shield, Star, Bell, FileText, HelpCircle } from "lucide-react"
import { Button, Avatar, Badge, Input, Rating, useToast } from "@/design-system"
import { WORKERS, MOCK_EARNINGS } from "@/lib/mock-data"
import { mockDelay, formatINR } from "@/lib/utils"

const COVER_PHOTO = "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80"

export default function WorkerProfile() {
  const worker = WORKERS[0]
  const toast  = useToast()
  const [name,  setName]  = React.useState<string>(worker.name)
  const [email, setEmail] = React.useState<string>("ramesh@example.com")
  const [city,  setCity]  = React.useState<string>(worker.city)
  const [saving, setSaving] = React.useState(false)

  const totalEarned = MOCK_EARNINGS.reduce((a, e) => a + e.amount, 0)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await mockDelay(800)
    setSaving(false)
    toast.success("Profile updated!")
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Cover photo + avatar */}
      <div className="relative mb-16">
        <div className="h-40 overflow-hidden" style={{ borderRadius: "0 0 var(--radius-2xl) var(--radius-2xl)" }}>
          <img src={COVER_PHOTO} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.55))", borderRadius: "0 0 var(--radius-2xl) var(--radius-2xl)" }} />
        </div>
        <div className="absolute -bottom-12 left-6 flex items-end gap-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full ring-4 ring-white overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white"
                style={{ background: "linear-gradient(135deg, #0D5230, #2EB374)" }}>
                {worker.name.charAt(0)}
              </div>
            </div>
            <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-white" />
          </div>
          <div className="pb-2">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="font-bold text-lg text-white drop-shadow-md">{worker.name}</p>
              <Badge variant="success" badgeStyle="soft" size="sm">Verified</Badge>
            </div>
            <Rating value={worker.rating} size="sm" showValue />
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 pb-8 space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Jobs Done",  value: String(worker.jobsCompleted), icon: <Star      className="w-4 h-4" />, color: "var(--color-brand-600)", bg: "linear-gradient(135deg, #EDFAF2, #D0F2DF)" },
            { label: "Experience", value: `${worker.experience}y`,      icon: <Shield    className="w-4 h-4" />, color: "#B45309",                bg: "linear-gradient(135deg, #FFFBEB, #FDE68A)" },
            { label: "Earned",     value: formatINR(totalEarned),       icon: <FileText  className="w-4 h-4" />, color: "#1D4ED8",                bg: "linear-gradient(135deg, #EFF6FF, #BFDBFE)" },
          ].map((stat) => (
            <div key={stat.label} className="p-4 text-center"
              style={{ background: stat.bg, borderRadius: "var(--radius-xl)", border: "1.5px solid var(--color-border-default)" }}>
              <span style={{ color: stat.color }}>{stat.icon}</span>
              <p className="text-lg font-bold mt-1 truncate" style={{ color: "var(--color-text-primary)", fontSize: "clamp(0.8rem, 2.5vw, 1.125rem)" }}>{stat.value}</p>
              <p className="text-[11px] leading-tight mt-0.5" style={{ color: "var(--color-text-secondary)" }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Skill tags */}
        {worker.tags && worker.tags.length > 0 && (
          <div className="p-5"
            style={{
              backgroundColor: "var(--color-neutral-0)",
              border: "1.5px solid var(--color-border-default)",
              borderRadius: "var(--radius-2xl)",
            }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--color-text-secondary)" }}>Skills</p>
            <div className="flex flex-wrap gap-2">
              {worker.tags.map((tag) => (
                <span key={tag}
                  className="px-3 py-1.5 text-xs font-semibold rounded-full"
                  style={{ background: "linear-gradient(135deg, #EDFAF2, #D0F2DF)", color: "var(--color-brand-800)", border: "1px solid var(--color-brand-200)" }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Edit form */}
        <form onSubmit={handleSave} className="space-y-4 p-6"
          style={{
            backgroundColor: "var(--color-neutral-0)",
            border: "1.5px solid var(--color-border-default)",
            borderRadius: "var(--radius-2xl)",
          }}>
          <div className="flex items-center gap-2 mb-4">
            <User className="w-4 h-4" style={{ color: "var(--color-brand-600)" }} />
            <p className="font-bold text-sm" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
              Personal Information
            </p>
          </div>
          <Input label="Full Name" value={name}  onChange={(e) => setName(e.target.value)}  prefix={<User   className="w-4 h-4" />} />
          <Input label="Phone"     value={worker.phone} disabled                            prefix={<Phone  className="w-4 h-4" />} />
          <Input label="Email"     value={email} onChange={(e) => setEmail(e.target.value)} prefix={<Mail   className="w-4 h-4" />} type="email" />
          <Input label="City"      value={city}  onChange={(e) => setCity(e.target.value)}  prefix={<MapPin className="w-4 h-4" />} />
          <Button type="submit" variant="primary" loading={saving}>Save Changes</Button>
        </form>

        {/* Menu */}
        <div className="overflow-hidden"
          style={{
            backgroundColor: "var(--color-neutral-0)",
            border: "1.5px solid var(--color-border-default)",
            borderRadius: "var(--radius-2xl)",
          }}>
          {[
            { icon: <FileText    className="w-4 h-4" />, label: "Documents & Certificates", bg: "#EFF6FF", color: "#1D4ED8" },
            { icon: <Star        className="w-4 h-4" />, label: "Reviews & Ratings",         bg: "#FEF3C7", color: "#92400E" },
            { icon: <Bell        className="w-4 h-4" />, label: "Notifications",              bg: "#F0FDF4", color: "#166534" },
            { icon: <HelpCircle  className="w-4 h-4" />, label: "Help & Support",             bg: "#FEF2F2", color: "#991B1B" },
          ].map((item, i) => (
            <button key={item.label}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-[var(--color-neutral-50)] transition-colors focus-visible:outline-none"
              style={{ borderTop: i > 0 ? "1px solid var(--color-border-default)" : "none", color: "var(--color-text-primary)" }}
              onClick={() => toast.info("Coming soon")}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: item.bg, color: item.color }}>
                  {item.icon}
                </div>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4" style={{ color: "var(--color-text-secondary)" }} />
            </button>
          ))}
          <button
            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-[var(--color-error-50)] transition-colors focus-visible:outline-none"
            style={{ borderTop: "1px solid var(--color-border-default)", color: "var(--color-error-600)" }}
            onClick={() => toast.info("Sign out flow coming soon")}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#FEF2F2" }}>
              <LogOut className="w-4 h-4" style={{ color: "var(--color-error-600)" }} />
            </div>
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  )
}
