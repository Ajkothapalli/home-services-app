"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive" | "outline" | "link"
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  loading?: boolean
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  fullWidth?: boolean
}

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  xs: "h-8 px-3 text-xs gap-1.5",
  sm: "h-9 px-4 text-sm gap-1.5",
  md: "h-11 px-5 text-base gap-2",
  lg: "h-[52px] px-6 text-lg gap-2",
  xl: "h-[60px] px-8 text-xl gap-2.5",
}

// ─── Leaf-green gradient definitions ────────────────────────────────────────
//
//  Palette hand-tuned from real leaf specimens:
//    #031B0F  midnight grove
//    #07361F  root shadow
//    #0D5230  dark canopy
//    #13723F  forest floor
//    #1A9458  deep leaf  ← primary 500
//    #2EB374  living leaf
//    #5DCB96  fresh canopy
//    #9FE3BF  young fern
//    #D0F2DF  spring sprout
//    #EDFAF2  dew mist
//    #F5A623  amber sunlight (complement)
// ────────────────────────────────────────────────────────────────────────────

type VariantStyle = {
  base: React.CSSProperties
  hover: React.CSSProperties
  active: React.CSSProperties
  focusOutline: string
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, VariantStyle> = {
  primary: {
    base: {
      background: "linear-gradient(135deg, #0D5230 0%, #1A9458 30%, #2EB374 60%, #5DCB96 80%, #1A9458 100%)",
      backgroundSize: "280% 280%",
      color: "#ffffff",
      boxShadow: "0 4px 18px rgba(26,148,88,0.40), 0 1px 3px rgba(0,0,0,0.14)",
      animation: "btn-aurora 5s ease infinite",
    },
    hover: {
      boxShadow: "0 0 0 4px rgba(93,203,150,0.25), 0 8px 28px rgba(26,148,88,0.52), 0 2px 6px rgba(0,0,0,0.14)",
      animationDuration: "2.5s",
    },
    active: { transform: "scale(0.965)" },
    focusOutline: "#2EB374",
  },

  secondary: {
    base: {
      background: "linear-gradient(135deg, #EDFAF2 0%, #D0F2DF 40%, #C2EDDA 65%, #EDFAF2 100%)",
      backgroundSize: "250% 250%",
      color: "#0D5230",
      boxShadow: "0 1px 4px rgba(26,148,88,0.16), inset 0 1px 0 rgba(255,255,255,0.8)",
      animation: "btn-aurora 7s ease infinite",
    },
    hover: {
      boxShadow: "0 0 0 3px rgba(26,148,88,0.15), 0 6px 20px rgba(26,148,88,0.2), inset 0 1px 0 rgba(255,255,255,0.8)",
      color: "#07361F",
      animationDuration: "3.5s",
    },
    active: { transform: "scale(0.965)" },
    focusOutline: "#1A9458",
  },

  ghost: {
    base: {
      background: "transparent",
      color: "#1F2937",
    },
    hover: {
      background: "linear-gradient(135deg, rgba(13,82,48,0.06) 0%, rgba(26,148,88,0.08) 50%, rgba(93,203,150,0.05) 100%)",
      color: "#0D5230",
      boxShadow: "0 0 0 2px rgba(26,148,88,0.14)",
    },
    active: {
      transform: "scale(0.965)",
      background: "linear-gradient(135deg, rgba(13,82,48,0.10) 0%, rgba(26,148,88,0.12) 100%)",
    },
    focusOutline: "#1A9458",
  },

  destructive: {
    base: {
      background: "linear-gradient(135deg, #7F1D1D 0%, #DC2626 35%, #EA580C 65%, #D4850A 85%, #DC2626 100%)",
      backgroundSize: "260% 260%",
      color: "#ffffff",
      boxShadow: "0 4px 18px rgba(220,38,38,0.38), 0 1px 3px rgba(0,0,0,0.12)",
      animation: "btn-aurora 4s ease infinite",
    },
    hover: {
      boxShadow: "0 0 0 3px rgba(212,133,10,0.22), 0 8px 26px rgba(220,38,38,0.48), 0 2px 6px rgba(0,0,0,0.14)",
      animationDuration: "2s",
    },
    active: { transform: "scale(0.965)" },
    focusOutline: "#EA580C",
  },

  outline: {
    base: {
      // gradient border trick: white fill + gradient border-box
      background: "linear-gradient(#ffffff, #ffffff) padding-box, linear-gradient(135deg, #0D5230, #1A9458, #5DCB96, #F5A623, #5DCB96, #1A9458, #0D5230) border-box",
      backgroundSize: "auto, 300% 300%",
      border: "2px solid transparent",
      color: "#13723F",
      animation: "btn-aurora 4s ease infinite",
      animationPlayState: "paused",
    },
    hover: {
      animationPlayState: "running",
      color: "#0D5230",
      boxShadow: "0 0 0 3px rgba(26,148,88,0.15), 0 4px 16px rgba(26,148,88,0.2)",
    },
    active: { transform: "scale(0.965)" },
    focusOutline: "#2EB374",
  },

  link: {
    base: {
      background: "linear-gradient(135deg, #0D5230 0%, #1A9458 35%, #2EB374 60%, #F5A623 100%)",
      backgroundSize: "200% auto",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      textDecoration: "underline",
      textUnderlineOffset: "4px",
      textDecorationColor: "rgba(26,148,88,0.4)",
      padding: "0",
      height: "auto",
    },
    hover: {
      backgroundPosition: "right center",
      textDecorationColor: "rgba(245,166,35,0.7)",
    },
    active: { backgroundPosition: "right center" },
    focusOutline: "#1A9458",
  },
}

function Spinner({ size }: { size: ButtonProps["size"] }) {
  const dim =
    size === "xs" || size === "sm" ? "w-3.5 h-3.5"
    : size === "xl"               ? "w-5 h-5"
    :                               "w-4 h-4"
  return (
    <svg
      className={cn("animate-spin shrink-0", dim)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      iconLeft,
      iconRight,
      fullWidth = false,
      className,
      style: styleProp,
      children,
      disabled,
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
      onMouseUp,
      ...props
    },
    ref
  ) => {
    const [hovered, setHovered] = React.useState(false)
    const [pressed, setPressed] = React.useState(false)

    const isDisabled = disabled || loading
    const vs = variantStyles[variant]

    const computedStyle: React.CSSProperties = {
      transition: "box-shadow 250ms ease, transform 100ms ease, background-position 400ms ease, color 200ms ease, text-decoration-color 200ms ease",
      ...vs.base,
      ...(hovered && !isDisabled ? vs.hover : {}),
      ...(pressed && !isDisabled ? vs.active : {}),
      ...(isDisabled ? { opacity: 0.5 } : {}),
      ...styleProp,
    }

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading}
        style={computedStyle}
        onMouseEnter={(e) => { setHovered(true); onMouseEnter?.(e) }}
        onMouseLeave={(e) => { setHovered(false); setPressed(false); onMouseLeave?.(e) }}
        onMouseDown={(e) => { setPressed(true); onMouseDown?.(e) }}
        onMouseUp={(e) => { setPressed(false); onMouseUp?.(e) }}
        className={cn(
          "relative inline-flex items-center justify-center",
          "font-semibold whitespace-nowrap select-none rounded-full",
          // AA focus indicator: 3px ring in brand green — visible on both light and dark BG
          "outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2EB374]",
          isDisabled && "cursor-not-allowed pointer-events-none",
          !isDisabled && "cursor-pointer",
          fullWidth && "w-full",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <Spinner size={size} />
            <span className="invisible absolute inset-0 flex items-center justify-center">
              {children}
            </span>
          </>
        ) : (
          <>
            {iconLeft && <span className="shrink-0 flex items-center" aria-hidden="true">{iconLeft}</span>}
            {children}
            {iconRight && <span className="shrink-0 flex items-center" aria-hidden="true">{iconRight}</span>}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = "Button"
