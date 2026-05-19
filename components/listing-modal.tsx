"use client";

import { useEffect, useState, useCallback } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  BedDouble,
  Bath,
  Square,
  Heart,
  Share2,
  CheckCircle2,
  Star,
  Eye,
  PawPrint,
  Cigarette,
  Baby,
  PartyPopper,
  Tag,
  Wifi,
  Flame,
  Car,
  Coffee,
  Tv,
  Loader2,
  Phone,
  CarFront,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Listing } from "@/app/adds/page";
import { PhoneReveal } from "@/components/phone-reveal";

interface ListingModalProps {
  item: Listing | null;
  onClose: () => void;
  faved: boolean;
  onFave: (id: string) => void;
}

const amenityIcons: Record<string, any> = {
  WiFi: Wifi,
  Барбекю: Flame,
  Зогсоол: Car,
  Кофе: Coffee,
  Телевиз: Tv,
};

const BAY_SUBTYPE_LABELS: Record<string, string> = {
  apartment: "Орон сууц",
  duplex: "Дуплекс",
  penthouse: "Пентхаус",
  townhouse: "Таунхаус",
  house: "Хаус",
  villa: "Вилла",
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="border border-border/60 rounded-2xl overflow-hidden">
    <div className="px-4 py-3 bg-muted/30 border-b border-border/40">
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
        {title}
      </p>
    </div>
    <div className="p-4">{children}</div>
  </div>
);

const Row = ({
  label,
  value,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  accent?: boolean;
}) => (
  <div className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className={cn("text-xs font-semibold", accent && "text-primary")}>
      {value}
    </span>
  </div>
);

