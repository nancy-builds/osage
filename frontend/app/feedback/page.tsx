// app/feedback/page.tsx
import Link from "next/link"

export default function FeedbackNoOrderPage() {
  return (
        <div className="pb-24 max-w-lg mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-card border-b border-border p-4 z-10">
        <h1 className="text-2xl font-bold text-foreground">Rate Your Experience</h1>
      </div>

    <div className="flex items-center justify-center px-4 min-h-[60vh]">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-semibold">No order found</h1>

        <p className="text-gray-500">
          You can only give feedback after placing an order
        </p>

        <Link
          href="/menu"
          className="inline-block w-1/2 bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:bg-accent transition-colors disabled:opacity-50 "
        >
          Order now
        </Link>
      </div>
    </div>
    </div>
  )
}
