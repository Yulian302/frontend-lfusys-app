import ProgressBar from "@ramonak/react-progress-bar"
import type React from "react"
import { MoonLoader } from "react-spinners"

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
      <>
        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`px-4 py-2 rounded text-sm ${
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
          className="px-3 py-1.5 text-sm rounded border"
        >
          Remove
        </button>
      </>
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
    return <span>Upload complete!</span>
  }

  if (status === "failed") {
    return <span>Upload failed!</span>
  }
}

export default UploadLoader
