"use client"

import { useEffect, useState } from "react"
import { X, Home, ShoppingBag, HeartHandshake, ChevronRight, LogIn } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ListingRegisterModal }  from "./listing-register-modal"
import { ShopRegisterModal }     from "./shop-register-modal"
import { ServiceRegisterModal }  from "./service-register-modal"
import { AuthModal }             from "@/components/auth/auth-modal"
import { useAuth }               from "@/components/auth/auth-provider"

type ModalType = "listing" | "shop" | "service" | null

interface Props {
  open: boolean
  onClose: () => void
}

const types = [
  {
    id:        "listing" as ModalType,
    emoji:     "🏠",
    title:     "Байр бүртгэх",
    desc:      "Зуслангийн байр, орон сууц, байшингаа зарлах",
    badge:     "bg-primary/10 text-primary",
    badgeText: "Зар",
    color:     "hover:border-primary/50 hover:bg-primary/5",
  },
  {
    id:        "shop" as ModalType,
    emoji:     "🛒",
    title:     "Дэлгүүр бүртгэх",
    desc:      "Кемпинг, барбекю, гал тогооны хэрэгсэл зарах",
    badge:     "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400",
    badgeText: "Дэлгүүр",
    color:     "hover:border-amber-400/50 hover:bg-amber-50 dark:hover:bg-amber-950/20",
  },
  {
    id:        "service" as ModalType,
    emoji:     "🎯",
    title:     "Үйлчилгээ бүртгэх",
    desc:      "Аялал хөтөч, барбекю, тээвэр зэрэг үйлчилгээ",
    badge:     "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400",
    badgeText: "Үйлчилгээ",
    color:     "hover:border-emerald-400/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/20",
  },
]

export function RegisterModal({ open, onClose }: Props) {
  const { isLoggedIn, login } = useAuth()
  const [selected,  setSelected]  = useState<ModalType>(null)
  const [authOpen,  setAuthOpen]  = useState(false)
  // Login дууссаны дараа автоматаар нэмэх modal нээх
  const [pendingOpen, setPendingOpen] = useState(false)

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  // Modal хаагдах үед reset
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setSelected(null)
        setPendingOpen(false)
      }, 300)
    }
  }, [open])

  // Modal нээгдэх үед нэвтрээгүй бол auth шалгах
  useEffect(() => {
    if (open && !isLoggedIn) {
      // Нэвтрэх modal нээж, register modal-г хүлээлтэнд оруулна
      setAuthOpen(true)
      setPendingOpen(true)
    }
  }, [open])

  // Login амжилттай → type selector нээх
  const handleAuthSuccess = (user: any) => {
    login(user)
    setAuthOpen(false)
    setPendingOpen(false)
    // Нэвтэрсний дараа type selector харагдана (open=true тул)
  }

  // Auth modal хаагдаад нэвтрээгүй бол register modal-г бүрэн хаах
  const handleAuthClose = () => {
    setAuthOpen(false)
    if (!isLoggedIn) {
      setPendingOpen(false)
      onClose()
    }
  }

  if (!open) return null

  // Нэвтрээгүй үед зөвхөн auth modal харуулна
  if (!isLoggedIn) {
    return (
      <AuthModal
        open={authOpen}
        onClose={handleAuthClose}
        onSuccess={handleAuthSuccess}
        defaultTab="login"
      />
    )
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-300 w-full max-w-2xl max-h-[92vh]"
          onClick={e => e.stopPropagation()}
        >
          {/* Type selector */}
          {!selected && (
            <div className="bg-background rounded-2xl shadow-2xl border border-border/60 overflow-hidden">
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border/50">
                <div>
                  <h2 className="text-lg font-bold">Юу бүртгэх вэ?</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Бүртгэх төрлөө сонгоно уу
                  </p>
                </div>
                <button onClick={onClose} className="p-1.5 rounded-full hover:bg-muted transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-5 space-y-3">
                {types.map(({ id, emoji, title, desc, color, badge, badgeText }) => (
                  <button
                    key={id as string}
                    onClick={() => setSelected(id)}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-xl border border-border/60",
                      "transition-all duration-200 text-left group",
                      color,
                    )}
                  >
                    <div className="text-3xl shrink-0">{emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-semibold text-sm">{title}</p>
                        <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", badge)}>
                          {badgeText}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {selected === "listing" && <ListingRegisterModal onClose={onClose} />}
          {selected === "shop"    && <ShopRegisterModal    onClose={onClose} />}
          {selected === "service" && <ServiceRegisterModal onClose={onClose} />}
        </div>
      </div>
    </>
  )
}