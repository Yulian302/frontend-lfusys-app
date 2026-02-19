import {
  AiFillAudio,
  AiFillCode,
  AiFillFile,
  AiFillFileImage,
  AiFillFilePdf,
  AiFillFileText,
  AiFillFileZip,
} from "react-icons/ai"
import { IoMdRefresh } from "react-icons/io"

import DropDownMenu from "../menu/DropDownMenu"
import clsx from "clsx"

const getIcon = (type: string) => {
  switch (type) {
    case "pdf":
      return AiFillFilePdf
    case "image":
      return AiFillFileImage
    case "text":
      return AiFillFileText
    case "zip":
      return AiFillFileZip
    case "audio":
      return AiFillAudio
    case "code":
      return AiFillCode
    default:
      return AiFillFile
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year:
      date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
    hour: "2-digit",
    minute: "2-digit",
  })
}

interface FileTableProps {
  files: FileInfo[]
  onClick?: (file: FileInfo) => void
  onAction?: (action: string, file: FileInfo) => void
  onRefresh: () => void
  disabled: boolean
}

function FileTable({ files, onClick, onRefresh, disabled }: FileTableProps) {
  if (files.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-400">No files yet</p>
      </div>
    )
  }

  const headers = [
    { key: "name", label: "Name", width: "flex-1" },
    { key: "type", label: "Type", width: "w-24" },
    { key: "size", label: "Size", width: "w-28" },
    { key: "created", label: "Created", width: "w-40" },
    { key: "actions", label: "Actions", width: "w-10" },
  ]

  const rows = files.map((file) => ({
    id: file.file_id,
    name: file.name || "Unnamed",
    type: file.type || "Unspecified",
    size: formatFileSize(file.file_size),
    created: formatDate(file.created_at),
    file,
  }))

  return (
    <div className="h-max m-12 w-full self-start flex flex-col gap-2">
      <IoMdRefresh
        size={20}
        className={clsx(
          "cursor-pointer text-(--reverse) hover:scale-105 ease-in-out",
          disabled && "text-gray-500 cursor-default! hover:scale-none",
        )}
        onClick={() => onRefresh()}
      />
      <div className="border rounded-lg overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full bg-white">
            <thead>
              <tr className="border-b bg-gray-50">
                {headers.map((header) => (
                  <th
                    key={header.key}
                    className={`
                    text-left py-3 px-4 font-semibold text-gray-700 text-sm
                    ${header.width}
                  `}
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => {
                const Icon = getIcon(row.file.type || "default")
                return (
                  <tr
                    key={row.id}
                    onClick={() => onClick?.(row.file)}
                    className="border-b hover:bg-(--secondary) transition cursor-pointer group"
                  >
                    {/* Name Column */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Icon className="text-xl text-blue-500 shrink-0" />
                        <span className="text-sm text-gray-900 truncate hover:underline">
                          {row.name}
                        </span>
                      </div>
                    </td>

                    {/* Type Column */}
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {row.type}
                    </td>

                    {/* Size Column */}
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {row.size}
                    </td>

                    {/* Created Column */}
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {row.created}
                    </td>

                    {/* Actions Column */}
                    <td className="py-3 px-4">
                      <div className="flex justify-center">
                        <DropDownMenu
                          fileId={row.file.file_id}
                          refresh={() => onRefresh()}
                        />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden">
          {rows.map((row) => {
            const Icon = getIcon(row.file.type || "default")
            return (
              <div
                key={row.id}
                onClick={() => onClick?.(row.file)}
                className="bg-white border-b p-4 hover:bg-(--secondary) transition cursor-pointer group last:border-b-0"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Icon className="text-xl text-blue-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {row.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {row.type} • {row.size} • {row.created}
                      </div>
                    </div>
                  </div>
                  <div className="ml-2">
                    <DropDownMenu
                      fileId={row.file.file_id}
                      refresh={() => onRefresh()}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
export default FileTable
