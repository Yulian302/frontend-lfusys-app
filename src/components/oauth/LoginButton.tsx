import type React from "react"

type LoginButtonProps = {
  title: string
  Icon: React.ReactNode
  handleClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  styles: string
}

const LoginButton = ({
  title,
  Icon,
  handleClick,
  styles,
}: LoginButtonProps) => {
  return (
    <button
      className={`text-white flex items-center gap-2 ${styles} rounded-full px-4 py-2 hover:brightness-70 hover:scale-105 ease-in-out cursor-pointer`}
      type="button"
      onClick={handleClick}
    >
      <span className="font-semibold">{title}</span>
      {Icon}
    </button>
  )
}

export default LoginButton
