"use client"

import { useRouter } from "next/navigation"
import FeedbackPage from "@/components/FeedbackPage"

export default function Feedback() {
  const router = useRouter()

  return (
    <FeedbackPage onBack={() => router.push("/menu")} />
  )
}
