import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import SidebarSuper from "../Sidebar/SidebarSuper";
import { useAuth } from "../../context/AuthContext";

function DashboardLayout() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-[#0f111a] text-white">
      {/* Sidebar dinâmico */}
      {user?.role === "super-admin" ? <SidebarSuper /> : <Sidebar />}

      {/* Área principal */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
