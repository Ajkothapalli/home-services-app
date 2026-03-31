# HomeServ — Claude Code Project Prompt

> Paste this entire file as your project prompt (CLAUDE.md or system prompt) in Antigravity / Claude Code.

---

## PROJECT OVERVIEW

You are building **HomeServ** — a two-sided home services marketplace for seepage repair, tiling, grouting, and welding.

There are two user personas:
- **Customer** — browses services, books a time slot from available provider slots, and pays
- **Worker (Provider)** — gets onboarded, sets their availability calendar, accepts jobs, and gets paid

**Build philosophy:**
1. Build the **Design System** first — every token, component, and variant documented and working
2. Then build the **Product** screen by screen, consuming only design system components
3. Never write one-off styles — every visual element must come from the design system

---

## TECH STACK

```
Framework:     Next.js 14+ (App Router, TypeScript)
Styling:       Tailwind CSS v3 + CSS Variables for tokens
Components:    shadcn/ui as base (customised to match design system)
Icons:         lucide-react
Fonts:         Inter (body) + Sora (headings) via next/font
State:         Zustand
Server State:  TanStack Query (React Query v5)
Forms:         React Hook Form + Zod
Calendar:      react-big-calendar (customer view) + custom slot grid (worker view)
Date Utils:    date-fns
Animation:     Framer Motion
Payments:      Razorpay (use mock/stub for now — real keys injected later)
Auth:          Mock auth context (OTP flow UI only, no real backend yet)
DB/API:        Mock data layer (JSON fixtures + simulated async delays)
              → Wire to real API later by replacing mock functions
```

---

## PHASE 1 — DESIGN SYSTEM

Build everything in `src/design-system/`. Export all components from `src/design-system/index.ts`.

### 1.1 Design Tokens (`src/design-system/tokens.css`)

Define all tokens as CSS variables on `:root`. Use them everywhere — never hardcode hex values.

```css
/* Brand */
--color-brand-50   through --color-brand-900  (blue-indigo palette)
--color-brand-500: #4F6EF7;   /* primary action */
--color-brand-600: #3B5BDB;   /* hover */
--color-brand-700: #2F4AC2;   /* pressed */

/* Neutrals */
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

/* Semantic */
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

/* Surface */
--color-surface-page:    var(--color-neutral-50);
--color-surface-card:    var(--color-neutral-0);
--color-surface-overlay: rgba(0,0,0,0.48);

/* Border */
--color-border-default: var(--color-neutral-200);
--color-border-strong:  var(--color-neutral-300);
--color-border-focus:   var(--color-brand-500);

/* Typography */
--color-text-primary:   var(--color-neutral-900);
--color-text-secondary: var(--color-neutral-500);
--color-text-disabled:  var(--color-neutral-300);
--color-text-inverse:   var(--color-neutral-0);
--color-text-brand:     var(--color-brand-600);

/* Radius — IMPORTANT: All buttons and cards must use these */
--radius-xs:  4px;
--radius-sm:  8px;
--radius-md:  12px;
--radius-lg:  16px;
--radius-xl:  20px;
--radius-2xl: 24px;
--radius-full: 9999px;

/* Spacing (4px base grid) */
--space-1: 4px;   --space-2: 8px;   --space-3: 12px;  --space-4: 16px;
--space-5: 20px;  --space-6: 24px;  --space-8: 32px;  --space-10: 40px;
--space-12: 48px; --space-16: 64px; --space-20: 80px;

/* Shadow */
--shadow-xs: 0 1px 2px rgba(0,0,0,0.05);
--shadow-sm: 0 1px 3px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06);
--shadow-md: 0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06);
--shadow-lg: 0 10px 15px rgba(0,0,0,0.10), 0 4px 6px rgba(0,0,0,0.05);
--shadow-xl: 0 20px 25px rgba(0,0,0,0.10), 0 10px 10px rgba(0,0,0,0.04);

/* Typography Scale */
--text-xs:   12px;  --text-sm: 14px;  --text-base: 16px;
--text-lg:   18px;  --text-xl: 20px;  --text-2xl:  24px;
--text-3xl:  30px;  --text-4xl: 36px; --text-5xl:  48px;

/* Font Weight */
--font-regular:   400;
--font-medium:    500;
--font-semibold:  600;
--font-bold:      700;

/* Line Height */
--leading-tight:  1.25;
--leading-snug:   1.375;
--leading-normal: 1.5;
--leading-relaxed:1.625;

/* Transition */
--transition-fast:   100ms ease;
--transition-base:   200ms ease;
--transition-slow:   300ms ease;
--transition-spring: 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
```

