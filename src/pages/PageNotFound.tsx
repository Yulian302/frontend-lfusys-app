import { Link } from "react-router-dom"

const PageNotFound = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center text-(--reverse) font-bold">
      <div className="flex flex-col items-center gap-2">
        <span className="text-6xl sm:text-8xl">404</span>
        <span className="text-xl sm:text-2xl opacity-80">Page not found</span>
        <Link to={"/"} className="text-lg sm:text-base underline!">
          Back to main
        </Link>
      </div>
    </div>
  )
}

export default PageNotFound
