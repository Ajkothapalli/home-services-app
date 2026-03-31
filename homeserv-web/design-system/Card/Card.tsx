import * as React from "react"
import { cn } from "@/lib/utils"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "elevated" | "outlined" | "filled" | "interactive"
  padding?: "none" | "sm" | "md" | "lg"
}

const paddingClasses = {
  none: "",
  sm:   "p-4",
  md:   "p-6",
  lg:   "p-8",
}

export function Card({
  variant = "elevated",
  padding = "md",
  className,
  style,
  children,
  ...props
}: CardProps) {
  const baseStyle: React.CSSProperties = {
    borderRadius: "var(--radius-xl)",
    backgroundColor: "var(--color-surface-card)",
    transition: "box-shadow 250ms ease, transform 200ms ease",
  }

  const variantStyle: React.CSSProperties =
    variant === "elevated"
      ? { boxShadow: "var(--shadow-md)", border: "1px solid var(--color-border-default)" }
      : variant === "outlined"
        ? { border: "1.5px solid var(--color-border-default)", boxShadow: "none" }
        : variant === "filled"
          ? { backgroundColor: "var(--color-neutral-50)", border: "1px solid var(--color-border-default)", boxShadow: "none" }
          : { // interactive
              boxShadow: "var(--shadow-sm)",
              border: "1.5px solid var(--color-border-default)",
              cursor: "pointer",
            }

  return (
    <div
      className={cn(
        "overflow-hidden",
        paddingClasses[padding],
        variant === "interactive" && "hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5",
        className
      )}
      style={{ ...baseStyle, ...variantStyle, ...style }}
      {...props}
    >
      {children}
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────
export function CardHeader({ className, style, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("px-6 py-4 flex items-start justify-between gap-3", className)}
      style={{ borderBottom: "1px solid var(--color-border-default)", ...style }}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardBody({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-6 py-5", className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ className, style, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("px-6 py-4 flex items-center gap-3", className)}
      style={{ borderTop: "1px solid var(--color-border-default)", ...style }}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardMedia({
  src,
  alt = "",
  height = 200,
  className,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement> & { height?: number }) {
  return (
    <div
      className={cn("w-full overflow-hidden bg-[var(--color-neutral-100)]", className)}
      style={{ height }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="w-full h-full object-cover" {...props} />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-[var(--color-text-disabled)] text-sm">
          No image
        </div>
      )}
    </div>
  )
}