---

### 1.2 Button Component (`src/design-system/Button/`)

CRITICAL: All buttons must have `border-radius: var(--radius-full)` — pill-shaped. No exceptions.

**Variants:** `primary` | `secondary` | `ghost` | `destructive` | `outline` | `link`
**Sizes:** `xs` | `sm` | `md` | `lg` | `xl`
**States:** `default` | `hover` | `active` | `disabled` | `loading`
**Special:** `iconLeft` | `iconRight` | `iconOnly`

```typescript
// Button.tsx — interface
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline' | 'link'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  disabled?: boolean
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  fullWidth?: boolean
  children: React.ReactNode
  onClick?: () => void
}
```

Sizing (height × horizontal padding × font):
- `xs`:  32px × 12px × 12px
- `sm`:  36px × 16px × 14px
- `md`:  44px × 20px × 16px  ← default
- `lg`:  52px × 24px × 18px
- `xl`:  60px × 32px × 20px

Loading state: replace content with `<Spinner size="sm" />`, keep button width fixed (no layout shift).

---

### 1.3 Input Component (`src/design-system/Input/`)

**Variants:** `default` | `filled`
**Sizes:** `sm` | `md` | `lg`
**States:** `default` | `focus` | `error` | `success` | `disabled`
**Sub-components:** `Label`, `HelperText`, `ErrorMessage`, `InputGroup` (prefix/suffix)

```typescript
interface InputProps {
  label?: string
  placeholder?: string
  helperText?: string
  error?: string
  prefix?: React.ReactNode     // icon or text, inside input
  suffix?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'filled'
  disabled?: boolean
}
```

Border-radius: `var(--radius-lg)` on inputs. Focus ring: 2px offset, `--color-border-focus`.

---

### 1.4 Card Component (`src/design-system/Card/`)

**Variants:** `elevated` | `outlined` | `filled` | `interactive`
**Sub-components:** `CardHeader`, `CardBody`, `CardFooter`, `CardMedia`

`interactive` variant: hover lifts shadow from `--shadow-sm` to `--shadow-lg` with `--transition-base`.
Border-radius: `var(--radius-xl)` for standard cards, `var(--radius-2xl)` for hero cards.

---

### 1.5 Badge Component (`src/design-system/Badge/`)

**Variants:** `default` | `success` | `warning` | `error` | `info` | `neutral`
**Sizes:** `sm` | `md` | `lg`
**Style:** `filled` | `soft` | `outline`
Border-radius: `var(--radius-full)`.

---

### 1.6 Avatar Component (`src/design-system/Avatar/`)

**Sizes:** `xs(24)` | `sm(32)` | `md(40)` | `lg(56)` | `xl(72)` | `2xl(96)`
**Variants:** image | initials fallback | skeleton
**Group:** `AvatarGroup` (stacked, max count with overflow badge)
Shape: circle (`border-radius: var(--radius-full)`).

---

### 1.7 Modal / Sheet (`src/design-system/Modal/`)

**Variants:**
- `Modal` — centred dialog, backdrop blur, `border-radius: var(--radius-2xl)`
- `BottomSheet` — slides up from bottom, `border-radius: var(--radius-2xl) var(--radius-2xl) 0 0`
- `Drawer` — slides from right

All use Framer Motion for enter/exit. Trap focus, close on Escape, close on backdrop click.

---

### 1.8 Toast / Notification (`src/design-system/Toast/`)

**Variants:** `success` | `error` | `warning` | `info`
Position: top-right (desktop), top-center (mobile).
Auto-dismiss: 4s. Manual dismiss button. Stack up to 3.
Border-radius: `var(--radius-xl)`.

---

### 1.9 Spinner & Skeleton (`src/design-system/Loading/`)

`Spinner`: sizes `xs|sm|md|lg|xl`, inherits current color.
`Skeleton`: `SkeletonText`, `SkeletonAvatar`, `SkeletonCard`, `SkeletonButton` — pulse animation.

---

### 1.10 Select & Dropdown (`src/design-system/Select/`)

