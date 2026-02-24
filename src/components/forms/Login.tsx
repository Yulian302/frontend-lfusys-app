import { useEffect } from "react"
import { useForm, type FieldError, type SubmitHandler } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"

import { handleError } from "../../api/errors"
import FormTemplate from "./FormTemplate"
import {
  CheckBoxField,
  ErrorField,
  InputField,
  type LoginFormIF,
} from "./Shared"

type LoginFormProps = {
  error?: string | FieldError
  setError: (err?: string) => void
  isLoading: boolean
  setIsLoading: (val: boolean) => void
  activeProvider: "github" | "google" | null
  setActiveProvider: (prov: "github" | "google" | null) => void
}

const LoginForm = ({
  error,
  setError,
  isLoading,
  setIsLoading,
  activeProvider,
  setActiveProvider,
}: LoginFormProps) => {
  const navigate = useNavigate()

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
    setActiveProvider(null)
    setIsLoading(true)

    try {
      const isLoggedIn = await login(data.email, data.password)
      if (isLoggedIn) {
        navigate("/upload")
      }
    } catch (err: unknown) {
      handleError(err, setError)
    } finally {
      setIsLoading(false)
    }
  }

  const showPassword = watch("Show Password")

  useEffect(() => {
    return () => {
      setError(undefined)
    }
  }, [setError])

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
            isLoading ? "opacity-80 cursor-not-allowed" : "hover:bg-blue-700"
          }
            btn_primary hover:bg-blue-500/10`}
          type="submit"
          disabled={isLoading}
        >
          {isLoading && activeProvider === null ? "Signing in..." : "Sign In"}
        </button>
      </div>
    </FormTemplate>
  )
}

export default LoginForm
