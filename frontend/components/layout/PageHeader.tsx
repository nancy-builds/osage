interface PageHeaderProps {
  title: string
  description?: string
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
<div className="sticky top-0 z-50 border-b p-4 bg-background">
      <h1 className="text-xl font-bold">
        {title}
      </h1>

      {description && (
        <p className="text-sm mt-1">
          {description}
        </p>
      )}
    </div>
  )
}
