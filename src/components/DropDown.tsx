import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"

type DropDownProps = {
  logout: () => Promise<void>
  userName?: string
  userAvatar?: string
}

export default function DropDown({
  logout,
  userName = "User",
  userAvatar,
}: DropDownProps) {
  const userInitials = userName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
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
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-(--bg) shadow-2xl outline-1 -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
      >
        <div className="py-1">
          <MenuItem>
            <a
              href="#"
              className="block px-4 py-2 text-sm data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden"
            >
              Account settings
            </a>
          </MenuItem>
          <MenuItem>
            <a
              href="#"
              className="block px-4 py-2 text-sm data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden"
            >
              Support
            </a>
          </MenuItem>
          <MenuItem>
            <a
              href="#"
              className="block px-4 py-2 text-sm data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden"
            >
              License
            </a>
          </MenuItem>
          <div>
            <MenuItem>
              <button
                className="block w-full px-4 py-2 text-left text-sm data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden"
                onClick={logout}
              >
                Sign out
              </button>
            </MenuItem>
          </div>
        </div>
      </MenuItems>
    </Menu>
  )
}
