"use client"
import { useEffect, useState } from "react"
import { Star, MapPin, BedDouble, Crown } from "lucide-react"

export default function VipPage() {
  const [listings, setListings] = useState<any[]>([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings?type=vip`)
      .then(r => r.json())
      .then(d => setListings(d.data || []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b py-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold mb-4">
          <Crown className="h-4 w-4"/> Онцгой зарууд
        </div>
        <h1 className="text-4xl font-bold mb-3">⭐ VIP Зарууд</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Хайлтад эхэнд гарах онцгой байрнуудыг эндээс олоорой
        </p>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-72 rounded-2xl bg-muted animate-pulse"/>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <div className="text-5xl mb-4">⭐</div>
            <p className="font-medium">VIP зар байхгүй байна</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {listings.map(l => (
              <div key={l.id} className="rounded-2xl border-2 border-amber-200 overflow-hidden hover:border-amber-400 hover:shadow-xl transition-all bg-white">
                <div className="relative aspect-video overflow-hidden">
                  <img src={l.cover_image || "/placeholder.svg"} alt={l.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"/>
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 text-white text-xs font-bold">
                    <Star className="h-3 w-3 fill-white"/> VIP
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-sm line-clamp-2">{l.title}</h3>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-amber-600">{parseFloat(l.price_per_day).toLocaleString()}₮</p>
                      <p className="text-[10px] text-muted-foreground">/өдөр</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                    <MapPin className="h-3 w-3"/> {l.location_name}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><BedDouble className="h-3 w-3"/> {l.rooms} өрөө</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}