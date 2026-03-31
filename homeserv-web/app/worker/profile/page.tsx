"use client"

import * as React from "react"
import { User, Phone, Mail, MapPin, LogOut, ChevronRight, Shield, Star } from "lucide-react"
import { Button, Avatar, Badge, Input, Rating, useToast } from "@/design-system"
import { WORKERS } from "@/lib/mock-data"
import { mockDelay } from "@/lib/utils"

export default function WorkerProfile() {
  const worker = WORKERS[0]
  const toast  = useToast()
  const [name,  setName]  = React.useState<string>(worker.name)
  const [email, setEmail] = React.useState<string>("ramesh@example.com")
  const [city,  setCity]  = React.useState<string>(worker.city)
  const [saving, setSaving] = React.useState(false)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await mockDelay(800)
    setSaving(false)
    toast.success("Profile updated!")
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold mb-8" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
        My Profile
      </h1>

      {/* Avatar + stats */}
      <div className="flex items-center gap-5 p-5 mb-6"
        style={{
          background: "linear-gradient(135deg, #EDFAF2, #D0F2DF)",
          border: "1.5px solid var(--color-brand-200)",
          borderRadius: "var(--radius-2xl)",
        }}>
        <Avatar name={worker.name} size="xl" status="online" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-bold text-lg" style={{ color: "var(--color-brand-900)" }}>{worker.name}</p>
            <Badge variant="success" badgeStyle="soft" size="sm">Verified</Badge>
          </div>
          <Rating value={worker.rating} size="sm" showValue />
          <p className="text-sm mt-1" style={{ color: "var(--color-brand-700)" }}>
            {worker.jobsCompleted} jobs · {worker.experience} years experience
          </p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {worker.tags?.map((tag) => (
              <Badge key={tag} variant="default" badgeStyle="soft" size="sm">{tag}</Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Edit form */}
      <form onSubmit={handleSave} className="space-y-4 p-6 mb-6"
        style={{
          backgroundColor: "var(--color-neutral-0)",
          border: "1.5px solid var(--color-border-default)",
          borderRadius: "var(--radius-xl)",
        }}>
        <p className="font-bold text-sm mb-4" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
          Personal Information
        </p>
        <Input label="Full Name" value={name}  onChange={(e) => setName(e.target.value)}  prefix={<User  className="w-4 h-4" />} />
        <Input label="Phone"     value={worker.phone} disabled prefix={<Phone className="w-4 h-4" />} />
        <Input label="Email"     value={email} onChange={(e) => setEmail(e.target.value)} prefix={<Mail  className="w-4 h-4" />} type="email" />
        <Input label="City"      value={city}  onChange={(e) => setCity(e.target.value)}  prefix={<MapPin className="w-4 h-4" />} />
        <Button type="submit" variant="primary" loading={saving}>Save Changes</Button>
      </form>

      {/* Menu items */}
      <div className="overflow-hidden"
        style={{
          backgroundColor: "var(--color-neutral-0)",
          border: "1.5px solid var(--color-border-default)",
          borderRadius: "var(--radius-xl)",
        }}>
        {[
          { icon: <Shield className="w-4 h-4" />, label: "Documents & Certificates" },
          { icon: <Star   className="w-4 h-4" />, label: "Reviews & Ratings"         },
          { icon: <Phone  className="w-4 h-4" />, label: "Help & Support"             },
        ].map((item, i) => (
          <button key={item.label}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-[var(--color-neutral-50)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2EB374]"
            style={{ borderTop: i > 0 ? "1px solid var(--color-border-default)" : "none", color: "var(--color-text-primary)" }}
            onClick={() => toast.info("Coming soon")}>
            <div className="flex items-center gap-3">
              <span style={{ color: "var(--color-text-secondary)" }}>{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            <ChevronRight className="w-4 h-4" style={{ color: "var(--color-text-secondary)" }} />
          </button>
        ))}
        <button
          className="w-full flex items-center gap-3 px-5 py-4 hover:bg-[var(--color-error-50)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2EB374]"
          style={{ borderTop: "1px solid var(--color-border-default)", color: "var(--color-error-600)" }}
          onClick={() => toast.info("Sign out flow coming soon")}>
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  )
}
