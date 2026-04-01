"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowRight, ArrowLeft, ChevronLeft, Upload, X, Zap, AlertCircle } from "lucide-react"
import confetti from "canvas-confetti"
import {
  Button, Input, StepProgress, CustomerSlotPicker,
  Rating, Avatar, Badge, useToast, AddressAutocomplete,
} from "@/design-system"
import {
  SERVICES, WORKERS, generateMockSlots, assignWorker, calcQuote, findNextAvailableSlot,
} from "@/lib/mock-data"
import type { TimeSlot } from "@/lib/mock-data"
import { formatINR, mockDelay } from "@/lib/utils"
import { format, parseISO } from "date-fns"

const STEPS = [
  { id: "describe", label: "Describe",  status: "current"    as const },
  { id: "slot",     label: "Choose Slot", status: "upcoming" as const },
  { id: "pay",      label: "Pay",       status: "upcoming"   as const },
]

const AREAS = ["Bathroom", "Kitchen", "Terrace", "Basement", "Wall", "Other"]
const URGENCY = [
  { value: "emergency", label: "🚨 Emergency", note: "Within today" },
  { value: "urgent",    label: "⚡ Urgent",    note: "Within 24 hrs" },
  { value: "routine",   label: "📅 Routine",   note: "Pick a date"   },
] as const

type UrgencyValue = (typeof URGENCY)[number]["value"]
type PayMethod = "upi" | "card" | "netbanking" | "wallet"

