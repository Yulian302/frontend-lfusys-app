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
  const startUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null || isUploading) {
      return
    }

    setIsUploading(true)

    try {
      const uploadRequest: UploadSessionRequest = {
        file_size: e.target.files[0].size,
      }
      const r: AxiosResponse<UploadSessionResponse> = await gateApi.post(
        "/uploads/start",
        uploadRequest
      )

      if (r.status === 200) {
        const urls: string[] = r.data.upload_urls
        const file = e.target.files[0]
        const chunks = createChunks(file)
        await uploadAll(chunks, urls)
      }
    } finally {
      setIsUploading(false)
    }
  }

  const createChunks = (
    file: File,
    chunkSize: number = 5 * 1024 * 1024
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

  const uploadAll = async (chunks: Blob[], urls: string[]) => {
    const nUrls = urls.length
    const promises = chunks.map((chunk, i) =>
      uploadChunk(chunk, urls[i % nUrls])
    )

    await Promise.all(promises)
  }

  const uploadChunk: UploadChunk = async (chunk: Blob, url: string) => {
    const chunkHash = await hashChunk(chunk)
    try {
      const response = await uploadsApi.put(url, chunk, {
        headers: {
          "X-Chunk-Hash": chunkHash,
        },
      })
      return response.status === 200 || response.status === 201
    } catch (error) {
      console.log(error)
      return false
    }
  }

  return (
    <div>
      <UserPanel>
        <UploadForm startUpload={startUpload} isUploading={isUploading} />
      </UserPanel>
    </div>
  )
}

export default UploadPage
