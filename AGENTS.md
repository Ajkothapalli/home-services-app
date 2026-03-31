# HomeServ — Agent Instructions (AGENTS.md)
> **Google Antigravity**: place this file in your project root — Antigravity reads it automatically.
> **Claude Code**: also compatible (Claude Code reads both AGENTS.md and CLAUDE.md).
> **Cursor / Codex**: rename to `.cursorrules` or paste into the system prompt field.

You are building **HomeServ**, a two-sided home services marketplace for seepage repair, tiling, grouting, and welding. Follow these instructions exactly. Never skip phases. Never write one-off styles.

## Two User Personas

| Persona | Role |
|---|---|
| **Customer** | Books a service, picks a time slot, pays |
| **Worker / Provider** | Gets onboarded, sets availability, accepts jobs, gets paid |

---

## Tech Stack

Use exactly these. Do not substitute.

```
Framework:      Next.js 14+ (App Router, TypeScript strict mode)
Styling:        Tailwind CSS v3 + CSS Variables for all design tokens
Components:     shadcn/ui as a base layer (customised to match design system)
Icons:          lucide-react
Fonts:          Inter (body) + Sora (headings) — next/font/google
State:          Zustand
Server State:   TanStack Query v5 (React Query)
Forms:          React Hook Form + Zod
Calendar:       react-big-calendar (customer view) + custom slot grid (worker view)
Date Utils:     date-fns
Animation:      Framer Motion
Payments:       Razorpay (mock stub now — real keys injected later)
Auth:           Mock auth context (OTP flow UI only, no real backend yet)
API Layer:      Mock data via src/lib/mock-data.ts + simulated async delays
                Replace mock fns with real API calls later without touching UI
```

---

## Rules

- NEVER hardcode a hex colour — always use a CSS variable token
- NEVER write inline `style={{}}` — always Tailwind or token classes
- NEVER use `any` in TypeScript
- NEVER skip to product screens before all design system components are done and reviewed
- ALWAYS use `cn()` (clsx + tailwind-merge) for conditional class names
- ALWAYS add ARIA labels and keyboard navigation to interactive elements
- ALWAYS put mock data in `src/lib/mock-data.ts` — never inline in components
- ALL buttons and pill elements must use `border-radius: var(--radius-full)`
- ALL cards must use `border-radius: var(--radius-xl)` or `var(--radius-2xl)`
- ASK for review after each design system component group before proceeding

---

## Phase 1 — Design Tokens

Create `src/styles/tokens.css` and import it in `globals.css`.

