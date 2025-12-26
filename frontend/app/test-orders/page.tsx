"use client"

import { useEffect, useState } from "react"

interface Order {
  orderId: string
  items: any[]
  totalPrice: number
  tableNumber: number
  status: string
  timestamp: string
}

export default function TestOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log("[v0] Fetching from /api/orders...")

        const response = await fetch("/api/orders")
        console.log("[v0] Response status:", response.status)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const data = await response.json()
        console.log("[v0] Orders data received:", data)

        setOrders(data.orders || [])
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err)
        console.error("[v0] Fetch error:", errorMsg)
        setError(errorMsg)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Orders Diagnostic Test</h1>

      <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
        <p className="text-sm font-mono">
          <strong>Status:</strong> {loading ? "Loading..." : "Ready"}
        </p>
        <p className="text-sm font-mono">
          <strong>Total Orders:</strong> {orders.length}
        </p>
        {error && (
          <p className="text-sm font-mono text-red-600">
            <strong>Error:</strong> {error}
          </p>
        )}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
          <p className="font-semibold text-yellow-800">No orders yet</p>
          <p className="text-sm text-yellow-700 mt-2">
            Complete a payment to create an order. It will appear here and in the Orders tab.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.orderId} className="bg-white border rounded p-4">
              <p className="font-mono text-sm">ID: {order.orderId}</p>
              <p className="text-sm">Table: {order.tableNumber}</p>
              <p className="text-sm">Status: {order.status}</p>
              <p className="text-sm">Total: ${order.totalPrice.toFixed(2)}</p>
              <p className="text-xs text-gray-500">{order.timestamp}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
