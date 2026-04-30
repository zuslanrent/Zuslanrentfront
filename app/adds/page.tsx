"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Search,
  MapPin,
  Home,
  Tent,
  Building2,
  TreePine,
  Warehouse,
  Waves,
  Mountain,
  Grid3X3,
  List,
  BedDouble,
  Bath,
  Square,
  Phone,
  Heart,
  X,
  ArrowUpDown,
  Filter,
  Loader2,
  Star,
  Users,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ListingModal } from "@/components/listing-modal";

export type Listing = {
  id: string;
  title: string;
  location_name: string;
  location_slug: string;
  price_per_day: string | number;
  cover_image: string | null;
  images: { url: string; is_cover: boolean }[] | null;
  category_name: string;
  category_slug: string;
  rooms: number;
  bathrooms: number;
  area_sqm: string | number;
  max_guests: number;
  phone: string | null;
  tags: string[] | null;
  is_new: boolean;
  is_featured: boolean;
  is_vip: boolean;
  avg_rating: string | number;
  review_count: number;
  view_count: number;
  status: string;
  created_at: string;
  plan?: string;
  plan_price?: number;
  expires_at?: string;
};

const categories = [
  { icon: Home, label: "Орон сууц", id: "apartment" },
  { icon: Tent, label: "Зуслан", id: "camp" },
  { icon: Building2, label: "Байшин", id: "house" },
  { icon: TreePine, label: "Ойн бүс", id: "forest" },
  { icon: Warehouse, label: "Агуулах", id: "warehouse" },
  { icon: Waves, label: "Нуурын эрэг", id: "lake" },
  { icon: Mountain, label: "Уулын бүс", id: "mountain" },
];

const allLocations = [
  "Богдхан",
  "Тэрэлж",
  "Сэргэлэн",
  "Улиастай",
  "Налайх",
  "Горхи",
  "Хустай",
  "Мандал",
  "Баянчандмань",
];

const sortOptions = [
  "Шинэ эхэнд",
  "Хямд эхэнд",
  "Үнэтэй эхэнд",
  "Том эхэнд",
  "Үнэлгээ",
];

function VipBadge() {
  return (
    <div
      className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full pointer-events-none"
      style={{
        background: "linear-gradient(135deg, #f59e0b, #d97706)",
        boxShadow: "0 2px 8px rgba(245,158,11,0.5)",
      }}
    >
      <Star className="h-2.5 w-2.5 text-white fill-white" />
      <span className="text-[10px] font-black text-white tracking-wide">
        VIP
      </span>
    </div>
  );
}

