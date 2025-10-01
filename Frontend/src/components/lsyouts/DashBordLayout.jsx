// src/components/layouts/DashBordLayout.jsx
import { Outlet } from "react-router-dom"
import Sidebar from "../Sidebar/Sidebar"

function DashboardLayout() {
  return (
    <div className="flex min-h-screen max-h[100dvh] bg-[#0f111a] text-white">
      {/* Sidebar (fixa) */}
      <Sidebar />

      {/* Área principal */}
  
        {/* Conteúdo da página */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
  )
}

export default DashboardLayout
