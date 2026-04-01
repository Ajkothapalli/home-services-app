"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Phone, ArrowRight, ChevronLeft, Shield, RotateCcw } from "lucide-react"
import { Button, Input, useToast } from "@/design-system"

type Step = "phone" | "otp"

export default function CustomerAuthPage() {
  const [step, setStep]         = React.useState<Step>("phone")
  const [phone, setPhone]       = React.useState("")
  const [otp, setOtp]           = React.useState("")
  const [loading, setLoading]   = React.useState(false)
  const [phoneErr, setPhoneErr] = React.useState("")
  const [otpErr, setOtpErr]     = React.useState("")
  const [resendCooldown, setResendCooldown] = React.useState(0)   // seconds
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null)

  const router = useRouter()
  const toast  = useToast()

  /** Strip to 10-digit Indian number for display / API */
  const normalizedPhone = phone.replace(/\D/g, "").replace(/^91/, "").slice(-10)

  function startResendTimer() {
    setResendCooldown(30)
    timerRef.current = setInterval(() => {
      setResendCooldown((c) => {
        if (c <= 1) { clearInterval(timerRef.current!); return 0 }
        return c - 1
      })
    }, 1000)
  }

  React.useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current) }, [])

  async function sendOtp() {
    if (normalizedPhone.length < 10) {
      setPhoneErr("Enter a valid 10-digit mobile number")
      return false
    }
    setPhoneErr("")
    setLoading(true)

    const res  = await fetch("/api/auth/send-otp", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ phone: normalizedPhone }),
    })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setPhoneErr(data.error ?? "Failed to send OTP. Try again.")
      return false
    }

    if (data.dev) {
      toast.info("DEV MODE: OTP printed in terminal / server console")
    } else {
      toast.success(`OTP sent to +91 ${normalizedPhone}`)
    }
    startResendTimer()
    return true
  }

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault()
    const ok = await sendOtp()
    if (ok) setStep("otp")
  }

  async function handleResend() {
    setOtp("")
    setOtpErr("")
    await sendOtp()
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    if (otp.length < 4) { setOtpErr("Enter the OTP sent to your phone"); return }
    setOtpErr("")
    setLoading(true)

    const res  = await fetch("/api/auth/verify-otp", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ phone: normalizedPhone, otp }),
    })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setOtpErr(data.error ?? "Verification failed. Try again.")
      return
    }

    toast.success("Welcome to HomeServ!")
    router.push("/customer/dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ── Left branding panel ─────────────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between px-12 py-12 lg:w-[420px] shrink-0"
        style={{ background: "linear-gradient(160deg, #031B0F 0%, #0D5230 50%, #1A9458 100%)" }}
      >
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0D5230, #2EB374)" }}><span className="text-white font-bold text-xs">HS</span></div>
          <span className="text-white font-bold text-xl" style={{ fontFamily: "var(--font-sora)" }}>HomeServ</span>
        </Link>

        <div>
          <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-sora)" }}>
            Book home repairs<br />in under 2 min.
          </h1>
          <p style={{ color: "#9FE3BF" }} className="text-base leading-relaxed">
            Verified professionals. Transparent pricing. On-time or your money back.
          </p>
          <div className="mt-8 space-y-3">
            {["Seepage Repair", "Tiling & Grouting", "Welding"].map((s) => (
              <div key={s} className="flex items-center gap-2 text-sm" style={{ color: "#D0F2DF" }}>
                <div className="w-1.5 h-1.5 rounded-full bg-[#2EB374]" />
                {s}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs" style={{ color: "#5DCB96" }}>
          <Shield className="w-4 h-4" />
          Your data is safe. We never share it.
        </div>
      </div>

      {/* ── Right form panel ─────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12"
        style={{ backgroundColor: "var(--color-neutral-50)" }}>
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0D5230, #2EB374)" }}><span className="text-white font-bold text-xs">HS</span></div>
            <span className="font-bold text-lg" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
              HomeServ
            </span>
          </Link>

          {step === "phone" ? (
            <form onSubmit={handleSendOtp} noValidate>
              <h2 className="text-2xl font-bold mb-1" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
                Sign in
              </h2>
              <p className="text-sm mb-8" style={{ color: "var(--color-text-secondary)" }}>
                Enter your mobile number — we&apos;ll send a 6-digit OTP
              </p>

              <Input
                label="Mobile Number"
                type="tel"
                inputMode="numeric"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setPhoneErr("") }}
                prefix={<Phone className="w-4 h-4" />}
                error={phoneErr}
                required
                inputSize="lg"
                autoComplete="tel"
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                iconRight={!loading ? <ArrowRight className="w-5 h-5" /> : undefined}
                className="mt-5"
              >
                Send OTP
              </Button>

              <p className="text-xs text-center mt-6" style={{ color: "var(--color-text-secondary)" }}>
                Are you a professional?{" "}
                <Link href="/auth/worker" className="font-semibold underline"
                  style={{ color: "var(--color-brand-600)" }}>
                  Join as Pro
                </Link>
              </p>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" style={{ borderColor: "var(--color-neutral-200)" }} />
                </div>
                <div className="relative flex justify-center text-xs" style={{ color: "var(--color-text-secondary)" }}>
                  <span className="px-3" style={{ backgroundColor: "var(--color-neutral-50)" }}>or</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push("/customer/dashboard")}
                className="w-full text-sm font-semibold py-2.5 rounded-xl border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB374]"
                style={{ borderColor: "var(--color-neutral-300)", color: "var(--color-text-secondary)" }}
              >
                Skip — Try Demo
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} noValidate>
              <button
                type="button"
                onClick={() => { setStep("phone"); setOtp(""); setOtpErr("") }}
                className="flex items-center gap-1 text-sm font-semibold mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB374] rounded"
                style={{ color: "var(--color-brand-600)" }}
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>

              <h2 className="text-2xl font-bold mb-1" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
                Enter OTP
              </h2>
              <p className="text-sm mb-8" style={{ color: "var(--color-text-secondary)" }}>
                Sent to{" "}
                <span className="font-semibold" style={{ color: "var(--color-text-primary)" }}>
                  +91 {normalizedPhone}
                </span>{" "}
                <button
                  type="button"
                  onClick={() => { setStep("phone"); setOtp(""); setOtpErr("") }}
                  className="underline focus-visible:outline-none text-xs"
                  style={{ color: "var(--color-brand-600)" }}
                >
                  Change
                </button>
              </p>

              {/* 6 individual digit boxes */}
              <OtpInput value={otp} onChange={setOtp} />

              {otpErr && (
                <p className="text-xs mt-2" role="alert" style={{ color: "var(--color-error-600)" }}>
                  {otpErr}
                </p>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                disabled={otp.length < 6}
                className="mt-6"
              >
                Verify & Continue
              </Button>

              {/* Resend */}
              <div className="flex items-center justify-center gap-2 mt-4 text-sm" style={{ color: "var(--color-text-secondary)" }}>
                Didn&apos;t receive it?{" "}
                {resendCooldown > 0 ? (
                  <span className="font-semibold" style={{ color: "var(--color-neutral-400)" }}>
                    Resend in {resendCooldown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={loading}
                    className="font-semibold flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB374] rounded"
                    style={{ color: "var(--color-brand-600)" }}
                  >
                    <RotateCcw className="w-3 h-3" /> Resend OTP
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

// ── 6-box OTP input ────────────────────────────────────────────────────────
function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const inputRefs = React.useRef<Array<HTMLInputElement | null>>([])

  function handleChange(i: number, char: string) {
    const digit = char.replace(/\D/g, "").slice(-1)
    const arr   = value.padEnd(6, " ").split("")
    arr[i] = digit || " "
    const next  = arr.join("").trimEnd()
    onChange(next.replace(/ /g, ""))   // no spaces in value
    if (digit && i < 5) inputRefs.current[i + 1]?.focus()
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace") {
      if (!value[i] && i > 0) {
        inputRefs.current[i - 1]?.focus()
        const arr = value.split("")
        arr[i - 1] = ""
        onChange(arr.join(""))
      }
    }
    if (e.key === "ArrowLeft"  && i > 0) inputRefs.current[i - 1]?.focus()
    if (e.key === "ArrowRight" && i < 5) inputRefs.current[i + 1]?.focus()
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    onChange(pasted)
    inputRefs.current[Math.min(pasted.length, 5)]?.focus()
  }

  return (
    <div className="flex gap-2" aria-label="OTP input">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.currentTarget.select()}
          aria-label={`OTP digit ${i + 1}`}
          className="w-full aspect-square text-center text-xl font-bold outline-none rounded-lg transition-all"
          style={{
            border: `2px solid ${value[i] ? "var(--color-brand-500)" : "var(--color-neutral-300)"}`,
            color: "var(--color-text-primary)",
            backgroundColor: "var(--color-neutral-0)",
            boxShadow: value[i] ? "0 0 0 3px rgba(19,114,63,0.15)" : "none",
            maxWidth: 48,
          }}
          autoComplete={i === 0 ? "one-time-code" : "off"}
        />
      ))}
    </div>
  )
}
