import React from "react"

const FormTemplate = ({
  children,
  onSubmit,
}: {
  children: React.ReactNode
  onSubmit: (e: React.FormEvent) => void
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 w-full self-center text-2xl sm:md:text-lg">
      <form
        className="text-(--reverse) sm:text-(--text) w-full max-w-md bg-none sm:bg-white sm:shadow-[0_2px_4px_rgba(0,0,0,0.1)] sm:border sm:border-gray-100 rounded sm:px-8 sm:pt-6 sm:pb-8 mb-4"
        onSubmit={onSubmit}
      >
        {children}
      </form>
      <p className="text-center text-gray-500 text-xs">
        &copy;2026 LFU Sys. All rights reserved.
      </p>
    </div>
  )
}

export default FormTemplate
