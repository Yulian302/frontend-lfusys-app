import React, { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"

const LoginForm = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { login } = useAuth()

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    try {
      setLoading(true)
      const isLoggedIn = await login(email, password)
      if (isLoggedIn) {
        navigate("/upload")
      } else {
        setError("Invalid credentials. Please check your email and password.")
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.message ?? "Network error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <form
        className="w-full max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={handleSubmit}
      >
        {error && (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-4 text-red-700 bg-red-100 border border-red-200 p-3 rounded"
          >
            {error}
          </div>
        )}

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            minLength={8}
            required
            placeholder="Email"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            minLength={8}
            required
            placeholder="******************"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            className={`bg-blue-500 ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            } font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
          <div className="text-sm">
            <Link
              className="font-bold text-blue-500 hover:text-blue-800"
              to={"/register"}
            >
              Don't have an account? Sign Up
            </Link>
          </div>
        </div>
      </form>
      <p className="text-center text-gray-500 text-xs">
        &copy;2025 LFU Sys. All rights reserved.
      </p>
    </div>
  )
}

export default LoginForm
