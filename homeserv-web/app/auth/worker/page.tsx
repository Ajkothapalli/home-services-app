"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Phone, ArrowRight, ChevronLeft, IndianRupee, Star, Clock } from "lucide-react"
import { Button, Input, useToast } from "@/design-system"
import { mockDelay } from "@/lib/utils"

type Step = "phone" | "otp"

export default function WorkerAuthPage() {
  const [step, setStep]         = React.useState<Step>("phone")
  const [phone, setPhone]       = React.useState("")
  const [otp, setOtp]           = React.useState("")
  const [loading, setLoading]   = React.useState(false)
  const [phoneErr, setPhoneErr] = React.useState("")
  const [otpErr, setOtpErr]     = React.useState("")
  const router = useRouter()
  const toast  = useToast()

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault()
    if (phone.replace(/\D/g, "").length < 10) {
      setPhoneErr("Enter a valid 10-digit mobile number")
      return
    }
    setPhoneErr("")
    setLoading(true)
    await mockDelay(1000)
    setLoading(false)
    toast.success("OTP sent to " + phone)
    setStep("otp")
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    if (otp.length < 4) {
      setOtpErr("Enter the OTP")
      return
    }
    setOtpErr("")
    setLoading(true)
    await mockDelay(1000)
    setLoading(false)
    router.push("/worker/onboarding")
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ── Left panel ─────────────────────────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between px-12 py-12 lg:w-[420px] shrink-0"
        style={{ background: "linear-gradient(160deg, #031B0F 0%, #07361F 50%, #13723F 100%)" }}
      >
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <span className="text-white font-bold text-sm">HS</span>
          </div>
          <span className="text-white font-bold text-xl" style={{ fontFamily: "var(--font-sora)" }}>HomeServ Pro</span>
        </Link>

        <div>
          <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-sora)" }}>
            Earn ₹40,000+<br />per month.
          </h1>
          <p style={{ color: "#9FE3BF" }} className="text-base leading-relaxed">
            Join 500+ verified professionals already earning on HomeServ.
          </p>

          <div className="mt-8 space-y-4">
            {[
              { icon: <IndianRupee className="w-4 h-4" />, label: "Weekly payouts to your bank" },
              { icon: <Star className="w-4 h-4" />,        label: "Build your rating and reputation" },
              { icon: <Clock className="w-4 h-4" />,       label: "Work on your own schedule" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 text-sm" style={{ color: "#D0F2DF" }}>
                <span style={{ color: "#2EB374" }}>{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs" style={{ color: "#5DCB96" }}>
          Already a pro?{" "}
          <Link href="/worker/dashboard" className="underline font-semibold" style={{ color: "#9FE3BF" }}>
            Go to dashboard
          </Link>
        </p>
      </div>

      {/* ── Right: form ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12"
        style={{ backgroundColor: "var(--color-neutral-50)" }}>
        <div className="w-full max-w-sm">
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #07361F, #1A9458)" }}>
              <span className="text-white font-bold text-xs">HS</span>
            </div>
            <span className="font-bold text-lg" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>HomeServ Pro</span>
          </Link>

          {step === "phone" ? (
            <form onSubmit={handleSendOtp} noValidate>
              <h2 className="text-2xl font-bold mb-1" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
                Join as Professional
              </h2>
              <p className="text-sm mb-8" style={{ color: "var(--color-text-secondary)" }}>
                Enter your mobile to create your pro profile
              </p>
              <Input
                label="Mobile Number"
                type="tel"
                inputMode="numeric"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                prefix={<Phone className="w-4 h-4" />}
                error={phoneErr}
                required
                inputSize="lg"
              />
              <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}
                iconRight={!loading ? <ArrowRight className="w-5 h-5" /> : undefined} className="mt-5">
                Send OTP
              </Button>
              <p className="text-xs text-center mt-6" style={{ color: "var(--color-text-secondary)" }}>
                Looking to book a service?{" "}
                <Link href="/auth/customer" className="font-semibold underline" style={{ color: "var(--color-brand-600)" }}>
                  Sign in as customer
                </Link>
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} noValidate>
              <button type="button" onClick={() => setStep("phone")}
                className="flex items-center gap-1 text-sm font-semibold mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB374] rounded"
                style={{ color: "var(--color-brand-600)" }}>
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <h2 className="text-2xl font-bold mb-1" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
                Verify OTP
              </h2>
              <p className="text-sm mb-8" style={{ color: "var(--color-text-secondary)" }}>Sent to {phone}</p>
              <Input
                label="OTP"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                error={otpErr}
                required
                inputSize="lg"
                helperText="Enter any digits for demo"
              />
              <Button type="submit" variant="primary" size="lg" fullWidth loading={loading} className="mt-5">
                Verify & Continue
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
