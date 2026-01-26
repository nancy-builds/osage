"use client"

import { useContext, useState } from "react"
import CartPage from "../../components/CartPage"
import { CartContext } from "../../app/layout"
import { useRouter } from "next/navigation"
import { apiFetch } from "../../lib/api"

export default function Cart() {
  const cartContext = useContext(CartContext)
  const router = useRouter()

  if (!cartContext) {
    throw new Error("Cart must be used inside CartContext.Provider")
  }
  
  const { cart, updateQuantity, removeItem, loading } = cartContext
const [tableNumber, setTableNumber] = useState<number | null>(null)
  const [showTableAlert, setShowTableAlert] = useState(false)

  const onCheckout = async () => {
    if (cart.length === 0) return

    if (!tableNumber) {
      setShowTableAlert(true)
      return
    }

    try {
      const res = await apiFetch("/order", {
        method: "POST",
        body: JSON.stringify({
          table_number: tableNumber,
          items: cart.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      })

      if (res.status === 401) {
        alert("Please log in to place an order")
        return
      }

      const data = await res.json()

      if (!res.ok) {
        alert(data?.error || "Failed to create order")
        return
      }

      router.push(`/payment/${data.order_id}`)
    } catch (err) {
      console.error("Checkout error:", err)
      alert("Network error. Please try again.")
    }
  }

  return (
    <CartPage
      cart={cart}
      onUpdateQuantity={updateQuantity}
      onRemoveItem={removeItem}
      onCheckout={onCheckout}
      tableNumber={tableNumber}
      setTableNumber={setTableNumber}
      showTableAlert={showTableAlert}
      loading={loading}
      setShowTableAlert={setShowTableAlert}
    />
  )
}
