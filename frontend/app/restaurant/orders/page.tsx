"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ClipboardList } from "lucide-react"
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatTime } from '@/hooks/format-time'
import { PageHeader } from "@/components/layout/PageHeader"
import { apiFetch } from "@/lib/api"
import { formatPriceVND } from "@/hooks/format-price"
import { API_BASE_URL, API_TIMEOUT } from "@/constants/api"
import Link from "next/link"
type Order = {
  order_id: string
  status: string
  total: number
  table_number?: number
  created_at: string
}

export default function RestaurantOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const router = useRouter()
  const [errorId, setErrorId] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)


useEffect(() => {
  let mounted = true

  const loadRestaurantOrders = async () => {
    try {
      const res = await apiFetch("/order/restaurant/orders")

      if (res.status === 401 || res.status === 403) {
        mounted && setOrders([])
        return
      }

      if (!res.ok) {
        throw new Error("Failed to load restaurant orders")
      }

      const data = await res.json()

      mounted &&
        setOrders(
          data.map((o: any) => ({
            order_id: o.order_id ?? o.id,
            status: o.status,
            total: o.total,
            table_number: o.table_number,
            created_at: o.created_at,
          }))
        )
    } catch (err) {
      console.error(err)
      mounted && setOrders([])
    }
  }

  loadRestaurantOrders()

  return () => {
    mounted = false
  }
}, [])


  // 🔹 Mark order as DONE
  const markOrderDone = async (orderId: string) => {
    try {
      setLoadingId(orderId)

      const res = await fetch(
        `${API_BASE_URL}/order/${orderId}/done`,
        {
          method: "POST",
          credentials: "include",
        }
      )

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to update order")
      }

      // ✅ Update UI locally (no refetch needed)
      setOrders(prev =>
        prev.map(order =>
          order.order_id === orderId
            ? { ...order, status: "done" }
            : order
        )
      )
    } catch (err: any) {
  setErrorId(orderId)
  setErrorMsg(err.message)
}
 finally {
        setLoadingId(null)
      }
  }

  if (orders.length === 0) {
    return (
      <div className="pb-28 max-w-lg mx-auto bg-gray-50 min-h-screen">
        {/* Header */}
        <PageHeader
          title="Orders"
          description="All customer orders are listed here for your review"
        />
          <div className="flex flex-col items-center justify-center h-[70vh] text-center">
            <ClipboardList className="w-10 h-10 text-muted-foreground mb-4" />
            <h2 className="text-lg font-semibold">No orders yet</h2>
            <p className="text-sm text-muted-foreground">
              Waiting for customers to place orders.
            </p>
          </div>
      </div>
    )
  }

  return (
    <div className="pb-28 max-w-lg mx-auto bg-gray-50 min-h-screen">
      <PageHeader
        title="Orders"
        description="All customer orders are listed here for your review"
      />

    <div className="max-w-lg mx-auto p-4 space-y-3">
      {orders.map(order => (
          <Link
            key={order.order_id}
            href={`/payment/confirm/${order.order_id}`}
            className="block"
          >
      <Card
        key={order.order_id}
        className="cursor-pointer hover:bg-muted transition"
      >
        <CardContent className="px-10 relative">
          {/* Status badge */}
          <Badge
            className="absolute right-10"
            variant={
              order.status.toLowerCase() === "paid"
                ? "default"
                : "secondary"
            }
          >
            {order.status}
          </Badge>

          {/* Main info */}
          <div className="flex flex-col text-xs text-gray-500 space-y-1">
            <p className="text-primary font-semibold text-sm pb-2">
              Table: {order.table_number ?? "—"}
            </p>
            <p>Created: {formatTime(order.created_at)}</p>
            <p className="text-muted-foreground">
              Total: {formatPriceVND(order.total)}
            </p>
          </div>

          {/* Action */}
          {order.status !== "Done" && (
            <div className="mt-4">
              {order.status.toLowerCase() !== "done" && (
                <Button
                  size="sm"
                  className="mt-4 w-full"
                  disabled={loadingId === order.order_id}
                  onClick={(e) => {
                    e.stopPropagation()
                    markOrderDone(order.order_id)
                  }}
                >
                  {loadingId === order.order_id
                    ? "Processing..."
                    : "Mark as Done"}
                </Button>
              )}

              {errorId === order.order_id && errorMsg && (
                <p className="text-xs text-red-500 mt-2">
                  {errorMsg}
                </p>
              )}
              </div>

          )}
        </CardContent>
      </Card>
</Link>

      ))}
    </div>

    </div>
  )
}