export default function BookingWizard() {
  const params     = useParams()
  const router     = useRouter()
  const toast      = useToast()
  const serviceId  = params.serviceId as string
  const service    = SERVICES.find((s) => s.id === serviceId)

  // ── Step state ────────────────────────────────────────────────────────
  const [step, setStep] = React.useState(0)
  const steps = STEPS.map((s, i) => ({
    ...s,
    status: (i < step ? "completed" : i === step ? "current" : "upcoming") as "completed" | "current" | "upcoming",
  }))

  // ── Step 1 fields ─────────────────────────────────────────────────────
  const [areas,       setAreas]       = React.useState<string[]>([])
  const [urgency,     setUrgency]     = React.useState<UrgencyValue>("routine")
  const [description, setDescription] = React.useState("")
  const [address,     setAddress]     = React.useState("")
  const [photos,      setPhotos]      = React.useState<string[]>([]) // file names for mock

  // ── Step 2 fields ─────────────────────────────────────────────────────
  const [month, setMonth]             = React.useState(new Date())
  const allSlots                      = React.useMemo(() => generateMockSlots("w1"), [])
  const [selectedSlotId, setSelectedSlotId] = React.useState<string | null>(null)
  const selectedSlot                  = allSlots.find((s) => s.id === selectedSlotId) ?? null
  const assignedWorker                = service ? assignWorker(service.id) : WORKERS[0]

  // ── Step 3 fields ─────────────────────────────────────────────────────
  const [payMethod, setPayMethod]     = React.useState<PayMethod>("upi")
  const [upiId,     setUpiId]         = React.useState("")
  const [paying,    setPaying]        = React.useState(false)
  const [slotError, setSlotError]     = React.useState(false)

  const quote = service ? calcQuote(service.priceFrom) : null

  // ── Step 1 validation ─────────────────────────────────────────────────
  function validateStep1() {
    if (areas.length === 0) { toast.error("Select at least one affected area"); return false }
    if (!address.trim())    { toast.error("Enter the service address"); return false }
    return true
  }

  // ── Step 2 validation ─────────────────────────────────────────────────
  function validateStep2() {
    if (!selectedSlotId) { toast.error("Please select a time slot"); return false }
    return true
  }

  // ── Photo upload (mock — just captures filenames) ──────────────────────
  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (photos.length + files.length > 3) { toast.warning("Maximum 3 photos allowed"); return }
    setPhotos((prev) => [...prev, ...files.map((f) => f.name)])
  }

  // ── Payment ───────────────────────────────────────────────────────────
  async function handlePay() {
    if (payMethod === "upi" && !upiId.trim()) {
      toast.error("Enter your UPI ID"); return
    }
    setPaying(true)
    await mockDelay(1800)

    // Simulate race condition: 5% chance slot was taken (always succeeds in demo)
    const slotTaken = false
    if (slotTaken) {
      setSlotError(true)
      setPaying(false)
      toast.error("This slot was just booked. Please select another.")
      setStep(1)
      return
    }

    setPaying(false)

    // Success
    toast.success("Booking Confirmed! 🎉")
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#2EB374", "#1A9458", "#0D5230", "#9FE3BF", "#F5A623"],
    })
    await mockDelay(400)
    router.push("/customer/bookings/HS-2041")
  }

  if (!service) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="font-bold text-lg mb-4" style={{ color: "var(--color-text-primary)" }}>Service not found</p>
          <Link href="/customer/services"><Button variant="outline">Back</Button></Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 lg:py-8">
      {/* Back link — desktop only */}
      <Link
        href={`/customer/services/${serviceId}`}
        className="hidden lg:inline-flex items-center gap-1 text-sm font-semibold mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB374] rounded"
        style={{ color: "var(--color-brand-600)" }}
      >
        <ChevronLeft className="w-4 h-4" /> {service.name}
      </Link>

      {/* Step progress */}
      <div className="mb-6 lg:mb-8">
        <StepProgress steps={steps} orientation="horizontal" />
      </div>

      {/* ── Step 1: Describe ──────────────────────────────────────────── */}
      {step === 0 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-1" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
              Describe the issue
            </h2>
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
              Help us send the right professional
            </p>
          </div>

          {/* Affected area chips */}
          <div>
            <p className="text-sm font-semibold mb-3" style={{ color: "var(--color-text-primary)" }}>
              Affected area <span className="text-red-500">*</span>
            </p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Affected area">
              {AREAS.map((area) => {
                const active = areas.includes(area)
                return (
                  <button
                    key={area}
                    type="button"
                    onClick={() => setAreas((prev) => active ? prev.filter((a) => a !== area) : [...prev, area])}
                    aria-pressed={active}
                    className="px-4 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB374]"
                    style={{
                      background: active ? "linear-gradient(135deg, #0D5230, #2EB374)" : "var(--color-neutral-100)",
                      color: active ? "#fff" : "var(--color-text-secondary)",
                      border: active ? "none" : "1.5px solid var(--color-border-default)",
                    }}
                  >
                    {area}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Urgency */}
          <div>
            <p className="text-sm font-semibold mb-3" style={{ color: "var(--color-text-primary)" }}>Urgency</p>
            <div className="grid grid-cols-3 gap-2" role="group" aria-label="Urgency level">
              {URGENCY.map((u) => {
                const active = urgency === u.value
                return (
                  <button
                    key={u.value}
                    type="button"
                    onClick={() => setUrgency(u.value)}
                    aria-pressed={active}
                    className="flex flex-col items-center p-3 rounded-xl text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB374]"
                    style={{
                      backgroundColor: active ? "var(--color-brand-50)" : "var(--color-neutral-50)",
                      border: active ? "2px solid var(--color-brand-400)" : "1.5px solid var(--color-border-default)",
                      color: active ? "var(--color-brand-700)" : "var(--color-text-secondary)",
                    }}
                  >
                    <span className="font-semibold text-xs">{u.label}</span>
                    <span className="text-[10px] mt-0.5">{u.note}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--color-text-primary)" }}>
              Describe the issue{" "}
              <span className="text-xs font-normal" style={{ color: "var(--color-text-secondary)" }}>(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.g. Water seeping through the bathroom wall near the shower..."
              className="w-full rounded-lg px-4 py-3 text-sm outline-none resize-none transition-all"
              rows={3}
              style={{
                border: "2px solid var(--color-neutral-400)",
                color: "var(--color-text-primary)",
                backgroundColor: "var(--color-neutral-0)",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-brand-600)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(19,114,63,0.2)" }}
              onBlur={(e)  => { e.currentTarget.style.borderColor = "var(--color-neutral-400)"; e.currentTarget.style.boxShadow = "none" }}
            />
          </div>

          {/* Photo upload */}
          <div>
            <p className="text-sm font-semibold mb-2" style={{ color: "var(--color-text-primary)" }}>
              Photos{" "}
              <span className="text-xs font-normal" style={{ color: "var(--color-text-secondary)" }}>
                (max 3 — optional)
              </span>
            </p>
            <label
              className="flex flex-col items-center justify-center gap-2 px-4 py-6 cursor-pointer transition-all hover:bg-[var(--color-brand-50)]"
              style={{
                border: "2px dashed var(--color-brand-300)",
                borderRadius: "var(--radius-xl)",
                backgroundColor: "var(--color-neutral-50)",
              }}
            >
              <Upload className="w-6 h-6" style={{ color: "var(--color-brand-400)" }} />
              <span className="text-sm font-medium" style={{ color: "var(--color-brand-600)" }}>
                Click to upload or drag & drop
              </span>
              <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>PNG, JPG up to 10 MB</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={handlePhotoChange}
                aria-label="Upload photos"
              />
            </label>
            {photos.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {photos.map((name, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{ backgroundColor: "var(--color-brand-50)", color: "var(--color-brand-700)", border: "1px solid var(--color-brand-200)" }}
                  >
                    {name}
                    <button
                      onClick={() => setPhotos((p) => p.filter((_, j) => j !== i))}
                      aria-label={`Remove ${name}`}
                      className="rounded-full hover:bg-[var(--color-brand-100)] p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Address */}
          <AddressAutocomplete
            label="Service Address"
            placeholder="Search your address…"
            value={address}
            onChange={setAddress}
            onSelect={(place) => setAddress(place.shortName || place.displayName)}
          />

          <Button
            variant="primary"
            size="lg"
            fullWidth
            iconRight={<ArrowRight className="w-5 h-5" />}
            onClick={() => { if (validateStep1()) setStep(1) }}
          >
            Continue
          </Button>
        </div>
      )}

      {/* ── Step 2: Choose Slot ───────────────────────────────────────── */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-1" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
              Choose a slot
            </h2>
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
              Your professional will be confirmed after booking
            </p>
          </div>

          {slotError && (
            <div
              className="flex items-start gap-3 px-4 py-3 rounded-xl"
              style={{ backgroundColor: "var(--color-error-50)", border: "1.5px solid #fecaca" }}
              role="alert"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--color-error-500)" }} />
              <p className="text-sm font-medium" style={{ color: "var(--color-error-700)" }}>
                That slot was just booked. Please select another time.
              </p>
            </div>
          )}

          <CustomerSlotPicker
            slots={allSlots}
            selectedSlotId={selectedSlotId}
            onSelect={(slot) => { setSelectedSlotId(slot.id); setSlotError(false) }}
            month={month}
            onMonthChange={setMonth}
          />

          {/* Assigned worker preview */}
          {selectedSlot && (
            <div
              className="p-5 space-y-3"
              style={{
                backgroundColor: "var(--color-neutral-0)",
                border: "1.5px solid var(--color-border-default)",
                borderRadius: "var(--radius-xl)",
              }}
            >
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-text-secondary)" }}>
                Your assigned professional
              </p>
              <div className="flex items-center gap-3">
                <Avatar name={assignedWorker.name} size="lg" status="online" />
                <div className="flex-1">
                  <p className="font-bold" style={{ color: "var(--color-text-primary)" }}>{assignedWorker.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Rating value={assignedWorker.rating} size="sm" showValue />
                    <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                      {assignedWorker.jobsCompleted} jobs
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {assignedWorker.tags?.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="success" badgeStyle="soft" size="sm">{tag}</Badge>
                    ))}
                  </div>
                </div>
                <Badge variant="success" badgeStyle="soft">
                  {assignedWorker.distance}
                </Badge>
              </div>
              <p className="text-xs px-3 py-2 rounded-lg" style={{ backgroundColor: "var(--color-brand-50)", color: "var(--color-brand-700)" }}>
                <Zap className="inline w-3 h-3 mr-1" />
                Slot locked for 5 minutes. Complete booking to confirm.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="ghost" size="lg" iconLeft={<ArrowLeft className="w-5 h-5" />}
              onClick={() => setStep(0)}>
              Back
            </Button>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              disabled={!selectedSlotId}
              iconRight={<ArrowRight className="w-5 h-5" />}
              onClick={() => { if (validateStep2()) setStep(2) }}
            >
              Confirm Slot
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 3: Review & Pay ──────────────────────────────────────── */}
      {step === 2 && quote && selectedSlot && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-1" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
              Review & Pay
            </h2>
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>Confirm your booking details</p>
          </div>

          {/* Booking summary */}
          <div
            className="p-5 space-y-3"
            style={{
              backgroundColor: "var(--color-neutral-0)",
              border: "1.5px solid var(--color-border-default)",
              borderRadius: "var(--radius-xl)",
            }}
          >
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--color-text-secondary)" }}>
              Booking Summary
            </p>
            {[
              { label: "Service",    value: service.name },
              { label: "Date",       value: format(parseISO(selectedSlot.date), "EEE, d MMMM yyyy") },
              { label: "Time",       value: `${selectedSlot.startTime} – ${selectedSlot.endTime}` },
              { label: "Address",    value: address },
              { label: "Area",       value: areas.join(", ") },
              { label: "Urgency",    value: URGENCY.find((u) => u.value === urgency)?.label ?? urgency },
              { label: "Assigned to", value: assignedWorker.name },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between gap-4 text-sm">
                <span style={{ color: "var(--color-text-secondary)" }}>{label}</span>
                <span className="font-medium text-right" style={{ color: "var(--color-text-primary)" }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Price breakdown */}
          <div
            className="p-5 space-y-3"
            style={{
              backgroundColor: "var(--color-brand-50)",
              border: "1.5px solid var(--color-brand-200)",
              borderRadius: "var(--radius-xl)",
            }}
          >
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--color-brand-700)" }}>
              Price Breakdown
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--color-brand-700)" }}>Service charge</span>
                <span className="font-medium" style={{ color: "var(--color-brand-800)" }}>{formatINR(quote.serviceCharge)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--color-brand-700)" }}>
                  Visit charge{" "}
                  <span className="text-[10px]" style={{ color: "var(--color-brand-500)" }}>(waived on confirm)</span>
                </span>
                <span className="line-through" style={{ color: "var(--color-brand-400)" }}>{formatINR(quote.visitCharge)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--color-brand-700)" }}>GST (18%)</span>
                <span className="font-medium" style={{ color: "var(--color-brand-800)" }}>{formatINR(quote.gst)}</span>
              </div>
            </div>
            <div className="flex justify-between pt-3 font-bold text-base" style={{ borderTop: "1px solid var(--color-brand-300)", color: "var(--color-brand-900)" }}>
              <span>Total</span>
              <span>{formatINR(quote.total)}</span>
            </div>
          </div>

          {/* Payment method */}
          <div>
            <p className="text-sm font-semibold mb-3" style={{ color: "var(--color-text-primary)" }}>Payment Method</p>
            <div className="grid grid-cols-4 gap-2 mb-4" role="group" aria-label="Payment method">
              {(["upi", "card", "netbanking", "wallet"] as PayMethod[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPayMethod(m)}
                  aria-pressed={payMethod === m}
                  className="py-2 px-2 rounded-lg text-xs font-bold uppercase transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB374]"
                  style={{
                    backgroundColor: payMethod === m ? "var(--color-brand-50)" : "var(--color-neutral-100)",
                    border: payMethod === m ? "2px solid var(--color-brand-400)" : "1.5px solid var(--color-border-default)",
                    color: payMethod === m ? "var(--color-brand-700)" : "var(--color-text-secondary)",
                  }}
                >
                  {m === "netbanking" ? "Net" : m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>

            {payMethod === "upi" && (
              <Input
                label="UPI ID"
                placeholder="name@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                helperText="e.g. priya@okaxis"
              />
            )}
            {payMethod === "card" && (
              <div className="space-y-3">
                <Input label="Card Number" placeholder="1234 5678 9012 3456" inputMode="numeric" />
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Expiry" placeholder="MM/YY" />
                  <Input label="CVV" placeholder="•••" type="password" maxLength={4} />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button variant="ghost" size="lg" iconLeft={<ArrowLeft className="w-5 h-5" />}
              onClick={() => setStep(1)}>
              Back
            </Button>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={paying}
              onClick={handlePay}
            >
              {paying ? "Processing…" : `Pay ${formatINR(quote.total)} & Confirm`}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
