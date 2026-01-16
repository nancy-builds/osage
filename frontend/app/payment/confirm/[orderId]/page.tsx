"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Clock, CheckCircle } from "lucide-react";


interface Order {
  order_id: string
  status: string
  total: string
  created_at: string
  table_number: string | null
}


interface OrderItem {
  item_id: string
  product_id: string
  quantity: number
  price: string
  subtotal: string
}


export default function ConfirmPaymentPage() {
  const params = useParams()
  const orderId = params?.orderId as string | undefined
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
const [items, setItems] = useState<any[]>([])

  /* Fetch order */
useEffect(() => {
  if (!orderId) return

  const fetchOrder = async () => {
    try {
      console.log("Fetching order:", orderId)

      const res = await fetch(
        `http://localhost:5000/api/order/${orderId}`,
        { credentials: "include" }
      )

      console.log("Response status:", res.status)

      const text = await res.text()
      console.log("Raw response:", text)

      if (!res.ok) {
        throw new Error(text)
      }

      const data = JSON.parse(text)
      setOrder(data)

    } catch (err) {
      console.error("Fetch order failed:", err)
      setError("Failed to load order")
    }
  }

  fetchOrder()
}, [orderId])

/* Fetch order items */
useEffect(() => {
  if (!orderId) return

  const fetchItems = async () => {
    try {
      console.log("Fetching order items:", orderId)

      const res = await fetch(
        `http://localhost:5000/api/order/${orderId}/items`,
        { credentials: "include" }
      )

      const text = await res.text()
      console.log("Items raw response:", text)

      if (!res.ok) {
        throw new Error(text)
      }

      const data = JSON.parse(text)
      setItems(data.items)

    } catch (err) {
      console.error("Fetch items failed:", err)
    }
  }

  fetchItems()
}, [orderId])



  /* Confirm payment */
  const handleConfirmPayment = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch(
        `http://localhost:5000/api/order/payment/confirm/${orderId}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      )
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Payment confirmation failed")
      }

      setOrder((prev) =>
        prev ? { ...prev, status: data.status } : prev
      )

      setSuccess("Payment confirmed successfully")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!order) return <p>Loading order...</p>

return (
  <div className="pb-28 max-w-lg mx-auto bg-gray-50 min-h-screen">
    {/* Header */}
    <div className="sticky top-0 bg-white border-b p-4 z-10">
      <h1 className="text-xl font-bold text-gray-900">
        Confirm Payment
      </h1>
      <p className="text-sm text-gray-500 mt-1">
        Confirm only after receiving cash from the customer
      </p>
    </div>

    <div className="px-4 pt-6">
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">

        {/* Status (directly under title) */}
        {order && (
          <>
            {order.status === "WAITING_PAYMENT" && (
              
              <div className="rounded-lg bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
                <span className="flex items-center gap-1 text-yellow-500">
                  <Clock size={18} /> Waiting for Payment
                </span>
              </div>
              
            )}

            {success && (
              <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                <span className="flex items-center gap-1 text-green-500">
                  <CheckCircle size={18} /> Paid
                </span>
              </div>
            )}
          </>
        )}

        {/* Secondary info */}
        {order && (
          <div className="flex justify-between text-xs text-gray-500">
            <div>
              <p>Table: {order.table_number ?? "-"}</p>
              <p>
                Created: {new Date(order.created_at).toLocaleString("en-US", {
                  month: "long",   // full month name
                  day: "numeric",  // day of the month
                  hour: "numeric", // hour
                  minute: "2-digit", // minute with leading zero
                  hour12: true     // AM/PM
                })}
              </p>
            </div>
          </div>
        )}

        {/* Order items */}
        {items.length > 0 && (
            <table className="w-full text-sm">
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.item_id}
                    className="border-t last:border-b-0"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {item.product_name}
                    </td>

                    <td className="px-4 py-3 text-center text-muted-foreground">
                      × {item.quantity}
                    </td>

                    <td className="px-4 py-3 text-right font-semibold text-foreground">
                      $ {item.subtotal}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

        )}

        <hr />

        {/* Total */}
        {order && (
          <div className="flex justify-between items-center">
            <span className="text-base font-semibold text-gray-700">
              Total
            </span>
            <span className="text-base font-bold text-gray-900">
              $ {order.total}
            </span>
          </div>
        )}

        {/* Action */}
        {order && order.status === "WAITING_PAYMENT" && (
          <button
            onClick={handleConfirmPayment}
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold
                       hover:bg-accent transition-colors disabled:opacity-50"
          >
            {loading ? "Confirming..." : "Confirm Payment"}
          </button>
        )}

        {/* Error */}
        {error && (
          <p className="text-sm text-red-600 text-center">
            {error}
          </p>
        )}

        {/* Success message */}
        {success && (
          <p className="text-xs text-gray-400 text-center">
            {success}
          </p>
        )}
      </div>
    </div>
  </div>
)

}
