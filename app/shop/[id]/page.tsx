// app/shop/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft, ChevronRight, Heart, Star, ShoppingCart,
  BadgePercent, CheckCircle2, ArrowLeft, ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { products } from "@/lib/shop-data";
import { CartDrawer } from "@/components/shop/cart-drawer";
import { useCart } from "@/app/shop/layout"

export default function ProductDetailPage() {
  const { id }   = useParams();
  const router   = useRouter();
  const product  = products.find((p) => p.id === Number(id));

  const [activeIdx, setActiveIdx] = useState(0);
  const [faved,     setFaved]     = useState(false);
  const [cartOpen,  setCartOpen]  = useState(false);
  const [added,     setAdded]     = useState(false);

  const { addToCart, count: cartCount } = useCart()

  const images: string[] = product
    ? (product.images && product.images.length > 0 ? product.images.slice(0, 8) : [product.image])
    : [];

  // Arrow key navigation
  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  setActiveIdx((i) => (i - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") setActiveIdx((i) => (i + 1) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [product, images.length]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center text-muted-foreground">
        <div>
          <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-25" />
          <p className="font-medium">Бараа олдсонгүй</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => router.push("/shop")}>
            Дэлгүүр рүү буцах
          </Button>
        </div>
      </div>
    );
  }

  const realDiscount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100) : null;

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Related products (same category, exclude current)
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-background">

      {/* ── Back + Cart ── */}
      <div className="sticky top-16 z-40 border-b border-border/60 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <button onClick={() => router.push("/shop")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Дэлгүүр
          </button>

          <button onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-sm hover:bg-primary/90 transition-colors">
            <ShoppingCart className="h-3.5 w-3.5" />
            Сагс
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-4 px-1 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold shadow">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Main ── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

          {/* ── LEFT: Gallery ── */}
          <div className="lg:w-[50%] shrink-0">
            {/* Main image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted/40 mb-3">
              <img
                key={activeIdx}
                src={images[activeIdx] || "/placeholder.svg"}
                alt={`${product.name} - ${activeIdx + 1}`}
                className="block w-full h-full object-cover"
              />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                {product.isNew && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground shadow">ШИНЭ</span>
                )}
                {product.isSale && realDiscount && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white shadow flex items-center gap-1">
                    <BadgePercent className="h-2.5 w-2.5" />−{realDiscount}%
                  </span>
                )}
              </div>

              {/* Arrows */}
              {images.length > 1 && (
                <>
                  <button onClick={() => setActiveIdx((i) => (i - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/40 hover:bg-background transition-colors shadow">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button onClick={() => setActiveIdx((i) => (i + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/40 hover:bg-background transition-colors shadow">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-black/50 text-white backdrop-blur-sm">
                    {activeIdx + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
                {images.map((src, i) => (
                  <button key={i} onClick={() => setActiveIdx(i)}
                    className={cn(
                      "shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-150",
                      activeIdx === i
                        ? "border-primary shadow-sm shadow-primary/20 scale-105"
                        : "border-transparent opacity-55 hover:opacity-90 hover:border-border"
                    )}>
                    <img src={src || "/placeholder.svg"} alt={`Зураг ${i + 1}`}
                      className="block w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Info ── */}
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold leading-snug mb-3">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={cn("h-4 w-4",
                    i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted")} />
                ))}
              </div>
              <span className="text-sm font-semibold">{product.rating}</span>
              <span className="text-sm text-muted-foreground">({product.reviewCount} үнэлгээ)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-5">
              <span className="text-3xl font-bold text-primary">{product.price.toLocaleString()}₮</span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  {product.originalPrice.toLocaleString()}₮
                </span>
              )}
              {realDiscount && (
                <span className="text-sm font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/30 px-2 py-0.5 rounded-full">
                  -{realDiscount}% хямдрал
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed mb-5">{product.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-5">
              {product.tags.map((tag) => (
                <span key={tag}
                  className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />{tag}
                </span>
              ))}
            </div>

            {/* Stock */}
            <div className={cn(
              "flex items-center gap-2.5 p-4 rounded-xl mb-6 font-medium",
              product.stock === 0 ? "bg-destructive/10 text-destructive"
              : product.stock <= 5 ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400"
              : "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400"
            )}>
              <div className={cn("w-2.5 h-2.5 rounded-full shrink-0 animate-pulse",
                product.stock === 0 ? "bg-destructive"
                : product.stock <= 5 ? "bg-amber-500" : "bg-emerald-500")} />
              {product.stock === 0 ? "Дууссан байна"
                : product.stock <= 5 ? `Зөвхөн ${product.stock} ширхэг үлдсэн`
                : `Нөөцтэй байна (${product.stock}+)`}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || added}
                className="flex-1 gap-2 h-12 text-base font-semibold"
                size="lg"
              >
                <ShoppingCart className="h-5 w-5" />
                {added ? "Сагсанд нэмэгдлээ ✓" : "Сагсанд нэмэх"}
              </Button>
              <button
                onClick={() => setFaved((v) => !v)}
                className={cn(
                  "h-12 px-4 rounded-xl border-2 transition-all",
                  faved
                    ? "bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-800 text-red-500"
                    : "border-border hover:border-primary/40 text-muted-foreground"
                )}
              >
                <Heart className={cn("h-5 w-5", faved && "fill-red-500")} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Related ── */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold mb-5">Төстэй бараанууд</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map((p) => (
                <button key={p.id} onClick={() => router.push(`/shop/${p.id}`)}
                  className="group text-left rounded-2xl border border-border/60 overflow-hidden hover:border-primary/30 hover:shadow-md transition-all">
                  <div className="aspect-square overflow-hidden bg-muted/40">
                    <img src={p.image || "/placeholder.svg"} alt={p.name}
                      className="block w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy" />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold line-clamp-1 group-hover:text-primary transition-colors">{p.name}</p>
                    <p className="text-primary font-bold text-sm mt-0.5">{p.price.toLocaleString()}₮</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}