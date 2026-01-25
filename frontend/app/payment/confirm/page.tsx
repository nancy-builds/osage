import { Clock } from "lucide-react"
import { PageHeader } from "../../../components/layout/PageHeader"
export default function NoOrdersYet() {
  return (
    <div className="pb-28 max-w-lg mx-auto min-h-screen">
        {/* Header */}
        <PageHeader
        title="Confirm Payment"
        description="Confirm only after receiving cash from the customer"
        />
        
        <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
            {/* Icon */}
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Clock className="w-8 h-8 text-muted-foreground" />
            </div>

            {/* Title */}
            <h2 className="text-xl font-semibold mb-2">
                No orders yet
            </h2>

            {/* Description */}
            <p className="text-sm text-muted-foreground max-w-sm mb-6">
                There are currently no customer orders.
                Please wait while customers place their orders.
            </p>

        </div>
    </div>
  )
}
