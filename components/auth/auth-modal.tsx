"use client"

import { useState, useEffect } from "react"
import {
  X, Phone, Lock, Eye, EyeOff, CheckCircle2,
  LogIn, UserPlus, RefreshCw, Copy, Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type AuthUser = {
  id: string
  name: string
  phone: string
  token: string
}

interface Props {
  open: boolean
  onClose: () => void
  onSuccess: (user: AuthUser) => void
  defaultTab?: "login" | "register"
}

// Санамсаргүй нууц үг үүсгэх
function generatePassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#"
  let pass = ""
  for (let i = 0; i < 12; i++) {
    pass += chars[Math.floor(Math.random() * chars.length)]
  }
  // Xxxx-xxxx-xxxx формат
  return `${pass.slice(0,4)}-${pass.slice(4,8)}-${pass.slice(8,12)}`
}

export function AuthModal({ open, onClose, onSuccess, defaultTab = "login" }: Props) {
  const [tab,          setTab]          = useState<"login" | "register">(defaultTab)
  const [phone,        setPhone]        = useState("")
  const [password,     setPassword]     = useState("")
  const [name,         setName]         = useState("")
  const [showPass,     setShowPass]     = useState(false)
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState("")
  const [success,      setSuccess]      = useState(false)
  const [copied,       setCopied]       = useState(false)
  const [passMode,     setPassMode]     = useState<"auto" | "manual">("auto")
  const [autoPass,     setAutoPass]     = useState("")

  // Modal нээгдэх үед auto нууц үг үүсгэнэ
  useEffect(() => {
    if (open && tab === "register") {
      const p = generatePassword()
      setAutoPass(p)
      setPassword(p)
    }
  }, [open, tab])

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setPhone(""); setPassword(""); setName("")
        setError(""); setSuccess(false); setCopied(false)
        setPassMode("auto"); setAutoPass("")
        setTab(defaultTab)
      }, 300)
    }
  }, [open, defaultTab])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  // Tab солих үед auto нууц үг шинэчлэх
  const handleTabChange = (t: "login" | "register") => {
    setTab(t); setError("")
    if (t === "register") {
      const p = generatePassword()
      setAutoPass(p)
      setPassword(p)
      setPassMode("auto")
    } else {
      setPassword("")
    }
  }

  // Шинэ нууц үг үүсгэх
  const handleRegenerate = () => {
    const p = generatePassword()
    setAutoPass(p)
    setPassword(p)
    setCopied(false)
  }

  // Manual mode руу шилжих
  const handleManualMode = () => {
    setPassMode("manual")
    setPassword("")
    setShowPass(true)
  }

  // Clipboard хуулах
  const handleCopy = async () => {
    await navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLogin = async () => {
    if (!phone || !password) { setError("Утас болон нууц үгээ оруулна уу"); return }
    setLoading(true); setError("")
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.replace(/\D/g, ""), password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Нэвтрэх амжилтгүй"); return }

      localStorage.setItem("auth_user",    JSON.stringify(data.user))
      localStorage.setItem("auth_token",   data.token)
      localStorage.setItem("auth_expires", data.expires_at)
      onSuccess(data.user)
      onClose()
    } catch {
      setError("Сервертэй холбогдож чадсангүй")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    if (!phone || !name)  { setError("Нэр болон утасны дугаараа оруулна уу"); return }
    if (!password)        { setError("Нууц үг шаардлагатай"); return }
    const cleanPhone = phone.replace(/\D/g, "")
    if (cleanPhone.length < 8) { setError("Утасны дугаар буруу байна"); return }

    setLoading(true); setError("")
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanPhone, password, name }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Бүртгэл амжилтгүй"); return }
      setSuccess(true)
    } catch {
      setError("Сервертэй холбогдож чадсангүй")
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative w-full max-w-sm bg-background rounded-2xl shadow-2xl border border-border/60 pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-300"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border/50">
            <h2 className="font-bold text-base">
              {tab === "login" ? "Нэвтрэх" : "Бүртгүүлэх"}
            </h2>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-muted transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border/50">
            {(["login", "register"] as const).map(t => (
              <button key={t} onClick={() => handleTabChange(t)}
                className={cn(
                  "flex-1 py-2.5 text-sm font-medium transition-all",
                  tab === t
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}>
                {t === "login" ? "Нэвтрэх" : "Бүртгүүлэх"}
              </button>
            ))}
          </div>

          <div className="px-6 py-5 space-y-4">

            {/* ── SUCCESS ── */}
            {success && (
              <div className="flex flex-col items-center text-center py-4 space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center">
                  <CheckCircle2 className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="font-bold">Бүртгэл амжилттай!</p>

                {/* Нууц үгийг харуулах */}
                <div className="w-full p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 text-left space-y-1">
                  <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold">
                    ⚠️ Нууц үгээ хадгалаарай!
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-sm font-mono font-bold tracking-widest text-foreground">
                      {password}
                    </code>
                    <button onClick={handleCopy}
                      className="p-1.5 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors shrink-0">
                      {copied
                        ? <Check className="h-3.5 w-3.5 text-emerald-600" />
                        : <Copy className="h-3.5 w-3.5 text-amber-600" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-amber-600/70 dark:text-amber-500">
                    Дахин харах боломжгүй тул заавал хадгална уу
                  </p>
                </div>

                <Button className="w-full" onClick={() => { setSuccess(false); handleTabChange("login") }}>
                  Нэвтрэх рүү очих →
                </Button>
              </div>
            )}

            {/* ── FORM ── */}
            {!success && (
              <>
                {/* Нэр (register) */}
                {tab === "register" && (
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block text-muted-foreground">Нэр</label>
                    <input value={name} onChange={e => setName(e.target.value)}
                      placeholder="Таны нэр"
                      className="w-full px-4 py-2.5 text-sm bg-muted/50 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                  </div>
                )}

                {/* Утас */}
                <div>
                  <label className="text-xs font-semibold mb-1.5 block text-muted-foreground">Утасны дугаар</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <input value={phone} onChange={e => setPhone(e.target.value)}
                      placeholder="9900-0000" type="tel"
                      onKeyDown={e => e.key === "Enter" && (tab === "login" ? handleLogin() : handleRegister())}
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-muted/50 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                  </div>
                </div>

                {/* Нууц үг */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Нууц үг</label>
                    {tab === "register" && (
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setPassMode("auto"); handleRegenerate() }}
                          className={cn("text-xs transition-colors",
                            passMode === "auto" ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground")}>
                          Автомат
                        </button>
                        <span className="text-muted-foreground/40 text-xs">|</span>
                        <button onClick={handleManualMode}
                          className={cn("text-xs transition-colors",
                            passMode === "manual" ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground")}>
                          Өөрөө оруулах
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Auto mode */}
                  {tab === "register" && passMode === "auto" && (
                    <div className="relative">
                      <div className="flex items-center gap-2 px-3 py-2.5 bg-muted/50 border border-border/60 rounded-xl">
                        <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                        <code className="flex-1 text-sm font-mono font-bold tracking-widest text-foreground">
                          {showPass ? password : password.replace(/./g, "•")}
                        </code>
                        <div className="flex items-center gap-1 shrink-0">
                          <button onClick={() => setShowPass(v => !v)}
                            className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                            {showPass ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          </button>
                          <button onClick={handleCopy}
                            className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                          <button onClick={handleRegenerate}
                            className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                            <RefreshCw className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      {copied && (
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">✓ Clipboard-д хуулагдлаа</p>
                      )}
                      <p className="text-[10px] text-muted-foreground mt-1">
                        🔄 Шинэчлэх • 👁 Харах • 📋 Хуулах
                      </p>
                    </div>
                  )}

                  {/* Manual mode / Login */}
                  {(tab === "login" || passMode === "manual") && (
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <input
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type={showPass ? "text" : "password"}
                        placeholder="Нууц үг оруулах"
                        onKeyDown={e => e.key === "Enter" && (tab === "login" ? handleLogin() : handleRegister())}
                        className="w-full pl-10 pr-10 py-2.5 text-sm bg-muted/50 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                      />
                      <button onClick={() => setShowPass(v => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  )}
                </div>

                {/* Error */}
                {error && (
                  <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>
                )}

                {/* Submit */}
                <Button
                  onClick={tab === "login" ? handleLogin : handleRegister}
                  disabled={loading}
                  className="w-full gap-2 font-semibold"
                >
                  {loading
                    ? <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                    : tab === "login"
                      ? <><LogIn className="h-4 w-4" /> Нэвтрэх</>
                      : <><UserPlus className="h-4 w-4" /> Бүртгүүлэх</>
                  }
                </Button>

                {tab === "login" && (
                  <p className="text-xs text-center text-muted-foreground">
                    5 минут идэвхгүй байвал автоматаар гарна
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}