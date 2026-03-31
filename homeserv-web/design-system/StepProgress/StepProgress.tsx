import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Step {
  id: string
  label: string
  status: "upcoming" | "current" | "completed"
}

export interface StepProgressProps {
  steps: Step[]
  orientation?: "horizontal" | "vertical"
}

export function StepProgress({ steps, orientation = "horizontal" }: StepProgressProps) {
  if (orientation === "vertical") {
    return (
      <nav aria-label="Progress">
      <ol className="flex flex-col gap-0">
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1
          return (
            <li key={step.id} className="flex gap-4" aria-current={step.status === "current" ? "step" : undefined}>
              {/* Indicator + connector */}
              <div className="flex flex-col items-center">
                <StepIndicator step={step} />
                {!isLast && (
                  <div
                    className="w-0.5 flex-1 mt-1 min-h-[24px]"
                    style={{
                      backgroundColor:
                        step.status === "completed"
                          ? "var(--color-brand-500)"
                          : "var(--color-neutral-200)",
                    }}
                  />
                )}
              </div>
              {/* Label */}
              <div className="pb-8 pt-0.5">
                <StepLabel step={step} />
              </div>
            </li>
          )
        })}
      </ol>
      </nav>
    )
  }

  return (
    <nav aria-label="Progress">
      <ol className="flex items-center w-full">
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1
          return (
            <React.Fragment key={step.id}>
              <li
                className="flex flex-col items-center gap-2 shrink-0"
                aria-current={step.status === "current" ? "step" : undefined}
              >
                <StepIndicator step={step} />
                <StepLabel step={step} />
              </li>
              {!isLast && (
                <div
                  className="flex-1 h-0.5 mx-2 mb-6"
                  aria-hidden="true"
                  style={{
                    backgroundColor:
                      step.status === "completed"
                        ? "var(--color-brand-500)"
                        : "var(--color-neutral-200)",
                    transition: "background-color 300ms ease",
                  }}
                />
              )}
            </React.Fragment>
          )
        })}
      </ol>
    </nav>
  )
}

function StepIndicator({ step }: { step: Step }) {
  if (step.status === "completed") {
    return (
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
        style={{ background: "linear-gradient(135deg, #1A9458, #2EB374)" }}
        aria-label={`${step.label} completed`}
      >
        <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
      </div>
    )
  }

  if (step.status === "current") {
    return (
      <div className="relative w-9 h-9 shrink-0" aria-label={`${step.label} in progress`}>
        {/* Pulsing ring */}
        <div
          className="absolute inset-0 rounded-full animate-ping opacity-25"
          style={{ backgroundColor: "var(--color-brand-400)" }}
        />
        <div
          className="relative w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm"
          style={{ background: "linear-gradient(135deg, #0D5230, #1A9458)" }}
        >
          {/* index is passed via parent, use CSS counter trick via prop */}
          <span className="text-white text-sm font-bold">●</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
      style={{
        backgroundColor: "var(--color-neutral-100)",
        border: "2px solid var(--color-neutral-200)",
      }}
      aria-label={`${step.label} upcoming`}
    />
  )
}

function StepLabel({ step }: { step: Step }) {
  return (
    <span
      className={cn("text-xs font-semibold text-center max-w-[80px] leading-tight")}
      style={{
        color:
          step.status === "upcoming"
            ? "var(--color-text-disabled)"
            : step.status === "current"
              ? "var(--color-brand-700)"
              : "var(--color-text-primary)",
      }}
    >
      {step.label}
    </span>
  )
}
