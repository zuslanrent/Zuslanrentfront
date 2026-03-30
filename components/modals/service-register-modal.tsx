"use client"

import { useState } from "react"
import {
  X, Tent, TreePine, Waves, Mountain, Utensils, Shield,
  HeartHandshake, Phone, Clock, ChevronRight, CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ImageUploader, type UploadedImage } from "./image-uploader"

const serviceCategories = [
  { id: "rental",    icon: Tent,         label: "Түрээс"         },
  { id: "nature",    icon: TreePine,     label: "Байгаль"        },
  { id: "water",     icon: Waves,        label: "Усны үйлчилгээ" },
  { id: "adventure", icon: Mountain,     label: "Аялал"          },
  { id: "food",      icon: Utensils,     label: "Хоол"           },
  { id: "extra",     icon: Shield,       label: "Нэмэлт"         },
]

const featureOptions = [
  "Мэргэжлийн хөтөч", "Тоног хэрэгсэл", "Аюулгүйн бэлтгэл",
  "Хүнс оролцоно", "Тээвэр хамт", "Цэвэрлэгээ", "Зааварлагч",
  "Бүртгэл бус захиалга", "Амралтын өдрүүдэд",
]

const durations = [
  "1–2 цаг", "Хагас өдөр", "Өдрийн аялал",
  "Шөнийн", "1 сар", "Байнга",
]

type Step = 1 | 2 | 3 | 4

interface Props { onClose: () => void }

