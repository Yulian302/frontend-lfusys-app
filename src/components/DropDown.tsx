import { Menu, MenuButton, MenuItems } from "@headlessui/react"
import Item from "./menu/MenuItem"

type DropDownProps = {
  logout: () => Promise<void>
  userName?: string
  userAvatar?: string
  isAuthenticated: boolean
  openLoginDialog: () => void
}

export default function UserMenu({
  logout,
  userName = "User",
  userAvatar,
  isAuthenticated,
  openLoginDialog,
}: DropDownProps) {
  const userInitials = userName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const menuItems: MenuItemIF[] = [
    {
      title: "Upload",
      link: "/upload",
    },
    {
      title: "Files",
      link: "/files",
    },
    {
      title: "Sign Out",
      link: "/",
      onClick: logout,
    },
  ]

  const items = menuItems.map((item: MenuItemIF, idx: number) => (
    <Item
      title={item.title}
      link={item.link}
      key={idx}
      handleClick={item.onClick}
    />
  ))

  if (!isAuthenticated) {
    return (
      <button
        onClick={openLoginDialog}
        className="cursor-pointer inline-flex items-center gap-2 rounded-full p-1.5 text-sm font-semibold text-white inset-ring-1 inset-ring-white/5 hover:bg-white/10 transition-colors"
      >
        <div className="flex size-8 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-600 font-medium">
          👤
        </div>
      </button>
    )
  }

  return (
    <Menu as="div" className="relative inline-block">
      <MenuButton className="cursor-pointer inline-flex items-center gap-2 rounded-full p-1.5 text-sm font-semibold text-white inset-ring-1 inset-ring-white/5 ">
        {userAvatar ? (
          <img
            src={userAvatar}
            alt={userName}
            className="size-8 rounded-full object-cover"
          />
        ) : (
          <div className="flex size-8 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-600 font-medium">
            {userInitials}
          </div>
        )}
      </MenuButton>

      <MenuItems
        transition
        className="bg-(--bg) text-(--reverse) absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md shadow-2xl outline-1 -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
      >
        <div className="py-1 [&>a]:menuitem">
          <div>{items}</div>
        </div>
      </MenuItems>
    </Menu>
  )
}
