// app/feedback/page.tsx
import Link from "next/link"
import { PageHeader } from "@/components/layout/PageHeader"
import ContentState from "@/components/layout/ContentState"

export default function FeedbackNoOrderPage() {
  return (
    <div className="pb-24 max-w-lg mx-auto">
      {/* Header */}
        <PageHeader
          title="Feedback"
          description="Your opinion helps us create a better experience for everyone"
        />
        <ContentState
          isEmpty={true}
          emptyText="No order found"
          emptyDescription="You can only give feedback after placing an order"
        />
    </div>
  )
}
