import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const RegisterPage = () => {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")
  const [repeatPass, setRepeatPass] = useState("")

  const { register, login } = useAuth()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (pass != repeatPass) {
      return
    }
    const isRegistered = await register(name, email, pass)
    if (isRegistered) {
      // auth and navigate to upload page
      const isLoggedIn = await login(email, pass)
      if (isLoggedIn) {
        navigate("/upload")
      }
    }
  }

  return (
    <div className="flex flex-col">
      Register form
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <label htmlFor="userName">Name:</label>
        <input
          type="text"
          id="userName"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="userEmail">Email:</label>
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
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
        <label htmlFor="repeatPass">Repeat password:</label>
        <input
          type="password"
          id="repeatPass"
          value={repeatPass}
          onChange={(e) => setRepeatPass(e.target.value)}
        />
        {pass != repeatPass && repeatPass && (
          <span style={{ color: "red" }}>Passwords don't match</span>
        )}
        <button type="submit">Register</button>
      </form>
      Already have account? Back to <Link to="/login">login</Link>
    </div>
  )
}

export default RegisterPage