export function ServiceRegisterModal({ onClose }: Props) {
  const [step, setStep]           = useState<Step>(1)
  const [submitted, setSubmitted] = useState(false)
  const [images, setImages]       = useState<UploadedImage[]>([])
  const [form, setForm] = useState({
    category: "", title: "", description: "",
    price: "", duration: "", is_free: false,
    features: [] as string[],
    provider_name: "", phone: "",
  })

  const set = (k: string, v: string | boolean) => setForm(p => ({ ...p, [k]: v }))
  const toggleFeature = (f: string) =>
    setForm(p => ({
      ...p,
      features: p.features.includes(f)
        ? p.features.filter(x => x !== f)
        : [...p.features, f],
    }))

  const canNext = () => {
    if (step === 1) return images.length > 0
    if (step === 2) return !!form.category && !!form.title && form.description.length >= 10
    if (step === 3) return (!!form.price || !!form.is_free) && !!form.duration
    if (step === 4) return !!form.provider_name && !!form.phone
    return false
  }

  const steps = ["Зурагнууд", "Үйлчилгээ", "Үнэ & Онцлог", "Холбоо барих"]

  return (
    <div className="relative w-full max-w-2xl max-h-[88vh] flex flex-col bg-background rounded-2xl shadow-2xl border border-border/60">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border/50 shrink-0">
        <div>
          <h2 className="text-lg font-bold">🎯 Үйлчилгээ бүртгэх</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {submitted ? "Амжилттай!" : `${step}-р алхам / ${steps.length}`}
          </p>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-full hover:bg-muted transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Step bar */}
      {!submitted && (
        <div className="flex items-center gap-0 px-6 py-3 border-b border-border/30 shrink-0 overflow-x-auto">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center flex-1 min-w-0">
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                  step > i+1 ? "bg-emerald-500 text-white"
                  : step === i+1 ? "bg-emerald-500 text-white ring-4 ring-emerald-500/20"
                  : "bg-muted text-muted-foreground"
                )}>{step > i+1 ? "✓" : i+1}</div>
                <span className={cn(
                  "text-[10px] whitespace-nowrap hidden sm:block",
                  step === i+1 ? "text-emerald-600 font-semibold" : "text-muted-foreground"
                )}>{s}</span>
              </div>
              {i < steps.length-1 && (
                <div className={cn("flex-1 h-0.5 mx-1 mb-4 rounded transition-all",
                  step > i+1 ? "bg-emerald-500" : "bg-border")} />
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
              <HeartHandshake className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Үйлчилгээ бүртгэгдлээ!</h3>
            <p className="text-sm text-muted-foreground max-w-xs">Таны үйлчилгээ шалгагдаж нийтлэгдэх болно.</p>
            <div className="mt-5 p-4 rounded-xl bg-muted/50 border border-border/60 text-left w-full max-w-xs space-y-2">
              <div className="flex items-center gap-2">
                {images[0] && (
                  <img src={images[0].preview} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                )}
                <div>
                  <p className="font-semibold text-sm">{form.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {form.is_free ? "Үнэгүй" : `${parseInt(form.price||"0").toLocaleString()}₮`} • {form.duration}
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{images.length} зураг оруулсан</p>
            </div>
            <Button className="mt-5 bg-emerald-500 hover:bg-emerald-600" onClick={onClose}>Хаах</Button>
          </div>
        )}

        {/* STEP 1 — Зурагнууд */}
        {!submitted && step === 1 && (
          <ImageUploader images={images} onChange={setImages} maxImages={8} />
        )}

        {/* STEP 2 — Үйлчилгээ мэдээлэл */}
        {!submitted && step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="text-sm font-semibold mb-2 block">Төрөл <span className="text-destructive">*</span></label>
              <div className="grid grid-cols-3 gap-2">
                {serviceCategories.map(({ id, icon: Icon, label }) => (
                  <button key={id} onClick={() => set("category", id)}
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all",
                      form.category === id
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400"
                        : "border-border/60 text-muted-foreground hover:border-emerald-300"
                    )}>
                    <Icon className="h-4 w-4 shrink-0" />{label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Үйлчилгээний нэр <span className="text-destructive">*</span></label>
              <input value={form.title} onChange={e => set("title", e.target.value)}
                placeholder="Морин аялал, Барбекю иж бүрдэл..."
                className="w-full px-4 py-2.5 text-sm bg-muted/50 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all" />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1.5 block">
                Тайлбар <span className="text-destructive">*</span>
                <span className="text-muted-foreground font-normal ml-2 text-xs">(10+ тэмдэгт)</span>
              </label>
              <textarea value={form.description} onChange={e => set("description", e.target.value)}
                rows={3} placeholder="Үйлчилгээний дэлгэрэнгүй тайлбар, онцлог..."
                className="w-full px-4 py-3 text-sm bg-muted/50 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all resize-none" />
              <div className="flex justify-end mt-1">
                <span className={cn("text-xs", form.description.length < 10 ? "text-muted-foreground" : "text-emerald-600")}>
                  {form.description.length} / 10+
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 — Үнэ & Онцлог */}
        {!submitted && step === 3 && (
          <div className="space-y-5">
            <div>
              <label className="text-sm font-semibold mb-2 block">Үнэ <span className="text-destructive">*</span></label>
              <div className="flex items-center gap-3 mb-3">
                <input type="checkbox" id="is_free" checked={form.is_free as boolean}
                  onChange={e => set("is_free", e.target.checked)}
                  className="w-4 h-4 accent-emerald-500" />
                <label htmlFor="is_free" className="text-sm cursor-pointer">Үнэгүй үйлчилгээ</label>
              </div>
              {!form.is_free && (
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₮</span>
                  <input type="number" value={form.price} onChange={e => set("price", e.target.value)}
                    placeholder="45000"
                    className="w-full pl-8 pr-4 py-2.5 text-sm bg-muted/50 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all" />
                </div>
              )}
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 flex items-center gap-1 block">
                <Clock className="h-3.5 w-3.5" /> Үргэлжлэх хугацаа <span className="text-destructive">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {durations.map(d => (
                  <button key={d} onClick={() => set("duration", d)}
                    className={cn(
                      "text-xs px-3 py-1.5 rounded-full border transition-all",
                      form.duration === d
                        ? "bg-emerald-500 text-white border-emerald-500"
                        : "border-border/60 text-muted-foreground hover:border-emerald-300"
                    )}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block">Онцлогууд</label>
              <div className="flex flex-wrap gap-2">
                {featureOptions.map(f => (
                  <button key={f} onClick={() => toggleFeature(f)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                      form.features.includes(f)
                        ? "bg-emerald-500 text-white border-emerald-500"
                        : "border-border/60 text-muted-foreground hover:border-emerald-300"
                    )}>
                    {form.features.includes(f) && <CheckCircle2 className="h-3 w-3" />}{f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4 — Холбоо барих */}
        {!submitted && step === 4 && (
          <div className="space-y-5">
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Нэр / Байгууллагын нэр <span className="text-destructive">*</span></label>
              <input value={form.provider_name} onChange={e => set("provider_name", e.target.value)}
                placeholder="Таны нэр эсвэл компанийн нэр"
                className="w-full px-4 py-2.5 text-sm bg-muted/50 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all" />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Утас <span className="text-destructive">*</span></label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input value={form.phone} onChange={e => set("phone", e.target.value)}
                  placeholder="9900-0000"
                  className="w-full pl-11 pr-4 py-2.5 text-sm bg-muted/50 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all" />
              </div>
            </div>
            {/* Summary */}
            <div className="p-4 rounded-xl bg-muted/40 border border-border/50 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Нийтлэх мэдээлэл</p>
              <div className="flex gap-1.5 mb-3">
                {images.slice(0, 5).map((img, i) => (
                  <div key={img.id} className={cn(
                    "rounded-lg overflow-hidden bg-muted shrink-0",
                    i === 0 ? "w-16 h-12" : "w-10 h-12"
                  )}>
                    <img src={img.preview} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
                {images.length > 5 && (
                  <div className="w-10 h-12 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground font-medium shrink-0">
                    +{images.length - 5}
                  </div>
                )}
              </div>
              {[
                ["Нэр",     form.title],
                ["Үнэ",     form.is_free ? "Үнэгүй" : `${parseInt(form.price||"0").toLocaleString()}₮`],
                ["Хугацаа", form.duration],
                ["Онцлог",  `${form.features.length} сонгогдсон`],
                ["Зураг",   `${images.length} ширхэг`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-medium">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {!submitted && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-border/50 shrink-0">
          <button onClick={() => step > 1 ? setStep(s => (s-1) as Step) : onClose()}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {step === 1 ? "Цуцлах" : "← Буцах"}
          </button>
          <Button
            onClick={() => step < 4 ? setStep(s => (s+1) as Step) : setSubmitted(true)}
            disabled={!canNext()}
            className="gap-2 px-6 bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            {step === 4
              ? <><CheckCircle2 className="h-4 w-4" /> Нийтлэх</>
              : <>Үргэлжлүүлэх <ChevronRight className="h-4 w-4" /></>
            }
          </Button>
        </div>
      )}
    </div>
  )
}