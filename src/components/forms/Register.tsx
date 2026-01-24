import { useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { handleError } from "../../api/errors"
import { useAuth } from "../../contexts/AuthContext"
import FormTemplate from "./FormTemplate"
import {
  CheckBoxField,
  ErrorField,
  InputField,
  type RegisterFormIF,
} from "./Shared"

const RegisterForm = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  const { register: signup, login } = useAuth()

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      "Repeat Password": "",
      "Show Password": "",
    },
  })

  const onSubmit: SubmitHandler<RegisterFormIF> = async (data) => {
    setError(undefined)

    try {
      setLoading(true)
      const isRegistered = await signup(data.name, data.email, data.password)
      if (!isRegistered) {
        setError("Registration failed. Please try again.")
        return
      }

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

  const password = watch("password")
  const showPassword = watch("Show Password")

  return (
    <FormTemplate onSubmit={handleSubmit(onSubmit)}>
      <ErrorField error={error} />
      <InputField
        label="name"
        placeholder="Username"
        register={register}
        required={{ value: true, message: "Username is required" }}
        minLength={{
          value: 5,
          message: "Username must be at least 5 chars long",
        }}
        maxLength={{
          value: 30,
          message: "Username is too long. Please provide a shorter value",
        }}
        error={errors.name}
      />
      <ErrorField error={errors.name} />

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

      {password && (
        <>
          <InputField
            label="Repeat Password"
            placeholder="repeat password"
            register={register}
            required={{ value: true, message: "Passwords must match" }}
            error={errors.password}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            validate={(value: any) =>
              value === password || "Passwords do not match"
            }
            type={showPassword ? "text" : "password"}
          />
          <ErrorField error={errors["Repeat Password"]} />
        </>
      )}

      <div className="flex flex-col gap-2 sm:flex-row items-center justify-between">
        <button
          className={`bg-blue-500 ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }
            btn_primary hover:bg-blue-500/10`}
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </div>
    </FormTemplate>
  )
}

export default RegisterForm
