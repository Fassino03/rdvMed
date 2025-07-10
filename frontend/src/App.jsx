import { Routes, Route } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import DashboardPatient from "./pages/DashboardPatient"
import DashboardDoctor from "./pages/DashboardDoctor"
import DashboardAdmin from "./pages/DashboardAdmin"
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard/patient" element={<DashboardPatient />} />
      <Route path="/dashboard/doctor" element={<DashboardDoctor />} />
      <Route path="/dashboard/admin" element={<DashboardAdmin />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  )
}

export default App
