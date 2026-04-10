"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import {
  MapPin, BedDouble, Bath, Square,
  Plus, Pencil, Trash2, Eye, Clock, Loader2,
  X, CheckCircle2, Tag, Phone, FileText,
  Star, Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ListingRegisterModal } from "@/components/modals/listing-register-modal"

interface Listing {
  id:            string
  title:         string
  location_name: string
  price_per_day: number
  cover_image:   string | null
  rooms:         number
  bathrooms:     number
  area_sqm:      number
  status:        string
  view_count:    number
  created_at:    string
  plan?:         string
  is_vip?:       boolean
  plan_price?:   number
  expires_at?:   string
}

const statusConfig: Record<string, { label: string; color: string }> = {
  active:   { label: "Идэвхтэй",        color: "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400" },
  pending:  { label: "Хүлээгдэж байна", color: "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400"         },
  inactive: { label: "Идэвхгүй",        color: "bg-muted text-muted-foreground"                                               },
  rejected: { label: "Татгалзсан",      color: "bg-destructive/10 text-destructive"                                           },
}

const amenitiesList = [
  "WiFi","Барбекю","Зогсоол","Саун","Цэцэрлэг",
  "Тоглоомын талбай","Загасчлал","Хөргөгч","Телевиз","Угаалга",
]

const PLAN_PRICES = {
  standard: { 7: 5000,  14: 8000,  30: 15000 } as Record<number, number>,
  vip:      { 7: 15000, 14: 25000, 30: 45000 } as Record<number, number>,
}

function formatExpiry(expiresAt?: string) {
  if (!expiresAt) return null
  const days = Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 86400000)
  if (days <= 0) return { text: "Хугацаа дууссан", urgent: true,  expired: true  }
  if (days <= 3) return { text: `${days} хоног үлдсэн`, urgent: true,  expired: false }
  return              { text: `${days} хоног үлдсэн`, urgent: false, expired: false }
}

