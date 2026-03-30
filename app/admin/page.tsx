"use client"

import { useState, useEffect } from "react"
import {
  LayoutDashboard, Home, ShoppingBag, HeartHandshake,
  LogOut, Search, Trash2, CheckCircle, XCircle,
  Eye, ChevronDown, Filter, Users, TrendingUp,
  Shield, AlertCircle, Phone, MapPin, DollarSign,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// ── Types ─────────────────────────────────────────────────────
type Section = "dashboard" | "listings" | "products" | "services" | "users"
type Status  = "all" | "pending" | "active" | "inactive" | "rejected"

// ── Mock data — API холбосны дараа солих ──────────────────────
const mockListings = [
  { id: "1", title: "Богдхан орчмын зуслан", owner: "Батболд", phone: "99001234", location: "Богдхан", price: 150000, status: "pending",  created_at: "2025-03-20" },
  { id: "2", title: "Тэрэлж ойн байшин",     owner: "Мөнхзул", phone: "88001234", location: "Тэрэлж",  price: 120000, status: "active",   created_at: "2025-03-18" },
  { id: "3", title: "Сэргэлэн орон сууц",    owner: "Дорж",    phone: "77001234", location: "Сэргэлэн",price: 80000,  status: "rejected", created_at: "2025-03-15" },
]
const mockProducts = [
  { id: "1", name: "Кемпинг майхан 4 хүн", seller: "Ган-Эрдэнэ", phone: "99112233", price: 180000, stock: 5,  status: "pending", created_at: "2025-03-19" },
  { id: "2", name: "Барбекю тогоо XL",      seller: "Сарнай",    phone: "88223344", price: 120000, stock: 12, status: "active",  created_at: "2025-03-17" },
]
const mockServices = [
  { id: "1", title: "Морин аялал",       provider: "Болд",    phone: "99334455", price: "50,000₮", duration: "Өдрийн", status: "pending", created_at: "2025-03-21" },
  { id: "2", title: "Загасчлалын хэрэгсэл", provider: "Нарантуяа", phone: "88445566", price: "20,000₮", duration: "Өдрийн", status: "active",  created_at: "2025-03-16" },
]
const mockUsers = [
  { id: "1", name: "Батболд",    phone: "99001234", listings: 2, created_at: "2025-03-10", is_active: true  },
  { id: "2", name: "Мөнхзул",   phone: "88001234", listings: 1, created_at: "2025-03-12", is_active: true  },
  { id: "3", name: "Хаагдсан",  phone: "77001234", listings: 0, created_at: "2025-03-05", is_active: false },
]

// ── Status config ─────────────────────────────────────────────
const statusConfig: Record<string, { label: string; color: string }> = {
  pending:  { label: "Хүлээгдэж байна", color: "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400"   },
  active:   { label: "Идэвхтэй",        color: "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400" },
  inactive: { label: "Идэвхгүй",        color: "bg-muted text-muted-foreground"                                               },
  rejected: { label: "Татгалзсан",      color: "bg-destructive/10 text-destructive"                                           },
}

// ── Admin Login ───────────────────────────────────────────────
function AdminLogin({ onLogin }: { onLogin: (token: string) => void }) {
  const [email,    setEmail]    = useState("")
  const [password, setPassword] = useState("")
  const [error,    setError]    = useState("")
  const [loading,  setLoading]  = useState(false)

  const handleLogin = async () => {
    if (!email || !password) { setError("Бүх талбар шаардлагатай"); return }
    setLoading(true); setError("")
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email:    email.trim().toLowerCase(),
        password: password, }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Нэвтрэх амжилтгүй"); return }

      localStorage.setItem("admin_token", data.token)
      localStorage.setItem("admin_info",  JSON.stringify(data.admin))
      onLogin(data.token)
    } catch {
      setError("Сервертэй холбогдсонгүй")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-3">
            <Shield className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Super Admin</h1>
          <p className="text-sm text-muted-foreground mt-1">Зуслангийн портал удирдах хэсэг</p>
        </div>

        <div className="bg-background border border-border/60 rounded-2xl shadow-xl p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Имэйл</label>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Superadmin@turees.mn"
              type="email"
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              className="w-full px-4 py-2.5 text-sm bg-muted/50 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Нууц үг</label>
            <input
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password"
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              className="w-full px-4 py-2.5 text-sm bg-muted/50 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-destructive text-xs bg-destructive/10 px-3 py-2 rounded-lg">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {error}
            </div>
          )}

          <Button onClick={handleLogin} disabled={loading} className="w-full gap-2">
            {loading
              ? <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
              : <><Shield className="h-4 w-4" /> Нэвтрэх</>
            }
          </Button>
        </div>
      </div>
    </div>
  )
}

