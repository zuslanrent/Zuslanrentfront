"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  ArrowLeft, Star, Clock, CheckCircle2, Phone,
  Heart, CalendarDays, Users, ChevronRight, ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { services, serviceCategories, type Service } from "@/lib/service-data";

export default function ServiceDetailPage() {
  const { id }   = useParams();
  const router   = useRouter();
  const service  = services.find((s) => s.id === Number(id));

  const [activeIdx,  setActiveIdx]  = useState(0);
  const [faved,      setFaved]      = useState(false);
  const [booked,     setBooked]     = useState(false);
  const [guestCount, setGuestCount] = useState(1);
  const [date,       setDate]       = useState("");

  const images: string[] = service
    ? (service.images && service.images.length > 0
        ? service.images.slice(0, 8)
        : [service.image])
    : [];

  useEffect(() => {
    if (!service) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  setActiveIdx(i => (i - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") setActiveIdx(i => (i + 1) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [service, images.length]);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p className="text-5xl mb-4">🎯</p>
          <p className="font-medium mb-4">Үйлчилгээ олдсонгүй</p>
          <Button variant="outline" size="sm" onClick={() => router.push("/service")}>
            Буцах
          </Button>
        </div>
      </div>
    );
  }

  const cat     = serviceCategories.find((c) => c.id === service.categoryId)!;
  const related = services
    .filter((s) => s.categoryId === service.categoryId && s.id !== service.id)
    .slice(0, 3);

  const handleBook = () => {
    if (!date) return;
    setBooked(true);
    setTimeout(() => setBooked(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background">

      {/* ── Top bar ── */}
      <div className="sticky top-16 z-40 border-b border-border/60 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <button
            onClick={() => router.push("/service")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Үйлчилгээ
          </button>
          <span className={cn(
            "text-xs px-2.5 py-1 rounded-full font-medium",
            service.available
              ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400"
              : "bg-muted text-muted-foreground"
          )}>
            {service.available ? "● Боломжтой" : "● Дууссан"}
          </span>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">

          {/* ══ ЗҮҮН: Gallery ══ */}
          <div className="lg:w-[48%] shrink-0">

            {/* Main image */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted mb-3">
              <img
                key={activeIdx}
                src={images[activeIdx] || "/placeholder.svg"}
                alt={`${service.title} - ${activeIdx + 1}`}
                className="block w-full h-full object-cover animate-in fade-in duration-200"
              />

              {/* Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveIdx(i => (i - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/40 hover:bg-background transition-colors shadow"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setActiveIdx(i => (i + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/40 hover:bg-background transition-colors shadow"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-black/50 text-white backdrop-blur-sm">
                    {activeIdx + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails — доод тал */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    className={cn(
                      "shrink-0 w-16 h-12 rounded-xl overflow-hidden border-2 transition-all duration-150",
                      activeIdx === i
                        ? "border-primary shadow-sm shadow-primary/20 scale-105"
                        : "border-transparent opacity-55 hover:opacity-90 hover:border-border"
                    )}
                  >
                    <img
                      src={src || "/placeholder.svg"}
                      alt={`Зураг ${i + 1}`}
                      className="block w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ══ БАРУУН: Мэдээлэл + Захиалга ══ */}
          <div className="flex-1 min-w-0 flex flex-col gap-6">

            {/* Category + title */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className={cn("p-1.5 rounded-lg", cat.bg)}>
                  <cat.icon className={cn("h-4 w-4", cat.color)} />
                </div>
                <span className={cn("text-sm font-medium", cat.color)}>{cat.label}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold leading-snug mb-3">
                {service.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={cn("h-4 w-4",
                      i < Math.floor(service.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-muted text-muted")} />
                  ))}
                </div>
                <span className="text-sm font-semibold">{service.rating}</span>
                <span className="text-sm text-muted-foreground">({service.reviewCount} үнэлгээ)</span>
              </div>
            </div>

            {/* Price + duration */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/40 border border-border/60">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Үнэ</p>
                <p className="text-2xl font-bold text-primary">{service.price}</p>
              </div>
              <div className="w-px h-10 bg-border/60" />
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Хугацаа</p>
                <div className="flex items-center gap-1 font-semibold">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  {service.duration}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="font-bold text-sm text-muted-foreground uppercase tracking-wide mb-2">Тайлбар</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">{service.description}</p>
            </div>

            {/* Features */}
            <div>
              <h2 className="font-bold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                Үйлчилгээнд орох зүйлс
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {service.features.map((f) => (
                  <div key={f}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/40 border border-border/50">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="text-sm">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Booking box ── */}
            <div className="rounded-2xl border border-border/60 bg-background shadow-sm overflow-hidden">
              <div className="p-4 space-y-4">

                {/* Date */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1 block">
                    <CalendarDays className="h-3.5 w-3.5" /> Огноо
                  </label>
                  <input
                    type="date"
                    value={date}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-muted/50 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all cursor-pointer"
                  />
                </div>

                {/* Guest count */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1 block">
                    <Users className="h-3.5 w-3.5" /> Хүний тоо
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setGuestCount(v => Math.max(1, v - 1))}
                      className="w-9 h-9 rounded-full border border-border/60 flex items-center justify-center hover:bg-muted transition-colors text-lg font-medium"
                    >−</button>
                    <span className="flex-1 text-center font-semibold text-base">{guestCount}</span>
                    <button
                      onClick={() => setGuestCount(v => Math.min(20, v + 1))}
                      className="w-9 h-9 rounded-full border border-border/60 flex items-center justify-center hover:bg-muted transition-colors text-lg font-medium"
                    >+</button>
                  </div>
                </div>

                {!date && (
                  <p className="text-xs text-amber-600 dark:text-amber-400">⚠️ Огноогоо сонгоно уу</p>
                )}

                {booked && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 text-emerald-700 dark:text-emerald-400 text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    Захиалга амжилттай илгээгдлээ!
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={handleBook}
                    disabled={!service.available || !date || booked}
                    className="flex-1 gap-2 font-semibold"
                  >
                    {booked ? "Захиалагдлаа ✓" : "Захиалах"}
                    {!booked && <ChevronRight className="h-4 w-4" />}
                  </Button>
                  <button
                    onClick={() => setFaved(v => !v)}
                    className={cn(
                      "p-2.5 rounded-xl border-2 transition-all",
                      faved
                        ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-500"
                        : "border-border hover:border-primary/40 text-muted-foreground"
                    )}
                  >
                    <Heart className={cn("h-5 w-5", faved && "fill-red-500")} />
                  </button>
                </div>

                <a href="tel:99001234"
                  className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Phone className="h-3.5 w-3.5" />
                  Утсаар захиалах: 9900-1234
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── Related ── */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold mb-5">Төстэй үйлчилгээнүүд</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((s) => {
                const c = serviceCategories.find((cat) => cat.id === s.categoryId)!;
                return (
                  <button key={s.id} onClick={() => router.push(`/service/${s.id}`)}
                    className="group text-left rounded-2xl border border-border/60 overflow-hidden hover:border-primary/30 hover:shadow-md transition-all">
                    <div className="aspect-video overflow-hidden bg-muted/40">
                      <img src={s.image || "/placeholder.svg"} alt={s.title}
                        className="block w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy" />
                    </div>
                    <div className="p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className={cn("p-1 rounded-lg", c.bg)}>
                          <c.icon className={cn("h-3 w-3", c.color)} />
                        </div>
                        <span className={cn("text-xs font-medium", c.color)}>{c.label}</span>
                      </div>
                      <p className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-1 mb-1">
                        {s.title}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-primary font-bold text-sm">{s.price}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs text-muted-foreground">{s.rating}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}