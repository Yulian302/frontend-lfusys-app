import axios, { type AxiosResponse } from "axios"
import { useState } from "react"

const UploadPage = () => {
  const SESSION_MANAGER_URL = "http://localhost:8000"
  const [totalChunks, setTotalChunks] = useState(0)
  const [uploadUrls, setUploadUrls] = useState<string[]>([])
  const startSession = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) {
      return
    }
    const r: AxiosResponse<UploadSessionResponse> = await axios.post(
      `${SESSION_MANAGER_URL}/upload/start`,
      {
        file_size: e.target.files[0].size,
        user_id: 1,
      },
      {
        withCredentials: true,
      }
    )

    if (r.status === 200) {
      const nChunks: number = r.data.total_chunks
      const uploadUrls: string[] = r.data.upload_urls

      setTotalChunks(nChunks)
      setUploadUrls(uploadUrls)
    }
  }
  return (
    <div className="flex flex-col">
      <p>Upload a file</p>
      <input type="file" onChange={startSession} />
      <p>Number of chunks: {totalChunks}</p>
      <p>Urls: {uploadUrls}</p>
    </div>
  )
}

export default UploadPage