```css
:root {
  /* ─── Brand ─────────────────────────────────────────────── */
  --color-brand-50:  #EEF2FF;
  --color-brand-100: #E0E7FF;
  --color-brand-200: #C7D2FE;
  --color-brand-300: #A5B4FC;
  --color-brand-400: #818CF8;
  --color-brand-500: #4F6EF7;
  --color-brand-600: #3B5BDB;
  --color-brand-700: #2F4AC2;
  --color-brand-800: #1E3A8A;
  --color-brand-900: #1E3A8A;

  /* ─── Neutrals ───────────────────────────────────────────── */
  --color-neutral-0:   #FFFFFF;
  --color-neutral-50:  #F8F9FB;
  --color-neutral-100: #F1F3F7;
  --color-neutral-200: #E4E7EE;
  --color-neutral-300: #CBD0DC;
  --color-neutral-400: #9CA3AF;
  --color-neutral-500: #6B7280;
  --color-neutral-600: #4B5563;
  --color-neutral-700: #374151;
  --color-neutral-800: #1F2937;
  --color-neutral-900: #111827;

  /* ─── Semantic ───────────────────────────────────────────── */
  --color-success-50:  #F0FDF4;
  --color-success-500: #22C55E;
  --color-success-700: #15803D;

  --color-warning-50:  #FFFBEB;
  --color-warning-500: #F59E0B;
  --color-warning-700: #B45309;

  --color-error-50:    #FEF2F2;
  --color-error-500:   #EF4444;
  --color-error-700:   #B91C1C;

  --color-info-50:     #EFF6FF;
  --color-info-500:    #3B82F6;

  /* ─── Surface ────────────────────────────────────────────── */
  --color-surface-page:    var(--color-neutral-50);
  --color-surface-card:    var(--color-neutral-0);
  --color-surface-overlay: rgba(0, 0, 0, 0.48);

  /* ─── Border ─────────────────────────────────────────────── */
  --color-border-default: var(--color-neutral-200);
  --color-border-strong:  var(--color-neutral-300);
  --color-border-focus:   var(--color-brand-500);

  /* ─── Text ───────────────────────────────────────────────── */
  --color-text-primary:   var(--color-neutral-900);
  --color-text-secondary: var(--color-neutral-500);
  --color-text-disabled:  var(--color-neutral-300);
  --color-text-inverse:   var(--color-neutral-0);
  --color-text-brand:     var(--color-brand-600);

  /* ─── Border Radius ──────────────────────────────────────── */
  --radius-xs:   4px;
  --radius-sm:   8px;
  --radius-md:   12px;
  --radius-lg:   16px;
  --radius-xl:   20px;
  --radius-2xl:  24px;
  --radius-full: 9999px;

  /* ─── Spacing (4px grid) ─────────────────────────────────── */
  --space-1:  4px;   --space-2:  8px;   --space-3:  12px;
  --space-4:  16px;  --space-5:  20px;  --space-6:  24px;
  --space-8:  32px;  --space-10: 40px;  --space-12: 48px;
  --space-16: 64px;  --space-20: 80px;

  /* ─── Shadows ────────────────────────────────────────────── */
  --shadow-xs: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.10), 0 4px 6px rgba(0,0,0,0.05);
  --shadow-xl: 0 20px 25px rgba(0,0,0,0.10), 0 10px 10px rgba(0,0,0,0.04);

  /* ─── Typography ─────────────────────────────────────────── */
  --text-xs:   0.75rem;   /* 12px */
  --text-sm:   0.875rem;  /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg:   1.125rem;  /* 18px */
  --text-xl:   1.25rem;   /* 20px */
  --text-2xl:  1.5rem;    /* 24px */
  --text-3xl:  1.875rem;  /* 30px */
  --text-4xl:  2.25rem;   /* 36px */
  --text-5xl:  3rem;      /* 48px */

  --font-regular:  400;
  --font-medium:   500;
  --font-semibold: 600;
  --font-bold:     700;

  --leading-tight:   1.25;
  --leading-snug:    1.375;
  --leading-normal:  1.5;
  --leading-relaxed: 1.625;

  /* ─── Transitions ────────────────────────────────────────── */
  --transition-fast:   100ms ease;
  --transition-base:   200ms ease;
  --transition-slow:   300ms ease;
  --transition-spring: 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

---

## Phase 2 — Design System Components

Build in `src/design-system/`. Export all from `src/design-system/index.ts`.

### Component Specifications

#### Button (`src/design-system/Button/Button.tsx`)

```typescript
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline' | 'link'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  fullWidth?: boolean
}
```

Sizing (height / padding-x / font-size):
```
xs  → h-8   px-3  text-xs    (32px)
sm  → h-9   px-4  text-sm    (36px)
md  → h-11  px-5  text-base  (44px)  ← default
lg  → h-13  px-6  text-lg    (52px)
xl  → h-15  px-8  text-xl    (60px)
```

ALL buttons: `border-radius: var(--radius-full)`. No exceptions.
Loading state: replace children with `<Spinner />`, lock width so layout never shifts.
Variant styles:
```
primary:     bg-[--color-brand-500] text-white hover:bg-[--color-brand-600]
secondary:   bg-[--color-brand-50]  text-[--color-brand-700] hover:bg-[--color-brand-100]
ghost:       bg-transparent text-[--color-text-primary] hover:bg-[--color-neutral-100]
destructive: bg-[--color-error-500] text-white hover:bg-[--color-error-700]
outline:     border border-[--color-border-strong] text-[--color-text-primary] hover:bg-[--color-neutral-50]
link:        underline text-[--color-brand-600] no background
```

---

#### Input (`src/design-system/Input/Input.tsx`)

```typescript
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helperText?: string
  error?: string
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'filled'
}
```

Border-radius: `var(--radius-lg)`. Focus ring: `ring-2 ring-[--color-border-focus]`.
Error state: red border + red helper text + error icon in suffix.
Export sub-components: `Label`, `HelperText`, `InputGroup`.

---

#### Card (`src/design-system/Card/Card.tsx`)

```typescript
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'outlined' | 'filled' | 'interactive'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}
```

Border-radius: `var(--radius-xl)`.
`interactive`: hover → `shadow-lg scale-[1.02]` transition.
Export sub-components: `CardHeader`, `CardBody`, `CardFooter`, `CardMedia`.

---

#### Badge (`src/design-system/Badge/Badge.tsx`)

```typescript
export interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'neutral'
  size?: 'sm' | 'md' | 'lg'
  style?: 'filled' | 'soft' | 'outline'
  dot?: boolean
  children: React.ReactNode
}
```

Border-radius: `var(--radius-full)`.

---

#### Avatar (`src/design-system/Avatar/Avatar.tsx`)

```typescript
export interface AvatarProps {
  src?: string
  name?: string       // for initials fallback
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  status?: 'online' | 'offline' | 'busy'
}

