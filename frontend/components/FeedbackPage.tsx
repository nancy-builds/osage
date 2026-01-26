"use client"

import { useState } from "react"
import { Star, Send } from "lucide-react"
import { Button } from "../components/ui/button"
import { PageHeader } from "../components/layout/PageHeader"
import ContentState from "./layout/ContentState"
import { AlertDescription, Alert, AlertTitle } from "../components/ui/alert"
import Link from "next/link"

interface FeedbackPageProps {
  orderId: string
  onBack: () => void
  onSubmit: (rating: number, comment: string) => Promise<void>
  loading: boolean
  submitted: boolean
  orderPaid: boolean
  checking: boolean
  isLoggedIn: boolean
}
type AlertData = {
  title: string
  description: string
  action?: "login"
}

export default function FeedbackPage({
  orderId,
  onBack,
  onSubmit,
  loading,
  submitted,
  orderPaid,
  checking,
  isLoggedIn,
}: FeedbackPageProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState<{
    title: string
    description: string
  } | null>(null)


  const ratingMeta = [
    null,
    { label: "Poor", image: "/ratings/poor.png" },
    { label: "Fair", image: "/ratings/fair.png" },
    { label: "Good", image: "/ratings/good.png" },
    { label: "Very Good", image: "/ratings/very-good.png" },
    { label: "Excellent", image: "/ratings/excellent.png" },
  ]

  if (checking) {
    return <ContentState isLoading />
  }

const handleSubmit = async () => {
  if (rating === 0) {
    setAlertData({
      title: "Rating required",
      description: "Please select a rating before submitting your feedback.",
    })
    return
  }

  if (!isLoggedIn) {
    setAlertData({
      title: "Please continue after",
      description: "Log in to send your feedback and earn reward points.",
      action: "login", // 👈 semantic, clean
    })
    return
  }
    
  if (!orderPaid) {
    setAlertData({
      title: "Payment required",
      description: "You need to complete the payment before leaving feedback",
    })
    return
  }

  await onSubmit(rating, comment)
}


  return (
    <div className="pb-24 max-w-lg mx-auto">
      {/* Header */}
        <PageHeader
          title="Feedback"
          description="Your opinion helps us create a better experience for everyone"
        />

        <div className="space-y-2">

          {/* Rating Stars */}
          <div className="flex justify-center gap-4 pt-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star className={`w-12 h-12 ${
                    (hoveredRating || rating) >= star ? "fill-primary text-primary" : "text-muted-foreground"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Rating Text */}
          {rating > 0 && ratingMeta[rating] && (
            <div className="flex flex-col items-center">
              <p className="text-center text-sm text-muted-foreground">
                {ratingMeta[rating].label}
              </p>
              <img
                src={ratingMeta[rating].image}
                alt={ratingMeta[rating].label}
                className="h-40 object-contain"
              />
            </div>
          )}

          {/* Comment Box */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Additional Comments (Optional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about the food, service, or atmosphere..."
              className="w-full text-sm px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <div className="flex flex-col gap-3">
            {alertData && (
              <Alert variant="danger">
                <div className="flex items-center gap-1">
                  <AlertTitle>
                    {alertData.title}
                  </AlertTitle>

                  {alertData.action === "login" && (
                    <Link
    href={`/login?redirect=/feedback/${orderId}`}
                      className="text-sm font-medium text-primary hover:underline whitespace-nowrap"
                    >
                      logging in
                    </Link>
                  )}
                </div>

                <AlertDescription>
                  {alertData.description}
                </AlertDescription>
              </Alert>
            )}


            <Button onClick={handleSubmit}
              disabled={loading}
              className="w-full py-5"
            >
              <Send className="w-5 h-5" />
              {loading ? "Submitting..." : "Submit Feedback"}
            </Button>

            {/* Back Button */}
            <Button onClick={onBack}
              className="w-full py-5"
              variant="outline"
            >
              Start New Order
            </Button>
          </div>

      </div>
    </div>
  )
}
