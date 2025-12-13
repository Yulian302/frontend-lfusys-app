import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const LoginPage = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const { login } = useAuth()

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const isLoggedIn = await login(email, password)
    if (isLoggedIn) {
      navigate("/upload")
    }
  }
  return (
    <div className="flex flex-col">
      Login form
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <label htmlFor="userEmail">Email: </label>
        <input
          type="email"
          id="userEmail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="userPass">Password:</label>
        <input
          type="password"
          id="userPass"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      Don't have an account? <Link to="/register">Register</Link>
    </div>
  )
}

export default LoginPage
