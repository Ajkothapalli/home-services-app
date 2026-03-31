# HomeServ AI — Agent Architecture
> Platform: Multi-Platform — Web App (React / Next.js) + Mobile App (React Native / Flutter)
> Audience: Homeowners (customers) + Service Providers
> Services: Seepage grouting, tiling, waterproofing, and allied home repair

---

## Overview

The HomeServ AI platform is a multi-agent system built around a central **Orchestrator Agent** that delegates to specialized agents. Each agent has a defined role, a set of skills it can invoke, and a set of rules it must follow. Hooks wire the agents together through event-driven triggers.

```
User (Homeowner or Provider)
        │
        ▼
┌──────────────────────┐
│   Orchestrator Agent  │  ← Routes all conversations
└────────┬─────────────┘
         │
   ┌─────┴───────────────────────────────┐
   │         │          │         │       │
   ▼         ▼          ▼         ▼       ▼
Intake   Diagnosis   Quoting  Scheduling  Support
Agent     Agent      Agent     Agent      Agent
                                  │
                              Provider
                               Agent
```

---

## 1. AGENTS

### 1.1 Orchestrator Agent

```yaml
agent:
  id: orchestrator
  name: Orchestrator Agent
  description: >
    Entry point for all conversations. Identifies user intent,
    determines user type (homeowner or provider), and routes
    to the appropriate specialist agent. Maintains global
    conversation context.

  triggers:
    - app_open
    - new_conversation
    - user_message_received
    - unhandled_fallback

  routing_logic:
    - intent: job_request        → intake_agent
    - intent: diagnosis_query    → diagnosis_agent
    - intent: quote_request      → quoting_agent
    - intent: booking_request    → scheduling_agent
    - intent: support_query      → support_agent
    - intent: provider_update    → provider_agent
    - intent: unknown            → support_agent (with escalation flag)

  context_maintained:
    - user_id
    - user_type           # homeowner | provider
    - session_id
    - active_job_id
    - conversation_history (last 10 turns)
    - language_preference

  skills_used:
    - intent_classifier
    - user_profile_loader
    - context_manager

  rules:
    - ref: RULE-001
    - ref: RULE-008
    - ref: RULE-010
```

---

### 1.2 Intake Agent

```yaml
agent:
  id: intake_agent
  name: Intake Agent
  description: >
    Guides homeowners through job submission. Collects structured
    information about the problem, location, urgency, and photos.
    Creates a Job Record and hands off to Diagnosis Agent.

  triggers:
    - routed_from: orchestrator (intent=job_request)
    - deep_link: /new-job

  conversation_flow:
    step_1:
      prompt: "What kind of issue are you facing?"
      input_type: multi_select
      options:
        - Seepage / Water Leakage
        - Tiling (New / Repair)
        - Waterproofing
        - Grouting
        - Other

    step_2:
      prompt: "Which part of your home is affected?"
      input_type: multi_select
      options:
        - Bathroom
        - Kitchen
        - Terrace / Roof
        - Basement
        - External Wall
        - Other (free text)

    step_3:
      prompt: "How urgent is this?"
      input_type: single_select
      options:
        - Emergency (active leakage / flooding)
        - Urgent (within 48 hours)
        - Routine (within a week)
        - Planning (just exploring)

    step_4:
      prompt: "Please upload 1–3 photos of the affected area."
      input_type: photo_upload
      min: 0
      max: 3
      optional: false_if_urgency_is_emergency

    step_5:
      prompt: "What is the address for this job?"
      input_type: location_picker
      fallback: manual_text_entry

  output:
    creates: job_record
    job_record_schema:
      job_id: uuid
      user_id: string
      service_type: enum
      affected_area: list[string]
      urgency: enum
      photos: list[url]
      location: {address, lat, lng}
      status: "pending_diagnosis"
      created_at: timestamp

  handoff:
    on_complete: → diagnosis_agent (with job_id)

  skills_used:
    - form_collector
    - photo_uploader
    - location_picker
    - job_record_writer

  rules:
    - ref: RULE-002
    - ref: RULE-003
    - ref: RULE-007
```

---

### 1.3 Diagnosis Agent

```yaml
agent:
  id: diagnosis_agent
  name: Diagnosis Agent
  description: >
    Analyzes submitted photos and job description to identify
    the root cause, severity, and recommended service type.
    Produces a structured Diagnosis Report to feed the Quoting Agent.

  triggers:
    - routed_from: intake_agent (job status=pending_diagnosis)
    - hook: on_photo_uploaded

  analysis_pipeline:
    step_1:
      name: Photo Analysis
      skill: photo_analyzer
      inputs: [job.photos]
      outputs:
        - damage_type        # e.g. seepage, hairline crack, loose tile
        - severity           # low | medium | high | critical
        - affected_area_sqft # estimated
        - confidence_score   # 0.0 – 1.0

    step_2:
      name: Root Cause Inference
      skill: knowledge_base_lookup
      inputs: [damage_type, affected_area, severity]
      outputs:
        - probable_cause     # e.g. pipe leak, poor waterproofing
        - recommended_service

    step_3:
      name: Confidence Gate
      condition: confidence_score < 0.70
      action: flag_for_human_review
      human_review_note: "AI confidence below threshold. Please assign to senior technician for site inspection."

  output:
    updates: job_record
    adds:
      diagnosis:
        damage_type: string
        severity: enum
        probable_cause: string
        recommended_service: string
        estimated_area_sqft: float
        confidence_score: float
        human_review_required: boolean
      status: "diagnosed"

  handoff:
    if: human_review_required == false → quoting_agent
    if: human_review_required == true  → support_agent (escalation)

  skills_used:
    - photo_analyzer
    - knowledge_base_lookup
    - job_record_updater

  rules:
    - ref: RULE-004
    - ref: RULE-009
    - ref: RULE-010
```

