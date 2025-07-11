import React, { useEffect, useState } from "react";

export default function DashboardAdmin() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ email: "", password: "" });

  const token = localStorage.getItem("token");

  // 📥 Charger les médecins existants
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/slots"); // ⚠️ On triche ici pour choper les docteurs via les slots
        const data = await res.json();

        const uniqueDoctors = [];
        const seen = new Set();

        data.forEach(slot => {
          const doctor = slot.doctor;
          if (doctor && !seen.has(doctor.email)) {
            seen.add(doctor.email);
            uniqueDoctors.push(doctor);
          }
        });

        setDoctors(uniqueDoctors);
      } catch (err) {
        console.error("Erreur chargement médecins :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // ➕ Créer un médecin
  const handleCreateDoctor = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/users/doctor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Médecin créé avec succès !");
        setDoctors([...doctors, data.user]);
        setForm({ email: "", password: "" });
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.error("Erreur création médecin :", err);
      alert("Erreur côté serveur.");
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "#fbbc05" }}>Dashboard Administrateur</h1>

      {/* ----------------- Création médecin ----------------- */}
      <section style={{ marginTop: 30 }}>
        <h2>➕ Ajouter un Médecin</h2>
        <form onSubmit={handleCreateDoctor} style={{ marginTop: 15 }}>
          <label>
            Email :
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              style={inputStyle}
            />
          </label>
          <br />
          <label>
            Mot de passe :
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              style={inputStyle}
            />
          </label>
          <br />
          <button type="submit" style={btnStyle}>Créer Médecin</button>
        </form>
      </section>

      {/* ----------------- Liste médecins ----------------- */}
      <section style={{ marginTop: 50 }}>
        <h2>👨‍⚕️ Liste des Médecins</h2>
        {loading ? (
          <p>Chargement...</p>
        ) : doctors.length === 0 ? (
          <p>Aucun médecin trouvé.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
            <thead>
              <tr>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Rôle</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doc, index) => (
                <tr key={index}>
                  <td style={tdStyle}>{doc.email}</td>
                  <td style={tdStyle}>{doc.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

// 🎨 Styles
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
  backgroundColor: "#fbbc05",
  color: "#000",
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
