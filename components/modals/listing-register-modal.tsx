"use client";

import { useState, useEffect } from "react";
import {
  X,
  Phone,
  BedDouble,
  Bath,
  Square,
  Tag,
  ChevronRight,
  CheckCircle2,
  Loader2,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ImageUploader, type UploadedImage } from "./image-uploader";
import { useAuth } from "@/components/auth/auth-provider";
import { FreeLimitPopover } from "@/components/modals/free-limit-popover";
import { PaymentInfoPopover } from "@/components/modals/payment-info-popover";
import {
  Step2PropertyInfo,
  emptyStep2Data,
  type Step2Data,
} from "./step2-property-info";

const BAY_PROPERTY_AMENITIES = [
  "Нийтийн эзэмшлийн талбай",
  "Бүтэн тавилгатай",
  "Хагас тавилгатай",
  "Суурилуулсан тавилгатай",
  "Улсын сургууль",
  "Улсын цэцэрлэг",
  "Хувийн сургууль",
  "Хувийн цэцэрлэг",
  "Цэцэрлэгт хүрээлэн",
];

const BAY_RENT_AMENITIES = ["WiFi", "Зогсоол", "Хөргөгч", "Телевиз", "Угаалга"];

const ZUSLAN_AMENITIES = [
  "WiFi",
  "Барбекю",
  "Зогсоол",
  "Саун",
  "Тоглоомын талбай",
  "Хөргөгч",
  "Телевиз",
  "Угаалгын машин",
];

const BAY_SUBTYPES = [
  { id: "apartment", label: "Орон сууц" },
  { id: "duplex", label: "Дуплекс" },
  { id: "penthouse", label: "Пентхаус" },
  { id: "townhouse", label: "Таунхаус" },
  { id: "house", label: "Хаус" },
  { id: "villa", label: "Вилла" },
];

const SELL_PAYMENT_TERMS = ["100%", "Банк зээл", "Урьдчилгаа + Хүүгүй зээл"];
const RENT_PAYMENT_TERMS = ["Хоногоор", "1+1", "3+1", "6+1", "12+1"];

type Step = 1 | 2 | 3 | 4 | 5 | 6;

interface Props {
  open: boolean;
  onClose: () => void;
}

interface Location {
  id: number;
  name: string;
  slug: string;
}

const STANDARD_PRICES: Record<number, number> = {
  24: 0,
  7: 5000,
  14: 8000,
  30: 15000,
};
const VIP_PRICES: Record<number, number> = {
  7: 15000,
  14: 25000,
  30: 45000,
};

// ── step2Data → backend category_id mapping ──
// 1 = apartment (Орон сууц), 2 = camp (Зуслан)
function deriveCategoryId(category: "bay" | "zuslan" | null): number {
  if (category === "zuslan") return 2;
  return 1; // bay (apartment/Орон сууц)
}

