"use client"

import { Trash2, Minus, Plus, UtensilsCrossed  } from "lucide-react"
import type { CartItem } from "@/types"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface CartPageProps {
  cart: CartItem[]
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
  loading: boolean
  table_number: number

}

export default function CartPage({ cart, onUpdateQuantity, onRemoveItem, loading }: CartPageProps) {
  const router = useRouter()
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = total * 0.1
  const [tableNumber, setTableNumber] = useState<number | null>(null)
  
  const finalTotal = total + tax
const onCheckout = async () => {
  if (cart.length === 0) return

  if (tableNumber === null) {
    alert("Please enter your table number")
    return
  }

  try {
    const res = await fetch("http://localhost:5000/api/order", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        table_number: tableNumber,
        items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      }),
    })

    if (!res.ok) throw new Error("Failed to create order")

    const data = await res.json()

    router.push(`/payment/${data.order_id}`)
  } catch (err) {
    console.error("Checkout error:", err)
    alert("Checkout failed")
  }
}

  return (
    <div className="pb-24 max-w-lg mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-card border-b border-border p-4 z-10">
        <h1 className="text-2xl font-bold text-foreground">Your Order</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {cart.length} item{cart.length !== 1 ? "s" : ""}
        </p>
      </div>

        {/* Table Number */}
        <div className="p-4 space-y-3">
          <label className="block text-sm font-semibold text-foreground mb-2">Table Number</label>
          <input
            type="number"
            min="1"
            value={tableNumber ?? ""}
            onChange={(e) =>
              setTableNumber(
                e.target.value === "" ? null : Number(e.target.value)
              )
            }
            placeholder="Enter table number"
            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 p-4">
          <p className="text-muted-foreground text-center">Your cart is empty</p>
          <p className="text-xs text-muted-foreground mt-2">Add items from the menu to get started</p>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="p-4 space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-3 bg-card border border-border rounded-lg p-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-sm">{item.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">${item.price.toFixed(2)} each</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    className="p-1 hover:bg-muted rounded"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="p-1 hover:bg-muted rounded"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <span className="w-16 text-right font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1 hover:bg-destructive/10 rounded text-destructive ml-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="p-4 space-y-2 border-t border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax (10%)</span>
              <span className="text-foreground">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-bold pt-2 border-t border-border">
              <span>Total</span>
              <span className="text-primary">${finalTotal.toFixed(2)}</span>
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-between text-base font-bold pt-5">
              <button 
              onClick={onCheckout} 
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-accent transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <UtensilsCrossed className="w-5 h-5" />
                {loading ? "Placing..." : "Place Order"}
              </button>
            </div>
          </div>


        </>
      )}
    </div>
  )
}