// Sizes: xs=24 sm=32 md=40 lg=56 xl=72 2xl=96
// Export: Avatar, AvatarGroup
```

Shape: circle (`border-radius: var(--radius-full)`).

---

#### Modal / Sheet (`src/design-system/Overlay/`)

```typescript
// Modal — centred dialog
export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  children: React.ReactNode
}

// BottomSheet — slides up from bottom (mobile-friendly)
export interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}
```

Both: Framer Motion enter/exit, backdrop blur, close on Escape + backdrop click, focus trap.
Modal: `border-radius: var(--radius-2xl)`.
BottomSheet: `border-radius: var(--radius-2xl) var(--radius-2xl) 0 0`.

---

#### Toast (`src/design-system/Toast/`)

```typescript
// Usage: toast.success("Booking confirmed!") etc.
export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export function useToast(): {
  success: (message: string) => void
  error:   (message: string) => void
  warning: (message: string) => void
  info:    (message: string) => void
}
```

Position: top-right desktop, top-center mobile. Auto-dismiss 4s. Stack max 3.
Border-radius: `var(--radius-xl)`.

---

#### Loading (`src/design-system/Loading/`)

```typescript
// Spinner
export interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: string   // defaults to currentColor
}

// Skeleton blocks
export function SkeletonText(props: { lines?: number; width?: string }): JSX.Element
export function SkeletonAvatar(props: { size?: AvatarProps['size'] }): JSX.Element
export function SkeletonCard(props: { height?: number }): JSX.Element
export function SkeletonButton(props: { width?: number }): JSX.Element
```

---

#### CalendarSlot (`src/design-system/CalendarSlot/`)

This powers both the customer booking calendar and the worker availability editor.

```typescript
export interface TimeSlot {
  id: string
  date: string          // ISO date "2026-04-01"
  startTime: string     // "09:00"
  endTime: string       // "11:00"
  status: 'available' | 'booked' | 'blocked' | 'selected'
  providerId?: string
}

// Customer: read available slots, pick one
export interface CustomerSlotPickerProps {
  slots: TimeSlot[]
  selectedSlotId: string | null
  onSelect: (slot: TimeSlot) => void
  month: Date
  onMonthChange: (d: Date) => void
}

