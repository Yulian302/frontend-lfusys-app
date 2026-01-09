import { useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"

import { handleError } from "../../api/errors"
import {
  CheckBoxField,
  ErrorField,
  InputField,
  type LoginFormIF,
} from "./Shared"

const LoginForm = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  const { login } = useAuth()

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      "Show Password": false,
    },
  })

  const onSubmit: SubmitHandler<LoginFormIF> = async (data) => {
    setError(undefined)
    try {
      setLoading(true)
      const isLoggedIn = await login(data.email, data.password)
      if (isLoggedIn) {
        navigate("/upload")
      }
    } catch (err: unknown) {
      handleError(err, setError)
    } finally {
      setLoading(false)
    }
  }

  const showPassword = watch("Show Password")

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full self-center">
      <form
        className="w-full max-w-md bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)] border border-gray-100 rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <ErrorField error={error} />

        <InputField
          label="email"
          placeholder="Email"
          register={register}
          required={{ value: true, message: "Email is required" }}
          minLength={{
            value: 8,
            message: "Email must be at least 8 chars long",
          }}
          maxLength={{
            value: 80,
            message: "Email is too long. Please provide a shorter value",
          }}
          error={errors.email}
        />
        <ErrorField error={errors.email} />

        <InputField
          label="password"
          placeholder="******************"
          register={register}
          required={{ value: true, message: "Password is required" }}
          minLength={{
            value: 8,
            message: "Password must be 8-20 chars long",
          }}
          maxLength={{
            value: 20,
            message: "Password must be 8-20 chars long",
          }}
          error={errors.password}
          type={showPassword ? "text" : "password"}
        />
        <ErrorField error={errors.password} />

        <CheckBoxField label="Show Password" register={register} />

        <div className="flex items-center justify-between">
          <button
            className={`bg-blue-500 ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }
            font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
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
