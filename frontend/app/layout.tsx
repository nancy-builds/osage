"use client"

import "./globals.css"
import { Analytics } from "@vercel/analytics/next"
import Footer from "../components/Footer"
import Navigation from "../components/Navigation"
import type { CartItem, MenuItem } from "../types"
import { ReactNode, useState, createContext, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SettingsProvider } from "./providers/SettingsProvider"

interface RootLayoutProps {
  children: ReactNode
}

interface CartContextType {
  cart: CartItem[]
  loading: boolean
  addToCart: (item: MenuItem) => void
  updateQuantity: (itemId: string, quantity: number) => void
  removeItem: (itemId: string) => void
}

export const CartContext = createContext<CartContextType | null>(null)

export default function RootLayout({ children }: RootLayoutProps) {
  const [loading, setLoading] = useState(false)

  const [cart, setCart] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const exists = prev.find(c => c.id === item.id)
      return exists
        ? prev.map(c =>
            c.id === item.id
              ? { ...c, quantity: c.quantity + 1 }
              : c
          )
        : [...prev, { ...item, quantity: 1 }]
    })
  }

  const updateQuantity = (itemId: string, quantity: number) => {
  setCart(prev =>
    quantity <= 0
      ? prev.filter(item => item.id !== itemId)
      : prev.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        )
      )
    }

  const removeItem = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId))
  }

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@300;400;500;700&family=Parisienne&family=DM+Serif+Text&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/logo.png" />
        <script src="https://cdn.lordicon.com/lordicon.js"></script>
      </head>

      <body className="font-body antialiased bg-background">
        {/* ✅ Provider PHẢI bọc children */}
        <SettingsProvider>
          <CartContext.Provider
            value={{
              cart,
              loading,
              addToCart,
              updateQuantity,
              removeItem,
            }}
          >
          {children}

          <Navigation
            cartItemCount={cart.reduce(
              (sum, item) => sum + item.quantity,
              0
            )}
          />
          <Footer />
        </CartContext.Provider>
        <Analytics />
        </SettingsProvider>
      </body>
    </html>
  )
}
