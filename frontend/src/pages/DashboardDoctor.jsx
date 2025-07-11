import React, { useEffect, useState } from "react";

export default function DashboardDoctor() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    date: "",
    startTime: "",
    endTime: ""
  });

  const token = localStorage.getItem("token");

  // 🔁 Récupérer les rendez-vous du médecin
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/appointments", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setAppointments(data.appointments || []);
      } catch (err) {
        console.error("Erreur RDV médecin :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [token]);

  // 📤 Créer un créneau
  const handleCreateSlot = async (e) => {
    e.preventDefault();
    const body = {
      date: form.date,
      startTime: `${form.date}T${form.startTime}`,
      endTime: `${form.date}T${form.endTime}`
    };

    try {
      const res = await fetch("http://localhost:5000/api/slots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Créneau ajouté !");
        setForm({ date: "", startTime: "", endTime: "" });
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.error("Erreur création créneau :", err);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "#34a853" }}>Bienvenue sur votre Espace Médecin</h1>

      {/* ------------------ RDV ------------------ */}
      <section style={{ marginTop: 30 }}>
        <h2>📅 Vos Rendez-vous programmés</h2>
        {loading ? (
          <p>Chargement...</p>
        ) : appointments.length === 0 ? (
          <p>Vous n’avez encore aucun rendez-vous.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
            <thead>
              <tr>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Heure</th>
                <th style={thStyle}>Patient</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((app) => (
                <tr key={app.id}>
                  <td style={tdStyle}>{new Date(app.date).toLocaleDateString()}</td>
                  <td style={tdStyle}>
                    {formatTime(app.slot?.startTime)} - {formatTime(app.slot?.endTime)}
                  </td>
                  <td style={tdStyle}>{app.patient?.email || "Inconnu"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* ------------------ Formulaire de créneau ------------------ */}
      <section style={{ marginTop: 40 }}>
        <h2>🕓 Ajouter un créneau de disponibilité</h2>
        <form onSubmit={handleCreateSlot} style={{ marginTop: 15 }}>
          <label>
            Date :
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
              style={inputStyle}
            />
          </label>
          <br />
          <label>
            Heure de début :
            <input
              type="time"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              required
              style={inputStyle}
            />
          </label>
          <br />
          <label>
            Heure de fin :
            <input
              type="time"
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              required
              style={inputStyle}
            />
          </label>
          <br />
          <button type="submit" style={btnStyle}>Créer le créneau</button>
        </form>
      </section>
    </div>
  );
}

// 🔧 Styles
const thStyle = {
  borderBottom: "1px solid #ccc",
  textAlign: "left",
  padding: "10px",
};

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #eee",
};

const btnStyle = {
  marginTop: 10,
  padding: "10px 20px",
  backgroundColor: "#34a853",
  color: "#fff",
  border: "none",
  borderRadius: 5,
  cursor: "pointer",
};

const inputStyle = {
  marginLeft: 10,
  marginBottom: 10,
  padding: "6px",
  border: "1px solid #ccc",
  borderRadius: 4,
};

// 🕓 Formatage heure
function formatTime(time) {
  const d = new Date(time);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
