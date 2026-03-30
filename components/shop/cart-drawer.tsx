"use client"

import { memo } from "react"
import {
  ShoppingCart, X, ShoppingBag, Minus, Plus,
  Trash2, Truck, ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useCart, type CartItem } from "@/app/shop/layout"

interface Props {
  open:    boolean
  onClose: () => void
}

export const CartDrawer = memo(function CartDrawer({ open, onClose }: Props) {
  const { items, updateQty, removeFromCart, total, count } = useCart()

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      <div className={cn(
        "fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-background border-l border-border shadow-2xl flex flex-col transition-transform duration-300",
        open ? "translate-x-0" : "translate-x-full"
      )}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <h2 className="font-bold text-base">Сагс</h2>
            {count > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground font-bold">
                {count}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-muted transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16 text-muted-foreground">
              <ShoppingBag className="h-12 w-12 mb-3 opacity-25" />
              <p className="font-medium">Сагс хоосон байна</p>
              <p className="text-sm mt-1">Бараа нэмж эхлээрэй</p>
            </div>
          ) : (
            items.map((item: CartItem) => (
              <div key={item.id} className="flex gap-3 p-3 rounded-xl border border-border/60 bg-muted/20">
                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-muted">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="block w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold leading-snug line-clamp-2">{item.name}</p>
                  <p className="text-primary font-bold text-sm mt-0.5">
                    {(item.price * item.qty).toLocaleString()}₮
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex items-center rounded-full border border-border/60 overflow-hidden">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="p-1 hover:bg-muted transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-2.5 text-xs font-semibold">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="p-1 hover:bg-muted transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border px-5 py-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Нийт дүн</span>
              <span className="font-bold text-lg">{total.toLocaleString()}₮</span>
            </div>
            {total >= 100000 && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                <Truck className="h-3.5 w-3.5" /> Үнэгүй хүргэлт авах боломжтой!
              </div>
            )}
            <Button className="w-full gap-2 font-semibold" size="lg">
              Захиалга өгөх <ChevronRight className="h-4 w-4" />
            </Button>
            <button
              onClick={onClose}
              className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors text-center"
            >
              Худалдан авалт үргэлжлүүлэх
            </button>
          </div>
        )}
      </div>
    </>
  )
})