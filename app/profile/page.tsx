"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import {
  User, Phone, Lock, Eye, EyeOff, CheckCircle2,
  RefreshCw, Copy, Check, Save, ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function generatePassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#"
  let pass = ""
  for (let i = 0; i < 12; i++) pass += chars[Math.floor(Math.random() * chars.length)]
  return `${pass.slice(0,4)}-${pass.slice(4,8)}-${pass.slice(8,12)}`
}

export default function ProfilePage() {
  const { user, isLoggedIn } = useAuth()
  const router = useRouter()

  const [name,        setName]        = useState(user?.name || "")
  const [oldPass,     setOldPass]     = useState("")
  const [newPass,     setNewPass]     = useState("")
  const [showOld,     setShowOld]     = useState(false)
  const [showNew,     setShowNew]     = useState(false)
  const [passMode,    setPassMode]    = useState<"auto" | "manual">("auto")
  const [copied,      setCopied]      = useState(false)
  const [loading,     setLoading]     = useState(false)
  const [nameSuccess, setNameSuccess] = useState(false)
  const [passSuccess, setPassSuccess] = useState(false)
  const [error,       setError]       = useState("")

  useEffect(() => {
    if (!isLoggedIn) router.push("/")
  }, [isLoggedIn, router])

  useEffect(() => {
    if (passMode === "auto") {
      setNewPass(generatePassword())
    } else {
      setNewPass("")
    }
  }, [passMode])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(newPass)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRegen = () => {
    setNewPass(generatePassword())
    setCopied(false)
  }

  const handleNameSave = async () => {
    if (!name.trim()) { setError("Нэр хоосон байна"); return }
    setLoading(true); setError("")
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({ name }),
      })
      if (!res.ok) { const d = await res.json(); setError(d.error); return }
      setNameSuccess(true)
      setTimeout(() => setNameSuccess(false), 3000)
    } catch { setError("Сервертэй холбогдсонгүй") }
    finally { setLoading(false) }
  }

  const handlePassChange = async () => {
    if (!oldPass)       { setError("Хуучин нууц үгээ оруулна уу"); return }
    if (!newPass)       { setError("Шинэ нууц үг шаардлагатай");   return }
    if (oldPass === newPass) { setError("Шинэ нууц үг хуучинтай адилхан байна"); return }

    setLoading(true); setError("")
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({ old_password: oldPass, new_password: newPass }),
      })
      if (!res.ok) { const d = await res.json(); setError(d.error); return }
      setPassSuccess(true)
      setOldPass(""); 
      setTimeout(() => {
        setPassSuccess(false)
        setPassMode("auto")
      }, 3000)
    } catch { setError("Сервертэй холбогдсонгүй") }
    finally { setLoading(false) }
  }

  if (!isLoggedIn) return null

  const initials = user?.name
    ?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() ?? "?"

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-lg">

        {/* Back */}
        <button onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" /> Буцах
        </button>

        <h1 className="text-2xl font-bold mb-6">Профайл</h1>

        {/* Avatar */}
        <div className="flex items-center gap-4 p-5 rounded-2xl border border-border/60 bg-muted/20 mb-5">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold shrink-0">
            {initials}
          </div>
          <div>
            <p className="font-semibold">{user?.name}</p>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
              <Phone className="h-3.5 w-3.5" />
              <span>{user?.phone}</span>
            </div>
          </div>
        </div>

        {/* ── Нэр өөрчлөх ── */}
        <div className="p-5 rounded-2xl border border-border/60 bg-background mb-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <User className="h-4 w-4 text-primary" />
            </div>
            <h2 className="font-semibold">Нэр өөрчлөх</h2>
          </div>

          <div className="space-y-3">
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Таны нэр"
              className="w-full px-4 py-2.5 text-sm bg-muted/50 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
            {nameSuccess && (
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm">
                <CheckCircle2 className="h-4 w-4" /> Нэр амжилттай шинэчлэгдлээ
              </div>
            )}
            <Button onClick={handleNameSave} disabled={loading} size="sm" className="gap-2">
              <Save className="h-3.5 w-3.5" /> Хадгалах
            </Button>
          </div>
        </div>

        {/* ── Нууц үг солих ── */}
        <div className="p-5 rounded-2xl border border-border/60 bg-background mb-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-amber-500/10">
              <Lock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="font-semibold">Нууц үг солих</h2>
          </div>

          <div className="space-y-3">
            {/* Хуучин нууц үг */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                Хуучин нууц үг
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                  value={oldPass}
                  onChange={e => setOldPass(e.target.value)}
                  type={showOld ? "text" : "password"}
                  placeholder="Одоогийн нууц үг"
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-muted/50 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
                <button onClick={() => setShowOld(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showOld ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Шинэ нууц үг */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Шинэ нууц үг</label>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPassMode("auto")}
                    className={cn("text-xs transition-colors",
                      passMode === "auto" ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground")}>
                    Автомат
                  </button>
                  <span className="text-muted-foreground/40 text-xs">|</span>
                  <button onClick={() => setPassMode("manual")}
                    className={cn("text-xs transition-colors",
                      passMode === "manual" ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground")}>
                    Өөрөө оруулах
                  </button>
                </div>
              </div>

              {passMode === "auto" ? (
                <div>
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-muted/50 border border-border/60 rounded-xl">
                    <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                    <code className="flex-1 text-sm font-mono font-bold tracking-widest">
                      {showNew ? newPass : newPass.replace(/./g, "•")}
                    </code>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => setShowNew(v => !v)}
                        className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground">
                        {showNew ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                      <button onClick={handleCopy}
                        className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground">
                        {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                      <button onClick={handleRegen}
                        className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground">
                        <RefreshCw className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  {copied && <p className="text-[10px] text-emerald-600 mt-1">✓ Clipboard-д хуулагдлаа</p>}
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1">
                    ⚠️ Шинэ нууц үгээ заавал хуулж хадгалаарай
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <input
                    value={newPass}
                    onChange={e => setNewPass(e.target.value)}
                    type={showNew ? "text" : "password"}
                    placeholder="Шинэ нууц үг"
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-muted/50 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                  <button onClick={() => setShowNew(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              )}
            </div>

            {error && (
              <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>
            )}
            {passSuccess && (
              <div className="flex items-center gap-2 text-emerald-600 text-sm">
                <CheckCircle2 className="h-4 w-4" /> Нууц үг амжилттай солигдлоо
              </div>
            )}

            <Button
              onClick={handlePassChange}
              disabled={loading}
              size="sm"
              className="gap-2 bg-amber-500 hover:bg-amber-600 text-white"
            >
              <Lock className="h-3.5 w-3.5" /> Нууц үг солих
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}