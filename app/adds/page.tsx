"use client";

import { useState, useMemo } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ListingModal } from "@/components/listing-modal";

// ── Types — export хийх ───────────────────────────────
export type Listing = {
  id: number;
  title: string;
  location: string;
  price: number;
  priceUnit: string;
  image: string;
  images?: string[];
  category: string;
  rooms: number;
  bathrooms: number;
  area: number;
  phone: string;
  tags: string[];
  isNew?: boolean;
  isFeatured?: boolean;
};

// ── Mock data ─────────────────────────────────────────
const listings: Listing[] = [
  {
    id: 1,
    title: "Богдхан орчмын зуслан",
    location: "Богдхан",
    price: 150000,
    priceUnit: "өдөр",
    image: "/images/house1.jpg",
    images: [
      "/images/house1.jpg",
      "/images/house2.jpg",
      "/images/house3.jpg",
      "/images/house4.jpg",
    ],
    category: "camp",
    rooms: 3,
    bathrooms: 2,
    area: 120,
    phone: "9900-1234",
    tags: ["Цэцэрлэгтэй", "Зогсоолтой"],
    isNew: true,
    isFeatured: true,
  },
  {
    id: 2,
    title: "Сэргэлэн тосгон жижиг орон сууц",
    location: "Сэргэлэн",
    price: 80000,
    priceUnit: "өдөр",
    image: "/images/house2.jpg",
    images: ["/images/house2.jpg", "/images/house3.jpg", "/images/house1.jpg"],
    category: "apartment",
    rooms: 1,
    bathrooms: 1,
    area: 45,
    phone: "9955-5678",
    tags: ["Тагттай"],
  },
  {
    id: 3,
    title: "Тэрэлж ойн орчим байшин",
    location: "Тэрэлж",
    price: 120000,
    priceUnit: "өдөр",
    image: "/images/house3.jpg",
    images: ["/images/house3.jpg", "/images/house4.jpg", "/images/house1.jpg"],
    category: "forest",
    rooms: 2,
    bathrooms: 1,
    area: 90,
    phone: "9911-3344",
    tags: ["Барбекю", "Тоглоомын талбай"],
    isFeatured: true,
  },
  {
    id: 4,
    title: "Улиастай усан сангийн ойролцоо",
    location: "Улиастай",
    price: 300000,
    priceUnit: "өдөр",
    image: "/images/house4.jpg",
    images: ["/images/house4.jpg", "/images/house1.jpg", "/images/house2.jpg"],
    category: "lake",
    rooms: 4,
    bathrooms: 3,
    area: 200,
    phone: "9909-7788",
    tags: ["Саун", "Том цэцэрлэг"],
    isNew: true,
  },
  {
    id: 5,
    title: "Горхи уулын бааз",
    location: "Горхи",
    price: 200000,
    priceUnit: "өдөр",
    image: "/images/house1.jpg",
    images: ["/images/house1.jpg", "/images/house3.jpg"],
    category: "mountain",
    rooms: 5,
    bathrooms: 2,
    area: 180,
    phone: "9922-1100",
    tags: ["Уулын үзэмж", "Явган аялал"],
  },
  {
    id: 6,
    title: "Налайх орон сууц",
    location: "Налайх",
    price: 60000,
    priceUnit: "өдөр",
    image: "/images/house2.jpg",
    images: ["/images/house2.jpg", "/images/house4.jpg"],
    category: "apartment",
    rooms: 2,
    bathrooms: 1,
    area: 65,
    phone: "9944-5566",
    tags: ["Хоолны газар ойр"],
  },
  {
    id: 7,
    title: "Хустай байшин",
    location: "Хустай",
    price: 250000,
    priceUnit: "өдөр",
    image: "/images/house3.jpg",
    images: ["/images/house3.jpg", "/images/house1.jpg", "/images/house2.jpg"],
    category: "house",
    rooms: 3,
    bathrooms: 2,
    area: 150,
    phone: "9933-7788",
    tags: ["Байгалийн цогцолбор"],
    isNew: true,
  },
  {
    id: 8,
    title: "Мандал нуурын эрэгт",
    location: "Мандал",
    price: 180000,
    priceUnit: "өдөр",
    image: "/images/house4.jpg",
    images: ["/images/house4.jpg", "/images/house3.jpg"],
    category: "lake",
    rooms: 2,
    bathrooms: 1,
    area: 80,
    phone: "9966-3344",
    tags: ["Нуурын эрэг", "Загасчлал"],
  },
];

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
];
const sortOptions = ["Шинэ эхэнд", "Хямд эхэнд", "Үнэтэй эхэнд", "Том эхэнд"];

