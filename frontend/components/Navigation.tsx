"use client"

import { usePathname, useRouter } from "next/navigation"
import { ShoppingCart, CreditCard, MessageSquare, Menu } from "lucide-react"

interface NavigationProps {
  cartItemCount: number
}

export default function Navigation({ cartItemCount }: NavigationProps) {
  const router = useRouter()
  const pathname = usePathname() // current URL path

  const navItems = [
    { id: "menu", label: "Menu", icon: Menu, route: "/menu" },
    { id: "cart", label: "Cart", icon: ShoppingCart, route: "/cart", badge: cartItemCount },
    { id: "payment", label: "Pay", icon: CreditCard, route: "/payment" },
    { id: "feedback", label: "Feedback", icon: MessageSquare, route: "/feedback" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.route // check if current page
          return (
            <button
              key={item.id}
              onClick={() => router.push(item.route)}
              className={`flex-1 flex flex-col items-center justify-center py-2 relative transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="relative">
                <item.icon className="w-5 h-5" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-2 -right-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
