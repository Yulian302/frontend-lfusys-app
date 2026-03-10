import { type AxiosResponse } from "axios"
import { useEffect, useState } from "react"
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
  const [uploadedChunks, setUploadedChunks] = useState<number[]>([])
  const chunkSize = import.meta.env.DEV ? 128 * 1024 : 5 * 1024 * 1024 // 128KB for dev, 5MB for prod

  // Recover upload session on page load
  useEffect(() => {
    const sRaw = localStorage.getItem("upload_session")
    if (!sRaw) return

    const s: UploadSession = JSON.parse(sRaw)

    fetchUploadedChunks(s.uploadId)
    setStatus("resume_pending")
  }, [])

  // Retrieve chunks that already exist
  const fetchUploadedChunks = async (uploadId: string): Promise<void> => {
    try {
      const response = await gateApi.get(`/uploads/${uploadId}/chunks`)

      if (response.status === 200) {
        setUploadedChunks(response.data.chunks || [])
      }
    } catch (err) {
      console.log("Failed to fetch unfinished chunks: ", err)
    }
  }

  const startUpload = async (file: File, onProgress?: (p: number) => void) => {
    if (isUploading) return
    setIsUploading(true)

    try {
      // Resume upload
      const existingSessionRaw = localStorage.getItem("upload_session")
      if (existingSessionRaw) {
        const s: UploadSession = JSON.parse(existingSessionRaw)

        if (file.name === s.fileName && file.size === s.fileSize) {
          const chunks = createChunks(file, s.chunkSize)

          const missingIndexes = chunks
            .map((_, i) => i)
            .filter((i) => !uploadedChunks.includes(i + 1))

          if (missingIndexes.length === 0) {
            setStatus("completed")
            localStorage.removeItem("upload_session")
            return
          }

          await uploadChunksByIndexes(
            chunks,
            missingIndexes,
            s.uploadId,
            onProgress,
            file.size,
          )

          setStatus("in_progress")
          localStorage.removeItem("upload_session")
          return
        }
      }

      // Otherwise start new upload

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
        const uploadId = r.data.upload_id
        const chunks = createChunks(file, chunkSize)

        const newSession: UploadSession = {
          uploadId,
          fileName: file.name,
          fileSize: file.size,
          chunkSize,
        }
        localStorage.setItem("upload_session", JSON.stringify(newSession))

        try {
          setStatus("in_progress")

          if (onProgress) {
            // Track bytes uploaded per chunk for smooth progress
            const chunkProgress = new Array(chunks.length).fill(0)
            uploadedChunks.forEach((i) => {
              chunkProgress[i - 1] = chunks[i - 1].size
            })

            const updateProgress = () => {
              const totalUploaded = chunkProgress.reduce(
                (sum, val) => sum + val,
                0,
              )
              const percentage = Math.round((totalUploaded / file.size) * 100)
              onProgress(percentage)
            }

            const wrappedUploadChunk = async (
              uploadId: string,
              chunk: Blob,
              i: number,
            ) => {
              await uploadChunk(uploadId, chunk, i, (loaded) => {
                chunkProgress[i] = loaded
                updateProgress()
              })
            }

            const promises = chunks.map((chunk, i) =>
              wrappedUploadChunk(uploadId, chunk, i),
            )

            await Promise.all(promises)
          } else {
            await uploadAllWithLimit(chunks, uploadId)
          }

          setStatus("completed")
          localStorage.removeItem("upload_session")
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

  const uploadChunksByIndexes = async (
    chunks: Blob[],
    indexes: number[],
    uploadId: string,
    onProgress?: (p: number) => void,
    fileSize?: number,
    limit = 5,
  ) => {
    let cursor = 0

    const chunkProgress = new Array(chunks.length).fill(0)

    const updateProgress = () => {
      if (!onProgress || !fileSize) return

      const total = chunkProgress.reduce((a, b) => a + b, 0)
      onProgress(Math.round((total / fileSize) * 100))
    }

    const workers = Array.from({ length: limit }).map(async () => {
      while (true) {
        const current = cursor++

        if (current >= indexes.length) break

        const i = indexes[current]

        await retryChunk(() =>
          uploadChunk(uploadId, chunks[i], i, (loaded) => {
            chunkProgress[i] = loaded
            updateProgress()
          }),
        )
      }
    })

    await Promise.all(workers)
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

    try {
      await Promise.all(workers)
      localStorage.removeItem("upload_session")
    } catch (err) {
      console.error("Upload failed: ", err)
    }
  }

  const uploadChunk = async (
    uploadId: string,
    chunk: Blob,
    i: number,
    onChunkProgress?: (loaded: number) => void,
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
          onUploadProgress: (progressEvent) => {
            if (onChunkProgress && progressEvent.loaded) {
              onChunkProgress(progressEvent.loaded)
            }
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
