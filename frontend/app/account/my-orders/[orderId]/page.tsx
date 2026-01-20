"use client"

import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"

interface Order {
  order_id: string
  status: string
  total: number
  created_at: string
  table_number: number | null
}

interface OrderItem {
  item_id: string
  product_name: string
  quantity: number
  price: string
  subtotal: string
}

export default function OrderDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [items, setItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) return

    Promise.all([
      fetch(`http://localhost:5000/api/order/${orderId}`, {
        credentials: "include",
      }),
      fetch(`http://localhost:5000/api/order/${orderId}/items`, {
        credentials: "include",
      }),
    ])
      .then(async ([orderRes, itemsRes]) => {
        if (!orderRes.ok || !itemsRes.ok) {
          throw new Error("Failed to fetch order details")
        }

        const orderData = await orderRes.json()
        const itemsData = await itemsRes.json()

        setOrder(orderData)
        setItems(itemsData.items)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [orderId])


  if (!order) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
          <Link href="/account/my-orders" className="text-accent">
            Back to Orders
          </Link>
        </div>
      </main>
    )
  }

  const date = new Date(order.created_at)

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-border">
        <Link href="/account/my-orders" className="text-accent hover:opacity-80">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold">
          Order #{order.order_id.slice(0, 8)}
        </h1>
      </div>

      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Order Header */}
        <div className="bg-card border border-border rounded-lg p-6 text-sm">
          <div className="flex items-center justify-between pb-4">
            <p className="text-muted-foreground">Table: {order.table_number ?? "N/A"}</p>
            <span className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary font-medium">
              {order.status}
            </span>
          </div>
          
          <p className="text-muted-foreground">Order Date</p>
          <p className="font-medium">
            {date.toLocaleDateString()} at {date.toLocaleTimeString()}
          </p>
        </div>

        {/* Items */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold mb-4">Ordered Items</h3>

          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.item_id}
                className="flex justify-between items-start text-sm"
              >
                <div>
                  <p className="font-medium">{item.product_name}</p> 
                  <p className="text-muted-foreground">
                     ${item.price}
                  </p>
                </div>
                <div className="flex items-center gap-10">
                  <p className="text-muted-foreground text-xs">
                    × {item.quantity}
                  </p>

                  <p className="font-semibold">
                    ${item.subtotal}
                  </p>
                </div>

              </div>
            ))}
          </div>
          <div className="pt-7">
            <div className="flex justify-between font-semibold text-base pt-2 border-t border-border">
              <span>Total</span>
              <span className="text-primary">${order.total}</span>
            </div>
        </div>
        </div>


      </div>

    </main>
  )
}