---

### 1.4 Quoting Agent

```yaml
agent:
  id: quoting_agent
  name: Quoting Agent
  description: >
    Generates a transparent, itemised cost estimate based on
    the Diagnosis Report. Applies pricing rules, material
    costs, and labour rates. Presents the quote to the homeowner
    and awaits acceptance.

  triggers:
    - routed_from: diagnosis_agent (job status=diagnosed)
    - user_request: "Can I get a revised quote?"

  quote_calculation:
    inputs:
      - job.diagnosis.recommended_service
      - job.diagnosis.estimated_area_sqft
      - job.location                        # for regional pricing
      - materials_price_catalogue           # from backend
      - labour_rate_catalogue               # from backend

    formula:
      material_cost: area_sqft × material_rate_per_sqft
      labour_cost: base_labour + (area_sqft × labour_rate_per_sqft)
      visit_charge: flat_fee (waived if job confirmed)
      gst: (material_cost + labour_cost) × 0.18
      total: material_cost + labour_cost + visit_charge + gst

    output:
      quote_schema:
        quote_id: uuid
        job_id: string
        line_items:
          - description: string
            qty: float
            unit: string
            rate: float
            amount: float
        subtotal: float
        gst: float
        visit_charge: float
        total: float
        validity_hours: 48
        generated_at: timestamp

  presentation:
    format: in_app_quote_card
    actions:
      - Accept Quote      → triggers: on_quote_accepted
      - Request Revision  → routes to: support_agent
      - Decline           → updates job status: quote_declined

  skills_used:
    - pricing_calculator
    - catalogue_fetcher
    - quote_card_renderer
    - notification_sender

  rules:
    - ref: RULE-005
    - ref: RULE-006
    - ref: RULE-011
```

---

### 1.5 Scheduling Agent

```yaml
agent:
  id: scheduling_agent
  name: Scheduling Agent
  description: >
    Matches a confirmed job to an available, qualified service
    provider. Finds a mutually convenient time slot, confirms
    the booking, and notifies both homeowner and provider.

  triggers:
    - hook: on_quote_accepted
    - user_request: "Reschedule my booking"

  matching_pipeline:
    step_1:
      name: Provider Pool Filter
      skill: provider_matcher
      criteria:
        - service_type_match: job.diagnosis.recommended_service
        - location_radius: ≤ 20km from job.location
        - license_verified: true
        - availability: overlaps requested_slot
        - rating: ≥ 3.5

    step_2:
      name: Slot Selection
      skill: slot_finder
      inputs: [matched_providers, homeowner_preferred_slots]
      returns: top_3_options

    step_3:
      name: User Confirmation
      prompt: "Here are available slots. Please pick one."
      input_type: slot_picker
      options: top_3_options

    step_4:
      name: Booking Confirmation
      skill: booking_writer
      creates:
        booking_schema:
          booking_id: uuid
          job_id: string
          provider_id: string
          homeowner_id: string
          scheduled_at: datetime
          estimated_duration_hours: float
          status: "confirmed"

  notifications:
    - to: homeowner  | channel: push+sms | event: booking_confirmed
    - to: provider   | channel: push+sms | event: job_assigned

  skills_used:
    - provider_matcher
    - slot_finder
    - booking_writer
    - notification_sender
    - map_router

  rules:
    - ref: RULE-003
    - ref: RULE-007
    - ref: RULE-012
    - ref: RULE-013
```

---

### 1.6 Provider Agent

```yaml
agent:
  id: provider_agent
  name: Provider Agent
  description: >
    Manages the service provider's side of the workflow —
    viewing assigned jobs, updating job status in real-time
    (en route, arrived, in progress, completed), capturing
    before/after photos, and submitting work summaries.

  triggers:
    - provider_login
    - hook: on_job_assigned
    - provider_action: status_update

  workflow:
    states:
      - assigned
      - accepted_by_provider
      - en_route
      - arrived
      - in_progress
      - completed_pending_review
      - completed

    transitions:
      assigned → accepted_by_provider:
        action: provider taps Accept/Decline
        on_decline: → scheduling_agent (re-assign)

      accepted_by_provider → en_route:
        action: provider taps "Start Journey"
        triggers: hook on_provider_en_route
        skill: live_location_tracker

      en_route → arrived:
        action: provider taps "I've Arrived" or auto-detected (geofence)
        triggers: hook on_provider_arrived
        notifies: homeowner

      arrived → in_progress:
        action: provider taps "Start Work"
        captures: before_photos (required)

      in_progress → completed_pending_review:
        action: provider taps "Mark Complete"
        captures: after_photos (required), work_summary (text)
        triggers: hook on_job_completed

  skills_used:
    - job_status_updater
    - photo_uploader
    - live_location_tracker
    - work_summary_writer
    - notification_sender

  rules:
    - ref: RULE-003
    - ref: RULE-007
    - ref: RULE-014
```

