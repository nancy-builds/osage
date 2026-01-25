"use client"

import { use } from "react"
import { PageHeader } from "../../../../components/layout/PageHeader"
import { Button } from "../../../../components/ui/button"
import { useRouter } from "next/navigation"

export default function FeedbackSuccess({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  // ✅ unwrap params (required in client component)
  const { orderId } = use(params)
  const router = useRouter()

  return (
        <div className="pb-24 max-w-lg mx-auto">
          {/* Header */}
            <PageHeader
              title="Feedback"
              description="Your opinion helps us create a better experience for everyone"
            />
<div className="flex items-center justify-center min-h-[70vh] px-4">
  <div className="w-full max-w-md rounded-2xl border border-border bg-background p-8 shadow-sm text-center">
    
    {/* Icon */}
    <div className="mx-auto mb-1 flex items-center justify-center">
        <img
            src="/ratings/bow.png"
            alt="feedback success"
            className="h-30 object-contain"
        />
    </div>

    {/* Title */}
    <h1 className="text-xl font-semibold text-foreground">
      Thank you for your feedback
    </h1>

    {/* Points info */}
    <p className="mt-4 text-sm text-muted-foreground">
      Your loyalty points have been added to your account
    </p>

    {/* Order ID */}
    <div className="mt-1 rounded-lg bg-muted py-2">
      <p className="text-xs text-muted-foreground">Order reference</p>
      <p className="text-xs text-foreground">
        {orderId}
      </p>
    </div>

    {/* Action */}
    <Button
      onClick={() => router.push("/account/reward")}
      className="w-full mt-6 py-5"
    >
      View Rewards
    </Button>
    
  </div>
</div>

        </div>
  )
}
