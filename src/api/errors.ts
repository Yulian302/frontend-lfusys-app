import { isAxiosError } from "axios"

export const handleError = (err: unknown, setError: (msg: string) => void) => {
  if (isAxiosError(err)) {
    if (err.response) {
      switch (err.response.status) {
        case 400:
          setError("Bad request. Please check your input.")
          break
        case 401:
          setError("Invalid credentials. Please check your email and password.")
          break
        case 403:
          setError("Access forbidden. You don't have permission.")
          break
        case 404:
          setError("API endpoint not found.")
          break
        case 409:
          setError("User already exists.")
          break
        case 429:
          setError("Too many attempts. Please try again later.")
          break
        case 500:
        case 502:
        case 503:
        case 504:
          setError("Server error. Please try again later.")
          break
        default:
          setError(
            `Error ${err.response.status}: ${
              err.response.data?.message || "Unknown error"
            }`
          )
      }
    } else if (err.request) {
      setError("Network error. Please check your internet connection.")
    } else {
      setError("Request error. Please try again.")
    }
  } else {
    setError("An unexpected error occurred. Please try again.")
  }
}
