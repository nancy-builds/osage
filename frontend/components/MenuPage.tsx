"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import MenuCard from "./MenuCard"
import type { MenuItem } from "../types"
import { Search, User } from "lucide-react"
import { apiFetch } from "../lib/api"
import ContentState from "../components/layout/ContentState"

interface MenuPageProps {
  onAddToCart: (item: MenuItem) => void
}

export default function MenuPage({ onAddToCart }: MenuPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [items, setItems] = useState<MenuItem[]>([])
const [isLoading, setIsLoading] = useState(true)


useEffect(() => {
  let mounted = true

  const loadMenu = async () => {
    try {
      mounted && setIsLoading(true) // ✅ START loading

      const res = await apiFetch("/menu/products")

      if (res.status === 401 || res.status === 403) {
        mounted && setItems([])
        return
      }

      if (!res.ok) {
        const text = await res.text()
        throw new Error(`HTTP ${res.status}: ${text}`)
      }

      const data = await res.json()

      if (!Array.isArray(data)) {
        console.error("Menu API did not return an array:", data)
        mounted && setItems([])
        return
      }

      // 🔑 normalize backend → frontend shape
      const normalized: MenuItem[] = data.map(p => ({
        ...p,
        image: p.image_url,
      }))

      mounted && setItems(normalized)
    } catch (err) {
      console.error("Menu fetch error:", err)
      mounted && setItems([])
    } finally {
      mounted && setIsLoading(false) // ✅ END loading
    }
  }

  loadMenu()

  return () => {
    mounted = false
  }
}, [])

  const categories = Array.from(
      new Set(items.map((item) => item.category)))

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory =
        !selectedCategory || item.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [items, searchQuery, selectedCategory])

  return (
    <div className="pb-24 max-w-lg mx-auto">
      
      <div className="flex items-center gap-4 my-3 mx-9">
        <img src="/logo-no-background.png" alt="Osage" className="h-9 w-auto"/>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input type="text" placeholder="Search menu, drinks..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"/>
        </div>

      </div>

      <div className="sticky top-0 bg-card py-2 px-5">
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

      <ContentState
        isLoading={isLoading}
        isEmpty={!isLoading && filteredItems.length === 0}
        emptyText="No items found"
      >
        {/* Menu Grid */}
        <div className="p-4 grid grid-cols-2 gap-3">
          {filteredItems.map((item) => (
            <MenuCard 
            key={item.id} 
            item={item} 
            onAddToCart={onAddToCart} 
            />
          ))}
        </div>
      </ContentState>
    </div>
  )
}
