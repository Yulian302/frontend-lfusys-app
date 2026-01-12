import { MenuItem } from "@headlessui/react"
import { Link } from "react-router-dom"

type MenuItemProps = {
  title: string
  link: string
  handleClick?: VoidFunction
}

const Item = ({ title, link, handleClick }: MenuItemProps) => {
  return (
    <MenuItem>
      <Link
        to={link}
        className="block px-4 py-2 text-sm data-focus:bg-(--reverse)/10"
        onClick={handleClick}
      >
        {title}
      </Link>
    </MenuItem>
  )
}

export default Item
