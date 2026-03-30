"use client"

import { useState } from "react"
import {
  X, Home, Tent, Building2, TreePine, Warehouse,
  Waves, Mountain, Phone, BedDouble, Bath, Square,
  Tag, ChevronRight, CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ImageUploader, type UploadedImage } from "./image-uploader"

const categories = [
  { id: "apartment", icon: Home,      label: "Орон сууц"   },
  { id: "camp",      icon: Tent,      label: "Зуслан"      },
  { id: "house",     icon: Building2, label: "Байшин"      },
  { id: "forest",    icon: TreePine,  label: "Ойн бүс"     },
  { id: "lake",      icon: Waves,     label: "Нуурын эрэг" },
  { id: "mountain",  icon: Mountain,  label: "Уулын бүс"   },
  { id: "warehouse", icon: Warehouse, label: "Агуулах"     },
]

const locations = [
  "Богдхан","Тэрэлж","Сэргэлэн","Улиастай",
  "Налайх","Горхи","Хустай","Мандал","Баянчандмань",
]

const amenitiesList = [
  "WiFi","Барбекю","Зогсоол","Саун","Цэцэрлэг",
  "Тоглоомын талбай","Загасчлал","Хөргөгч","Телевиз","Угаалга",
]

type Step = 1 | 2 | 3 | 4 | 5

interface Props { onClose: () => void }

