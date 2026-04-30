"use client";

import { useState, useEffect } from "react";
import {
  X,
  Home,
  Tent,
  Building2,
  TreePine,
  Warehouse,
  Waves,
  Mountain,
  Phone,
  BedDouble,
  Bath,
  Square,
  Tag,
  ChevronRight,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ImageUploader, type UploadedImage } from "./image-uploader";
import { useAuth } from "@/components/auth/auth-provider";

const amenitiesList = [
  "WiFi",
  "Барбекю",
  "Зогсоол",
  "Саун",
  "Цэцэрлэг",
  "Тоглоомын талбай",
  "Загасчлал",
  "Хөргөгч",
  "Телевиз",
  "Угаалга",
];

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

const staticCategories = [
  { id: 1, slug: "apartment", icon: Home, label: "Орон сууц" },
  { id: 2, slug: "camp", icon: Tent, label: "Зуслан" },
  { id: 3, slug: "house", icon: Building2, label: "Байшин" },
  { id: 4, slug: "forest", icon: TreePine, label: "Ойн бүс" },
  { id: 5, slug: "lake", icon: Waves, label: "Нуурын эрэг" },
  { id: 6, slug: "mountain", icon: Mountain, label: "Уулын бүс" },
  { id: 7, slug: "warehouse", icon: Warehouse, label: "Агуулах" },
];

