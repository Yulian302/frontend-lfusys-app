import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const AuthRedirect = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <div>Loading...</div>
  if (isAuthenticated) return <Navigate to="/upload" replace />

  return <>{children}</>
}

export default AuthRedirect
