import { useEffect } from "react"
import { FaGithub, FaGoogle } from "react-icons/fa"
import { gateApi } from "../../api/client"
import { handleError } from "../../api/errors"
import LoginButton from "../oauth/LoginButton"

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID
const GITHUB_REDIRECT_URI =
  import.meta.env.VITE_GITHUB_REDIRECT_URI ||
  "http://localhost:8080/api/v1/auth/github/callback"
const GITHUB_AUTHORIZER_URL = "https://github.com/login/oauth/authorize"
const GITHUB_SCOPE = "user:email"

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const GOOGLE_REDIRECT_URI =
  import.meta.env.VITE_GOOGLE_REDIRECT_URI ||
  "http://localhost:8080/api/v1/auth/google/callback"
const GOOGLE_AUTHORIZER_URL = "https://accounts.google.com/o/oauth2/v2/auth"
const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
  "openid",
]

type OAuthProps = {
  setError: (err?: string) => void
  isLoading: boolean
  setIsLoading: (val: boolean) => void
  activeProvider: "github" | "google" | null
  setActiveProvider: (prov: "github" | "google" | null) => void
}

const OAuth = ({
  setError,
  isLoading,
  setIsLoading,
  activeProvider,
  setActiveProvider,
}: OAuthProps) => {
  const handleOAuthClick = async (
    provider: "github" | "google",
    authorizerUrl: string,
    clientId: string,
    redirectUri: string,
    scope: string[] | string,
  ) => {
    setActiveProvider(provider)
    setIsLoading(true)

    const startTime = Date.now()

    try {
      const response = await gateApi.post("/auth/state")
      const state = response.data.state

      if (Array.isArray(scope)) {
        scope = encodeURIComponent(scope.join(" "))
      }

      const authorizeUrl = `${authorizerUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}&response_type=code`

      const elapsed = Date.now() - startTime
      const minDisplayTime = 300 // Show loading for at least 300ms

      if (elapsed < minDisplayTime) {
        await new Promise((resolve) =>
          setTimeout(resolve, minDisplayTime - elapsed),
        )
      }

      window.location.href = authorizeUrl
    } catch (error: unknown) {
      handleError(error, setError)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    return () => {
      setError(undefined)
    }
  }, [setError])

  return (
    <div className="flex justify-center gap-2">
      <LoginButton
        title="Github"
        Icon={<FaGithub color="white" />}
        handleClick={() =>
          handleOAuthClick(
            "github",
            GITHUB_AUTHORIZER_URL,
            GITHUB_CLIENT_ID,
            GITHUB_REDIRECT_URI,
            GITHUB_SCOPE,
          )
        }
        isLoading={isLoading && activeProvider === "github"}
        isDisabled={isLoading}
        styles="bg-black"
      />
      <LoginButton
        title="Google"
        Icon={<FaGoogle color="white" />}
        handleClick={() => {
          handleOAuthClick(
            "google",
            GOOGLE_AUTHORIZER_URL,
            GOOGLE_CLIENT_ID,
            GOOGLE_REDIRECT_URI,
            GOOGLE_SCOPES,
          )
        }}
        isLoading={isLoading && activeProvider === "google"}
        isDisabled={isLoading}
        styles="bg-red-700"
      />
    </div>
  )
}

export default OAuth
