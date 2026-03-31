import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ backgroundColor: "var(--color-neutral-50)" }}>
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
        style={{ background: "linear-gradient(135deg, #EDFAF2, #D0F2DF)" }}
      >
        <span className="text-4xl font-bold" style={{ color: "var(--color-brand-600)" }}>?</span>
      </div>

      <h1 className="text-5xl font-bold mb-3" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sora)" }}>
        404
      </h1>
      <p className="text-xl font-semibold mb-2" style={{ color: "var(--color-text-primary)" }}>
        Page not found
      </p>
      <p className="text-base mb-8 max-w-sm" style={{ color: "var(--color-text-secondary)" }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <div className="flex gap-3">
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 rounded-full font-semibold text-white transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB374] focus-visible:ring-offset-2"
          style={{ background: "linear-gradient(135deg, #0D5230, #2EB374)", boxShadow: "0 4px 18px rgba(26,148,88,0.3)" }}
        >
          Go Home
        </Link>
        <Link
          href="/customer/services"
          className="inline-flex items-center px-6 py-3 rounded-full font-semibold transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB374] focus-visible:ring-offset-2"
          style={{
            backgroundColor: "var(--color-neutral-0)",
            border: "1.5px solid var(--color-border-default)",
            color: "var(--color-text-primary)",
          }}
        >
          Browse Services
        </Link>
      </div>
    </div>
  )
}
