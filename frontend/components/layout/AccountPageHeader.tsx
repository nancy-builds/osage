import { ChevronLeft } from "lucide-react"
import Link from "next/link"

interface AccountPageHeaderProps {
  title: string
  description?: string
  link: string
}

export function AccountPageHeader({ title, description, link }: AccountPageHeaderProps) {
  return (
<div className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4">
  <div className="grid grid-cols-[auto_1fr] items-start gap-4">
    {/* Back icon */}
    <Link
      href={link}
      className="mt-1 text-accent hover:opacity-80"
      aria-label="Go back"
    >
      <ChevronLeft size={24} />
    </Link>

    {/* Title & description (indented like a paragraph) */}
    <div className="text-left">
      <h1 className="text-xl font-bold text-foreground">
        {title}
      </h1>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  </div>
</div>



  )
}
