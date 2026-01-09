"use client"

import { useState, useEffect } from "react"
import MenuPage from "@/components/MenuPage"
import CartPage from "@/components/CartPage"
import PaymentPage from "@/components/PaymentPage"
import FeedbackPage from "@/components/FeedbackPage"
import Navigation from "@/components/Navigation"
import type { MenuItem, CartItem } from "@/types"

export default function Home() {
  const [currentPage, setCurrentPage] = useState<"menu" | "cart" | "payment" | "feedback">("menu")
  const [cart, setCart] = useState<CartItem[]>([])
  const [orders, setOrders] = useState<any[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id)
      if (existing) {
        return prev.map((c) => (c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c))
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((c) => c.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
    } else {
      setCart((prev) => prev.map((c) => (c.id === itemId ? { ...c, quantity } : c)))
    }
  }

  const clearCart = () => {
    setCart([])
  }

  return (
    <main className="min-h-screen bg-background">
      {currentPage === "menu" && <MenuPage onAddToCart={addToCart} />}
      {currentPage === "cart" && (
        <CartPage cart={cart} onUpdateQuantity={updateQuantity} onRemoveItem={removeFromCart} />
      )}
      {currentPage === "payment" && (
        <PaymentPage
          cart={cart}
          onOrderComplete={(order) => {
            setOrders([...orders, order])
            clearCart()
            setCurrentPage("feedback")
          }}
        />
      )}
      {currentPage === "feedback" && (
        <FeedbackPage
          onBack={() => {
            setCurrentPage("menu")
            clearCart()
          }}
        />
      )}

      <Navigation currentPage={currentPage}
        onNavigate={(page) => {
          if (page === "payment" && cart.length === 0) {
            alert("Your cart is empty!")
            return
          }
          setCurrentPage(page)
        }}
        cartItemCount={cart.length}
      />
    </main>
  )
}
