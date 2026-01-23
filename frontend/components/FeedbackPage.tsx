"use client"

import { useState } from "react"
import { Star, Send } from "lucide-react"
import { Button } from "../components/ui/button"
import { PageHeader } from "../components/layout/PageHeader"


interface FeedbackPageProps {
  onBack: () => void
  onSubmit: (rating: number, comment: string) => Promise<void>
  loading: boolean
  submitted: boolean
  orderPaid: boolean
  checking: boolean
}

export default function FeedbackPage({
  onBack,
  onSubmit,
  loading,
  submitted,
  orderPaid,
  checking,
}: FeedbackPageProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")

  const ratingMeta = [
    null,
    { label: "Poor", image: "/ratings/poor.png" },
    { label: "Fair", image: "/ratings/fair.png" },
    { label: "Good", image: "/ratings/good.png" },
    { label: "Very Good", image: "/ratings/very-good.png" },
    { label: "Excellent", image: "/ratings/excellent.png" },
  ]

  if (checking) {
    return <p className="text-center mt-10">Loading...</p>
  }

  if (!orderPaid) {
    return (
      <div className="pb-24 max-w-lg mx-auto">
        {/* Header */}
        <PageHeader
          title="Feedback"
          description="Your opinion helps us create a better experience for everyone"
        />

        <div className="text-center mt-20">
          <h2 className="text-lg font-semibold">Order not completed</h2>
          <p className="text-muted-foreground">
            You can leave feedback after payment
          </p>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-screen max-w-lg mx-auto">
        <div className="text-center">
          <div className="text-4xl mb-4">✨</div>
          <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
          <p className="text-muted-foreground">
            Your feedback has been recorded
          </p>
          <p className="text-xs text-muted-foreground mt-4">
            Redirecting...
          </p>
        </div>
      </div>
    )
  }

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Please select a rating")
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

      <div className="p-3 space-y-6">
        {/* Rating Stars */}
        <div className="flex justify-center gap-4 pt-7">
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
            className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            rows={4}
          />
        </div>

        {/* Submit Button */}
        <div className="flex flex-col gap-2">
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