// Worker: create/delete own availability slots
export interface WorkerAvailabilityEditorProps {
  availability: TimeSlot[]
  onChange: (slots: TimeSlot[]) => void
  month: Date
  onMonthChange: (d: Date) => void
}
```

Calendar month grid UI:
- Header: `"April 2026"` + `<` `>` pill nav buttons
- 7-column grid, weekday headers Mon–Sun
- Each day: circle button, brand-filled if selected, brand-dot if has slots
- Below calendar: horizontal scroll of time slot chips
  - Available: green soft badge, clickable
  - Booked: grey soft badge, non-clickable
  - Selected: brand filled badge
- Worker editor: click day → time range picker modal → add/remove slots

---

#### ServiceCard (`src/design-system/ServiceCard/ServiceCard.tsx`)

```typescript
export interface ServiceCardProps {
  id: string
  icon: React.ReactNode
  name: string
  description: string
  priceFrom: number
  rating: number
  reviewCount: number
  duration: string
  badge?: string      // "Most Booked" ribbon
  onBook: () => void
}
```

Layout (top→bottom): icon circle → name → description → divider → meta row (⭐ rating · ⏱ duration · from ₹X) → "Book Now" pill button.
Border-radius: `var(--radius-2xl)`. Hover: `scale(1.02)` + shadow lift.

---

#### StepProgress (`src/design-system/StepProgress/StepProgress.tsx`)

```typescript
export interface Step {
  id: string
  label: string
  status: 'upcoming' | 'current' | 'completed'
}

export interface StepProgressProps {
  steps: Step[]
  orientation?: 'horizontal' | 'vertical'
}
```

Completed: filled brand circle + white checkmark.
Current: brand ring (pulsing) + brand number.
Connector: brand for completed segments, neutral-200 for upcoming.

---

#### Rating (`src/design-system/Rating/Rating.tsx`)

```typescript
export interface RatingProps {
  value: number           // 0–5, supports 0.5 increments
  max?: number            // default 5
  interactive?: boolean
  onChange?: (value: number) => void
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean     // show "4.8" next to stars
}
```

---

### Design System Showcase Page

Create `src/app/design-system/page.tsx`.

This page must show every component with every variant, size, and state before product work begins. Lay them out in labelled sections. DO NOT skip this page — it is the quality gate.

Section order:
1. Color palette swatches (all tokens)
2. Typography scale
3. Buttons — all variants × all sizes × loading × disabled × icon states
4. Inputs — default, filled, with prefix/suffix, error, success, disabled
5. Cards — all variants
6. Badges — all variants × styles
7. Avatars — all sizes × image / initials / status
8. Modals + BottomSheet (trigger buttons)
9. Toasts (trigger buttons)
10. Spinners + Skeleton examples
11. CalendarSlot — CustomerSlotPicker + WorkerAvailabilityEditor
12. ServiceCard — all 4 services
13. StepProgress — 3-step and 5-step examples
14. Rating — interactive + read-only

---

## Phase 3 — App Routes & Product Screens

Only start Phase 3 after the design system showcase page has been reviewed.

### Route Map

```
/                                 Landing page
/auth/customer                    Customer OTP login
/auth/worker                      Worker OTP login

/customer/dashboard               Homeowner home: service grid + recent bookings
/customer/services                Browse all services (filter by type)
/customer/services/[serviceId]    Service detail page + "Book Now" CTA
/customer/book/[serviceId]        3-step booking wizard
/customer/bookings                All bookings list (tabs: Upcoming / Past / Cancelled)
/customer/bookings/[bookingId]    Booking detail: status, timeline, live tracker, review
/customer/payments                Payment history + pending invoices
/customer/profile                 Edit profile, saved addresses

/worker/onboarding                5-step onboarding wizard
/worker/dashboard                 Today's jobs + quick earnings stats
/worker/availability              Monthly availability calendar editor
/worker/jobs                      All jobs list (tabs: New / Active / Completed)
/worker/jobs/[jobId]              Job detail: customer info, directions, complete job flow
/worker/earnings                  Earnings breakdown + bank withdrawal
/worker/profile                   Skills, documents, portfolio photos
```

---

### Navigation Shell

**Customer layout** (`src/app/customer/layout.tsx`):
- Desktop: sidebar 240px (expanded) / 72px (icon-only, collapsed)
- Mobile: fixed bottom tab bar (5 tabs)

```
Nav items: Home | Services | Bookings | Payments | Profile
Icons:     LayoutGrid | Wrench | CalendarDays | CreditCard | User
```

**Worker layout** (`src/app/worker/layout.tsx`):
- Same responsive shell

```
Nav items: Dashboard | Jobs | Availability | Earnings | Profile
Icons:     LayoutDashboard | ClipboardList | CalendarCheck | TrendingUp | User
```

Active state: filled brand icon + label visible (always visible on sidebar, only active tab on bottom bar).

---

### Customer — Booking Wizard (`/customer/book/[serviceId]`)

3-step flow with `StepProgress`. Animate between steps with Framer Motion (slide left on next, slide right on back).

**Step 1 — Describe the Issue**
```tsx
// Fields
<ServiceTypeSelect />           // pre-filled, editable
<AffectedAreaChips />          // multi-select: Bathroom|Kitchen|Terrace|Basement|Wall|Other
<UrgencyToggle />              // 3-pill toggle: Emergency | Urgent | Routine
<Textarea label="Describe" optional />
<PhotoUploadZone max={3} />    // drag-drop + preview thumbnails with ✕
<AddressInput withMapIcon />   // mock geocode

