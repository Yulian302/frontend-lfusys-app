type UploadSessionResponse = {
  upload_id: string
}

type UploadSessionRequest = {
  file_name: string
  file_type: string
  file_size: number
}

type UploadChunk = (
  uploadId: string,
  chunk: Blob,
  i: number,
) => Promise<boolean>
