"use client"

import * as React from "react"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

// ── Label ─────────────────────────────────────────────────────────────────────
// AA: 4.5:1 contrast — neutral-900 on white passes at 16.75:1
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}
export function Label({ children, required, className, ...props }: LabelProps) {
  return (
    <label
      className={cn("block text-sm font-semibold mb-1.5 leading-snug", className)}
      style={{ color: "var(--color-text-primary)" }} // #111827 — 16.75:1 on white ✓
      {...props}
    >
      {children}
      {required && (
        <span
          className="ml-1"
          aria-hidden="true"
          style={{ color: "var(--color-error-500)" }} // decorative asterisk
        >
          *
        </span>
      )}
      {required && <span className="sr-only">(required)</span>}
    </label>
  )
}

// ── HelperText ────────────────────────────────────────────────────────────────
// AA: neutral-600 (#4B5563) on white = 7.05:1 ✓  error-700 (#B91C1C) on white = 7.1:1 ✓
export interface HelperTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  error?: boolean
}
export function HelperText({ children, error, className, ...props }: HelperTextProps) {
  return (
    <p
      className={cn("mt-1.5 text-xs leading-normal", className)}
      style={{ color: error ? "var(--color-error-700)" : "var(--color-neutral-600)" }}
      {...props}
    >
      {children}
    </p>
  )
}

// ── Input ─────────────────────────────────────────────────────────────────────
// Airbnb-style: 8px border-radius (multiple of 4), clear 2px border, strong focus ring
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  label?: string
  helperText?: string
  error?: string
  success?: boolean
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  inputSize?: "sm" | "md" | "lg"
  variant?: "default" | "filled"
  required?: boolean
}

const inputSizeClasses: Record<NonNullable<InputProps["inputSize"]>, string> = {
  sm: "h-9 text-sm",
  md: "h-11 text-sm",   // 44px — meets 44×44 WCAG touch target
  lg: "h-[52px] text-base",
}

