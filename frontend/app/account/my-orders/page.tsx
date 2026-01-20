"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ShoppingBag, ChevronLeft } from "lucide-react"
import { EmptyState } from "@/components/account/empty-state"
import {Badge} from "@/components/ui/badge"

export interface Order {
  order_id: string
  status: string
  total: number
  created_at: string
  table_number: number | null
  items?: number
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("http://localhost:5000/api/order/my-orders", {
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text()
          console.error("Fetch orders failed:", res.status, text)
          throw new Error("Failed to fetch orders")
        }
        return res.json()
      })
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-border">
        <Link href="/account" className="text-accent hover:opacity-80">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold text-foreground">My Orders</h1>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto">
        {loading ? (
          <p className="p-6 text-muted-foreground">Loading orders...</p>
        ) : orders.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="No Orders Yet"
            description="Start placing orders from our restaurant menu to see them here."
            action={{ label: "Browse Menu", href: "/menu" }}
          />
        ) : (
          <div className="space-y-3 p-6">
            {orders.map((order) => (
              <Link
                key={order.order_id}
                href={`/account/my-orders/${order.order_id}`}
                className="block bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {/* Top row */}
                    <div className="flex items-center gap-3 mb-2">
                      <ShoppingBag size={20} className="text-accent" />
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleString()}
                      </p>
                    </div>

                    {/* Order ID */}
                    <p className="font-medium text-foreground">
                      Order #{order.order_id.slice(0, 8)}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 mt-3">
                      {order.items !== undefined && (
                        <span className="text-sm text-muted-foreground">
                          {order.items} items
                        </span>
                      )}

                      <Badge
                        variant={
                          order.status.toLowerCase() === 'paid'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {order.status}
                      </Badge>

                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="font-semibold text-primary">
                      ${order.total}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