Custom-styled select matching Input design. Dropdown: `var(--shadow-xl)`, `var(--radius-xl)`, smooth open animation. Supports search/filter for long lists.

---

### 1.11 Calendar Slot Picker (`src/design-system/CalendarSlot/`)

This is a core component used in both flows.

```typescript
interface TimeSlot {
  id: string
  date: Date
  startTime: string   // "09:00"
  endTime: string     // "11:00"
  status: 'available' | 'booked' | 'blocked' | 'selected'
}

// CustomerSlotPicker — read-only available slots, pick one
interface CustomerSlotPickerProps {
  slots: TimeSlot[]
  selectedSlot: TimeSlot | null
  onSelect: (slot: TimeSlot) => void
  month: Date
  onMonthChange: (date: Date) => void
}

// WorkerAvailabilityEditor — worker sets their own availability
interface WorkerAvailabilityEditorProps {
  availability: TimeSlot[]
  onChange: (slots: TimeSlot[]) => void
  month: Date
  onMonthChange: (date: Date) => void
}
```

Visual design:
- Month header with `<` `>` navigation, pill-shaped nav buttons
- Day grid: 7 columns, days as circle buttons
- Days with availability: filled brand color dot underneath
- Selected day: filled brand circle
- Time slots below the calendar as horizontal scrollable chips
- Slot chip: `border-radius: var(--radius-full)`, green=available, grey=booked, brand=selected

---

### 1.12 Service Card (`src/design-system/ServiceCard/`)

```typescript
interface ServiceCardProps {
  id: string
  icon: React.ReactNode
  name: string                    // "Seepage Repair"
  description: string
  priceFrom: number               // ₹1,200
  rating: number
  reviewCount: number
  duration: string                // "2–4 hours"
  badge?: string                  // "Most Booked"
  onBook: () => void
}
```

Layout: icon (top, in soft brand background circle) → name → description → meta row (rating + duration + price) → "Book Now" pill button.
Border-radius: `var(--radius-2xl)`. Hover: slight scale(1.02) + shadow lift.

---

### 1.13 Step Progress Indicator (`src/design-system/StepProgress/`)

Horizontal stepper for multi-step flows (booking, onboarding, payment).

```typescript
interface Step {
  id: string
  label: string
  status: 'upcoming' | 'current' | 'completed'
}
```

Completed steps: filled brand circle with checkmark.
Current step: pulsing brand ring.
Connector line: brand color for completed segments, grey for upcoming.

---

### 1.14 Rating Component (`src/design-system/Rating/`)

`StarRating`: read-only and interactive variants. Half-star support. Sizes `sm|md|lg`.

---

### 1.15 Design System Storybook-Style Showcase

Create `src/app/design-system/page.tsx` — a full visual catalogue of every component with all variants and states. No real Storybook required — just a clean page grid. This is the first page to build. It must pass visual review before product work begins.

---

## PHASE 2 — PRODUCT SCREENS

Once the design system page looks great and all components are solid, build the product.

### Routing Structure

```
/                           → Landing page
/auth/customer              → Customer OTP login
/auth/worker                → Worker OTP login

/customer/                  → Customer shell (sidebar nav)
  dashboard                 → Home: service categories + recent bookings
  services                  → Browse all services with filters
  services/[id]             → Service detail + booking CTA
  book/[serviceId]          → Booking flow (3 steps)
  bookings                  → All bookings list
  bookings/[id]             → Booking detail: status, timeline, provider
  payments                  → Payment history + pending
  profile                   → Edit profile

/worker/                    → Worker shell (sidebar nav)
  dashboard                 → Today's jobs + quick stats
  onboarding                → Multi-step onboarding wizard
  availability              → Set weekly availability calendar
  jobs                      → All assigned jobs
  jobs/[id]                 → Job detail: customer info, navigation, complete
  earnings                  → Earnings breakdown + withdraw
  profile                   → Skills, documents, portfolio
```

---

### 2.1 Landing Page (`/`)