---

### 1.7 Support Agent

```yaml
agent:
  id: support_agent
  name: Support Agent
  description: >
    Handles customer FAQs, post-service queries, complaints,
    rescheduling requests, and escalations from other agents.
    Can invoke a human handoff when AI cannot resolve the issue.

  triggers:
    - user_request: support / help / complaint
    - routed_from: orchestrator (intent=unknown)
    - routed_from: diagnosis_agent (human_review_required=true)
    - routed_from: quoting_agent (request_revision)

  capabilities:
    - Answer FAQs about services, pricing, timelines
    - Explain quote line items
    - Reschedule or cancel bookings
    - Log complaints and track resolution
    - Escalate to human agent if unresolved after 3 turns

  faq_topics:
    - What is seepage grouting and how long does it last?
    - What is your refund / warranty policy?
    - How are providers verified?
    - Can I get a free site inspection?
    - My provider has not arrived — what do I do?

  escalation_logic:
    trigger: AI unable to resolve after 3 turns OR user explicitly asks for human
    action: create_support_ticket + notify_human_agent
    sla: respond within 2 hours (business hours)

  skills_used:
    - knowledge_base_lookup
    - booking_modifier
    - ticket_creator
    - notification_sender
    - sentiment_analyzer

  rules:
    - ref: RULE-009
    - ref: RULE-010
    - ref: RULE-015
```

---

## 2. SKILLS

Skills are reusable capability modules that agents invoke. Each skill has a clear input/output contract.

```yaml
skills:

  - id: intent_classifier
    description: Classifies user message into a job intent category
    input: [user_message, conversation_history]
    output: {intent: string, confidence: float, entities: dict}
    model: llm_classifier
    fallback: support_agent

  - id: photo_analyzer
    description: >
      Runs computer vision on uploaded photos to detect damage type,
      severity, and estimated affected area
    input: [photo_urls: list, service_type: string]
    output: {damage_type, severity, area_sqft, confidence_score}
    model: vision_model (e.g. GPT-4o Vision / Gemini Vision)
    timeout_seconds: 15

  - id: knowledge_base_lookup
    description: Retrieves relevant information from the service knowledge base
    input: [query: string, filters: dict]
    output: {answer: string, source: string, confidence: float}
    index: homeserv_kb_v1

  - id: pricing_calculator
    description: Computes itemised quote from job parameters and price catalogues
    input: [service_type, area_sqft, location, material_catalogue, labour_catalogue]
    output: {line_items, subtotal, gst, total}
    validation: total must be within RULE-005 price bounds

  - id: catalogue_fetcher
    description: Fetches latest material and labour price rates from backend
    input: [service_type, region]
    output: {material_rates: dict, labour_rates: dict, last_updated: timestamp}
    cache_ttl: 30 minutes

  - id: provider_matcher
    description: Returns a ranked list of providers matching job criteria
    input: [service_type, job_location, urgency, required_certifications]
    output: {providers: list[{id, name, rating, distance_km, availability}]}
    ranking: weighted_score (rating × 0.4 + distance × 0.3 + response_rate × 0.3)

  - id: slot_finder
    description: Finds overlapping available time slots between provider and homeowner
    input: [provider_ids, homeowner_preferred_slots, job_duration_hours]
    output: {slots: list[{provider_id, datetime, duration}]}
    max_options: 5

  - id: booking_writer
    description: Creates or updates a booking record in the database
    input: [job_id, provider_id, homeowner_id, slot_datetime, duration]
    output: {booking_id, status, confirmation_code}

  - id: job_record_writer
    description: Creates a new Job Record in the system
    input: [user_id, service_type, affected_area, urgency, photos, location]
    output: {job_id, status, created_at}

  - id: job_record_updater
    description: Updates fields on an existing Job Record
    input: [job_id, fields_to_update: dict]
    output: {job_id, updated_fields, updated_at}

  - id: job_status_updater
    description: Transitions job status through the defined state machine
    input: [job_id, new_status, actor_id, metadata: dict]
    output: {job_id, previous_status, new_status, timestamp}
    validation: must follow allowed state transitions

  - id: notification_sender
    description: Sends push, SMS, or in-app notifications
    input: [recipient_id, channel: [push|sms|in_app], template_id, variables: dict]
    output: {notification_id, delivery_status}
    retry: 3 attempts with exponential backoff

  - id: location_picker
    description: Presents a map picker and resolves address to lat/lng
    input: [user_query: string]
    output: {address: string, lat: float, lng: float, place_id: string}

  - id: live_location_tracker
    description: Streams provider location to homeowner during en_route phase
    input: [provider_id, job_id]
    output: {eta_minutes: int, current_location: {lat, lng}}
    update_interval: 30 seconds

  - id: photo_uploader
    description: Uploads photos to cloud storage and returns signed URLs
    input: [photos: list[file], job_id, photo_type: before|after|intake]
    output: {urls: list[string], uploaded_at: timestamp}

  - id: quote_card_renderer
    description: Renders an in-app quote card from a quote schema
    input: [quote_schema]
    output: {rendered_component: QuoteCard, share_url: string}

  - id: sentiment_analyzer
    description: Detects user sentiment to flag frustrated or distressed users
    input: [message: string, conversation_history]
    output: {sentiment: positive|neutral|negative, score: float, escalate: boolean}

  - id: ticket_creator
    description: Creates a support ticket and assigns it to a human agent
    input: [user_id, job_id, issue_summary, severity, conversation_log]
    output: {ticket_id, assigned_to, sla_deadline}

  - id: booking_modifier
    description: Reschedules or cancels an existing booking
    input: [booking_id, action: reschedule|cancel, new_slot: datetime|null, reason: string]
    output: {booking_id, new_status, refund_applicable: boolean}

  - id: work_summary_writer
    description: Saves provider's post-job work summary and after-photos
    input: [job_id, provider_id, summary_text, after_photos]
    output: {summary_id, saved_at}

  - id: form_collector
    description: Presents a multi-step intake form and returns structured data
    input: [form_schema, user_context]
    output: {form_data: dict, completion_status}

  - id: map_router
    description: Calculates route and ETA from provider location to job site
    input: [origin: {lat, lng}, destination: {lat, lng}]
    output: {route_polyline, distance_km, eta_minutes}
    provider: Google Maps / Mapbox

  - id: user_profile_loader
    description: Loads user profile (preferences, history, role) at session start
    input: [user_id]
    output: {user_profile: {name, type, location, preferences, job_history}}

  - id: context_manager
    description: Maintains and updates conversation context across agent hops
    input: [session_id, context_update: dict]
    output: {session_id, merged_context: dict}
```

