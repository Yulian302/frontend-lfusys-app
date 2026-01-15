import { useEffect, useState } from "react"
import FileDashboard from "../components/files/Files"
import UserPanel from "../components/UserPanel"
import { gateApi } from "../api/client"
import { ClipLoader } from "react-spinners"
import { Link } from "react-router-dom"
import { isAxiosError } from "axios"
import WarningBanner from "../components/WarningBanner"

const FilesPage = () => {
  const [files, setFiles] = useState<FileInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rateLimited, setRateLimited] = useState(false)

  const getFiles = async (mounted: boolean) => {
    try {
      setLoading(true)
      setError(null)

      const response = await gateApi.get("/files/")

      if (mounted && response.status === 200) {
        setFiles(response.data.Files)
      }
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 429) {
          setRateLimited(true)
          const retryAfter = Number(error.response.headers["retry-after"]) || 5

          setTimeout(() => {
            setRateLimited(false)
          }, retryAfter * 1000)
        }
      }
      if (mounted) {
        console.error("Error fetching files:", error)
      }
    } finally {
      if (mounted) {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    let mounted: boolean = true

    getFiles(mounted)

    return () => {
      mounted = false
    }
  }, [])

  const refreshFiles = () => {
    if (rateLimited) {
      return
    }

    getFiles(true)
  }

  return (
    <UserPanel>
      <WarningBanner
        message="⚠ You are refreshing too often. Please wait…"
        visible={rateLimited}
        onClose={() => setRateLimited(false)}
        duration={5000}
      />
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 w-full">
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
        <div className="flex flex-col items-center justify-center h-64 w-full">
          <p className="text-gray-500">No files uploaded yet</p>
          <Link
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            to="/upload"
          >
            Upload your first file
          </Link>
        </div>
      ) : (
        <FileDashboard
          files={files}
          onRefresh={refreshFiles}
          disabled={rateLimited}
        />
      )}
    </UserPanel>
  )
}

export default FilesPage
