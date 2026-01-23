"use client"

import { usePathname, useRouter, useParams } from "next/navigation"
import { ShoppingCart, MessageSquare, Menu, User, CreditCard, ClipboardList } from "lucide-react"
import { useAuth } from '@/hooks/use-auth'

interface NavigationProps {
  cartItemCount: number
}

type NavItem = {
  id: string
  label: string
  icon: any
  route: string | ((orderId?: string) => string)
  badge?: number
}

export default function Navigation({ cartItemCount }: NavigationProps) {
  const router = useRouter()
  const pathname = usePathname() // current URL path
  const params = useParams()
  const orderId = params?.orderId as string | undefined
  const { user, loading } = useAuth()
  if (loading || !user) return null

  const userRole = user.role.toUpperCase()


  const customerNavItems: NavItem[] = [
    { id: "menu", label: "Menu", icon: Menu, route: "/menu" },
    {
      id: "cart",
      label: "Cart",
      icon: ShoppingCart,
      route: "/cart",
      badge: cartItemCount,
    },
    {
      id: "feedback",
      label: "Feedback",
      icon: MessageSquare,
      route: (orderId?: string) =>
        orderId ? `/feedback/${orderId}` : "/feedback",
    },
    { id: "account", label: "Account", icon: User, route: "/account" },
  ]

  const restaurantNavItems: NavItem[] = [
    {
      id: "menu",
      label: "Menu",
      icon: Menu,
      route: "/menu",
    },
    {
      id: "orders",
      label: "Orders",
      icon: ClipboardList,
      route: "/restaurant/orders",
    },
    {
      id: "account",
      label: "Account",
      icon: User,
      route: "/account",
    },
  ]

  const navItems =
    userRole === "RESTAURANT"
      ? restaurantNavItems
      : customerNavItems

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
      {navItems.map((item) => {
        const resolvedRoute =
          typeof item.route === "function" 
          ? item.route(orderId) 
          : item.route
        const isActive = pathname === resolvedRoute

        return (
          <button
            key={item.id}
            onClick={() => router.push(resolvedRoute)}
            className={`flex-1 flex flex-col items-center justify-center py-2 relative transition-colors ${
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
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