---

## 3. HOOKS

Hooks are event-driven triggers that fire automatically when a job transitions between states. They decouple agents and keep the system reactive.

```yaml
hooks:

  - id: on_job_created
    trigger: job_record created (status=pending_diagnosis)
    actions:
      - notify homeowner: "We've received your request! Analyzing your photos..."
      - invoke: diagnosis_agent
    async: true

  - id: on_photo_uploaded
    trigger: photo_uploader skill completes for an existing job
    condition: job.status == pending_diagnosis
    actions:
      - invoke: diagnosis_agent (re-analyze with new photos)
    async: true

  - id: on_diagnosis_complete
    trigger: job.status → diagnosed
    condition: human_review_required == false
    actions:
      - invoke: quoting_agent
      - notify homeowner: "Your diagnosis is ready. Generating your quote..."
    async: true

  - id: on_diagnosis_flagged
    trigger: job.status → diagnosed
    condition: human_review_required == true
    actions:
      - create support ticket with priority=high
      - notify homeowner: "A specialist will review your case within 2 hours."
      - notify ops team: "Manual diagnosis review required for job {{job_id}}"
    async: true

  - id: on_quote_generated
    trigger: quote_schema created for job
    actions:
      - render QuoteCard in homeowner's app
      - send push notification: "Your quote is ready — ₹{{total}}. Tap to review."
      - set quote expiry timer: 48 hours
    async: true

  - id: on_quote_accepted
    trigger: homeowner action = Accept Quote
    actions:
      - update job.status → quote_accepted
      - invoke: scheduling_agent
      - notify: "Great! Let's find you a convenient time slot."
    async: false   # synchronous — user is waiting

  - id: on_quote_expired
    trigger: quote.validity_hours elapsed without acceptance
    actions:
      - update quote.status → expired
      - notify homeowner: "Your quote has expired. Tap here to request a fresh quote."
      - invoke: quoting_agent (regenerate at current prices)
    async: true

  - id: on_booking_confirmed
    trigger: booking_schema created (status=confirmed)
    actions:
      - notify homeowner: push + SMS with booking details + provider contact
      - notify provider:  push + SMS with job details + homeowner contact + map link
      - add to both calendars (in-app)
      - set reminder 1 hour before slot
    async: true

  - id: on_job_assigned
    trigger: provider_agent receives new job
    actions:
      - present job card to provider
      - start acceptance timer: 15 minutes
    timeout_action:
      - if provider doesn't respond → scheduling_agent re-assigns

  - id: on_provider_en_route
    trigger: provider status → en_route
    actions:
      - activate: live_location_tracker skill
      - notify homeowner: "Your provider is on the way. ETA: {{eta}} minutes."
    async: true

  - id: on_provider_arrived
    trigger: provider status → arrived (tap or geofence)
    actions:
      - notify homeowner: push — "Your provider has arrived."
      - start job timer
    async: true

  - id: on_job_completed
    trigger: provider status → completed_pending_review
    actions:
      - save work_summary and after_photos
      - notify homeowner: "Job completed! Please review the work."
      - invoke: review flow (star rating + comment, 48-hour window)
      - trigger: payment processing flow
      - update job.status → completed (after payment confirmed)
    async: true

  - id: on_review_submitted
    trigger: homeowner submits rating
    actions:
      - update provider.rating (rolling average)
      - if rating ≤ 2 → create support ticket, flag provider account
      - send thank-you notification to homeowner
    async: true

  - id: on_payment_received
    trigger: payment gateway confirms payment
    actions:
      - update booking.payment_status → paid
      - generate and send invoice PDF to homeowner (email + in-app)
      - release funds to provider (after platform commission)
    async: true

  - id: on_booking_cancelled
    trigger: booking.status → cancelled
    condition: cancellation > 4 hours before slot
    actions:
      - notify both homeowner and provider
      - process refund if applicable (per RULE-013)
      - update provider availability
    async: true
```

