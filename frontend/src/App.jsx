import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPatient from "./pages/DashboardPatient";
import DashboardDoctor from "./pages/DashboardDoctor";
import DashboardAdmin from "./pages/DashboardAdmin";
import AdminSetupPage from "./pages/AdminSetupPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard/patient" element={<DashboardPatient />} />
      <Route path="/dashboard/doctor" element={<DashboardDoctor />} />
      <Route path="/dashboard/admin" element={<DashboardAdmin />} />
      <Route path="/setup" element={<AdminSetupPage />} />
    </Routes>
  );
}

export default App;
