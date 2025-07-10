import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function DashboardPatient() {
  const [appointments, setAppointments] = useState([])
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const token = localStorage.getItem("token")

  useEffect(() => {
    if (!token) {
      navigate("/")
      return
    }

    fetch("http://localhost:5000/api/appointments", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error || data.message === "Token manquant") {
          setError("Erreur lors du chargement des rendez-vous")
        } else {
          setAppointments(data.appointments || [])
        }
      })
      .catch(() => setError("Erreur serveur"))
  }, [token, navigate])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    navigate("/")
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Tableau de bord - Patient 🩺</h2>

      <button onClick={handleLogout} style={styles.logoutButton}>
        Déconnexion
      </button>

      {error && <p style={styles.error}>{error}</p>}

      <h3>Mes rendez-vous :</h3>
      <ul style={styles.list}>
        {appointments.length === 0 ? (
          <p>Aucun rendez-vous pour le moment.</p>
        ) : (
          appointments.map((appt) => (
            <li key={appt.id} style={styles.item}>
              Avec le Dr ID {appt.doctorId} — Le{" "}
              {new Date(appt.date).toLocaleDateString()} à{" "}
              {appt.slotId && `créneau #${appt.slotId}`}
            </li>
          ))
        )}
      </ul>

      <button style={styles.rdvButton} onClick={() => alert("À venir !")}>
        ➕ Prendre un rendez-vous
      </button>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "auto",
    padding: "2rem",
    fontFamily: "sans-serif",
  },
  title: {
    color: "#2a9d8f",
    textAlign: "center",
  },
  logoutButton: {
    float: "right",
    padding: "0.5rem 1rem",
    backgroundColor: "#e76f51",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginTop: "1rem",
  },
  list: {
    listStyle: "none",
    padding: 0,
    marginTop: "1rem",
  },
  item: {
    backgroundColor: "#e0f7f1",
    padding: "0.75rem",
    marginBottom: "0.5rem",
    borderRadius: "6px",
  },
  rdvButton: {
    marginTop: "2rem",
    padding: "0.8rem 1.2rem",
    backgroundColor: "#2a9d8f",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
  },
}
