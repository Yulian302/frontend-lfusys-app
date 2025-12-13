import axios from "axios"
import { createContext, useContext, useEffect, useState } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (name: string, email: string, password: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get("http://localhost:8080/auth/me", {
          withCredentials: true,
        })
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
      const response = await axios.post(
        "http://localhost:8080/auth/login",
        { email, password },
        {
          withCredentials: true,
        }
      )
      if (response.status === 200) {
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
      const response = await axios.post(
        "http://localhost:8080/auth/register",
        {
          name,
          email,
          password,
        },
        { withCredentials: true }
      )
      if (response.status === 201) {
        return true
      }
    } catch (error) {
      console.log(error)
    }
    return false
  }

  const logout = async () => {
    await axios.post(
      "http://localhost:8080/auth/logout",
      {},
      { withCredentials: true }
    )
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, register, isLoading }}
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
