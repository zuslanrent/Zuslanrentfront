"use client"

import { X, CreditCard, Mail, Copy, Check, AlertCircle } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface Props {
  open: boolean
  onClose: () => void
  amount: number
  listingTitle?: string
  phone?: string
}

const BANK_ACCOUNT = "9700 1500 3005157476"
const BANK_NAME = "Хаан банк"
const NOTIFY_EMAIL = "zuslanrent@gmail.com"

export function PaymentInfoPopover({ open, onClose, amount, listingTitle, phone }: Props) {
  const [copied, setCopied] = useState<"account" | "ref" | null>(null)
  
  if (!open) return null
  
  const refText = `${phone || ""}`.trim()
  
  const copy = async (text: string, type: "account" | "ref") => {
    await navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }
  
  return (
    <>
      <div 
        className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm animate-in fade-in duration-200" 
        onClick={onClose} 
      />
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="pointer-events-auto w-full max-w-md bg-background rounded-2xl shadow-2xl border border-border/60 animate-in fade-in slide-in-from-bottom-4 duration-300"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center shrink-0">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-base">Төлбөр төлөх</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Шилжүүлэг хийгээд хүлээнэ үү
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-muted transition-colors shrink-0">
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {/* Body */}
          <div className="px-6 py-5 space-y-4">
            
            {/* Дүн */}
            <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/30 border border-blue-200/60">
              <p className="text-xs font-semibold text-blue-900 dark:text-blue-200 uppercase tracking-wide mb-1">
                Төлөх дүн
              </p>
              <p className="text-3xl font-bold font-mono text-blue-700 dark:text-blue-300">
                {amount.toLocaleString()}₮
              </p>
            </div>
            
            {/* Дансны мэдээлэл */}
            <div className="p-4 rounded-xl bg-muted/40 border border-border/60 space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Данс</span>
                  <span className="text-xs text-muted-foreground">{BANK_NAME}</span>
                </div>
                <div className="flex items-center justify-between gap-2 bg-background rounded-lg px-3 py-2.5 border border-border/60">
                  <span className="font-mono text-base font-bold select-all">{BANK_ACCOUNT}</span>
                  <button
                    onClick={() => copy(BANK_ACCOUNT.replace(/\s/g, ""), "account")}
                    className="shrink-0 p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {copied === "account" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
              
              {refText && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Шилжүүлгийн утга
                  </p>
                  <div className="flex items-center justify-between gap-2 bg-background rounded-lg px-3 py-2.5 border border-border/60">
                    <span className="text-sm truncate select-all">{refText}</span>
                    <button
                      onClick={() => copy(refText, "ref")}
                      className="shrink-0 p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {copied === "ref" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Дараагийн алхам */}
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/60">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <div className="text-sm text-emerald-800 dark:text-emerald-300 leading-relaxed">
                  <strong>Төлбөр төлөгдсөний дараа</strong> таны зар автоматаар идэвхжих болно. 
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="px-6 py-4 border-t border-border/50">
            <Button onClick={onClose} className="w-full">
              Ойлголоо
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}