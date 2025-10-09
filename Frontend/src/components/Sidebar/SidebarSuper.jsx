import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// 🧠 Ícones do Lucide React
import { LayoutDashboard, QrCode, Users, FileText, LogOut } from "lucide-react";

function SidebarSuper() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menu = [
    { name: "Painel", path: "/super-admin", icon: <LayoutDashboard size={18} /> },
    { name: "Gerar QR Code", path: "/qr-generator", icon: <QrCode size={18} /> },
    { name: "Gerir Admins", path: "/admin-management", icon: <Users size={18} /> },
    { name: "Ver Licenças", path: "/licenses", icon: <FileText size={18} /> },
  ];

  return (
    <aside className="w-64 min-h-screen bg-[#121421] text-white flex flex-col shadow-xl">
      {/* Logo */}
      <div className="text-center py-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-blue-400">GPL - SOLIP</h1>
        <p className="text-gray-400 text-sm">Super Admin</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menu.map((item, i) => (
          <button
            key={i}
            onClick={() => navigate(item.path)}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-600/40 transition-all duration-200 group"
          >
            <span className="text-blue-400 group-hover:text-white">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold transition"
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </aside>
  );
}

export default SidebarSuper;
