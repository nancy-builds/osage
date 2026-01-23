"use client"

import { useContext } from "react"
import MenuPage from "../../components/MenuPage"
import { CartContext } from "../../app/layout"

export default function Menu() {
  const cartContext = useContext(CartContext)

  if (!cartContext) {
    throw new Error("Menu must be used inside CartContext.Provider")
  }

  const { addToCart } = cartContext

  return <MenuPage onAddToCart={addToCart} />
}
