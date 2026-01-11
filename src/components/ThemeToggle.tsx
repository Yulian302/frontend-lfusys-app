import { useContext } from "react"
import ThemeContext from "../contexts/ThemeContext"

import { MdDarkMode, MdLightMode } from "react-icons/md"

const ThemeToggle = () => {
  const { theme, toggle } = useContext(ThemeContext)

  return (
    <div
      className="text-(--reverse) bg-transparent border-none cursor-pointer scale-150 sm:scale-100"
      aria-label="Toggle theme"
      onClick={toggle}
    >
      {theme === "light" ? <MdDarkMode size={20} /> : <MdLightMode size={20} />}
    </div>
  )
}

export default ThemeToggle
