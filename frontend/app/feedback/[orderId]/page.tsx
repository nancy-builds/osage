"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import FeedbackPage from "../../../components/FeedbackPage"
import { API_BASE_URL, API_TIMEOUT } from "../../../constants/api"

export default function Feedback({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const { orderId } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [orderPaid, setOrderPaid] = useState(false)
  const [checking, setChecking] = useState(true)
  const [pointsEarned, setPointsEarned] = useState<number>(0)
  const [totalLoyaltyPoints, setTotalLoyaltyPoints] = useState<number>(0)
const [isLoggedIn, setIsLoggedIn] = useState(false)


  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/order/${orderId}/status`,
          { credentials: "include" }
        )
        if (!res.ok) return
        const data = await res.json()
        setSubmitted(data.submitted)
        setOrderPaid(data.status === "PAID")
      } finally {
        setChecking(false)
      }
    }
    checkStatus()
  }, [orderId])


  const submitFeedback = async (rating: number, comment: string) => {
    setLoading(true)
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/feedback/${orderId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ rating, comment }),
        }
      )
      if (!res.ok) return
      const data = await res.json()
      setSubmitted(true)
      router.push(`/feedback/${orderId}/success`)

      // 🌟 Loyalty updates
      setPointsEarned(data.points_earned ?? 0)
      setTotalLoyaltyPoints(data.user?.loyalty_points ?? totalLoyaltyPoints)


    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true
    const loadLoyaltyPoints = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
          credentials: "include",
        })
        if (res.status === 401) {
          mounted && setIsLoggedIn(false)
          mounted && setTotalLoyaltyPoints(0)
          return
        }

        mounted && setIsLoggedIn(true)

        if (!res.ok) throw new Error("Failed to load profile")

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
    <>
       <FeedbackPage
         orderId={orderId}        // 👈 ADD THIS
        loading={loading}
        submitted={submitted}
        orderPaid={orderPaid} 
        checking={checking}
        onSubmit={submitFeedback}
        onBack={() => router.push("/menu")}
        isLoggedIn={isLoggedIn}   // 👈 add this

    />
</>

  )
}
