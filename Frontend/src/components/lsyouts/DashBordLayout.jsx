import { Outlet } from "react-router-dom"
import Sidebar from "../Sidebar/Sidebar"

function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar (fica fixo em todas as páginas privadas) */}
      <Sidebar />

      {/* Conteúdo da página */}
      <main className="flex-1 p-6 bg-[#0f111a] text-white">
        <Outlet /> {/* Aqui vão ser renderizadas as rotas filhas */}
      </main>
    </div>
  )
}

export default DashboardLayout
