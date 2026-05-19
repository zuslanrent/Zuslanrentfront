"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import {
  MapPin, BedDouble, Bath, Square, Plus, Pencil, Trash2, Eye,
  Clock, Loader2, X, CheckCircle2, Tag, Phone, FileText, Star,
  Calendar, AlertCircle, RefreshCw, Building2, Tent, Car,
  Tag as TagIcon, Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ListingRegisterModal } from "@/components/modals/listing-register-modal";
import { FreeLimitPopover } from "@/components/modals/free-limit-popover";

interface Listing {
  id: string;
  title: string;
  location_name: string;
  price_per_day: number;
  price_per_month?: number | null;
  cover_image: string | null;
  rooms: number;
  bathrooms: number;
  area_sqm: number;
  status: string;
  view_count: number;
  created_at: string;
  plan?: string;
  is_vip?: boolean;
  plan_price?: number;
  expires_at?: string;
  // NEW Step 2/3 fields
  property_category?: "bay" | "zuslan" | null;
  bay_action?: "sell" | "rent" | null;
  district?: string | null;
  khoroo?: number | null;
  zuslan_area?: string | null;
  has_garage?: boolean;
  bay_subtype?: string | null;
  payment_terms?: string | null;
  built_year?: number | null;
  floor?: number | null;
  total_floors?: number | null;
}

type EditTab = "basic" | "detail" | "rules" | "plan";

const statusConfig: Record<string, { label: string; color: string }> = {
  active: { label: "Идэвхтэй", color: "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400" },
  pending: { label: "Хүлээгдэж байна", color: "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400" },
  inactive: { label: "Идэвхгүй", color: "bg-muted text-muted-foreground" },
  rejected: { label: "Татгалзсан", color: "bg-destructive/10 text-destructive" },
};

// ── Mode-aware amenities ──
const BAY_PROPERTY_AMENITIES = [
  "Нийтийн эзэмшлийн талбай", "Бүтэн тавилгатай", "Хагас тавилгатай",
  "Суурилуулсан тавилгатай", "Улсын сургууль", "Улсын цэцэрлэг",
  "Хувийн сургууль", "Хувийн цэцэрлэг", "Цэцэрлэгт хүрээлэн",
];
const BAY_RENT_AMENITIES = ["WiFi", "Зогсоол", "Хөргөгч", "Телевиз", "Угаалга"];
const ZUSLAN_AMENITIES = [
  "WiFi", "Барбекю", "Зогсоол", "Саун", "Цэцэрлэг",
  "Тоглоомын талбай", "Загасчлал", "Хөргөгч", "Телевиз", "Угаалга",
];

const BAY_SUBTYPES = [
  { id: "apartment", label: "Орон сууц" },
  { id: "duplex", label: "Дуплекс" },
  { id: "penthouse", label: "Пентхаус" },
  { id: "townhouse", label: "Таунхаус" },
  { id: "house", label: "Хаус" },
  { id: "villa", label: "Вилла" },
];
const BAY_SUBTYPE_LABELS: Record<string, string> = {
  apartment: "Орон сууц", duplex: "Дуплекс", penthouse: "Пентхаус",
  townhouse: "Таунхаус", house: "Хаус", villa: "Вилла",
};

const SELL_PAYMENT_TERMS = ["100%", "Банк зээл", "Урьдчилгаа + Хүүгүй зээл"];
const RENT_PAYMENT_TERMS = ["Хоногоор", "1+1", "3+1", "6+1", "12+1"];

const PLAN_PRICES = {
  standard: { 24: 0, 7: 5000, 14: 8000, 30: 15000 } as Record<number, number>,
  vip: { 7: 15000, 14: 25000, 30: 45000 } as Record<number, number>,
};

// ── Helpers ──
function isListingExpired(listing: Listing): boolean {
  if (listing.status === "inactive") return true;
  if (!listing.expires_at) return false;
  return new Date(listing.expires_at).getTime() < Date.now();
}

function formatExpiry(expiresAt?: string) {
  if (!expiresAt) return null;
  const days = Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 86400000);
  if (days <= 0) return { text: "Хугацаа дууссан", urgent: true, expired: true };
  if (days <= 3) return { text: `${days} хоног үлдсэн`, urgent: true, expired: false };
  return { text: `${days} хоног үлдсэн`, urgent: false, expired: false };
}

function getSmartLocation(l: Listing): string {
  if (l.property_category === "bay" && l.district) {
    return l.khoroo ? `${l.district}, ${l.khoroo}-р хороо` : l.district;
  }
  if (l.property_category === "zuslan" && l.zuslan_area) return l.zuslan_area;
  return l.location_name || "—";
}