export function ListingRegisterModal({ open, onClose }: Props) {
  const { token, user } = useAuth();

  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [listingType, setListingType] = useState<"standard" | "vip">(
    "standard",
  );
  const [packageDays, setPackageDays] = useState<24 | 7 | 14 | 30>(7);
  const [step2Data, setStep2Data] = useState<Step2Data>(emptyStep2Data);
  const [form, setForm] = useState({
    price_per_day: "",
    rooms: "1",
    bathrooms: "1",
    area_sqm: "",
    max_guests: "2",
    amenities: [] as string[],
    description: "",
    phone: "",
    tags: "",
    price_per_week: "",
    price_per_month: "",
    deposit: "",
    min_nights: "1",
    checkin_time: "14:00",
    checkout_time: "12:00",
    allow_pets: "false",
    allow_smoking: "false",
    allow_children: "true",
    allow_party: "false",
    has_garage: "false",
    bay_subtype: "",
    payment_terms: "",
    built_year: "",
    floor: "",
    total_floors: "",
  });
  const [showFreeLimitPopover, setShowFreeLimitPopover] = useState(false);
  const [showPaymentPopover, setShowPaymentPopover] = useState(false);
  const [paidAmount, setPaidAmount] = useState(0);

  // Locations ачааллах (zuslan area-уудыг location_id-аар match хийхэд хэрэгтэй)
  useEffect(() => {
    if (!open) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/locations`)
      .then((r) => r.json())
      .then((data) =>
        setLocations(Array.isArray(data) ? data : data.data || []),
      )
      .catch(console.error);
  }, [open]);

  // Modal нээгдэх үед reset
  useEffect(() => {
    if (!open) return;
    setStep(1);
    setSubmitted(false);
    setLoading(false);
    setError("");
    setImages([]);
    setStep2Data(emptyStep2Data);
    setForm({
      price_per_day: "",
      rooms: "1",
      bathrooms: "1",
      area_sqm: "",
      max_guests: "2",
      amenities: [],
      description: "",
      phone: user?.phone || "",
      tags: "",
      price_per_week: "",
      price_per_month: "",
      deposit: "",
      min_nights: "1",
      checkin_time: "14:00",
      checkout_time: "12:00",
      allow_pets: "false",
      allow_smoking: "false",
      allow_children: "true",
      allow_party: "false",
      has_garage: "false",
      bay_subtype: "",
      payment_terms: "",
      built_year: "",
      floor: "",
      total_floors: "",
    });
  }, [open, user]);

  useEffect(() => {
    if (user?.phone) {
      setForm((p) => ({ ...p, phone: user.phone }));
    }
  }, [user]);

  // ── Step 3-д орохдоо автоматаар payment_terms тогтоох ──
  useEffect(() => {
    if (step === 3 && !form.payment_terms) {
      const sell =
        step2Data.category === "bay" && step2Data.bayAction === "sell";
      const rent =
        step2Data.category === "zuslan" ||
        (step2Data.category === "bay" && step2Data.bayAction === "rent");
      if (sell) setForm((p) => ({ ...p, payment_terms: "100%" }));
      else if (rent) setForm((p) => ({ ...p, payment_terms: "Хоногоор" }));
    }
  }, [step, step2Data.category, step2Data.bayAction, form.payment_terms]);

  if (!open) return null;

  if (!open) return null;

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const setMoney = (k: string, v: string) => {
    const raw = v.replace(/[^0-9]/g, "");
    setForm((p) => ({ ...p, [k]: raw }));
  };

  // ── Mode flags (зөв логиктой) ──
  const isBay = step2Data.category === "bay";
  const isZuslan = step2Data.category === "zuslan";
  const isSell = isBay && step2Data.bayAction === "sell";
  const isRent = isZuslan || (isBay && step2Data.bayAction === "rent");
  const isDaily = isRent && form.payment_terms === "Хоногоор";
  const isMonthly =
    isRent && !!form.payment_terms && form.payment_terms !== "Хоногоор";

  // ── Mode-д тохирох тохижилтыг буцаах ──
  const getActiveAmenities = (): string[] => {
    if (isSell) return BAY_PROPERTY_AMENITIES;
    if (isBay && isRent)
      return [...BAY_RENT_AMENITIES, ...BAY_PROPERTY_AMENITIES];
    if (isZuslan) return ZUSLAN_AMENITIES;
    return [];
  };

  const toggleAmenity = (a: string) =>
    setForm((p) => ({
      ...p,
      amenities: p.amenities.includes(a)
        ? p.amenities.filter((x) => x !== a)
        : [...p.amenities, a],
    }));

  const canNext = () => {
    if (step === 1) return images.length > 0;
    if (step === 2) {
      if (!step2Data.category) return false;
      if (!step2Data.title.trim()) return false;
      if (step2Data.category === "bay") {
        if (!step2Data.bayAction) return false;
        if (!step2Data.district || !step2Data.khoroo) return false;
      }
      if (step2Data.category === "zuslan" && !step2Data.zuslanArea)
        return false;
      return true;
    }
    if (step === 3) {
      if (!form.payment_terms || !form.area_sqm) return false;
      if (isSell) return !!form.price_per_day;
      if (isDaily) return !!form.price_per_day;
      if (isMonthly) return !!form.price_per_month && !!form.deposit;
      return false;
    }
    if (step === 4) return form.description.length >= 20;
    if (step === 5) return !!form.phone;
    if (step === 6) return true;
    return false;
  };

  // ── Backend-д илгээх location_id болон хаягийг бэлдэх ──
  const buildLocationPayload = () => {
    let location_id: number | null = null;
    let fullAddress = step2Data.address;

    if (step2Data.category === "zuslan" && step2Data.zuslanArea) {
      // Zuslan: нэрээр locations table-аас id олох
      location_id =
        locations.find((l) => l.name === step2Data.zuslanArea)?.id ?? null;
    } else if (step2Data.category === "bay" && step2Data.district) {
      // Bay: дүүрэгээр locations-оос id олох (хэрэв locations-д байгаа бол)
      location_id =
        locations.find((l) => l.name === step2Data.district)?.id ?? null;
      // Full address-д дүүрэг+хороо нэмэх
      fullAddress = `${step2Data.district} дүүрэг, ${step2Data.khoroo}-р хороо${
        step2Data.address ? ", " + step2Data.address : ""
      }`;
    }

    return { location_id, fullAddress };
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const imagesPayload = images.map((img, i) => ({
        url: img.url,
        is_cover: i === 0,
        sort_order: i,
      }));

      const { location_id, fullAddress } = buildLocationPayload();
      // Monthly mode-д price_per_day-ийг тооцоолох (backend шаардлагатай)
      const finalPricePerDay =
        isMonthly && form.price_per_month
          ? Math.round(parseInt(form.price_per_month) / 30)
          : parseInt(form.price_per_day || "0");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/listings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            // ── Step 2 (mapped) ──
            category_id: deriveCategoryId(step2Data.category),
            location_id,
            title: step2Data.title,
            address: fullAddress,

            // ── Шинэ Step 2 field-үүд (backend дэмжиж байгаа бол хадгална) ──
            property_category: step2Data.category,
            bay_action: step2Data.bayAction,
            district: step2Data.district,
            khoroo: step2Data.khoroo,
            zuslan_area: step2Data.zuslanArea,

            // ── Бусад form field-үүд ──
            description: form.description,
            price_per_day: finalPricePerDay,
            area_sqm: parseInt(form.area_sqm),
            rooms: parseInt(form.rooms),
            bathrooms: parseInt(form.bathrooms),
            max_guests: parseInt(form.max_guests),
            amenities: form.amenities,
            phone: form.phone,
            tags: form.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean),
            images: imagesPayload,
            price_per_week: form.price_per_week
              ? parseInt(form.price_per_week)
              : null,
            price_per_month: form.price_per_month
              ? parseInt(form.price_per_month)
              : null,
            deposit: form.deposit ? parseInt(form.deposit) : null,
            min_nights: parseInt(form.min_nights),
            checkin_time: form.checkin_time,
            checkout_time: form.checkout_time,
            rules: {
              allow_pets: form.allow_pets === "true",
              allow_smoking: form.allow_smoking === "true",
              // allow_children: form.allow_children === "true",
              allow_party: form.allow_party === "true",
              has_garage: form.has_garage === "true",
            },
            bay_subtype: form.bay_subtype || null,
            payment_terms: form.payment_terms || null,
            built_year: form.built_year ? parseInt(form.built_year) : null,
            floor: form.floor ? parseInt(form.floor) : null,
            total_floors: form.total_floors
              ? parseInt(form.total_floors)
              : null,
            listing_type: listingType,
            package_days: packageDays,
          }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 403 && data.error?.includes("24 цагийн үнэгүй")) {
          setShowFreeLimitPopover(true);
          setLoading(false);
          return;
        }
        throw new Error(data.error || "Алдаа гарлаа");
      }

      const finalPrice =
        listingType === "vip"
          ? (VIP_PRICES[packageDays] ?? 0)
          : (STANDARD_PRICES[packageDays] ?? 0);

      setSubmitted(true);
      if (finalPrice > 0) {
        setPaidAmount(finalPrice);
        setShowPaymentPopover(true);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    "Зурагнууд",
    "Мэдээлэл",
    "Үнэ & Хэмжээ",
    "Тохижилт",
    "Холбоо",
    "Багц",
  ];

  // ── Summary-д харуулах location текст ──
  const getLocationDisplay = () => {
    if (step2Data.category === "zuslan") return step2Data.zuslanArea || "—";
    if (step2Data.category === "bay") {
      return `${step2Data.district || ""}, ${step2Data.khoroo}-р хороо`;
    }
    return "—";
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-300 w-full max-w-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative w-full max-h-[88vh] flex flex-col bg-background rounded-2xl shadow-2xl border border-border/60">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border/50 shrink-0">
              <div>
                <h2 className="text-lg font-bold">🏠 Шинэ зар үүсгэх</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {submitted
                    ? "Амжилттай!"
                    : `${step}-р алхам / ${steps.length}`}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Step bar */}
            {!submitted && (
              <div className="flex items-center gap-0 px-6 py-3 border-b border-border/30 shrink-0 overflow-x-auto">
                {steps.map((s, i) => (
                  <div key={i} className="flex items-center flex-1 min-w-0">
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <div
                        className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                          step > i + 1
                            ? "bg-primary text-primary-foreground"
                            : step === i + 1
                              ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                              : "bg-muted text-muted-foreground",
                        )}
                      >
                        {step > i + 1 ? "✓" : i + 1}
                      </div>
                      <span
                        className={cn(
                          "text-[10px] whitespace-nowrap hidden sm:block",
                          step === i + 1
                            ? "text-primary font-semibold"
                            : "text-muted-foreground",
                        )}
                      >
                        {s}
                      </span>
                    </div>
                    {i < steps.length - 1 && (
                      <div
                        className={cn(
                          "flex-1 h-0.5 mx-1 mb-4 rounded transition-all",
                          step > i + 1 ? "bg-primary" : "bg-border",
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {/* SUCCESS */}
              {submitted && (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    Зар амжилттай илгээгдлээ!
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    {paidAmount > 0
                      ? "Төлбөр төлөгдсөний дараа зар автоматаар идэвхжинэ."
                      : "Таны зар шалгагдаж, удахгүй нийтлэгдэх болно."}
                  </p>
                  <Button className="mt-5" onClick={onClose}>
                    Хаах
                  </Button>
                </div>
              )}

              {/* STEP 1 — Зурагнууд */}
              {!submitted && step === 1 && (
                <ImageUploader
                  images={images}
                  onChange={setImages}
                  maxImages={8}
                />
              )}

              {/* STEP 2 — Мэдээлэл (ШИНЭ ШИНЭЧИЛСЭН) */}
              {!submitted && step === 2 && (
                <Step2PropertyInfo data={step2Data} onChange={setStep2Data} />
              )}

              {!submitted && step === 3 && (
                <div className="space-y-5">
                  {/* ── BAY ONLY: Дэд төрөл + Барилгын мэдээлэл ── */}
                  {isBay && (
                    <>
                      <div>
                        <label className="text-sm font-semibold mb-2 block">
                          Дэд төрөл <span className="text-destructive">*</span>
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {BAY_SUBTYPES.map(({ id, label }) => (
                            <button
                              key={id}
                              onClick={() => set("bay_subtype", id)}
                              className={cn(
                                "py-2 px-3 rounded-xl text-xs font-semibold border transition-all",
                                form.bay_subtype === id
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "border-border/60 text-muted-foreground hover:border-primary/40",
                              )}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs font-semibold mb-1.5 block">
                            Баригдсан он
                          </label>
                          <input
                            type="number"
                            value={form.built_year}
                            onChange={(e) => set("built_year", e.target.value)}
                            placeholder="2020"
                            className="w-full px-3 py-2 text-sm bg-muted/50 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold mb-1.5 block">
                            Давхар
                          </label>
                          <input
                            type="number"
                            value={form.floor}
                            onChange={(e) => set("floor", e.target.value)}
                            placeholder="5"
                            className="w-full px-3 py-2 text-sm bg-muted/50 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold mb-1.5 block">
                            Нийт давхар
                          </label>
                          <input
                            type="number"
                            value={form.total_floors}
                            onChange={(e) =>
                              set("total_floors", e.target.value)
                            }
                            placeholder="12"
                            className="w-full px-3 py-2 text-sm bg-muted/50 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* ── Төлбөрийн нөхцөл (бүх mode-д) ── */}
                  <div>
                    <label className="text-sm font-semibold mb-2 block">
                      Төлбөрийн нөхцөл{" "}
                      <span className="text-destructive">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(isSell ? SELL_PAYMENT_TERMS : RENT_PAYMENT_TERMS).map(
                        (term) => (
                          <button
                            key={term}
                            onClick={() => set("payment_terms", term)}
                            className={cn(
                              "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                              form.payment_terms === term
                                ? "bg-primary text-primary-foreground border-primary"
                                : "border-border/60 text-muted-foreground hover:border-primary/40",
                            )}
                          >
                            {term}
                          </button>
                        ),
                      )}
                    </div>
                  </div>

                  {/* ── Үнийн мэдээлэл — Mode-н дагуу ── */}
                  <div>
                    <label className="text-sm font-semibold mb-3 block">
                      Үнийн мэдээлэл <span className="text-destructive">*</span>
                    </label>

                    {/* 💰 SELL: Зарах үнэ ганцхан */}
                    {isSell && (
                      <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 rounded-full bg-rose-500" />
                          <span className="text-xs font-semibold">
                            Зарах үнэ
                          </span>
                          <span className="text-destructive text-xs">*</span>
                        </div>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                            ₮
                          </span>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={
                              form.price_per_day
                                ? parseInt(form.price_per_day).toLocaleString()
                                : ""
                            }
                            onChange={(e) =>
                              setMoney("price_per_day", e.target.value)
                            }
                            placeholder="350,000,000"
                            className="w-full pl-8 pr-4 py-2.5 text-sm bg-background border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                        </div>
                      </div>
                    )}

                    {/* 🗓️ DAILY (Хоногоор) */}
                    {isDaily && (
                      <div className="grid grid-cols-1 gap-3">
                        <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <span className="text-xs font-semibold">
                              Өдрийн үнэ
                            </span>
                            <span className="text-destructive text-xs">*</span>
                          </div>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                              ₮
                            </span>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={
                                form.price_per_day
                                  ? parseInt(
                                      form.price_per_day,
                                    ).toLocaleString()
                                  : ""
                              }
                              onChange={(e) =>
                                setMoney("price_per_day", e.target.value)
                              }
                              placeholder="150,000"
                              className="w-full pl-8 pr-4 py-2.5 text-sm bg-background border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                          </div>
                        </div>
                        <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <span className="text-xs font-semibold">
                              Барьцаа
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              (заавал биш)
                            </span>
                          </div>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                              ₮
                            </span>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={
                                form.deposit
                                  ? parseInt(form.deposit).toLocaleString()
                                  : ""
                              }
                              onChange={(e) =>
                                setMoney("deposit", e.target.value)
                              }
                              placeholder="100,000"
                              className="w-full pl-8 pr-4 py-2.5 text-sm bg-background border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 📅 MONTHLY (1+1, 3+1, 6+1, 12+1) */}
                    {isMonthly && (
                      <div className="grid grid-cols-1 gap-3">
                        <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-amber-500" />
                            <span className="text-xs font-semibold">
                              Сарын түрээс
                            </span>
                            <span className="text-destructive text-xs">*</span>
                          </div>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                              ₮
                            </span>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={
                                form.price_per_month
                                  ? parseInt(
                                      form.price_per_month,
                                    ).toLocaleString()
                                  : ""
                              }
                              onChange={(e) =>
                                setMoney("price_per_month", e.target.value)
                              }
                              placeholder="2,500,000"
                              className="w-full pl-8 pr-4 py-2.5 text-sm bg-background border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <span className="text-xs font-semibold">
                              Барьцаа
                            </span>
                            <span className="text-destructive text-xs">*</span>
                          </div>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                              ₮
                            </span>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={
                                form.deposit
                                  ? parseInt(form.deposit).toLocaleString()
                                  : ""
                              }
                              onChange={(e) =>
                                setMoney("deposit", e.target.value)
                              }
                              placeholder={
                                form.price_per_month && form.payment_terms
                                  ? (
                                      parseInt(form.price_per_month) *
                                      parseInt(form.payment_terms.split("+")[0])
                                    ).toLocaleString()
                                  : "5,000,000"
                              }
                              className="w-full pl-8 pr-4 py-2.5 text-sm bg-background border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                          </div>
                          {form.payment_terms && (
                            <p className="text-xs text-amber-700 mt-1.5">
                              💡 {form.payment_terms}:{" "}
                              {form.payment_terms.split("+")[0]} сарын барьцаа +
                              1 сар урьдчилгаа
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ── Common: Өрөө / Ариун цэвэр ── */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold mb-1.5 flex items-center gap-1 block">
                        <BedDouble className="h-3.5 w-3.5" /> Өрөө
                      </label>
                      <div className="flex gap-1">
                        {["1", "2", "3", "4", "5+"].map((n) => (
                          <button
                            key={n}
                            onClick={() => set("rooms", n)}
                            className={cn(
                              "flex-1 py-2 rounded-lg text-xs font-semibold border transition-all",
                              form.rooms === n
                                ? "bg-primary text-primary-foreground border-primary"
                                : "border-border/60 text-muted-foreground",
                            )}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-1.5 flex items-center gap-1 block">
                        <Bath className="h-3.5 w-3.5" /> Ариун цэвэр
                      </label>
                      <div className="flex gap-1">
                        {["1", "2", "3", "4+"].map((n) => (
                          <button
                            key={n}
                            onClick={() => set("bathrooms", n)}
                            className={cn(
                              "flex-1 py-2 rounded-lg text-xs font-semibold border transition-all",
                              form.bathrooms === n
                                ? "bg-primary text-primary-foreground border-primary"
                                : "border-border/60 text-muted-foreground",
                            )}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ── Талбай + Хамгийн их хүн (зарахд max_guests хэрэггүй) ── */}
                  <div
                    className={cn(
                      "grid gap-4",
                      isSell ? "grid-cols-1" : "grid-cols-2",
                    )}
                  >
                    <div>
                      <label className="text-sm font-semibold mb-1.5 flex items-center gap-1 block">
                        <Square className="h-3.5 w-3.5" /> Талбай (м²){" "}
                        <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="number"
                        value={form.area_sqm}
                        onChange={(e) => set("area_sqm", e.target.value)}
                        placeholder="120"
                        className="w-full px-4 py-2.5 text-sm bg-muted/50 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                      />
                    </div>
                    {!isSell && (
                      <div>
                        <label className="text-sm font-semibold mb-1.5 block">
                          Хамгийн их хүн
                        </label>
                        <select
                          value={form.max_guests}
                          onChange={(e) => set("max_guests", e.target.value)}
                          className="w-full px-4 py-2.5 text-sm bg-muted/50 border border-border/60 rounded-xl focus:outline-none cursor-pointer"
                        >
                          {["2", "4", "6", "8", "10", "12", "15", "20+"].map(
                            (n) => (
                              <option key={n} value={n}>
                                {n} хүн
                              </option>
                            ),
                          )}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* ── Check-in / Check-out (зөвхөн түрээсэнд) ── */}
                  {!isSell && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold mb-1.5 block">
                          Орох боломжтой цаг
                        </label>
                        <select
                          value={form.checkin_time}
                          onChange={(e) => set("checkin_time", e.target.value)}
                          className="w-full px-4 py-2.5 text-sm bg-muted/50 border border-border/60 rounded-xl focus:outline-none cursor-pointer"
                        >
                          {[
                            "10:00",
                            "11:00",
                            "12:00",
                            "13:00",
                            "14:00",
                            "15:00",
                            "16:00",
                          ].map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-semibold mb-1.5 block">
                          Гарах цаг
                        </label>
                        <select
                          value={form.checkout_time}
                          onChange={(e) => set("checkout_time", e.target.value)}
                          className="w-full px-4 py-2.5 text-sm bg-muted/50 border border-border/60 rounded-xl focus:outline-none cursor-pointer"
                        >
                          {[
                            "10:00",
                            "11:00",
                            "12:00",
                            "13:00",
                            "14:00",
                            "15:00",
                            "16:00",
                          ].map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4 — Тохижилт & Дүрэм */}
              {!submitted && step === 4 && (
                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">
                      Тохижилт{" "}
                      {isSell && (
                        <span className="text-xs text-muted-foreground font-normal">
                          (зарах байрны мэдээлэл)
                        </span>
                      )}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {getActiveAmenities().map((a) => (
                        <button
                          key={a}
                          onClick={() => toggleAmenity(a)}
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                            form.amenities.includes(a)
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-border/60 text-muted-foreground hover:border-primary/40",
                          )}
                        >
                          {form.amenities.includes(a) && (
                            <CheckCircle2 className="h-3 w-3" />
                          )}
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>
                  {isBay && (
                    <div>
                      <label className="text-sm font-semibold mb-2 block">
                        Гараж
                      </label>

                      <div className="flex gap-2">
                        {[
                          { value: "true", label: "Гаражтай", emoji: "🚗" },
                          { value: "false", label: "Гаражгүй", emoji: "🚫" },
                        ].map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => set("has_garage", opt.value)}
                            className={cn(
                              "flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all",
                              form.has_garage === opt.value
                                ? "bg-primary text-primary-foreground border-primary"
                                : "border-border/60 text-muted-foreground hover:border-primary/40",
                            )}
                          >
                            <span>{opt.emoji}</span>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {!isSell && (
                    <div>
                      <label className="text-sm font-semibold mb-2 block">
                        Байрны дүрэм
                      </label>
                      <div className="space-y-2">
                        {[
                          {
                            key: "allow_pets",
                            emoji: "🐾",
                            label: "Амьтан зөвшөөрнө",
                          },
                          {
                            key: "allow_smoking",
                            emoji: "🚬",
                            label: "Тамхи татахыг зөвшөөрнө",
                          },
                          {
                            key: "allow_party",
                            emoji: "🎉",
                            label: "Найр зохиохыг зөвшөөрнө",
                          },
                        ].map(({ key, emoji, label }) => (
                          <div
                            key={key}
                            onClick={() =>
                              set(
                                key,
                                form[key as keyof typeof form] === "true"
                                  ? "false"
                                  : "true",
                              )
                            }
                            className={cn(
                              "flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all",
                              form[key as keyof typeof form] === "true"
                                ? "border-primary bg-primary/5"
                                : "border-border/60 hover:border-primary/30",
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{emoji}</span>
                              <span className="text-sm font-medium">
                                {label}
                              </span>
                            </div>
                            <div
                              className={cn(
                                "w-10 h-6 rounded-full transition-all relative",
                                form[key as keyof typeof form] === "true"
                                  ? "bg-primary"
                                  : "bg-muted",
                              )}
                            >
                              <div
                                className={cn(
                                  "absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all",
                                  form[key as keyof typeof form] === "true"
                                    ? "left-5"
                                    : "left-1",
                                )}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-semibold mb-1.5 block">
                      Тайлбар <span className="text-destructive">*</span>
                      <span className="text-muted-foreground font-normal ml-2 text-xs">
                        (20+ тэмдэгт)
                      </span>
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) => set("description", e.target.value)}
                      rows={4}
                      placeholder="Байрны онцлог, ойролцоох газрууд, хүрэх заавар..."
                      className="w-full px-4 py-3 text-sm bg-muted/50 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none"
                    />
                    <div className="flex justify-end mt-1">
                      <span
                        className={cn(
                          "text-xs",
                          form.description.length < 20
                            ? "text-muted-foreground"
                            : "text-emerald-600 dark:text-emerald-400",
                        )}
                      >
                        {form.description.length} / 20+
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold mb-1.5 flex items-center gap-1 block">
                      <Tag className="h-3.5 w-3.5" /> Шошго
                    </label>
                    <input
                      value={form.tags}
                      onChange={(e) => set("tags", e.target.value)}
                      placeholder="Барбекю, Нуурын эрэг, Ойн орчим..."
                      className="w-full px-4 py-2.5 text-sm bg-muted/50 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* STEP 5 — Холбоо */}
              {!submitted && step === 5 && (
                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-semibold mb-1.5 block">
                      Утас <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <input
                        value={form.phone}
                        readOnly
                        disabled
                        className="w-full pl-11 pr-4 py-2.5 text-sm bg-muted/50 border border-border/60 rounded-xl outline-none cursor-not-allowed opacity-80"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1.5">
                      <Info className="h-3 w-3" />
                      Таны бүртгэлийн дугаар. Өөрчлөх боломжгүй.
                    </p>
                  </div>

                  {/* Summary */}
                  <div className="p-4 rounded-xl bg-muted/40 border border-border/50 space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">
                      Нийтлэх мэдээлэл
                    </p>
                    <div className="flex gap-1.5 mb-3">
                      {images.slice(0, 5).map((img, i) => (
                        <div
                          key={img.id}
                          className={cn(
                            "rounded-lg overflow-hidden bg-muted shrink-0",
                            i === 0 ? "w-16 h-12" : "w-10 h-12",
                          )}
                        >
                          <img
                            src={img.preview}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {images.length > 5 && (
                        <div className="w-10 h-12 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground font-medium shrink-0">
                          +{images.length - 5}
                        </div>
                      )}
                    </div>
                    {[
                      [
                        "Төрөл",
                        step2Data.category === "zuslan"
                          ? "Зуслан"
                          : `Байр · ${step2Data.bayAction === "sell" ? "Зарах" : "Түрээслэх"}`,
                      ],
                      ["Гарчиг", step2Data.title],
                      ["Байршил", getLocationDisplay()],
                      [
                        step2Data.bayAction === "sell" ? "Зарах үнэ" : "Үнэ",
                        `${parseInt(form.price_per_day || "0").toLocaleString()}₮${step2Data.bayAction === "sell" ? "" : "/өдөр"}`,
                      ],
                      ["Талбай", `${form.area_sqm}м² • ${form.rooms} өрөө`],
                      ["Зураг", `${images.length} ширхэг`],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{k}</span>
                        <span className="font-medium truncate ml-4 max-w-[200px] text-right">
                          {v}
                        </span>
                      </div>
                    ))}
                  </div>

                  {error && (
                    <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                      {error}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 6 — Багц */}
              {!submitted && step === 6 && (
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-semibold mb-3 block">
                      Зарын төрөл
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setListingType("standard")}
                        className={cn(
                          "p-4 rounded-2xl border-2 text-left transition-all",
                          listingType === "standard"
                            ? "border-primary bg-primary/5"
                            : "border-border/60 hover:border-primary/40",
                        )}
                      >
                        <div className="text-sm font-bold mb-1">
                          📋 Энгийн зар
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Хэвийн жагсаалтад
                        </div>
                        {listingType === "standard" && (
                          <CheckCircle2 className="h-4 w-4 text-primary mt-2" />
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setListingType("vip");
                          if (packageDays === 24) setPackageDays(7);
                        }}
                        className={cn(
                          "p-4 rounded-2xl border-2 text-left transition-all",
                          listingType === "vip"
                            ? "border-amber-500 bg-amber-50 dark:bg-amber-950/20"
                            : "border-border/60 hover:border-amber-400/40",
                        )}
                      >
                        <div
                          className={cn(
                            "text-sm font-bold mb-1",
                            listingType === "vip" ? "text-amber-700" : "",
                          )}
                        >
                          ⭐ VIP зар
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Хайлтад эхэнд гарна
                        </div>
                        {listingType === "vip" && (
                          <CheckCircle2 className="h-4 w-4 text-amber-500 mt-2" />
                        )}
                      </button>
                    </div>

                    {listingType === "standard" && (
                      <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60">
                        <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                          ⚠️ <strong>24 цагийн үнэгүй багц</strong> нь нэг
                          хэрэглэгчид зөвхөн <strong>нэг удаа</strong> олгогдох
                          ба зар устгасан ч дахин ашиглах боломжгүй.
                        </p>
                      </div>
                    )}

                    {listingType === "vip" && (
                      <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60">
                        <p className="text-xs font-semibold text-amber-700 mb-1.5">
                          ⭐ VIP давуу тал
                        </p>
                        <div className="grid grid-cols-2 gap-1">
                          {[
                            "Хайлтад эхэнд гарна",
                            "⭐ VIP тэмдэглэгээ",
                            "Онцгой хуудсанд",
                            "2x илүү үзэгдэнэ",
                          ].map((b) => (
                            <div
                              key={b}
                              className="flex items-center gap-1 text-xs text-amber-700"
                            >
                              <CheckCircle2 className="h-3 w-3 shrink-0" /> {b}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-semibold mb-3 block">
                      Байршуулах хугацаа
                    </label>
                    <div className="space-y-2">
                      {(listingType === "standard"
                        ? [
                            {
                              days: 24 as const,
                              price: 0,
                              label: "24 цаг",
                              popular: false,
                              free: true,
                            },
                            {
                              days: 7 as const,
                              price: 5000,
                              label: "7 хоног",
                              popular: false,
                            },
                            {
                              days: 14 as const,
                              price: 8000,
                              label: "14 хоног",
                              popular: true,
                            },
                            {
                              days: 30 as const,
                              price: 15000,
                              label: "30 хоног",
                              popular: false,
                            },
                          ]
                        : [
                            {
                              days: 7 as const,
                              price: 15000,
                              label: "VIP · 7 хоног",
                              popular: false,
                            },
                            {
                              days: 14 as const,
                              price: 25000,
                              label: "VIP · 14 хоног",
                              popular: true,
                            },
                            {
                              days: 30 as const,
                              price: 45000,
                              label: "VIP · 30 хоног",
                              popular: false,
                            },
                          ]
                      ).map((pkg) => {
                        const selected = packageDays === pkg.days;
                        const isVip = listingType === "vip";
                        return (
                          <button
                            key={pkg.days}
                            onClick={() => setPackageDays(pkg.days)}
                            className={cn(
                              "w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all",
                              selected
                                ? isVip
                                  ? "border-amber-500 bg-amber-50 dark:bg-amber-950/20"
                                  : "border-primary bg-primary/5"
                                : "border-border/60 hover:border-primary/30",
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                                  selected
                                    ? isVip
                                      ? "border-amber-500 bg-amber-500"
                                      : "border-primary bg-primary"
                                    : "border-border",
                                )}
                              >
                                {selected && (
                                  <div className="w-2 h-2 rounded-full bg-white" />
                                )}
                              </div>
                              <div className="text-left">
                                <div
                                  className={cn(
                                    "text-sm font-semibold",
                                    selected
                                      ? isVip
                                        ? "text-amber-700"
                                        : "text-primary"
                                      : "",
                                  )}
                                >
                                  {pkg.label}
                                  {pkg.popular && (
                                    <span
                                      className={cn(
                                        "ml-2 text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                                        isVip
                                          ? "bg-amber-100 text-amber-700"
                                          : "bg-primary/10 text-primary",
                                      )}
                                    >
                                      АЛДАРТАЙ
                                    </span>
                                  )}
                                  {"free" in pkg && pkg.free && (
                                    <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-700">
                                      ҮНЭГҮЙ
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {pkg.days === 24
                                    ? "24 цаг байршина"
                                    : `${pkg.days} хоног байршина`}
                                </div>
                              </div>
                            </div>
                            <div
                              className={cn(
                                "text-base font-bold font-mono",
                                pkg.price === 0
                                  ? "text-emerald-600"
                                  : selected
                                    ? isVip
                                      ? "text-amber-600"
                                      : "text-primary"
                                    : "",
                              )}
                            >
                              {pkg.price === 0
                                ? "Үнэгүй"
                                : `${pkg.price.toLocaleString()}₮`}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {(() => {
                    const price =
                      listingType === "standard"
                        ? (STANDARD_PRICES[packageDays] ?? 0)
                        : (VIP_PRICES[packageDays] ?? 0);
                    const durationLabel =
                      packageDays === 24 ? "24 цаг" : `${packageDays} хоног`;
                    return (
                      <div
                        className={cn(
                          "p-4 rounded-2xl border",
                          listingType === "vip"
                            ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200/60"
                            : "bg-muted/40 border-border/50",
                        )}
                      >
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">
                            Сонгосон
                          </span>
                          <span className="font-semibold">
                            {listingType === "vip" ? "⭐ VIP · " : ""}
                            {durationLabel}
                          </span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-muted-foreground text-sm">
                            Төлбөр
                          </span>
                          <span
                            className={cn(
                              "text-xl font-bold font-mono",
                              price === 0
                                ? "text-emerald-600"
                                : listingType === "vip"
                                  ? "text-amber-600"
                                  : "text-primary",
                            )}
                          >
                            {price === 0
                              ? "Үнэгүй"
                              : `${price.toLocaleString()}₮`}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {price === 0
                            ? `💡 Зөвшөөрөгдсөний дараа ${durationLabel} байршиж автоматаар идэвхгүй болно.`
                            : `💡 Төлбөр төлөгдсөний дараа зар идэвхжих ба ${durationLabel} байршина.`}
                        </p>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Footer */}
            {!submitted && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-border/50 shrink-0">
                <button
                  onClick={() =>
                    step > 1 ? setStep((s) => (s - 1) as Step) : onClose()
                  }
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {step === 1 ? "Цуцлах" : "← Буцах"}
                </button>
                <Button
                  onClick={() =>
                    step < 6 ? setStep((s) => (s + 1) as Step) : handleSubmit()
                  }
                  disabled={!canNext() || loading}
                  className="gap-2 px-6"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {step === 6 ? (
                    loading ? (
                      "Илгээж байна..."
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" /> Нийтлэх
                      </>
                    )
                  ) : (
                    <>
                      Үргэлжлүүлэх <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <FreeLimitPopover
        open={showFreeLimitPopover}
        onClose={() => {
          setShowFreeLimitPopover(false);
          setStep(6);
          setPackageDays(7);
        }}
      />

      <PaymentInfoPopover
        open={showPaymentPopover}
        onClose={() => setShowPaymentPopover(false)}
        amount={paidAmount}
        listingTitle={step2Data.title}
        phone={form.phone}
      />
    </>
  );
}