// Padding separate so prefix/suffix offsets are predictable multiples of 4
const inputPadX: Record<NonNullable<InputProps["inputSize"]>, { base: string; withPrefix: string; withSuffix: string }> = {
  sm: { base: "px-3",  withPrefix: "pl-9 pr-3",  withSuffix: "pl-3 pr-9"  },
  md: { base: "px-4",  withPrefix: "pl-10 pr-4", withSuffix: "pl-4 pr-10" },
  lg: { base: "px-4",  withPrefix: "pl-11 pr-4", withSuffix: "pl-4 pr-11" },
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      success,
      prefix,
      suffix,
      inputSize = "md",
      variant = "default",
      required,
      className,
      id,
      disabled,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const uid      = React.useId()
    const inputId  = id ?? `input-${uid}`
    const helperId = `${inputId}-helper`
    const hasError = !!error
    const hasSuffix = !!suffix || hasError || success
    const hasPrefix = !!prefix

    // Determine padding classes
    const padClass = hasPrefix && hasSuffix
      ? `${inputPadX[inputSize].withPrefix.split(" ")[0]} ${inputPadX[inputSize].withSuffix.split(" ")[1]}`
      : hasPrefix
        ? inputPadX[inputSize].withPrefix
        : hasSuffix
          ? inputPadX[inputSize].withSuffix
          : inputPadX[inputSize].base

    // Border: 2px so it's clearly visible (Airbnb uses 2px on focus, 1px rest — we keep 2px always for clarity)
    const borderColor = hasError
      ? "var(--color-error-500)"   // #EF4444 — 3.94:1 on white (passes AA for UI components ≥3:1)
      : success
        ? "var(--color-brand-600)" // #13723F — passes for UI components
        : "var(--color-neutral-400)" // #9CA3AF — visible neutral border

    return (
      <div className="w-full">
        {label && (
          <Label htmlFor={inputId} required={required}>
            {label}
          </Label>
        )}

        <div className="relative flex items-center">
          {/* Prefix icon — decorative, pointer-events-none */}
          {hasPrefix && (
            <div
              className="absolute left-3 flex items-center pointer-events-none z-10"
              aria-hidden="true"
              style={{ color: "var(--color-neutral-500)" }}
            >
              {prefix}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            aria-required={required}
            aria-invalid={hasError ? "true" : undefined}
            aria-describedby={(helperText || error) ? helperId : undefined}
            aria-label={!label ? ariaLabel : undefined}
            className={cn(
              "w-full outline-none transition-all duration-150",
              "font-normal placeholder:text-neutral-400",
              // 8px = 2×4px grid — Airbnb-style, no pill
              "rounded-lg",
              inputSizeClasses[inputSize],
              padClass,
              disabled && "opacity-50 cursor-not-allowed bg-neutral-50",
              className
            )}
            style={{
              backgroundColor: variant === "filled"
                ? "var(--color-neutral-100)"
                : "var(--color-neutral-0)",
              border: `2px solid ${borderColor}`,
              color: "var(--color-neutral-900)", // #111827 — 16.75:1 ✓
              // No box-shadow at rest — clean Airbnb look
            }}
            onFocus={(e) => {
              // AA focus indicator: 3px offset ring in brand green
              e.currentTarget.style.borderColor = hasError
                ? "var(--color-error-500)"
                : "var(--color-brand-600)"
              e.currentTarget.style.boxShadow = hasError
                ? "0 0 0 3px rgba(185,28,28,0.18)"
                : "0 0 0 3px rgba(19,114,63,0.2)"
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = borderColor
              e.currentTarget.style.boxShadow = "none"
              props.onBlur?.(e)
            }}
            {...props}
          />

          {/* Suffix / state icons */}
          <div
            className="absolute right-3 flex items-center gap-1.5 z-10"
            aria-hidden="true"  // icons are decorative; error text is in HelperText
          >
            {hasError && (
              <AlertCircle
                className="w-4 h-4 shrink-0"
                style={{ color: "var(--color-error-500)" }}
              />
            )}
            {success && !hasError && (
              <CheckCircle2
                className="w-4 h-4 shrink-0"
                style={{ color: "var(--color-brand-600)" }}
              />
            )}
            {suffix && !hasError && !success && (
              <span
                className="pointer-events-none"
                style={{ color: "var(--color-neutral-500)" }}
              >
                {suffix}
              </span>
            )}
          </div>
        </div>

        {(error || helperText) && (
          <HelperText id={helperId} error={hasError} role={hasError ? "alert" : undefined}>
            {error ?? helperText}
          </HelperText>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

// ── Textarea ──────────────────────────────────────────────────────────────────
export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "prefix"> {
  label?: string
  helperText?: string
  error?: string
  required?: boolean
}
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, error, required, className, id, disabled, ...props }, ref) => {
    const uid      = React.useId()
    const inputId  = id ?? `textarea-${uid}`
    const helperId = `${inputId}-helper`
    const hasError = !!error

    return (
      <div className="w-full">
        {label && <Label htmlFor={inputId} required={required}>{label}</Label>}
        <textarea
          ref={ref}
          id={inputId}
          disabled={disabled}
          required={required}
          aria-required={required}
          aria-invalid={hasError ? "true" : undefined}
          aria-describedby={(helperText || error) ? helperId : undefined}
          className={cn(
            "w-full rounded-lg px-4 py-3 text-sm font-normal outline-none transition-all duration-150",
            "placeholder:text-neutral-400 resize-y min-h-[100px]",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          style={{
            border: `2px solid ${hasError ? "var(--color-error-500)" : "var(--color-neutral-400)"}`,
            color: "var(--color-neutral-900)",
            backgroundColor: "var(--color-neutral-0)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = hasError ? "var(--color-error-500)" : "var(--color-brand-600)"
            e.currentTarget.style.boxShadow = hasError ? "0 0 0 3px rgba(185,28,28,0.18)" : "0 0 0 3px rgba(19,114,63,0.2)"
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = hasError ? "var(--color-error-500)" : "var(--color-neutral-400)"
            e.currentTarget.style.boxShadow = "none"
          }}
          {...props}
        />
        {(error || helperText) && (
          <HelperText id={helperId} error={hasError} role={hasError ? "alert" : undefined}>
            {error ?? helperText}
          </HelperText>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

// ── Select (dropdown) ─────────────────────────────────────────────────────────
// Airbnb-style: 8px radius, 2px border, native <select> for full a11y
export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string
  helperText?: string
  error?: string
  inputSize?: "sm" | "md" | "lg"
  required?: boolean
  placeholder?: string
  options: { value: string; label: string }[]
}
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, helperText, error, inputSize = "md", required, placeholder, options, className, id, disabled, ...props }, ref) => {
    const uid      = React.useId()
    const inputId  = id ?? `select-${uid}`
    const helperId = `${inputId}-helper`
    const hasError = !!error

    const heightClass = inputSizeClasses[inputSize]
    const borderColor = hasError ? "var(--color-error-500)" : "var(--color-neutral-400)"

    return (
      <div className="w-full">
        {label && <Label htmlFor={inputId} required={required}>{label}</Label>}
        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            aria-required={required}
            aria-invalid={hasError ? "true" : undefined}
            aria-describedby={(helperText || error) ? helperId : undefined}
            className={cn(
              "w-full rounded-lg pl-4 pr-10 appearance-none outline-none transition-all duration-150",
              "text-sm font-normal cursor-pointer",
              heightClass,
              disabled && "opacity-50 cursor-not-allowed",
              className
            )}
            style={{
              border: `2px solid ${borderColor}`,
              color: "var(--color-neutral-900)",
              backgroundColor: "var(--color-neutral-0)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = hasError ? "var(--color-error-500)" : "var(--color-brand-600)"
              e.currentTarget.style.boxShadow = hasError ? "0 0 0 3px rgba(185,28,28,0.18)" : "0 0 0 3px rgba(19,114,63,0.2)"
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = borderColor
              e.currentTarget.style.boxShadow = "none"
            }}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Chevron icon — decorative */}
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6l4 4 4-4" stroke="var(--color-neutral-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {(error || helperText) && (
          <HelperText id={helperId} error={hasError} role={hasError ? "alert" : undefined}>
            {error ?? helperText}
          </HelperText>
        )}
      </div>
    )
  }
)
Select.displayName = "Select"

// ── InputGroup ────────────────────────────────────────────────────────────────
export interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
  helperText?: string
  error?: string
  required?: boolean
}
export function InputGroup({ label, helperText, error, required, children, className, ...props }: InputGroupProps) {
  const uid = React.useId()
  return (
    <div className={cn("w-full", className)} role="group" {...props}>
      {label && <Label htmlFor={uid} required={required}>{label}</Label>}
      <div
        className="flex rounded-lg overflow-hidden"
        style={{ border: `2px solid ${error ? "var(--color-error-500)" : "var(--color-neutral-400)"}` }}
      >
        {children}
      </div>
      {(error || helperText) && (
        <HelperText error={!!error} role={error ? "alert" : undefined}>
          {error ?? helperText}
        </HelperText>
      )}
    </div>
  )
}

