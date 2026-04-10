"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ListingRegisterModal } from "./listing-register-modal";
import { ServiceRegisterModal } from "./service-register-modal";
import { AuthModal } from "@/components/auth/auth-modal";
import { useAuth } from "@/components/auth/auth-provider";

type Tab = "listing" | "service";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function RegisterModal({ open, onClose }: Props) {
  const { isLoggedIn, login } = useAuth();
  const [tab, setTab] = useState<Tab>("listing");
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (open && !isLoggedIn) setAuthOpen(true);
  }, [open, isLoggedIn]);

  const handleAuthSuccess = (user: any) => {
    login(user);
    setAuthOpen(false);
  };

  const handleAuthClose = () => {
    setAuthOpen(false);
    if (!isLoggedIn) onClose();
  };

  if (!open) return null;

  if (!isLoggedIn) {
    return (
      <AuthModal
        open={authOpen}
        onClose={handleAuthClose}
        onSuccess={handleAuthSuccess}
        defaultTab="login"
      />
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-300 w-full max-w-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Tab selector */}
          <div className="bg-background rounded-2xl shadow-2xl border border-border/60 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border/50">
              <div>
                <h2 className="text-lg font-bold">Зар оруулах</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Бүртгэх төрлөө сонгоно уу
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border/50">
              {(
                [
                  {
                    id: "listing",
                    emoji: "🏠",
                    label: "Байр бүртгэх",
                    desc: "Зуслангийн байр, орон сууц, байшин",
                  },
                  {
                    id: "service",
                    emoji: "🎯",
                    label: "Үйлчилгээ бүртгэх",
                    desc: "Аялал хөтөч, барбекю, тээвэр",
                  },
                ] as { id: Tab; emoji: string; label: string; desc: string }[]
              ).map(({ id, emoji, label, desc }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={cn(
                    "flex-1 flex items-center gap-3 px-5 py-4 text-left transition-all border-b-2",
                    tab === id
                      ? "border-primary bg-primary/5"
                      : "border-transparent hover:bg-muted/50",
                  )}
                >
                  <span className="text-2xl">{emoji}</span>
                  <div>
                    <p
                      className={cn(
                        "text-sm font-semibold",
                        tab === id ? "text-primary" : "text-foreground",
                      )}
                    >
                      {label}
                    </p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-5">
              {tab === "listing" && (
                <div className="rounded-xl border border-border/60 overflow-hidden">
                  <ListingRegisterModal open={true} onClose={onClose} />
                </div>
              )}
              {tab === "service" && (
                <div className="rounded-xl border border-border/60 overflow-hidden">
                  <ServiceRegisterModal open={true} onClose={onClose} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
