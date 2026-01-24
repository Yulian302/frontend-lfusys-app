import React from "react"

const FormTemplate = ({
  children,
  onSubmit,
}: {
  children: React.ReactNode
  onSubmit: (e: React.FormEvent) => void
}) => {
  return (
    <div className="flex flex-col items-center justify-center px-4 w-full self-center text-2xl sm:md:text-lg">
      <form
        className="text-(--reverse) w-full max-w-md rounded sm:px-8 sm:pt-6 sm:pb-8"
        onSubmit={onSubmit}
      >
        {children}
      </form>
    </div>
  )
}

export default FormTemplate
