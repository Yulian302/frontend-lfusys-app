import { createContext } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  username: string
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (name: string, email: string, password: string) => Promise<boolean>
}

export const AuthContext = createContext<AuthContextType | null>(null)
