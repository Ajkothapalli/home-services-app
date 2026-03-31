/**
 * Server-side in-memory OTP store.
 * Lives in the Node.js process — works fine for a single-server MVP.
 * Each entry expires after OTP_TTL_MS (default 5 min).
 *
 * Key  : E.164 phone number, e.g. "+919876543210"
 * Value: { otp, expires, attempts }
 */

interface OtpRecord {
  otp:      string
  expires:  number   // Date.now() + TTL
  attempts: number   // wrong-guess counter — lock after 5
}

// Module-level singleton (persists across requests in same process)
const store = new Map<string, OtpRecord>()

const TTL      = Number(process.env.OTP_TTL_MS ?? 300_000) // 5 min
const MAX_ATTEMPTS = 5

/** Generate & save a 6-digit OTP. Returns the OTP to send via SMS. */
export function createOtp(phone: string): string {
  const otp = String(Math.floor(100_000 + Math.random() * 900_000))
  store.set(phone, { otp, expires: Date.now() + TTL, attempts: 0 })
  return otp
}

export type VerifyResult =
  | "ok"
  | "expired"
  | "wrong"
  | "locked"
  | "not_found"

/** Verify the OTP submitted by the user. Deletes the record on success. */
export function verifyOtp(phone: string, code: string): VerifyResult {
  const record = store.get(phone)
  if (!record) return "not_found"
  if (Date.now() > record.expires) { store.delete(phone); return "expired" }
  if (record.attempts >= MAX_ATTEMPTS) return "locked"

  if (record.otp !== code.trim()) {
    record.attempts++
    return "wrong"
  }

  store.delete(phone) // one-time use
  return "ok"
}

/** Prune expired entries (called lazily to avoid memory leak in long runs). */
function pruneExpired() {
  const now = Date.now()
  for (const [key, val] of store.entries()) {
    if (now > val.expires) store.delete(key)
  }
}
setInterval(pruneExpired, 60_000) // clean up every minute
