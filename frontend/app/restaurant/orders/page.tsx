"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ClipboardList } from "lucide-react"

type Order = {
  order_id: string
  status: string
  total: number
  table_number?: number
  created_at: string
}

export default function RestaurantOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const router = useRouter()

  useEffect(() => {
    fetch("http://localhost:5000/api/order/restaurant/orders", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(setOrders)
  }, [])

  if (orders.length === 0) {
    return (
      <div className="pb-28 max-w-lg mx-auto bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 z-10">
        <h1 className="text-xl font-bold text-gray-900">
            Orders
        </h1>
        <p className="text-sm text-gray-500 mt-1">
            All orders that the customers placed will be displayed here
        </p>
        </div>
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
    <div className="max-w-lg mx-auto p-4 space-y-3">
      {orders.map(order => (
        <button
          key={order.order_id}
          onClick={() =>
            router.push(`/payment/confirm/${order.order_id}`)
          }
          className="w-full text-left border rounded-lg p-4 hover:bg-muted transition"
        >
          <div className="flex justify-between">
            <span className="font-medium">
              Table {order.table_number ?? "—"}
            </span>
            <span className="text-sm text-muted-foreground">
              {new Date(order.created_at).toLocaleTimeString()}
            </span>
          </div>

          <div className="flex justify-between mt-2 text-sm">
            <span>Status: {order.status}</span>
            <span className="font-semibold">
              ${order.total.toFixed(2)}
            </span>
          </div>
        </button>
      ))}
    </div>
  )
}
