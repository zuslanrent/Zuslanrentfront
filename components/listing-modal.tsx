"use client";

import { useEffect, useState, useCallback } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  BedDouble,
  Bath,
  Square,
  Phone,
  Heart,
  Share2,
  CheckCircle2,
  Calendar,
  Tag,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Listing } from "@/app/adds/page";

interface ListingModalProps {
  item: Listing | null;
  onClose: () => void;
  faved: boolean;
  onFave: (id: number) => void;
}

export function ListingModal({
  item,
  onClose,
  faved,
  onFave,
}: ListingModalProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const images: string[] =
    item?.images && item.images.length > 0
      ? item.images
      : item
        ? [item.image]
        : [];

  useEffect(() => {
    setActiveIdx(0);
  }, [item]);

  const handleClose = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft")
        setActiveIdx((i) => (i - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") setActiveIdx((i) => (i + 1) % images.length);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [handleClose, images.length]);

  useEffect(() => {
    document.body.style.overflow = item ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [item]);

  if (!item) return null;

  const prev = () =>
    setActiveIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setActiveIdx((i) => (i + 1) % images.length);

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const details: { icon: React.ElementType; label: string; value: string }[] = [
    { icon: BedDouble, label: "Өрөөний тоо", value: `${item.rooms} өрөө` },
    { icon: Bath, label: "Ариун цэвэр", value: `${item.bathrooms} ширхэг` },
    { icon: Square, label: "Талбай", value: `${item.area} м²` },
    { icon: Building2, label: "Төрөл", value: item.category },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 pointer-events-none">
        <div
          className={cn(
            "relative w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-2xl shadow-2xl",
            "bg-background pointer-events-auto",
            "animate-in fade-in slide-in-from-bottom-4 duration-300",
            "flex flex-col lg:flex-row",
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-background/90 backdrop-blur-sm border border-border/60 hover:bg-muted transition-colors shadow-sm"
          >
            <X className="h-4 w-4" />
          </button>

          {/* ════ LEFT — Gallery ════ */}
          <div className="lg:w-[55%] flex flex-col shrink-0 bg-muted/30">
            {/* Main image */}
            <div className="relative flex-1 min-h-52 overflow-hidden bg-muted">
              <img
                key={activeIdx}
                src={images[activeIdx] || "/placeholder.svg"}
                alt={item.title}
                className="block w-full h-full object-cover animate-in fade-in duration-200"
              />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex gap-1.5 z-10">
                {item.isNew && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground shadow">
                    ШИНЭ
                  </span>
                )}
                {item.isFeatured && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white shadow">
                    ТОП
                  </span>
                )}
              </div>

              {/* Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border/40 hover:bg-background transition-colors shadow"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border/40 hover:bg-background transition-colors shadow"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}

              {/* Counter */}
              <div className="absolute bottom-2 right-2 z-10 text-[10px] px-2 py-0.5 rounded-full bg-black/50 text-white backdrop-blur-sm">
                {activeIdx + 1} / {images.length}
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 p-2.5 overflow-x-auto scrollbar-none border-t border-border/40 bg-background/60 shrink-0">
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    className={cn(
                      "shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all duration-150",
                      activeIdx === i
                        ? "border-primary shadow-sm shadow-primary/20 scale-105"
                        : "border-transparent opacity-55 hover:opacity-90 hover:border-border",
                    )}
                  >
                    <img
                      src={src || "/placeholder.svg"}
                      alt={`Зураг ${i + 1}`}
                      className="block w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ════ RIGHT — Details ════ */}
          <div className="lg:w-[45%] flex flex-col overflow-y-auto">
            <div className="p-5 sm:p-6 flex flex-col gap-4 flex-1">
              {/* Header */}
              <div>
                <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{item.location}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold leading-snug mb-2">
                  {item.title}
                </h2>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-primary">
                    {item.price.toLocaleString()}₮
                  </span>
                  <span className="text-sm text-muted-foreground">
                    / {item.priceUnit}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2">
                {details.map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/50 border border-border/40"
                  >
                    <div className="p-1.5 rounded-lg bg-primary/10 shrink-0">
                      <Icon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-muted-foreground leading-none mb-0.5">
                        {label}
                      </p>
                      <p className="text-xs font-semibold capitalize truncate">
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tags */}
              {item.tags.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                    <Tag className="h-3 w-3" /> Тохижилт
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
                      >
                        <CheckCircle2 className="h-3 w-3 shrink-0" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Availability */}
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40">
                <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    Боломжтой
                  </p>
                  <p className="text-[10px] text-emerald-600/70 dark:text-emerald-500">
                    Өнөөдрөөс захиалах боломжтой
                  </p>
                </div>
              </div>

              <div className="flex-1" />

              {/* CTA */}
              <div className="space-y-2 pt-3 border-t border-border/40">
                <a href={`tel:${item.phone}`} className="block">
                  <Button className="w-full gap-2 font-semibold" size="lg">
                    <Phone className="h-4 w-4" />
                    {item.phone} — Залгах
                  </Button>
                </a>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1.5"
                    onClick={() => onFave(item.id)}
                  >
                    <Heart
                      className={cn(
                        "h-4 w-4 transition-colors",
                        faved ? "fill-red-500 text-red-500" : "",
                      )}
                    />
                    {faved ? "Хадгалсан" : "Хадгалах"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1.5"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4" />
                    {copied ? "Хуулагдлаа!" : "Хуваалцах"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
