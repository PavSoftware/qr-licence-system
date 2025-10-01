import { Routes, Route, Navigate } from "react-router-dom"
import Footer from "./components/Footer/Footer"
import Login from "./pages/Login"
import DashBord from "./pages/DashBord"
import Licenses from "./pages/Licenses"
import Validate from "./pages/Validate"
import NotFound from "./pages/NotFound"
import Profile from "./pages/Profile"
import DashboardLayout from "./components/lsyouts/DashBordLayout"
import RequireAuth from './components/RequireAuth/RequireAuth'

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0f111a] text-white">
      <div className="flex-1">
        <Routes>
          {/* Login (sem sidebar) */}
          <Route path="/login" element={<Login />} />

          {/* Página pública */}
          <Route path="/validate/:code" element={<Validate />} />

          {/* Rotas privadas (com RequireAuth + sidebar/layout) */}
          <Route
            element={
              <RequireAuth>
                <DashboardLayout />
              </RequireAuth>
            }
          >
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<DashBord />} />
            <Route path="licenses" element={<Licenses />} />
            <Route path="profile" element={<Profile />} />
             <Route path="/validate" element={<Validate />} />
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
