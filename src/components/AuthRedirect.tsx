import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { SquareLoader } from "react-spinners"

const AuthRedirect = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading)
    return (
      <div className="w-full h-screen text-(--reverse) flex justify-center items-center gap-2">
        Loading... <SquareLoader color="var(--reverse)" />
      </div>
    )
  if (isAuthenticated) return <Navigate to="/upload" replace />

  return <>{children}</>
}

export default AuthRedirect