<Button variant="primary" size="lg" iconRight={<ArrowRight />}>
  Continue
</Button>
```

**Step 2 — Choose a Slot**
```tsx
// Left: calendar
<CustomerSlotPicker
  slots={mockSlots}
  selectedSlotId={selectedSlotId}
  onSelect={setSelectedSlot}
  month={month}
  onMonthChange={setMonth}
/>

// Right: provider preview (appears after slot is selected)
<Card variant="outlined">
  <Avatar src={provider.avatar} size="lg" status="online" />
  <div>{provider.name}</div>
  <Rating value={provider.rating} showValue size="sm" />
  <Badge variant="success" style="soft">{distance} away</Badge>
</Card>

<Button variant="primary" size="lg" disabled={!selectedSlotId}>
  Confirm Slot
</Button>
```

**Step 3 — Review & Pay**
```tsx
// Summary
<Card variant="outlined">
  {/* job summary line items */}
</Card>

// Price breakdown
<Card variant="filled">
  <LineItem label="Service charge" amount={serviceCharge} />
  <LineItem label="Visit charge" amount={149} note="waived on confirm" strikethrough />
  <LineItem label="GST (18%)" amount={gst} />
  <Divider />
  <LineItem label="Total" amount={total} bold />
</Card>

// Payment method
<PillToggle options={['UPI', 'Card', 'Net Banking', 'Wallet']} />
{method === 'upi'  && <Input label="UPI ID" placeholder="name@upi" suffix={<VerifyButton />} />}
{method === 'card' && <CardInputGroup />}  // card number + expiry + CVV

<Button variant="primary" size="xl" fullWidth loading={isPaying}
        onClick={handleRazorpayMock}>
  Pay ₹{total.toLocaleString('en-IN')} & Confirm
</Button>
```

On payment success: `toast.success("Booking Confirmed!")` + confetti burst (canvas-confetti) + `router.push('/customer/bookings/[newId]')`.

---

### Customer — Booking Detail (`/customer/bookings/[bookingId]`)

```tsx
// Status banner (full width, pill)
{status === 'upcoming'    && <StatusBanner color="info"    icon={<Clock />}  label="Scheduled for Tue, 1 Apr · 10:00 AM" />}
{status === 'en_route'    && <StatusBanner color="warning" icon={<MapPin />} label="Your provider is on the way" />}
{status === 'completed'   && <StatusBanner color="success" icon={<Check />}  label="Job Completed · Leave a Review" />}

// Provider card
<Card>
  <Avatar src={provider.avatar} size="lg" />
  <div>{provider.name}</div>
  <Rating value={provider.rating} showValue />
  <IconButton icon={<Phone />} />
  <IconButton icon={<MessageCircle />} />
</Card>

// Timeline (vertical)
<JobTimeline steps={[
  { label: 'Booking Confirmed', time: '10:32 AM', done: true },
  { label: 'Provider Assigned',  time: '10:35 AM', done: true },
  { label: 'Provider En Route',  time: null, active: status === 'en_route' },
  { label: 'Work Started',       time: null, done: false },
  { label: 'Completed',          time: null, done: false },
]} />

// Live map mock (en_route only)
{status === 'en_route' && (
  <MockMapCard eta={8} distance="2.3 km" providerName={provider.name} />
)}

