import React, { useState } from "react"
import UserMenu from "./DropDown"
import ThemeToggle from "./ThemeToggle"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import AuthDialog from "./forms/AuthDialog"

const UserPanel = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate()
  const { username, logout, isAuthenticated } = useAuth()
  const [isDialogVisible, setIsLoginDialogVisible] = useState(false)
  const [isLogin, setIsLogin] = useState(true)

  const handleLogout = async () => {
    try {
      await logout()
      navigate("/")
    } catch (error) {
      console.log("Logout failed:", error)
    }
  }

  const openAuthDialog = () => {
    setIsLoginDialogVisible(true)
  }

  const changeAuthDialog = () => {
    setIsLogin((prev) => !prev)
  }

  return (
    <div className="flex flex-col min-h-screen min-w-screen">
      <header className="text-(--reverse) top-0 left-0 right-0 h-24 sm:h-12 w-full flex items-center justify-between px-4 z-10 bg-(--bg) shadow-md">
        <span>Welcome, {username ? username : "Guest"}</span>
        <div className="flex items-center justify-between gap-4">
          <ThemeToggle />
          <UserMenu
            logout={handleLogout}
            isAuthenticated={isAuthenticated}
            openLoginDialog={openAuthDialog}
          />
          <AuthDialog
            isOpen={isDialogVisible}
            onClose={() => setIsLoginDialogVisible(false)}
            isLogin={isLogin}
            changeAuthType={changeAuthDialog}
          />
        </div>
      </header>

      <main className="flex-1 flex items-center">{children}</main>
    </div>
  )
}

export default UserPanel
