import React, { useState } from "react";

export default function AdminSetupPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    institutionName: "",
    institutionType: "",
    key: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/setup-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Admin créé avec succès !");
        setForm({
          email: "",
          password: "",
          institutionName: "",
          institutionType: "",
          key: "",
        });
      } else {
        setMessage("❌ " + data.message);
      }
    } catch (err) {
      setMessage("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>🛠 Configuration initiale de l’administrateur</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="institutionName"
          placeholder="Nom de l’établissement"
          value={form.institutionName}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <select
          name="institutionType"
          value={form.institutionType}
          onChange={handleChange}
          required
          style={styles.input}
        >
          <option value="">-- Type d’établissement --</option>
          <option value="Hôpital">Hôpital</option>
          <option value="Clinique">Clinique</option>
          <option value="Centre de santé">Centre de santé</option>
        </select>
        <input
          type="email"
          name="email"
          placeholder="Email de l’admin"
          value={form.email}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="text"
          name="key"
          placeholder="Clé d’installation"
          value={form.key}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Création..." : "Créer l'Admin"}
        </button>
        {message && <p style={styles.message}>{message}</p>}
      </form>
    </div>
  );
}

const styles = {
  container: { padding: 40, fontFamily: "Arial" },
  form: { maxWidth: 400, display: "flex", flexDirection: "column", gap: 10 },
  input: { padding: 10, borderRadius: 5, border: "1px solid #ccc" },
  button: { padding: 10, background: "#1a73e8", color: "#fff", border: "none", borderRadius: 5 },
  message: { marginTop: 10, fontWeight: "bold" },
};
