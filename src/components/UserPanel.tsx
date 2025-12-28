import React from "react"
import DropDown from "./DropDown"
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
    <div className="w-full h-full">
      <header className="fixed top-0 left-0 h-12 w-full flex items-center justify-between px-4 z-10 bg-(--bg) shadow-md">
        <span>
          {username && "Welcome, "}
          {username}
        </span>
        <div className="flex items-center justify-between gap-4">
          <ThemeToggle />
          <DropDown logout={handleLogout} />
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}

export default UserPanel
