import ProgressBar from "@ramonak/react-progress-bar"
import type React from "react"

import { MoonLoader } from "react-spinners"
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5"
import { MdError } from "react-icons/md"

type UploadLoaderProps = {
  handleUpload: () => void
  handleRemove: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  uploading: boolean
  status: string | null
  progress: number
}

const UploadLoader = ({
  handleUpload,
  handleRemove,
  uploading,
  status,
  progress,
}: UploadLoaderProps) => {
  if (status === "pending" || status === null) {
    return (
      <div className="flex gap-2 my-1 text-white text-sm">
        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`btn_primary ${
            uploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>

        <button
          type="button"
          onClick={handleRemove}
          className="btn_primary bg-red-500 hover:bg-red-600"
        >
          Remove
        </button>
      </div>
    )
  }

  if (status === "in_progress") {
    return progress == null ? (
      <MoonLoader about="Uploading..." />
    ) : (
      <ProgressBar completed={progress} />
    )
  }

  if (status === "completed") {
    return (
      <div className="flex items-center bg-green-200 gap-1 rounded-xl px-2">
        <IoCheckmarkDoneCircleSharp size={20} color="green" />
        <span className="text-green-800 font-semibold">Upload complete!</span>
      </div>
    )
  }

  if (status === "failed") {
    return (
      <div className="flex items-center gap-1">
        <MdError size={20} color="red" />
        <span className="text-red-500 font-semibold">Upload failed!</span>
      </div>
    )
  }
}

export default UploadLoader
