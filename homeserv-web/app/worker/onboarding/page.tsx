"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  ArrowRight, ArrowLeft, Upload, X, Droplets, Grid3x3, Layers, Zap,
  CheckCircle2, User, Mail, MapPin, Phone,
} from "lucide-react"
import { Button, Input, StepProgress, WorkerAvailabilityEditor, Badge, Avatar, useToast } from "@/design-system"
import type { TimeSlot } from "@/lib/mock-data"
import { mockDelay } from "@/lib/utils"

const STEPS = ["Personal Info", "Skills", "Documents", "Availability", "Review"].map((label, i) => ({
  id: String(i), label, status: "upcoming" as "upcoming" | "current" | "completed",
}))

const SKILLS_OPTIONS = [
  { id: "seepage", label: "Seepage Repair", icon: <Droplets className="w-5 h-5" /> },
  { id: "tiling",  label: "Tiling",          icon: <Grid3x3 className="w-5 h-5" /> },
  { id: "grouting",label: "Grouting",         icon: <Layers className="w-5 h-5" /> },
  { id: "welding", label: "Welding",          icon: <Zap className="w-5 h-5" /> },
]

export default function WorkerOnboarding() {
  const router = useRouter()
  const toast  = useToast()
  const [step, setStep] = React.useState(0)

  // Step 1
  const [name,    setName]    = React.useState("")
  const [email,   setEmail]   = React.useState("")
  const [city,    setCity]    = React.useState("Mumbai")
  const [pincode, setPincode] = React.useState("")

  // Step 2
  const [skills, setSkills]       = React.useState<string[]>([])
  const [experience, setExperience] = React.useState<Record<string, number>>({})

  // Step 3
  const [idDoc,   setIdDoc]   = React.useState("")
  const [certDoc, setCertDoc] = React.useState("")

  // Step 4
  const [availability, setAvailability] = React.useState<TimeSlot[]>([])
  const [avMonth,      setAvMonth]      = React.useState(new Date())

  // Step 5
  const [agreed,    setAgreed]    = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [submitted,  setSubmitted]  = React.useState(false)

  const stepsMapped = STEPS.map((s, i) => ({
    ...s,
    status: (i < step ? "completed" : i === step ? "current" : "upcoming") as "completed" | "current" | "upcoming",
  }))

  function toggleSkill(id: string) {
    setSkills((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
    if (!experience[id]) setExperience((prev) => ({ ...prev, [id]: 1 }))
  }

  async function handleSubmit() {
    if (!agreed) { toast.error("Please accept the terms to continue"); return }
    setSubmitting(true)
    await mockDelay(1500)
    setSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-sm w-full text-center space-y-5">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
            style={{ background: "linear-gradient(135deg, #EDFAF2, #D0F2DF)" }}>
            <CheckCircle2 className="w-10 h-10" style={{ color: "var(--color-brand-600)" }} />
          </div>
          <h2 className="text-2xl font-bold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
            Application Submitted!
          </h2>
          <Badge variant="warning" badgeStyle="soft" size="lg">Under Review</Badge>
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
            We&apos;ll verify your profile within 24 hours and notify you via SMS.
          </p>
          <Button variant="primary" fullWidth onClick={() => router.push("/worker/dashboard")}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
          Create your Pro profile
        </h1>
        <StepProgress steps={stepsMapped} />
      </div>

      {/* ── Step 0: Personal Info ─────────────────────────────────── */}
      {step === 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold mb-2" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
            Personal Information
          </h2>
          <div className="flex justify-center mb-4">
            <button
              onClick={() => toast.info("Photo upload coming soon")}
              className="relative w-20 h-20 rounded-full flex items-center justify-center border-2 border-dashed transition-colors hover:bg-[var(--color-brand-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB374]"
              style={{ borderColor: "var(--color-brand-300)" }}
              aria-label="Upload profile photo"
            >
              <User className="w-8 h-8" style={{ color: "var(--color-brand-400)" }} />
              <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #1A9458, #2EB374)" }}>
                <Upload className="w-3 h-3 text-white" />
              </div>
            </button>
          </div>
          <Input label="Full Name"  value={name}    onChange={(e) => setName(e.target.value)}    prefix={<User    className="w-4 h-4" />} required />
          <Input label="Email"      value={email}   onChange={(e) => setEmail(e.target.value)}   prefix={<Mail    className="w-4 h-4" />} type="email" />
          <Input label="City"       value={city}    onChange={(e) => setCity(e.target.value)}    prefix={<MapPin  className="w-4 h-4" />} required />
          <Input label="Pincode"    value={pincode} onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))} maxLength={6} required />
          <Button variant="primary" size="lg" fullWidth iconRight={<ArrowRight className="w-5 h-5" />}
            onClick={() => { if (!name.trim() || !pincode) { toast.error("Fill in required fields"); return } setStep(1) }}>
            Continue
          </Button>
        </div>
      )}

      {/* ── Step 1: Skills ────────────────────────────────────────── */}
      {step === 1 && (
        <div className="space-y-5">
          <h2 className="text-lg font-bold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
            Skills & Services
          </h2>
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>Select all services you offer</p>

          <div className="grid grid-cols-2 gap-3" role="group" aria-label="Select skills">
            {SKILLS_OPTIONS.map((s) => {
              const active = skills.includes(s.id)
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleSkill(s.id)}
                  aria-pressed={active}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB374]"
                  style={{
                    backgroundColor: active ? "var(--color-brand-50)" : "var(--color-neutral-50)",
                    border: active ? "2px solid var(--color-brand-400)" : "1.5px solid var(--color-border-default)",
                    color: active ? "var(--color-brand-700)" : "var(--color-text-secondary)",
                  }}
                >
                  <span style={{ color: active ? "var(--color-brand-600)" : "var(--color-neutral-400)" }}>{s.icon}</span>
                  <span className="text-sm font-semibold">{s.label}</span>
                </button>
              )
            })}
          </div>

          {skills.length > 0 && (
            <div className="space-y-3 pt-2">
              <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>Years of experience</p>
              {skills.map((skillId) => {
                const s = SKILLS_OPTIONS.find((o) => o.id === skillId)!
                return (
                  <div key={skillId} className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl"
                    style={{ backgroundColor: "var(--color-neutral-50)", border: "1.5px solid var(--color-border-default)" }}>
                    <span className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>{s.label}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setExperience((prev) => ({ ...prev, [skillId]: Math.max(1, (prev[skillId] ?? 1) - 1) }))}
                        aria-label={`Decrease experience for ${s.label}`}
                        className="w-7 h-7 rounded-full border flex items-center justify-center font-bold transition-colors hover:bg-[var(--color-brand-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB374]"
                        style={{ borderColor: "var(--color-border-default)", color: "var(--color-text-primary)" }}
                      >−</button>
                      <span className="w-8 text-center font-semibold" style={{ color: "var(--color-text-primary)" }}>
                        {experience[skillId] ?? 1}y
                      </span>
                      <button
                        onClick={() => setExperience((prev) => ({ ...prev, [skillId]: Math.min(30, (prev[skillId] ?? 1) + 1) }))}
                        aria-label={`Increase experience for ${s.label}`}
                        className="w-7 h-7 rounded-full border flex items-center justify-center font-bold transition-colors hover:bg-[var(--color-brand-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB374]"
                        style={{ borderColor: "var(--color-border-default)", color: "var(--color-text-primary)" }}
                      >+</button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="ghost" size="lg" iconLeft={<ArrowLeft className="w-5 h-5" />} onClick={() => setStep(0)}>Back</Button>
            <Button variant="primary" size="lg" fullWidth iconRight={<ArrowRight className="w-5 h-5" />}
              onClick={() => { if (skills.length === 0) { toast.error("Select at least one skill"); return } setStep(2) }}>
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 2: Documents ────────────────────────────────────── */}
      {step === 2 && (
        <div className="space-y-5">
          <h2 className="text-lg font-bold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>Documents</h2>

          {[
            { label: "Government ID (Aadhaar / PAN)", required: true,  value: idDoc,   setter: setIdDoc },
            { label: "Skills Certificate",             required: false, value: certDoc, setter: setCertDoc },
          ].map((doc) => (
            <div key={doc.label}>
              <p className="text-sm font-semibold mb-2" style={{ color: "var(--color-text-primary)" }}>
                {doc.label} {doc.required && <span className="text-red-500">*</span>}
                {!doc.required && <span className="font-normal text-xs" style={{ color: "var(--color-text-secondary)" }}> (optional)</span>}
              </p>
              {doc.value ? (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl"
                  style={{ backgroundColor: "var(--color-brand-50)", border: "1.5px solid var(--color-brand-200)" }}>
                  <CheckCircle2 className="w-4 h-4" style={{ color: "var(--color-brand-600)" }} />
                  <span className="text-sm flex-1 truncate" style={{ color: "var(--color-brand-700)" }}>{doc.value}</span>
                  <button onClick={() => doc.setter("")} aria-label="Remove file"
                    className="p-0.5 hover:bg-[var(--color-brand-100)] rounded-full">
                    <X className="w-4 h-4" style={{ color: "var(--color-brand-600)" }} />
                  </button>
                </div>
              ) : (
                <label
                  className="flex items-center gap-3 px-4 py-4 cursor-pointer transition-all hover:bg-[var(--color-brand-50)]"
                  style={{ border: "2px dashed var(--color-brand-300)", borderRadius: "var(--radius-xl)", backgroundColor: "var(--color-neutral-50)" }}
                >
                  <Upload className="w-5 h-5" style={{ color: "var(--color-brand-400)" }} />
                  <span className="text-sm" style={{ color: "var(--color-brand-600)" }}>Click to upload</span>
                  <span className="text-xs ml-auto" style={{ color: "var(--color-text-secondary)" }}>JPG, PNG, PDF</span>
                  <input type="file" className="sr-only" accept=".jpg,.png,.pdf"
                    onChange={(e) => { if (e.target.files?.[0]) doc.setter(e.target.files[0].name) }}
                    aria-label={`Upload ${doc.label}`} />
                </label>
              )}
            </div>
          ))}

          <div className="flex gap-3">
            <Button variant="ghost" size="lg" iconLeft={<ArrowLeft className="w-5 h-5" />} onClick={() => setStep(1)}>Back</Button>
            <Button variant="primary" size="lg" fullWidth iconRight={<ArrowRight className="w-5 h-5" />}
              onClick={() => { if (!idDoc) { toast.error("Upload your government ID"); return } setStep(3) }}>
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 3: Availability ──────────────────────────────────── */}
      {step === 3 && (
        <div className="space-y-5">
          <div>
            <h2 className="text-lg font-bold mb-1" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
              Set Your Availability
            </h2>
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
              Tap a day to add time slots when you&apos;re free to work
            </p>
          </div>
          <WorkerAvailabilityEditor
            availability={availability}
            onChange={setAvailability}
            month={avMonth}
            onMonthChange={setAvMonth}
          />
          <div className="flex gap-3">
            <Button variant="ghost" size="lg" iconLeft={<ArrowLeft className="w-5 h-5" />} onClick={() => setStep(2)}>Back</Button>
            <Button variant="primary" size="lg" fullWidth iconRight={<ArrowRight className="w-5 h-5" />}
              onClick={() => setStep(4)}>
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 4: Review & Submit ───────────────────────────────── */}
      {step === 4 && (
        <div className="space-y-5">
          <h2 className="text-lg font-bold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
            Review & Submit
          </h2>

          <div className="p-5 space-y-3"
            style={{ backgroundColor: "var(--color-neutral-0)", border: "1.5px solid var(--color-border-default)", borderRadius: "var(--radius-xl)" }}>
            <div className="flex items-center gap-4 pb-4" style={{ borderBottom: "1px solid var(--color-border-default)" }}>
              <Avatar name={name || "You"} size="lg" />
              <div>
                <p className="font-bold" style={{ color: "var(--color-text-primary)" }}>{name || "Your Name"}</p>
                <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{city} · {pincode}</p>
              </div>
            </div>
            {[
              { label: "Skills", value: skills.map((s) => SKILLS_OPTIONS.find((o) => o.id === s)?.label).join(", ") || "—" },
              { label: "Experience", value: skills.map((s) => `${SKILLS_OPTIONS.find((o) => o.id === s)?.label}: ${experience[s] ?? 1}y`).join(", ") || "—" },
              { label: "Gov. ID",    value: idDoc  || "—" },
              { label: "Certificate",value: certDoc || "Not provided" },
              { label: "Slots set",  value: `${availability.length} slot${availability.length !== 1 ? "s" : ""}` },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between gap-4 text-sm">
                <span style={{ color: "var(--color-text-secondary)" }}>{label}</span>
                <span className="font-medium text-right" style={{ color: "var(--color-text-primary)" }}>{value}</span>
              </div>
            ))}
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-[#1A9458] focus-visible:outline-none"
              aria-required
            />
            <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
              I agree to HomeServ&apos;s{" "}
              <button type="button" className="underline font-semibold" style={{ color: "var(--color-brand-600)" }}
                onClick={() => toast.info("Terms coming soon")}>
                Terms & Conditions
              </button>{" "}
              and confirm the information provided is accurate.
            </span>
          </label>

          <div className="flex gap-3">
            <Button variant="ghost" size="lg" iconLeft={<ArrowLeft className="w-5 h-5" />} onClick={() => setStep(3)}>Back</Button>
            <Button variant="primary" size="lg" fullWidth loading={submitting} onClick={handleSubmit}>
              Submit for Verification
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
