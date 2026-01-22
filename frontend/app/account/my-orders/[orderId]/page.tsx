"use client"

import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { formatTime } from '@/hooks/format-time'
import { apiFetch } from "@/lib/api"
import ContentState from "@/components/layout/ContentState"
import { formatPriceVND } from "@/hooks/format-price"

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

  let mounted = true

  const loadOrderDetails = async () => {
    try {
      const [orderRes, itemsRes] = await Promise.all([
        apiFetch(`/order/${orderId}`),
        apiFetch(`/order/${orderId}/items`),
      ])

      // Auth / permission handling
      if (orderRes.status === 401 || itemsRes.status === 401) {
        mounted && setOrder(null)
        mounted && setItems([])
        return
      }

      if (orderRes.status === 403 || itemsRes.status === 403) {
        console.warn("Access denied to this order")
        mounted && setOrder(null)
        mounted && setItems([])
        return
      }

      if (!orderRes.ok || !itemsRes.ok) {
        throw new Error("Failed to fetch order details")
      }

      const orderData = await orderRes.json()
      const itemsData = await itemsRes.json()

      mounted && setOrder(orderData)
      mounted && setItems(itemsData.items)
    } catch (err) {
      console.error(err)
    } finally {
      mounted && setLoading(false)
    }
  }

  loadOrderDetails()

  return () => {
    mounted = false
  }
}, [orderId])

  if (!order) {
    return <ContentState isEmpty emptyText="Order details not found" emptyDescription="This order may no longer be available or does not exist." />
  }

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
  <div className="flex items-start justify-between">
    {/* Left column */}
    <div className="flex flex-col gap-1">
      <p className="text-muted-foreground font-medium">
        Table: {order.table_number ?? "N/A"}
      </p>
      <p className="text-muted-foreground">
        Order Date: {formatTime(order.created_at)}
      </p>
    </div>

    {/* Status - top right */}
    <span className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary font-medium">
      {order.status}
    </span>
  </div>
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
                     {formatPriceVND(item.price)}
                  </p>
                </div>
                <div className="flex items-center gap-5">
                  <p className="text-muted-foreground text-xs">
                    × {item.quantity}
                  </p>

                  <p className="font-semibold">
                    {formatPriceVND(item.subtotal)}
                  </p>
                </div>

              </div>
            ))}
          </div>
          <div className="pt-7">
            <div className="flex justify-between font-semibold text-base pt-2 border-t border-border">
              <span>Total</span>
              <span className="text-primary">{formatPriceVND(order.total)}</span>
            </div>
        </div>
        </div>


      </div>

    </main>
  )
}
