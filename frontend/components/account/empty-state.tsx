import type { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    href: string
  }
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="text-accent mb-4">
        <Icon size={48} />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">{description}</p>
      {action && (
        <a
          href={action.href}
          className="px-6 py-2 bg-accent text-accent-foreground font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          {action.label}
        </a>
      )}
    </div>
  )
}
