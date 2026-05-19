"use client";

import { Building2, Tent, Tag, Store, MapPin, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// ═══════════════ DATA ═══════════════

const UB_DISTRICTS = [
  { name: "Сүхбаатар", khoroo: 20 },
  { name: "Чингэлтэй", khoroo: 19 },
  { name: "Баянгол", khoroo: 28 },
  { name: "Баянзүрх", khoroo: 43 },
  { name: "Хан-Уул", khoroo: 25 },
  { name: "Сонгинохайрхан", khoroo: 43 },
  { name: "Налайх", khoroo: 7 },
  { name: "Багануур", khoroo: 5 },
  { name: "Багахангай", khoroo: 2 },
];

const ZUSLAN_AREAS = [
  "Тэрэлж",
  "Сэргэлэн",
  "Улиастай",
  "Налайх",
  "Горхи",
  "Хустай",
  "Мандал",
  "Богдхан",
  "Баянчандмань",
  "Гачуурт",
  "Зуунмод",
];

// ═══════════════ TYPES ═══════════════

export type PropertyCategory = "bay" | "zuslan";
export type BayAction = "sell" | "rent";

export interface Step2Data {
  category: PropertyCategory | null;
  bayAction: BayAction | null;
  title: string;
  district: string | null;
  khoroo: number | null;
  zuslanArea: string | null;
  address: string;
}

interface Props {
  data: Step2Data;
  onChange: (data: Step2Data) => void;
}

export const emptyStep2Data: Step2Data = {
  category: null,
  bayAction: null,
  title: "",
  district: null,
  khoroo: null,
  zuslanArea: null,
  address: "",
};

// ═══════════════ COMPONENT ═══════════════

export function Step2PropertyInfo({ data, onChange }: Props) {
  const set = <K extends keyof Step2Data>(key: K, value: Step2Data[K]) => {
    onChange({ ...data, [key]: value });
  };

  const setCategory = (category: PropertyCategory) => {
    onChange({
      ...data,
      category,
      bayAction: category === "bay" ? data.bayAction : null,
      district: null,
      khoroo: null,
      zuslanArea: null,
    });
  };

  const setDistrict = (district: string) => {
    onChange({ ...data, district, khoroo: null });
  };

  const currentDistrict = UB_DISTRICTS.find((d) => d.name === data.district);

  return (
    <div className="space-y-5">
      {/* ── 1. Property Category ── */}
      <div>
        <label className="text-sm font-semibold mb-2 block">
          Үл хөдлөхийн төрөл <span className="text-destructive">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              id: "bay" as const,
              icon: Building2,
              label: "Байр",
              desc: "Хотын дотор",
            },
            {
              id: "zuslan" as const,
              icon: Tent,
              label: "Зуслан",
              desc: "Хотоос гадна",
            },
          ].map(({ id, icon: Icon, label, desc }) => {
            const selected = data.category === id;
            return (
              <button
                key={id}
                onClick={() => setCategory(id)}
                className={cn(
                  "flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all",
                  selected
                    ? "border-primary bg-primary/10"
                    : "border-border/60 hover:border-primary/40",
                )}
              >
                <Icon
                  className={cn(
                    "h-7 w-7",
                    selected ? "text-primary" : "text-muted-foreground",
                  )}
                />
                <span
                  className={cn(
                    "text-sm font-bold",
                    selected ? "text-primary" : "text-foreground",
                  )}
                >
                  {label}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 2. Sub-action — Байр сонгосон үед ── */}
      {data.category === "bay" && (
        <div className="animate-in slide-in-from-top-2 duration-200">
          <label className="text-sm font-semibold mb-2 block">
            Хэлбэр <span className="text-destructive">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                id: "sell" as const,
                icon: Tag,
                label: "Зарах",
                desc: "Худалдах",
              },
              {
                id: "rent" as const,
                icon: Store,
                label: "Түрээслэх",
                desc: "Өдөр / Сараар",
              },
            ].map(({ id, icon: Icon, label, desc }) => {
              const selected = data.bayAction === id;
              return (
                <button
                  key={id}
                  onClick={() => set("bayAction", id)}
                  className={cn(
                    "flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all",
                    selected
                      ? "border-primary bg-primary/10"
                      : "border-border/60 hover:border-primary/40",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 shrink-0",
                      selected ? "text-primary" : "text-muted-foreground",
                    )}
                  />
                  <div className="text-left flex-1">
                    <div
                      className={cn(
                        "text-sm font-bold",
                        selected ? "text-primary" : "text-foreground",
                      )}
                    >
                      {label}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {desc}
                    </div>
                  </div>
                  {selected && (
                    <Check className="h-4 w-4 text-primary shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 3. Title ── */}
      <div>
        <label className="text-sm font-semibold mb-1.5 block">
          Гарчиг <span className="text-destructive">*</span>
        </label>
        <input
          value={data.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder={
            data.category === "zuslan"
              ? "Богдхан орчмын тухлагтай зуслан"
              : data.bayAction === "sell"
                ? "Сансар 4 өрөө байр зарна"
                : data.bayAction === "rent"
                  ? "Зайсан 2 өрөө байр өдрөөр түрээслэнэ"
                  : "Богдхан орчмын тухлагтай зуслан"
          }
          className="w-full px-4 py-2.5 text-sm bg-muted/50 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
        />
      </div>

      {/* ── 4. LOCATION — Динамик ── */}
      {data.category === "zuslan" && (
        <div className="animate-in slide-in-from-top-2 duration-200">
          <label className="text-sm font-semibold mb-2 flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-primary" /> Байршил{" "}
            <span className="text-destructive">*</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {ZUSLAN_AREAS.map((area) => {
              const selected = data.zuslanArea === area;
              return (
                <button
                  key={area}
                  onClick={() => set("zuslanArea", area)}
                  className={cn(
                    "text-xs px-3 py-1 rounded-full border transition-all",
                    selected
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border/60 text-muted-foreground hover:border-primary/40",
                  )}
                >
                  {selected && "✓ "}
                  {area}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {data.category === "bay" && (
        <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
          <label className="text-sm font-semibold mb-1 flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-primary" /> Байршил{" "}
            <span className="text-destructive">*</span>
          </label>

          {/* District chips */}
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground mb-1.5">
              Дүүрэг
            </p>
            <div className="flex flex-wrap gap-1.5">
              {UB_DISTRICTS.map(({ name }) => {
                const selected = data.district === name;
                return (
                  <button
                    key={name}
                    onClick={() => setDistrict(name)}
                    className={cn(
                      "text-xs px-3 py-1 rounded-full border transition-all",
                      selected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border/60 text-muted-foreground hover:border-primary/40",
                    )}
                  >
                    {selected && "✓ "}
                    {name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Khoroo dropdown */}
          {currentDistrict && (
            <div className="animate-in slide-in-from-top-1 duration-200">
              <p className="text-[11px] font-semibold text-muted-foreground mb-1.5">
                Хороо
              </p>
              <select
                value={data.khoroo || ""}
                onChange={(e) =>
                  set(
                    "khoroo",
                    e.target.value ? parseInt(e.target.value) : null,
                  )
                }
                className="w-full px-4 py-2.5 text-sm bg-muted/50 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all cursor-pointer"
              >
                <option value="">— Хороо сонгох —</option>
                {Array.from(
                  { length: currentDistrict.khoroo },
                  (_, i) => i + 1,
                ).map((n) => (
                  <option key={n} value={n}>
                    {n}-р хороо
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* ── 5. Detailed Address ── */}
      {data.category && (
        <div className="animate-in slide-in-from-top-2 duration-200">
          <label className="text-sm font-semibold mb-1.5 block">
            Дэлгэрэнгүй хаяг
          </label>
          <input
            value={data.address}
            onChange={(e) => set("address", e.target.value)}
            placeholder={
              data.category === "bay"
                ? "Гудамж, байрны нэр, тоот..."
                : "Хүрэх зам, тэмдэг..."
            }
            className="w-full px-4 py-2.5 text-sm bg-muted/50 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>
      )}
    </div>
  );
}
