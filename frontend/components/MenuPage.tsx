"use client"

import { useState, useMemo } from "react"
import MenuCard from "./MenuCard"
import type { MenuItem } from "@/types"
import { Search } from "lucide-react"

const MENU_ITEMS: MenuItem[] = [
  // Appetizers
  {
    id: "1",
    name: "Edamame",
    nameJapanese: "枝豆",
    description: "Steamed soybeans with sea salt",
    price: 5.99,
    category: "Appetizers",
    vegetarian: true,
  },
  {
    id: "2",
    name: "Gyoza",
    nameJapanese: "餃子",
    description: "Pan-fried dumplings with pork and vegetables",
    price: 7.99,
    category: "Appetizers",
  },
  {
    id: "3",
    name: "Tempura",
    nameJapanese: "てんぷら",
    description: "Lightly battered and fried shrimp and vegetables",
    price: 8.99,
    category: "Appetizers",
    vegetarian: false,
  },
  // Main Courses
  {
    id: "4",
    name: "Teriyaki Chicken Bowl",
    nameJapanese: "チキン照り焼き丼",
    description: "Grilled chicken with teriyaki sauce over rice",
    price: 12.99,
    category: "Main Courses",
  },
  {
    id: "5",
    name: "Salmon Sashimi",
    nameJapanese: "サーモン刺身",
    description: "Fresh sliced salmon, 5 pieces",
    price: 14.99,
    category: "Main Courses",
  },
  {
    id: "6",
    name: "Tonkatsu",
    nameJapanese: "とんかつ",
    description: "Breaded pork cutlet with panko crust",
    price: 13.99,
    category: "Main Courses",
  },
  {
    id: "7",
    name: "Vegetable Ramen",
    nameJapanese: "ベジタブルラーメン",
    description: "Noodles in rich broth with vegetables",
    price: 11.99,
    category: "Main Courses",
    vegetarian: true,
  },
  // Sushi
  {
    id: "8",
    name: "California Roll",
    nameJapanese: "カリフォルニアロール",
    description: "Crab, avocado, cucumber - 6 pieces",
    price: 9.99,
    category: "Sushi",
  },
  {
    id: "9",
    name: "Spicy Tuna Roll",
    nameJapanese: "スパイシーツナロール",
    description: "Spicy tuna with cucumber - 6 pieces",
    price: 10.99,
    category: "Sushi",
    spicy: 3,
  },
  {
    id: "10",
    name: "Dragon Roll",
    nameJapanese: "ドラゴンロール",
    description: "Shrimp tempura, cucumber, avocado - 6 pieces",
    price: 12.99,
    category: "Sushi",
  },
  // Beverages
  {
    id: "11",
    name: "Sake",
    nameJapanese: "酒",
    description: "Traditional rice wine - 6oz",
    price: 8.99,
    category: "Beverages",
  },
  {
    id: "12",
    name: "Green Tea",
    nameJapanese: "緑茶",
    description: "Hot green tea",
    price: 2.99,
    category: "Beverages",
    vegetarian: true,
  },
  {
    id: "13",
    name: "Mango Smoothie",
    nameJapanese: "マンゴースムージー",
    description: "Fresh mango smoothie",
    price: 5.99,
    category: "Beverages",
    vegetarian: true,
  },
]

interface MenuPageProps {
  onAddToCart: (item: MenuItem) => void
}

export default function MenuPage({ onAddToCart }: MenuPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = Array.from(new Set(MENU_ITEMS.map((item) => item.category)))

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = !selectedCategory || item.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  return (
    <div className="pb-24 max-w-lg mx-auto">
      {/* Header */}
      <div className="top-0 border-border pt-4 ps-3">
        {/* Header Row */}
        <div className="flex items-center gap-3 mt-4 me-5">
          <img src="/logo-no-background.png" alt="Osage" className="h-10 w-auto"/>

          <div className="relative flex-1 pb-1">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <input type="text" placeholder="Search" value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 py-2 border rounded-lg
                        focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </div>


      <div className="sticky top-0 bg-card p-4">
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-1.5 rounded-full whitespace-nowrap text-sm transition-colors ${
              selectedCategory === null ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full whitespace-nowrap text-sm transition-colors ${
                selectedCategory === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="p-4 grid grid-cols-2 gap-3">
        {filteredItems.map((item) => (
          <MenuCard key={item.id} item={item} onAddToCart={onAddToCart} />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">No items found</p>
        </div>
      )}
    </div>
  )
}
