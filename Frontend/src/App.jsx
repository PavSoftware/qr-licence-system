import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Footer from "./components/Footer/Footer"
import Login from "./pages/Login"
import DashBord from "./pages/DashBord"
import Licenses from "./pages/Licenses"
import Validate from "./pages/Validate"
import NotFound from "./pages/NotFound"
import DashboardLayout from "./components/lsyouts/DashBordLayout"

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#0f111a] text-white">
        <div className="flex-1">
          <Routes>
            {/* Login (sem sidebar) */}
            <Route path="/login" element={<Login />} />

            {/* Página pública */}
            

            {/* Rotas privadas (com sidebar/layout) */}
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<DashBord />} />
              <Route path="/licenses" element={<Licenses />} />
              <Route path="/validate" element={<Validate />} />
            </Route>

            {/* Página 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  )
}

export default App
