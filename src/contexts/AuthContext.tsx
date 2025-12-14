import { createContext, useContext, useEffect, useState } from "react"
import api from "../api/client"

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  username: string
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (name: string, email: string, password: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [username, setUsername] = useState("")

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/auth/me")
        setUsername(response.data.username)

        setIsAuthenticated(true)
      } catch {
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password })
      if (response.status === 200) {
        const meResponse = await api.get("/auth/me")
        setUsername(meResponse.data.username)
        setIsAuthenticated(true)
        return true
      }
    } catch (error) {
      console.error("Login failed:", error)
    }
    return false
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      })
      if (response.status === 201) {
        return true
      }
    } catch (error) {
      console.log(error)
    }
    return false
  }

  const logout = async () => {
    await api.post("/auth/logout", {})
    setIsAuthenticated(false)
    setUsername("")
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, register, isLoading, username }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within auth provider")
  return context
}
