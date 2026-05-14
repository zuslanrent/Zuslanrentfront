"use client"

import { useState, useEffect } from "react"
import { Phone, X, ShieldAlert, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

const CONSENT_KEY = "zuslan_phone_consent_v1"

interface PhoneRevealProps {
  phone: string | null | undefined
  size?: "sm" | "md"
}

export function PhoneReveal({ phone, size = "sm" }: PhoneRevealProps) {
  const [consented, setConsented] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  // localStorage-аас уншиж зөвшөөрсөн эсэхийг шалгах
  useEffect(() => {
    if (typeof window !== "undefined") {
      setConsented(localStorage.getItem(CONSENT_KEY) === "true")
      setHydrated(true)
    }
  }, [])

  if (!phone) return null

  const handleAgree = () => {
    localStorage.setItem(CONSENT_KEY, "true")
    setConsented(true)
    setModalOpen(false)
  }

  const sizeClasses = size === "sm" ? "text-xs gap-1" : "text-sm gap-1.5"

  // Зөвшөөрсөн бол утсыг шууд харуулах
  if (hydrated && consented) {
    return (
      <a
        href={`tel:${phone}`}
        onClick={(e) => e.stopPropagation()}
        className={`flex items-center ${sizeClasses} text-primary hover:underline shrink-0 font-medium`}
      >
        <Phone className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
        {phone}
      </a>
    )
  }

  // Зөвшөөрөөгүй бол button-ыг харуулах
  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation()
          setModalOpen(true)
        }}
        className={`flex items-center ${sizeClasses} text-primary hover:underline shrink-0 font-medium`}
      >
        <Eye className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
        Дугаар харах
      </button>

      {modalOpen && (
        <PhoneConsentModal
          phone={phone}
          onAgree={handleAgree}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  )
}

function PhoneConsentModal({
  phone,
  onAgree,
  onClose,
}: {
  phone: string
  onAgree: () => void
  onClose: () => void
}) {
  return (
    <>
      <div
        className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-md bg-background rounded-2xl shadow-2xl border border-border/60 animate-in fade-in slide-in-from-bottom-4 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center shrink-0">
                <ShieldAlert className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-base">Анхааруулга</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Дугаар харахын өмнө уншина уу
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-muted transition-colors shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-3">
            <p className="text-sm leading-relaxed">
              Манай сайт нь зөвхөн <strong>зар нийтлэх платформ</strong> юм.
              Зар оруулагч болон таны хооронд үүсэх аливаа маргаан, гэрээний
              асуудал, сүүлд үүсэх алдаа дутагдалд{" "}
              <strong>бид хариуцлага хүлээхгүй</strong>.
            </p>

            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60">
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                💡 Та зар оруулагчтай шууд харилцах ба байр түрээслэхээс өмнө
                бүх нөхцөл, хаяг, төлбөрийг өөрөө шалгаарай.
              </p>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Энэ зөвшөөрөл таны төхөөрөмжид хадгалагдах тул дараагийн удаа
              дугаар үзэхэд дахин харагдахгүй.
            </p>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border/50 flex items-center justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Цуцлах
            </Button>
            <Button onClick={onAgree} className="gap-1.5">
              <Phone className="h-3.5 w-3.5" />
              Зөвшөөрч, дугаар харах
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}