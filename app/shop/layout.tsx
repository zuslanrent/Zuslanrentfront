"use client"

import { createContext, useContext, useState, useCallback, useMemo } from "react"
import type { Product } from "@/lib/shop-data"

export type CartItem = Product & { qty: number }

interface CartContextType {
  items:          CartItem[]
  addToCart:      (p: Product) => void
  updateQty:      (id: number, delta: number) => void
  removeFromCart: (id: number) => void
  total:          number
  count:          number
}

const CartContext = createContext<CartContextType>({
  items: [], addToCart: () => {}, updateQty: () => {}, removeFromCart: () => {},
  total: 0,  count: 0,
})

export const useCart = () => useContext(CartContext)

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addToCart = useCallback((product: Product) =>
    setItems(prev => {
      const ex = prev.find(i => i.id === product.id)
      if (ex) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...product, qty: 1 }]
    }), [])

  const updateQty = useCallback((id: number, delta: number) =>
    setItems(prev =>
      prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
    ), [])

  const removeFromCart = useCallback((id: number) =>
    setItems(prev => prev.filter(i => i.id !== id)), [])

  const total = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items])
  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items])

  return (
    <CartContext.Provider value={{ items, addToCart, updateQty, removeFromCart, total, count }}>
      {children}
    </CartContext.Provider>
  )
}