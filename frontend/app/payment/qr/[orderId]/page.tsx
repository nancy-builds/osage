"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import QRCode from "react-qr-code"
import { MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatPriceVND } from '@/hooks/format-price'
import { apiFetch } from "@/lib/api"
import { AlertDescription, Alert, AlertTitle } from "@/components/ui/alert"
import ContentState from "@/components/layout/ContentState"

export default function QRPaymentPage() {
  const { orderId } = useParams()
  const router = useRouter()
  const [qrData, setQrData] = useState<any>(null)
  const [status, setStatus] = useState<string>("")
  const [pointsEarned, setPointsEarned] = useState<number>(0)
  const [totalLoyaltyPoints, setTotalLoyaltyPoints] = useState<number>(0)
const [showTableAlert, setShowTableAlert] = useState(false)

  useEffect(() => {
    if (!orderId) return

    let mounted = true

    const loadOrder = async () => {
      try {
        const res = await apiFetch(`/order/${orderId}`)

        if (res.status === 401 || res.status === 403) {
          mounted && setPointsEarned(0)
          mounted && setTotalLoyaltyPoints(0)
          mounted && setStatus(null)
          return
        }

        if (!res.ok) {
          throw new Error("Failed to load order")
        }

        const data = await res.json()

        mounted && setPointsEarned(data.points_earned ?? 0)
        mounted && setTotalLoyaltyPoints(data.user?.loyalty_points ?? 0)
        mounted && setStatus(data.status)
      } catch (err) {
        console.error(err)
      }
    }

    loadOrder()

    return () => {
      mounted = false
    }
  }, [orderId])


  const WAITING_PAYMENT = () => {
    if (!qrData) {
      return <WAITING_QR />
    }
    return (
      <div className="pb-24 max-w-lg mx-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-4 z-10">
          <h1 className="text-2xl font-bold text-foreground">Scan to Pay</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Use your banking app to scan the QR code below
          </p>
        </div>
        <div className="p-6 flex flex-col items-center">
          <div className="p-3 border border-gray-300 rounded-xl mb-4">
            <QRCode value={qrData.qr_string} size={180} />
          </div>

        <div className="text-sm text-left space-y-1">
          <p><b>Account:</b> {qrData.bank.account_number}</p>
          <p><b>Name:</b> {qrData.bank.account_name}</p>
          <p><b>Amount:</b> {formatPriceVND(qrData.amount)}</p>
          <p className="text-primary">
            <b>Transfer content:</b> {qrData.transfer_content}
          </p>
        </div>

          <div className="flex items-center space-x-3 px-4 pt-5 rounded-md text-xs">
            <p> Waiting for restaurant confirmation...</p>

            <lord-icon src="https://cdn.lordicon.com/xwpcjash.json"
                trigger="loop" colors="primary:#dc143c"
                style={{ width: '30px', height: '30px' }}
            ></lord-icon>
            
          </div>
        </div>
      </div>
    )
  }

  const PAID = () => {
    useEffect(() => {
      let mounted = true

      const loadLoyaltyPoints = async () => {
        try {
          const res = await apiFetch("/auth/profile")

          if (res.status === 401) {
            mounted && setTotalLoyaltyPoints(0)
            return
          }

          if (!res.ok) {
            throw new Error("Failed to load profile")
          }

          const user = await res.json()
          mounted && setTotalLoyaltyPoints(user.loyalty_points ?? 0)
        } catch (err) {
          console.error(err)
          mounted && setTotalLoyaltyPoints(0)
        }
      }

      loadLoyaltyPoints()

      return () => {
        mounted = false
      }
    }, [])
    
    return (
      <div className="pb-24 max-w-lg mx-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-4 z-10">
          <h1 className="text-2xl font-bold text-foreground">Scan to Pay</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Use your banking app to scan the QR code below
          </p>
        </div>
        {/* Card */}
        <div className="flex items-center justify-center bg-gray-50 py-10">
          <div className="bg-white rounded-xl shadow-sm max-w-md w-full p-8 text-center space-y-5">
            
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            {/* Main Message */}
            <h1 className="text-xl font-semibold text-gray-800">
              Payment Successful
            </h1>
            <p className="text-gray-600 text-sm">
              Your order is confirmed and is being prepared.
            </p>

            {/* Loyalty Points */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-green-700 font-medium">
                🎉 Loyalty Points Earned
              </p>

              <div className="text-3xl font-bold text-green-600 mt-1">
                +{pointsEarned}
              </div>

              <p className="text-xs text-green-700 mt-1">
                Total points: <span className="font-semibold">{totalLoyaltyPoints}</span>
              </p>
            </div>
            
            
            <div className="flex flex-col gap-2 mt-6">

              {/* Optional Button */}
              <Button
                onClick={() => router.push(`/feedback/${orderId}`)}
                className="w-full py-5"
              >
                <MessageSquare className="h-5 w-5" />
                Leave Feedback
              </Button>
              
              {/* Instructions */}
              <div className="text-xs text-gray-500">
                <p>Please take a moment to leave us your feedback for better experience
                  <span className="font-medium text-gray-800"> we truly appreciate it.</span>
                </p>
              </div>
            </div>


          </div>
        </div>
      </div>
    )
  }

  const WAITING_QR = () => {
    return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <ContentState  isEmpty={true} emptyText="Generating QR Code" emptyDescription="Your payment QR code will appear in a moment"/>
    </div>
    )
  }

  // 1️⃣ Load QR
  useEffect(() => {
    if (!orderId) return

    let mounted = true

    const loadQr = async () => {
      try {
        const res = await apiFetch(`/order/payment/qr/${orderId}`)

        if (res.status === 401 || res.status === 403) {
          mounted && setQrData(null)
          return
        }

        if (!res.ok) {
          throw new Error("Failed to load QR")
        }

        const data = await res.json()
        mounted && setQrData(data)
      } catch (err) {
        console.error("Failed to load QR:", err)
      }
    }

    loadQr()

    return () => {
      mounted = false
    }
  }, [orderId])

  // 2️⃣ Poll order status
  useEffect(() => {
    if (!orderId) return

    let mounted = true
    let interval: NodeJS.Timeout

    const pollStatus = async () => {
      try {
        const res = await apiFetch(`/order/${orderId}/status`)

        if (res.status === 401 || res.status === 403) {
          clearInterval(interval)
          return
        }

        if (!res.ok) {
          throw new Error("Failed to fetch order status")
        }

        const data = await res.json()
        mounted && setStatus(data.status)

        if (data.status === "PAID") {
          clearInterval(interval)
        }
      } catch (err) {
        console.error("Failed to fetch order status:", err)
      }
    }

    interval = setInterval(pollStatus, 3000)
    pollStatus() // run immediately

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [orderId])

  useEffect(() => {
    if (qrData === null) {
      setShowTableAlert(true)
    } else {
      setShowTableAlert(false)
    }
  }, [qrData])


  return (
    <>
      {status === "Paid" ? (
        <PAID />
      ) : status === "Waiting for Payment" ? (
        <WAITING_PAYMENT />
      ) : (
        <WAITING_QR />
      )}
          {showTableAlert && (
            <Alert variant={"danger"}>
              <AlertTitle>Table Number Required</AlertTitle>
              <AlertDescription>
                Enter your table number to continue with your order.          
                </AlertDescription>
            </Alert>
          )}
    </>
    
  )
}
      