// ── Edit Modal ────────────────────────────────────────
function EditModal({ listing, token, onClose, onSaved }: {
  listing: Listing; token: string | null; onClose: () => void; onSaved: () => void
}) {
  const [form, setForm] = useState({
    title: listing.title, price_per_day: String(listing.price_per_day),
    rooms: String(listing.rooms), bathrooms: String(listing.bathrooms),
    area_sqm: String(listing.area_sqm), description: "", address: "",
    phone: "", max_guests: "2", price_per_week: "", price_per_month: "",
    deposit: "", min_nights: "1", checkin_time: "14:00", checkout_time: "12:00",
    tags: "", amenities: [] as string[],
  })
  const [fetchLoading, setFetchLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [tab, setTab] = useState<"basic" | "detail" | "rules" | "plan">("basic")
  const [planType, setPlanType] = useState<"standard" | "vip">(listing.is_vip ? "vip" : "standard")
  const [planDays, setPlanDays] = useState<7 | 14 | 30>(7)
  const [planLoading, setPlanLoading] = useState(false)
  const [planSaved, setPlanSaved] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings/${listing.id}`)
        const data = await res.json()
        const amenities = typeof data.amenities === "string" ? JSON.parse(data.amenities) : (data.amenities || [])
        setForm(p => ({
          ...p,
          description: data.description || "", address: data.address || "",
          phone: data.phone || "", max_guests: String(data.max_guests || 2),
          price_per_week: data.price_per_week ? String(data.price_per_week) : "",
          price_per_month: data.price_per_month ? String(data.price_per_month) : "",
          deposit: data.deposit ? String(data.deposit) : "",
          min_nights: String(data.min_nights || 1),
          checkin_time: data.checkin_time || "14:00",
          checkout_time: data.checkout_time || "12:00",
          tags: Array.isArray(data.tags) ? data.tags.join(", ") : "",
          amenities,
        }))
      } catch {}
      finally { setFetchLoading(false) }
    }
    load()
  }, [listing.id])

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))
  const toggleAmenity = (a: string) => setForm(p => ({
    ...p, amenities: p.amenities.includes(a) ? p.amenities.filter(x => x !== a) : [...p.amenities, a],
  }))

  const handleSave = async () => {
    setLoading(true); setError("")
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings/${listing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          title: form.title, description: form.description, address: form.address,
          phone: form.phone, price_per_day: parseInt(form.price_per_day),
          price_per_week: form.price_per_week ? parseInt(form.price_per_week) : null,
          price_per_month: form.price_per_month ? parseInt(form.price_per_month) : null,
          deposit: form.deposit ? parseInt(form.deposit) : null,
          rooms: parseInt(form.rooms), bathrooms: parseInt(form.bathrooms),
          area_sqm: parseInt(form.area_sqm), max_guests: parseInt(form.max_guests),
          min_nights: parseInt(form.min_nights),
          checkin_time: form.checkin_time, checkout_time: form.checkout_time,
          amenities: form.amenities,
          tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Алдаа гарлаа")
      onSaved(); onClose()
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  const handlePlanSave = async () => {
    setPlanLoading(true); setPlanSaved(false); setError("")
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings/${listing.id}/plan`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ listing_type: planType, package_days: planDays }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Алдаа гарлаа")
      setPlanSaved(true); onSaved()
    } catch (err: any) { setError(err.message) }
    finally { setPlanLoading(false) }
  }

  const inp = "w-full px-4 py-2.5 text-sm bg-muted/50 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
  const tabs = [
    { key: "basic", label: "Үндсэн", icon: FileText },
    { key: "detail", label: "Нэмэлт", icon: Tag },
    { key: "rules", label: "Тохижилт", icon: CheckCircle2 },
    { key: "plan", label: "Багц", icon: Star },
  ] as const

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="w-full max-w-xl bg-background rounded-2xl shadow-2xl border border-border/60 pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-300 flex flex-col max-h-[88vh]"
          onClick={e => e.stopPropagation()}>

          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border/50 shrink-0">
            <div>
              <h2 className="font-bold text-base">Зар засах</h2>
              <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-xs">{listing.title}</p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-muted transition-colors"><X className="h-4 w-4" /></button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 px-6 py-3 border-b border-border/30 shrink-0 overflow-x-auto">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => { setTab(key); setError(""); setPlanSaved(false) }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0",
                  tab === key
                    ? key === "plan" ? "bg-amber-500 text-white" : "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}>
                <Icon className="h-3.5 w-3.5" />{label}
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
                {/* BASIC */}
                {tab === "basic" && (
                  <div className="space-y-4">
                    {[
                      { label: "Гарчиг", key: "title", placeholder: "" },
                      { label: "Хаяг", key: "address", placeholder: "Дүүрэг, хороо, гудамж..." },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">{f.label}</label>
                        <input value={form[f.key as keyof typeof form] as string}
                          onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder} className={inp} />
                      </div>
                    ))}
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Утас</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="9900-0000" className={cn(inp, "pl-10")} />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Тайлбар</label>
                      <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={4} placeholder="Байрны онцлог..." className={cn(inp, "resize-none")} />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-semibold text-muted-foreground block">Үнийн мэдээлэл</label>
                      {[
                        { label: "Өдрийн үнэ (₮) *", key: "price_per_day" },
                        { label: "7 хоногийн үнэ", key: "price_per_week" },
                        { label: "Сарын үнэ", key: "price_per_month" },
                        { label: "Баталгааны мөнгө", key: "deposit" },
                      ].map(f => (
                        <div key={f.key} className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₮</span>
                          <input type="number" value={form[f.key as keyof typeof form] as string}
                            onChange={e => set(f.key, e.target.value)} placeholder={f.label} className={cn(inp, "pl-8")} />
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: "Өрөө", key: "rooms" }, { label: "Ариун цэв", key: "bathrooms" },
                        { label: "м²", key: "area_sqm" }, { label: "Хүн", key: "max_guests" },
                      ].map(f => (
                        <div key={f.key}>
                          <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
                          <input type="number" value={form[f.key as keyof typeof form] as string}
                            onChange={e => set(f.key, e.target.value)} className={cn(inp, "text-center px-2")} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* DETAIL */}
                {tab === "detail" && (
                  <div className="space-y-5">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-2 block">Check-in / Check-out цаг</label>
                      <div className="p-3 rounded-xl bg-muted/40 border border-border/50 text-xs text-muted-foreground mb-3">
                        <strong>Check-in</strong> — зочид орж болох цаг (жишээ: 14:00)<br/>
                        <strong>Check-out</strong> — зочид гарах ёстой цаг (жишээ: 12:00)
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {[{ label: "Check-in", key: "checkin_time" }, { label: "Check-out", key: "checkout_time" }].map(f => (
                          <div key={f.key}>
                            <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
                            <select value={form[f.key as keyof typeof form] as string} onChange={e => set(f.key, e.target.value)} className={inp}>
                              {["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00"].map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-2 block">Хамгийн бага захиалгын хоног</label>
                      <div className="flex gap-2 flex-wrap">
                        {[{l:"1 хоног",v:"1"},{l:"2 хоног",v:"2"},{l:"3 хоног",v:"3"},{l:"7 хоног",v:"7"},{l:"14 хоног",v:"14"},{l:"30 хоног",v:"30"}].map(({ l, v }) => (
                          <button key={v} onClick={() => set("min_nights", v)}
                            className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all",
                              form.min_nights === v ? "bg-primary text-primary-foreground border-primary" : "border-border/60 text-muted-foreground hover:border-primary/40"
                            )}>{l}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Шошго (таслалаар)</label>
                      <input value={form.tags} onChange={e => set("tags", e.target.value)} placeholder="Барбекю, Нуурын эрэг..." className={inp} />
                    </div>
                  </div>
                )}

                {/* RULES */}
                {tab === "rules" && (
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-3 block">Тохижилт</label>
                    <div className="flex flex-wrap gap-2">
                      {amenitiesList.map(a => (
                        <button key={a} onClick={() => toggleAmenity(a)}
                          className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                            form.amenities.includes(a) ? "bg-primary text-primary-foreground border-primary" : "border-border/60 text-muted-foreground hover:border-primary/40"
                          )}>
                          {form.amenities.includes(a) && <CheckCircle2 className="h-3 w-3" />}{a}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* PLAN */}
                {tab === "plan" && (
                  <div className="space-y-5">
                    {/* Одоогийн */}
                    <div className={cn("p-4 rounded-2xl border",
                      listing.is_vip ? "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800" : "bg-muted/40 border-border/60"
                    )}>
                      <p className="text-xs font-semibold text-muted-foreground mb-2">Одоогийн багц</p>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm">{listing.is_vip ? "⭐ VIP зар" : "📋 Энгийн зар"}</span>
                        <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full",
                          listing.is_vip ? "bg-amber-100 text-amber-700" : "bg-muted text-muted-foreground"
                        )}>{listing.plan || "standard"}</span>
                      </div>
                      {listing.expires_at && (() => {
                        const days = Math.ceil((new Date(listing.expires_at!).getTime() - Date.now()) / 86400000)
                        return (
                          <div className={cn("flex items-center gap-1.5 text-xs mt-1",
                            days <= 0 ? "text-red-500" : days <= 3 ? "text-amber-600" : "text-muted-foreground"
                          )}>
                            <Clock className="h-3 w-3" />
                            {days <= 0 ? "Хугацаа дууссан" : `${days} хоног үлдсэн`}
                            <span className="text-muted-foreground">({new Date(listing.expires_at!).toLocaleDateString("mn-MN")})</span>
                          </div>
                        )
                      })()}
                    </div>

                    {/* Шинэ багц */}
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-3">Шинэ багц сонгох</p>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {(["standard", "vip"] as const).map(type => (
                          <button key={type} onClick={() => setPlanType(type)}
                            className={cn("p-3 rounded-xl border-2 text-left transition-all",
                              planType === type
                                ? type === "vip" ? "border-amber-500 bg-amber-50 dark:bg-amber-950/20" : "border-primary bg-primary/5"
                                : "border-border/60 hover:border-primary/30"
                            )}>
                            <div className="text-sm font-bold mb-0.5">{type === "vip" ? "⭐ VIP зар" : "📋 Энгийн зар"}</div>
                            <div className="text-xs text-muted-foreground">{type === "vip" ? "Хайлтад эхэнд гарна" : "Хэвийн жагсаалтад"}</div>
                            {planType === type && <CheckCircle2 className={cn("h-4 w-4 mt-1.5", type === "vip" ? "text-amber-500" : "text-primary")} />}
                          </button>
                        ))}
                      </div>
                      <div className="space-y-2">
                        {(planType === "standard"
                          ? [{days:7 as const,price:5000,label:"7 хоног"},{days:14 as const,price:8000,label:"14 хоног",popular:true},{days:30 as const,price:15000,label:"30 хоног"}]
                          : [{days:7 as const,price:15000,label:"VIP · 7 хоног"},{days:14 as const,price:25000,label:"VIP · 14 хоног",popular:true},{days:30 as const,price:45000,label:"VIP · 30 хоног"}]
                        ).map(pkg => (
                          <button key={pkg.days} onClick={() => setPlanDays(pkg.days)}
                            className={cn("w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all",
                              planDays === pkg.days
                                ? planType === "vip" ? "border-amber-500 bg-amber-50 dark:bg-amber-950/20" : "border-primary bg-primary/5"
                                : "border-border/60 hover:border-primary/30"
                            )}>
                            <div className="flex items-center gap-2.5">
                              <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                                planDays === pkg.days
                                  ? planType === "vip" ? "border-amber-500 bg-amber-500" : "border-primary bg-primary"
                                  : "border-muted-foreground"
                              )}>
                                {planDays === pkg.days && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </div>
                              <div className="text-left">
                                <span className="text-sm font-semibold">{pkg.label}</span>
                                {"popular" in pkg && pkg.popular && (
                                  <span className={cn("ml-2 text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                                    planType === "vip" ? "bg-amber-100 text-amber-700" : "bg-primary/10 text-primary"
                                  )}>АЛДАРТАЙ</span>
                                )}
                                <div className="text-xs text-muted-foreground">{pkg.days} хоног нэмэгдэнэ</div>
                              </div>
                            </div>
                            <span className={cn("font-bold font-mono text-sm flex-shrink-0",
                              planDays === pkg.days ? (planType === "vip" ? "text-amber-600" : "text-primary") : "text-foreground"
                            )}>{pkg.price.toLocaleString()}₮</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Дүн */}
                    <div className={cn("p-4 rounded-xl border",
                      planType === "vip" ? "bg-amber-50 border-amber-200 dark:bg-amber-950/20" : "bg-muted/40"
                    )}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Нэмэгдэх хугацаа</span>
                        <span className="font-semibold">+{planDays} хоног</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground text-sm">Төлбөр</span>
                        <span className={cn("text-lg font-bold font-mono",
                          planType === "vip" ? "text-amber-600" : "text-primary"
                        )}>{(PLAN_PRICES[planType][planDays] || 0).toLocaleString()}₮</span>
                      </div>
                      <p className="text-xs text-muted-foreground">💡 Одоогийн хугацааны үлдэгдэлд нэмэгдэнэ.</p>
                    </div>

                    {planSaved && (
                      <div className="flex items-center gap-2 px-3 py-2.5 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-sm">
                        <CheckCircle2 className="h-4 w-4 shrink-0" /> Багц амжилттай шинэчлэгдлээ!
                      </div>
                    )}

                    <button onClick={handlePlanSave} disabled={planLoading}
                      className={cn("w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all",
                        planType === "vip" ? "bg-amber-500 hover:bg-amber-600 text-white" : "bg-primary hover:bg-primary/90 text-primary-foreground",
                        planLoading && "opacity-60 cursor-not-allowed"
                      )}>
                      {planLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Star className="h-4 w-4" />}
                      {planLoading ? "Хадгалж байна..." : "Багц шинэчлэх"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer — plan tab-д харагдахгүй */}
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
    </>
  )
}

// ── Main Page ─────────────────────────────────────────
export default function MyListingsPage() {
  const { isLoggedIn, user, token } = useAuth()
  const router = useRouter()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [addOpen, setAddOpen] = useState(false)
  const [editListing, setEditListing] = useState<Listing | null>(null)

  useEffect(() => { if (!isLoggedIn) router.push("/") }, [isLoggedIn, router])

  const fetchMyListings = async () => {
    if (!token) return
    setLoading(true); setError("")
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings/my`, {
        headers: { "Authorization": `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Алдаа гарлаа")
      setListings(data.data || data)
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { if (isLoggedIn && token) fetchMyListings() }, [isLoggedIn, token])

  const handleDelete = async (id: string) => {
    if (!confirm("Зарыг устгах уу?")) return
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings/${id}`, {
        method: "DELETE", headers: { "Authorization": `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("Устгах амжилтгүй")
      setListings(prev => prev.filter(l => l.id !== id))
    } catch (err: any) { alert(err.message) }
  }

  if (!isLoggedIn) return null

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Миний зарууд</h1>
            <p className="text-muted-foreground text-sm mt-1">{user?.name} • {listings.length} зар</p>
          </div>
          <Button onClick={() => setAddOpen(true)} className="gap-2"><Plus className="h-4 w-4" /> Зар нэмэх</Button>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: "Нийт зар",    value: listings.length,                                        color: "text-foreground"                       },
            { label: "Идэвхтэй",   value: listings.filter(l => l.status === "active").length,    color: "text-emerald-600 dark:text-emerald-400" },
            { label: "Нийт үзэлт", value: listings.reduce((s, l) => s + (l.view_count || 0), 0), color: "text-primary"                          },
          ].map(({ label, value, color }) => (
            <div key={label} className="p-4 rounded-2xl border border-border/60 bg-background text-center">
              <p className={cn("text-2xl font-bold", color)}>{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {loading && <div className="flex items-center justify-center py-20 text-muted-foreground"><Loader2 className="h-8 w-8 animate-spin mr-3" /><span>Ачааллаж байна...</span></div>}
        {!loading && error && <div className="text-center py-20"><p className="text-destructive mb-4">{error}</p><Button variant="outline" onClick={fetchMyListings}>Дахин оролдох</Button></div>}
        {!loading && !error && listings.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <div className="text-5xl mb-4">🏠</div>
            <p className="font-medium mb-2">Зар байхгүй байна</p>
            <p className="text-sm mb-6">Анхны зараа нэмж эхлээрэй</p>
            <Button onClick={() => setAddOpen(true)} className="gap-2"><Plus className="h-4 w-4" /> Зар нэмэх</Button>
          </div>
        )}

        {!loading && !error && listings.length > 0 && (
          <div className="space-y-4">
            {listings.map(listing => {
              const status = statusConfig[listing.status] ?? statusConfig.pending
              const expiry = formatExpiry(listing.expires_at)
              return (
                <div key={listing.id} className={cn(
                  "flex gap-4 p-4 rounded-2xl border bg-background hover:shadow-md transition-all",
                  listing.is_vip ? "border-amber-300/60 hover:border-amber-400/80" : "border-border/60 hover:border-primary/30"
                )}>
                  <div className="w-28 h-24 sm:w-36 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-muted relative">
                    <img src={listing.cover_image || "/placeholder.svg"} alt={listing.title} className="block w-full h-full object-cover" loading="lazy" />
                    {listing.is_vip && <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-amber-500 text-white text-[9px] font-bold">⭐ VIP</div>}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-sm leading-snug line-clamp-1">{listing.title}</h3>
                        <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0", status.color)}>{status.label}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1.5">
                        <MapPin className="h-3 w-3 shrink-0" /><span>{listing.location_name}</span>
                        <span className="mx-1">•</span>
                        <Calendar className="h-3 w-3 shrink-0" /><span>{new Date(listing.created_at).toLocaleDateString("mn-MN")}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-1.5">
                        <span className="flex items-center gap-1"><BedDouble className="h-3 w-3" /> {listing.rooms} өрөө</span>
                        <span className="flex items-center gap-1"><Bath className="h-3 w-3" /> {listing.bathrooms}</span>
                        <span className="flex items-center gap-1"><Square className="h-3 w-3" /> {listing.area_sqm}м²</span>
                        <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {listing.view_count}</span>
                      </div>
                      {expiry && (
                        <div className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                          expiry.expired ? "bg-red-50 text-red-600 border-red-100 dark:bg-red-950/30"
                          : expiry.urgent ? "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30"
                          : "bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-900"
                        )}>
                          <Clock className="h-2.5 w-2.5" />{expiry.text}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/40">
                      <span className="font-bold text-primary text-sm">
                        {listing.price_per_day.toLocaleString()}₮
                        <span className="text-xs font-normal text-muted-foreground">/өдөр</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setEditListing(listing)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors">
                          <Pencil className="h-3 w-3" /> Засах
                        </button>
                        <button onClick={() => handleDelete(listing.id)}
                          className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <ListingRegisterModal open={addOpen} onClose={() => { setAddOpen(false); fetchMyListings() }} />
      {editListing && (
        <EditModal listing={editListing} token={token} onClose={() => setEditListing(null)} onSaved={fetchMyListings} />
      )}
    </div>
  )
}