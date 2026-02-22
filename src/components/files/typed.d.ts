interface FileInfo {
  file_id: string
  name: string
  type: string
  file_size: number
  created_at: string
}

type FileDashboardProps = {
  files: FileInfo[]
}
