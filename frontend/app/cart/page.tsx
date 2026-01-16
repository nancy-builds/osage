"use client"

import { useContext } from "react"
import CartPage from "@/components/CartPage"
import { CartContext } from "@/app/layout"

export default function Cart() {
  const cartContext = useContext(CartContext)

  if (!cartContext) {
    throw new Error("Cart must be used inside CartContext.Provider")
  }
  
  const { cart, updateQuantity, removeItem, loading } = cartContext

  return (
    <CartPage
      cart={cart}
      onUpdateQuantity={updateQuantity}
      onRemoveItem={removeItem}
      loading={loading}
    />
  )
}