```
Header:
  Logo left | Nav links (Services, How it Works, For Workers) | "Sign In" ghost btn | "Get Started" primary pill btn

Hero section:
  H1: "Expert Home Repairs, Booked in Minutes"
  Subtext: "Seepage repair, tiling, grouting & welding — trusted pros, transparent pricing."
  CTA: "Book a Service" (primary lg pill) + "Become a Worker" (outline lg pill)
  Visual: Split — left text, right illustration/mockup of app UI

Services strip:
  Horizontal scroll of 4 ServiceCards:
  - Seepage Repair (droplet icon)
  - Tiling (grid icon)
  - Grouting (layers icon)
  - Welding (flame/zap icon)

How It Works section:
  3-step cards: 1. Describe your issue → 2. Pick a slot → 3. Get it fixed
  Each card: number badge + icon + title + description

Trust section:
  Stats: "2,400+ Jobs Done" | "4.8★ Average Rating" | "48hr Booking Window"

Footer: links + copyright
```

---

### 2.2 Customer — Booking Flow (`/customer/book/[serviceId]`)

A 3-step flow using the `StepProgress` component. All on one page with animated step transitions (Framer Motion slide left/right).

**Step 1 — Describe the Issue**
```
Title: "Tell us about the problem"
Fields:
  - Service type (pre-filled from URL param, editable Select)
  - Affected area (multi-select chips: Bathroom | Kitchen | Terrace | Basement | External Wall | Other)
  - Urgency (3 pill-toggle buttons: Emergency / Urgent / Routine)
  - Description (Textarea, optional)
  - Photos (drag-drop zone + camera icon, max 3 files, preview thumbnails with ✕ remove)
  - Address (Input with location pin icon, mock geocode)
CTA: "Continue →" primary pill btn
```

**Step 2 — Choose a Slot**
```
Title: "When works for you?"
Left column (desktop) / top (mobile):
  - Month calendar using CalendarSlotPicker
  - Days with available slots highlighted with brand dot
Right column / below:
  - "Available on [selected date]" section header
  - Time slot chips in a wrap grid
    Green chips: available (e.g. "9:00 AM – 11:00 AM")
    Grey chips: booked
    Brand chip: selected
  - Provider preview card below selected slot:
    Avatar + name + rating + "4.7 ★ (38 reviews)" + distance
CTA: "Confirm Slot →"
```

**Step 3 — Review & Pay**
```
Title: "Review your booking"
Summary card (outlined Card):
  Service type, area, urgency, address, slot datetime, provider name

Price breakdown card:
  - Service charge:   ₹X,XXX
  - Visit charge:     ₹149 (waived on confirm)
  - GST (18%):        ₹XXX
  - Total:            ₹X,XXX (bold)
  - Validity note:    "Quote valid for 48 hours"

Payment method section:
  Pill-toggle: UPI | Card | Net Banking | Wallet
  For UPI: input for UPI ID
  For Card: card number + expiry + CVV inputs (masked)
  Razorpay modal trigger (mock — show success after 2s)

CTA: "Pay ₹X,XXX & Confirm" primary xl pill btn
  Loading state: spinner inside button, "Processing payment..."
  Success: confetti burst + toast "Booking Confirmed!" + redirect to /customer/bookings/[id]
```

---

### 2.3 Customer — Booking Detail (`/customer/bookings/[id]`)

```
Top: Back button + "Booking #HS-2041"

Status Banner: full-width pill with icon
  Upcoming: blue — "Scheduled for Tue, 1 Apr · 10:00 AM"
  In Progress: amber — "Your provider is on the way"
  Completed: green — "Job Completed · Leave a Review"

Provider card:
  Avatar + Name + Rating + Phone icon button + WhatsApp icon button

Job Timeline (vertical):
  ● Booking Confirmed (timestamp)
  ● Provider Assigned (timestamp)
  ● Provider En Route (timestamp — real-time)
  ○ Work Started
  ○ Completed

Live Tracker (if status = en_route):
  Mock map with provider dot moving toward home icon
  "Ramesh is 2.3 km away · ETA 8 min"

Job summary (once completed):
  Before/After photo grid (2 columns)
  Work summary text
  Rating prompt: "How was the service?" → 5 stars → optional comment → Submit

Payment summary:
  Paid: ₹X,XXX · UPI · Apr 1, 2026
  "Download Invoice" ghost pill btn
```

---

### 2.4 Worker — Onboarding Wizard (`/worker/onboarding`)

5-step wizard using StepProgress.

