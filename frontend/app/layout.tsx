import type React from "react"
import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import Navigation from "@/components/Navigation"


export const metadata: Metadata = {
  title: "Osage - Restaurant Ordering",
  description: "Japanese restaurant ordering system for dining",
  icons: {
    icon: [
      {
        url: "/logo-light.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/logo-dark.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "logo.png",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-logo.png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F9F7F4" },
    { media: "(prefers-color-scheme: dark)", color: "#1F1D1A" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@300;400;500;700&family=Parisienne&family=DM+Serif+Text&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`font-body antialiased`}>
        {children}
        <Analytics />

      </body>
    </html>
  )
}
