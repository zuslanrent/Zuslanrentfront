"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import { MobileMenu } from "@/components/mobile-menu";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  LogIn,
  LogOut,
  User,
  Phone,
  FileText,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthModal, AuthUser } from "@/components/auth/auth-modal";
import { useAuth } from "@/components/auth/auth-provider";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: (user: AuthUser) => void;
  defaultTab?: "login" | "register";
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, login, logout, isLoggedIn } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dropdown гадна дарвал хаах
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Avatar-ийн үсэг
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  const navLinks = [
    ["/#over-ons", "Бидний тухай"],
    ["/service", "Үйлчилгээ"],
    ["/adds", "Шинэ зарууд"],
    ["/shop", "Дэлгүүр"],
    ["/#contact", "Холбоо барих"],
  ];

  return (
    <>
      <nav
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          isScrolled
            ? "bg-background/90 backdrop-blur-lg border-b border-border shadow-sm"
            : "bg-transparent",
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="hover:opacity-80 transition-opacity shrink-0"
            >
              <Logo />
            </Link>

            {/* Nav links */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {navLinks.map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "text-sm font-medium transition-colors whitespace-nowrap",
                    pathname === href
                      ? "text-primary"
                      : "hover:text-primary text-foreground/80",
                  )}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2 shrink-0">
              <ThemeToggle />

              {isLoggedIn ? (
                /* ── Нэвтэрсэн: Avatar dropdown ── */
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((v) => !v)}
                    className={cn(
                      "flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border transition-all",
                      dropdownOpen
                        ? "border-primary/50 bg-primary/5"
                        : "border-border/60 hover:border-primary/30 hover:bg-muted/60",
                    )}
                  >
                    {/* Avatar */}
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
                      {initials}
                    </div>
                    <span className="hidden sm:block text-sm font-medium max-w-24 truncate">
                      {user?.name}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                        dropdownOpen && "rotate-180",
                      )}
                    />
                  </button>

                  {/* Dropdown */}
                  {dropdownOpen && (
                    <div className="absolute right-0 top-11 z-50 w-56 bg-background border border-border/60 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                      {/* User info */}
                      <div className="px-4 py-3 border-b border-border/50 bg-muted/30">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate">
                              {user?.name}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                              <Phone className="h-3 w-3 shrink-0" />
                              <span>{user?.phone}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu items */}
                      <div className="py-1.5">
                        <Link
                          href="/my-listings"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted/60 transition-colors"
                        >
                          <div className="p-1.5 rounded-lg bg-primary/10">
                            <FileText className="h-3.5 w-3.5 text-primary" />
                          </div>
                          Миний зарууд
                        </Link>

                        <Link
                          href="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted/60 transition-colors"
                        >
                          <div className="p-1.5 rounded-lg bg-muted">
                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                          Профайл
                        </Link>
                      </div>

                      <div className="border-t border-border/50 py-1.5">
                        <button
                          onClick={() => {
                            logout();
                            setDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/8 transition-colors"
                        >
                          <div className="p-1.5 rounded-lg bg-destructive/10">
                            <LogOut className="h-3.5 w-3.5" />
                          </div>
                          Гарах
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* ── Нэвтрээгүй: Login товч ── */
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setAuthOpen(true)}
                  className="gap-1.5 text-xs rounded-full px-3 h-8"
                >
                  <LogIn className="h-3.5 w-3.5" /> Нэвтрэх
                </Button>
              )}

              <MobileMenu />
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={login} // ← (user: AuthUser) => void — таарна
      />
    </>
  );
}
