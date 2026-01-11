import clsx from "clsx"
import type {
  FieldError,
  Path,
  UseFormRegister,
  ValidationRule,
} from "react-hook-form"

import { VscError } from "react-icons/vsc"

interface BaseForm {
  email: string
  password: string
}

export type LoginFormIF = {} & BaseForm

export type ExtraFormIF = {
  showPassword: boolean
}

export type RegisterFormIF = {
  name: string
  "Repeat Password": string
} & BaseForm

interface InputProps<T extends LoginFormIF | RegisterFormIF | ExtraFormIF> {
  label: Path<T>
  register: UseFormRegister<T>
  required?: string | ValidationRule<boolean>
  minLength?: ValidationRule<number>
  maxLength?: ValidationRule<number>
  type?: string
  placeholder?: string
  error?: FieldError
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validate?: any
}

export function InputField<T extends LoginFormIF | RegisterFormIF>({
  label,
  register,
  required,
  minLength,
  maxLength,
  type,
  placeholder,
  error,
  validate,
}: InputProps<T>) {
  return (
    <div className="mb-4">
      <label className="block font-semibold mb-2">
        {label.charAt(0).toUpperCase() + label.slice(1)}
      </label>
      <input
        className={clsx(
          "shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline",
          error && "border border-red-700",
          error && "border-l-4 border-l-red-500 pl-3 rounded",
          "focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
        )}
        id={label}
        type={type}
        placeholder={placeholder}
        {...register(label, {
          required,
          minLength,
          maxLength,
          validate,
        })}
        aria-invalid={error ? "true" : "false"}
      />
    </div>
  )
}

export function CheckBoxField<
  T extends LoginFormIF | RegisterFormIF | ExtraFormIF
>({ label, required, register }: InputProps<T>) {
  return (
    <div className="text-lg flex items-center gap-2 mb-2">
      <input
        type="checkbox"
        {...register(label, {
          required,
        })}
        className="size-5 sm:size-4"
      />
      <label>{label}</label>
    </div>
  )
}

export function ErrorField({ error }: { error?: FieldError | string }) {
  if (!error) return null

  if (typeof error === "string") {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="text-sm font-light mb-4 text-red-700 bg-red-100 border border-red-200 p-3 rounded"
      >
        {error}
      </div>
    )
  }

  return (
    <div className="flex items-center text-red-500 text-sm font-light my-2 gap-1">
      <VscError size={15} color="red" />
      <p>{error?.message}</p>
    </div>
  )
}
