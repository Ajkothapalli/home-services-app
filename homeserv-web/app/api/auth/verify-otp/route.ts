import { NextRequest, NextResponse } from "next/server"
import { verifyOtp } from "@/lib/otp-store"

function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "")
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2)
  if (digits.length === 10) return digits
  return null
}

const ERROR_MESSAGES = {
  expired:   "OTP has expired. Please request a new one.",
  wrong:     "Incorrect OTP. Please try again.",
  locked:    "Too many wrong attempts. Request a new OTP.",
  not_found: "OTP not found. Please request a new one.",
}

export async function POST(req: NextRequest) {
  const body  = await req.json().catch(() => ({}))
  const phone = normalizePhone(body.phone ?? "")
  const otp   = String(body.otp ?? "").trim()

  if (!phone || !otp) {
    return NextResponse.json({ error: "Phone and OTP are required." }, { status: 400 })
  }

  const result = verifyOtp(`+91${phone}`, otp)

  if (result === "ok") {
    return NextResponse.json({ success: true })
  }

  return NextResponse.json(
    { error: ERROR_MESSAGES[result] },
    { status: result === "locked" ? 429 : 400 }
  )
}