export function ListingModal({
  item,
  onClose,
  faved,
  onFave,
}: ListingModalProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [fullData, setFullData] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // ── Detail өгөгдлийг fetch хийх ──
  useEffect(() => {
    if (!item) return;
    setFullData(null);
    setLoadingDetail(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings/${item.id}`)
      .then((r) => r.json())
      .then((data) => setFullData(data))
      .catch((err) => console.error("Detail fetch fail:", err))
      .finally(() => setLoadingDetail(false));
  }, [item]);

  // ── Дэлгэрэнгүй өгөгдөл — fullData нийлэгдсэн item ──
  const data = fullData ?? item;

  const images: string[] = item
    ? [
        ...(item.cover_image ? [item.cover_image] : []),
        ...(item.images || [])
          .filter((img) => img.url !== item.cover_image)
          .map((img) => img.url),
      ].filter(Boolean)
    : [];

  useEffect(() => {
    setActiveIdx(0);
  }, [item]);
  const handleClose = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft")
        setActiveIdx((i) => (i - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") setActiveIdx((i) => (i + 1) % images.length);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [handleClose, images.length]);

  useEffect(() => {
    document.body.style.overflow = item ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [item]);

  if (!item) return null;

  const price = parseFloat(String(item.price_per_day));
  const priceWeek = (data as any)?.price_per_week
    ? parseFloat(String((data as any).price_per_week))
    : null;
  const priceMonth = (data as any)?.price_per_month
    ? parseFloat(String((data as any).price_per_month))
    : null;
  const deposit = (data as any)?.deposit
    ? parseFloat(String((data as any).deposit))
    : null;
  const minNights = (data as any)?.min_nights || 1;
  const checkin = (data as any)?.checkin_time || "14:00";
  const checkout = (data as any)?.checkout_time || "12:00";
  const description = (data as any)?.description || "";
  const isVip = (item as any).is_vip;
  const hasGarage = (data as any)?.has_garage;
  const rating = parseFloat(String(item.avg_rating)) || 0;

  // ── Rules parse ──
  const rules: Record<string, boolean> = (() => {
    const raw = (data as any)?.rules;
    if (!raw) return {};
    if (typeof raw === "string") {
      try {
        return JSON.parse(raw);
      } catch {
        return {};
      }
    }
    return raw;
  })();

  // ── Amenities parse ──
  const amenities: string[] = (() => {
    const raw = (data as any)?.amenities;
    if (!raw) return [];
    if (typeof raw === "string") {
      try {
        return JSON.parse(raw);
      } catch {
        return [];
      }
    }
    return Array.isArray(raw) ? raw : [];
  })();

  const ruleItems = [
    { key: "allow_pets", icon: PawPrint, label: "Амьтан" },
    { key: "allow_smoking", icon: Cigarette, label: "Тамхи" },
    { key: "allow_children", icon: Baby, label: "Хүүхэд" },
    { key: "allow_party", icon: PartyPopper, label: "Найр" },
  ];

  const hasRules = ruleItems.some((r) => rules[r.key] !== undefined);

  // ── Mode flags ──
  const isSell = item.bay_action === "sell";
  const isBay = item.property_category === "bay";
  const isZuslan = item.property_category === "zuslan";
  const isRent = !isSell;
  const paymentTerms: string | null = (data as any)?.payment_terms || null;
  const isDaily = isRent && paymentTerms === "Хоногоор";
  const isMonthly = isRent && !!paymentTerms && paymentTerms !== "Хоногоор";

  // ── Header price + label ──
  const headerPrice = isMonthly && priceMonth ? priceMonth : price;
  const headerLabel = isSell ? "Зарах үнэ" : isMonthly ? "/сар" : "/өдөр";

  // ── Дэлгэрэнгүй location ──
  const detailedLocation =
    isBay && (data as any)?.district
      ? `${(data as any).district}${(data as any)?.khoroo ? `, ${(data as any).khoroo}-р хороо` : ""}`
      : isZuslan && (data as any)?.zuslan_area
        ? (data as any).zuslan_area
        : item.location_name;

  // ── Subtype label ──
  const subtypeLabel = (data as any)?.bay_subtype
    ? BAY_SUBTYPE_LABELS[(data as any).bay_subtype]
    : null;

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={handleClose}
      />

      <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 overflow-y-auto pointer-events-none">
        <div
          className="relative w-full max-w-5xl my-auto bg-background rounded-3xl shadow-2xl pointer-events-auto animate-in fade-in zoom-in-95 duration-250 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-background/90 backdrop-blur-sm border border-border/60 flex items-center justify-center hover:bg-muted transition-colors shadow"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex flex-col lg:flex-row">
            {/* ════════ LEFT COLUMN ════════ */}
            <div className="lg:w-[58%] flex flex-col">
              {/* Gallery */}
              <div
                className="relative overflow-hidden bg-muted"
                style={{ minHeight: 320 }}
              >
                <img
                  key={activeIdx}
                  src={images[activeIdx] || "/placeholder.svg"}
                  alt={item.title}
                  className="block w-full object-cover animate-in fade-in duration-200"
                  style={{ maxHeight: 440 }}
                />

                <div className="absolute top-4 left-4 flex gap-2 z-10">
                  {isVip && (
                    <span
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black text-white"
                      style={{
                        background: "linear-gradient(135deg,#f59e0b,#d97706)",
                        boxShadow: "0 4px 12px rgba(245,158,11,0.4)",
                      }}
                    >
                      <Star className="h-3 w-3 fill-white" /> VIP
                    </span>
                  )}
                  {!isVip && item.is_new && (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-primary text-primary-foreground">
                      ШИНЭ
                    </span>
                  )}
                </div>

                {images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActiveIdx(
                          (i) => (i - 1 + images.length) % images.length,
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm border border-border/40 flex items-center justify-center hover:bg-background transition-colors shadow"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() =>
                        setActiveIdx((i) => (i + 1) % images.length)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm border border-border/40 flex items-center justify-center hover:bg-background transition-colors shadow"
                    >
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
                    <button
                      key={i}
                      onClick={() => setActiveIdx(i)}
                      className={cn(
                        "shrink-0 w-16 h-12 rounded-xl overflow-hidden border-2 transition-all",
                        activeIdx === i
                          ? "border-primary scale-105"
                          : "border-transparent opacity-50 hover:opacity-80",
                      )}
                    >
                      <img
                        src={src}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Title + address */}
              <div className="px-5 py-4 border-b border-border/30">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold leading-snug mb-1">
                      {item.title}
                    </h2>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{detailedLocation}</span>
                      {(data as any)?.address && (
                        <span>· {(data as any).address}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className={cn(
                        "text-2xl font-black",
                        isSell
                          ? "text-rose-600"
                          : isVip
                            ? "text-amber-600"
                            : "text-primary",
                      )}
                    >
                      {headerPrice.toLocaleString()}₮
                    </p>
                    <p
                      className={cn(
                        "text-xs",
                        isSell
                          ? "text-rose-500 font-semibold"
                          : "text-muted-foreground",
                      )}
                    >
                      {headerLabel}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-4 divide-x divide-border/30 border-b border-border/30">
                {[
                  { icon: BedDouble, label: "Өрөө", value: item.rooms },
                  { icon: Bath, label: "Ариун цэвэр", value: item.bathrooms },
                  {
                    icon: Square,
                    label: "Талбай",
                    value: `${parseFloat(String(item.area_sqm))}м²`,
                  },
                  // { icon: Eye, label: "Үзэлт", value: item.view_count },
                  isBay
                    ? {
                        icon: CarFront,
                        label: "Гараж",
                        value: item.has_garage ? "Гаражтай" : "Гаражгүй",
                      }
                    : {
                        icon: Eye,
                        label: "Үзэлт",
                        value: item.has_garage ? "Гаражтай" : "Гаражгүй",
                      },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-1 py-4 px-2"
                  >
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <p className="text-base font-bold">{value}</p>
                    <p className="text-[10px] text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>

              {/* Loading state */}
              {loadingDetail && (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  <span className="text-xs text-muted-foreground ml-2">
                    Дэлгэрэнгүй ачаалж байна...
                  </span>
                </div>
              )}

              {/* Description */}
              {description && (
                <div className="px-5 py-4 border-b border-border/30">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                    Тайлбар
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {description}
                  </p>
                </div>
              )}

              {/* Amenities */}
              {amenities.length > 0 && (
                <div className="px-5 py-4 border-b border-border/30">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
                    Тохижилт
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {amenities.map((a) => {
                      const Icon = amenityIcons[a];
                      return (
                        <span
                          key={a}
                          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-muted border border-border/50 font-medium"
                        >
                          {Icon ? (
                            <Icon className="h-3 w-3 shrink-0 text-primary" />
                          ) : (
                            <CheckCircle2 className="h-3 w-3 shrink-0 text-primary" />
                          )}
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
                    {(item.tags || []).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-1 rounded-full bg-primary/8 text-primary border border-primary/15"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ════════ RIGHT COLUMN ════════ */}
            <div
              className="lg:w-[42%] flex flex-col gap-4 p-5 border-l border-border/40 bg-muted/10 overflow-y-auto"
              style={{ maxHeight: "90vh" }}
            >
              {/* Мэдээлэл */}
              <Section title="Мэдээлэл">
                <Row
                  label="Төрөл"
                  value={
                    isSell
                      ? "💰 Байр зарах"
                      : isBay
                        ? "🔑 Байр түрээс"
                        : "🏕️ Зуслан"
                  }
                />

                {/* Bay-only fields */}
                {isBay && subtypeLabel && (
                  <Row label="Дэд төрөл" value={subtypeLabel} />
                )}
                {isBay && (data as any)?.district && (
                  <Row label="Дүүрэг" value={(data as any).district} />
                )}
                {isBay && (data as any)?.khoroo && (
                  <Row
                    label="Хороо"
                    value={`${(data as any).khoroo}-р хороо`}
                  />
                )}
                {isBay && (data as any)?.built_year && (
                  <Row
                    label="Баригдсан он"
                    value={`${(data as any).built_year} он`}
                  />
                )}
                {isBay &&
                  ((data as any)?.floor || (data as any)?.total_floors) && (
                    <Row
                      label="Давхар"
                      value={`${(data as any)?.floor || "?"} / ${(data as any)?.total_floors || "?"}`}
                    />
                  )}

                {/* Zuslan-only fields */}
                {isZuslan && (data as any)?.zuslan_area && (
                  <Row label="Зуслан газар" value={(data as any).zuslan_area} />
                )}

                {/* Rent-only fields (Bay/Rent + Zuslan) */}
                {isRent && (
                  <>
                    <Row label="Хүний тоо" value={`${item.max_guests} хүн`} />
                    <Row label="Орох цаг" value={checkin} />
                    <Row label="Гарах цаг" value={checkout} />
                  </>
                )}

                {/* Common */}
                <Row label="Үзэлт" value={`${item.view_count} удаа`} />
                {rating > 0 && (
                  <Row
                    label="Үнэлгээ"
                    value={
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {rating.toFixed(1)}
                        {item.review_count > 0 && (
                          <span className="text-muted-foreground font-normal">
                            ({item.review_count})
                          </span>
                        )}
                      </span>
                    }
                  />
                )}
              </Section>

              {/* Үнийн мэдээлэл */}
              <Section title="Үнийн мэдээлэл">
                {/* 💰 SELL */}
                {isSell && (
                  <>
                    <Row
                      label="Зарах үнэ"
                      value={
                        <span className="text-rose-600 font-bold">
                          {price.toLocaleString()}₮
                        </span>
                      }
                      accent
                    />
                    {paymentTerms && (
                      <Row
                        label="Төлбөрийн нөхцөл"
                        value={`💳 ${paymentTerms}`}
                      />
                    )}
                  </>
                )}

                {/* 🗓️ DAILY (Хоногоор) */}
                {isDaily && (
                  <>
                    <Row
                      label="1 өдөр"
                      value={
                        <span className="text-primary font-bold">
                          {price.toLocaleString()}₮
                        </span>
                      }
                      accent
                    />
                    {priceWeek && (
                      <Row
                        label="7 хоног"
                        value={`${priceWeek.toLocaleString()}₮`}
                      />
                    )}
                    {priceMonth && (
                      <Row
                        label="30 хоног"
                        value={`${priceMonth.toLocaleString()}₮`}
                      />
                    )}
                    {deposit && (
                      <Row
                        label="Барьцаа"
                        value={
                          <span className="text-blue-600">
                            {deposit.toLocaleString()}₮
                          </span>
                        }
                      />
                    )}
                  </>
                )}

                {/* 📅 MONTHLY (1+1, 3+1, ...) */}
                {isMonthly && (
                  <>
                    <Row
                      label="Сарын түрээс"
                      value={
                        <span className="text-primary font-bold">
                          {(priceMonth || price).toLocaleString()}₮
                        </span>
                      }
                      accent
                    />
                    {deposit && (
                      <Row
                        label="Барьцаа"
                        value={
                          <span className="text-blue-600">
                            {deposit.toLocaleString()}₮
                          </span>
                        }
                      />
                    )}
                    {paymentTerms && (
                      <Row
                        label="Нөхцөл"
                        value={
                          <span className="text-amber-600 font-semibold">
                            {paymentTerms}
                          </span>
                        }
                      />
                    )}
                  </>
                )}

                {/* Хэрэв payment_terms алга бол хуучин үзэгдэл (fallback) */}
                {!isSell && !isDaily && !isMonthly && (
                  <>
                    <Row
                      label="1 өдөр"
                      value={
                        <span className="text-primary font-bold">
                          {price.toLocaleString()}₮
                        </span>
                      }
                      accent
                    />
                    {priceWeek && (
                      <Row
                        label="7 хоног"
                        value={`${priceWeek.toLocaleString()}₮`}
                      />
                    )}
                    {priceMonth && (
                      <Row
                        label="30 хоног"
                        value={`${priceMonth.toLocaleString()}₮`}
                      />
                    )}
                    {deposit && (
                      <Row
                        label="Барьцаа"
                        value={
                          <span className="text-blue-600">
                            {deposit.toLocaleString()}₮
                          </span>
                        }
                      />
                    )}
                  </>
                )}
              </Section>

              {/* Байрны дүрэм */}
              {!isSell && hasRules && (
                <Section title="Байрны дүрэм">
                  <div className="grid grid-cols-2 gap-1.5">
                    {ruleItems.map(({ key, icon: Icon, label }) => {
                      const allowed = rules[key];
                      if (allowed === undefined) return null;
                      return (
                        <div
                          key={key}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border",
                            allowed
                              ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200/60 text-emerald-700"
                              : "bg-muted/40 border-border/40 text-muted-foreground opacity-60",
                          )}
                        >
                          <Icon className="h-3.5 w-3.5 shrink-0" />
                          <span className={!allowed ? "line-through" : ""}>
                            {label}
                          </span>
                          <span className="ml-auto">{allowed ? "✓" : "✗"}</span>
                        </div>
                      );
                    })}
                  </div>
                </Section>
              )}

              {/* Availability */}
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-3.5 rounded-2xl border",
                  isSell
                    ? "bg-rose-50 dark:bg-rose-950/30 border-rose-200/50"
                    : "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/50",
                )}
              >
                <div
                  className={cn(
                    "w-2.5 h-2.5 rounded-full animate-pulse shrink-0",
                    isSell ? "bg-rose-500" : "bg-emerald-500",
                  )}
                />
                <div className="flex-1">
                  <p
                    className={cn(
                      "text-xs font-bold",
                      isSell
                        ? "text-rose-700 dark:text-rose-400"
                        : "text-emerald-700 dark:text-emerald-400",
                    )}
                  >
                    {isSell ? "Зарагдаж байна" : "Захиалах боломжтой"}
                  </p>
                  <p
                    className={cn(
                      "text-[11px] mt-0.5",
                      isSell ? "text-rose-600/70" : "text-emerald-600/70",
                    )}
                  >
                    {isSell
                      ? "Эзэмшигчтэй холбогдоно уу"
                      : isMonthly
                        ? `${paymentTerms || "Сараар"} нөхцөлөөр`
                        : `Хамгийн бага ${minNights} шөнө`}
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="space-y-2 pt-1">
                {item.phone && (
                  <div className="flex justify-center">
                    <PhoneReveal phone={item.phone} size="md" />
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => onFave(item.id)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold border transition-all",
                      faved
                        ? "bg-red-50 border-red-200 text-red-600 dark:bg-red-950/20"
                        : "border-border/60 bg-muted/40 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Heart
                      className={cn(
                        "h-4 w-4",
                        faved && "fill-red-500 text-red-500",
                      )}
                    />
                    {faved ? "Хадгалсан" : "Хадгалах"}
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold border border-border/60 bg-muted/40 text-muted-foreground hover:text-foreground transition-all"
                  >
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
