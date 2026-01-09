interface FileInfo {
  file_id: string
  name?: string
  file_size: number
  type?: string
  created_at: string
}

type FileDashboardProps = {
  files: FileInfo[]
}
