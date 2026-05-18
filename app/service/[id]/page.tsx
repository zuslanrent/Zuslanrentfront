"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Star,
  Clock,
  CheckCircle2,
  Phone,
  CalendarDays,
  Users,
  ChevronRight,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  serviceCategories,
  type Service,
  formatServicePrice,
} from "@/lib/service-types";

const API = process.env.NEXT_PUBLIC_API_URL || "";

export default function ServiceDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const [error, setError] = useState("");

  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API}/api/services/${id}`);
        if (!res.ok) {
          setService(null);
          return;
        }
        const data = await res.json();
        setService(data);
      } catch {
        setService(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  const images = service?.images?.length
    ? service.images
    : ["/placeholder.svg"];

  const handleBook = async () => {
    if (!date || !name || !phone) {
      setError("Огноо, нэр, утсаа бөглөнө үү");
      return;
    }
    setBooking(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/services/${id}/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_date: date,
          guests,
          contact_name: name,
          contact_phone: phone,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Алдаа гарлаа");
      setBooked(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p className="text-5xl mb-4">🎯</p>
          <p className="font-medium mb-4">Үйлчилгээ олдсонгүй</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/service")}
          >
            Буцах
          </Button>
        </div>
      </div>
    );
  }

  const cat = serviceCategories.find((c) => c.id === service.category_id);

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-16 z-40 border-b border-border/60 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <button
            onClick={() => router.push("/service")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Үйлчилгээ
          </button>
          <span
            className={cn(
              "text-xs px-2.5 py-1 rounded-full font-medium",
              service.is_available
                ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400"
                : "bg-muted text-muted-foreground",
            )}
          >
            {service.is_available ? "● Боломжтой" : "● Дууссан"}
          </span>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Gallery */}
          <div className="lg:w-[48%] shrink-0">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted mb-3">
              <img
                key={activeIdx}
                src={images[activeIdx]}
                alt={service.title}
                className="block w-full h-full object-cover animate-in fade-in duration-200"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveIdx(
                        (i) => (i - 1 + images.length) % images.length,
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/40 shadow"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setActiveIdx((i) => (i + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/40 shadow"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    className={cn(
                      "shrink-0 w-16 h-12 rounded-xl overflow-hidden border-2 transition-all",
                      activeIdx === i
                        ? "border-primary scale-105"
                        : "border-transparent opacity-55",
                    )}
                  >
                    <img
                      src={src}
                      className="block w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info + Booking */}
          <div className="flex-1 min-w-0 flex flex-col gap-6">
            <div>
              {cat && (
                <div className="flex items-center gap-2 mb-2">
                  <div className={cn("p-1.5 rounded-lg", cat.bg)}>
                    <cat.icon className={cn("h-4 w-4", cat.color)} />
                  </div>
                  <span className={cn("text-sm font-medium", cat.color)}>
                    {cat.label}
                  </span>
                </div>
              )}
              <h1 className="text-2xl sm:text-3xl font-bold leading-snug mb-3">
                {service.title}
              </h1>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-semibold">
                  {Number(service.avg_rating).toFixed(1)}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({service.review_count} үнэлгээ)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/40 border border-border/60">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Үнэ</p>
                <p className="text-2xl font-bold text-primary">
                  {formatServicePrice(service)}
                </p>
              </div>
              {service.duration && (
                <>
                  <div className="w-px h-10 bg-border/60" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">
                      Хугацаа
                    </p>
                    <div className="flex items-center gap-1 font-semibold">
                      <Clock className="h-4 w-4" />
                      {service.duration}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div>
              <h2 className="font-bold text-sm text-muted-foreground uppercase mb-2">
                Тайлбар
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {service.description}
              </p>
            </div>

            {service.features?.length > 0 && (
              <div>
                <h2 className="font-bold text-sm text-muted-foreground uppercase mb-3">
                  Үйлчилгээнд орох зүйлс
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {service.features.map((f) => (
                    <div
                      key={f}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/40 border border-border/50"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="text-sm">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Booking */}
            <div className="rounded-2xl border border-border/60 bg-background shadow-sm p-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" /> Огноо
                </label>
                <input
                  type="date"
                  value={date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-muted/50 border border-border/60 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" /> Хүний тоо
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setGuests((v) => Math.max(1, v - 1))}
                    className="w-9 h-9 rounded-full border border-border/60 text-lg font-medium hover:bg-muted"
                  >
                    −
                  </button>
                  <span className="flex-1 text-center font-semibold">
                    {guests}
                  </span>
                  <button
                    onClick={() => setGuests((v) => Math.min(20, v + 1))}
                    className="w-9 h-9 rounded-full border border-border/60 text-lg font-medium hover:bg-muted"
                  >
                    +
                  </button>
                </div>
              </div>

              <input
                placeholder="Таны нэр"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-muted/50 border border-border/60 rounded-xl"
              />
              <input
                placeholder="Утас (9900-0000)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-muted/50 border border-border/60 rounded-xl"
              />

              {error && (
                <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}

              {booked ? (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 text-emerald-700 text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  Захиалга илгээгдлээ! Удахгүй холбоо барина.
                </div>
              ) : (
                <Button
                  onClick={handleBook}
                  disabled={booking || !service.is_available}
                  className="w-full gap-2 font-semibold"
                >
                  {booking ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  {booking ? "Илгээж байна..." : "Захиалах"}
                </Button>
              )}

              {service.phone && (
                <a
                  href={`tel:${service.phone}`}
                  className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <Phone className="h-3.5 w-3.5" />
                  Утсаар: {service.phone}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