---

## 4. RULES

Rules are enforceable guardrails applied across all agents and skills. Every agent references applicable rule IDs.

```yaml
rules:

  - id: RULE-001
    name: User Identity Verification
    description: >
      Every session must identify user type (homeowner or provider)
      before routing. No agent can proceed without a valid user_id.
    enforcement: hard_block
    applies_to: orchestrator_agent

  - id: RULE-002
    name: Minimum Job Data Requirement
    description: >
      An intake cannot be submitted without at minimum: service_type,
      affected_area, urgency, and location. Photos are optional for
      non-emergency jobs but required for emergency jobs.
    enforcement: hard_block
    applies_to: intake_agent

  - id: RULE-003
    name: Data Privacy — PII Handling
    description: >
      Homeowner name, phone, and address must never be shared with a
      provider until the booking is confirmed by both parties.
      Provider identity is masked until quote is accepted.
    enforcement: hard_block
    applies_to: [intake_agent, scheduling_agent, provider_agent]

  - id: RULE-004
    name: AI Diagnosis Confidence Threshold
    description: >
      If diagnosis confidence_score < 0.70, the case must be flagged
      for human review. The AI must not generate a quote from a
      low-confidence diagnosis.
    enforcement: hard_block
    threshold: 0.70
    applies_to: diagnosis_agent

  - id: RULE-005
    name: Quote Price Bounds
    description: >
      Generated quotes must fall within predefined min/max ranges per
      service type. Any quote outside bounds must be reviewed by ops
      before being shown to the user.
      Bounds are maintained in the pricing_rules table in the backend.
    enforcement: soft_block (ops review)
    applies_to: quoting_agent

  - id: RULE-006
    name: Quote Validity Window
    description: >
      All quotes are valid for 48 hours from generation. After expiry,
      the quote must be regenerated at current market prices.
    enforcement: hard_block
    validity_hours: 48
    applies_to: quoting_agent

  - id: RULE-007
    name: No Unsolicited Contact
    description: >
      Agents must never initiate outreach to users unless triggered
      by a system event (hook) or an explicit user action.
      Cold push notifications are prohibited.
    enforcement: hard_block
    applies_to: [all_agents]

  - id: RULE-008
    name: Maximum Conversation Re-routing
    description: >
      A single conversation must not be re-routed between agents more
      than 4 times. On the 5th re-route, escalate to support_agent
      with a human handoff flag.
    enforcement: soft_block
    max_hops: 4
    applies_to: orchestrator_agent

  - id: RULE-009
    name: Human Escalation Mandatory
    description: >
      If any agent cannot resolve an issue within 3 attempts, it must
      escalate to a human agent and create a support ticket.
      The AI must never pretend to have resolved an unresolved issue.
    enforcement: hard_block
    max_attempts: 3
    applies_to: [diagnosis_agent, support_agent]

  - id: RULE-010
    name: No Fabricated Information
    description: >
      Agents must never fabricate service details, pricing, or provider
      qualifications. All outputs must be sourced from verified backend
      data or the knowledge base. Hallucinated content must be caught
      before display using a validation layer.
    enforcement: hard_block
    applies_to: [all_agents]

  - id: RULE-011
    name: GST Compliance
    description: >
      All quotes must include GST at the applicable rate (18% as of
      current Indian tax rules). Invoice must clearly show pre-GST
      and GST amounts as separate line items.
    enforcement: hard_block
    gst_rate: 0.18
    applies_to: quoting_agent

  - id: RULE-012
    name: Provider Verification Gate
    description: >
      A provider must have a verified license, identity, and at least
      one completed background check on record before being matched to
      any job. Unverified providers must not appear in scheduling results.
    enforcement: hard_block
    required_checks: [identity_verified, license_verified, background_checked]
    applies_to: scheduling_agent

  - id: RULE-013
    name: Cancellation and Refund Policy
    description: >
      Cancellations made more than 4 hours before the scheduled slot:
      full refund. Cancellations within 4 hours: 50% refund.
      No-shows by the provider: full refund + service credit.
      No-shows by the homeowner: no refund.
    enforcement: hard_block
    applies_to: scheduling_agent

  - id: RULE-014
    name: Provider Photo Capture Required
    description: >
      Providers must upload at least one before-photo before starting
      work, and at least one after-photo before marking a job complete.
      Violations result in job being blocked at that status transition.
    enforcement: hard_block
    applies_to: provider_agent

  - id: RULE-015
    name: Complaint SLA
    description: >
      Support tickets with severity=high must receive a first human
      response within 2 business hours. Severity=medium: 8 hours.
      Severity=low: 24 hours. Breached SLAs trigger an ops alert.
    enforcement: soft_block (ops alert)
    sla:
      high: 2h
      medium: 8h
      low: 24h
    applies_to: support_agent
```

