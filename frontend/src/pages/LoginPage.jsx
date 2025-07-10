import { Link } from "react-router-dom"
import { useState } from "react"
import axios from "../api/axios"
import { useNavigate } from "react-router-dom"

function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post("/auth/login", { email, password })

      // Sauvegarde token et rôle
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("role", res.data.role)

      // Redirection selon le rôle
      switch (res.data.role) {
        case "PATIENT":
          navigate("/dashboard/patient")
          break
        case "DOCTOR":
          navigate("/dashboard/doctor")
          break
        case "ADMIN":
          navigate("/dashboard/admin")
          break
        default:
          alert("Rôle inconnu.")
      }
    } catch (err) {
      alert("Identifiants incorrects")
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔷 Connexion à la plateforme médicale</h2>

        <form onSubmit={handleLogin} style={styles.form}>
          <label htmlFor="email" style={styles.label}>Adresse e-mail</label>
          <input
            id="email"
            type="email"
            placeholder="exemple@domaine.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />

          <label htmlFor="password" style={styles.label}>Mot de passe</label>
          <input
            id="password"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />

          <button type="submit" style={styles.button}>Se connecter</button>
        </form>
        <p style={{ marginTop: "1rem" }}>
          Pas encore de compte ? <Link to="/register">S'inscrire</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    background: "linear-gradient(to right, #e6f2ff, #d1f4f4)",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Segoe UI', sans-serif",
  },
  card: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0, 123, 255, 0.1)",
    width: "360px",
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#007bff",
    fontWeight: "600",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    color: "#333",
    fontSize: "14px",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "6px",
    border: "1px solid #ccddee",
    fontSize: "15px",
    backgroundColor: "#f9fcff",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "6px",
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
}

export default LoginPage