export function ListingRegisterModal({ open, onClose }: Props) {
  const { token } = useAuth();

  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [listingType, setListingType] = useState<"standard" | "vip">(
    "standard",
  );
  const [packageDays, setPackageDays] = useState<7 | 14 | 30>(7);
  const [form, setForm] = useState({
    category_id: "",
    location_id: "",
    title: "",
    address: "",
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
  });

  useEffect(() => {
    if (!open) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/locations`)
      .then((r) => r.json())
      .then((data) =>
        setLocations(Array.isArray(data) ? data : data.data || []),
      )
      .catch(console.error);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setStep(1);
    setSubmitted(false);
    setLoading(false);
    setError("");
    setImages([]);
    setForm({
      category_id: "",
      location_id: "",
      title: "",
      address: "",
      price_per_day: "",
      rooms: "1",
      bathrooms: "1",
      area_sqm: "",
      max_guests: "2",
      amenities: [],
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
    });
  }, [open]);

  if (!open) return null;

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const toggleAmenity = (a: string) =>
    setForm((p) => ({
      ...p,
      amenities: p.amenities.includes(a)
        ? p.amenities.filter((x) => x !== a)
        : [...p.amenities, a],
    }));

  const canNext = () => {
    if (step === 1) return images.length > 0;
    if (step === 2)
      return !!form.category_id && !!form.title && !!form.location_id;
    if (step === 3) return !!form.price_per_day && !!form.area_sqm;
    if (step === 4) return form.description.length >= 20;
    if (step === 5) return !!form.phone;
    if (step === 6) return true;
    return false;
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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/listings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            category_id: parseInt(form.category_id),
            location_id: parseInt(form.location_id),
            title: form.title,
            description: form.description,
            address: form.address,
            price_per_day: parseInt(form.price_per_day),
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
              allow_children: form.allow_children === "true",
              allow_party: form.allow_party === "true",
              
            },
            listing_type: listingType,        // ← нэмэх
              package_days: packageDays,
          }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Алдаа гарлаа");
      setSubmitted(true);
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

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Centered container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-300 w-full max-w-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative w-full max-h-[88vh] flex flex-col bg-background rounded-2xl shadow-2xl border border-border/60">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border/50 shrink-0">
              <div>
                <h2 className="text-lg font-bold">🏠 Байр бүртгэх</h2>
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
                    Таны зар шалгагдаж, удахгүй нийтлэгдэх болно.
                  </p>
                  <Button className="mt-5" onClick={onClose}>
                    Хаах
                  </Button>
                </div>
              )}

              {/* STEP 1 */}
              {!submitted && step === 1 && (
                <ImageUploader
                  images={images}
                  onChange={setImages}
                  maxImages={8}
                />
              )}

              {/* STEP 2 */}
              {!submitted && step === 2 && (
                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">
                      Байрны төрөл <span className="text-destructive">*</span>
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {staticCategories.map(({ id, icon: Icon, label }) => (
                        <button
                          key={id}
                          onClick={() => set("category_id", String(id))}
                          className={cn(
                            "flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-xs font-medium transition-all",
                            form.category_id === String(id)
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border/60 hover:border-primary/40 text-muted-foreground",
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold mb-1.5 block">
                      Гарчиг <span className="text-destructive">*</span>
                    </label>
                    <input
                      value={form.title}
                      onChange={(e) => set("title", e.target.value)}
                      placeholder="Богдхан орчмын тухлагтай зуслан"
                      className="w-full px-4 py-2.5 text-sm bg-muted/50 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold mb-1.5 block">
                      Байршил <span className="text-destructive">*</span>
                    </label>
                    {locations.length === 0 ? (
                      <p className="text-xs text-muted-foreground">
                        Байршил ачааллаж байна...
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {locations.map((loc) => (
                          <button
                            key={loc.id}
                            onClick={() => set("location_id", String(loc.id))}
                            className={cn(
                              "text-xs px-3 py-1 rounded-full border transition-all",
                              form.location_id === String(loc.id)
                                ? "bg-primary text-primary-foreground border-primary"
                                : "border-border/60 text-muted-foreground hover:border-primary/40",
                            )}
                          >
                            {form.location_id === String(loc.id) && "✓ "}
                            {loc.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-semibold mb-1.5 block">
                      Дэлгэрэнгүй хаяг
                    </label>
                    <input
                      value={form.address}
                      onChange={(e) => set("address", e.target.value)}
                      placeholder="Дүүрэг, хороо, гудамж..."
                      className="w-full px-4 py-2.5 text-sm bg-muted/50 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    />
                  </div>
                </div>
              )}

              {!submitted && step === 3 && (
                <div className="space-y-5">
                  {/* Үнийн хэлбэрүүд */}
                  <div>
                    <label className="text-sm font-semibold mb-3 block">
                      Үнийн мэдээлэл <span className="text-destructive">*</span>
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      {/* Өдрийн үнэ */}
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
                            type="number"
                            value={form.price_per_day}
                            onChange={(e) =>
                              set("price_per_day", e.target.value)
                            }
                            placeholder="150,000"
                            className="w-full pl-8 pr-4 py-2.5 text-sm bg-background border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                          />
                        </div>
                        {form.price_per_day && (
                          <p className="text-xs text-muted-foreground mt-1.5">
                            = {parseInt(form.price_per_day).toLocaleString()}₮ /
                            нэг өдөр
                          </p>
                        )}
                      </div>

                      {/* 7 хоногийн үнэ */}
                      <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-xs font-semibold">
                              7 хоногийн үнэ
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              (заавал биш)
                            </span>
                          </div>
                          {form.price_per_day && form.price_per_week && (
                            <span className="text-[10px] text-emerald-600 font-semibold">
                              {Math.round(
                                (1 -
                                  parseInt(form.price_per_week) /
                                    (parseInt(form.price_per_day) * 7)) *
                                  100,
                              )}
                              % хямд
                            </span>
                          )}
                        </div>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                            ₮
                          </span>
                          <input
                            type="number"
                            value={form.price_per_week}
                            onChange={(e) =>
                              set("price_per_week", e.target.value)
                            }
                            placeholder={
                              form.price_per_day
                                ? String(parseInt(form.price_per_day) * 6)
                                : "900,000"
                            }
                            className="w-full pl-8 pr-4 py-2.5 text-sm bg-background border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                          />
                        </div>
                        {form.price_per_week && (
                          <p className="text-xs text-muted-foreground mt-1.5">
                            = {parseInt(form.price_per_week).toLocaleString()}₮
                            / 7 хоног
                            {form.price_per_day && (
                              <span className="ml-2 text-emerald-600">
                                (
                                {Math.round(
                                  parseInt(form.price_per_week) / 7,
                                ).toLocaleString()}
                                ₮/өдөр)
                              </span>
                            )}
                          </p>
                        )}
                      </div>

                      {/* Сарын үнэ */}
                      <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-amber-500" />
                            <span className="text-xs font-semibold">
                              Сарын үнэ
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              (заавал биш)
                            </span>
                          </div>
                          {form.price_per_day && form.price_per_month && (
                            <span className="text-[10px] text-emerald-600 font-semibold">
                              {Math.round(
                                (1 -
                                  parseInt(form.price_per_month) /
                                    (parseInt(form.price_per_day) * 30)) *
                                  100,
                              )}
                              % хямд
                            </span>
                          )}
                        </div>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                            ₮
                          </span>
                          <input
                            type="number"
                            value={form.price_per_month}
                            onChange={(e) =>
                              set("price_per_month", e.target.value)
                            }
                            placeholder={
                              form.price_per_day
                                ? String(parseInt(form.price_per_day) * 20)
                                : "3,000,000"
                            }
                            className="w-full pl-8 pr-4 py-2.5 text-sm bg-background border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                          />
                        </div>
                        {form.price_per_month && (
                          <p className="text-xs text-muted-foreground mt-1.5">
                            = {parseInt(form.price_per_month).toLocaleString()}₮
                            / сар
                            {form.price_per_day && (
                              <span className="ml-2 text-emerald-600">
                                (
                                {Math.round(
                                  parseInt(form.price_per_month) / 30,
                                ).toLocaleString()}
                                ₮/өдөр)
                              </span>
                            )}
                          </p>
                        )}
                      </div>

                      {/* Баталгааны мөнгө */}
                      <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                          <span className="text-xs font-semibold">
                            Баталгааны мөнгө (Deposit)
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
                            type="number"
                            value={form.deposit}
                            onChange={(e) => set("deposit", e.target.value)}
                            placeholder="100,000"
                            className="w-full pl-8 pr-4 py-2.5 text-sm bg-background border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1.5">
                          Гарахад буцааж өгөх баталгааны дүн
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Хэмжээ */}
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

                  <div className="grid grid-cols-2 gap-4">
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
                    <div>
                      <label className="text-sm font-semibold mb-1.5 block">
                        Хамгийн их хүн
                      </label>
                      <select
                        value={form.max_guests}
                        onChange={(e) => set("max_guests", e.target.value)}
                        className="w-full px-4 py-2.5 text-sm bg-muted/50 border border-border/60 rounded-xl focus:outline-none cursor-pointer"
                      >
                        {["2", "4", "6", "8", "10", "12", "15+"].map((n) => (
                          <option key={n} value={n}>
                            {n} хүн
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Хамгийн бага хоног */}
                  <div>
                    <label className="text-sm font-semibold mb-1.5 block">
                      Хамгийн бага захиалгын хоног
                    </label>
                    <div className="flex gap-2">
                      {[
                        { label: "1 хоног", value: "1" },
                        { label: "2 хоног", value: "2" },
                        { label: "3 хоног", value: "3" },
                        { label: "7 хоног", value: "7" },
                        { label: "14 хоног", value: "14" },
                        { label: "30 хоног", value: "30" },
                      ].map(({ label, value }) => (
                        <button
                          key={value}
                          onClick={() => set("min_nights", value)}
                          className={cn(
                            "flex-1 py-2 rounded-lg text-xs font-semibold border transition-all",
                            form.min_nights === value
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-border/60 text-muted-foreground hover:border-primary/40",
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Check-in/out цаг */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold mb-1.5 block">
                        Check-in цаг
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
                        Check-out цаг
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
                </div>
              )}

              {/* STEP 4 — Тохижилт & Дүрэм */}
              {!submitted && step === 4 && (
                <div className="space-y-5">
                  {/* Тохижилт */}
                  <div>
                    <label className="text-sm font-semibold mb-2 block">
                      Тохижилт
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {amenitiesList.map((a) => (
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

                  {/* Дүрэм */}
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
                          key: "allow_children",
                          emoji: "👶",
                          label: "Хүүхэд зөвшөөрнө",
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
                            <span className="text-sm font-medium">{label}</span>
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

                  {/* Тайлбар */}
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

              {/* STEP 5 */}
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
                        onChange={(e) => set("phone", e.target.value)}
                        placeholder="9900-0000"
                        className="w-full pl-11 pr-4 py-2.5 text-sm bg-muted/50 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                      />
                    </div>
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
                      ["Гарчиг", form.title],
                      [
                        "Байршил",
                        locations.find((l) => String(l.id) === form.location_id)
                          ?.name || "",
                      ],
                      [
                        "Үнэ",
                        `${parseInt(form.price_per_day || "0").toLocaleString()}₮/өдөр`,
                      ],
                      ["Талбай", `${form.area_sqm}м² • ${form.rooms} өрөө`],
                      ["Зураг", `${images.length} ширхэг`],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{k}</span>
                        <span className="font-medium truncate ml-4 max-w-[180px]">
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
                      onClick={() => setListingType("vip")}
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
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {pkg.days} хоног байршина
                              </div>
                            </div>
                          </div>
                          <div
                            className={cn(
                              "text-base font-bold font-mono",
                              selected
                                ? isVip
                                  ? "text-amber-600"
                                  : "text-primary"
                                : "",
                            )}
                          >
                            {pkg.price.toLocaleString()}₮
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Дүн */}
                <div
                  className={cn(
                    "p-4 rounded-2xl border",
                    listingType === "vip"
                      ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200/60"
                      : "bg-muted/40 border-border/50",
                  )}
                >
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Сонгосон</span>
                    <span className="font-semibold">
                      {listingType === "vip" ? "⭐ VIP · " : ""}
                      {packageDays} хоног
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground text-sm">
                      Төлбөр
                    </span>
                    <span
                      className={cn(
                        "text-xl font-bold font-mono",
                        listingType === "vip"
                          ? "text-amber-600"
                          : "text-primary",
                      )}
                    >
                      {listingType === "standard"
                        ? [5000, 8000, 15000][
                            [7, 14, 30].indexOf(packageDays)
                          ].toLocaleString()
                        : [15000, 25000, 45000][
                            [7, 14, 30].indexOf(packageDays)
                          ].toLocaleString()}
                      ₮
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    💡 Зөвшөөрөгдсөний дараа {packageDays} хоног байршиж
                    автоматаар идэвхгүй болно.
                  </p>
                </div>
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
    </>
  );
}
