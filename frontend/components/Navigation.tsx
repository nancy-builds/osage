"use client"

import { ShoppingCart, CreditCard, MessageSquare, Menu } from "lucide-react"

interface NavigationProps {
  currentPage: "menu" | "cart" | "payment" | "feedback"
  onNavigate: (page: "menu" | "cart" | "payment" | "feedback") => void
  cartItemCount: number
}

export default function Navigation({ currentPage, onNavigate, cartItemCount }: NavigationProps) {
  const navItems = [
    { id: "menu", label: "Menu", icon: Menu },
    { id: "cart", label: "Cart", icon: ShoppingCart, badge: cartItemCount },
    { id: "payment", label: "Pay", icon: CreditCard },
    { id: "feedback", label: "Feedback", icon: MessageSquare },
  ] as const

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as any)}
            className={`flex-1 flex flex-col items-center justify-center py-2 relative transition-colors ${
              currentPage === item.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs mt-1">{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="absolute top-0 right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </nav>
  )
}
