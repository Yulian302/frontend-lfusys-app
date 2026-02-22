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
  const chunkSize = import.meta.env.DEV ? 128 * 1024 : 5 * 1024 * 1024 // 128KB for dev, 5MB for prod

  const startUpload = async (file: File, onProgress?: (p: number) => void) => {
    if (isUploading) return
    setIsUploading(true)

    try {
      const uploadRequest: UploadSessionRequest = {
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
      }
      const r: AxiosResponse<UploadSessionResponse> = await gateApi.post(
        "/uploads/start",
        uploadRequest,
      )

      if (r.status === 200) {
        const chunks = createChunks(file, chunkSize)
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
            await uploadAllWithLimit(chunks, uploadId)
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
    chunkSize: number = 5 * 1024 * 1024,
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

  async function retryChunk<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
    let lastError: unknown

    for (let i = 0; i < attempts; i++) {
      try {
        return await fn()
      } catch (err) {
        lastError = err

        if (i < attempts - 1) {
          const delay = 200 * 2 ** i
          await new Promise((resolve) => setTimeout(resolve, delay))
        }
      }
    }

    throw lastError
  }

  const uploadAllWithLimit = async (
    chunks: Blob[],
    uploadId: string,
    limit = 5,
  ) => {
    let index = 0

    const workers = Array.from({ length: limit }).map(async () => {
      while (true) {
        const current = index++
        if (current >= chunks.length) break
        await retryChunk(() => uploadChunk(uploadId, chunks[current], current))
      }
    })

    await Promise.all(workers)
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
