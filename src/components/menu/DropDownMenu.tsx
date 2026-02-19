import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import {
  PencilIcon,
  Square2StackIcon,
  TrashIcon,
} from "@heroicons/react/16/solid"
import type React from "react"

import { CiMenuKebab } from "react-icons/ci"
import { gateApi } from "../../api/client"

type FileMenuItemProps = {
  name: string
  hiddenName: string
  Icon: React.ElementType
  handleClick: () => void
}

function FileMenuItem({
  name,
  hiddenName,
  Icon,
  handleClick,
}: FileMenuItemProps) {
  return (
    <MenuItem>
      <button
        className="text-(--reverse) group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-(--secondary)/40"
        onClick={() => handleClick()}
      >
        <Icon className="size-4 fill-(--reverse)" />
        {name}
        <kbd className="ml-auto hidden font-sans text-xs text-(--primary) group-data-focus:inline">
          {hiddenName}
        </kbd>
      </button>
    </MenuItem>
  )
}

type DropDownMenuProps = {
  fileId: string
  refresh: () => void
}

export default function DropDownMenu({ fileId, refresh }: DropDownMenuProps) {
  const menuItems: FileMenuItemProps[] = [
    {
      name: "Edit",
      hiddenName: "⌘E",
      Icon: PencilIcon,
      handleClick: () => {},
    },
    {
      name: "Duplicate",
      hiddenName: "⌘D",
      Icon: Square2StackIcon,
      handleClick: () => {},
    },
    {
      name: "Delete",
      hiddenName: "⌘B",
      Icon: TrashIcon,
      handleClick: async () => {
        try {
          await gateApi.delete(`/files/${fileId}`)
          console.log(`File ${fileId} deleted successfully`)
          refresh()
        } catch (error) {
          console.error(`Failed to delete file ${fileId}:`, error)
        }
      },
    },
  ]
  const items = menuItems.map((item: FileMenuItemProps, idx: number) => (
    <FileMenuItem
      name={item.name}
      hiddenName={item.hiddenName}
      Icon={item.Icon}
      key={idx}
      handleClick={item.handleClick}
    />
  ))
  return (
    <Menu as="div" className="relative inline-block">
      <MenuButton className={"cursor-pointer"}>
        <CiMenuKebab size={20} />
      </MenuButton>

      <MenuItems
        transition
        anchor="bottom start"
        className="w-40 origin-top-right rounded-xl bg-(--bg) shadow-2xl outline-1 -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
      >
        {items}
      </MenuItems>
    </Menu>
  )
}
