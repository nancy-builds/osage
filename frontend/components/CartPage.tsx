"use client"

import { Trash2, Minus, Plus } from "lucide-react"
import type { CartItem } from "@/types"

interface CartPageProps {
  cart: CartItem[]
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
}

export default function CartPage({ cart, onUpdateQuantity, onRemoveItem }: CartPageProps) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = total * 0.1
  const finalTotal = total + tax

  return (
    <div className="pb-24 max-w-lg mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-card border-b border-border p-4 z-10">
        <h1 className="text-2xl font-bold text-foreground">Your Order</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {cart.length} item{cart.length !== 1 ? "s" : ""}
        </p>
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
          </div>
        </>
      )}
    </div>
  )
}
