export interface MenuItem {
  id: string
  name: string
  nameJapanese?: string
  description: string
  price: number
  category: string
  image?: string
  ingredients?: string[]
  spicy?: number
  vegetarian?: boolean
}

export interface CartItem extends MenuItem {
  quantity: number
}

export interface Order {
  id: string
  items: CartItem[]
  totalPrice: number
  timestamp: number
  status: "pending" | "confirmed" | "ready"
  tableNumber?: string
}

export interface Feedback {
  orderId: string
  rating: number
  comment: string
  timestamp: number
}
