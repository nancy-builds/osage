import { Loader2 } from "lucide-react"

type ContentStateProps = {
  isLoading?: boolean
  isEmpty?: boolean
  emptyText?: string
  emptyDescription?: string
  loadingText?: string
  children: React.ReactNode
}

export default function ContentState({
  isLoading = false,
  isEmpty = false,
  emptyText = "No items found",
  loadingText = "Loading...",
  emptyDescription = "",
  children,
}: ContentStateProps) {
  if (isLoading) {
    return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground animate-pulse">
            {loadingText}
        </p>
    </div>

    )
  }

  if (isEmpty) {
    return (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-muted-foreground text-center font-medium">{emptyText}</p>
          <p className="text-xs text-muted-foreground mt-2">{emptyDescription}</p>
        </div>
    )
  }

  return <>{children}</>
}
