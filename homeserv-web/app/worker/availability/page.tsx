"use client"

import * as React from "react"
import { Ban } from "lucide-react"
import { Button, WorkerAvailabilityEditor, useToast } from "@/design-system"
import type { TimeSlot } from "@/lib/mock-data"
import { mockDelay } from "@/lib/utils"

export default function WorkerAvailabilityPage() {
  const toast = useToast()
  const [availability, setAvailability] = React.useState<TimeSlot[]>([])
  const [month, setMonth] = React.useState(new Date())
  const [saving, setSaving] = React.useState(false)

  async function handleSave() {
    setSaving(true)
    await mockDelay(800)
    setSaving(false)
    toast.success("Availability saved!")
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 lg:py-8">
      <div className="hidden lg:block mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
          Manage Availability
        </h1>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Set the days and times you&apos;re available to work
        </p>
      </div>

      <WorkerAvailabilityEditor
        availability={availability}
        onChange={setAvailability}
        month={month}
        onMonthChange={setMonth}
      />

      <div className="mt-6 flex gap-3">
        <Button
          variant="outline"
          iconLeft={<Ban className="w-4 h-4" />}
          onClick={() => toast.info("Block date flow coming soon")}
        >
          Block a Date
        </Button>
        <Button variant="primary" loading={saving} onClick={handleSave} fullWidth>
          Save Availability
        </Button>
      </div>

      {availability.length > 0 && (
        <p className="text-xs text-center mt-4" style={{ color: "var(--color-text-secondary)" }}>
          {availability.length} slot{availability.length !== 1 ? "s" : ""} set across your calendar
        </p>
      )}
    </div>
  )
}
