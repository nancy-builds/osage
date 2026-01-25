"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Clock, CheckCircle } from "lucide-react";
import { Button } from "../../../../components/ui/button"
import { formatTime } from '../../../../hooks/format-time'
import { API_BASE_URL, API_TIMEOUT } from "../../../../constants/api"
import { formatPriceVND } from "../../../../hooks/format-price";
import { calculateFinalTotal } from "../../../../constants/pricing";
import { PageHeader } from "../../../../components/layout/PageHeader";
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
        `${API_BASE_URL}/api/order/${orderId}`,
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
        `${API_BASE_URL}/api/order/${orderId}/items`,
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
        `${API_BASE_URL}/api/order/payment/confirm/${orderId}`,
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

  if (!order) {
    return(
          <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Spinner */}
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />

        {/* Text */}
        <h2 className="text-base font-semibold text-foreground">
          Loading order
        </h2>

        <p className="text-sm text-muted-foreground max-w-xs">
          Please wait while we retrieve your order details.
        </p>
      </div>
    </div>
    )
  }

return (
  <div className="pb-28 max-w-lg mx-auto min-h-screen">
    {/* Header */}

            <PageHeader
              title="Confirm Payment"
              description="Confirm only after receiving cash from the customer"
            />

    <div className="px-4 pt-1">
      <div className="rounded-2xl shadow-sm p-6 space-y-6">

        {/* Status (directly under title) */}
        {order && (
          <>
            {order.status === "Waiting for Payment" && (
              
              <div className="
                rounded-lg px-4 py-3 text-sm
                bg-yellow-50 text-yellow-700
                dark:bg-yellow-900/30 dark:text-yellow-300
              ">
                <span className="flex items-center gap-1 text-yellow-500">
                  <Clock size={18} /> Waiting for Payment
                </span>
              </div>
              
            )}

            {success && (
              <div className="
                rounded-lg px-4 py-3 text-sm
                bg-green-50 text-green-700
                dark:bg-green-900/30 dark:text-green-300
              ">
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
              <p>Created: {formatTime(order.created_at)}</p>
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
                    className="last:border-b-0"
                  >
                    <td className="p-4 font-medium text-foreground">
                      {item.product_name}
                    </td>

                    <td className="w-1/2 text-muted-foreground text-right text-xs">
                      × {item.quantity}
                    </td>

                    <td className="p-4 text-right font-semibold text-foreground">
                      {formatPriceVND(item.subtotal)}
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
            <span className="text-base font-semibold text-primary">
              Total
            </span>
            <span className="text-base font-bold text-primary">
                      {formatPriceVND(calculateFinalTotal(Math.round(Number(order.total))))}
            </span>
          </div>
        )}

        {/* Action */}
        {order && order.status === "Waiting for Payment" && (
          <Button
            onClick={handleConfirmPayment}
            disabled={loading}
            className="w-full py-5"
          >
            {loading ? "Confirming..." : "Confirm Payment"}
          </Button>
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
