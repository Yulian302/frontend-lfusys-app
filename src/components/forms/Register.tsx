import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"

const RegisterForm = () => {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")
  const [repeatPass, setRepeatPass] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, login } = useAuth()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)

    if (pass !== repeatPass) {
      setError("Passwords do not match")
      return
    }

    try {
      setLoading(true)
      const isRegistered = await register(name, email, pass)
      if (!isRegistered) {
        setError("Registration failed. Please try again.")
        return
      }

      const isLoggedIn = await login(email, pass)
      if (isLoggedIn) {
        navigate("/upload")
      } else {
        setError("Registered but login failed. Please login manually.")
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
            htmlFor="username"
          >
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            minLength={8}
            required
            placeholder="Username"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
          />
        </div>
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
        <div>
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
              setPass(e.target.value)
            }
          />
        </div>
        <div>
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="repeatPassword"
          >
            Repeat Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="repeatPassword"
            type="password"
            minLength={8}
            required
            placeholder="******************"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setRepeatPass(e.target.value)
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
            {loading ? "Registering..." : "Register"}
          </button>
          <div className="text-sm">
            <Link
              to="/login"
              className="font-bold text-blue-500 hover:text-blue-800"
            >
              Back to login
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

export default RegisterForm
