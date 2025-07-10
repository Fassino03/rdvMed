import React, { useEffect, useState } from "react";

export default function DashboardDoctor() {
  const [appointments, setAppointments] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token"); // ou d’où tu stockes le token

        // Récupérer les rendez-vous
        const resAppointments = await fetch("http://localhost:5000/api/appointments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataAppointments = await resAppointments.json();

        // Récupérer les créneaux (à condition que la route soit dispo)
        const resSlots = await fetch("http://localhost:5000/api/slots", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataSlots = await resSlots.json();

        setAppointments(dataAppointments.appointments || []);
        setSlots(dataSlots.slots || []);
      } catch (error) {
        console.error("Erreur récupération doctor data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Chargement des données...</p>;

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "#1a73e8" }}>Tableau de bord Médecin</h1>

      <section>
        <h2>Rendez-vous programmés</h2>
        {appointments.length === 0 ? (
          <p>Aucun rendez-vous prévu.</p>
        ) : (
          <ul>
            {appointments.map((app) => (
              <li key={app.id}>
                Patient: {app.patient.email} — Date: {new Date(app.date).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>Créneaux horaires</h2>
        {slots.length === 0 ? (
          <p>Aucun créneau disponible.</p>
        ) : (
          <ul>
            {slots.map((slot) => (
              <li key={slot.id}>
                Date: {new Date(slot.date).toLocaleDateString()} — Heure: {slot.startTime} - {slot.endTime}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
