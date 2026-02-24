import { isAxiosError } from "axios"

export const handleError = (
  err: unknown,
  setError: (msg: string) => void,
  options?: {
    logError?: boolean
    defaultMessage?: string
  },
) => {
  const {
    logError = true,
    defaultMessage = "An unexpected error occurred. Please try again.",
  } = options || {}

  if (logError) {
    console.error("Error caught:", {
      error: err,
      type: isAxiosError(err) ? "AxiosError" : typeof err,
      timestamp: new Date().toISOString(),
    })
  }

  if (!isAxiosError(err)) {
    setError(defaultMessage)
    return
  }

  // Response received from server (4xx/5xx)
  if (err.response) {
    const status = err.response.status
    const serverMessageRaw = err.response.data?.error
    let serverMessage = `Error ${err.response?.status}`
    if (serverMessageRaw?.trim()) {
      serverMessage =
        serverMessageRaw.charAt(0).toUpperCase() + serverMessageRaw.slice(1)
    }
    setError(serverMessage)

    switch (status) {
      case 400:
        setError(serverMessage || "Bad request. Please check your input.")
        break
      case 401:
        setError(
          serverMessage ||
            "Invalid credentials. Please check your email and password.",
        )
        break
      case 403:
        setError(
          serverMessage || "Access forbidden. You don't have permission.",
        )
        break
      case 404:
        setError(serverMessage || "Resource not found.")
        break
      case 409:
        setError(serverMessage || "User already exists.")
        break
      case 422:
        setError(serverMessage || "Validation failed. Please check your input.")
        break
      case 429:
        setError(serverMessage || "Too many attempts. Please try again later.")
        break
      case 500:
      case 502:
      case 503:
      case 504:
        setError(getServerErrorMessage(status))
        break
      default:
        setError(serverMessage || `Error ${status}. Please try again.`)
    }
    return
  }

  // Request was made but no response received
  if (err.request) {
    if (err.code === "ECONNABORTED") {
      setError("Request timed out. The server might be busy. Please try again.")
      return
    }

    // Network error (DNS, connection refused, etc.)
    if (err.code === "ERR_NETWORK") {
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        setError(
          "No internet connection. Please check your network and try again.",
        )
      } else {
        setError(
          "Unable to reach our servers. They might be down or undergoing maintenance.",
        )
      }
      return
    }

    setError("Network error. Please check your connection and try again.")
    return
  }

  setError(defaultMessage)
}

const getServerErrorMessage = (status: number): string => {
  switch (status) {
    case 503:
      return "Service temporarily unavailable. We'll be back soon!"
    case 504:
      return "Gateway timeout. Our servers might be overloaded. Please try again."
    default:
      return `Server error (${status}). Our team has been notified.`
  }
}
