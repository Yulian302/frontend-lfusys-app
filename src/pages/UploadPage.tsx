import { type AxiosResponse } from "axios"
import { useState } from "react"
import { gateApi, uploadsApi } from "../api/client"
import UploadForm from "../components/UploadForm"
import UserPanel from "../components/UserPanel"

async function hashChunk(chunk: Blob): Promise<string> {
  const buffer = await chunk.arrayBuffer()

  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer)

  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")

  return hashHex
}

const UploadPage = () => {
  const [isUploading, setIsUploading] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  const startUpload = async (file: File, onProgress?: (p: number) => void) => {
    if (isUploading) return
    setIsUploading(true)

    try {
      const uploadRequest: UploadSessionRequest = {
        file_size: file.size,
      }
      const r: AxiosResponse<UploadSessionResponse> = await gateApi.post(
        "/uploads/start",
        uploadRequest,
      )

      if (r.status === 200) {
        const chunks = createChunks(file)
        const uploadId = r.data.upload_id

        try {
          setStatus("in_progress")

          if (onProgress) {
            let uploadedChunks = 0
            const n = chunks.length

            const wrappedUploadChunk = async (
              uploadId: string,
              chunk: Blob,
              i: number,
            ) => {
              await uploadChunk(uploadId, chunk, i)

              uploadedChunks += 1
              onProgress(Math.round((uploadedChunks / n) * 100))
            }

            const promises = chunks.map((chunk, i) =>
              wrappedUploadChunk(uploadId, chunk, i),
            )

            await Promise.all(promises)
          } else {
            await uploadAll(chunks, uploadId)
          }

          setStatus("completed")
        } catch (error) {
          console.log(error)
          setStatus("failed")
        }
      }
    } finally {
      setIsUploading(false)
    }
  }

  const createChunks = (
    file: File,
    // chunkSize: number = 5 * 1024 * 1024
    chunkSize: number = 140 * 1024,
  ): Blob[] => {
    const chunks: Blob[] = []
    let start = 0

    while (start < file.size) {
      const end = Math.min(start + chunkSize, file.size)
      chunks.push(file.slice(start, end))
      start = end
    }
    return chunks
  }

  const uploadAll = async (chunks: Blob[], uploadId: string) => {
    const promises = chunks.map((chunk, i) => uploadChunk(uploadId, chunk, i))

    await Promise.all(promises)
  }

  const uploadChunk: UploadChunk = async (
    uploadId: string,
    chunk: Blob,
    i: number,
  ) => {
    const chunkHash = await hashChunk(chunk)
    try {
      const response = await uploadsApi.put(
        `/upload/${uploadId}/chunk/${i + 1}`,
        chunk,
        {
          headers: {
            "X-Chunk-Hash": chunkHash,
          },
        },
      )
      return response.status === 200 || response.status === 201
    } catch (error) {
      console.error("Chunk upload failed", error)
      throw new Error("Chunk upload failed")
    }
  }

  return (
    <div>
      <UserPanel>
        <UploadForm
          onUpload={startUpload}
          isUploading={isUploading}
          status={status}
          setStatus={setStatus}
        />
      </UserPanel>
    </div>
  )
}

export default UploadPage
