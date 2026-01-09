import { useEffect, useState } from "react"
import FileDashboard from "../components/files/Files"
import UserPanel from "../components/UserPanel"
import { gateApi } from "../api/client"
import { ClipLoader } from "react-spinners"

const FilesPage = () => {
  const [files, setFiles] = useState<FileInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted: boolean = true

    const getFiles = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await gateApi.get("/files/")

        if (mounted && response.status === 200) {
          setFiles(response.data.Files)
        }
      } catch (error) {
        if (mounted) {
          console.error("Error fetching files:", error)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    getFiles()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <UserPanel>
      {loading ? (
        <div className="w-full h-full self-center justify-self-center">
          <ClipLoader size={40} color="#3b82f6" />
          <p className="mt-4 text-gray-500">Loading your files...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      ) : files.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-gray-500">No files uploaded yet</p>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Upload your first file
          </button>
        </div>
      ) : (
        <FileDashboard files={files} />
      )}
    </UserPanel>
  )
}

export default FilesPage
