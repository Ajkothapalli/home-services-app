import * as React from "react"
import { cn } from "@/lib/utils"

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  name?: string
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
  status?: "online" | "offline" | "busy"
}

const sizeMap = {
  xs:  { px: 24,  text: "text-[9px]",  ring: "w-2 h-2",   border: "border" },
  sm:  { px: 32,  text: "text-xs",     ring: "w-2.5 h-2.5", border: "border" },
  md:  { px: 40,  text: "text-sm",     ring: "w-3 h-3",   border: "border-2" },
  lg:  { px: 56,  text: "text-lg",     ring: "w-3.5 h-3.5", border: "border-2" },
  xl:  { px: 72,  text: "text-2xl",    ring: "w-4 h-4",   border: "border-2" },
  "2xl": { px: 96, text: "text-4xl",   ring: "w-5 h-5",   border: "border-[3px]" },
}

const statusColor = {
  online:  { bg: "var(--color-success-500)", border: "#fff" },
  offline: { bg: "var(--color-neutral-400)", border: "#fff" },
  busy:    { bg: "var(--color-error-500)",   border: "#fff" },
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

// Deterministic leaf-green gradient per name
function nameToGradient(name: string) {
  const gradients = [
    "linear-gradient(135deg, #0D5230, #2EB374)",
    "linear-gradient(135deg, #13723F, #5DCB96)",
    "linear-gradient(135deg, #07361F, #1A9458)",
    "linear-gradient(135deg, #1A9458, #9FE3BF)",
    "linear-gradient(135deg, #0D5230, #F5A623)",
    "linear-gradient(135deg, #2EB374, #D0F2DF)",
  ]
  const i = name.charCodeAt(0) % gradients.length
  return gradients[i]
}

export function Avatar({ src, name, size = "md", status, className, style, ...props }: AvatarProps) {
  const { px, text, ring, border } = sizeMap[size]

  return (
    <div
      className={cn("relative inline-flex shrink-0", className)}
      style={{ width: px, height: px, ...style }}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name ?? "avatar"}
          className="w-full h-full rounded-full object-cover"
          style={{ boxShadow: "0 0 0 2px var(--color-border-default)" }}
        />
      ) : (
        <div
          className={cn("w-full h-full rounded-full flex items-center justify-center font-bold text-white", text)}
          style={{ background: nameToGradient(name ?? "U") }}
          aria-label={name}
        >
          {getInitials(name ?? "?")}
        </div>
      )}

      {status && (
        <span
          className={cn("absolute bottom-0 right-0 rounded-full", ring, border)}
          style={{
            backgroundColor: statusColor[status].bg,
            borderColor: statusColor[status].border,
          }}
          aria-label={status}
        />
      )}
    </div>
  )
}

// ── AvatarGroup ───────────────────────────────────────────────────────────────
export interface AvatarGroupProps {
  avatars: Pick<AvatarProps, "src" | "name">[]
  size?: AvatarProps["size"]
  max?: number
}

export function AvatarGroup({ avatars, size = "md", max = 4 }: AvatarGroupProps) {
  const { px } = sizeMap[size]
  const visible = avatars.slice(0, max)
  const overflow = avatars.length - max

  return (
    <div className="flex items-center" style={{ paddingLeft: px * 0.3 }}>
      {visible.map((av, i) => (
        <div key={i} style={{ marginLeft: -(px * 0.3), zIndex: visible.length - i }}>
          <Avatar
            {...av}
            size={size}
            style={{ boxShadow: "0 0 0 2px white" }}
          />
        </div>
      ))}
      {overflow > 0 && (
        <div
          className="rounded-full flex items-center justify-center font-semibold text-white text-xs"
          style={{
            width: px,
            height: px,
            marginLeft: -(px * 0.3),
            background: "var(--color-neutral-600)",
            boxShadow: "0 0 0 2px white",
            zIndex: 0,
            fontSize: px < 36 ? 9 : 12,
          }}
        >
          +{overflow}
        </div>
      )}
    </div>
  )
}
