import { NextRequest, NextResponse } from "next/server"
import { createOtp } from "@/lib/otp-store"

/** Normalize to 10-digit Indian number (strip +91 / 0 prefix). */
function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "")
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2)
  if (digits.length === 10) return digits
  return null
}

export async function POST(req: NextRequest) {
  const body  = await req.json().catch(() => ({}))
  const phone = normalizePhone(body.phone ?? "")

  if (!phone) {
    return NextResponse.json(
      { error: "Invalid phone number. Enter a 10-digit Indian mobile number." },
      { status: 400 }
    )
  }

  const otp = createOtp(`+91${phone}`)

  const apiKey = process.env.FAST2SMS_API_KEY
  if (!apiKey || apiKey === "your_fast2sms_api_key_here") {
    // DEV MODE: log OTP to console, skip actual SMS
    console.log(`\n[DEV] OTP for +91${phone}: ${otp}\n`)
    return NextResponse.json({ success: true, dev: true })
  }

  // ── Fast2SMS OTP route ─────────────────────────────────────────────
  // Docs: https://docs.fast2sms.com/#otp-variable-route
  const params = new URLSearchParams({
    authorization:    apiKey,
    route:            "otp",
    variables_values: otp,    // replaces {{OTP}} in the DLT template
    flash:            "0",
    numbers:          phone,
  })

  const res = await fetch(
    `https://www.fast2sms.com/dev/bulkV2?${params.toString()}`,
    {
      method:  "GET",
      headers: { "cache-control": "no-cache" },
    }
  )

  const data = await res.json().catch(() => ({}))

  if (!res.ok || data.return === false) {
    console.error("[Fast2SMS error]", data)
    return NextResponse.json(
      { error: data.message ?? "Failed to send OTP. Try again." },
      { status: 502 }
    )
  }

  return NextResponse.json({ success: true })
}
