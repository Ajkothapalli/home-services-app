"use client"

import * as React from "react"
import {
  Button, Input, Textarea, Select, Card, CardHeader, CardBody, CardFooter,
  Badge, Avatar, AvatarGroup,
  Spinner, SkeletonText, SkeletonAvatar, SkeletonCard, SkeletonButton,
  Modal, BottomSheet, Toaster, useToast,
  CustomerSlotPicker, WorkerAvailabilityEditor,
  ServiceCard, StepProgress, Rating, EmptyState,
} from "@/design-system"
import {
  ArrowRight, Download, Trash2, Star, ChevronLeft, Zap, Sparkles,
  Mail, Lock, Search, CalendarX, Home, Phone,
} from "lucide-react"
import { SERVICES, generateMockSlots } from "@/lib/mock-data"
import type { TimeSlot } from "@/lib/mock-data"
import type { Step } from "@/design-system"

// ── Layout helpers ────────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <div className="rounded-[32px] border overflow-hidden"
        style={{ backgroundColor: "var(--color-neutral-0)", borderColor: "var(--color-border-default)", boxShadow: "var(--shadow-sm)" }}>
        <div className="px-8 py-5 border-b" style={{ backgroundColor: "var(--color-neutral-50)", borderColor: "var(--color-border-default)" }}>
          <h2 className="text-xl font-bold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>{title}</h2>
        </div>
        <div className="px-8 py-8">{children}</div>
      </div>
    </section>
  )
}

function Sub({ label, dark, children }: { label: string; dark?: boolean; children: React.ReactNode }) {
  return (
    <div className="mb-6 last:mb-0">
      <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 mb-4 rounded-full"
        style={{
          backgroundColor: dark ? "rgba(26,148,88,0.15)" : "var(--color-neutral-100)",
          color: dark ? "#9FE3BF" : "var(--color-text-secondary)",
          border: dark ? "1px solid rgba(26,148,88,0.3)" : "1px solid var(--color-border-default)",
        }}>
        {label}
      </span>
      <div className="flex flex-wrap items-start gap-4 p-6 rounded-[24px]"
        style={{
          background: dark ? "linear-gradient(135deg, #021208 0%, #07361F 40%, #0D5230 70%, #021208 100%)" : "var(--color-neutral-50)",
          border: dark ? "1px solid rgba(26,148,88,0.2)" : "1px solid var(--color-border-default)",
        }}>
        {children}
      </div>
    </div>
  )
}

function Swatch({ cssVar, label }: { cssVar: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-14 h-14 rounded-2xl border" style={{ backgroundColor: `var(${cssVar})`, borderColor: "var(--color-border-default)", boxShadow: "var(--shadow-sm)" }} />
      <span className="text-[10px] font-medium text-center max-w-[68px] leading-tight" style={{ color: "var(--color-text-secondary)" }}>{label}</span>
    </div>
  )
}

