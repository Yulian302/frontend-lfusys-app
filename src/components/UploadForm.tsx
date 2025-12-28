import { useRef } from "react"
import { ClipLoader } from "react-spinners"

interface UploadFormProps {
  startUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  isUploading: boolean
}

const UploadForm = ({ startUpload, isUploading }: UploadFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const handleUpload = () => {
    if (fileInputRef.current) {
      const event = {
        target: fileInputRef.current,
      } as React.ChangeEvent<HTMLInputElement>
      startUpload(event)
    }
  }
  return (
    <div className="flex items-center justify-center w-full">
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full h-64 bg-(--secondary) border border-dashed border-default-strong rounded-base cursor-pointer hover:bg-[color-mix(in_srgb,var(--secondary)_90%,black)]"
      >
        {isUploading ? (
          <ClipLoader color="black" />
        ) : (
          <div className="flex flex-col items-center justify-center text-body pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h3a3 3 0 0 0 0-6h-.025a5.56 5.56 0 0 0 .025-.5A5.5 5.5 0 0 0 7.207 9.021C7.137 9.017 7.071 9 7 9a4 4 0 1 0 0 8h2.167M12 19v-9m0 0-2 2m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs">Any file type (MAX. 10GB)</p>
          </div>
        )}
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          ref={fileInputRef}
        />
        <button onClick={handleUpload}>Upload</button>
      </label>
    </div>
  )
}

export default UploadForm