export function ListingRegisterModal({ onClose }: Props) {
  const [step, setStep]           = useState<Step>(1)
  const [submitted, setSubmitted] = useState(false)
  const [images, setImages]       = useState<UploadedImage[]>([])
  const [form, setForm] = useState({
    category: "", title: "", location: "", address: "",
    price: "", rooms: "1", bathrooms: "1", area: "", max_guests: "2",
    amenities: [] as string[], description: "",
    phone: "", name: "", tags: "",
  })

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))
  const toggleAmenity = (a: string) =>
    setForm(p => ({
      ...p,
      amenities: p.amenities.includes(a)
        ? p.amenities.filter(x => x !== a)
        : [...p.amenities, a],
    }))

  const canNext = () => {
    if (step === 1) return images.length > 0
    if (step === 2) return form.category && form.title && form.location
    if (step === 3) return form.price && form.area
    if (step === 4) return form.description.length >= 20
    if (step === 5) return form.phone && form.name
    return false
  }

  const steps = ["Зурагнууд", "Мэдээлэл", "Үнэ & Хэмжээ", "Тохижилт", "Холбоо"]

  return (
    <div className="relative w-full max-w-2xl max-h-[88vh] flex flex-col bg-background rounded-2xl shadow-2xl border border-border/60">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border/50 shrink-0">
        <div>
          <h2 className="text-lg font-bold">🏠 Байр бүртгэх</h2>
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
                  step > i+1 ? "bg-primary text-primary-foreground"
                  : step === i+1 ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                  : "bg-muted text-muted-foreground"
                )}>{step > i+1 ? "✓" : i+1}</div>
                <span className={cn(
                  "text-[10px] whitespace-nowrap hidden sm:block",
                  step === i+1 ? "text-primary font-semibold" : "text-muted-foreground"
                )}>{s}</span>
              </div>
              {i < steps.length-1 && (
                <div className={cn("flex-1 h-0.5 mx-1 mb-4 rounded transition-all",
                  step > i+1 ? "bg-primary" : "bg-border")} />
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
            <h3 className="text-xl font-bold mb-2">Зар амжилттай илгээгдлээ!</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Таны зар шалгагдаж, удахгүй нийтлэгдэх болно.
            </p>
            <div className="mt-5 p-4 rounded-xl bg-muted/50 border border-border/60 text-left w-full max-w-xs space-y-1">
              <div className="flex items-center gap-2">
                <img src={images[0]?.preview} alt="" className="w-12 h-12 rounded-lg object-cover" />
                <div>
                  <p className="font-semibold text-sm">{form.title}</p>
                  <p className="text-xs text-muted-foreground">{form.location} • {parseInt(form.price||"0").toLocaleString()}₮/өдөр</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{images.length} зураг оруулсан</p>
            </div>
            <Button className="mt-5" onClick={onClose}>Хаах</Button>
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

        {/* STEP 2 — Үндсэн мэдээлэл */}
        {!submitted && step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="text-sm font-semibold mb-2 block">Байрны төрөл <span className="text-destructive">*</span></label>
              <div className="grid grid-cols-4 gap-2">
                {categories.map(({ id, icon: Icon, label }) => (
                  <button key={id} onClick={() => set("category", id)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-xs font-medium transition-all",
                      form.category === id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/60 hover:border-primary/40 text-muted-foreground hover:text-foreground"
                    )}>
                    <Icon className="h-4 w-4" />{label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Гарчиг <span className="text-destructive">*</span></label>
              <input value={form.title} onChange={e => set("title", e.target.value)}
                placeholder="Богдхан орчмын тухлагтай зуслан"
                className="w-full px-4 py-2.5 text-sm bg-muted/50 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Байршил <span className="text-destructive">*</span></label>
              <div className="flex flex-wrap gap-1.5">
                {locations.map(loc => (
                  <button key={loc} onClick={() => set("location", loc)}
                    className={cn(
                      "text-xs px-3 py-1 rounded-full border transition-all",
                      form.location === loc
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border/60 text-muted-foreground hover:border-primary/40"
                    )}>
                    {form.location === loc && "✓ "}{loc}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Дэлгэрэнгүй хаяг</label>
              <input value={form.address} onChange={e => set("address", e.target.value)}
                placeholder="Дүүрэг, хороо, гудамж..."
                className="w-full px-4 py-2.5 text-sm bg-muted/50 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
            </div>
          </div>
        )}

        {/* STEP 3 — Үнэ & Хэмжээ */}
        {!submitted && step === 3 && (
          <div className="space-y-5">
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Өдрийн үнэ (₮) <span className="text-destructive">*</span></label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₮</span>
                <input type="number" value={form.price} onChange={e => set("price", e.target.value)}
                  placeholder="150000"
                  className="w-full pl-8 pr-4 py-2.5 text-sm bg-muted/50 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
              </div>
              {form.price && <p className="text-xs text-muted-foreground mt-1">= {parseInt(form.price).toLocaleString()}₮ / өдөр</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold mb-1.5 flex items-center gap-1 block"><BedDouble className="h-3.5 w-3.5" /> Өрөө</label>
                <div className="flex gap-1">
                  {["1","2","3","4","5+"].map(n => (
                    <button key={n} onClick={() => set("rooms", n)}
                      className={cn("flex-1 py-2 rounded-lg text-xs font-semibold border transition-all",
                        form.rooms === n ? "bg-primary text-primary-foreground border-primary" : "border-border/60 text-muted-foreground hover:text-foreground")}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 flex items-center gap-1 block"><Bath className="h-3.5 w-3.5" /> Ариун цэвэр</label>
                <div className="flex gap-1">
                  {["1","2","3","4+"].map(n => (
                    <button key={n} onClick={() => set("bathrooms", n)}
                      className={cn("flex-1 py-2 rounded-lg text-xs font-semibold border transition-all",
                        form.bathrooms === n ? "bg-primary text-primary-foreground border-primary" : "border-border/60 text-muted-foreground hover:text-foreground")}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold mb-1.5 flex items-center gap-1 block"><Square className="h-3.5 w-3.5" /> Талбай (м²) <span className="text-destructive">*</span></label>
                <input type="number" value={form.area} onChange={e => set("area", e.target.value)}
                  placeholder="120"
                  className="w-full px-4 py-2.5 text-sm bg-muted/50 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Хамгийн их хүн</label>
                <select value={form.max_guests} onChange={e => set("max_guests", e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-muted/50 border border-border/60 rounded-xl focus:outline-none cursor-pointer">
                  {["2","4","6","8","10","12","15+"].map(n => <option key={n} value={n}>{n} хүн</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4 — Тохижилт */}
        {!submitted && step === 4 && (
          <div className="space-y-5">
            <div>
              <label className="text-sm font-semibold mb-2 block">Тохижилт</label>
              <div className="flex flex-wrap gap-2">
                {amenitiesList.map(a => (
                  <button key={a} onClick={() => toggleAmenity(a)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                      form.amenities.includes(a)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border/60 text-muted-foreground hover:border-primary/40"
                    )}>
                    {form.amenities.includes(a) && <CheckCircle2 className="h-3 w-3" />}{a}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold mb-1.5 block">
                Тайлбар <span className="text-destructive">*</span>
                <span className="text-muted-foreground font-normal ml-2 text-xs">(20+ тэмдэгт)</span>
              </label>
              <textarea value={form.description} onChange={e => set("description", e.target.value)}
                rows={4} placeholder="Байрны онцлог, ойролцоох газрууд..."
                className="w-full px-4 py-3 text-sm bg-muted/50 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none" />
              <div className="flex justify-end mt-1">
                <span className={cn("text-xs", form.description.length < 20 ? "text-muted-foreground" : "text-emerald-600 dark:text-emerald-400")}>
                  {form.description.length} / 20+
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold mb-1.5 flex items-center gap-1 block"><Tag className="h-3.5 w-3.5" /> Шошго</label>
              <input value={form.tags} onChange={e => set("tags", e.target.value)}
                placeholder="Барбекю, Нуурын эрэг, Ойн орчим..."
                className="w-full px-4 py-2.5 text-sm bg-muted/50 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
            </div>
          </div>
        )}

        {/* STEP 5 — Холбоо барих */}
        {!submitted && step === 5 && (
          <div className="space-y-5">
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Нэр <span className="text-destructive">*</span></label>
              <input value={form.name} onChange={e => set("name", e.target.value)}
                placeholder="Таны нэр"
                className="w-full px-4 py-2.5 text-sm bg-muted/50 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Утас <span className="text-destructive">*</span></label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input value={form.phone} onChange={e => set("phone", e.target.value)}
                  placeholder="9900-0000"
                  className="w-full pl-11 pr-4 py-2.5 text-sm bg-muted/50 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
              </div>
            </div>

            {/* Summary */}
            <div className="p-4 rounded-xl bg-muted/40 border border-border/50 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Нийтлэх мэдээлэл</p>
              {/* Image preview */}
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
                ["Гарчиг",   form.title],
                ["Байршил",  form.location],
                ["Үнэ",      `${parseInt(form.price||"0").toLocaleString()}₮/өдөр`],
                ["Талбай",   `${form.area}м² • ${form.rooms} өрөө`],
                ["Зураг",    `${images.length} ширхэг`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-medium truncate ml-4 max-w-[180px]">{v}</span>
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
            onClick={() => step < 5 ? setStep(s => (s+1) as Step) : setSubmitted(true)}
            disabled={!canNext()}
            className="gap-2 px-6"
          >
            {step === 5
              ? <><CheckCircle2 className="h-4 w-4" /> Нийтлэх</>
              : <>Үргэлжлүүлэх <ChevronRight className="h-4 w-4" /></>
            }
          </Button>
        </div>
      )}
    </div>
  )
}