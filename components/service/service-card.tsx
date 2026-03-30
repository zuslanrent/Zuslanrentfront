"use client";

import { memo } from "react";
import Link from "next/link";
import { Star, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Service } from "@/lib/service-data";
import { serviceCategories } from "@/lib/service-data";

export const ServiceCard = memo(function ServiceCard({ service }: { service: Service }) {
  const cat = serviceCategories.find((c) => c.id === service.categoryId)!;

  return (
    <div className={cn(
      "group relative flex flex-col rounded-2xl border border-border/60 bg-background",
      "hover:border-primary/30 hover:shadow-xl transition-all duration-300 overflow-hidden",
      !service.available && "opacity-70",
    )}>
      <div className={cn("h-1 w-full opacity-80", cat.bg)} />

      <div className="p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className={cn("p-2.5 rounded-xl", cat.bg)}>
            <cat.icon className={cn("h-5 w-5", cat.color)} />
          </div>
          <div className="flex flex-col items-end gap-1">
            {!service.available && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                Дууссан
              </span>
            )}
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-xs font-semibold">{service.rating}</span>
              <span className="text-[10px] text-muted-foreground">({service.reviewCount})</span>
            </div>
          </div>
        </div>

        <h3 className="font-bold text-base leading-snug mb-1.5 group-hover:text-primary transition-colors">
          {service.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1 line-clamp-3">
          {service.description}
        </p>

        <ul className="space-y-1.5 mb-4">
          {service.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="pt-3 border-t border-border/50 mt-auto space-y-2">
          {/* Price + duration */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-primary text-base">{service.price}</p>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Clock className="h-2.5 w-2.5" /> {service.duration}
              </p>
            </div>

            {/* Захиалах товч — detail хуудасруу */}
            <Button
              size="sm"
              variant={service.available ? "default" : "outline"}
              disabled={!service.available}
              className="gap-1.5 text-xs"
              asChild={service.available}
            >
              {service.available ? (
                <Link href={`/service/${service.id}`}>
                  Захиалах <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ) : (
                <span>Боломжгүй</span>
              )}
            </Button>
          </div>

          {/* Дэлгэрэнгүй товч */}
          <Link
            href={`/service/${service.id}`}
            className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-medium text-muted-foreground border border-border/60 hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all"
          >
            Дэлгэрэнгүй үзэх <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
});
