type UploadSessionResponse = {
  upload_urls: string[]
}

type UploadSessionRequest = {
  file_size: number
}

type UploadChunk = (chunk: Blob, url: string) => Promise<boolean>