function ListingCard({
  item,
  view,
  onFave,
  faved,
  onClick,
}: {
  item: Listing;
  view: "grid" | "list";
  onFave: (id: string) => void;
  faved: boolean;
  onClick: () => void;
}) {
  const coverImage =
    item.cover_image || item.images?.[0]?.url || "/placeholder.svg";
  const price = parseFloat(String(item.price_per_day));
  const rating = parseFloat(String(item.avg_rating));

  return (
    <Card
      onClick={onClick}
      className={cn(
        "group overflow-hidden cursor-pointer transition-all duration-300 bg-background hover:shadow-xl",
        view === "list" && "flex flex-row h-44",
        item.is_vip
          ? "border-amber-300/70 hover:border-amber-400"
          : "border border-border/60 hover:border-primary/40",
      )}
      style={
        item.is_vip ? { border: "1.5px solid rgba(245,158,11,0.4)" } : undefined
      }
    >
      <div
        className={cn(
          "relative overflow-hidden shrink-0",
          view === "grid" ? "aspect-video" : "w-52",
        )}
      >
        <img
          src={coverImage}
          alt={item.title}
          className="block w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {item.is_vip && (
          <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 to-transparent pointer-events-none" />
        )}
        <div className="absolute top-2.5 left-2.5 flex gap-1.5">
          {item.is_vip && <VipBadge />}
          {!item.is_vip && item.is_new && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground shadow">
              ШИНЭ
            </span>
          )}
          {!item.is_vip && item.is_featured && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white shadow">
              ТОП
            </span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFave(item.id);
          }}
          className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
        >
          <Heart
            className={cn(
              "h-3.5 w-3.5",
              faved ? "fill-red-500 text-red-500" : "text-muted-foreground",
            )}
          />
        </button>
      </div>

      <CardContent
        className={cn(
          "p-4 flex flex-col justify-between flex-1 min-w-0",
          view === "list" && "py-3",
        )}
      >
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3
              className={cn(
                "font-semibold text-sm leading-snug line-clamp-2 transition-colors",
                item.is_vip
                  ? "group-hover:text-amber-600"
                  : "group-hover:text-primary",
              )}
            >
              {item.title}
            </h3>
            <div className="text-right shrink-0">
              <p
                className={cn(
                  "font-bold text-sm whitespace-nowrap",
                  item.is_vip ? "text-amber-600" : "text-primary",
                )}
              >
                {price.toLocaleString()}₮
              </p>
              <p className="text-[10px] text-muted-foreground">/өдөр</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground mb-2">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="text-xs">{item.location_name}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <BedDouble className="h-3 w-3" /> {item.rooms} өрөө
            </span>
            <span className="flex items-center gap-1">
              <Bath className="h-3 w-3" /> {item.bathrooms}
            </span>
            <span className="flex items-center gap-1">
              <Square className="h-3 w-3" /> {item.area_sqm}м²
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1.5">
            {rating > 0 && (
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="font-medium text-foreground">
                  {rating.toFixed(1)}
                </span>
                {item.review_count > 0 && <span>({item.review_count})</span>}
              </span>
            )}
            {item.max_guests > 0 && (
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" /> {item.max_guests} хүн
              </span>
            )}
            {item.view_count > 0 && (
              <span className="flex items-center gap-1 ml-auto">
                <Eye className="h-3 w-3" /> {item.view_count}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
          <div className="flex gap-1 flex-wrap">
            {item.is_vip ? (
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                style={{
                  background: "rgba(245,158,11,0.12)",
                  color: "#d97706",
                }}
              >
                ⭐ Онцгой байрлал
              </span>
            ) : (
              (item.tags || []).slice(0, view === "list" ? 1 : 2).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground"
                >
                  {tag}
                </span>
              ))
            )}
          </div>
          {item.phone && (
            <a
              href={`tel:${item.phone}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-xs text-primary hover:underline shrink-0"
            >
              <Phone className="h-3 w-3" /> {item.phone}
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [activeLocations, setActiveLocations] = useState<string[]>([]);
  const [priceMax, setPriceMax] = useState(0);
  const [priceLimit, setPriceLimit] = useState(0);
  const [minRooms, setMinRooms] = useState(0);
  const [minBathrooms, setMinBathrooms] = useState(0);
  const [minGuests, setMinGuests] = useState(0);
  const [sortBy, setSortBy] = useState(sortOptions[0]);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [faved, setFaved] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selected, setSelected] = useState<Listing | null>(null);

  const filteredLocations = useMemo(
    () =>
      locationSearch
        ? allLocations.filter((l) =>
            l.toLowerCase().includes(locationSearch.toLowerCase()),
          )
        : allLocations,
    [locationSearch],
  );

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/listings?limit=100&sort=newest`,
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Алдаа гарлаа");
        const items: Listing[] = data.data || [];
        setListings(items);
        const max = Math.max(
          ...items.map((l) => parseFloat(String(l.price_per_day))),
          0,
        );
        const rounded = Math.ceil(max / 100000) * 100000;
        setPriceMax(rounded);
        setPriceLimit(rounded);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleFave = (id: string) =>
    setFaved((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const toggleCat = (id: string) =>
    setActiveCategories((p) =>
      p.includes(id) ? p.filter((c) => c !== id) : [...p, id],
    );
  const toggleLoc = (loc: string) => {
    setActiveLocations((p) =>
      p.includes(loc) ? p.filter((l) => l !== loc) : [...p, loc],
    );
    setLocationSearch("");
  };
  const clearAll = () => {
    setActiveCategories([]);
    setActiveLocations([]);
    setLocationSearch("");
    setPriceMax(priceLimit);
    setMinRooms(0);
    setMinBathrooms(0);
    setMinGuests(0);
    setSearch("");
  };

  const activeFilterCount =
    activeCategories.length +
    activeLocations.length +
    (priceMax < priceLimit ? 1 : 0) +
    (minRooms > 0 ? 1 : 0) +
    (minBathrooms > 0 ? 1 : 0) +
    (minGuests > 0 ? 1 : 0);

  const filtered = useMemo(() => {
    const applyFilters = (list: Listing[]) =>
      list.filter((l) => {
        if (
          search &&
          !l.title.toLowerCase().includes(search.toLowerCase()) &&
          !l.location_name?.toLowerCase().includes(search.toLowerCase())
        )
          return false;
        if (
          activeCategories.length &&
          !activeCategories.includes(l.category_slug)
        )
          return false;
        if (
          activeLocations.length &&
          !activeLocations.some((loc) => l.location_name?.includes(loc))
        )
          return false;
        if (
          priceMax < priceLimit &&
          parseFloat(String(l.price_per_day)) > priceMax
        )
          return false;
        if (l.rooms < minRooms) return false;
        if (l.bathrooms < minBathrooms) return false;
        if (l.max_guests < minGuests) return false;
        return true;
      });
    const applySort = (list: Listing[]) => {
      if (sortBy === "Хямд эхэнд")
        return [...list].sort(
          (a, b) =>
            parseFloat(String(a.price_per_day)) -
            parseFloat(String(b.price_per_day)),
        );
      if (sortBy === "Үнэтэй эхэнд")
        return [...list].sort(
          (a, b) =>
            parseFloat(String(b.price_per_day)) -
            parseFloat(String(a.price_per_day)),
        );
      if (sortBy === "Том эхэнд")
        return [...list].sort(
          (a, b) =>
            parseFloat(String(b.area_sqm)) - parseFloat(String(a.area_sqm)),
        );
      if (sortBy === "Үнэлгээ")
        return [...list].sort(
          (a, b) =>
            parseFloat(String(b.avg_rating)) - parseFloat(String(a.avg_rating)),
        );
      return list;
    };
    return {
      vip: applySort(applyFilters(listings.filter((l) => l.is_vip === true))),
      standard: applySort(applyFilters(listings.filter((l) => !l.is_vip))),
    };
  }, [
    listings,
    search,
    activeCategories,
    activeLocations,
    priceMax,
    priceLimit,
    minRooms,
    minBathrooms,
    minGuests,
    sortBy,
  ]);

  return (
    <div className="min-h-screen bg-background">
      {/* Toolbar */}
      <div className="border-b border-border/60 bg-background/95 backdrop-blur sticky top-16 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Зар хайлт */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Зар хайх..."
                className="w-full pl-9 pr-9 py-2 text-sm bg-muted/60 border border-border/60 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* Байршил хайлт — dropdown */}
            <div className="relative w-full sm:w-52">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                placeholder="Байршил хайх..."
                className="w-full pl-9 pr-9 py-2 text-sm bg-muted/60 border border-border/60 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
              {locationSearch && (
                <button
                  onClick={() => setLocationSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              )}
              {locationSearch && filteredLocations.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border/60 rounded-xl shadow-lg z-50 overflow-hidden">
                  {filteredLocations.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => toggleLoc(loc)}
                      className={cn(
                        "w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors flex items-center gap-2",
                        activeLocations.includes(loc) &&
                          "bg-primary/5 text-primary font-medium",
                      )}
                    >
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      {loc}
                      {activeLocations.includes(loc) && (
                        <span className="ml-auto text-primary text-xs">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-3 pr-7 py-2 text-xs bg-muted/60 border border-border/60 rounded-full focus:outline-none cursor-pointer"
                >
                  {sortOptions.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
                <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
              </div>
              <button
                onClick={() => setSidebarOpen((v) => !v)}
                className={cn(
                  "lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-full text-xs border transition-all",
                  sidebarOpen || activeFilterCount > 0
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/60 border-border/60 text-muted-foreground",
                )}
              >
                <Filter className="h-3.5 w-3.5" />
                Шүүлт {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>
              <div className="flex items-center rounded-full border border-border/60 overflow-hidden">
                {(["grid", "list"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={cn(
                      "p-2 transition-colors",
                      view === v
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/60 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {v === "grid" ? (
                      <Grid3X3 className="h-3.5 w-3.5" />
                    ) : (
                      <List className="h-3.5 w-3.5" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active location chips */}
          {activeLocations.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap mt-2">
              {activeLocations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => toggleLoc(loc)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                >
                  <MapPin className="h-3 w-3" />
                  {loc}
                  <X className="h-3 w-3 ml-0.5" />
                </button>
              ))}
            </div>
          )}

          {/* Category pills */}
          <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
            {categories.map(({ icon: Icon, label, id }) => (
              <button
                key={id}
                onClick={() => toggleCat(id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150 whitespace-nowrap cursor-pointer",
                  activeCategories.includes(id)
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-muted/60 text-muted-foreground border-border/60 hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                {label}
              </button>
            ))}
            {activeFilterCount > 0 && (
              <button
                onClick={clearAll}
                className="text-xs text-destructive hover:underline ml-1"
              >
                Бүгдийг арилгах
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside
            className={cn(
              "shrink-0 w-64 space-y-5 transition-all duration-300 lg:block",
              sidebarOpen ? "block" : "hidden",
            )}
          >
            <div className="sticky top-40 space-y-6">
              {/* Байршил sidebar */}
              <div>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary" /> Байршил
                </h3>
                <div className="relative mb-2">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    placeholder="Хайх..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-muted/60 border border-border/60 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {filteredLocations.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => toggleLoc(loc)}
                      className={cn(
                        "text-xs px-2.5 py-0.5 rounded-full border transition-all cursor-pointer",
                        activeLocations.includes(loc)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted/60 border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40",
                      )}
                    >
                      {activeLocations.includes(loc) && "✓ "}
                      {loc}
                    </button>
                  ))}
                  {filteredLocations.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      Байршил олдсонгүй
                    </p>
                  )}
                </div>
              </div>

              {/* Үнэ */}
              <div>
                <h3 className="text-sm font-semibold mb-2">
                  Үнийн дээд хязгаар
                </h3>
                <input
                  type="range"
                  min={0}
                  max={priceLimit}
                  step={10000}
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0₮</span>
                  <span className="text-primary font-medium">
                    {priceMax.toLocaleString()}₮
                  </span>
                </div>
              </div>

              {/* Өрөө */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Өрөөний тоо</h3>
                <div className="flex gap-1.5">
                  {[0, 1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setMinRooms(n)}
                      className={cn(
                        "w-8 h-8 rounded-full text-xs border transition-all cursor-pointer",
                        minRooms === n
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted/60 border-border/60 text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {n === 0 ? "Б/б" : `${n}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ариун цэвэр */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Ариун цэвэр</h3>
                <div className="flex gap-1.5">
                  {[0, 1, 2, 3, 4].map((n) => (
                    <button
                      key={n}
                      onClick={() => setMinBathrooms(n)}
                      className={cn(
                        "w-8 h-8 rounded-full text-xs border transition-all cursor-pointer",
                        minBathrooms === n
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted/60 border-border/60 text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {n === 0 ? "Б/б" : `${n}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Хүний тоо */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Хүний тоо</h3>
                <div className="flex gap-1.5 flex-wrap">
                  {[0, 2, 4, 6, 8, 10].map((n) => (
                    <button
                      key={n}
                      onClick={() => setMinGuests(n)}
                      className={cn(
                        "w-8 h-8 rounded-full text-xs border transition-all cursor-pointer",
                        minGuests === n
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted/60 border-border/60 text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {n === 0 ? "Б/б" : `${n}+`}
                    </button>
                  ))}
                </div>
              </div>

              {activeFilterCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAll}
                  className="w-full text-xs"
                >
                  Шүүлт арилгах ({activeFilterCount})
                </Button>
              )}
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                <span className="text-foreground font-semibold">
                  {filtered.vip.length + filtered.standard.length}
                </span>{" "}
                зар олдлоо
                {filtered.vip.length > 0 && (
                  <span className="ml-2 text-xs" style={{ color: "#d97706" }}>
                    ⭐ {filtered.vip.length} VIP
                  </span>
                )}
                {activeLocations.length > 0 && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    📍 {activeLocations.join(", ")}
                  </span>
                )}
              </p>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-24 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mr-3" />
                <span>Зарыг ачааллаж байна...</span>
              </div>
            )}
            {!loading && error && (
              <div className="text-center py-24">
                <p className="text-destructive mb-4">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                >
                  Дахин оролдох
                </Button>
              </div>
            )}
            {!loading &&
              !error &&
              filtered.vip.length === 0 &&
              filtered.standard.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                  <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">Зар олдсонгүй</p>
                  <p className="text-sm mt-1">Шүүлтийг өөрчилж үзнэ үү</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={clearAll}
                  >
                    Шүүлт арилгах
                  </Button>
                </div>
              )}

            {!loading &&
              !error &&
              (filtered.vip.length > 0 || filtered.standard.length > 0) && (
                <div className="space-y-8">
                  {/* VIP */}
                  {filtered.vip.length > 0 && (
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="flex items-center gap-2 px-4 py-1.5 rounded-full"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(251,191,36,0.15), rgba(217,119,6,0.1))",
                            border: "1px solid rgba(245,158,11,0.3)",
                          }}
                        >
                          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                          <span
                            className="text-xs font-bold tracking-wider uppercase"
                            style={{ color: "#d97706" }}
                          >
                            VIP Онцгой зарууд
                          </span>
                        </div>
                        <div
                          className="flex-1 h-px"
                          style={{
                            background:
                              "linear-gradient(to right, rgba(245,158,11,0.4), transparent)",
                          }}
                        />
                        <span
                          className="text-xs font-semibold"
                          style={{ color: "#d97706" }}
                        >
                          {filtered.vip.length} зар
                        </span>
                      </div>
                      <div
                        className={cn(
                          view === "grid"
                            ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                            : "flex flex-col gap-3",
                        )}
                      >
                        {filtered.vip.map((item) => (
                          <div key={item.id} className="relative">
                            <div
                              className="absolute -inset-0.5 rounded-2xl pointer-events-none"
                              style={{
                                background:
                                  "linear-gradient(135deg, rgba(251,191,36,0.35), rgba(217,119,6,0.2), rgba(251,191,36,0.35))",
                                filter: "blur(3px)",
                              }}
                            />
                            <div className="relative">
                              <ListingCard
                                item={item}
                                view={view}
                                faved={faved.includes(item.id)}
                                onFave={toggleFave}
                                onClick={() => setSelected(item)}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Хуваагч */}
                  {filtered.vip.length > 0 && filtered.standard.length > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted border border-border/60">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                          Энгийн зарууд
                        </span>
                      </div>
                      <div className="flex-1 h-px bg-border/60" />
                      <span className="text-xs text-muted-foreground">
                        {filtered.standard.length} зар
                      </span>
                    </div>
                  )}
                  {/* Энгийн */}
                  {filtered.standard.length > 0 && (
                    <div
                      className={cn(
                        view === "grid"
                          ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                          : "flex flex-col gap-3",
                      )}
                    >
                      {filtered.standard.map((item) => (
                        <ListingCard
                          key={item.id}
                          item={item}
                          view={view}
                          faved={faved.includes(item.id)}
                          onFave={toggleFave}
                          onClick={() => setSelected(item)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
          </main>
        </div>
      </div>

      {selected && (
        <ListingModal
          item={selected}
          onClose={() => setSelected(null)}
          faved={faved.includes(selected.id)}
          onFave={toggleFave}
        />
      )}
    </div>
  );
}
