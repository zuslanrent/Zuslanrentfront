"use client";

import { useState, useEffect } from "react";
import { Phone, ArrowRight, HeartHandshake, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  serviceCategories,
  serviceStats,
  type Service,
  formatServicePrice,
} from "@/lib/service-types";
import { ServiceCard } from "@/components/service/service-card";

const API = process.env.NEXT_PUBLIC_API_URL || "";

export default function ServicePage() {
  const [activeCategory, setActiveCategory] = useState<number | "all">("all");
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const url = `${API}/api/services${activeCategory !== "all" ? `?category=${activeCategory}` : ""}`;
        const res = await fetch(url);
        const json = await res.json();
        setServices(json.data || []);
      } catch {
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-1/4 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-emerald-500/5 blur-3xl" />
        </div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5">
            <HeartHandshake className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Таны зуслангийн туршлагыг гайхалтай болгоно
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-5 text-balance">
            Бидний{" "}
            <span className="text-primary relative inline-block">
              Үйлчилгээ
              <svg
                className="absolute -bottom-1.5 left-0 w-full"
                height="8"
                viewBox="0 0 200 8"
                fill="none"
              >
                <path
                  d="M2 6C50 2 150 2 198 6"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="text-primary"
                />
              </svg>
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Зуслангийн байр хайхаас эхлээд аялал, хоол хүнс, тээвэр хүртэл
            бүхнийг нэг дороос шийдэж өгнө.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border/40 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border/40">
            {serviceStats.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="flex flex-col items-center justify-center py-6 px-4 text-center"
              >
                <div className="p-2 rounded-xl bg-primary/10 mb-2">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Category filter */}
          <div className="flex items-center gap-2 flex-wrap mb-8">
            {serviceCategories.map(({ id, icon: Icon, label, color }) => (
              <button
                key={id}
                onClick={() => setActiveCategory(id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200",
                  activeCategory === id
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border/60 bg-background text-muted-foreground hover:text-foreground hover:border-border",
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4",
                    activeCategory === id ? "text-primary-foreground" : color,
                  )}
                />
                {label}
              </button>
            ))}
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            <span className="text-foreground font-semibold">
              {services.length}
            </span>{" "}
            үйлчилгээ
          </p>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-5xl mb-3">🎯</p>
              <p className="font-medium">Үйлчилгээ байхгүй байна</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="relative rounded-3xl bg-primary/5 border border-primary/20 p-8 sm:p-12 text-center overflow-hidden">
            <Phone className="h-10 w-10 text-primary mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Тусгай хүсэлт байна уу?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Дээрх жагсаалтад байхгүй үйлчилгээ хэрэгтэй бол бидэнтэй шууд
              холбогдоорой.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" className="gap-2 font-semibold" asChild>
                <a href="tel:99001234">
                  <Phone className="h-4 w-4" /> Залгах
                </a>
              </Button>
              <Button size="lg" variant="outline" className="gap-2" asChild>
                <a href="/">
                  Мессеж илгээх <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
