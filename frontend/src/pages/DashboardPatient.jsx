import React, { useEffect, useState } from "react";

export default function DashboardPatient() {
  const [appointments, setAppointments] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(true);

  const token = localStorage.getItem("token");

  // 👉 Charger les rendez-vous du patient
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
        console.error("Erreur RDV patient :", err);
      } finally {
        setLoadingAppointments(false);
      }
    };

    fetchAppointments();
  }, [token]);

  // 👉 Charger les créneaux disponibles
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/slots");
        const data = await res.json();
        setSlots(data || []);
      } catch (err) {
        console.error("Erreur créneaux :", err);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, []);

  // 👉 Réserver un rendez-vous
  const handleBooking = async (slotId) => {
    try {
      const res = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ slotId }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Rendez-vous réservé !");
        // Recharger les données
        setAppointments((prev) => [...prev, data.appointment]);
        setSlots((prev) => prev.filter((s) => s.id !== slotId));
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.error("Erreur réservation :", err);
      alert("Erreur lors de la réservation.");
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "#1a73e8" }}>Bienvenue sur votre Espace Patient</h1>

      {/* --------------------- Rendez-vous à venir --------------------- */}
<section style={{ marginTop: 30 }}>
  <h2>📅 Vos Rendez-vous à venir</h2>
  {loadingAppointments ? (
    <p>Chargement...</p>
  ) : appointments.filter(app => !isPastAppointment(app)).length === 0 ? (
    <p>Aucun rendez-vous à venir.</p>
  ) : (
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
      <thead>
        <tr>
          <th style={thStyle}>Date</th>
          <th style={thStyle}>Heure</th>
          <th style={thStyle}>Médecin</th>
        </tr>
      </thead>
      <tbody>
        {appointments
          .filter((app) => !isPastAppointment(app))
          .map((app) => (
            <tr key={app.id}>
              <td style={tdStyle}>{new Date(app.date).toLocaleDateString()}</td>
              <td style={tdStyle}>
                {formatTime(app.slot?.startTime)} - {formatTime(app.slot?.endTime)}
              </td>
              <td style={tdStyle}>{app.doctor?.email || "N/A"}</td>
            </tr>
          ))}
      </tbody>
    </table>
  )}
</section>


      {/* --------------------- Créneaux --------------------- */}
      <section style={{ marginTop: 40 }}>
        <h2>🕓 Créneaux disponibles</h2>
        {loadingSlots ? (
          <p>Chargement...</p>
        ) : slots.length === 0 ? (
          <p>Aucun créneau libre pour le moment.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
            <thead>
              <tr>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Heure</th>
                <th style={thStyle}>Médecin</th>
                <th style={thStyle}></th>
              </tr>
            </thead>
            <tbody>
              {slots.map((slot) => (
                <tr key={slot.id}>
                  <td style={tdStyle}>{new Date(slot.date).toLocaleDateString()}</td>
                  <td style={tdStyle}>
                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                  </td>
                  <td style={tdStyle}>{slot.doctor?.email}</td>
                  <td style={tdStyle}>
                    <button style={btnStyle} onClick={() => handleBooking(slot.id)}>
                      Réserver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* --------------------- Historique --------------------- */}
<section style={{ marginTop: 40 }}>
  <h2>🕘 Historique de vos rendez-vous</h2>
  {loadingAppointments ? (
    <p>Chargement...</p>
  ) : appointments.filter(app => isPastAppointment(app)).length === 0 ? (
    <p>Pas encore de rendez-vous passés.</p>
  ) : (
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
      <thead>
        <tr>
          <th style={thStyle}>Date</th>
          <th style={thStyle}>Heure</th>
          <th style={thStyle}>Médecin</th>
        </tr>
      </thead>
      <tbody>
        {appointments
          .filter((app) => isPastAppointment(app))
          .map((app) => (
            <tr key={app.id}>
              <td style={tdStyle}>{new Date(app.date).toLocaleDateString()}</td>
              <td style={tdStyle}>
                {formatTime(app.slot?.startTime)} - {formatTime(app.slot?.endTime)}
              </td>
              <td style={tdStyle}>{app.doctor?.email || "N/A"}</td>
            </tr>
          ))}
      </tbody>
    </table>
  )}
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
  padding: "6px 12px",
  backgroundColor: "#1a73e8",
  color: "#fff",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
};

// 🕓 Formatage de l’heure
function formatTime(time) {
  const d = new Date(time);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
// 🧠 Vérifie si un rendez-vous est passé
function isPastAppointment(appointment) {
  const end = new Date(appointment.slot?.endTime);
  return end < new Date();
}

