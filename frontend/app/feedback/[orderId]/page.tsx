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

      if (res.ok) {
        setSubmitted(true)
        setTimeout(() => router.push("/menu"), 2000)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <FeedbackPage
      loading={loading}
      submitted={submitted}
      orderPaid={orderPaid}
      checking={checking}
      onSubmit={submitFeedback}
      onBack={() => router.push("/menu")}
    />
  )
}
