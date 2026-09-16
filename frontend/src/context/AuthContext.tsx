import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { getMe } from "../lib/api"

type User = { id: number; email: string; role: string }

type AuthState = {
  user: User | null
  token: string | null
  loading: boolean
  login: (token: string, user: User) => void
  logout: () => void
  refresh: () => Promise<void>
}

const Ctx = createContext<AuthState>(null as any)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("sinapsa_token"))
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    const t = localStorage.getItem("sinapsa_token")
    if (!t) {
      setUser(null)
      setLoading(false)
      return
    }
    try {
      const data = await getMe()
      setUser(data.user)
      setToken(t)
    } catch {
      localStorage.removeItem("sinapsa_token")
      localStorage.removeItem("sinapsa_user")
      setUser(null)
      setToken(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // cargo user cache para pintar rápido
    const cached = localStorage.getItem("sinapsa_user")
    if (cached) {
      try { setUser(JSON.parse(cached)) } catch {}
    }
    refresh()
  }, [])

  const login = (tok: string, u: User) => {
    localStorage.setItem("sinapsa_token", tok)
    localStorage.setItem("sinapsa_user", JSON.stringify(u))
    setToken(tok)
    setUser(u)
  }

  const logout = () => {
    localStorage.removeItem("sinapsa_token")
    localStorage.removeItem("sinapsa_user")
    setUser(null)
    setToken(null)
  }

  return <Ctx.Provider value={{ user, token, loading, login, logout, refresh }}>{children}</Ctx.Provider>
}

export function useAuth() {
  return useContext(Ctx)
}
