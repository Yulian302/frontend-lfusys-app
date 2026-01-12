import React from "react"
import UserMenu from "./DropDown"
import ThemeToggle from "./ThemeToggle"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

const UserPanel = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate()
  const { username, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      navigate("/login")
    } catch (error) {
      console.log("Logout failed:", error)
    }
  }

  return (
    <div className="flex flex-col min-h-screen min-w-screen">
      <header className="text-(--reverse) top-0 left-0 right-0 h-24 sm:h-12 w-full flex items-center justify-between px-4 z-10 bg-(--bg) shadow-md">
        <span>
          {username && "Welcome, "}
          {username}
        </span>
        <div className="flex items-center justify-between gap-4">
          <ThemeToggle />
          {username && <UserMenu logout={handleLogout} />}
        </div>
      </header>

      <main className="flex-1 flex items-center">{children}</main>
    </div>
  )
}

export default UserPanel
