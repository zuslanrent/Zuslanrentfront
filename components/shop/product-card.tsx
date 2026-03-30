"use client";

import { memo } from "react";
import Link from "next/link";
import { Heart, Star, Plus, BadgePercent } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/shop-data";
import { useCart } from "@/app/shop/layout"; // ← солисон

interface Props {
  product: Product;
  faved:   boolean;
  onFave:  (id: number) => void;
}

export const ProductCard = memo(function ProductCard({ product, faved, onFave }: Props) {
  const { addToCart } = useCart(); // ← солисон

  const realDiscount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <Link
      href={`/shop/${product.id}`}
      className="group relative flex flex-col rounded-2xl border border-border/60 bg-background hover:border-primary/30 hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className="relative aspect-square overflow-hidden bg-muted/40">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="block w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground shadow">
              ШИНЭ
            </span>
          )}
          {product.isSale && realDiscount && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white shadow flex items-center gap-1">
              <BadgePercent className="h-2.5 w-2.5" />−{realDiscount}%
            </span>
          )}
        </div>

        <button
          onClick={(e) => { e.preventDefault(); onFave(product.id); }}
          className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors shadow-sm"
        >
          <Heart className={cn("h-3.5 w-3.5 transition-colors",
            faved ? "fill-red-500 text-red-500" : "text-muted-foreground")} />
        </button>

        {product.images && product.images.length > 1 && (
          <div className="absolute bottom-2 left-2 text-[10px] px-1.5 py-0.5 rounded-full bg-black/50 text-white backdrop-blur-sm">
            🖼 {product.images.length}
          </div>
        )}

        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute bottom-2 right-2 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/90 text-white font-medium">
            {product.stock} үлдсэн
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
            <span className="text-sm font-bold text-muted-foreground">Дууссан</span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-sm leading-snug mb-1 group-hover:text-primary transition-colors line-clamp-2">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="flex gap-1 flex-wrap mb-3">
          {product.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={cn("h-3 w-3",
              i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted")} />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({product.reviewCount})</span>
        </div>

        <div className="flex items-end justify-between gap-2 mt-auto pt-3 border-t border-border/50">
          <div>
            <span className="font-bold text-base text-primary">{product.price.toLocaleString()}₮</span>
            {product.originalPrice && (
              <p className="text-xs text-muted-foreground line-through">
                {product.originalPrice.toLocaleString()}₮
              </p>
            )}
          </div>
          <button
            onClick={(e) => { e.preventDefault(); addToCart(product); }}
            disabled={product.stock === 0}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200",
              product.stock > 0
                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            <Plus className="h-3.5 w-3.5" /> Нэмэх
          </button>
        </div>
      </div>
    </Link>
  );
});