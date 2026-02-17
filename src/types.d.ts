type UploadSessionResponse = {
  upload_id: string
}

type UploadSessionRequest = {
  file_size: number
}

type UploadChunk = (
  uploadId: string,
  chunk: Blob,
  i: number,
) => Promise<boolean>
