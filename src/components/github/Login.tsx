import { FaGithub } from "react-icons/fa"
import { gateApi } from "../../api/client"

const GithubLogin = () => {
  const handleClick = async () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID
    const redirectUri = import.meta.env.VITE_GITHUB_REDIRECT_URI
    const scope = "user:email"
    const response = await gateApi.post("/auth/state")
    const state = response.data.state

    const authorizeUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}&response_type=code`

    window.location.href = authorizeUrl
  }
  return (
    <button
      className="text-white flex items-center gap-2 bg-black rounded-full px-4 py-2 hover:bg-black/90 hover:scale-105 ease-in-out cursor-pointer"
      type="button"
      onClick={handleClick}
    >
      <span className="font-semibold">Github</span>
      <FaGithub size={20} />
    </button>
  )
}

export default GithubLogin
