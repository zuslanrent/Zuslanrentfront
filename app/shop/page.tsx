"use client";

import { useState, useMemo } from "react";
import {
  Search, X, ArrowUpDown, ShoppingCart, Heart,
  Package, BadgePercent, ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { products, categories, sortOptions, perks } from "@/lib/shop-data";
import { ProductCard } from "@/components/shop/product-card";
import { CartDrawer } from "@/components/shop/cart-drawer";
import { useCart } from "@/app/shop/layout";  // ← нэмсэн

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search,         setSearch]         = useState("");
  const [sortBy,         setSortBy]         = useState(sortOptions[0]);
  const [saleOnly,       setSaleOnly]       = useState(false);
  const [cartOpen,       setCartOpen]       = useState(false);
  const [faved,          setFaved]          = useState<number[]>([]);

  const { count: cartCount } = useCart();  // ← солисон

  const toggleFave = (id: number) =>
    setFaved((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  const saleCount = products.filter((p) => p.isSale).length;

  const categoryCount = useMemo(() =>
    Object.fromEntries(categories.map((c) => [
      c.id, c.id === "all" ? products.length : products.filter((p) => p.category === c.id).length,
    ])), []);

  const filtered = useMemo(() => {
    let r = products.filter((p) => {
      if (activeCategory !== "all" && p.category !== activeCategory) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) &&
          !p.description.toLowerCase().includes(search.toLowerCase())) return false;
      if (saleOnly && !p.isSale) return false;
      return true;
    });
    if (sortBy === "Хямд эхэнд")   r = [...r].sort((a, b) => a.price - b.price);
    if (sortBy === "Үнэтэй эхэнд") r = [...r].sort((a, b) => b.price - a.price);
    if (sortBy === "Үнэлгээгээр")  r = [...r].sort((a, b) => b.rating - a.rating);
    return r;
  }, [activeCategory, search, sortBy, saleOnly]);

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ── */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 border-b border-border/40 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-amber-500/5 blur-3xl" />
        </div>
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <ShoppingBag className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Зуслангийн хэрэгслийн дэлгүүр</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 text-balance">
            Зуслангийн{" "}
            <span className="text-primary relative inline-block">
              Дэлгүүр
              <svg className="absolute -bottom-1.5 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none">
                <path d="M2 6C50 2 150 2 198 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-primary" />
              </svg>
            </span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Кемпинг, барбекю, гал тогоо болон бусад зуслангийн хэрэгслийг нэг дороос авна уу.
          </p>
        </div>
      </section>

      {/* ── Perks ── */}
      <section className="border-b border-border/40 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-border/40">
            {perks.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3 px-4 py-4">
                <div className="p-2 rounded-xl bg-primary/10 shrink-0">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Toolbar ── */}
      <div className="sticky top-16 z-40 border-b border-border/60 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-3 mb-2.5">

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Бараа хайх..."
                className="w-full pl-9 pr-9 py-2 text-sm bg-muted/60 border border-border/60 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all" />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>

            <button onClick={() => setSaleOnly((v) => !v)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium border transition-all shrink-0",
                saleOnly ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                  : "bg-muted/60 border-border/60 text-muted-foreground hover:text-foreground"
              )}>
              <BadgePercent className="h-3.5 w-3.5" />
              Хямдрал {saleOnly && `(${saleCount})`}
            </button>

            <div className="relative shrink-0">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-3 pr-7 py-2 text-xs bg-muted/60 border border-border/60 rounded-full focus:outline-none cursor-pointer">
                {sortOptions.map((o) => <option key={o}>{o}</option>)}
              </select>
              <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
            </div>

            <button onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-sm hover:bg-primary/90 transition-colors shrink-0">
              <ShoppingCart className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Сагс</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-4 px-1 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold shadow">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {categories.map(({ id, icon: Icon, label }) => (
              <button key={id} onClick={() => setActiveCategory(id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150 whitespace-nowrap",
                  activeCategory === id
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-muted/60 text-muted-foreground border-border/60 hover:bg-muted hover:text-foreground"
                )}>
                <Icon className="h-3.5 w-3.5 shrink-0" />
                {label}
                <span className={cn("text-[10px] px-1.5 rounded-full font-bold",
                  activeCategory === id ? "bg-white/20" : "bg-muted")}>
                  {categoryCount[id]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground font-semibold">{filtered.length}</span> бараа олдлоо
          </p>
          {faved.length > 0 && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Heart className="h-3 w-3 fill-red-500 text-red-500" /> {faved.length} хадгалсан
            </span>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-3 opacity-25" />
            <p className="font-medium">Бараа олдсонгүй</p>
            <p className="text-sm mt-1">Шүүлт өөрчилж үзнэ үү</p>
            <Button variant="outline" size="sm" className="mt-4"
              onClick={() => { setSearch(""); setActiveCategory("all"); setSaleOnly(false); }}>
              Шүүлт арилгах
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                faved={faved.includes(product.id)}
                onFave={toggleFave}
              />
            ))}
          </div>
        )}
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}