"use client"

import { useEffect, useState } from "react"
import { ClipboardList } from "lucide-react"
import { Card, CardContent } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { PageHeader } from "../../../components/layout/PageHeader"
import { apiFetch } from "../../../lib/api"
import { formatTime } from "../../../hooks/format-time"
import { formatPriceVND } from "../../../hooks/format-price"
import { calculateFinalTotal } from "../../../constants/pricing"
import ContentState from "../../../components/layout/ContentState"

type Order = {
  order_id: string
  status: string
  total: number
  table_number: number | null
  created_at: string
}

export default function RestaurantOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const loadOrders = async () => {
      try {
        const res = await apiFetch("/order/restaurant/orders")

        if (!res.ok) throw new Error("Failed to load orders")

        const data = await res.json()

        mounted &&
          setOrders(
            data.map((o: any) => ({
              order_id: o.order_id ?? o.id,
              status: o.status,
              total: Math.round(Number(o.total) || 0),
              table_number: o.table_number,
              created_at: o.created_at,
            }))
          )
      } catch (err) {
        console.error(err)
        mounted && setOrders([])
      } finally {
        mounted && setLoading(false)
      }
    }

    loadOrders()

    return () => {
      mounted = false
    }
  }, [])

  // ✅ DONE orders only, newest first
  const doneOrders = orders
    .filter((order) => order.status === "Done")
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )


  return (
    <div className="pb-28 max-w-lg mx-auto min-h-screen">
      <PageHeader
        title="Completed Orders"
        description="Orders that have been successfully completed"
      />

    <div className="max-w-lg mx-auto p-4 space-y-3">
        {loading && (
          <ContentState isLoading />
        )}

        {!loading && doneOrders.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center">
                <ClipboardList className="w-10 h-10 text-muted-foreground mb-4" />
                <h2 className="text-lg font-semibold">No orders yet</h2>
                <p className="text-sm text-muted-foreground">
                    No completed orders yet.
                </p>
            </div>
        )}

        {doneOrders.map((order) => (
          <Card key={order.order_id} className="cursor-pointer hover:bg-muted transition">
            <CardContent className="relative">
                <Badge variant="default" className="absolute right-10">Done</Badge>
                <div className="flex flex-col text-xs text-gray-500 space-y-1">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <ClipboardList 
                            className="w-4 h-4 text-primary" 
                            />
                            <p className="text-primary font-semibold text-sm">
                                {order.table_number
                                ? `Table: ${order.table_number}`
                                : "Takeaway"}
                            </p>
                        </div>
                    </div>
                    <p>Created: {formatTime(order.created_at)}</p>
                    <p className="text-muted-foreground">
                    Total: {formatPriceVND(calculateFinalTotal(order.total))}
                    </p>
                </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
    </div>
  )
}
