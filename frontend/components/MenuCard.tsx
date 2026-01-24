"use client"

import { Plus } from "lucide-react"
import type { MenuItem } from "../types"
import { Button } from "../components/ui/button"
import { useAuth } from '../hooks/use-auth'
import { Badge } from "../components/ui/badge"
import { formatPriceVND } from '../hooks/format-price'


interface MenuCardProps {
  item: MenuItem
  onAddToCart: (item: MenuItem) => void
}

export default function MenuCard({ item, onAddToCart }: MenuCardProps) {
  const { user, loading } = useAuth()
  const userRole = user?.role?.toUpperCase() ?? "GUEST"

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="w-full h-32 bg-[#FDEBD0] flex items-center justify-center">
        <img
          src={item.image_url}
          alt={item.name}
          className="h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex-1">
            <h3 className="font-semibold text-sm text-foreground line-clamp-1">
              {item.name}
            </h3>
            {item.name_japanese && (
              <p className="text-xs text-muted-foreground">
                {item.name_japanese}
              </p>
            )}
          </div>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
          {item.description}
        </p>

        {/* Tags */}
        <div className="flex gap-1 mb-2 flex-wrap">
          {item.vegetarian && (
            <Badge>
              Vegetarian
            </Badge>
          )}
          {item.spicy && (
            <Badge variant={"secondary"}>
              Spicy
            </Badge>
          )}
        </div>

        {/* Price & Button */}
        <div className="flex items-center justify-between">
          <span className="font-bold text-primary">
            {formatPriceVND(item.price)}
          </span>

          {userRole !== "RESTAURANT" && (
            <Button
              onClick={() => onAddToCart(item)}
              size="icon"
              className="h-6 w-6"
            >
              <Plus />
            </Button>

          )}
          
        </div>
      </div>
    </div>
  )
}