// ── Listing Card ──────────────────────────────────────
function ListingCard({
  item,
  view,
  onFave,
  faved,
  onClick,
}: {
  item: Listing;
  view: "grid" | "list";
  onFave: (id: number) => void;
  faved: boolean;
  onClick: () => void;
}) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "group overflow-hidden border border-border/60 hover:border-primary/40 cursor-pointer",
        "hover:shadow-lg transition-all duration-300 bg-background",
        view === "list" && "flex flex-row h-44",
      )}
    >
      {/* Image */}
      <div
        className={cn(
          "relative overflow-hidden shrink-0",
          view === "grid" ? "aspect-video" : "w-52",
        )}
      >
        <img
          src={item.image || "/placeholder.svg"}
          alt={item.title}
          className="block w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 left-2 flex gap-1.5">
          {item.isNew && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground shadow">
              ШИНЭ
            </span>
          )}
          {item.isFeatured && (
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
          className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
        >
          <Heart
            className={cn(
              "h-3.5 w-3.5 transition-colors",
              faved ? "fill-red-500 text-red-500" : "text-muted-foreground",
            )}
          />
        </button>
      </div>

      {/* Content */}
      <CardContent
        className={cn(
          "p-4 flex flex-col justify-between flex-1 min-w-0",
          view === "list" && "py-3",
        )}
      >
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            <div className="text-right shrink-0">
              <p className="font-bold text-primary text-sm whitespace-nowrap">
                {item.price.toLocaleString()}₮
              </p>
              <p className="text-[10px] text-muted-foreground">
                /{item.priceUnit}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground mb-2">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="text-xs">{item.location}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <BedDouble className="h-3 w-3" /> {item.rooms} өрөө
            </span>
            <span className="flex items-center gap-1">
              <Bath className="h-3 w-3" /> {item.bathrooms} ариун
            </span>
            <span className="flex items-center gap-1">
              <Square className="h-3 w-3" /> {item.area}м²
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
          <div className="flex gap-1 flex-wrap">
            {item.tags.slice(0, view === "list" ? 1 : 2).map((tag: string) => (
              <span
                key={tag}
                className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
          <a
            href={`tel:${item.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-xs text-primary hover:underline shrink-0"
          >
            <Phone className="h-3 w-3" /> {item.phone}
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Main Page ─────────────────────────────────────────
export default function AdsPage() {
  const [search, setSearch] = useState("");
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [activeLocations, setActiveLocations] = useState<string[]>([]);
  const [priceMax, setPriceMax] = useState(400000);
  const [minRooms, setMinRooms] = useState(0);
  const [sortBy, setSortBy] = useState(sortOptions[0]);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [faved, setFaved] = useState<number[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  const toggleFave = (id: number) =>
    setFaved((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const toggleCat = (id: string) =>
    setActiveCategories((p) =>
      p.includes(id) ? p.filter((c) => c !== id) : [...p, id],
    );

  const toggleLoc = (loc: string) =>
    setActiveLocations((p) =>
      p.includes(loc) ? p.filter((l) => l !== loc) : [...p, loc],
    );

  const clearAll = () => {
    setActiveCategories([]);
    setActiveLocations([]);
    setPriceMax(400000);
    setMinRooms(0);
    setSearch("");
  };

  const activeFilterCount =
    activeCategories.length +
    activeLocations.length +
    (priceMax < 400000 ? 1 : 0) +
    (minRooms > 0 ? 1 : 0);

  const filtered = useMemo(() => {
    let result = listings.filter((l) => {
      if (
        search &&
        !l.title.toLowerCase().includes(search.toLowerCase()) &&
        !l.location.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      if (activeCategories.length && !activeCategories.includes(l.category))
        return false;
      if (activeLocations.length && !activeLocations.includes(l.location))
        return false;
      if (l.price > priceMax) return false;
      if (l.rooms < minRooms) return false;
      return true;
    });
    if (sortBy === "Хямд эхэнд")
      result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === "Үнэтэй эхэнд")
      result = [...result].sort((a, b) => b.price - a.price);
    if (sortBy === "Том эхэнд")
      result = [...result].sort((a, b) => b.area - a.area);
    return result;
  }, [search, activeCategories, activeLocations, priceMax, minRooms, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      {/* ── Page header ── */}
      <div className="border-b border-border/60 bg-background/95 backdrop-blur sticky top-16 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Зар хайх..."
                className="w-full pl-9 pr-9 py-2 text-sm bg-muted/60 border border-border/60 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-3 pr-7 py-2 text-xs bg-muted/60 border border-border/60 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
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
                <button
                  onClick={() => setView("grid")}
                  className={cn(
                    "p-2 transition-colors",
                    view === "grid"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/60 text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Grid3X3 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setView("list")}
                  className={cn(
                    "p-2 transition-colors",
                    view === "list"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/60 text-muted-foreground hover:text-foreground",
                  )}
                >
                  <List className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

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

      {/* ── Body ── */}
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
              <div>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary" /> Байршил
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {allLocations.map((loc) => (
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
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2">
                  Үнийн дээд хязгаар
                </h3>
                <input
                  type="range"
                  min={50000}
                  max={400000}
                  step={10000}
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>50,000₮</span>
                  <span className="text-primary font-medium">
                    {priceMax.toLocaleString()}₮
                  </span>
                </div>
              </div>

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

          {/* Listings */}
          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                <span className="text-foreground font-semibold">
                  {filtered.length}
                </span>{" "}
                зар олдлоо
              </p>
            </div>

            {filtered.length === 0 ? (
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
            ) : (
              <div
                className={cn(
                  view === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                    : "flex flex-col gap-3",
                )}
              >
                {filtered.map((item) => (
                  <ListingCard
                    key={item.id}
                    item={item}
                    view={view}
                    faved={faved.includes(item.id)}
                    onFave={toggleFave}
                    onClick={() => setSelectedListing(item)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ── Modal ── */}
      <ListingModal
        item={selectedListing}
        onClose={() => setSelectedListing(null)}
        faved={selectedListing ? faved.includes(selectedListing.id) : false}
        onFave={toggleFave}
      />
    </div>
  );
}