// ── Toast demo inner (needs hook, must be inside Toaster) ─────────────────────
function ToastDemo() {
  const toast = useToast()
  return (
    <Sub label="Trigger toasts">
      <Button variant="primary" size="sm" onClick={() => toast.success("Booking confirmed! 🎉")}>Success</Button>
      <Button variant="destructive" size="sm" onClick={() => toast.error("Payment failed. Try again.")}>Error</Button>
      <Button variant="secondary" size="sm" onClick={() => toast.warning("Quote expires in 2 hours.")}>Warning</Button>
      <Button variant="ghost" size="sm" onClick={() => toast.info("Provider is 5 mins away.")}>Info</Button>
    </Sub>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function DesignSystemPage() {
  // Modals
  const [modalOpen, setModalOpen]       = React.useState(false)
  const [sheetOpen, setSheetOpen]       = React.useState(false)

  // Rating
  const [ratingVal, setRatingVal]       = React.useState(3)

  // Calendar state
  const [custMonth, setCustMonth]       = React.useState(new Date())
  const [selectedSlot, setSelectedSlot] = React.useState<string | null>(null)
  const [workerMonth, setWorkerMonth]   = React.useState(new Date())
  const [availability, setAvailability] = React.useState<TimeSlot[]>(generateMockSlots("w1"))
  const custSlots                       = generateMockSlots("w1")

  // Steps
  const steps3: Step[] = [
    { id: "s1", label: "Describe Issue", status: "completed" },
    { id: "s2", label: "Pick Slot",      status: "current"   },
    { id: "s3", label: "Pay & Confirm",  status: "upcoming"  },
  ]
  const steps5: Step[] = [
    { id: "p1", label: "Profile",      status: "completed" },
    { id: "p2", label: "Skills",       status: "completed" },
    { id: "p3", label: "Documents",    status: "current"   },
    { id: "p4", label: "Availability", status: "upcoming"  },
    { id: "p5", label: "Review",       status: "upcoming"  },
  ]

  return (
    <Toaster>
      <div className="min-h-screen" style={{ backgroundColor: "var(--color-neutral-100)" }}>

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <div className="relative overflow-hidden px-8 pt-16 pb-20 md:px-16 rounded-b-[48px]"
          style={{ background: "linear-gradient(135deg, #021208 0%, #07361F 35%, #0D5230 65%, #13723F 85%, #021208 100%)" }}>
          <div className="absolute top-[-80px] right-[-80px] w-96 h-96 rounded-full opacity-25 blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, #2EB374, transparent)" }} />
          <div className="absolute bottom-[-60px] left-[8%] w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, #F5A623, transparent)" }} />
          <div className="relative max-w-5xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
              style={{ background: "linear-gradient(135deg, rgba(26,148,88,0.25), rgba(245,166,35,0.2))", border: "1px solid rgba(93,203,150,0.45)", color: "#9FE3BF" }}>
              <Sparkles className="w-3 h-3" /> HomeServ Design System
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-5" style={{ fontFamily: "var(--font-sora)" }}>Component Library</h1>
            <p className="text-lg max-w-xl mb-10" style={{ color: "rgba(255,255,255,0.55)" }}>Every component, variant, state, and size — all 14 sections.</p>
            <div className="flex flex-wrap gap-2">
              {["Colors","Typography","Buttons","Inputs","Cards","Badges","Avatars","Modals","Toasts","Skeletons","Calendar","ServiceCard","StepProgress","Rating"].map((item) => (
                <span key={item} className="px-4 py-1.5 rounded-full text-xs font-semibold"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)" }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">

          {/* ── 1. Colors ───────────────────────────────────────────────── */}
          <Section title="1. Color Palette — Leaf Green">
            {[
              { label: "Brand (Leaf Green)", tokens: [50,100,200,300,400,500,600,700,800,900], prefix: "brand" },
              { label: "Neutral",            tokens: [0,50,100,200,300,400,500,600,700,800,900], prefix: "neutral" },
            ].map(({ label, tokens, prefix }) => (
              <div key={label} className="mb-5 p-5 rounded-[20px]" style={{ backgroundColor: "var(--color-neutral-50)", border: "1px solid var(--color-border-default)" }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: "var(--color-text-secondary)" }}>{label}</p>
                <div className="flex flex-wrap gap-3">
                  {tokens.map((n) => <Swatch key={n} cssVar={`--color-${prefix}-${n}`} label={`${prefix}-${n}`} />)}
                </div>
              </div>
            ))}
            <div className="p-5 rounded-[20px]" style={{ backgroundColor: "var(--color-neutral-50)", border: "1px solid var(--color-border-default)" }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: "var(--color-text-secondary)" }}>Semantic</p>
              <div className="flex flex-wrap gap-3">
                {["success-50","success-500","success-700","warning-50","warning-500","warning-700","error-50","error-500","error-700","info-50","info-500"].map((t) => (
                  <Swatch key={t} cssVar={`--color-${t}`} label={t} />
                ))}
              </div>
            </div>
          </Section>

          {/* ── 2. Typography ───────────────────────────────────────────── */}
          <Section title="2. Typography Scale">
            <div className="rounded-[20px] overflow-hidden border" style={{ borderColor: "var(--color-border-default)" }}>
              {[
                { cls: "text-5xl",  label: "5xl · 48px",  text: "Display Heading" },
                { cls: "text-4xl",  label: "4xl · 36px",  text: "Page Heading" },
                { cls: "text-3xl",  label: "3xl · 30px",  text: "Section Title" },
                { cls: "text-2xl",  label: "2xl · 24px",  text: "Card Title" },
                { cls: "text-xl",   label: "xl · 20px",   text: "Subheading" },
                { cls: "text-lg",   label: "lg · 18px",   text: "Large body text" },
                { cls: "text-base", label: "base · 16px", text: "Body — primary reading size" },
                { cls: "text-sm",   label: "sm · 14px",   text: "Small — labels, helpers" },
                { cls: "text-xs",   label: "xs · 12px",   text: "Caption — badges, metadata" },
              ].map(({ cls, label, text }, i) => (
                <div key={cls} className="flex items-baseline gap-5 px-6 py-4"
                  style={{ backgroundColor: i % 2 === 0 ? "var(--color-neutral-0)" : "var(--color-neutral-50)", borderBottom: "1px solid var(--color-border-default)" }}>
                  <span className="text-xs w-28 shrink-0 font-mono px-2 py-0.5 rounded-lg" style={{ backgroundColor: "var(--color-neutral-100)", color: "var(--color-text-secondary)" }}>{label}</span>
                  <span className={`${cls} font-semibold`} style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>{text}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* ── 3. Buttons ──────────────────────────────────────────────── */}
          <Section title="3. Buttons — Leaf Green Gradients">
            <Sub label="All variants — dark" dark>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </Sub>
            <Sub label="All variants — light">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </Sub>
            <Sub label="Sizes — Primary" dark>
              <Button size="xs">XSmall</Button>
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button size="xl">XLarge</Button>
            </Sub>
            <Sub label="Icons" dark>
              <Button iconLeft={<Sparkles className="w-4 h-4" />}>Book Service</Button>
              <Button iconRight={<ArrowRight className="w-4 h-4" />}>Continue</Button>
              <Button variant="secondary" iconLeft={<Star className="w-4 h-4" />}>Favourite</Button>
              <Button variant="outline" iconLeft={<Download className="w-4 h-4" />}>Download</Button>
              <Button variant="destructive" iconLeft={<Trash2 className="w-4 h-4" />}>Delete</Button>
              <Button variant="ghost" iconLeft={<ChevronLeft className="w-4 h-4" />}>Back</Button>
            </Sub>
            <Sub label="Loading states" dark>
              <Button loading>Primary</Button>
              <Button variant="secondary" loading>Secondary</Button>
              <Button variant="outline" loading>Outline</Button>
              <Button variant="destructive" loading>Destructive</Button>
            </Sub>
            <Sub label="Disabled states">
              <Button disabled>Primary</Button>
              <Button variant="secondary" disabled>Secondary</Button>
              <Button variant="ghost" disabled>Ghost</Button>
              <Button variant="outline" disabled>Outline</Button>
              <Button variant="destructive" disabled>Destructive</Button>
            </Sub>
            <Sub label="Full width" dark>
              <div className="w-full flex flex-col gap-3">
                <Button fullWidth size="xl" iconRight={<ArrowRight className="w-5 h-5" />}>Book Now</Button>
                <Button variant="secondary" fullWidth size="lg">Add to Wishlist</Button>
                <Button variant="outline" fullWidth>Learn More</Button>
              </div>
            </Sub>
          </Section>

          {/* ── 4. Inputs ───────────────────────────────────────────────── */}
          <Section title="4. Inputs">
            <Sub label="Default variants">
              <div className="w-full max-w-sm space-y-4">
                <Input label="Full Name" placeholder="Priya Sharma" required />
                <Input label="Email" placeholder="priya@example.com" type="email" prefix={<Mail className="w-4 h-4" />} />
                <Input label="Password" placeholder="••••••••" type="password" prefix={<Lock className="w-4 h-4" />} />
                <Input label="Search" placeholder="Search services…" suffix={<Search className="w-4 h-4" />} />
                <Input label="Phone" placeholder="+91 98765 43210" prefix={<Phone className="w-4 h-4" />} helperText="We'll send a verification OTP" />
              </div>
            </Sub>
            <Sub label="States">
              <div className="w-full max-w-sm space-y-4">
                <Input label="Error state" placeholder="Enter email" error="This email is already registered" defaultValue="bad@" />
                <Input label="Success state" placeholder="Enter pincode" success defaultValue="400058" helperText="Valid Mumbai pincode ✓" />
                <Input label="Disabled" placeholder="Cannot edit" disabled defaultValue="Fixed value" />
                <Input label="Filled variant" placeholder="Filled background" variant="filled" />
              </div>
            </Sub>
            <Sub label="Sizes">
              <div className="w-full max-w-sm space-y-3">
                <Input inputSize="sm" placeholder="Small input" label="Small" />
                <Input inputSize="md" placeholder="Medium input (default)" label="Medium" />
                <Input inputSize="lg" placeholder="Large input" label="Large" />
              </div>
            </Sub>
            <Sub label="Textarea">
              <div className="w-full max-w-sm space-y-4">
                <Textarea label="Description" placeholder="Describe the issue in detail…" helperText="Min 20 characters" required />
                <Textarea label="Error state" placeholder="Enter description" error="Description is required" />
              </div>
            </Sub>
            <Sub label="Select / Dropdown">
              <div className="w-full max-w-sm space-y-4">
                <Select
                  label="Service type"
                  placeholder="Choose a service…"
                  required
                  options={[
                    { value: "seepage", label: "Seepage Repair" },
                    { value: "tiling",  label: "Tiling & Grouting" },
                    { value: "welding", label: "Welding" },
                    { value: "plumbing", label: "Plumbing" },
                  ]}
                />
                <Select
                  label="Slot duration"
                  helperText="Duration affects pricing"
                  options={[
                    { value: "1h",   label: "1 hour" },
                    { value: "2h",   label: "2 hours" },
                    { value: "half", label: "Half day" },
                    { value: "full", label: "Full day" },
                  ]}
                />
                <Select
                  label="Error state"
                  error="Please select a service"
                  placeholder="Choose…"
                  options={[
                    { value: "a", label: "Option A" },
                    { value: "b", label: "Option B" },
                  ]}
                />
              </div>
            </Sub>
          </Section>

          {/* ── 5. Cards ────────────────────────────────────────────────── */}
          <Section title="5. Cards">
            <Sub label="All variants">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                {(["elevated","outlined","filled","interactive"] as const).map((v) => (
                  <Card key={v} variant={v}>
                    <CardHeader><span className="font-bold text-sm" style={{ color: "var(--color-text-primary)" }}>{v}</span></CardHeader>
                    <CardBody><p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>Card body content goes here. This card uses the {v} variant style.</p></CardBody>
                    <CardFooter><Button size="sm" variant="secondary">Action</Button></CardFooter>
                  </Card>
                ))}
              </div>
            </Sub>
            <Sub label="Padding options">
              <div className="flex gap-4 flex-wrap w-full">
                {(["none","sm","md","lg"] as const).map((p) => (
                  <Card key={p} variant="outlined" padding={p} className="min-w-[120px]">
                    <p className="text-xs font-semibold" style={{ color: "var(--color-text-secondary)" }}>padding=&quot;{p}&quot;</p>
                  </Card>
                ))}
              </div>
            </Sub>
          </Section>

          {/* ── 6. Badges ───────────────────────────────────────────────── */}
          <Section title="6. Badges">
            {(["default","success","warning","error","info","neutral"] as const).map((variant) => (
              <Sub key={variant} label={variant}>
                <Badge variant={variant} badgeStyle="filled">{variant} filled</Badge>
                <Badge variant={variant} badgeStyle="soft">{variant} soft</Badge>
                <Badge variant={variant} badgeStyle="outline">{variant} outline</Badge>
                <Badge variant={variant} badgeStyle="soft" dot>{variant} dot</Badge>
                <Badge variant={variant} badgeStyle="soft" size="sm">sm</Badge>
                <Badge variant={variant} badgeStyle="soft" size="md">md</Badge>
                <Badge variant={variant} badgeStyle="soft" size="lg">lg</Badge>
              </Sub>
            ))}
          </Section>

          {/* ── 7. Avatars ──────────────────────────────────────────────── */}
          <Section title="7. Avatars">
            <Sub label="Sizes with initials (leaf gradients)">
              {(["xs","sm","md","lg","xl","2xl"] as const).map((s) => (
                <div key={s} className="flex flex-col items-center gap-2">
                  <Avatar name="Priya Sharma" size={s} />
                  <span className="text-[10px]" style={{ color: "var(--color-text-secondary)" }}>{s}</span>
                </div>
              ))}
            </Sub>
            <Sub label="Status indicators" dark>
              <Avatar name="Ramesh Kumar" size="lg" status="online" />
              <Avatar name="Suresh Patel" size="lg" status="busy" />
              <Avatar name="Arjun Singh"  size="lg" status="offline" />
            </Sub>
            <Sub label="AvatarGroup">
              <AvatarGroup avatars={[
                { name: "Priya Sharma" },
                { name: "Ramesh Kumar" },
                { name: "Suresh Patel" },
                { name: "Arjun Singh" },
                { name: "Meera Nair" },
                { name: "Karan Mehta" },
              ]} size="md" max={4} />
            </Sub>
          </Section>

          {/* ── 8. Modals + BottomSheet ─────────────────────────────────── */}
          <Section title="8. Modals + BottomSheet">
            <Sub label="Open overlays">
              <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
              <Button variant="secondary" onClick={() => setSheetOpen(true)}>Open BottomSheet</Button>
            </Sub>
            <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Confirm Booking" description="Review your booking details before confirming.">
              <div className="space-y-4">
                <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>Seepage Repair · Bathroom · Tomorrow 10:00 AM</p>
                <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>Total: ₹4,956 (incl. GST)</p>
                <div className="flex gap-3 pt-2">
                  <Button fullWidth>Confirm & Pay</Button>
                  <Button variant="outline" fullWidth onClick={() => setModalOpen(false)}>Cancel</Button>
                </div>
              </div>
            </Modal>
            <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Select Time Slot">
              <div className="space-y-3">
                {["09:00 – 11:00 AM","02:00 – 04:00 PM","05:00 – 07:00 PM"].map((slot) => (
                  <button key={slot} onClick={() => setSheetOpen(false)}
                    className="w-full text-left px-4 py-3 rounded-2xl font-semibold text-sm transition-colors hover:bg-[var(--color-brand-50)]"
                    style={{ border: "1.5px solid var(--color-border-default)", color: "var(--color-text-primary)" }}>
                    {slot}
                  </button>
                ))}
              </div>
            </BottomSheet>
          </Section>

          {/* ── 9. Toasts ───────────────────────────────────────────────── */}
          <Section title="9. Toasts">
            <ToastDemo />
          </Section>

          {/* ── 10. Loading / Skeletons ─────────────────────────────────── */}
          <Section title="10. Loading / Skeletons">
            <Sub label="Spinners — all sizes" dark>
              {(["xs","sm","md","lg","xl"] as const).map((s) => (
                <div key={s} className="flex flex-col items-center gap-2">
                  <Spinner size={s} color="#5DCB96" />
                  <span className="text-[10px]" style={{ color: "#9FE3BF" }}>{s}</span>
                </div>
              ))}
            </Sub>
            <Sub label="Skeleton components">
              <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-3">
                  <p className="text-xs font-semibold" style={{ color: "var(--color-text-secondary)" }}>SkeletonText</p>
                  <SkeletonText lines={4} />
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-semibold" style={{ color: "var(--color-text-secondary)" }}>Avatars + Button</p>
                  <div className="flex gap-2">
                    {(["xs","sm","md","lg"] as const).map((s) => <SkeletonAvatar key={s} size={s} />)}
                  </div>
                  <SkeletonButton width={140} />
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-semibold" style={{ color: "var(--color-text-secondary)" }}>SkeletonCard</p>
                  <SkeletonCard height={120} />
                </div>
              </div>
            </Sub>
          </Section>

          {/* ── 11. CalendarSlot ────────────────────────────────────────── */}
          <Section title="11. CalendarSlot">
            <Sub label="CustomerSlotPicker">
              <div className="w-full max-w-sm">
                <CustomerSlotPicker
                  slots={custSlots}
                  selectedSlotId={selectedSlot}
                  onSelect={(s) => setSelectedSlot(s.id)}
                  month={custMonth}
                  onMonthChange={setCustMonth}
                />
              </div>
            </Sub>
            <Sub label="WorkerAvailabilityEditor">
              <div className="w-full max-w-sm">
                <WorkerAvailabilityEditor
                  availability={availability}
                  onChange={setAvailability}
                  month={workerMonth}
                  onMonthChange={setWorkerMonth}
                />
              </div>
            </Sub>
          </Section>

          {/* ── 12. ServiceCard ─────────────────────────────────────────── */}
          <Section title="12. ServiceCard">
            <Sub label="All 4 services">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                {SERVICES.map((s) => (
                  <ServiceCard
                    key={s.id}
                    id={s.id}
                    iconName={s.icon as "droplets" | "grid-3x3" | "layers" | "zap"}
                    name={s.name}
                    description={s.description}
                    priceFrom={s.priceFrom}
                    rating={s.rating}
                    reviewCount={s.reviews}
                    duration={s.duration}
                    badge={s.badge}
                    onBook={() => {}}
                  />
                ))}
              </div>
            </Sub>
          </Section>

          {/* ── 13. StepProgress ────────────────────────────────────────── */}
          <Section title="13. StepProgress">
            <Sub label="3-step horizontal (booking wizard)">
              <div className="w-full"><StepProgress steps={steps3} orientation="horizontal" /></div>
            </Sub>
            <Sub label="5-step horizontal (worker onboarding)">
              <div className="w-full"><StepProgress steps={steps5} orientation="horizontal" /></div>
            </Sub>
            <Sub label="Vertical orientation">
              <StepProgress steps={steps3} orientation="vertical" />
            </Sub>
          </Section>

          {/* ── 14. Rating ──────────────────────────────────────────────── */}
          <Section title="14. Rating">
            <Sub label="Read-only — all sizes">
              <div className="space-y-3">
                {(["sm","md","lg"] as const).map((s) => (
                  <div key={s} className="flex items-center gap-4">
                    <span className="text-xs font-semibold w-8" style={{ color: "var(--color-text-secondary)" }}>{s}</span>
                    <Rating value={4.5} size={s} showValue />
                    <Rating value={3}   size={s} showValue />
                    <Rating value={5}   size={s} showValue />
                  </div>
                ))}
              </div>
            </Sub>
            <Sub label="Interactive" dark>
              <div className="flex flex-col items-start gap-3">
                <Rating value={ratingVal} interactive onChange={setRatingVal} size="lg" showValue />
                <p className="text-sm" style={{ color: "#9FE3BF" }}>Selected: {ratingVal} star{ratingVal !== 1 ? "s" : ""}</p>
              </div>
            </Sub>
          </Section>

          {/* ── 15. EmptyState ──────────────────────────────────────────── */}
          <Section title="15. EmptyState">
            <Sub label="With action">
              <div className="w-full">
                <EmptyState
                  icon={<CalendarX className="w-8 h-8" />}
                  title="No bookings yet"
                  description="Book your first home service to get started. We'll connect you with verified professionals."
                  action={<Button iconLeft={<Home className="w-4 h-4" />}>Browse Services</Button>}
                />
              </div>
            </Sub>
            <Sub label="Without action">
              <div className="w-full">
                <EmptyState
                  icon={<Zap className="w-8 h-8" />}
                  title="No earnings yet"
                  description="Accept your first job to start earning."
                />
              </div>
            </Sub>
          </Section>

          <div className="h-16" />
        </div>
      </div>
    </Toaster>
  )
}
