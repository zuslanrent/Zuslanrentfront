"use client";

import { useEffect, useState, useCallback } from "react";
import {
  X, ChevronLeft, ChevronRight, MapPin,
  BedDouble, Bath, Square, Phone, Heart,
  Share2, CheckCircle2, Star, Eye, Users,
  Clock, Moon, PawPrint, Cigarette, Baby, PartyPopper,
  ShieldCheck, CreditCard, Tag, Building2,
  Wifi, Flame, Car, Coffee, Tv, Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Listing } from "@/app/adds/page";

interface ListingModalProps {
  item:    Listing | null;
  onClose: () => void;
  faved:   boolean;
  onFave:  (id: string) => void;
}

const amenityIcons: Record<string, any> = {
  "WiFi": Wifi, "Барбекю": Flame, "Зогсоол": Car,
  "Кофе": Coffee, "Телевиз": Tv,
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="border border-border/60 rounded-2xl overflow-hidden">
    <div className="px-4 py-3 bg-muted/30 border-b border-border/40">
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{title}</p>
    </div>
    <div className="p-4">{children}</div>
  </div>
);

const Row = ({ label, value, accent }: { label: string; value: React.ReactNode; accent?: boolean }) => (
  <div className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className={cn("text-xs font-semibold", accent && "text-primary")}>{value}</span>
  </div>
);

