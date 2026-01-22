"use client"

import { useState } from "react"
import { CreditCard, QrCode } from "lucide-react"
import { useRouter } from 'next/navigation'
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/layout/PageHeader"
import { formatPriceVND } from "@/hooks/format-price"
import { API_BASE_URL, API_TIMEOUT } from "@/constants/api"
import ContentState from "@/components/layout/ContentState"
import { AlertDescription, Alert, AlertTitle } from "./ui/alert"

interface PaymentPageProps {
  orderId: string
  total: string
  status: string
  items: OrderItem[]
}
interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
}

export default function PaymentPage({ orderId }: PaymentPageProps) {
  const router = useRouter()
const [showTableAlert, setShowTableAlert] = useState(false)
const [alertMessage, setAlertMessage] = useState("")

  const [paymentMethod, setPaymentMethod] =
    useState<"card" | "qr" | null>(null)

  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState<number | null>(null)
  const [order, setOrder] = useState<PaymentPageProps | null>(null)
  const taxRate = 0.1
  const tax = total ? total * taxRate : 0
  const finalTotal = total ? total + tax : 0

  // 🔹 Fetch order total from backend
  useEffect(() => {
    if (!orderId) return

    fetch(`${API_BASE_URL}/order/${orderId}`, {
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load order")
        return res.json()
      })
      .then((data: PaymentPageProps) => {
        setTotal(Number(data.total))
        setOrder(data)
      })
      .catch((err) => {
        console.error(err)
        alert("Unable to load order")
      })
  }, [orderId])


  const handlePayment = async () => {
if (!paymentMethod) {
  setAlertMessage("Please select a payment method.")
  setShowTableAlert(true)
  return
}

if (paymentMethod === "card") {
  setAlertMessage(
    "Card payment is not available yet. Please use QR payment to continue."
  )
  setShowTableAlert(true)
  return
}

    setLoading(true)

    try {
      router.push(`/payment/qr/${orderId}`)
    } 
    catch (err) {
      console.error("Payment error:", err)
      alert("Payment failed. Please try again.")
    } 
    finally {
      setLoading(false)
    }
  }

  if (total === null) {
    return (
      <ContentState isLoading/>
    )
  }

  return (
    <div className="pb-24 max-w-lg mx-auto">
      {/* Header */}
      <PageHeader
        title="Payment"
        description="Review order and complete the payment to place your order"
      />

      <div className="p-4 space-y-3">

        {/* Order Summary */}
        <div className="bg-background border border-border rounded-lg p-4 space-y-2">
          <h3 className="font-semibold text-foreground mb-3">Order Summary</h3>
          
          {order?.items?.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {item.name} x{item.quantity}
              </span>
              <span className="text-foreground">
                {(item.price * item.quantity).toFixed(2)}
                </span>
            </div>
          ))}
          <div className="border-t border-border pt-2 mt-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">{formatPriceVND(total)} </span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Tax (10%)</span>
              <span className="text-foreground">{formatPriceVND(tax)} </span>
            </div>
            <div className="flex justify-between font-bold text-base">
              <span>Total</span>
              <span className="text-primary">{formatPriceVND(finalTotal)} </span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">Payment Method</label>
          <div className="space-y-2">
            <button
              onClick={() => setPaymentMethod("card")}
              className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                paymentMethod === "card"
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background hover:border-primary/50"
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <div className="text-left">
                <p className="font-semibold text-foreground">Credit/Debit Card</p>
                <p className="text-xs text-muted-foreground">Visa, Mastercard, Amex</p>
              </div>
            </button>

            <button
              onClick={() => setPaymentMethod("qr")}
              className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                paymentMethod === "qr"
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background hover:border-primary/50"
              }`}
            >
              <QrCode className="w-5 h-5" />
              <div className="text-left">
                <p className="font-semibold text-foreground">QR Code</p>
                <p className="text-xs text-muted-foreground">WeChat Pay, Alipay</p>
              </div>
            </button>
          </div>
        </div>
        {showTableAlert && (
  <Alert variant="danger">
    <AlertTitle>Action required</AlertTitle>
    <AlertDescription>{alertMessage}</AlertDescription>
  </Alert>
)}


        {/* Payment Button */}
        <Button
          onClick={handlePayment}
          disabled={loading}
          className="w-full py-5"

        >
          {loading ? "Processing..." : "Complete Payment"}
        </Button>
      </div>
    </div>
  )
}