---

## 5. DATA MODELS (Summary)

```yaml
entities:

  User:
    - user_id, name, email, phone, type (homeowner|provider)
    - location, preferences, created_at

  Provider:
    - provider_id, user_id, service_types[], license_number
    - verified (bool), rating, completed_jobs, service_radius_km
    - availability_calendar

  Job:
    - job_id, homeowner_id, service_type, affected_area[], urgency
    - photos[], location, status, diagnosis{}, created_at

  Quote:
    - quote_id, job_id, line_items[], subtotal, gst, total
    - valid_until, status (pending|accepted|declined|expired)

  Booking:
    - booking_id, job_id, provider_id, homeowner_id
    - scheduled_at, duration_hours, status, payment_status

  SupportTicket:
    - ticket_id, job_id, user_id, issue_summary
    - severity, status, assigned_to, sla_deadline, conversation_log

  Notification:
    - notification_id, recipient_id, channel, template_id
    - variables, sent_at, delivery_status
```

---

## 6. INTEGRATION POINTS (Both Platforms)

```yaml
integrations:

  # ── Shared (Web + Mobile) ───────────────────────────────────────────────

  - name: Push Notifications
    mobile:  Firebase Cloud Messaging (FCM) / APNs
    web:     Web Push API via FCM (Service Worker)
    used_by: notification_sender skill

  - name: SMS
    provider: Twilio / MSG91
    used_by: notification_sender skill

  - name: Maps & Routing
    mobile:  Google Maps SDK for React Native / Mapbox SDK
    web:     Google Maps JavaScript API / Mapbox GL JS
    used_by: location_picker, map_router, live_location_tracker

  - name: Photo & File Storage
    provider: AWS S3 / Google Cloud Storage (signed URLs, both platforms)
    mobile:  Camera roll + gallery picker (Expo ImagePicker)
    web:     Browser File Input + Drag & Drop (react-dropzone)
    used_by: photo_uploader skill

  - name: Vision AI
    provider: OpenAI GPT-4o Vision / Google Gemini Vision
    used_by: photo_analyzer skill

  - name: Payment Gateway
    provider: Razorpay / Stripe
    mobile:  Native SDK (Razorpay React Native)
    web:     Razorpay Checkout.js / Stripe Elements (iframe)
    used_by: payment processing hook

  - name: Authentication
    provider: Firebase Auth / Supabase Auth
    mobile:  JWT stored in SecureStore (Expo)
    web:     JWT in httpOnly cookie (SSR) or memory (SPA)
    methods: [OTP via SMS, Google OAuth, Apple Sign-In (mobile only)]

  - name: Real-Time Updates
    provider: Supabase Realtime / Pusher / Socket.io
    used_by: live_location_tracker, job status updates, chat
    note:    Mobile uses background service; Web uses browser WebSocket

  - name: Background Check
    provider: AuthBridge / SpringVerify
    used_by: provider onboarding (RULE-012)

  - name: LLM (Core AI)
    provider: Anthropic Claude API (claude-sonnet-4-6)
    used_by: all conversational agents

  # ── Web-Only ────────────────────────────────────────────────────────────

  - name: Email Notifications
    provider: Resend / SendGrid
    used_by: notification_sender skill (web channel)
    note:    Web users may not have push enabled; email is primary fallback

  - name: Web Analytics
    provider: PostHog / Mixpanel
    used_by: funnel tracking, quote conversion, drop-off analysis

  - name: SEO & Metadata
    framework: Next.js Metadata API
    used_by: public service pages (grouting, tiling, etc.)

  - name: CDN
    provider: Vercel Edge Network / Cloudflare
    used_by: static assets, SSR edge caching
```

---

## 7. WEB APP ARCHITECTURE (React / Next.js)

### 7.1 Application Structure