// ── Status Badge ──────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] ?? statusConfig.pending
  return (
    <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap", cfg.color)}>
      {cfg.label}
    </span>
  )
}

// ── Action Buttons ────────────────────────────────────────────
function ActionButtons({
  id, status, onApprove, onReject, onDelete
}: {
  id: string
  status: string
  onApprove: (id: string) => void
  onReject:  (id: string) => void
  onDelete:  (id: string) => void
}) {
  return (
    <div className="flex items-center gap-1">
      {status === "pending" && (
        <>
          <button onClick={() => onApprove(id)}
            title="Зөвшөөрөх"
            className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 transition-colors">
            <CheckCircle className="h-4 w-4" />
          </button>
          <button onClick={() => onReject(id)}
            title="Татгалзах"
            className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-600 hover:bg-amber-100 transition-colors">
            <XCircle className="h-4 w-4" />
          </button>
        </>
      )}
      {status === "active" && (
        <button onClick={() => onReject(id)}
          title="Идэвхгүй болгох"
          className="p-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">
          <XCircle className="h-4 w-4" />
        </button>
      )}
      {status === "inactive" || status === "rejected" ? (
        <button onClick={() => onApprove(id)}
          title="Идэвхжүүлэх"
          className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 hover:bg-emerald-100 transition-colors">
          <CheckCircle className="h-4 w-4" />
        </button>
      ) : null}
      <button onClick={() => onDelete(id)}
        title="Устгах"
        className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}

// ── Main Dashboard ────────────────────────────────────────────
export default function AdminPage() {
  const [token,    setToken]    = useState<string | null>(null)
  const [section,  setSection]  = useState<Section>("dashboard")
  const [search,   setSearch]   = useState("")
  const [statusFilter, setStatusFilter] = useState<Status>("all")

  const [listings,  setListings]  = useState(mockListings)
  const [products,  setProducts]  = useState(mockProducts)
  const [services,  setServices]  = useState(mockServices)
  const [users,     setUsers]     = useState(mockUsers)

  useEffect(() => {
    const t = localStorage.getItem("admin_token")
    if (t) setToken(t)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("admin_token")
    localStorage.removeItem("admin_info")
    setToken(null)
  }

  // ── CRUD handlers ─────────────────────────────────────────
  const approve = (type: string, id: string) => {
    if (type === "listings") setListings(p => p.map(i => i.id === id ? { ...i, status: "active" }   : i))
    if (type === "products")  setProducts(p  => p.map(i => i.id === id ? { ...i, status: "active" }  : i))
    if (type === "services")  setServices(p  => p.map(i => i.id === id ? { ...i, status: "active" }  : i))
  }
  const reject = (type: string, id: string) => {
    if (type === "listings") setListings(p => p.map(i => i.id === id ? { ...i, status: "rejected" } : i))
    if (type === "products")  setProducts(p  => p.map(i => i.id === id ? { ...i, status: "rejected" }: i))
    if (type === "services")  setServices(p  => p.map(i => i.id === id ? { ...i, status: "rejected" }: i))
  }
  const remove = (type: string, id: string) => {
    if (window.confirm("Устгахдаа итгэлтэй байна уу?")) {
      if (type === "listings") setListings(p => p.filter(i => i.id !== id))
      if (type === "products")  setProducts(p  => p.filter(i => i.id !== id))
      if (type === "services")  setServices(p  => p.filter(i => i.id !== id))
      if (type === "users")     setUsers(p     => p.filter(i => i.id !== id))
    }
  }
  const toggleUser = (id: string) =>
    setUsers(p => p.map(i => i.id === id ? { ...i, is_active: !i.is_active } : i))

  // ── Filter ────────────────────────────────────────────────
  const filterItems = (items: any[]) => items.filter(i => {
    const q = search.toLowerCase()
    const matchSearch = !search || Object.values(i).some(v => String(v).toLowerCase().includes(q))
    const matchStatus = statusFilter === "all" || i.status === statusFilter
    return matchSearch && matchStatus
  })

  if (!token) return <AdminLogin onLogin={setToken} />

  const navItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Хянах самбар" },
    { id: "listings",  icon: Home,            label: "Зарууд",   count: listings.filter(i => i.status === "pending").length  },
    { id: "products",  icon: ShoppingBag,     label: "Дэлгүүр",  count: products.filter(i => i.status === "pending").length  },
    { id: "services",  icon: HeartHandshake,  label: "Үйлчилгээ",count: services.filter(i => i.status === "pending").length  },
    { id: "users",     icon: Users,           label: "Хэрэглэгчид" },
  ]

  const stats = [
    { label: "Нийт зар",       value: listings.length,                               icon: Home,           color: "text-primary"                          },
    { label: "Нийт бараа",     value: products.length,                               icon: ShoppingBag,    color: "text-amber-600 dark:text-amber-400"    },
    { label: "Үйлчилгээ",      value: services.length,                               icon: HeartHandshake, color: "text-emerald-600 dark:text-emerald-400" },
    { label: "Хэрэглэгч",      value: users.length,                                  icon: Users,          color: "text-violet-600 dark:text-violet-400"  },
    { label: "Хүлээгдэж байна",value: listings.filter(i=>i.status==="pending").length + products.filter(i=>i.status==="pending").length + services.filter(i=>i.status==="pending").length, icon: AlertCircle, color: "text-rose-600" },
  ]

  return (
    <div className="min-h-screen bg-muted/20 flex">

      {/* ── Sidebar ── */}
      <aside className="w-60 shrink-0 border-r border-border/60 bg-background flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border/50">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-bold">Super Admin</p>
            <p className="text-[10px] text-muted-foreground">Удирдах хэсэг</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-3">
          {navItems.map(({ id, icon: Icon, label, count }) => (
            <button key={id} onClick={() => setSection(id as Section)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-0.5",
                section === id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}>
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">{label}</span>
              {(count ?? 0) > 0 && (
                <span className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                  section === id ? "bg-white/20" : "bg-rose-500 text-white"
                )}>{count}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-border/50">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition-colors">
            <LogOut className="h-4 w-4" /> Гарах
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 bg-background">
          <h1 className="font-bold text-lg">
            {navItems.find(i => i.id === section)?.label}
          </h1>

          {section !== "dashboard" && (
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Хайх..."
                  className="pl-8 pr-4 py-2 text-xs bg-muted/60 border border-border/60 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/30 w-48"
                />
              </div>

              {/* Status filter */}
              {section !== "users" && (
                <div className="relative">
                  <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as Status)}
                    className="appearance-none pl-3 pr-7 py-2 text-xs bg-muted/60 border border-border/60 rounded-full focus:outline-none cursor-pointer">
                    <option value="all">Бүгд</option>
                    <option value="pending">Хүлээгдэж байна</option>
                    <option value="active">Идэвхтэй</option>
                    <option value="inactive">Идэвхгүй</option>
                    <option value="rejected">Татгалзсан</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6">

          {/* ── DASHBOARD ── */}
          {section === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                {stats.map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="p-4 rounded-2xl border border-border/60 bg-background text-center">
                    <Icon className={cn("h-5 w-5 mx-auto mb-2", color)} />
                    <p className={cn("text-2xl font-bold", color)}>{value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              {/* Хүлээгдэж буй */}
              <div>
                <h2 className="font-semibold mb-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-500" />
                  Шинэ хүсэлтүүд
                </h2>
                <div className="space-y-2">
                  {[
                    ...listings.filter(i => i.status === "pending").map(i => ({ ...i, type: "Зар" })),
                    ...products.filter(i => i.status === "pending").map(i => ({ ...i, type: "Бараа" })),
                    ...services.filter(i => i.status === "pending").map(i => ({ ...i, type: "Үйлчилгээ", title: i.title })),
                  ].map(item => (
                    <div key={`${item.type}-${item.id}`}
                      className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-background">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                          {item.type}
                        </span>
                        <div>
                          <p className="text-sm font-medium">{"title" in item ? item.title : (item as any).name}</p>
                          <p className="text-xs text-muted-foreground">{item.created_at}</p>
                        </div>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                  ))}
                  {listings.filter(i=>i.status==="pending").length === 0 &&
                   products.filter(i=>i.status==="pending").length  === 0 &&
                   services.filter(i=>i.status==="pending").length  === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-6">Хүлээгдэж буй хүсэлт байхгүй</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── LISTINGS ── */}
          {section === "listings" && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground mb-3">
                {filterItems(listings).length} зар
              </p>
              {filterItems(listings).map(item => (
                <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl border border-border/60 bg-background hover:border-primary/20 transition-all">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm truncate">{item.title}</p>
                      <StatusBadge status={item.status} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{item.location}</span>
                      <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{item.phone}</span>
                      <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{item.price.toLocaleString()}₮</span>
                      <span>{item.owner}</span>
                      <span>{item.created_at}</span>
                    </div>
                  </div>
                  <ActionButtons
                    id={item.id} status={item.status}
                    onApprove={id => approve("listings", id)}
                    onReject={id  => reject("listings",  id)}
                    onDelete={id  => remove("listings",  id)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* ── PRODUCTS ── */}
          {section === "products" && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground mb-3">{filterItems(products).length} бараа</p>
              {filterItems(products).map(item => (
                <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl border border-border/60 bg-background hover:border-primary/20 transition-all">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <StatusBadge status={item.status} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{item.phone}</span>
                      <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{item.price.toLocaleString()}₮</span>
                      <span>Нөөц: {item.stock}</span>
                      <span>{item.seller}</span>
                      <span>{item.created_at}</span>
                    </div>
                  </div>
                  <ActionButtons
                    id={item.id} status={item.status}
                    onApprove={id => approve("products", id)}
                    onReject={id  => reject("products",  id)}
                    onDelete={id  => remove("products",  id)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* ── SERVICES ── */}
          {section === "services" && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground mb-3">{filterItems(services).length} үйлчилгээ</p>
              {filterItems(services).map(item => (
                <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl border border-border/60 bg-background hover:border-primary/20 transition-all">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm truncate">{item.title}</p>
                      <StatusBadge status={item.status} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{item.phone}</span>
                      <span>{item.price}</span>
                      <span>{item.duration}</span>
                      <span>{item.provider}</span>
                      <span>{item.created_at}</span>
                    </div>
                  </div>
                  <ActionButtons
                    id={item.id} status={item.status}
                    onApprove={id => approve("services", id)}
                    onReject={id  => reject("services",  id)}
                    onDelete={id  => remove("services",  id)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* ── USERS ── */}
          {section === "users" && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground mb-3">{filterItems(users).length} хэрэглэгч</p>
              {filterItems(users).map(item => (
                <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl border border-border/60 bg-background hover:border-primary/20 transition-all">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-primary">
                      {item.name[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-medium text-sm">{item.name}</p>
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-medium",
                        item.is_active
                          ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground"
                      )}>
                        {item.is_active ? "Идэвхтэй" : "Хаагдсан"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{item.phone}</span>
                      <span>{item.listings} зар</span>
                      <span>{item.created_at}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => toggleUser(item.id)}
                      title={item.is_active ? "Хаах" : "Нээх"}
                      className={cn(
                        "p-1.5 rounded-lg transition-colors",
                        item.is_active
                          ? "bg-muted text-muted-foreground hover:bg-muted/80"
                          : "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 hover:bg-emerald-100"
                      )}>
                      {item.is_active ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                    </button>
                    <button onClick={() => remove("users", item.id)}
                      className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>
    </div>
  )
}

// ---

// **Нэвтрэх мэдээлэл:**
// ```
// URL:      http://localhost:3000/admin
// Имэйл:    Superadmin@turees.mn
// Нууц үг:  Muujig_ssa@2026