"use client";

import { useRouter } from "next/navigation";
import { Star, Clock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { serviceCategories, type Service, formatServicePrice } from "@/lib/service-types";

export function ServiceCard({ service }: { service: Service }) {
  const router = useRouter();
  const cat = serviceCategories.find((c) => c.id === service.category_id);
  const cover = service.images?.[0] || "/placeholder.svg";

  return (
    <button
      onClick={() => router.push(`/service/${service.id}`)}
      className="group text-left rounded-2xl border border-border/60 overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all bg-background"
    >
      <div className="relative aspect-video overflow-hidden bg-muted/40">
        <img
          src={cover}
          alt={service.title}
          className="block w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {!service.is_available && (
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-medium">
            Дууссан
          </div>
        )}
      </div>
      <div className="p-4">
        {cat && (
          <div className="flex items-center gap-1.5 mb-2">
            <div className={cn("p-1 rounded-lg", cat.bg)}>
              <cat.icon className={cn("h-3 w-3", cat.color)} />
            </div>
            <span className={cn("text-xs font-medium", cat.color)}>{cat.label}</span>
          </div>
        )}
        <h3 className="font-bold text-base mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {service.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {service.description}
        </p>
        <div className="flex items-center justify-between mb-2">
          <span className="text-primary font-bold">{formatServicePrice(service)}</span>
          {service.duration && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {service.duration}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="font-semibold">{Number(service.avg_rating).toFixed(1)}</span>
            <span className="text-muted-foreground">({service.review_count})</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </button>
  );
}