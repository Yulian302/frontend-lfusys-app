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
    <div className="flex flex-col">
      <p>Upload a file</p>
      <input type="file" ref={fileInputRef} />
      <p>Number of chunks: </p>
      <p>Urls: </p>
      {isUploading ? (
        <span>
          Uploading
          <ClipLoader color="white" />
        </span>
      ) : (
        <button onClick={handleUpload}>Upload</button>
      )}
    </div>
  )
}

export default UploadForm
