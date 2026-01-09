"use client"

import { useContext } from "react"
import PaymentPage from "@/components/PaymentPage"
import { CartContext } from "@/app/layout"
import type { Order } from "@/types"
import { useRouter } from "next/navigation"

export default function Payment() {
  const cartContext = useContext(CartContext)
  const router = useRouter()

  if (!cartContext) {
    throw new Error("Payment page must be used inside CartContext.Provider")
  }

  const { cart } = cartContext

  const handleOrderComplete = (order: Order) => {

    // 👉 Sau này bạn có thể:
    // - clear cart
    // - redirect sang trang success
    // - lưu order history

    router.push("/feedback") // hoặc "/success"
  }

  return (
    <PaymentPage
      cart={cart}
      onOrderComplete={handleOrderComplete}
    />
  )
}
