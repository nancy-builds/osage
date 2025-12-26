"use client"

import { useState } from "react"
import { CreditCard, QrCode } from "lucide-react"
import type { CartItem, Order } from "@/types"

interface PaymentPageProps {
  cart: CartItem[]
  onOrderComplete: (order: Order) => void
}

export default function PaymentPage({ cart, onOrderComplete }: PaymentPageProps) {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "qr" | null>(null)
  const [loading, setLoading] = useState(false)
  const [tableNumber, setTableNumber] = useState("")

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = total * 0.1
  const finalTotal = total + tax

  const handlePayment = async () => {
    if (!paymentMethod) {
      alert("Please select a payment method")
      return
    }
    if (!tableNumber) {
      alert("Please enter your table number")
      return
    }

    setLoading(true)

    try {
      // Send order to Flask backend
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          totalPrice: finalTotal,
          paymentMethod,
          tableNumber,
        }),
      })

      if (!response.ok) throw new Error("Payment failed")

      const orderData = await response.json()

      const order: Order = {
        id: orderData.orderId || Date.now().toString(),
        items: cart,
        totalPrice: finalTotal,
        timestamp: Date.now(),
        status: "confirmed",
        tableNumber,
      }

      onOrderComplete(order)
    } catch (error) {
      console.error("Payment error:", error)
      alert("Payment failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen max-w-lg mx-auto">
        <p className="text-muted-foreground">Your cart is empty</p>
      </div>
    )
  }

  return (
    <div className="pb-24 max-w-lg mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-card border-b border-border p-4 z-10">
        <h1 className="text-2xl font-bold text-foreground">Payment</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Table Number */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Table Number</label>
          <input
            type="number"
            min="1"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            placeholder="Enter table number"
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Order Summary */}
        <div className="bg-background border border-border rounded-lg p-4 space-y-2">
          <h3 className="font-semibold text-foreground mb-3">Order Summary</h3>
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {item.name} x{item.quantity}
              </span>
              <span className="text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-border pt-2 mt-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Tax (10%)</span>
              <span className="text-foreground">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-base">
              <span>Total</span>
              <span className="text-primary">${finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">Payment Method</label>
          <div className="space-y-2">
            <button
              onClick={() => setPaymentMethod("card")}
              className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                paymentMethod === "card"
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background hover:border-primary/50"
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <div className="text-left">
                <p className="font-semibold text-foreground">Credit/Debit Card</p>
                <p className="text-xs text-muted-foreground">Visa, Mastercard, Amex</p>
              </div>
            </button>

            <button
              onClick={() => setPaymentMethod("qr")}
              className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                paymentMethod === "qr"
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background hover:border-primary/50"
              }`}
            >
              <QrCode className="w-5 h-5" />
              <div className="text-left">
                <p className="font-semibold text-foreground">QR Code</p>
                <p className="text-xs text-muted-foreground">WeChat Pay, Alipay</p>
              </div>
            </button>
          </div>
        </div>

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-accent transition-colors disabled:opacity-50"
        >
          {loading ? "Processing..." : "Complete Payment"}
        </button>
      </div>
    </div>
  )
}