```
Step 1 — Personal Info
  Full name, phone (pre-filled from auth), email, city, pincode
  Profile photo upload (circular crop)

Step 2 — Skills & Services
  Multi-select chip grid:
  [Seepage Repair] [Tiling] [Grouting] [Welding]
  [Waterproofing] [Plumbing] [Painting] [Other]
  Min 1 required. Selected chips fill with brand color.
  Experience years per skill: stepper input (+ / −)

Step 3 — Documents
  Upload cards for:
  - Government ID (Aadhaar / PAN)
  - Proof of Skills / Certificate
  - Profile photo (re-use from step 1)
  Each card: dashed border → click/drag to upload → shows file name + ✓ green badge

Step 4 — Set Availability
  WorkerAvailabilityEditor calendar
  Instructions: "Select the days you're available and drag to set time slots"
  Day grid — click a day to toggle available/unavailable
  Time slot section: for each selected day, add slots with start/end time pickers
  Slot chips appear below: "Mon 9:00–11:00 ✕" "Mon 2:00–4:00 ✕"

Step 5 — Review & Submit
  Summary of all entered info
  T&C checkbox
  "Submit for Verification" primary xl pill btn
  Post-submit: success illustration + "Under Review" badge + "We'll verify within 24 hours"
```

---

### 2.5 Worker — Availability Calendar (`/worker/availability`)

```
Header: "Manage Your Availability" + current month/year + month nav arrows

Weekly view toggle: "Week" | "Month" (pill toggle)

Month view:
  Calendar grid — each day cell shows:
  - Date number
  - Small slot chips (e.g. "9–11am", "2–4pm") in green
  - "Add +" button on hover/tap

Day detail panel (slides in from right on day click):
  "Tuesday, Apr 1"
  Existing slots as editable chips
  "Add New Slot" button → opens time range picker modal
  Save button

Recurring toggle:
  "Apply this day's slots every [weekday]" switch
  (e.g. "Apply every Tuesday")

Blocked dates:
  "Block a date" CTA → date picker → reason (optional) → Block
  Blocked dates shown in red/neutral on calendar
```

---

### 2.6 Payment Flow Details

**Customer Payment (Step 3 of booking)**
```
Flow:
  1. Review order summary
  2. Select payment method (UPI / Card / Net Banking / Wallet)
  3. Tap "Pay ₹X,XXX & Confirm"
  4. Razorpay checkout opens (modal or redirect — mock in dev)
  5. On success: POST /api/payments/confirm → update booking status
  6. Show success screen with booking reference + confetti

Payment method UX:
  - UPI: input with @ placeholder, "Verify" button, green tick on verify
  - Card: auto-format (XXXX XXXX XXXX XXXX), expiry MM/YY, CVV masked
  - Saved methods (returning users): show masked last-4 with radio select
```

**Worker Earnings (`/worker/earnings`)**
```
Summary cards (top):
  Total Earned: ₹XX,XXX  |  Pending Clearance: ₹X,XXX  |  This Month: ₹X,XXX

Earnings list:
  Each row: Job # + service + customer name + amount + status (Paid / Pending / Processing)
  Filter: All | Paid | Pending | This Month

Withdraw section:
  Bank account linked: "HDFC ···· 4521" + "Change" link
  Amount input (pre-fill with available balance)
  "Withdraw to Bank" primary pill btn
  Processing note: "1–2 business days"
```

---

## PHASE 3 — GLOBAL PATTERNS

### Navigation

**Customer — Sidebar (desktop) / Bottom tab bar (mobile)**
```
Customer nav items:
  Home (grid icon) | Services (wrench) | Bookings (calendar) | Payments (credit-card) | Profile (user)

Worker nav items:
  Dashboard (layout) | Jobs (clipboard) | Availability (calendar) | Earnings (trending-up) | Profile (user)
```

Sidebar (desktop): 72px wide collapsed (icons only) → 240px expanded (icons + labels). Hover to expand.
Bottom bar (mobile): 5 icons, active = filled brand icon + label visible.

### Empty States

Every list/page must have a designed empty state:
- Illustration (simple SVG or emoji-based)
- Headline: "No bookings yet"
- Subtext + CTA button
Never show blank white space.

### Error States

- API error: error card with retry button
- 404: friendly full-page with "Go Home" button
- Network offline: persistent bottom banner "You're offline — reconnect to continue"

### Responsive Breakpoints

```
mobile:  < 640px   (single column, bottom nav)
tablet:  640–1024px (2 column, bottom nav)
desktop: > 1024px  (sidebar nav, multi-column)
```

