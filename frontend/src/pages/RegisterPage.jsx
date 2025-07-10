import { Link } from "react-router-dom"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./RegisterPage.css"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Erreur à l'inscription")
        return
      }

      // Auto-login après inscription
      localStorage.setItem("token", data.token)
      localStorage.setItem("role", data.user?.role || "PATIENT")
      navigate("/")
    } catch (err) {
      setError("Erreur serveur")
    }
  }

  return (
    <div className="register-container">
      <h2>Créer un compte Medikey 🏥</h2>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          placeholder="Entrez votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Mot de passe</label>
        <input
          type="password"
          placeholder="Entrez un mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">S'inscrire</button>
      </form>

      <p style={{ marginTop: "1rem" }}>
        Déjà un compte ? <Link to="/">Se connecter</Link>
      </p>

    </div>
  )
}
