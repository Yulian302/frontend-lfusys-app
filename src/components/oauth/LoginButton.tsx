import type React from "react"
import { FaSpinner } from "react-icons/fa"

type LoginButtonProps = {
  title: string
  Icon: React.ReactNode
  handleClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  styles: string
  isLoading: boolean
  isDisabled: boolean
}

const LoginButton = ({
  title,
  Icon,
  handleClick,
  styles,
  isLoading,
  isDisabled,
}: LoginButtonProps) => {
  return (
    <button
      className={`relative text-white flex items-center gap-2 ${styles} rounded-full px-4 py-2 hover:brightness-70 hover:scale-105 ease-in-out cursor-pointer disabled:cursor-not-allowed disabled:opacity-80`}
      type="button"
      onClick={handleClick}
      disabled={isLoading || isDisabled}
    >
      <span className={"flex items-center gap-2"}>
        <span className={`${isLoading ? "invisible" : "font-semibold"}`}>
          {title}
        </span>
        <span className={`${isLoading ? "invisible" : "font-semibold"}`}>
          {Icon}
        </span>
      </span>

      {/* Spinner overlay */}
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <FaSpinner className="animate-spin text-white" />
        </span>
      )}
    </button>
  )
}

export default LoginButton
