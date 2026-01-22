"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ShoppingBag, ChevronLeft, Utensils, Clock } from "lucide-react"
import { EmptyState } from "@/components/account/empty-state"
import { Badge } from "@/components/ui/badge"
import { formatTime } from '@/hooks/format-time'
import { formatPriceVND } from '@/hooks/format-price'
import { apiFetch } from "@/lib/api"
import { AccountPageHeader } from "@/components/layout/AccountPageHeader"
import ContentState from "@/components/layout/ContentState"

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
    let mounted = true

    const loadOrders = async () => {
      try {
        const res = await apiFetch("/order/my-orders")

        if (res.status === 401) {
          mounted && setOrders([])
          return
        }

        if (!res.ok) {
          const text = await res.text()
          console.error("Fetch orders failed:", res.status, text)
          throw new Error("Failed to fetch orders")
        }

        const data = await res.json()
        mounted && setOrders(data)
      } catch (err) {
        console.error(err)
      } finally {
        mounted && setLoading(false)
      }
    }

    loadOrders()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <AccountPageHeader link="/account" title="My Orders" description="Revisit your past orders and see what you’ve enjoyed so far" />

      {/* Content */}
      <div className="max-w-2xl mx-auto">
        {loading ? (
          <ContentState isLoading/>
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
                className="block bg-card border border-border rounded-lg p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  {/* Left column */}
                  <div className="space-y-1">
                    {/* Order ID */}
                    <p className="text-xs text-muted-foreground">
                      Order #{order.order_id.slice(0, 8)}
                    </p>
                    
                    {/* Table */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Utensils size={14} />
                      <span>Table {order.table_number ?? "N/A"}</span>
                    </div>

                    {/* Created date */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock size={14} />
                      <span>{formatTime(order.created_at)}</span>
                    </div>

                  </div>

                  {/* Right column */}
                  <div className="flex flex-col items-end gap-5">
                    <Badge
                      variant={
                        order.status.toLowerCase() === "paid"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {order.status}
                    </Badge>

                    <p className="font-semibold text-primary">
                      {formatPriceVND(order.total)} 
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
