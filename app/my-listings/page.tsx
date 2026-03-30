"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { MapPin, BedDouble, Bath, Square, Phone,
         Plus, Pencil, Trash2, Eye, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { RegisterModal } from "@/components/modals/register-modal"

// Mock data — backend холбосны дараа API-аас авна
const mockMyListings = [
  {
    id: "1", title: "Богдхан орчмын зуслан", location: "Богдхан",
    price: 150000, image: "/images/house1.jpg",
    rooms: 3, bathrooms: 2, area: 120, phone: "9900-1234",
    status: "active", views: 48, created_at: "2025-03-01",
  },
  {
    id: "2", title: "Тэрэлж ойн орчим байшин", location: "Тэрэлж",
    price: 120000, image: "/images/house3.jpg",
    rooms: 2, bathrooms: 1, area: 90, phone: "9911-3344",
    status: "pending", views: 12, created_at: "2025-03-15",
  },
]

const statusConfig: Record<string, { label: string; color: string }> = {
  active:   { label: "Идэвхтэй",   color: "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400" },
  pending:  { label: "Хүлээгдэж байна", color: "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400"   },
  inactive: { label: "Идэвхгүй",   color: "bg-muted text-muted-foreground"                                               },
  rejected: { label: "Татгалзсан", color: "bg-destructive/10 text-destructive"                                           },
}

export default function MyListingsPage() {
  const { isLoggedIn, user } = useAuth()
  const router               = useRouter()
  const [addOpen, setAddOpen] = useState(false)

  // Нэвтрээгүй бол нүүр хуудас руу
  useEffect(() => {
    if (!isLoggedIn) router.push("/")
  }, [isLoggedIn, router])

  if (!isLoggedIn) return null

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Миний зарууд</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {user?.name} • {mockMyListings.length} зар
            </p>
          </div>
          <Button onClick={() => setAddOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Зар нэмэх
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: "Нийт зар",    value: mockMyListings.length,                                          color: "text-foreground"                      },
            { label: "Идэвхтэй",   value: mockMyListings.filter(l => l.status === "active").length,   color: "text-emerald-600 dark:text-emerald-400" },
            { label: "Нийт үзэлт", value: mockMyListings.reduce((s, l) => s + l.views, 0),            color: "text-primary"                          },
          ].map(({ label, value, color }) => (
            <div key={label} className="p-4 rounded-2xl border border-border/60 bg-background text-center">
              <p className={cn("text-2xl font-bold", color)}>{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Listings */}
        {mockMyListings.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <div className="text-5xl mb-4">🏠</div>
            <p className="font-medium mb-2">Зар байхгүй байна</p>
            <p className="text-sm mb-6">Анхны зараа нэмж эхлээрэй</p>
            <Button onClick={() => setAddOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" /> Зар нэмэх
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {mockMyListings.map((listing) => {
              const status = statusConfig[listing.status] ?? statusConfig.pending
              return (
                <div key={listing.id}
                  className="flex gap-4 p-4 rounded-2xl border border-border/60 bg-background hover:border-primary/30 hover:shadow-md transition-all">

                  {/* Зураг */}
                  <div className="w-28 h-24 sm:w-36 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-muted">
                    <img src={listing.image || "/placeholder.svg"} alt={listing.title}
                      className="block w-full h-full object-cover" />
                  </div>

                  {/* Мэдээлэл */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-sm leading-snug line-clamp-1">{listing.title}</h3>
                        <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0", status.color)}>
                          {status.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span>{listing.location}</span>
                        <span className="mx-1">•</span>
                        <Clock className="h-3 w-3 shrink-0" />
                        <span>{listing.created_at}</span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><BedDouble className="h-3 w-3" /> {listing.rooms} өрөө</span>
                        <span className="flex items-center gap-1"><Bath className="h-3 w-3" /> {listing.bathrooms}</span>
                        <span className="flex items-center gap-1"><Square className="h-3 w-3" /> {listing.area}м²</span>
                        <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {listing.views}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/40">
                      <span className="font-bold text-primary text-sm">
                        {listing.price.toLocaleString()}₮
                        <span className="text-xs font-normal text-muted-foreground">/өдөр</span>
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
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

      <RegisterModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  )
}