// Review prompt (completed, not yet reviewed)
{status === 'completed' && !hasReview && (
  <Card>
    <Rating interactive value={reviewRating} onChange={setReviewRating} size="lg" />
    <Textarea label="Optional comment" />
    <Button variant="primary">Submit Review</Button>
  </Card>
)}

// Payment summary
<Card variant="outlined">
  <div>Paid ₹{total.toLocaleString('en-IN')} · UPI · Apr 1, 2026</div>
  <Button variant="ghost" iconLeft={<Download />}>Download Invoice</Button>
</Card>
```

---

### Worker — Onboarding Wizard (`/worker/onboarding`)

5-step wizard using `StepProgress`.

```tsx
// Step 1 — Personal Info
<CircularAvatarUpload />
<Input label="Full Name" />
<Input label="Phone" disabled value={phone} />
<Input label="Email" type="email" />
<Input label="City" />
<Input label="Pincode" maxLength={6} />

// Step 2 — Skills & Services
<p>Select all services you offer</p>
<SkillChipGrid skills={[
  { id: 'seepage', label: 'Seepage Repair', icon: <Droplets /> },
  { id: 'tiling',  label: 'Tiling',         icon: <Grid3x3 /> },
  { id: 'grouting',label: 'Grouting',        icon: <Layers />  },
  { id: 'welding', label: 'Welding',         icon: <Zap />     },
]} selected={skills} onToggle={toggleSkill} />
// For each selected skill: experience stepper
{selectedSkills.map(skill => (
  <ExperienceStepper key={skill} label={skill} value={exp[skill]} onChange={...} />
))}

// Step 3 — Documents
<UploadCard label="Government ID (Aadhaar / PAN)" accept=".jpg,.png,.pdf" />
<UploadCard label="Skills Certificate (optional)"  accept=".jpg,.png,.pdf" />

// Step 4 — Set Availability
<WorkerAvailabilityEditor availability={slots} onChange={setSlots} ... />
<p className="text-sm text-secondary">Tap a day to toggle available. Tap again to add time slots.</p>

// Step 5 — Review & Submit
<ReviewSummary data={formData} />
<Checkbox label="I agree to HomeServ Terms & Conditions" />
<Button variant="primary" size="xl" fullWidth loading={isSubmitting}>
  Submit for Verification
</Button>
// Post-submit success screen:
<SuccessIllustration />
<h2>Application Submitted!</h2>
<Badge variant="warning" style="soft" size="lg">Under Review</Badge>
<p>We'll verify your profile within 24 hours.</p>
```

---

### Worker — Availability Calendar (`/worker/availability`)

```tsx
<PageHeader title="Manage Availability" subtitle="Set the days and times you're available to work" />

<PillToggle options={['Month', 'Week']} value={view} onChange={setView} />

<WorkerAvailabilityEditor
  availability={availability}
  onChange={handleChange}
  month={currentMonth}
  onMonthChange={setCurrentMonth}
/>

// Recurring pattern
<Card variant="outlined">
  <Switch label="Repeat this day every week" value={recurring} onChange={setRecurring} />
  {recurring && <WeekdaySelector value={recurringDays} onChange={setRecurringDays} />}
</Card>

// Block a date
<Button variant="outline" iconLeft={<Ban />}>Block a Date</Button>
// Opens Modal: date picker + reason input + Block button
```

---

### Worker — Earnings (`/worker/earnings`)

```tsx
// Summary cards (3 in a row)
<StatCard label="Total Earned"        value="₹48,200" icon={<IndianRupee />} color="success" />
<StatCard label="Pending Clearance"   value="₹3,600"  icon={<Clock />}       color="warning" />
<StatCard label="This Month"          value="₹12,500" icon={<TrendingUp />}  color="brand"   />

// Filter tabs
<TabGroup tabs={['All', 'Paid', 'Pending', 'This Month']} />

// Earnings list
{earnings.map(item => (
  <EarningsRow
    key={item.id}
    jobRef={item.ref}
    service={item.service}
    customer={item.customerName}
    date={item.date}
    amount={item.amount}
    status={item.status}   // 'paid' | 'pending' | 'processing'
  />
))}

