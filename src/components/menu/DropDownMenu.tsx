import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import {
  PencilIcon,
  Square2StackIcon,
  TrashIcon,
} from "@heroicons/react/16/solid"
import type React from "react"

import { CiMenuKebab } from "react-icons/ci"

type FileMenuItemProps = {
  name: string
  hiddenName: string
  Icon: React.ElementType
}

function FileMenuItem({ name, hiddenName, Icon }: FileMenuItemProps) {
  return (
    <MenuItem>
      <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-(--secondary)/30">
        <Icon className="size-4 fill-white/30" />
        {name}
        <kbd className="ml-auto hidden font-sans text-xs text-(--primary) group-data-focus:inline">
          {hiddenName}
        </kbd>
      </button>
    </MenuItem>
  )
}

export default function DropDownMenu() {
  const menuItems: FileMenuItemProps[] = [
    {
      name: "Edit",
      hiddenName: "⌘E",
      Icon: PencilIcon,
    },
    {
      name: "Duplicate",
      hiddenName: "⌘D",
      Icon: Square2StackIcon,
    },
    {
      name: "Delete",
      hiddenName: "⌘B",
      Icon: TrashIcon,
    },
  ]
  const items = menuItems.map((item: FileMenuItemProps, idx: number) => (
    <FileMenuItem
      name={item.name}
      hiddenName={item.hiddenName}
      Icon={item.Icon}
      key={idx}
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
