export default function mapToFileExtension(dbType: string): string {
  const extensionMap: Record<string, string> = {
    // Images
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/bmp": "bmp",
    "image/webp": "webp",
    "image/svg": "svg",
    "image/svg+xml": "svg",

    // Documents
    "application/pdf": "pdf",
    "text/plain": "txt",
    "text/html": "html",
    "text/csv": "csv",
    "application/json": "json",
    "application/xml": "xml",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "docx",
    "application/vnd.ms-excel": "xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "application/vnd.ms-powerpoint": "ppt",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      "pptx",

    // Archives
    "application/zip": "zip",
    "application/x-tar": "tar",
    "application/x-gzip": "gz",
    "application/x-7z-compressed": "7z",
    "application/x-rar-compressed": "rar",

    // Audio
    "audio/mpeg": "mp3",
    "audio/mp3": "mp3",
    "audio/wav": "wav",
    "audio/ogg": "ogg",
    "audio/flac": "flac",
    "audio/aac": "aac",
    "audio/m4a": "m4a",

    // Video
    "video/mp4": "mp4",
    "video/mpeg": "mpg",
    "video/avi": "avi",
    "video/mkv": "mkv",
    "video/webm": "webm",
    "video/quicktime": "mov",
    "video/x-msvideo": "avi",
    "video/x-ms-wmv": "wmv",

    // Code
    "application/javascript": "js",
    "text/javascript": "js",
    "application/typescript": "ts",
    "text/typescript": "ts",
    "text/css": "css",
  }

  // Try exact match first
  if (extensionMap[dbType]) {
    return extensionMap[dbType]
  }

  // If not found, try to extract from the string
  // e.g., "image_jpeg" -> "jpeg" -> map "jpeg" to "jpg"
  const parts = dbType.split("_")
  const lastPart = parts[parts.length - 1].toLowerCase()

  // Common extension mappings
  const commonMappings: Record<string, string> = {
    jpeg: "jpg",
    jpe: "jpg",
    tiff: "tif",
    htm: "html",
  }

  return commonMappings[lastPart] || lastPart
}
