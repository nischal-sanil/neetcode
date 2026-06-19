import type { Metadata } from "next"
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google"

import { AppNav } from "@/components/shell/AppNav"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import "./globals.css"

// Body / UI text — neutral, high legibility at small sizes.
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
})

// Display / wordmark — geometric character without being loud.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
})

// Code / numbers — used by the editor chrome and test panel.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "Neetpath 150",
    template: "%s · Neetpath 150",
  },
  description:
    "A focused, local workspace for working through the NeetCode 150 — a visual topic roadmap and an in-browser solve loop.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <TooltipProvider>
          <AppNav />
          <main className="flex flex-1 flex-col">{children}</main>
        </TooltipProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}
