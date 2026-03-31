"use client"

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react"
import type { AuthUser } from "./auth-modal"

interface AuthContextType {
  user:       AuthUser | null
  token:      string | null
  login:      (user: AuthUser) => void  // ← зөвхөн нэг параметр
  logout:     () => void
  isLoggedIn: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null, token: null, login: () => {}, logout: () => {}, isLoggedIn: false,
})

export const useAuth = () => useContext(AuthContext)

const TIMEOUT_MS = 5 * 60 * 1000

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,  setUser]  = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
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
  const tkn = u.token
  setUser(u)
  setToken(tkn)
  localStorage.setItem("auth_user",    JSON.stringify(u))
  localStorage.setItem("auth_token",   tkn)
  localStorage.setItem("auth_expires", new Date(Date.now() + TIMEOUT_MS).toISOString())
  resetTimer()
}, [resetTimer])

  // Хуудас дахин ачаалахад session шалгах
  useEffect(() => {
    const stored  = localStorage.getItem("auth_user")
    const tkn     = localStorage.getItem("auth_token")
    const expires = localStorage.getItem("auth_expires")

    if (stored && tkn && expires) {
      const isValid = new Date(expires) > new Date()
      if (isValid) {
        setUser(JSON.parse(stored))
        setToken(tkn)
        resetTimer()
      } else {
        logout()
      }
    }
  }, [logout, resetTimer])

  // Идэвхтэй байвал таймер reset
  useEffect(() => {
    if (!user) return
    const events = ["mousedown", "keydown", "scroll", "touchstart"]
    events.forEach(e => window.addEventListener(e, resetTimer))
    return () => events.forEach(e => window.removeEventListener(e, resetTimer))
  }, [user, resetTimer])

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}