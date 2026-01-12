import React, { useRef, useState, useEffect } from "react"
import UploadLoader from "./UploadLoader"

type Props = {
  onUpload?: (
    file: File,
    onProgress?: (p: number) => void
  ) => Promise<void> | void
  isUploading?: boolean
  status: string | null
  setStatus: (s: string | null) => void
}

export default function UploadForm({
  onUpload,
  isUploading,
  status,
  setStatus,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null)
      return
    }
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setPreviewUrl(null)
    }
  }, [file])

  useEffect(() => {
    if (isUploading) setUploading(true)
    else if (!isUploading) setUploading(false)
  }, [isUploading])

  function openFilePicker() {
    inputRef.current?.click()
  }

  function handleFiles(files: FileList | null) {
    setError(null)

    if (!files || files.length === 0) return
    setFile(files[0])
    setProgress(0)
    setStatus(null)
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleFiles(e.target.files)
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  function onDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    if (!dragActive) setDragActive(true)
  }

  function onDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  async function handleUpload() {
    if (!file) return
    setError(null)
    setUploading(true)
    setProgress(0)
    try {
      if (onUpload) {
        await onUpload(file, (p) => setProgress(Math.round(p)))
      } else {
        await new Promise<void>((resolve) => {
          let p = 0
          const t = setInterval(() => {
            p += Math.random() * 20
            setProgress(Math.min(100, Math.round(p)))
            if (p >= 100) {
              clearInterval(t)
              resolve()
            }
          }, 200)
        })
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.message || "Upload failed")
    } finally {
      setUploading(false)

      if (inputRef.current) {
        inputRef.current.value = ""
      }
    }
  }

  function handleRemove(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation()

    if (inputRef.current) {
      inputRef.current.value = ""
    }

    setFile(null)
    setProgress(0)
    setError(null)
  }

  function humanFileSize(bytes: number) {
    if (bytes === 0) return "0 B"
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return (
      (bytes / Math.pow(1024, i)).toFixed(i ? 1 : 0) +
      " " +
      ["B", "KB", "MB", "GB", "TB"][i]
    )
  }

  return (
    <div className="max-w-xl mx-auto self-center">
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={onInputChange}
        aria-hidden
        disabled={uploading}
      />

      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`border-2 rounded-lg p-6 flex items-center gap-4 transition-colors ${
          dragActive
            ? "border-blue-400 bg-blue-50"
            : "border-dashed border-gray-300 bg-white"
        }`}
        role="button"
        onClick={openFilePicker}
      >
        <div className="shrink-0">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12"
            />
            <path
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 20h10M12 14v6"
            />
          </svg>
        </div>

        <div className="flex-1">
          <div className="text-sm text-gray-600">
            {dragActive
              ? "Drop file here to attach"
              : "Drag & drop a file here, or click to browse"}
          </div>
          <div className="mt-2 text-xs text-gray-400">
            Supports single file upload. Image preview shown for images.
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              openFilePicker()
            }}
            className="px-3 py-1.5 bg-(--primary) text-sm rounded border cursor-pointer"
          >
            Browse
          </button>
        </div>
      </div>

      {file && (
        <div className="mt-4 border rounded-lg p-4 bg-gray-50">
          <div className="flex gap-4">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt={file.name}
                className="w-24 h-24 object-cover rounded"
              />
            ) : (
              <div className="w-24 h-24 flex items-center justify-center rounded bg-white border text-gray-500">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7"
                  />
                  <path
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 3h8l1 4H7l1-4z"
                  />
                </svg>
              </div>
            )}

            <div className="flex-1">
              <div className="font-medium text-(--primary)">{file.name}</div>
              <div className="text-sm text-gray-500">
                {file.type || "Unknown type"}
              </div>
              <div className="text-sm text-gray-500">
                {humanFileSize(file.size)} •{" "}
                {new Date(file.lastModified).toLocaleString()}
              </div>

              {error && (
                <div className="mt-2 text-sm text-red-600">{error}</div>
              )}

              <div className="">
                <UploadLoader
                  handleUpload={handleUpload}
                  uploading={uploading}
                  handleRemove={handleRemove}
                  progress={progress}
                  status={status}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
