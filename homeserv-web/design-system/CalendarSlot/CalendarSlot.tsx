"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, Plus, X, Zap } from "lucide-react"
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  getDay, isSameDay, isSameMonth, isToday, addMonths, subMonths,
  parseISO, isBefore, startOfDay,
} from "date-fns"
import { cn } from "@/lib/utils"
import type { TimeSlot } from "@/lib/mock-data"

// ── Shared month grid ─────────────────────────────────────────────────────────
function MonthGrid({
  month,
  onMonthChange,
  selectedDate,
  onSelectDate,
  getDayMeta,
}: {
  month: Date
  onMonthChange: (d: Date) => void
  selectedDate: Date | null
  onSelectDate: (d: Date) => void
  getDayMeta: (d: Date) => { hasSlots: boolean; fullyBooked: boolean }
}) {
  const today = startOfDay(new Date())
  const days = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) })
  const startPad = getDay(startOfMonth(month)) === 0 ? 6 : getDay(startOfMonth(month)) - 1

  return (
    <div
      className="rounded-[var(--radius-xl)] overflow-hidden"
      style={{ border: "1.5px solid var(--color-border-default)", backgroundColor: "var(--color-neutral-0)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid var(--color-border-default)", background: "linear-gradient(135deg, #EDFAF2, #D0F2DF)" }}
      >
        <button
          onClick={() => onMonthChange(subMonths(month, 1))}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-[var(--color-brand-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB374]"
          style={{ color: "var(--color-brand-700)" }}
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h3 className="font-bold text-base" style={{ color: "var(--color-brand-800)", fontFamily: "var(--font-sora)" }}>
          {format(month, "MMMM yyyy")}
        </h3>
        <button
          onClick={() => onMonthChange(addMonths(month, 1))}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-[var(--color-brand-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB374]"
          style={{ color: "var(--color-brand-700)" }}
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 px-2 pt-3 pb-1">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div
            key={d}
            className="text-center text-[10px] font-bold uppercase tracking-wider pb-2"
            style={{ color: "var(--color-text-secondary)" }}
            aria-hidden="true"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 px-2 pb-3 gap-1">
        {Array.from({ length: startPad }).map((_, i) => <div key={`pad-${i}`} aria-hidden="true" />)}
        {days.map((day) => {
          const { hasSlots, fullyBooked } = getDayMeta(day)
          const isPast = isBefore(startOfDay(day), today)
          const isDisabledDay = isPast || !hasSlots
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false
          const isCurrentMonth = isSameMonth(day, month)
          const todayDay = isToday(day)

          return (
            <button
              key={day.toISOString()}
              onClick={() => !isDisabledDay && onSelectDate(day)}
              disabled={isDisabledDay}
              className={cn(
                "relative flex flex-col items-center justify-center w-full aspect-square rounded-full text-sm font-medium transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB374] focus-visible:ring-offset-1",
                isSelected && "text-white",
                !isSelected && hasSlots && !fullyBooked && !isPast && "hover:bg-[var(--color-brand-100)]",
                isDisabledDay && "opacity-35 cursor-not-allowed",
                todayDay && !isSelected && "font-extrabold",
              )}
              style={{
                color: isSelected ? "#fff"
                  : !isCurrentMonth ? "var(--color-text-disabled)"
                  : todayDay ? "var(--color-brand-700)"
                  : "var(--color-text-primary)",
                background: isSelected
                  ? "linear-gradient(135deg, #0D5230, #2EB374)"
                  : undefined,
                boxShadow: isSelected ? "0 2px 12px rgba(26,148,88,0.35)" : undefined,
              }}
              aria-pressed={isSelected}
              aria-label={`${format(day, "d MMMM")}${isDisabledDay ? ", unavailable" : hasSlots ? ", has slots" : ""}`}
            >
              {format(day, "d")}
              {hasSlots && !isSelected && !isPast && (
                <span
                  className="absolute bottom-1 w-1 h-1 rounded-full"
                  aria-hidden="true"
                  style={{ backgroundColor: fullyBooked ? "var(--color-neutral-400)" : "var(--color-brand-500)" }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── CustomerSlotPicker ────────────────────────────────────────────────────────
export interface CustomerSlotPickerProps {
  slots: TimeSlot[]
  selectedSlotId: string | null
  onSelect: (slot: TimeSlot) => void
  month: Date
  onMonthChange: (d: Date) => void
}

export function CustomerSlotPicker({ slots, selectedSlotId, onSelect, month, onMonthChange }: CustomerSlotPickerProps) {
  // Smart default: auto-select today if it has slots, else next available date
  const defaultDate = React.useMemo(() => {
    const today = format(new Date(), "yyyy-MM-dd")
    const todayHasSlots = slots.some((s) => s.date === today && s.status === "available")
    if (todayHasSlots) return new Date()

    const next = slots.find((s) => s.status === "available")
    return next ? parseISO(next.date) : null
  }, [slots])

  const [selectedDate, setSelectedDate] = React.useState<Date | null>(defaultDate)

  // Smart hint: next available slot across all dates
  const nextAvailableSlot = React.useMemo(() => slots.find((s) => s.status === "available"), [slots])

  const slotsForDate = selectedDate
    ? slots.filter((s) => s.date === format(selectedDate, "yyyy-MM-dd"))
    : []

  const availableSlotsForDate = slotsForDate.filter((s) => s.status === "available")

  function getDayMeta(d: Date) {
    const dateStr = format(d, "yyyy-MM-dd")
    const daySlots = slots.filter((s) => s.date === dateStr)
    return {
      hasSlots: daySlots.length > 0,
      fullyBooked: daySlots.every((s) => s.status === "booked"),
    }
  }

  const noSlotsAtAll = !slots.some((s) => s.status === "available")

  return (
    <div className="space-y-4">
      {/* Smart hint banner */}
      {nextAvailableSlot && (
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
          style={{
            backgroundColor: "var(--color-brand-50)",
            border: "1.5px solid var(--color-brand-200)",
            color: "var(--color-brand-700)",
          }}
        >
          <Zap className="w-4 h-4 shrink-0" aria-hidden="true" />
          Next available: {format(parseISO(nextAvailableSlot.date), "EEE, d MMM")} at {nextAvailableSlot.startTime}
        </div>
      )}

      {noSlotsAtAll ? (
        <div
          className="text-center py-10 rounded-xl"
          style={{ backgroundColor: "var(--color-neutral-50)", border: "1.5px solid var(--color-border-default)" }}
        >
          <p className="font-semibold mb-1" style={{ color: "var(--color-text-primary)" }}>No slots available this week</p>
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>Check back tomorrow or choose a different service.</p>
        </div>
      ) : (
        <MonthGrid
          month={month}
          onMonthChange={onMonthChange}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          getDayMeta={getDayMeta}
        />
      )}

      {/* Slot chips */}
      {selectedDate && (
        <div>
          <p className="text-xs font-semibold mb-3" style={{ color: "var(--color-text-secondary)" }}>
            {format(selectedDate, "EEEE, d MMMM")}
          </p>

          {availableSlotsForDate.length === 0 && slotsForDate.length > 0 ? (
            <div className="text-sm py-3" style={{ color: "var(--color-text-secondary)" }}>
              No slots available for this day.{" "}
              <button
                className="font-semibold underline focus-visible:outline-none"
                style={{ color: "var(--color-brand-600)" }}
                onClick={() => {
                  const next = slots.find((s) => s.status === "available" && s.date > format(selectedDate, "yyyy-MM-dd"))
                  if (next) setSelectedDate(parseISO(next.date))
                }}
              >
                View next available day
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2" role="group" aria-label="Available time slots">
              {slotsForDate.map((slot) => {
                const isSelected = slot.id === selectedSlotId
                const isBooked   = slot.status === "booked"
                return (
                  <button
                    key={slot.id}
                    disabled={isBooked}
                    onClick={() => !isBooked && onSelect(slot)}
                    aria-pressed={isSelected}
                    aria-label={`${slot.startTime} to ${slot.endTime}${isBooked ? ", fully booked" : ""}`}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-semibold transition-all",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB374] focus-visible:ring-offset-2",
                      isBooked && "opacity-40 cursor-not-allowed",
                      !isBooked && !isSelected && "hover:scale-105",
                    )}
                    style={{
                      background: isSelected
                        ? "linear-gradient(135deg, #0D5230, #2EB374)"
                        : isBooked
                          ? "var(--color-neutral-100)"
                          : "var(--color-brand-50)",
                      color: isSelected ? "#fff" : isBooked ? "var(--color-text-disabled)" : "var(--color-brand-700)",
                      border: isSelected ? "none" : `1.5px solid ${isBooked ? "var(--color-neutral-200)" : "var(--color-brand-200)"}`,
                      boxShadow: isSelected ? "0 2px 10px rgba(26,148,88,0.3)" : undefined,
                    }}
                  >
                    {slot.startTime}
                    {isBooked && <span className="ml-1 text-[10px]">Booked</span>}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── WorkerAvailabilityEditor ──────────────────────────────────────────────────
export interface WorkerAvailabilityEditorProps {
  availability: TimeSlot[]
  onChange: (slots: TimeSlot[]) => void
  month: Date
  onMonthChange: (d: Date) => void
}

export function WorkerAvailabilityEditor({ availability, onChange, month, onMonthChange }: WorkerAvailabilityEditorProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null)
  const [addingTime, setAddingTime] = React.useState(false)
  const [newStart, setNewStart] = React.useState("09:00")
  const [newEnd,   setNewEnd]   = React.useState("09:30")

  const slotsForDate = selectedDate
    ? availability.filter((s) => s.date === format(selectedDate, "yyyy-MM-dd"))
    : []

  function getDayMeta(d: Date) {
    const dateStr = format(d, "yyyy-MM-dd")
    const daySlots = availability.filter((s) => s.date === dateStr)
    return { hasSlots: daySlots.length > 0, fullyBooked: false }
  }

  function addSlot() {
    if (!selectedDate) return
    const newSlot: TimeSlot = {
      id: `worker-${Date.now()}`,
      date: format(selectedDate, "yyyy-MM-dd"),
      startTime: newStart,
      endTime: newEnd,
      status: "available",
    }
    onChange([...availability, newSlot])
    setAddingTime(false)
  }

  function removeSlot(id: string) {
    onChange(availability.filter((s) => s.id !== id))
  }

  return (
    <div className="space-y-4">
      <MonthGrid
        month={month}
        onMonthChange={onMonthChange}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        getDayMeta={getDayMeta}
      />

      {selectedDate && (
        <div
          className="rounded-[var(--radius-xl)] p-4 space-y-3"
          style={{ border: "1.5px solid var(--color-border-default)", backgroundColor: "var(--color-neutral-0)" }}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
              {format(selectedDate, "d MMM")} — Slots
            </p>
            <button
              onClick={() => setAddingTime(true)}
              aria-label="Add time slot"
              className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB374]"
              style={{ background: "linear-gradient(135deg, #1A9458, #2EB374)", color: "#fff" }}
            >
              <Plus className="w-3 h-3" aria-hidden="true" /> Add Slot
            </button>
          </div>

          {addingTime && (
            <div className="flex items-center gap-2 flex-wrap">
              <label className="sr-only" htmlFor="slot-start">Start time</label>
              <input
                id="slot-start"
                type="time"
                value={newStart}
                onChange={(e) => setNewStart(e.target.value)}
                className="text-sm px-3 py-1.5 rounded-lg border font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB374]"
                style={{ borderColor: "var(--color-border-default)", color: "var(--color-text-primary)" }}
              />
              <span className="text-sm" style={{ color: "var(--color-text-secondary)" }} aria-hidden="true">to</span>
              <label className="sr-only" htmlFor="slot-end">End time</label>
              <input
                id="slot-end"
                type="time"
                value={newEnd}
                onChange={(e) => setNewEnd(e.target.value)}
                className="text-sm px-3 py-1.5 rounded-lg border font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB374]"
                style={{ borderColor: "var(--color-border-default)", color: "var(--color-text-primary)" }}
              />
              <button
                onClick={addSlot}
                className="px-3 py-1.5 rounded-full text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB374]"
                style={{ background: "linear-gradient(135deg, #0D5230, #2EB374)" }}
              >
                Save
              </button>
              <button
                onClick={() => setAddingTime(false)}
                className="px-3 py-1.5 rounded-full text-sm font-semibold"
                style={{ background: "var(--color-neutral-100)", color: "var(--color-text-secondary)" }}
              >
                Cancel
              </button>
            </div>
          )}

          {slotsForDate.length === 0 && !addingTime && (
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>No slots yet. Add one above.</p>
          )}

          <div className="flex flex-wrap gap-2">
            {slotsForDate.map((slot) => (
              <div
                key={slot.id}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold"
                style={{ backgroundColor: "var(--color-brand-50)", color: "var(--color-brand-700)", border: "1.5px solid var(--color-brand-200)" }}
              >
                {slot.startTime} – {slot.endTime}
                <button
                  onClick={() => removeSlot(slot.id)}
                  aria-label={`Remove slot ${slot.startTime} to ${slot.endTime}`}
                  className="rounded-full hover:bg-[var(--color-brand-100)] p-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB374]"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
