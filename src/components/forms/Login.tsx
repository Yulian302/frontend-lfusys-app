import { useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"

import { handleError } from "../../api/errors"
import FormTemplate from "./FormTemplate"
import OAuth from "./OAuth"
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
    <FormTemplate onSubmit={handleSubmit(onSubmit)}>
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
      <div className="flex flex-col gap-2 sm:flex-row items-center justify-between">
        <button
          className={`bg-blue-500 ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }
            btn_primary hover:bg-blue-500/10`}
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <div className="text-base">
          <Link className="text-blue-500 hover:text-blue-800" to={"/register"}>
            Don't have an account? Sign Up
          </Link>
        </div>
      </div>
      <div className="relative flex items-center my-5">
        <div className="grow border-t border-gray-300"></div>
        <span className="mx-4 text-gray-500 text-sm">or</span>
        <div className="grow border-t border-gray-300"></div>
      </div>
      <OAuth />
    </FormTemplate>
  )
}

export default LoginForm
