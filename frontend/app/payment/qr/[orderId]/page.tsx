"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import QRCode from "react-qr-code"
import { MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"


export default function QRPaymentPage() {
  const { orderId } = useParams()
  const router = useRouter()
  const [qrData, setQrData] = useState<any>(null)
  const [status, setStatus] = useState<string>("")
  const [pointsEarned, setPointsEarned] = useState<number>(0)
  const [totalLoyaltyPoints, setTotalLoyaltyPoints] = useState<number>(0)

  useEffect(() => {
    if (!orderId) return

    fetch(`http://localhost:5000/api/order/${orderId}`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        setPointsEarned(data.points_earned ?? 0)
        setTotalLoyaltyPoints(data.user?.loyalty_points ?? 0)
        setStatus(data.status)
      })
      .catch(console.error)
  }, [orderId])


  const WAITING_PAYMENT = () => {
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
          <p><b>Amount:</b> {qrData.amount} VND</p>
          <p className="text-primary">
            <b>Transfer content:</b> {qrData.transfer_content}
          </p>
        </div>
        </div>
        <div className="flex justify-center">
          <div className="flex items-center space-x-3 border border-gray-300 text-gray-800 px-4 py-1 rounded-md">
            <span className="text-sm font-medium">
              Waiting for restaurant confirmation...
            </span>

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
      fetch("http://localhost:5000/api/auth/profile", {
        credentials: "include",
      })
        .then(res => res.json())
        .then(user => {
          setTotalLoyaltyPoints(user.loyalty_points)
        })
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
        <div className="flex items-center justify-center bg-gray-50 pt-20 px-10">
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
            
            
            <div className="flex flex-col gap-2 mt-10">

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
      <div className="text-center space-y-4 px-6">
        <h1 className="text-xl font-semibold text-gray-800">
          Please wait a moment
        </h1>

        <p className="text-gray-600">
          Your payment QR code is being generated.
        </p>

        <div className="flex justify-center mt-4">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
        </div>
      </div>
    </div>
    )
  }

  // 1️⃣ Load QR
  useEffect(() => {
    fetch(`http://localhost:5000/api/order/payment/qr/${orderId}`, {
      credentials: "include",
    })
    .then(res => res.json())
    .then(data => setQrData(data))
    .catch(err => console.error("Failed to load QR:", err));  }, [orderId])

  // 2️⃣ Poll order status
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/order/${orderId}/status`, { credentials: "include" });
        const data = await res.json();
        setStatus(data.status);

        if (data.status === "PAID") {
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Failed to fetch order status", err);
      }
    }, 3000);

    return () => clearInterval(interval); // cleanup khi unmount
  }, [orderId, router]);

  if (!qrData) return <div>Loading QR...</div>

  return (
    <>
      {status === "PAID" ? (
        <PAID />
      ) : status === "WAITING_PAYMENT" ? (
        <WAITING_PAYMENT />
      ) : (
        <WAITING_QR />
      )}
    </>
  )
}
      