"use client";

import { useEffect, useState, useRef } from "react";
import {
  Star, MapPin, BedDouble, Bath, Square,
  Phone, Eye, Crown, Sparkles, ArrowRight, ChevronDown,
} from "lucide-react";
import { ListingModal } from "@/components/listing-modal";

const GoldLine = () => (
  <div className="flex items-center gap-3">
    <div className="h-px flex-1"
      style={{ background: "linear-gradient(to right, transparent, rgba(212,175,55,0.6), transparent)" }} />
    <Star className="h-3 w-3 fill-[#D4AF37] text-[#D4AF37] shrink-0" />
    <div className="h-px flex-1"
      style={{ background: "linear-gradient(to right, transparent, rgba(212,175,55,0.6), transparent)" }} />
  </div>
);

// ── Animated VIP Badge ──────────────────────────────────
function VipBadge({ size = "sm" }: { size?: "sm" | "lg" }) {
  const isLg = size === "lg";
  return (
    <div className="relative inline-flex items-center justify-center"
      style={{ width: isLg ? 72 : 56, height: isLg ? 72 : 56 }}>

      {/* Outer slow rotating ring — conic gradient */}
      <div className="absolute inset-0 rounded-full animate-spin"
        style={{
          animationDuration: "3s",
          background: "conic-gradient(from 0deg, transparent 0%, rgba(201,168,76,0.9) 20%, transparent 40%, rgba(201,168,76,0.4) 60%, transparent 80%)",
          padding: "2px",
        }}>
        <div className="w-full h-full rounded-full" style={{ background: "#080808" }} />
      </div>

      {/* Second ring — opposite direction, faster */}
      <div className="absolute rounded-full animate-spin"
        style={{
          inset: 3,
          animationDuration: "2s",
          animationDirection: "reverse",
          background: "conic-gradient(from 90deg, transparent 0%, rgba(212,175,55,0.7) 15%, transparent 35%, transparent 85%)",
          padding: "1.5px",
        }}>
        <div className="w-full h-full rounded-full" style={{ background: "#080808" }} />
      </div>

      {/* Glow pulse */}
      <div className="absolute inset-0 rounded-full animate-pulse"
        style={{
          background: "radial-gradient(circle, rgba(212,175,55,0.25), transparent 70%)",
          animationDuration: "2s",
        }} />

      {/* Inner badge */}
      <div className="relative flex flex-col items-center justify-center rounded-full z-10 overflow-hidden"
        style={{
          width: isLg ? 56 : 44,
          height: isLg ? 56 : 44,
          background: "linear-gradient(135deg, #1a1200, #2d1f00, #1a1200)",
          border: "1px solid rgba(201,168,76,0.4)",
          boxShadow: "inset 0 1px 0 rgba(201,168,76,0.2)",
        }}>
        {/* Shimmer sweep */}
        <div className="absolute inset-0 -skew-x-12"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
            animation: "sweep 2s ease-in-out infinite",
          }} />
        <Star className="fill-[#D4AF37] text-[#D4AF37]"
          style={{
            width: isLg ? 18 : 14,
            height: isLg ? 18 : 14,
            animation: "spin 6s linear infinite",
            filter: "drop-shadow(0 0 4px rgba(212,175,55,0.8))",
          }} />
        <span className="text-[#D4AF37] font-black leading-none mt-0.5"
          style={{ fontSize: isLg ? 10 : 8, letterSpacing: "0.1em" }}>
          VIP
        </span>
      </div>
    </div>
  );
}

