"use client"

import { Plus } from "lucide-react"
import type { MenuItem } from "@/types"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from '@/hooks/use-auth'


interface MenuCardProps {
  item: MenuItem
  onAddToCart: (item: MenuItem) => void
}

export default function MenuCard({ item, onAddToCart }: MenuCardProps) {
  const { user, loading } = useAuth()
  if (loading || !user) return null

  const userRole = user.role.toUpperCase()

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
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
            Vegetarian
          </span>
        )}
        {item.spicy && (
          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
            Spicy
          </span>
        )}
      </div>

      {/* Price & Button */}
      <div className="flex items-center justify-between">
        <span className="font-bold text-primary">
          ${item.price.toFixed(2)}
        </span>

        {userRole === "CUSTOMER" && (
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