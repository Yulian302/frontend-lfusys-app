import React from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const UserPanel = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate()
  const { logout, username } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      navigate("/login")
    } catch (error) {
      console.log("Logout failed:", error)
    }
  }

  return (
    <div className="">
      <header className="fixed top-0 left-0 h-12 bg-amber-700 w-full flex items-center justify-between px-4 z-10">
        <span>Welcome, {username}</span>
        <button
          className="text-white hover:text-amber-100 transition-colors"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>
      <main className="flex justify-center items-center">{children}</main>
    </div>
  )
}

export default UserPanel
