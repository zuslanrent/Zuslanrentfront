"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Store, House, Hotel, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RegisterModal } from "@/components/modals/register-modal";
import { AuthModal } from "@/components/auth/auth-modal";
import { useAuth } from "@/components/auth/auth-provider";

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [registerOpen, setRegisterOpen]   = useState(false);
  const [authOpen,     setAuthOpen]       = useState(false);
  const [searchQuery,  setSearchQuery]    = useState("");
  const router = useRouter();
  const { isLoggedIn, login } = useAuth();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) =>
      setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSearch = () => {
    const query = searchQuery.trim();
    router.push(query ? `/adds?search=${encodeURIComponent(query)}` : "/adds");
  };

  // "Зар оруулах" дарах үед auth шалгана
  const handleRegisterClick = () => {
    if (isLoggedIn) {
      setRegisterOpen(true);
    } else {
      setAuthOpen(true);
    }
  };

  // Нэвтэрсний дараа register modal нээнэ
  const handleAuthSuccess = (user: any) => {
    login(user);
    setAuthOpen(false);
    setRegisterOpen(true);
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-125 h-125 rounded-full bg-muted/40 blur-3xl animate-pulse"
          style={{ top: "20%", left: "10%", animationDuration: "4s" }} />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-muted/30 blur-3xl animate-pulse"
          style={{ bottom: "10%", right: "15%", animationDuration: "6s", animationDelay: "1s" }} />
        <div className="absolute w-[300px] h-[300px] rounded-full bg-muted/20 blur-3xl transition-all duration-1000 ease-out"
          style={{ left: `${mousePosition.x - 150}px`, top: `${mousePosition.y - 150}px` }} />
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <Store className="absolute text-muted-foreground/30 animate-float"
          style={{ top: "15%", left: "15%", animationDelay: "0s" }} size={40} />
        <House className="absolute text-muted-foreground/30 animate-float"
          style={{ top: "25%", right: "20%", animationDelay: "2s" }} size={35} />
        <Hotel className="absolute text-muted-foreground/30 animate-float"
          style={{ bottom: "20%", left: "20%", animationDelay: "1s" }} size={30} />
      </div>

      <div className="container mx-auto text-center max-w-5xl relative z-10">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 animate-fade-in-up text-balance">
          Зуслангийн{" "}
          <span className="text-primary relative inline-block">
            Байр
            <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12" fill="none">
              <path d="M2 10C50 5 150 5 198 10" stroke="currentColor"
                strokeWidth="3" strokeLinecap="round" className="text-primary" />
            </svg>
          </span>{" "}Түрээс
        </h1>

        <p className="text-xl sm:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto animate-fade-in-up animate-delay-100 leading-relaxed">
          Зуслангийн байр хайх, харьцуулах, захиалах байршил, үнэ, багтаамжаар
          шүүж, бүгдийг нэг дороос хялбар олоорой.
        </p>

        {/* Search */}
        <div className="animate-fade-in-up animate-delay-150 mb-8 max-w-2xl mx-auto">
          <div className="flex items-center gap-2 p-2 rounded-2xl bg-background/80 backdrop-blur-md border border-border/60 shadow-xl shadow-black/5">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Байршил, нэр, төрлөөр хайх..."
                className="w-full pl-12 pr-4 py-3 text-base bg-transparent focus:outline-none placeholder:text-muted-foreground/60 text-foreground"
              />
            </div>
            <Button onClick={handleSearch} size="lg"
              className="shrink-0 rounded-xl px-6 py-3 font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all">
              Хайх <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animate-delay-200 mb-12">
          <Button size="lg" variant="outline" className="font-semibold px-8 py-6 text-lg" asChild>
            <a href="/adds">
              Бүх зар үзэх <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>

          <div className="relative group cursor-pointer" onClick={handleRegisterClick}>
            <div className="relative px-8 py-2.5 border-2 border-pink-500 text-black dark:text-white font-bold text-lg rounded-lg transform transition-all duration-300 group-hover:translate-y-1 group-hover:translate-x-1 shadow-[6px_6px_10px_rgba(0,0,0,0.6),-6px_-6px_10px_rgba(255,255,255,0.1)] group-hover:shadow-[8px_8px_15px_rgba(0,0,0,0.8),-8px_-8px_15px_rgba(255,255,255,0.15)]">
              Зар оруулах
            </div>
            <div className="absolute inset-0 border-2 border-dashed border-pink-700 rounded-lg opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-pink-700 rounded-full animate-ping shadow-lg" />
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-pink-700 rounded-full animate-ping shadow-lg" />
            <div className="absolute top-1/3 left-3 w-3 h-3 bg-pink-700 rounded-full animate-ping opacity-70" />
            <div className="absolute top-2/3 right-3 w-3 h-3 bg-pink-700 rounded-full animate-ping opacity-70" />
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground animate-fade-in-up animate-delay-300">
          {[
            { label: "50+ Байгууллага", delay: "0s"   },
            { label: "45+ Байршил",     delay: "0.5s" },
            { label: "30+ Үйлчилгээ",  delay: "1s"   },
          ].map(({ label, delay }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: delay }} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Нэвтрээгүй → AuthModal */}
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={handleAuthSuccess}
        defaultTab="login"
      />

      {/* Нэвтэрсэн → RegisterModal */}
      <RegisterModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
      />
    </section>
  );
}