// Withdraw section
<Card variant="elevated">
  <div>Linked account: HDFC Bank ···· 4521</div>
  <Button variant="link" size="sm">Change</Button>
  <Input label="Withdraw Amount" prefix="₹" value={balance} />
  <Button variant="primary" size="lg" fullWidth iconLeft={<ArrowUpRight />}>
    Withdraw to Bank
  </Button>
  <p className="text-xs text-secondary text-center">Processed in 1–2 business days</p>
</Card>
```

---

## Mock Data (`src/lib/mock-data.ts`)

```typescript
import { addDays, setHours } from 'date-fns'

export const SERVICES = [
  { id: 'seepage', name: 'Seepage Repair',  icon: 'droplets',  priceFrom: 1200, duration: '2–4 hrs', rating: 4.8, reviews: 312, badge: 'Most Booked' },
  { id: 'tiling',  name: 'Tiling',           icon: 'grid-3x3',  priceFrom: 1800, duration: '4–8 hrs', rating: 4.7, reviews: 189, badge: undefined },
  { id: 'grouting',name: 'Grouting',          icon: 'layers',    priceFrom: 800,  duration: '1–3 hrs', rating: 4.9, reviews: 94,  badge: 'Top Rated' },
  { id: 'welding', name: 'Welding',           icon: 'zap',       priceFrom: 1500, duration: '2–5 hrs', rating: 4.6, reviews: 67,  badge: undefined },
] as const

export const WORKERS = [
  { id: 'w1', name: 'Ramesh Kumar',  avatar: '/avatars/ramesh.jpg',  rating: 4.8, reviews: 127, skills: ['seepage', 'tiling'],  city: 'Mumbai', experience: 7,  distance: '2.3 km' },
  { id: 'w2', name: 'Suresh Patel',  avatar: '/avatars/suresh.jpg',  rating: 4.9, reviews: 83,  skills: ['grouting', 'tiling'], city: 'Mumbai', experience: 5,  distance: '1.8 km' },
  { id: 'w3', name: 'Arjun Singh',   avatar: '/avatars/arjun.jpg',   rating: 4.6, reviews: 54,  skills: ['welding'],            city: 'Mumbai', experience: 9,  distance: '4.1 km' },
] as const

export const CUSTOMERS = [
  { id: 'c1', name: 'Priya Sharma', phone: '+91 98765 43210', address: '12B, Andheri West, Mumbai 400058' },
  { id: 'c2', name: 'Ajay Mehta',   phone: '+91 91234 56789', address: '5, Bandra East, Mumbai 400051' },
] as const

// Generate mock available slots for next 14 days
export function generateMockSlots(providerId: string) {
  const slots = []
  for (let i = 1; i <= 14; i++) {
    const date = addDays(new Date(), i)
    const dateStr = date.toISOString().split('T')[0]
    if (date.getDay() !== 0) {  // skip Sundays
      slots.push(
        { id: `${providerId}-${dateStr}-1`, date: dateStr, startTime: '09:00', endTime: '11:00', status: 'available' as const, providerId },
        { id: `${providerId}-${dateStr}-2`, date: dateStr, startTime: '14:00', endTime: '16:00', status: i % 3 === 0 ? 'booked' as const : 'available' as const, providerId },
      )
    }
  }
  return slots
}

export const MOCK_BOOKINGS = [
  {
    id: 'HS-2041',
    customerId: 'c1',
    workerId: 'w1',
    service: 'seepage',
    affectedArea: ['Bathroom'],
    urgency: 'urgent',
    address: '12B, Andheri West, Mumbai',
    slot: { date: '2026-04-01', startTime: '10:00', endTime: '12:00' },
    status: 'en_route',
    quote: { serviceCharge: 2400, labourCharge: 1800, visitCharge: 0, gst: 756, total: 4956 },
    payment: { method: 'UPI', status: 'paid', paidAt: '2026-03-30T10:32:00Z' },
  },
] as const