export function ListingModal({ item, onClose, faved, onFave }: ListingModalProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [copied,    setCopied]    = useState(false);

  const images: string[] = item
    ? [
        ...(item.cover_image ? [item.cover_image] : []),
        ...(item.images || [])
          .filter(img => img.url !== item.cover_image)
          .map(img => img.url),
      ].filter(Boolean)
    : [];

  useEffect(() => { setActiveIdx(0); }, [item]);
  const handleClose = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")      handleClose();
      if (e.key === "ArrowLeft")  setActiveIdx(i => (i - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") setActiveIdx(i => (i + 1) % images.length);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [handleClose, images.length]);

  useEffect(() => {
    document.body.style.overflow = item ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [item]);

  if (!item) return null;

  const price      = parseFloat(String(item.price_per_day));
  const priceWeek  = (item as any).price_per_week  ? parseFloat(String((item as any).price_per_week))  : null;
  const priceMonth = (item as any).price_per_month ? parseFloat(String((item as any).price_per_month)) : null;
  const deposit    = (item as any).deposit         ? parseFloat(String((item as any).deposit))         : null;
  const minNights  = (item as any).min_nights      || 1;
  const checkin    = (item as any).checkin_time    || "14:00";
  const checkout   = (item as any).checkout_time   || "12:00";
  const rules      = (item as any).rules           || {};
  const description= (item as any).description     || "";
  const plan       = (item as any).plan            || "standard";
  const planPrice  = (item as any).plan_price      || 0;
  const expiresAt  = (item as any).expires_at;
  const isVip      = (item as any).is_vip;
  const rating     = parseFloat(String(item.avg_rating)) || 0;

  const amenities: string[] = (() => {
    const raw = (item as any).amenities;
    if (!raw) return [];
    if (typeof raw === "string") { try { return JSON.parse(raw); } catch { return []; } }
    return Array.isArray(raw) ? raw : [];
  })();

  const expiryDays = expiresAt
    ? Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 86400000)
    : null;

  const ruleItems = [
    { key: "allow_pets",     icon: PawPrint,    label: "Амьтан"  },
    { key: "allow_smoking",  icon: Cigarette,   label: "Тамхи"   },
    { key: "allow_children", icon: Baby,        label: "Хүүхэд"  },
    { key: "allow_party",    icon: PartyPopper, label: "Найр"    },
  ];

  const hasRules = ruleItems.some(r => rules[r.key] !== undefined);

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200" onClick={handleClose} />

      <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 overflow-y-auto pointer-events-none">
        <div
          className="relative w-full max-w-5xl my-auto bg-background rounded-3xl shadow-2xl pointer-events-auto animate-in fade-in zoom-in-95 duration-250 overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* ── Close ── */}
          <button onClick={handleClose}
            className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-background/90 backdrop-blur-sm border border-border/60 flex items-center justify-center hover:bg-muted transition-colors shadow">
            <X className="h-4 w-4" />
          </button>

          <div className="flex flex-col lg:flex-row">

            {/* ════════ LEFT COLUMN ════════ */}
            <div className="lg:w-[58%] flex flex-col">

              {/* Gallery */}
              <div className="relative overflow-hidden bg-muted" style={{ minHeight: 320 }}>
                <img
                  key={activeIdx}
                  src={images[activeIdx] || "/placeholder.svg"}
                  alt={item.title}
                  className="block w-full object-cover animate-in fade-in duration-200"
                  style={{ maxHeight: 440 }}
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2 z-10">
                  {isVip && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black text-white"
                      style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)", boxShadow: "0 4px 12px rgba(245,158,11,0.4)" }}>
                      <Star className="h-3 w-3 fill-white" /> VIP
                    </span>
                  )}
                  {!isVip && item.is_new && <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-primary text-primary-foreground">ШИНЭ</span>}
                </div>

                {/* Nav */}
                {images.length > 1 && (
                  <>
                    <button onClick={() => setActiveIdx(i => (i - 1 + images.length) % images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm border border-border/40 flex items-center justify-center hover:bg-background transition-colors shadow">
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button onClick={() => setActiveIdx(i => (i + 1) % images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm border border-border/40 flex items-center justify-center hover:bg-background transition-colors shadow">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-3 right-3 text-[11px] px-2.5 py-1 rounded-full bg-black/50 text-white backdrop-blur-sm">
                      {activeIdx + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto border-b border-border/30 bg-muted/20">
                  {images.map((src, i) => (
                    <button key={i} onClick={() => setActiveIdx(i)}
                      className={cn("shrink-0 w-16 h-12 rounded-xl overflow-hidden border-2 transition-all",
                        activeIdx === i ? "border-primary scale-105" : "border-transparent opacity-50 hover:opacity-80")}>
                      <img src={src} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Title + address */}
              <div className="px-5 py-4 border-b border-border/30">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold leading-snug mb-1">{item.title}</h2>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{item.location_name}</span>
                      {(item as any).address && <span>· {(item as any).address}</span>}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={cn("text-2xl font-black", isVip ? "text-amber-600" : "text-primary")}>
                      {price.toLocaleString()}₮
                    </p>
                    <p className="text-xs text-muted-foreground">/өдөр</p>
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-4 divide-x divide-border/30 border-b border-border/30">
                {[
                  { icon: BedDouble, label: "Өрөө",       value: item.rooms       },
                  { icon: Bath,      label: "Ариун цэвэр", value: item.bathrooms   },
                  { icon: Square,    label: "Талбай",       value: `${parseFloat(String(item.area_sqm))}м²` },
                  { icon: Eye,       label: "Үзэлт",        value: item.view_count  },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex flex-col items-center gap-1 py-4 px-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <p className="text-base font-bold">{value}</p>
                    <p className="text-[10px] text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>

              {/* Description */}
              {description && (
                <div className="px-5 py-4 border-b border-border/30">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Тайлбар</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                </div>
              )}

              {/* Amenities */}
              {amenities.length > 0 && (
                <div className="px-5 py-4 border-b border-border/30">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Тохижилт</p>
                  <div className="flex flex-wrap gap-2">
                    {amenities.map(a => {
                      const Icon = amenityIcons[a];
                      return (
                        <span key={a} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-muted border border-border/50 font-medium">
                          {Icon ? <Icon className="h-3 w-3 shrink-0 text-primary" /> : <CheckCircle2 className="h-3 w-3 shrink-0 text-primary" />}
                          {a}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tags */}
              {(item.tags || []).length > 0 && (
                <div className="px-5 py-4">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5" /> Шошгонууд
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(item.tags || []).map(tag => (
                      <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-primary/8 text-primary border border-primary/15">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ════════ RIGHT COLUMN ════════ */}
            <div className="lg:w-[42%] flex flex-col gap-4 p-5 border-l border-border/40 bg-muted/10 overflow-y-auto" style={{ maxHeight: "90vh" }}>

              {/* Мэдээлэл */}
              <Section title="Мэдээлэл">
                <Row label="Ангилал"       value={item.category_name || "—"} />
                <Row label="Үзэлт"         value={`${item.view_count} удаа`} />
                {rating > 0 && (
                  <Row label="Үнэлгээ" value={
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {rating.toFixed(1)}
                      {item.review_count > 0 && <span className="text-muted-foreground font-normal">({item.review_count})</span>}
                    </span>
                  } />
                )}
                <Row label="Хүний тоо"    value={`${item.max_guests} хүн`} />
                <Row label="Check-in"      value={checkin} />
                <Row label="Check-out"     value={checkout} />
                <Row label="Хамгийн бага"  value={`${minNights} шөнө`} />
              </Section>

              {/* Үнийн мэдээлэл */}
              <Section title="Үнийн мэдээлэл">
                <Row label="1 өдөр"  value={<span className="text-primary font-bold">{price.toLocaleString()}₮</span>} accent />
                {priceWeek  && <Row label="7 хоног"  value={`${priceWeek.toLocaleString()}₮`} />}
                {priceMonth && <Row label="30 хоног" value={`${priceMonth.toLocaleString()}₮`} />}
                {deposit    && <Row label="Баталгааны мөнгө" value={<span className="text-blue-600">{deposit.toLocaleString()}₮</span>} />}
              </Section>

              {/* Зарын багц */}
              {plan && (
                <Section title="Зарын багц">
                  <Row label="Төрөл"    value={
                    <span className={cn("flex items-center gap-1",
                      isVip ? "text-amber-600" : "text-muted-foreground")}>
                      {isVip && <Star className="h-3 w-3 fill-amber-500" />}
                      {isVip ? "VIP зар" : "Энгийн"}
                    </span>
                  } />
                  {planPrice > 0 && <Row label="Төлсөн дүн" value={`${planPrice.toLocaleString()}₮`} />}
                  {expiresAt && (
                    <Row label="Дуусах огноо" value={
                      <span className={cn("font-semibold",
                        expiryDays !== null && expiryDays <= 0 ? "text-destructive" :
                        expiryDays !== null && expiryDays <= 3 ? "text-amber-600" : "text-emerald-600")}>
                        {expiryDays !== null && expiryDays <= 0
                          ? "Хугацаа дууссан"
                          : `${expiryDays} хоног үлдсэн`}
                      </span>
                    } />
                  )}
                </Section>
              )}

              {/* Байрны дүрэм */}
              {hasRules && (
                <Section title="Байрны дүрэм">
                  <div className="grid grid-cols-2 gap-1.5">
                    {ruleItems.map(({ key, icon: Icon, label }) => {
                      const allowed = rules[key];
                      if (allowed === undefined) return null;
                      return (
                        <div key={key} className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border",
                          allowed
                            ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200/60 text-emerald-700"
                            : "bg-muted/40 border-border/40 text-muted-foreground opacity-60"
                        )}>
                          <Icon className="h-3.5 w-3.5 shrink-0" />
                          <span className={!allowed ? "line-through" : ""}>{label}</span>
                          <span className="ml-auto">{allowed ? "✓" : "✗"}</span>
                        </div>
                      );
                    })}
                  </div>
                </Section>
              )}

              {/* Availability */}
              <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Захиалах боломжтой</p>
                  <p className="text-[11px] text-emerald-600/70 mt-0.5">Хамгийн бага {minNights} шөнө</p>
                </div>
              </div>

              {/* CTA */}
              <div className="space-y-2 pt-1">
                {item.phone && (
                  <a href={`tel:${item.phone}`}>
                    <button className={cn(
                      "w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-bold text-sm transition-all",
                      isVip
                        ? "text-white"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                    style={isVip ? {
                      background: "linear-gradient(135deg, #f59e0b, #d97706)",
                      boxShadow: "0 8px 24px rgba(245,158,11,0.3)",
                    } : undefined}>
                      <Phone className="h-4 w-4" />
                      {item.phone} — Залгах
                    </button>
                  </a>
                )}
                <div className="flex gap-2">
                  <button onClick={() => onFave(item.id)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold border transition-all",
                      faved
                        ? "bg-red-50 border-red-200 text-red-600 dark:bg-red-950/20"
                        : "border-border/60 bg-muted/40 text-muted-foreground hover:text-foreground"
                    )}>
                    <Heart className={cn("h-4 w-4", faved && "fill-red-500 text-red-500")} />
                    {faved ? "Хадгалсан" : "Хадгалах"}
                  </button>
                  <button onClick={handleShare}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold border border-border/60 bg-muted/40 text-muted-foreground hover:text-foreground transition-all">
                    <Share2 className="h-4 w-4" />
                    {copied ? "✓ Хуулагдлаа" : "Хуваалцах"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}