import React, { createContext, useEffect, useState } from "react"

type Theme = "light" | "dark"

const defaultTheme: Theme = "light"

const ThemeContext = createContext({
  theme: defaultTheme,
  toggle: () => {},
} as { theme: Theme; toggle: () => void })

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem("theme") as Theme | null
      if (saved) return saved
    } catch (error) {
      console.log(error)
    }
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
    }
    return defaultTheme
  })

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    try {
      localStorage.setItem("theme", theme)
    } catch (error) {
      console.log(error)
    }
  }, [theme])

  const toggle = () => setTheme((s) => (s === "light" ? "dark" : "light"))

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeContext
