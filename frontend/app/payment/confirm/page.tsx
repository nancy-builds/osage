import { Clock } from "lucide-react"
import { PageHeader } from "../../../components/layout/PageHeader"
import { EmptyState } from "../../../components/account/empty-state"
export default function NoOrdersYet() {
  return (
    <div className="pb-28 max-w-lg mx-auto min-h-screen">
        {/* Header */}
        <PageHeader
        title="Confirm Payment"
        description="Confirm only after receiving cash from the customer"
        />
        
      <div className="max-w-2xl mx-auto">
            <EmptyState
            icon={Clock}
            title="No Orders Yet"
            description="There are currently no customer orders. Please wait while customers place their orders."
            />
        </div>
    </div>
  )
}
