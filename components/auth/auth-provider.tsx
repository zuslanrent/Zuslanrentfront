"use client"

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react"
import type { AuthUser } from "./auth-modal"

interface AuthContextType {
  user: AuthUser | null
  login:  (user: AuthUser) => void
  logout: () => void
  isLoggedIn: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null, login: () => {}, logout: () => {}, isLoggedIn: false,
})

export const useAuth = () => useContext(AuthContext)

const TIMEOUT_MS = 5 * 60 * 1000 // 5 минут

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const timerRef        = useRef<NodeJS.Timeout | null>(null)

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem("auth_user")
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_expires")
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(logout, TIMEOUT_MS)
  }, [logout])

  const login = useCallback((u: AuthUser) => {
    setUser(u)
    resetTimer()
  }, [resetTimer])

  // Хуудас дахин ачаалахад session шалгах
  useEffect(() => {
    const stored    = localStorage.getItem("auth_user")
    const expires   = localStorage.getItem("auth_expires")

    if (stored && expires) {
      const isValid = new Date(expires) > new Date()
      if (isValid) {
        setUser(JSON.parse(stored))
        resetTimer()
      } else {
        logout()
      }
    }
  }, [logout, resetTimer])

  // Хэрэглэгч идэвхтэй байвал таймер reset
  useEffect(() => {
    if (!user) return
    const events = ["mousedown", "keydown", "scroll", "touchstart"]
    events.forEach(e => window.addEventListener(e, resetTimer))
    return () => events.forEach(e => window.removeEventListener(e, resetTimer))
  }, [user, resetTimer])

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}