```
homeserv-web/
├── app/                          # Next.js 14+ App Router
│   ├── (public)/                 # No-auth pages
│   │   ├── page.tsx              # Landing / Home
│   │   ├── services/[slug]/      # Service detail pages (SEO)
│   │   └── how-it-works/
│   ├── (homeowner)/              # Auth-required homeowner pages
│   │   ├── dashboard/            # Job history, active bookings
│   │   ├── new-job/              # Multi-step intake form (Intake Agent)
│   │   ├── jobs/[id]/            # Job detail: diagnosis, quote, tracking
│   │   └── support/              # Support chat (Support Agent)
│   ├── (provider)/               # Auth-required provider pages
│   │   ├── dashboard/            # Assigned jobs, earnings
│   │   ├── jobs/[id]/            # Job workflow: accept → en route → complete
│   │   └── profile/              # Availability calendar, service areas
│   ├── api/                      # Next.js API Routes (edge/serverless)
│   │   ├── agents/               # Agent invocation endpoints
│   │   │   ├── intake/route.ts
│   │   │   ├── diagnose/route.ts
│   │   │   ├── quote/route.ts
│   │   │   └── schedule/route.ts
│   │   ├── hooks/route.ts        # Incoming webhook receiver
│   │   ├── upload/route.ts       # Signed URL generation
│   │   └── payments/             # Razorpay / Stripe webhooks
│   └── layout.tsx
├── components/
│   ├── ai/
│   │   ├── ChatWidget.tsx        # Floating AI chat (all agents)
│   │   ├── QuoteCard.tsx         # Quote acceptance UI
│   │   ├── DiagnosisCard.tsx     # Damage analysis result
│   │   └── SlotPicker.tsx        # Time slot selection
│   ├── maps/
│   │   ├── LocationPicker.tsx    # Address input + map
│   │   └── LiveTracker.tsx       # Provider real-time location
│   ├── jobs/
│   │   ├── IntakeWizard.tsx      # Multi-step form
│   │   ├── JobCard.tsx
│   │   └── StatusTimeline.tsx    # Job lifecycle progress
│   └── ui/                       # Design system (shadcn/ui base)
├── lib/
│   ├── agents/                   # Agent client wrappers
│   │   ├── orchestrator.ts
│   │   ├── intake.ts
│   │   └── diagnosis.ts
│   ├── hooks/                    # React hooks
│   │   ├── useJobStatus.ts       # Real-time job updates (WebSocket)
│   │   ├── useProviderLocation.ts
│   │   └── useQuote.ts
│   ├── api-client.ts             # Typed API client
│   └── auth.ts                   # Auth helpers
├── store/                        # Zustand global state
│   ├── jobStore.ts
│   ├── userStore.ts
│   └── notificationStore.ts
└── public/
    └── sw.js                     # Service Worker (Web Push + offline)
```

---

### 7.2 Frontend State Management

```yaml
state_management:
  library: Zustand
  stores:
    jobStore:
      - active_job_id
      - job_details
      - quote
      - booking
      - diagnosis_result

    userStore:
      - user_id
      - user_type          # homeowner | provider
      - auth_token
      - profile

    notificationStore:
      - unread_count
      - notifications[]
      - push_permission_status

  server_state: TanStack Query (React Query)
  purpose: API data fetching, caching, optimistic updates
```

---

### 7.3 API Layer

```yaml
api_design:
  style: REST + Streaming (for AI agent responses)
  base_url: /api/v1

  endpoints:

    # Agent invocation
    POST /api/agents/orchestrate:
      body: {message: string, session_id: string, context: dict}
      response: {agent_id, reply, next_action, session_id}
      streaming: true (Server-Sent Events for LLM tokens)

    POST /api/agents/intake:
      body: {form_data: dict, session_id: string}
      response: {job_id, status}

    POST /api/agents/diagnose:
      body: {job_id: string}
      response: {diagnosis, confidence, human_review_required}

    POST /api/agents/quote:
      body: {job_id: string}
      response: {quote_id, line_items, total, valid_until}

    POST /api/agents/schedule:
      body: {job_id, quote_id, preferred_slots[]}
      response: {booking_id, provider, confirmed_slot}

    # Jobs
    GET  /api/jobs               → list homeowner's jobs
    GET  /api/jobs/:id           → job detail with all linked data
    POST /api/jobs/:id/photos    → upload photos (returns signed S3 URL)

    # Bookings
    GET  /api/bookings/:id       → booking detail
    POST /api/bookings/:id/cancel → cancel with reason

    # Provider
    GET  /api/provider/jobs      → assigned jobs
    POST /api/provider/jobs/:id/status → status transition
    POST /api/provider/jobs/:id/summary → work summary + after photos

    # Webhooks (inbound)
    POST /api/hooks/payment      → Razorpay / Stripe webhook
    POST /api/hooks/sms-status   → Twilio delivery status

  auth:
    method: Bearer JWT (httpOnly cookie for web SSR)
    refresh: silent refresh via /api/auth/refresh
```

---

### 7.4 Real-Time (WebSocket / SSE)