---

## CODE STANDARDS

- All components in TypeScript with full prop typing — no `any`
- Folder structure per component: `ComponentName/index.tsx`, `ComponentName/ComponentName.stories.tsx` (optional), `ComponentName/ComponentName.test.tsx` (optional)
- Use `cn()` utility (clsx + tailwind-merge) for conditional classNames
- Never use inline `style={{}}` — always use token CSS variables or Tailwind classes
- All interactive elements must have keyboard navigation and ARIA labels
- No lorem ipsum in final screens — use realistic Indian home services data
- Mock data file: `src/lib/mock-data.ts` — all fixtures centralised here
- API calls: all in `src/lib/api/` — swap mock for real by changing one function

---

## MOCK DATA FIXTURES

Use these realistic fixtures throughout:

```typescript
// Services
const SERVICES = [
  { id: 'seepage', name: 'Seepage Repair', icon: 'droplets', priceFrom: 1200, duration: '2–4 hrs', rating: 4.8, reviews: 312 },
  { id: 'tiling', name: 'Tiling', icon: 'grid-3x3', priceFrom: 1800, duration: '4–8 hrs', rating: 4.7, reviews: 189 },
  { id: 'grouting', name: 'Grouting', icon: 'layers', priceFrom: 800, duration: '1–3 hrs', rating: 4.9, reviews: 94 },
  { id: 'welding', name: 'Welding', icon: 'zap', priceFrom: 1500, duration: '2–5 hrs', rating: 4.6, reviews: 67 },
]

// Workers
const WORKERS = [
  { id: 'w1', name: 'Ramesh Kumar', rating: 4.8, reviews: 127, skills: ['seepage', 'tiling'], city: 'Mumbai', experience: 7 },
  { id: 'w2', name: 'Suresh Patel', rating: 4.9, reviews: 83, skills: ['grouting', 'tiling'], city: 'Mumbai', experience: 5 },
  { id: 'w3', name: 'Arjun Singh', rating: 4.6, reviews: 54, skills: ['welding'], city: 'Mumbai', experience: 9 },
]

// Customers
const CUSTOMERS = [
  { id: 'c1', name: 'Priya Sharma', phone: '+91 98765 43210', address: '12B, Andheri West, Mumbai' },
  { id: 'c2', name: 'Ajay Mehta',   phone: '+91 91234 56789', address: '5, Bandra East, Mumbai' },
]
```

---

## BUILD ORDER

Work in this exact order. Do not skip ahead.

```
[x] 1. Project scaffold (Next.js, Tailwind, dependencies)
[x] 2. Design tokens (CSS variables)
[x] 3. Button component — all variants, sizes, states
[x] 4. Input component
[x] 5. Card component
[x] 6. Badge, Avatar, Spinner, Skeleton
[x] 7. Modal, BottomSheet
[x] 8. Toast system
[x] 9. CalendarSlot component (CustomerSlotPicker + WorkerAvailabilityEditor)
[x] 10. ServiceCard component
[x] 11. StepProgress component
[x] 12. Rating component
[x] 13. Design System showcase page (/design-system) — REVIEW BEFORE CONTINUING
[ ] 14. Landing page (/)
[ ] 15. Auth pages (/auth/customer, /auth/worker)
[ ] 16. Customer: Dashboard
[ ] 17. Customer: Services browse
[ ] 18. Customer: Booking flow (3 steps)
[ ] 19. Customer: Booking detail
[ ] 20. Worker: Onboarding wizard
[ ] 21. Worker: Availability calendar
[ ] 22. Worker: Jobs dashboard
[ ] 23. Worker: Earnings page
[ ] 24. Navigation (sidebar + bottom bar)
[ ] 25. Empty states, error states, 404
[ ] 26. Responsive polish pass
[ ] 27. Payment flow end-to-end (Razorpay mock → real keys)
```

---

## FIRST COMMAND

When I say **"go"**, start at Step 1. Scaffold the Next.js project, install all dependencies, set up the token file, and build the Button component with every variant. Show me the design system showcase page rendering all Button variants before moving on.

Ask me to review after every design system component group (after buttons, after inputs, after cards, etc.) before proceeding.

---

*HomeServ · Claude Code Prompt v1.0 · March 2026*
