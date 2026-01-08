import { isAxiosError } from "axios"
import { createContext, useContext, useEffect, useState } from "react"
import { gateApi } from "../api/client"

import { retry } from "../api/retry"

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
        const response = await gateApi.get("/auth/me")
        setUsername(response.data.username)
        setIsAuthenticated(true)
      } catch (error: unknown) {
        if (
          isAxiosError(error) &&
          error.response?.status === 401 &&
          error.response?.data?.message?.includes("token_expired")
        ) {
          try {
            await gateApi.post("/auth/refresh")

            const retryResponse = await gateApi.get("/auth/me")
            setUsername(retryResponse.data.username)
            setIsAuthenticated(true)
          } catch (refreshError) {
            console.log("Refresh failed:", refreshError)
            setIsAuthenticated(false)
          }
        }
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const response = await retry(
      () => gateApi.post("/auth/login", { email, password }),
      { maxAttempts: 3, delayMs: 300 }
    )
    if (response.status === 200) {
      const meResponse = await gateApi.get("/auth/me")
      setUsername(meResponse.data.username)
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  const register = async (name: string, email: string, password: string) => {
    const response = await retry(
      () =>
        gateApi.post("/auth/register", {
          name,
          email,
          password,
        }),
      {
        maxAttempts: 3,
        delayMs: 300,
      }
    )
    if (response.status === 201) {
      return true
    }
    return false
  }

  const logout = async () => {
    await gateApi.post("/auth/logout", {})
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
