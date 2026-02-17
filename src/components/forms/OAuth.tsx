import { FaGithub, FaGoogle } from "react-icons/fa"
import LoginButton from "../oauth/LoginButton"
import { gateApi } from "../../api/client"

const OAuth = () => {
  const handleGithubClick = async () => {
    const clientId =
      import.meta.env.VITE_GITHUB_CLIENT_ID || "Ov23ligIk1n1MnNXDZWA"
    const redirectUri =
      import.meta.env.VITE_GITHUB_REDIRECT_URI ||
      "http://localhost:8080/api/v1/auth/github/callback"
    const scope = "user:email"
    const response = await gateApi.post("/auth/state")
    const state = response.data.state

    const authorizeUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}&response_type=code`

    window.location.href = authorizeUrl
  }

  const handleGoogleClick = async () => {
    const clientId =
      import.meta.env.VITE_GOOGLE_CLIENT_ID ||
      "441188855882-r9hj22sh2939r6nj0jnjn1mo8tkoua6q.apps.googleusercontent.com"
    const redirectUri =
      import.meta.env.VITE_GOOGLE_REDIRECT_URI ||
      "http://localhost:8080/api/v1/auth/google/callback"
    const googleScopes = [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
      "openid",
    ]
    const scope = encodeURIComponent(googleScopes.join(" "))

    const response = await gateApi.post("/auth/state")
    const state = response.data.state

    const authorizeUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}&response_type=code`

    window.location.href = authorizeUrl
  }

  return (
    <div className="flex justify-center gap-2">
      <LoginButton
        title="Github"
        Icon={<FaGithub color="white" />}
        handleClick={handleGithubClick}
        styles="bg-black"
      />
      <LoginButton
        title="Google"
        Icon={<FaGoogle color="white" />}
        handleClick={handleGoogleClick}
        styles="bg-red-700"
      />
    </div>
  )
}

export default OAuth