export const MOCK_EARNINGS = [
  { id: 'e1', ref: 'HS-2038', service: 'Tiling',          customerName: 'Priya Sharma', date: 'Mar 28, 2026', amount: 5400,  status: 'paid' },
  { id: 'e2', ref: 'HS-2039', service: 'Grouting',         customerName: 'Raj Verma',    date: 'Mar 29, 2026', amount: 1800,  status: 'paid' },
  { id: 'e3', ref: 'HS-2041', service: 'Seepage Repair',   customerName: 'Ajay Mehta',   date: 'Apr 01, 2026', amount: 4956,  status: 'pending' },
] as const
```

---

## Utility Functions (`src/lib/utils.ts`)

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Always use this for conditional classNames — never string concatenation
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format ₹ currency (Indian locale)
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

// Simulate async API with delay
export function mockDelay(ms = 800): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
```

---

## Empty States

Every list page must have a designed empty state. Never show a blank white page.

```tsx
// Pattern
<EmptyState
  icon={<CalendarX className="w-12 h-12 text-neutral-300" />}
  title="No bookings yet"
  description="Book your first home service to get started."
  action={<Button variant="primary" href="/customer/services">Browse Services</Button>}
/>
```

Create `EmptyState` as a design system component with `icon`, `title`, `description`, `action` props.

---

## Build Order — Follow Exactly

```
☐  1. next create → install all deps → configure tailwind, fonts, shadcn
☐  2. src/styles/tokens.css — all design tokens
☐  3. src/lib/utils.ts + src/lib/mock-data.ts
☐  4. Button (all variants, sizes, states)
☐  5. Input + Label + HelperText + InputGroup
☐  6. Card + CardHeader + CardBody + CardFooter
☐  7. Badge + Avatar + AvatarGroup
☐  8. Spinner + SkeletonText + SkeletonCard + SkeletonButton
☐  9. Modal + BottomSheet + Drawer
☐ 10. Toast system (useToast hook + Toaster provider)
☐ 11. CalendarSlot: CustomerSlotPicker + WorkerAvailabilityEditor
☐ 12. ServiceCard
☐ 13. StepProgress
☐ 14. Rating
☐ 15. EmptyState

⏸  ── STOP: Build /design-system showcase page. Show all components. ──
⏸  ── WAIT FOR REVIEW before continuing. ─────────────────────────────

☐ 16. Layouts: customer shell + worker shell (sidebar + bottom nav)
☐ 17. Landing page (/)
☐ 18. Auth pages: /auth/customer + /auth/worker
☐ 19. Customer: Dashboard
☐ 20. Customer: Services browse + Service detail
☐ 21. Customer: Booking wizard (3 steps — Step 1 → 2 → 3 → success)
☐ 22. Customer: Bookings list + Booking detail (with timeline + mock map)
☐ 23. Customer: Payments page
☐ 24. Worker: Onboarding wizard (5 steps)
☐ 25. Worker: Availability calendar
☐ 26. Worker: Jobs list + Job detail
☐ 27. Worker: Earnings + Withdrawal
☐ 28. Responsive polish (mobile, tablet, desktop)
☐ 29. Empty states on all list pages
☐ 30. Error states + 404 page
```

---

## Start Command

When you receive **"go"**:

1. Scaffold the Next.js project
2. Install all dependencies from the tech stack
3. Create `tokens.css` and configure Tailwind to use the tokens
4. Build the `Button` component with all variants, sizes, and states
5. Build the design system showcase page showing all Button variants
6. Stop and say: **"Button component done. Please review /design-system before I continue."**

Repeat the stop-and-review pattern for every component group.

---

## Antigravity-Specific Notes

- This file (`AGENTS.md`) is read automatically by Google Antigravity when placed in the project root
- Antigravity skills go in `.agent/skills/` (not `.claude/skills/`)
- Use Gemini 3.1 Pro or Claude Sonnet 4.6 as the active model — both are supported
- You can switch models mid-project in Antigravity's model picker without losing context
- If the agent gets stuck on a large file, use Antigravity's "Focus" mode to pin `AGENTS.md` + the current file only
- Terminal commands run in Antigravity's integrated shell — no need to switch windows
