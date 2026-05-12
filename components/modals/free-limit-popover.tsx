"use client"

import { X, AlertCircle, CreditCard, Mail, Copy, Check } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface Props {
  open: boolean
  onClose: () => void
}

const BANK_ACCOUNT = "9700 1500 3005157476"
const NOTIFY_EMAIL = "zuslanrent@gmail.com"

export function FreeLimitPopover({ open, onClose }: Props) {
  const [copied, setCopied] = useState(false)
  
  if (!open) return null
  
  const copyAccount = async () => {
    await navigator.clipboard.writeText(BANK_ACCOUNT.replace(/\s/g, ""))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  return (
    <>
      {/* Backdrop — parent modal-аас дээгүүр (z-[60]) */}
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
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center shrink-0">
                <AlertCircle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-base">Үнэгүй багц ашиглагдсан</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  24 цагийн зар — нэг удаа
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
          <div className="px-6 py-5 space-y-4">
            <p className="text-sm text-foreground/90 leading-relaxed">
              Нэг хэрэглэгч зөвхөн <strong>нэг удаа</strong> үнэгүй зар оруулах боломжтой. 
              Та энэ багцыг аль хэдийн ашигласан байна.
            </p>
            
            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Үнэтэй багц сонгох бол:
              </p>
              
              {/* Dans */}
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200/60">
                <div className="flex items-start gap-3">
                  <CreditCard className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-1">
                      Шилжүүлэх данс
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-bold text-blue-700 dark:text-blue-300 select-all">
                        {BANK_ACCOUNT}
                      </span>
                      <button
                        onClick={copyAccount}
                        className="p-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors"
                        title="Хуулах"
                      >
                        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Email */}
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/60">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-emerald-900 dark:text-emerald-100 mb-1">
                      Мэдэгдэл хүлээн авах
                    </div>
                    <p className="text-sm text-emerald-700 dark:text-emerald-300 leading-relaxed">
                      Шилжүүлгийн мэдээ давхар{" "}
                      <span className="font-semibold">{NOTIFY_EMAIL}</span>{" "}
                      хаягт очно.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60">
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                💡 Шилжүүлгийн утганд <strong>утасны дугаар</strong> болон <strong>зарын гарчиг</strong> бичээрэй. 
                Шалгасны дараа 24 цагийн дотор зар идэвхжинэ.
              </p>
            </div>
          </div>
          
          {/* Footer */}
          <div className="px-6 py-4 border-t border-border/50 flex items-center justify-end">
            <Button onClick={onClose} className="gap-1.5">
              Үнэтэй багц сонгох
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}