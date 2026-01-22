"use client"

import { Trash2, Minus, Plus, UtensilsCrossed  } from "lucide-react"
import type { CartItem } from "@/types"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useParams } from "next/navigation"
import { PageHeader } from "@/components/layout/PageHeader"
import { formatPriceVND } from '@/hooks/format-price'
import { apiFetch } from "@/lib/api"
import ContentState from "@/components/layout/ContentState"
import { AlertDescription, Alert, AlertTitle } from "./ui/alert"

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
const [showTableAlert, setShowTableAlert] = useState(false)

  const finalTotal = total + tax

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

    let data: any = null
    try {
      data = await res.json()
    } catch {
      // ignore empty body
    }

    if (!res.ok) {
      console.error("Order error:", data)
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
    <div className="pb-24 max-w-lg mx-auto">
      {/* Header */}

        <PageHeader
          title="Your Order"
          description={`${cart.length} item${cart.length !== 1 ? "s" : ""}`}
        />

        {/* Table Number */}
        <div className="p-4 space-y-3">
          <label className="block text-sm font-semibold text-foreground mb-2">
            Table Number
          </label>

          <input
            type="number"
            min="1"
            value={tableNumber ?? ""}
            onChange={(e) => {
              const value = e.target.value
              setTableNumber(value === "" ? null : Number(value))
              setShowTableAlert(false) // clear alert on typing
            }}
            placeholder="Enter table number"
            className="w-full px-4 py-2 bg-background border border-border rounded-lg
              focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />

          {showTableAlert && (
            <Alert variant={"danger"}>
              <AlertTitle>Table Number Required</AlertTitle>
              <AlertDescription>
                Enter your table number to continue with your order.          
                </AlertDescription>
            </Alert>
          )}
        </div>

                
        <ContentState
          isEmpty={cart.length === 0}
          emptyText="No items found"
          emptyDescription="Add items from the menu to get started"
        >

          {/* Cart Items */}
          <div className="p-4 space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-3 bg-card border border-border rounded-lg p-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-sm">{item.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{formatPriceVND(item.price)} each</p>
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
                  <span className="w-16 text-right font-semibold">
                    {formatPriceVND(item.price * item.quantity)} 
                  </span>
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
              <span className="text-foreground">{formatPriceVND(total)} </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax (10%)</span>
              <span className="text-foreground">{formatPriceVND(tax)} </span>
            </div>
            <div className="flex justify-between text-base font-bold pt-2 border-t border-border">
              <span>Total</span>
              <span className="text-primary">{formatPriceVND(finalTotal)} </span>
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-between text-base font-bold pt-5">
              <Button 
                onClick={onCheckout} 
                disabled={loading}
                className="w-full py-5"
                >
                  <UtensilsCrossed className="w-5 h-5" />
                  {loading ? "Placing..." : "Place Order"}
              </Button>
            </div>
          </div>


        </ContentState>
      {/* )} */}
    </div>
  )
}
