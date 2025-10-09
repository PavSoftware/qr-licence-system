import { Routes, Route, Navigate } from "react-router-dom"

//componentes pages
import Footer from "./components/Footer/Footer"
import Login from "./pages/Login"
import DashBord from "./pages/DashBord"
import Licenses from "./pages/Licenses"
import Validate from "./pages/Validate"
import NotFound from "./pages/NotFound"
import Profile from "./pages/Profile"
import DashboardLayout from "./components/lsyouts/DashBordLayout"
import QrGenerator from "./pages/QrGenerator"

//superAdminPages
import SuperAdmin from "./pages/SuperAdim"
import ManageAdmins from "./pages/ManagementAdmins"
import SuperAdminProfile from './pages/SuperAdminProfile'
import EditSuperAdmin from "./pages/EditSuperAdmin"

//routes admin pages
import { PrivateRoute, SuperAdminRoute } from "./routes/PrivateRoutes"

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0f111a] text-white">
      <div className="flex-1">
        <Routes>
          {/* Login público */}
          <Route path="/login" element={<Login />} />

          {/* Página pública */}
          <Route path="/validate/:code" element={<Validate />} />

          {/* ROTAS PRIVADAS (usuário logado) */}
          <Route element={<PrivateRoute />}>
            <Route element={<DashboardLayout />}>
              <Route index element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<DashBord />} />
              <Route path="/licenses" element={<Licenses />} />
              <Route path="/qr-generator" element={<QrGenerator />} />
              <Route path="/profile" element={<Profile />} />
                <Route path="/validate/" element={<Validate />} />
            </Route>
          </Route>

          {/* ROTAS DO SUPER ADMIN */}
          <Route element={<SuperAdminRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/super-admin" element={<SuperAdmin />} />
              <Route path="/admin-management" element={<ManageAdmins />} />
              <Route path="/profile-super-admin" element={<SuperAdminProfile/>}/>
              <Route path="/edit-super-admin" element={<EditSuperAdmin/>}/>
            </Route>
          </Route>

          {/* Página 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <Footer />
    </div>
  )
}

export default App
