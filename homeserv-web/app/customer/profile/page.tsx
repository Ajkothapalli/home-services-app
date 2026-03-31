"use client"

import * as React from "react"
import Link from "next/link"
import { User, MapPin, Phone, Mail, LogOut, ChevronRight, Shield } from "lucide-react"
import { Button, Avatar, Input, useToast } from "@/design-system"
import { CUSTOMERS } from "@/lib/mock-data"
import { mockDelay } from "@/lib/utils"

export default function CustomerProfile() {
  const customer = CUSTOMERS[0]
  const toast    = useToast()
  const [name,    setName]    = React.useState<string>(customer.name)
  const [phone,   setPhone]   = React.useState<string>(customer.phone)
  const [email,   setEmail]   = React.useState<string>("priya@example.com")
  const [address, setAddress] = React.useState<string>(customer.address)
  const [saving,  setSaving]  = React.useState(false)

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
        Profile
      </h1>

      {/* Avatar */}
      <div className="flex items-center gap-5 mb-8 p-5"
        style={{
          backgroundColor: "var(--color-neutral-0)",
          border: "1.5px solid var(--color-border-default)",
          borderRadius: "var(--radius-xl)",
        }}>
        <Avatar name={customer.name} size="xl" status="online" />
        <div>
          <p className="font-bold text-lg" style={{ color: "var(--color-text-primary)" }}>{customer.name}</p>
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{customer.phone}</p>
          <button className="text-xs font-semibold mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB374] rounded"
            style={{ color: "var(--color-brand-600)" }}
            onClick={() => toast.info("Photo upload coming soon")}>
            Change photo
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-4 mb-6"
        style={{
          backgroundColor: "var(--color-neutral-0)",
          border: "1.5px solid var(--color-border-default)",
          borderRadius: "var(--radius-xl)",
          padding: "1.5rem",
        }}>
        <p className="font-bold text-sm mb-4" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
          Personal Information
        </p>
        <Input label="Full Name"    value={name}    onChange={(e) => setName(e.target.value)}    prefix={<User    className="w-4 h-4" />} required />
        <Input label="Phone"        value={phone}   onChange={(e) => setPhone(e.target.value)}   prefix={<Phone   className="w-4 h-4" />} type="tel" disabled />
        <Input label="Email"        value={email}   onChange={(e) => setEmail(e.target.value)}   prefix={<Mail    className="w-4 h-4" />} type="email" />
        <Input label="Home Address" value={address} onChange={(e) => setAddress(e.target.value)} prefix={<MapPin  className="w-4 h-4" />} />
        <Button type="submit" variant="primary" loading={saving} className="mt-2">
          Save Changes
        </Button>
      </form>

      {/* Menu items */}
      <div
        className="overflow-hidden"
        style={{
          backgroundColor: "var(--color-neutral-0)",
          border: "1.5px solid var(--color-border-default)",
          borderRadius: "var(--radius-xl)",
        }}
      >
        {[
          { icon: <Shield className="w-4 h-4" />, label: "Privacy & Security" },
          { icon: <Phone  className="w-4 h-4" />, label: "Help & Support"     },
        ].map((item, i) => (
          <button
            key={item.label}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-[var(--color-neutral-50)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2EB374]"
            style={{ borderTop: i > 0 ? "1px solid var(--color-border-default)" : "none", color: "var(--color-text-primary)" }}
            onClick={() => toast.info("Coming soon")}
          >
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
          onClick={() => toast.info("Sign out flow coming soon")}
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  )
}
