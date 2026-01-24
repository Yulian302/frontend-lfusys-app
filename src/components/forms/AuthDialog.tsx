import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import LoginForm from "./Login"
import OAuth from "./OAuth"
import RegisterForm from "./Register"

interface LoginDialogProps {
  isOpen: boolean
  onClose: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  showCloseButton?: boolean
  isLogin: boolean
  changeAuthType: () => void
}

export default function AuthDialog({
  isOpen,
  onClose,
  showCloseButton = true,
  isLogin,
  changeAuthType,
}: LoginDialogProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="mx-auto w-full max-w-md overflow-hidden rounded-2xl bg-(--bg) shadow-2xl">
          {/* Header */}
          <div className="relative px-8 pt-8 pb-4">
            {showCloseButton && (
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <XMarkIcon className="size-5" />
              </button>
            )}

            <DialogTitle className="text-2xl font-bold text-(--reverse) text-center">
              {isLogin ? "Welcome back" : "Welcome aboard"}
            </DialogTitle>

            <p className="mt-2 text-sm text-gray-500 text-center">
              {isLogin
                ? "Sign in to your account to continue"
                : "Create a new account to continue"}
            </p>
          </div>

          {isLogin ? <LoginForm /> : <RegisterForm />}
          <div className="px-8 pb-6">
            {isLogin && (
              <>
                {/* OAuth Buttons */}
                <div className="mb-6">
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-(--bg) px-2 text-gray-500">
                        Or continue with
                      </span>
                    </div>
                  </div>
                </div>
                <OAuth />
              </>
            )}

            {/* Footer Links */}
            <div className="mt-6 space-y-3 text-center text-sm">
              {/* {isLogin && (
                <a
                  href="/forgot-password"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                  onClick={(e) => {
                    e.preventDefault()
                    // Handle forgot password
                    onClose()
                  }}
                >
                  Forgot your password?
                </a>
              )} */}

              <p className="text-gray-600">
                {isLogin
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <button
                  onClick={() => {
                    changeAuthType()
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
