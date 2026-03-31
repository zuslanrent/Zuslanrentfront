"use client"

import { useState, useEffect } from "react"
import {
  X, Home, Tent, Building2, TreePine, Warehouse,
  Waves, Mountain, Phone, BedDouble, Bath, Square,
  Tag, ChevronRight, CheckCircle2, Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ImageUploader, type UploadedImage } from "./image-uploader"
import { useAuth } from "@/components/auth/auth-provider"

const amenitiesList = [
  "WiFi","Барбекю","Зогсоол","Саун","Цэцэрлэг",
  "Тоглоомын талбай","Загасчлал","Хөргөгч","Телевиз","Угаалга",
]

type Step = 1 | 2 | 3 | 4 | 5

interface Props {
  open:    boolean  // ← нэмэх
  onClose: () => void
}

interface Category { id: number; name: string; slug: string }
interface Location { id: number; name: string; slug: string }

const categoryIcons: Record<string, React.ElementType> = {
  apartment: Home,
  camp:      Tent,
  house:     Building2,
  forest:    TreePine,
  lake:      Waves,
  mountain:  Mountain,
  warehouse: Warehouse,
}

export function ListingRegisterModal({ open, onClose }: Props) {
  if (!open) return null
  const { token } = useAuth()
  const [step,       setStep]       = useState<Step>(1)
  const [submitted,  setSubmitted]  = useState(false)
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState("")
  const [images,     setImages]     = useState<UploadedImage[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [locations,  setLocations]  = useState<Location[]>([])

  const [form, setForm] = useState({
    category_id:  "",
    location_id:  "",
    title:        "",
    address:      "",
    price_per_day:"",
    rooms:        "1",
    bathrooms:    "1",
    area_sqm:     "",
    max_guests:   "2",
    amenities:    [] as string[],
    description:  "",
    phone:        "",
    tags:         "",
  })

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const toggleAmenity = (a: string) =>
    setForm(p => ({
      ...p,
      amenities: p.amenities.includes(a)
        ? p.amenities.filter(x => x !== a)
        : [...p.amenities, a],
    }))

  // Categories + Locations авах
  useEffect(() => {
  const API = process.env.NEXT_PUBLIC_API_URL

  fetch(`${API}/api/locations`)
    .then(r => r.json())
    .then(data => setLocations(Array.isArray(data) ? data : data.data || []))
    .catch(console.error)

  setCategories([
    { id:1, name:"Орон сууц",   slug:"apartment" },
    { id:2, name:"Зуслан",      slug:"camp"      },
    { id:3, name:"Байшин",      slug:"house"     },
    { id:4, name:"Ойн бүс",     slug:"forest"    },
    { id:5, name:"Нуурын эрэг", slug:"lake"      },
    { id:6, name:"Уулын бүс",   slug:"mountain"  },
    { id:7, name:"Агуулах",     slug:"warehouse" },
  ])
}, [])

  const canNext = () => {
    if (step === 1) return images.length > 0
    if (step === 2) return !!form.category_id && !!form.title && !!form.location_id
    if (step === 3) return !!form.price_per_day && !!form.area_sqm
    if (step === 4) return form.description.length >= 20
    if (step === 5) return !!form.phone
    return false
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError("")
    try {
      const API = process.env.NEXT_PUBLIC_API_URL

      // Зурагнуудыг бэлтгэх
      const imagesPayload = images.map((img, i) => ({
        url:        img.url,
        is_cover:   i === 0,
        sort_order: i,
      }))

      const res = await fetch(`${API}/api/listings`, {
        method:  "POST",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          category_id:   parseInt(form.category_id),
          location_id:   parseInt(form.location_id),
          title:         form.title,
          description:   form.description,
          address:       form.address,
          price_per_day: parseInt(form.price_per_day),
          area_sqm:      parseInt(form.area_sqm),
          rooms:         parseInt(form.rooms),
          bathrooms:     parseInt(form.bathrooms),
          max_guests:    parseInt(form.max_guests),
          amenities:     form.amenities,
          phone:         form.phone,
          tags:          form.tags.split(",").map(t => t.trim()).filter(Boolean),
          images:        imagesPayload,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Алдаа гарлаа")

      setSubmitted(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
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
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Зар амжилттай илгээгдлээ!</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Таны зар шалгагдаж, удахгүй нийтлэгдэх болно.
            </p>
            <Button className="mt-5" onClick={onClose}>Хаах</Button>
          </div>
        )}

        {/* STEP 1 — Зурагнууд */}
        {!submitted && step === 1 && (
          <ImageUploader images={images} onChange={setImages} maxImages={8} />
        )}

        {/* STEP 2 — Мэдээлэл */}
        {!submitted && step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="text-sm font-semibold mb-2 block">
                Байрны төрөл <span className="text-destructive">*</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {categories.map(cat => {
                  const Icon = categoryIcons[cat.slug] || Home
                  return (
                    <button key={cat.id} onClick={() => set("category_id", String(cat.id))}
                      className={cn(
                        "flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-xs font-medium transition-all",
                        form.category_id === String(cat.id)
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border/60 hover:border-primary/40 text-muted-foreground"
                      )}>
                      <Icon className="h-4 w-4" />{cat.name}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold mb-1.5 block">
                Гарчиг <span className="text-destructive">*</span>
              </label>
              <input value={form.title} onChange={e => set("title", e.target.value)}
                placeholder="Богдхан орчмын тухлагтай зуслан"
                className="w-full px-4 py-2.5 text-sm bg-muted/50 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
            </div>

            <div>
              <label className="text-sm font-semibold mb-1.5 block">
                Байршил <span className="text-destructive">*</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {locations.map(loc => (
                  <button key={loc.id} onClick={() => set("location_id", String(loc.id))}
                    className={cn(
                      "text-xs px-3 py-1 rounded-full border transition-all",
                      form.location_id === String(loc.id)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border/60 text-muted-foreground hover:border-primary/40"
                    )}>
                    {form.location_id === String(loc.id) && "✓ "}{loc.name}
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
              <label className="text-sm font-semibold mb-1.5 block">
                Өдрийн үнэ (₮) <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₮</span>
                <input type="number" value={form.price_per_day} onChange={e => set("price_per_day", e.target.value)}
                  placeholder="150000"
                  className="w-full pl-8 pr-4 py-2.5 text-sm bg-muted/50 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
              </div>
              {form.price_per_day && (
                <p className="text-xs text-muted-foreground mt-1">
                  = {parseInt(form.price_per_day).toLocaleString()}₮/өдөр
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold mb-1.5 flex items-center gap-1 block">
                  <BedDouble className="h-3.5 w-3.5" /> Өрөө
                </label>
                <div className="flex gap-1">
                  {["1","2","3","4","5+"].map(n => (
                    <button key={n} onClick={() => set("rooms", n)}
                      className={cn("flex-1 py-2 rounded-lg text-xs font-semibold border transition-all",
                        form.rooms === n ? "bg-primary text-primary-foreground border-primary"
                        : "border-border/60 text-muted-foreground")}>
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
                  {["1","2","3","4+"].map(n => (
                    <button key={n} onClick={() => set("bathrooms", n)}
                      className={cn("flex-1 py-2 rounded-lg text-xs font-semibold border transition-all",
                        form.bathrooms === n ? "bg-primary text-primary-foreground border-primary"
                        : "border-border/60 text-muted-foreground")}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold mb-1.5 flex items-center gap-1 block">
                  <Square className="h-3.5 w-3.5" /> Талбай (м²) <span className="text-destructive">*</span>
                </label>
                <input type="number" value={form.area_sqm} onChange={e => set("area_sqm", e.target.value)}
                  placeholder="120"
                  className="w-full px-4 py-2.5 text-sm bg-muted/50 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Хамгийн их хүн</label>
                <select value={form.max_guests} onChange={e => set("max_guests", e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-muted/50 border border-border/60 rounded-xl focus:outline-none cursor-pointer">
                  {["2","4","6","8","10","12","15+"].map(n => (
                    <option key={n} value={n}>{n} хүн</option>
                  ))}
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
                <span className={cn("text-xs",
                  form.description.length < 20 ? "text-muted-foreground" : "text-emerald-600")}>
                  {form.description.length} / 20+
                </span>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold mb-1.5 flex items-center gap-1 block">
                <Tag className="h-3.5 w-3.5" /> Шошго
              </label>
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
              <label className="text-sm font-semibold mb-1.5 block">
                Утас <span className="text-destructive">*</span>
              </label>
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
                ["Байршил",  locations.find(l => String(l.id) === form.location_id)?.name || ""],
                ["Үнэ",      `${parseInt(form.price_per_day||"0").toLocaleString()}₮/өдөр`],
                ["Талбай",   `${form.area_sqm}м² • ${form.rooms} өрөө`],
                ["Зураг",    `${images.length} ширхэг`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-medium truncate ml-4 max-w-[180px]">{v}</span>
                </div>
              ))}
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                {error}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      {!submitted && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-border/50 shrink-0">
          <button
            onClick={() => step > 1 ? setStep(s => (s-1) as Step) : onClose()}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {step === 1 ? "Цуцлах" : "← Буцах"}
          </button>
          <Button
            onClick={() => step < 5 ? setStep(s => (s+1) as Step) : handleSubmit()}
            disabled={!canNext() || loading}
            className="gap-2 px-6"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {step === 5
              ? loading ? "Илгээж байна..." : <><CheckCircle2 className="h-4 w-4" /> Нийтлэх</>
              : <>Үргэлжлүүлэх <ChevronRight className="h-4 w-4" /></>
            }
          </Button>
        </div>
      )}
    </div>
  )
}