"use client"

import "./globals.css"
import { Analytics } from "@vercel/analytics/next"
import Footer from "../components/Footer"
import Navigation from "../components/Navigation"
import type { CartItem, MenuItem } from "../types"
import { ReactNode, useState, createContext } from "react"
import { useRouter } from "next/navigation"
import { apiFetch } from "../lib/api"
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
  checkout: () => Promise<void>
}

export const CartContext = createContext<CartContextType | null>(null)

export default function RootLayout({ children }: RootLayoutProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [currentPage, setCurrentPage] =
    useState<"menu" | "cart" | "feedback" | "account">("menu")

  const [cart, setCart] = useState<CartItem[]>([])

  const handleNavigate = (page: typeof currentPage) => {
    setCurrentPage(page)
  }

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

  const checkout = async () => {
    if (cart.length === 0) return

    setLoading(true)

    try {
      const res = await apiFetch("/order", {
        method: "POST",
        body: JSON.stringify({
          items: cart.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      })
      if (res.status === 401) {
        router.push("/login")
        return
      }
      if (!res.ok) {
        throw new Error("Checkout failed")
      }

      setCart([])
      alert("Order placed successfully!")
    } catch (err) {
      console.error(err)
      alert("Failed to place order")
    } finally {
      setLoading(false)
    }
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
              checkout,
            }}
          >
          {children}

          <Navigation
            currentPage={currentPage}
            onNavigate={handleNavigate}
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
