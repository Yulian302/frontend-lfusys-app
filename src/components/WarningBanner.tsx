import { useEffect } from "react"

type Props = {
  message: string
  visible: boolean
  onClose: () => void
  duration?: number
}

export default function WarningBanner({
  message,
  visible,
  onClose,
  duration = 5000,
}: Props) {
  useEffect(() => {
    if (!visible) return

    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [visible, duration, onClose])

  if (!visible) return null

  return (
    <div
      className="
        fixed top-0 left-0 right-0 z-50
        flex justify-center items-center
        bg-yellow-400 text-black font-medium
        shadow-lg py-3 px-6
        transition-transform transform
        animate-slide-down
      "
    >
      <span className="text-sm">{message}</span>
    </div>
  )
}