function getModeBadge(l: Listing) {
  if (l.property_category === "bay" && l.bay_action === "sell")
    return { label: "💰 Зарах", cls: "bg-rose-50 text-rose-700 border-rose-100" };
  if (l.property_category === "bay" && l.bay_action === "rent")
    return { label: "🔑 Түрээс", cls: "bg-blue-50 text-blue-700 border-blue-100" };
  if (l.property_category === "zuslan")
    return { label: "🏕️ Зуслан", cls: "bg-emerald-50 text-emerald-700 border-emerald-100" };
  return null;
}

function getSmartPrice(l: Listing): { value: number; label: string; color: string } {
  const day = Number(l.price_per_day) || 0;
  const month = Number(l.price_per_month) || 0;
  if (l.bay_action === "sell") return { value: day, label: "Зарах үнэ", color: "text-rose-600" };
  if (month > 0) return { value: month, label: "/сар", color: "text-primary" };
  return { value: day, label: "/өдөр", color: "text-primary" };
}

// ═══════════════ EDIT MODAL ═══════════════
function EditModal({
  listing,
  token,
  initialTab = "basic",
  onClose,
  onSaved,
}: {
  listing: Listing;
  token: string | null;
  initialTab?: EditTab;
  onClose: () => void;
  onSaved: () => void;
}) {
  // ── Mode flags ──
  const isBay = listing.property_category === "bay";
  const isZuslan = listing.property_category === "zuslan";
  const isSell = listing.bay_action === "sell";
  const isRent = !isSell;
  const mode = getModeBadge(listing);
  const smartLocation = getSmartLocation(listing);

  const [form, setForm] = useState({
    title: listing.title,
    price_per_day: String(listing.price_per_day || ""),
    price_per_week: "",
    price_per_month: "",
    deposit: "",
    rooms: String(listing.rooms),
    bathrooms: String(listing.bathrooms),
    area_sqm: String(listing.area_sqm),
    max_guests: "2",
    description: "",
    address: "",
    phone: "",
    checkin_time: "14:00",
    checkout_time: "12:00",
    tags: "",
    amenities: [] as string[],
    allow_pets: "false",
    allow_smoking: "false",
    allow_party: "false",
    bay_subtype: "",
    payment_terms: "",
    built_year: "",
    floor: "",
    total_floors: "",
    has_garage: "false",
  });
  const [fetchLoading, setFetchLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<EditTab>(initialTab);

  // ── Computed pricing modes (depend on form.payment_terms) ──
  const isDaily = isRent && form.payment_terms === "Хоногоор";
  const isMonthly = isRent && !!form.payment_terms && form.payment_terms !== "Хоногоор";

  const getActiveAmenities = (): string[] => {
    if (isSell) return BAY_PROPERTY_AMENITIES;
    if (isBay && isRent) return [...BAY_RENT_AMENITIES, ...BAY_PROPERTY_AMENITIES];
    if (isZuslan) return ZUSLAN_AMENITIES;
    // Legacy fallback
    return [
      ...BAY_RENT_AMENITIES,
      ...BAY_PROPERTY_AMENITIES,
      ...ZUSLAN_AMENITIES.filter((a) => !BAY_RENT_AMENITIES.includes(a)),
    ];
  };

  const getCurrentPlanDays = (): 24 | 7 | 14 | 30 => {
    if (!listing.expires_at || !listing.created_at) return 7;
    const ms = new Date(listing.expires_at).getTime() - new Date(listing.created_at).getTime();
    const hours = Math.round(ms / 3600000);
    if (hours <= 24) return 24;
    const days = Math.round(hours / 24);
    if (days <= 7) return 7;
    if (days <= 14) return 14;
    return 30;
  };
  const [planType, setPlanType] = useState<"standard" | "vip">(listing.is_vip ? "vip" : "standard");
  const [planDays, setPlanDays] = useState<24 | 7 | 14 | 30>(7);
  const [planLoading, setPlanLoading] = useState(false);
  const [planSaved, setPlanSaved] = useState(false);
  const [showFreeLimitPopover, setShowFreeLimitPopover] = useState(false);

  useEffect(() => {
    setPlanType(listing.is_vip ? "vip" : "standard");
    setPlanDays(getCurrentPlanDays());
  }, [listing.is_vip, listing.expires_at, listing.created_at]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/listings/${listing.id}`,
          { headers: token ? { Authorization: `Bearer ${token}` } : {} },
        );
        const data = await res.json();
        const amenities =
          typeof data.amenities === "string" ? JSON.parse(data.amenities) : data.amenities || [];
        const rules =
          typeof data.rules === "string" ? JSON.parse(data.rules) : data.rules || {};
        setForm((p) => ({
          ...p,
          description: data.description || "",
          address: data.address || "",
          phone: data.phone || "",
          max_guests: String(data.max_guests || 2),
          price_per_week: data.price_per_week ? String(data.price_per_week) : "",
          price_per_month: data.price_per_month ? String(data.price_per_month) : "",
          deposit: data.deposit ? String(data.deposit) : "",
          checkin_time: data.checkin_time || "14:00",
          checkout_time: data.checkout_time || "12:00",
          tags: Array.isArray(data.tags) ? data.tags.join(", ") : "",
          amenities,
          allow_pets: String(rules.allow_pets ?? false),
          allow_smoking: String(rules.allow_smoking ?? false),
          allow_party: String(rules.allow_party ?? false),
          bay_subtype: data.bay_subtype || "",
          payment_terms: data.payment_terms || "",
          built_year: data.built_year ? String(data.built_year) : "",
          floor: data.floor ? String(data.floor) : "",
          total_floors: data.total_floors ? String(data.total_floors) : "",
          has_garage: String(data.has_garage ?? false),
        }));
      } catch {
      } finally {
        setFetchLoading(false);
      }
    };
    load();
  }, [listing.id, token]);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const setMoney = (k: string, v: string) => {
    const raw = v.replace(/[^0-9]/g, "");
    setForm((p) => ({ ...p, [k]: raw }));
  };
  const toggleAmenity = (a: string) =>
    setForm((p) => ({
      ...p,
      amenities: p.amenities.includes(a)
        ? p.amenities.filter((x) => x !== a)
        : [...p.amenities, a],
    }));

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      // Monthly mode: compute price_per_day from price_per_month for backend compat
      const finalPricePerDay =
        isMonthly && form.price_per_month
          ? Math.round(parseInt(form.price_per_month) / 30)
          : parseInt(form.price_per_day) || 0;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/listings/${listing.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            address: form.address,
            phone: form.phone,
            price_per_day: finalPricePerDay,
            price_per_week: form.price_per_week ? parseInt(form.price_per_week) : null,
            price_per_month: form.price_per_month ? parseInt(form.price_per_month) : null,
            deposit: form.deposit ? parseInt(form.deposit) : null,
            rooms: parseInt(form.rooms),
            bathrooms: parseInt(form.bathrooms),
            area_sqm: parseInt(form.area_sqm),
            max_guests: parseInt(form.max_guests),
            checkin_time: form.checkin_time,
            checkout_time: form.checkout_time,
            amenities: form.amenities,
            tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
            rules: {
              allow_pets: form.allow_pets === "true",
              allow_smoking: form.allow_smoking === "true",
              allow_party: form.allow_party === "true",
            },
            bay_subtype: form.bay_subtype || null,
            payment_terms: form.payment_terms || null,
            built_year: form.built_year ? parseInt(form.built_year) : null,
            floor: form.floor ? parseInt(form.floor) : null,
            total_floors: form.total_floors ? parseInt(form.total_floors) : null,
            has_garage: form.has_garage === "true",
          }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Алдаа гарлаа");
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSave = async () => {
    setPlanLoading(true);
    setPlanSaved(false);
    setError("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/listings/${listing.id}/plan`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            listing_type: planType,
            package_days: planDays,
          }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 403 && data.error?.includes("24 цагийн үнэгүй")) {
          setShowFreeLimitPopover(true);
          setPlanLoading(false);
          return;
        }
        throw new Error(data.error || "Алдаа гарлаа");
      }
      setPlanSaved(true);
      onSaved();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setPlanLoading(false);
    }
  };

  const currentPlanPrice = PLAN_PRICES[planType][planDays] ?? 0;
  const inp = "w-full px-4 py-2.5 text-sm bg-muted/50 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all";
  const tabs = [
    { key: "basic", label: "Үндсэн", icon: FileText },
    { key: "detail", label: "Нэмэлт", icon: Tag },
    { key: "rules", label: "Тохижилт", icon: CheckCircle2 },
    { key: "plan", label: "Багц", icon: Star },
  ] as const;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="w-full max-w-xl bg-background rounded-2xl shadow-2xl border border-border/60 pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-300 flex flex-col max-h-[88vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border/50 shrink-0">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h2 className="font-bold text-base">Зар засах</h2>
                {mode && (
                  <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border", mode.cls)}>
                    {mode.label}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {listing.title} · {smartLocation}
              </p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-muted transition-colors shrink-0">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 px-6 py-3 border-b border-border/30 shrink-0 overflow-x-auto">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => { setTab(key); setError(""); setPlanSaved(false); }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0",
                  tab === key
                    ? key === "plan"
                      ? "bg-amber-500 text-white"
                      : "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {fetchLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                {/* ════ BASIC ════ */}
                {tab === "basic" && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Гарчиг</label>
                      <input value={form.title} onChange={(e) => set("title", e.target.value)} className={inp} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Хаяг</label>
                      <input value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Дүүрэг, хороо, гудамж..." className={inp} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Утас</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="9900-0000" className={cn(inp, "pl-10")} />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Тайлбар</label>
                      <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={4} placeholder="Байрны онцлог..." className={cn(inp, "resize-none")} />
                    </div>

                    {/* ── MODE-AWARE PRICING ── */}
                    <div className="space-y-3">
                      <label className="text-xs font-semibold text-muted-foreground block">
                        Үнийн мэдээлэл {mode && <span className="text-[10px] font-normal">({mode.label})</span>}
                      </label>

                      {/* SELL */}
                      {isSell && (
                        <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/10 border border-rose-200/40">
                          <label className="text-xs font-semibold text-rose-700 mb-1.5 block">💰 Зарах үнэ</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₮</span>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={form.price_per_day ? parseInt(form.price_per_day).toLocaleString() : ""}
                              onChange={(e) => setMoney("price_per_day", e.target.value)}
                              placeholder="350,000,000"
                              className={cn(inp, "pl-8")}
                            />
                          </div>
                        </div>
                      )}

                      {/* DAILY (Хоногоор) */}
                      {isDaily && (
                        <div className="space-y-2">
                          {[
                            { label: "Өдрийн үнэ *", key: "price_per_day", placeholder: "150,000" },
                            { label: "7 хоног", key: "price_per_week", placeholder: "900,000" },
                            { label: "Сар", key: "price_per_month", placeholder: "3,000,000" },
                            { label: "Барьцаа", key: "deposit", placeholder: "100,000" },
                          ].map((f) => (
                            <div key={f.key} className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₮</span>
                              <input
                                type="text"
                                inputMode="numeric"
                                value={form[f.key as keyof typeof form] ? parseInt(form[f.key as keyof typeof form] as string).toLocaleString() : ""}
                                onChange={(e) => setMoney(f.key, e.target.value)}
                                placeholder={`${f.label} — ${f.placeholder}`}
                                className={cn(inp, "pl-8")}
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* MONTHLY (1+1, 3+1...) */}
                      {isMonthly && (
                        <div className="space-y-2">
                          {[
                            { label: "Сарын түрээс *", key: "price_per_month", placeholder: "2,500,000" },
                            { label: "Барьцаа *", key: "deposit", placeholder: "5,000,000" },
                          ].map((f) => (
                            <div key={f.key} className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₮</span>
                              <input
                                type="text"
                                inputMode="numeric"
                                value={form[f.key as keyof typeof form] ? parseInt(form[f.key as keyof typeof form] as string).toLocaleString() : ""}
                                onChange={(e) => setMoney(f.key, e.target.value)}
                                placeholder={`${f.label} — ${f.placeholder}`}
                                className={cn(inp, "pl-8")}
                              />
                            </div>
                          ))}
                          {form.payment_terms && (
                            <p className="text-xs text-amber-700 px-2">
                              💡 {form.payment_terms}: {form.payment_terms.split("+")[0]} сарын барьцаа + 1 сар урьдчилгаа
                            </p>
                          )}
                        </div>
                      )}

                      {/* Fallback for legacy/no-mode listings */}
                      {!isSell && !isDaily && !isMonthly && (
                        <div className="space-y-2">
                          {[
                            { label: "Өдрийн үнэ *", key: "price_per_day" },
                            { label: "7 хоног", key: "price_per_week" },
                            { label: "Сар", key: "price_per_month" },
                            { label: "Барьцаа", key: "deposit" },
                          ].map((f) => (
                            <div key={f.key} className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₮</span>
                              <input
                                type="number"
                                value={form[f.key as keyof typeof form] as string}
                                onChange={(e) => set(f.key, e.target.value)}
                                placeholder={f.label}
                                className={cn(inp, "pl-8")}
                              />
                            </div>
                          ))}
                          <p className="text-[10px] text-amber-600">
                            ⚠️ Энэ зар category тогтоогоогүй. "Нэмэлт" хэсэгт payment_terms сонгоно уу.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* ── Stats grid (max_guests hidden for sell) ── */}
                    <div className={cn("grid gap-2", isSell ? "grid-cols-3" : "grid-cols-4")}>
                      {[
                        { label: "Өрөө", key: "rooms" },
                        { label: "Ариун цэв", key: "bathrooms" },
                        { label: "м²", key: "area_sqm" },
                        ...(!isSell ? [{ label: "Хүн", key: "max_guests" }] : []),
                      ].map((f) => (
                        <div key={f.key}>
                          <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
                          <input
                            type="number"
                            value={form[f.key as keyof typeof form] as string}
                            onChange={(e) => set(f.key, e.target.value)}
                            className={cn(inp, "text-center px-2")}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ════ DETAIL ════ */}
                {tab === "detail" && (
                  <div className="space-y-5">
                    {/* Bay sub-type */}
                    {isBay && (
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-2 block">
                          Дэд төрөл
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {BAY_SUBTYPES.map(({ id, label }) => (
                            <button
                              key={id}
                              onClick={() => set("bay_subtype", id)}
                              className={cn(
                                "py-2 px-2 rounded-xl text-xs font-semibold border transition-all",
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
                    )}

                    {/* Payment terms */}
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-2 block">
                        Төлбөрийн нөхцөл
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {(isSell ? SELL_PAYMENT_TERMS : RENT_PAYMENT_TERMS).map((term) => (
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
                        ))}
                      </div>
                    </div>

                    {/* Bay: Built year + floor + total floors */}
                    {isBay && (
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Баригдсан он</label>
                          <input
                            type="number"
                            value={form.built_year}
                            onChange={(e) => set("built_year", e.target.value)}
                            placeholder="2020"
                            className={cn(inp, "px-2 text-center")}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Давхар</label>
                          <input
                            type="number"
                            value={form.floor}
                            onChange={(e) => set("floor", e.target.value)}
                            placeholder="5"
                            className={cn(inp, "px-2 text-center")}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Нийт давхар</label>
                          <input
                            type="number"
                            value={form.total_floors}
                            onChange={(e) => set("total_floors", e.target.value)}
                            placeholder="12"
                            className={cn(inp, "px-2 text-center")}
                          />
                        </div>
                      </div>
                    )}

                    {/* Check-in / out (hidden for sell) */}
                    {!isSell && (
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-2 block">
                          Орох / Гарах цаг
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { label: "Орох цаг", key: "checkin_time" },
                            { label: "Гарах цаг", key: "checkout_time" },
                          ].map((f) => (
                            <div key={f.key}>
                              <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
                              <select
                                value={form[f.key as keyof typeof form] as string}
                                onChange={(e) => set(f.key, e.target.value)}
                                className={inp}
                              >
                                {["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00"].map((t) => (
                                  <option key={t} value={t}>{t}</option>
                                ))}
                              </select>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                        Шошго (таслалаар)
                      </label>
                      <input
                        value={form.tags}
                        onChange={(e) => set("tags", e.target.value)}
                        placeholder="Барбекю, Нуурын эрэг..."
                        className={inp}
                      />
                    </div>
                  </div>
                )}

                {/* ════ RULES ════ */}
                {tab === "rules" && (
                  <div className="space-y-5">
                    {/* Mode-filtered amenities */}
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-3 block">
                        Тохижилт {isSell && <span className="text-[10px] font-normal">(зарах байрны мэдээлэл)</span>}
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
                            {form.amenities.includes(a) && <CheckCircle2 className="h-3 w-3" />}
                            {a}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Garage (Bay only) */}
                    {isBay && (
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-2 block">
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

                    {/* Rules (hidden for sell) */}
                    {!isSell && (
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-3 block">
                          Байрны дүрэм
                        </label>
                        <div className="space-y-2">
                          {[
                            { key: "allow_pets", emoji: "🐾", label: "Амьтан зөвшөөрнө" },
                            { key: "allow_smoking", emoji: "🚬", label: "Тамхи татах" },
                            { key: "allow_party", emoji: "🎉", label: "Найр зохиох" },
                          ].map(({ key, emoji, label }) => (
                            <div
                              key={key}
                              onClick={() =>
                                set(key, form[key as keyof typeof form] === "true" ? "false" : "true")
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
                                  "w-10 h-6 rounded-full transition-all relative shrink-0",
                                  form[key as keyof typeof form] === "true" ? "bg-primary" : "bg-muted",
                                )}
                              >
                                <div
                                  className={cn(
                                    "absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all",
                                    form[key as keyof typeof form] === "true" ? "left-5" : "left-1",
                                  )}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ════ PLAN (unchanged) ════ */}
                {tab === "plan" && (
                  <div className="space-y-5">
                    {isListingExpired(listing) && (
                      <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200/60 flex gap-2.5">
                        <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-red-700 dark:text-red-300 mb-1">
                            Зарын хугацаа дууссан
                          </p>
                          <p className="text-xs text-red-600 dark:text-red-400 leading-relaxed">
                            Энэ зар одоо public хайлтад харагдахгүй байна. Шинэ багц сонгож сунгаснаар дахин идэвхжинэ.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className={cn("p-4 rounded-2xl border", listing.is_vip ? "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800" : "bg-muted/40 border-border/60")}>
                      <p className="text-xs font-semibold text-muted-foreground mb-2">Одоогийн багц</p>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm">
                          {listing.is_vip ? "⭐ VIP зар" : "📋 Энгийн зар"}
                        </span>
                        <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", listing.is_vip ? "bg-amber-100 text-amber-700" : "bg-muted text-muted-foreground")}>
                          {listing.plan || "standard"}
                        </span>
                      </div>
                      {listing.expires_at && (() => {
                        const days = Math.ceil((new Date(listing.expires_at!).getTime() - Date.now()) / 86400000);
                        return (
                          <div className={cn("flex items-center gap-1.5 text-xs mt-1", days <= 0 ? "text-red-500" : days <= 3 ? "text-amber-600" : "text-muted-foreground")}>
                            <Clock className="h-3 w-3" />
                            {days <= 0 ? "Хугацаа дууссан" : `${days} хоног үлдсэн`}
                            <span className="text-muted-foreground">({new Date(listing.expires_at!).toLocaleDateString("mn-MN")})</span>
                          </div>
                        );
                      })()}
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-3">
                        {isListingExpired(listing) ? "Шинэ багц сонгож сунгах" : "Шинэ багц сонгох"}
                      </p>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {(["standard", "vip"] as const).map((type) => (
                          <button
                            key={type}
                            onClick={() => {
                              setPlanType(type);
                              if (type === "vip" && planDays === 24) setPlanDays(7);
                            }}
                            className={cn("p-3 rounded-xl border-2 text-left transition-all", planType === type ? type === "vip" ? "border-amber-500 bg-amber-50 dark:bg-amber-950/20" : "border-primary bg-primary/5" : "border-border/60 hover:border-primary/30")}
                          >
                            <div className="text-sm font-bold mb-0.5">{type === "vip" ? "⭐ VIP зар" : "📋 Энгийн зар"}</div>
                            <div className="text-xs text-muted-foreground">{type === "vip" ? "Хайлтад эхэнд гарна" : "Хэвийн жагсаалтад"}</div>
                            {planType === type && <CheckCircle2 className={cn("h-4 w-4 mt-1.5", type === "vip" ? "text-amber-500" : "text-primary")} />}
                          </button>
                        ))}
                      </div>

                      <div className="space-y-2">
                        {(planType === "standard"
                          ? [
                              { days: 24 as const, price: 0, label: "24 цаг", free: true },
                              { days: 7 as const, price: 5000, label: "7 хоног" },
                              { days: 14 as const, price: 8000, label: "14 хоног", popular: true },
                              { days: 30 as const, price: 15000, label: "30 хоног" },
                            ]
                          : [
                              { days: 7 as const, price: 15000, label: "VIP · 7 хоног" },
                              { days: 14 as const, price: 25000, label: "VIP · 14 хоног", popular: true },
                              { days: 30 as const, price: 45000, label: "VIP · 30 хоног" },
                            ]
                        ).map((pkg) => (
                          <button
                            key={pkg.days}
                            onClick={() => setPlanDays(pkg.days)}
                            className={cn("w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all", planDays === pkg.days ? planType === "vip" ? "border-amber-500 bg-amber-50 dark:bg-amber-950/20" : "border-primary bg-primary/5" : "border-border/60 hover:border-primary/30")}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0", planDays === pkg.days ? planType === "vip" ? "border-amber-500 bg-amber-500" : "border-primary bg-primary" : "border-muted-foreground")}>
                                {planDays === pkg.days && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </div>
                              <div className="text-left">
                                <span className="text-sm font-semibold">{pkg.label}</span>
                                {"popular" in pkg && pkg.popular && (
                                  <span className={cn("ml-2 text-[10px] px-1.5 py-0.5 rounded-full font-bold", planType === "vip" ? "bg-amber-100 text-amber-700" : "bg-primary/10 text-primary")}>АЛДАРТАЙ</span>
                                )}
                                {"free" in pkg && pkg.free && (
                                  <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-700">ҮНЭГҮЙ</span>
                                )}
                                <div className="text-xs text-muted-foreground">{pkg.days === 24 ? "24 цаг нэмэгдэнэ" : `${pkg.days} хоног нэмэгдэнэ`}</div>
                              </div>
                            </div>
                            <span className={cn("font-bold font-mono text-sm flex-shrink-0", pkg.price === 0 ? "text-emerald-600" : planDays === pkg.days ? planType === "vip" ? "text-amber-600" : "text-primary" : "text-foreground")}>
                              {pkg.price === 0 ? "Үнэгүй" : `${pkg.price.toLocaleString()}₮`}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {(() => {
                      const price = currentPlanPrice;
                      const durationLabel = planDays === 24 ? "+24 цаг" : `+${planDays} хоног`;
                      return (
                        <div className={cn("p-4 rounded-xl border", planType === "vip" ? "bg-amber-50 border-amber-200 dark:bg-amber-950/20" : "bg-muted/40")}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Нэмэгдэх хугацаа</span>
                            <span className="font-semibold">{durationLabel}</span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-muted-foreground text-sm">Төлбөр</span>
                            <span className={cn("text-lg font-bold font-mono", price === 0 ? "text-emerald-600" : planType === "vip" ? "text-amber-600" : "text-primary")}>
                              {price === 0 ? "Үнэгүй" : `${price.toLocaleString()}₮`}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            💡 {isListingExpired(listing) ? "Одоогийн мөчөөс эхлэн тоологдоно." : "Одоогийн хугацааны үлдэгдэлд нэмэгдэнэ."}
                          </p>
                        </div>
                      );
                    })()}

                    {currentPlanPrice > 0 && !planSaved && (
                      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 flex gap-2.5">
                        <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 mb-1">Төлөв өөрчлөгдөнө</p>
                          <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                            Багц шинэчилмэгц зар <strong>"Хүлээгдэж байна"</strong> төлөвт орох ба төлбөр баталгаажмагц admin талаас идэвхжүүлэгдэнэ.
                          </p>
                        </div>
                      </div>
                    )}

                    {planSaved && (
                      <div className="flex items-start gap-2 px-3 py-2.5 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-sm dark:bg-emerald-950/20">
                        <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                        <div>
                          {currentPlanPrice > 0 ? "Багц шинэчлэгдлээ! Төлбөр баталгаажмагц зар автоматаар идэвхжинэ." : "Багц амжилттай шинэчлэгдлээ!"}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handlePlanSave}
                      disabled={planLoading}
                      className={cn("w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all", planType === "vip" ? "bg-amber-500 hover:bg-amber-600 text-white" : "bg-primary hover:bg-primary/90 text-primary-foreground", planLoading && "opacity-60 cursor-not-allowed")}
                    >
                      {planLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : isListingExpired(listing) ? <RefreshCw className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                      {planLoading ? "Хадгалж байна..." : isListingExpired(listing) ? "Сунгах" : "Багц шинэчлэх"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          {tab !== "plan" && (
            <div className="px-6 py-4 border-t border-border/50 shrink-0">
              {error && <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-lg mb-3">{error}</p>}
              <div className="flex items-center justify-between">
                <button onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Цуцлах</button>
                <Button onClick={handleSave} disabled={loading} className="gap-2">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  {loading ? "Хадгалж байна..." : "Хадгалах"}
                </Button>
              </div>
            </div>
          )}
          {tab === "plan" && error && (
            <div className="px-6 py-3 border-t border-border/50 shrink-0">
              <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>
            </div>
          )}
        </div>
      </div>
      <FreeLimitPopover
        open={showFreeLimitPopover}
        onClose={() => {
          setShowFreeLimitPopover(false);
          setPlanDays(7);
        }}
      />
    </>
  );
}

// ═══════════════ MAIN PAGE ═══════════════
export default function MyListingsPage() {
  const { isLoggedIn, user, token } = useAuth();
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editListing, setEditListing] = useState<Listing | null>(null);
  const [editTab, setEditTab] = useState<EditTab>("basic");

  useEffect(() => {
    if (!isLoggedIn) router.push("/");
  }, [isLoggedIn, router]);

  const fetchMyListings = async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Алдаа гарлаа");
      const newListings: Listing[] = data.data || data;

      const sortRank = (l: Listing) => {
        if (l.status === "pending") return 0;
        if (isListingExpired(l)) return 2;
        if (l.status === "active") return 1;
        return 3;
      };
      newListings.sort((a, b) => {
        const r = sortRank(a) - sortRank(b);
        if (r !== 0) return r;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      setListings(newListings);
      setEditListing((prev) =>
        prev ? (newListings.find((l) => l.id === prev.id) ?? prev) : null,
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && token) fetchMyListings();
  }, [isLoggedIn, token]);

  const handleDelete = async (id: string) => {
    if (!confirm("Зарыг устгах уу?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Устгах амжилтгүй");
      setListings((prev) => prev.filter((l) => l.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const openEdit = (listing: Listing, tab: EditTab = "basic") => {
    setEditTab(tab);
    setEditListing(listing);
  };

  if (!isLoggedIn) return null;

  const activeCount = listings.filter((l) => l.status === "active" && !isListingExpired(l)).length;
  const expiredCount = listings.filter((l) => isListingExpired(l)).length;
  const totalViews = listings.reduce((s, l) => s + (l.view_count || 0), 0);

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Миний зарууд</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {user?.name} • {listings.length} зар
            </p>
          </div>
          <Button onClick={() => setAddOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Зар нэмэх
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Нийт зар", value: listings.length, color: "text-foreground" },
            { label: "Идэвхтэй", value: activeCount, color: "text-emerald-600 dark:text-emerald-400" },
            { label: "Хугацаа дууссан", value: expiredCount, color: "text-red-500 dark:text-red-400" },
            { label: "Нийт үзэлт", value: totalViews, color: "text-primary" },
          ].map(({ label, value, color }) => (
            <div key={label} className="p-4 rounded-2xl border border-border/60 bg-background text-center">
              <p className={cn("text-2xl font-bold", color)}>{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mr-3" />
            <span>Ачааллаж байна...</span>
          </div>
        )}
        {!loading && error && (
          <div className="text-center py-20">
            <p className="text-destructive mb-4">{error}</p>
            <Button variant="outline" onClick={fetchMyListings}>Дахин оролдох</Button>
          </div>
        )}
        {!loading && !error && listings.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <div className="text-5xl mb-4">🏠</div>
            <p className="font-medium mb-2">Зар байхгүй байна</p>
            <p className="text-sm mb-6">Анхны зараа нэмж эхлээрэй</p>
            <Button onClick={() => setAddOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" /> Зар нэмэх
            </Button>
          </div>
        )}

        {!loading && !error && listings.length > 0 && (
          <div className="space-y-4">
            {listings.map((listing) => {
              const expired = isListingExpired(listing);
              const status = expired
                ? statusConfig.inactive
                : (statusConfig[listing.status] ?? statusConfig.pending);
              const expiry = formatExpiry(listing.expires_at);
              const modeBadge = getModeBadge(listing);
              const smartLoc = getSmartLocation(listing);
              const smartPrice = getSmartPrice(listing);

              return (
                <div
                  key={listing.id}
                  className={cn(
                    "flex gap-4 p-4 rounded-2xl border bg-background hover:shadow-md transition-all",
                    listing.is_vip && !expired
                      ? "border-amber-300/60 hover:border-amber-400/80"
                      : "border-border/60 hover:border-primary/30",
                    expired && "opacity-70 saturate-50",
                  )}
                >
                  <div className="w-28 h-24 sm:w-36 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-muted relative">
                    <img
                      src={listing.cover_image || "/placeholder.svg"}
                      alt={listing.title}
                      className="block w-full h-full object-cover"
                      loading="lazy"
                    />
                    {listing.is_vip && (
                      <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-amber-500 text-white text-[9px] font-bold">
                        ⭐ VIP
                      </div>
                    )}
                    {expired && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold bg-red-500 px-2 py-0.5 rounded">
                          ДУУССАН
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1 flex-wrap">
                        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                          <h3 className="font-semibold text-sm leading-snug line-clamp-1">
                            {listing.title}
                          </h3>
                          {modeBadge && (
                            <span className={cn("text-[9px] px-1.5 py-0.5 rounded-full font-bold border shrink-0", modeBadge.cls)}>
                              {modeBadge.label}
                            </span>
                          )}
                        </div>
                        <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0", status.color)}>
                          {status.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1.5">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span>{smartLoc}</span>
                        <span className="mx-1">•</span>
                        <Calendar className="h-3 w-3 shrink-0" />
                        <span>{new Date(listing.created_at).toLocaleDateString("mn-MN")}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-1.5 flex-wrap">
                        <span className="flex items-center gap-1">
                          <BedDouble className="h-3 w-3" /> {listing.rooms} өрөө
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath className="h-3 w-3" /> {listing.bathrooms}
                        </span>
                        <span className="flex items-center gap-1">
                          <Square className="h-3 w-3" /> {listing.area_sqm}м²
                        </span>
                        {listing.has_garage && (
                          <span className="flex items-center gap-1 text-blue-500">
                            <Car className="h-3 w-3" /> Гараж
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" /> {listing.view_count}
                        </span>
                      </div>
                      {expiry && (
                        <div className={cn(
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                          expiry.expired
                            ? "bg-red-50 text-red-600 border-red-100 dark:bg-red-950/30"
                            : expiry.urgent
                              ? "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30"
                              : "bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-900",
                        )}>
                          <Clock className="h-2.5 w-2.5" />
                          {expiry.text}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/40">
                      <span className={cn("font-bold text-sm", smartPrice.color)}>
                        {smartPrice.value.toLocaleString()}₮
                        <span className="text-xs font-normal text-muted-foreground ml-1">
                          {smartPrice.label}
                        </span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        {expired ? (
                          <button
                            onClick={() => openEdit(listing, "plan")}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white transition-colors"
                          >
                            <RefreshCw className="h-3 w-3" /> Сунгах
                          </button>
                        ) : (
                          <button
                            onClick={() => openEdit(listing, "basic")}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Pencil className="h-3 w-3" /> Засах
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(listing.id)}
                          className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ListingRegisterModal
        open={addOpen}
        onClose={() => {
          setAddOpen(false);
          fetchMyListings();
        }}
      />
      {editListing && (
        <EditModal
          listing={editListing}
          token={token}
          initialTab={editTab}
          onClose={() => setEditListing(null)}
          onSaved={fetchMyListings}
        />
      )}
    </div>
  );
}