```yaml
real_time:
  provider: Supabase Realtime (Postgres changes → broadcast)

  channels:
    job:{job_id}:
      events:
        - job.status_changed       → update StatusTimeline
        - diagnosis.complete       → show DiagnosisCard
        - quote.generated          → show QuoteCard
        - booking.confirmed        → show BookingCard

    provider:{provider_id}:
      events:
        - job.assigned             → show new job card
        - job.status_updated       → sync with homeowner view

    location:{booking_id}:
      events:
        - provider.location_update → update LiveTracker map
      frequency: every 30 seconds (en_route phase only)

  web_implementation:
    library: Supabase JS client (createClient)
    fallback: polling every 15 seconds if WebSocket unavailable
```

---

### 7.5 Authentication Flow (Web)

```yaml
auth_flow_web:

  homeowner:
    step_1: Enter mobile number
    step_2: Receive OTP via SMS (Twilio)
    step_3: Verify OTP → Firebase Auth issues ID token
    step_4: Exchange ID token for app JWT (httpOnly cookie, 7d expiry)
    step_5: Orchestrator Agent loads user profile

  provider:
    step_1: Registered by ops team (invite-only during beta)
    step_2: Email invite with magic link
    step_3: Set password or continue with Google OAuth
    step_4: Same JWT flow as homeowner

  session:
    storage: httpOnly cookie (prevents XSS token theft on web)
    refresh: silent background refresh 5 minutes before expiry
    logout: server-side cookie invalidation
```

---

### 7.6 Web-Specific Hooks

```yaml
web_hooks:

  - id: on_page_load_job
    trigger: User navigates to /jobs/:id
    actions:
      - load job details
      - subscribe to job:{job_id} Realtime channel
      - if booking.status == en_route → activate LiveTracker

  - id: on_push_permission_granted
    trigger: User grants browser push permission
    actions:
      - register Service Worker
      - save FCM web token to user profile
      - update notification_sender channel to include web_push

  - id: on_file_dropped
    trigger: User drags photos onto IntakeWizard
    actions:
      - validate file type (jpg/png/heic) and size (< 10MB each)
      - generate preview thumbnails
      - invoke photo_uploader skill → get signed S3 URLs
      - update job photos array

  - id: on_tab_visibility_change
    trigger: Browser tab becomes active (visibilitychange event)
    actions:
      - if job in progress → poll latest job status once
      - resume paused WebSocket connection if disconnected

  - id: on_payment_redirect_return
    trigger: User returns from Razorpay payment page
    actions:
      - verify payment_id with backend
      - invoke on_payment_received hook
      - redirect to /jobs/:id?payment=success
```

---

## 8. PLATFORM COMPARISON MATRIX

| Capability | Web App (Next.js) | Mobile App (RN/Flutter) |
|---|---|---|
| **Authentication** | OTP + httpOnly JWT cookie | OTP + SecureStore JWT |
| **Push Notifications** | Web Push API (Service Worker) | FCM (Android) / APNs (iOS) |
| **Photo Upload** | File Input / Drag & Drop | Camera + Gallery Picker |
| **Maps** | Google Maps JS API | Google Maps SDK |
| **Live Location** | WebSocket + Leaflet/GMaps | Background geolocation |
| **Offline Support** | PWA Service Worker (partial) | Full native offline |
| **Deep Linking** | URL routes (`/jobs/:id`) | Universal Links / App Links |
| **AI Chat** | Floating ChatWidget (SSE streaming) | Bottom sheet chat (streaming) |
| **Provider GPS** | Browser Geolocation API | Native GPS (background) |
| **Payment** | Razorpay Checkout.js iframe | Razorpay Native SDK |
| **SEO** | Next.js SSR / Static pages | N/A |
| **App Distribution** | Browser (no install) | App Store / Play Store |

---

## 9. AGENT INTERACTION FLOW (End-to-End Example)

```
[Web or Mobile] Homeowner opens app → Orchestrator detects intent (job_request)
        ↓
Intake Agent collects: Seepage | Bathroom | Urgent | [photo upload] | Address (map picker)
        ↓ [HOOK: on_job_created]
Diagnosis Agent analyzes photo → damage_type: pipe seepage, severity: medium, confidence: 0.83
        ↓ [HOOK: on_diagnosis_complete]
Quoting Agent computes: Materials ₹2,400 + Labour ₹1,800 + GST ₹756 = Total ₹4,956
        ↓ [HOOK: on_quote_generated]
Homeowner sees Quote Card (web: inline page / mobile: bottom sheet) → Accepts
        ↓ [HOOK: on_quote_accepted]
Scheduling Agent matches provider: Ramesh K. (4.7★, 3.2km away) → slot: Tomorrow 10am
        ↓ [HOOK: on_booking_confirmed]
  Web:    /jobs/:id shows live status + map tracker
  Mobile: Real-time push + in-app tracker
Provider Agent: Ramesh accepts → En Route → Arrived → In Progress [before photo] → Complete [after photo]
        ↓ [HOOK: on_job_completed]
Homeowner reviews (4★) → Payment processed (Razorpay) → Invoice emailed + shown in app
        ↓ [HOOK: on_review_submitted + on_payment_received]
Job archived ✓
```

---

*Architecture version: 2.0 | Date: March 2026 | Platform: HomeServ AI (Web + Mobile)*