export default function VipPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [faved,    setFaved]    = useState<string[]>([]);
  const [scrollY,  setScrollY]  = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings?type=vip&limit=50`)
      .then(r => r.json())
      .then(d => setListings(d.data || []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleFave = (id: string) =>
    setFaved(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const [featured, ...rest] = listings;

  return (
    <div className="min-h-screen" style={{ background: "#080808", color: "#fff" }}>

      {/* Global keyframes */}
      <style>{`
        @keyframes sweep {
          0%   { transform: translateX(-200%) skewX(-12deg); }
          100% { transform: translateX(300%) skewX(-12deg); }
        }
        @keyframes shimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>

      {/* ══════ HERO ══════ */}
      <div ref={heroRef}
        className="relative h-[100dvh] overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute inset-0"
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
            background: "radial-gradient(ellipse 100% 80% at 50% 0%, rgba(212,175,55,0.12) 0%, rgba(184,150,12,0.06) 40%, transparent 70%)",
          }} />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px",
          }} />
        <div className="absolute inset-0 overflow-hidden opacity-[0.06] pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="absolute h-px"
              style={{ width: "200%", left: "-50%", top: `${10 + i * 12}%`,
                background: "linear-gradient(to right, transparent, rgba(212,175,55,0.8), transparent)",
                transform: `rotate(${-15 + i * 0.5}deg)` }} />
          ))}
        </div>
        <div className="absolute top-1/4 left-1/6 w-[500px] h-[500px] rounded-full blur-[120px] opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #D4AF37, transparent 70%)" }} />
        <div className="absolute bottom-1/4 right-1/6 w-[400px] h-[400px] rounded-full blur-[100px] opacity-8 pointer-events-none"
          style={{ background: "radial-gradient(circle, #B8960C, transparent 70%)" }} />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-16" style={{ background: "rgba(212,175,55,0.5)" }} />
            <div className="flex items-center gap-2 text-[#D4AF37] text-[11px] font-black tracking-[0.3em] uppercase">
              <Crown className="h-3.5 w-3.5" /> Онцгой сонголт <Crown className="h-3.5 w-3.5" />
            </div>
            <div className="h-px w-16" style={{ background: "rgba(212,175,55,0.5)" }} />
          </div>

          <h1 className="font-black leading-[0.85] mb-8 tracking-tighter"
            style={{ fontSize: "clamp(5rem, 15vw, 12rem)" }}>
            <span style={{
              background: "linear-gradient(135deg, #C9A84C 0%, #D4AF37 30%, #B8960C 60%, #C9A84C 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>VIP</span>
          </h1>

          <div className="mb-6"><GoldLine /></div>
          <p className="text-white/40 text-xl font-light tracking-widest uppercase mb-10">
            Онцгой байрнуудын цуглуулга
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            {[
              { n: listings.length || "—", l: "VIP зар" },
              { n: "2×", l: "Илүү үзэгдэнэ" },
              { n: "#1", l: "Хайлтад байрлал" },
            ].map(({ n, l }) => (
              <div key={l} className="flex items-center gap-3 px-6 py-3 rounded-full"
                style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.2)" }}>
                <span className="text-xl font-black text-[#D4AF37]">{n}</span>
                <span className="text-white/30 text-xs uppercase tracking-wider">{l}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20 animate-bounce">
          <span className="text-[10px] tracking-widest uppercase">Доош гүйлгэ</span>
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>

      {/* ══════ FEATURED ══════ */}
      {!loading && featured && (
        <div className="relative overflow-hidden"
          style={{ borderTop: "1px solid rgba(212,175,55,0.15)", borderBottom: "1px solid rgba(212,175,55,0.15)" }}>
          <div className="absolute inset-0"
            style={{ backgroundImage: `url(${featured.cover_image || "/placeholder.svg"})`,
              backgroundSize: "cover", backgroundPosition: "center",
              filter: "blur(40px) brightness(0.15)", transform: "scale(1.1)" }} />
          <div className="absolute inset-0" style={{ background: "rgba(8,8,8,0.7)" }} />

          <div className="relative container mx-auto px-4 py-20">
            <div className="flex items-center gap-3 mb-10">
              <Star className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]" />
              <span className="text-[#D4AF37] text-xs font-black tracking-[0.25em] uppercase">Онцгой зар</span>
            </div>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative rounded-3xl overflow-hidden cursor-pointer group"
                onClick={() => setSelected(featured)}
                style={{ aspectRatio: "4/3", boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.2)" }}>
                <img src={featured.cover_image || "/placeholder.svg"} alt={featured.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent 50%)" }} />
                {/* Large animated badge */}
                <div className="absolute top-5 left-5">
                  <VipBadge size="lg" />
                </div>
              </div>

              <div>
                <div className="text-[#D4AF37]/60 text-xs tracking-widest uppercase mb-4">{featured.category_name}</div>
                <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight mb-4">{featured.title}</h2>
                <div className="flex items-center gap-2 text-white/40 text-sm mb-8">
                  <MapPin className="h-4 w-4 text-[#D4AF37]/60 shrink-0" />
                  {featured.location_name}
                  {featured.address && <span>· {featured.address}</span>}
                </div>
                <div className="mb-8 p-6 rounded-2xl"
                  style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.2)" }}>
                  <p className="text-white/30 text-xs uppercase tracking-wider mb-1">Өдрийн үнэ</p>
                  <p className="text-5xl font-black" style={{ color: "#D4AF37" }}>
                    {parseFloat(featured.price_per_day).toLocaleString()}
                    <span className="text-2xl text-white/40">₮</span>
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-8">
                  {[
                    { label: "Өрөө", value: featured.rooms },
                    { label: "Ариун цэвэр", value: featured.bathrooms },
                    { label: "Талбай", value: `${parseFloat(featured.area_sqm)}м²` },
                  ].map(({ label, value }) => (
                    <div key={label} className="text-center py-4 rounded-xl"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <p className="text-xl font-bold text-white">{value}</p>
                      <p className="text-white/30 text-xs mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => setSelected(featured)}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-black transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: "linear-gradient(135deg, #C9A84C, #D4AF37, #B8960C)", boxShadow: "0 12px 32px rgba(212,175,55,0.4)" }}>
                  <Crown className="h-5 w-5" /> Дэлгэрэнгүй харах <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════ GRID ══════ */}
      <div className="container mx-auto px-4 py-20">
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-3xl overflow-hidden animate-pulse h-80"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }} />
            ))}
          </div>
        )}

        {!loading && listings.length === 0 && (
          <div className="text-center py-40">
            <div className="w-24 h-24 rounded-full mx-auto mb-8 flex items-center justify-center"
              style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)" }}>
              <Crown className="h-10 w-10 text-[#D4AF37]" />
            </div>
            <p className="text-white/50 text-xl font-medium mb-3">VIP зар байхгүй байна</p>
            <p className="text-white/20 text-sm">Удахгүй онцгой зарууд нэмэгдэнэ</p>
          </div>
        )}

        {!loading && rest.length > 0 && (
          <>
            <div className="mb-12">
              <GoldLine />
              <div className="text-center mt-6">
                <span className="text-[#D4AF37] text-xs font-black tracking-[0.3em] uppercase">Бусад VIP зарууд</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((l, idx) => {
                const price  = parseFloat(l.price_per_day);
                const rating = parseFloat(l.avg_rating) || 0;
                return (
                  <div key={l.id} onClick={() => setSelected(l)}
                    className="group relative cursor-pointer rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(212,175,55,0.15)" }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.border = "1px solid rgba(212,175,55,0.45)";
                      el.style.boxShadow = "0 24px 64px rgba(212,175,55,0.1)";
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.border = "1px solid rgba(212,175,55,0.15)";
                      el.style.boxShadow = "none";
                    }}>

                    {/* Image */}
                    <div className="relative overflow-hidden" style={{ aspectRatio: "16/10" }}>
                      <img src={l.cover_image || "/placeholder.svg"} alt={l.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy" />
                      <div className="absolute inset-0"
                        style={{ background: "linear-gradient(to top, rgba(8,8,8,0.9) 0%, rgba(8,8,8,0.2) 50%, transparent 100%)" }} />

                      {/* Animated VIP badge — top left */}
                      <div className="absolute top-3 left-3">
                        <VipBadge size="sm" />
                      </div>

                      {/* Rating — top right */}
                      {rating > 0 && (
                        <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full backdrop-blur-sm"
                          style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
                          <Star className="h-3 w-3 fill-[#D4AF37] text-[#D4AF37]" />
                          <span className="text-white text-xs font-semibold">{rating.toFixed(1)}</span>
                        </div>
                      )}

                      {/* Price — bottom left */}
                      <div className="absolute bottom-4 left-4">
                        <p className="text-2xl font-black text-white">{price.toLocaleString()}₮</p>
                        <p className="text-white/40 text-[11px]">/өдөр</p>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-5">
                      <h3 className="font-bold text-white text-sm leading-snug line-clamp-2 mb-3 group-hover:text-[#D4AF37] transition-colors duration-300">
                        {l.title}
                      </h3>
                      <div className="flex items-center gap-1.5 mb-4">
                        <MapPin className="h-3 w-3 text-[#D4AF37]/50 shrink-0" />
                        <span className="text-white/30 text-xs">{l.location_name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-white/25 text-xs"
                        style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 12 }}>
                        <span className="flex items-center gap-1"><BedDouble className="h-3 w-3" />{l.rooms}</span>
                        <span className="flex items-center gap-1"><Bath className="h-3 w-3" />{l.bathrooms}</span>
                        <span className="flex items-center gap-1"><Square className="h-3 w-3" />{parseFloat(l.area_sqm)}м²</span>
                        {l.view_count > 0 && (
                          <span className="flex items-center gap-1 ml-auto"><Eye className="h-3 w-3" />{l.view_count}</span>
                        )}
                      </div>
                      {l.phone && (
                        <a href={`tel:${l.phone}`} onClick={e => e.stopPropagation()}
                          className="flex items-center gap-1.5 text-xs text-[#D4AF37]/50 hover:text-[#D4AF37] transition-colors mt-3">
                          <Phone className="h-3 w-3" />{l.phone}
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      {!loading && listings.length > 0 && (
        <div className="relative py-24 text-center overflow-hidden"
          style={{ borderTop: "1px solid rgba(212,175,55,0.1)" }}>
          <div className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(212,175,55,0.06), transparent)" }} />
          <div className="relative">
            <GoldLine />
            <div className="mt-12">
              <Crown className="h-12 w-12 text-[#D4AF37]/40 mx-auto mb-4" />
              <p className="text-white/20 text-sm tracking-widest uppercase">© Зусланрент · VIP зарын хуудас</p>
            </div>
          </div>
        </div>
      )}

      {selected && (
        <ListingModal item={selected} onClose={() => setSelected(null)}
          faved={faved.includes(selected.id)} onFave={toggleFave} />
      )}
    </div>
  );
}