import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/design-system";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HomeServ — Home Repair Services",
  description:
    "Book seepage repair, tiling, grouting, and welding services. Fast, verified, and transparent pricing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-[family-name:var(--font-inter)]"
        style={{ backgroundColor: "var(--color-surface-page)", color: "var(--color-text-primary)" }}>
        <Toaster>{children}</Toaster>
      </body>
    </html>
  );
}
