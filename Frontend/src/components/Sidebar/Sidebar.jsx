import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, CheckCircle, LogOut } from "lucide-react";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path ? "bg-gray-700" : "hover:bg-gray-700";

  return (
    <aside className="bg-[#1f2937] text-gray-200 w-64 min-h-screen flex flex-col p-6 relative">
      <h1 className="text-xl font-bold mb-8"><a href="/profile">License Manager</a></h1>

      <nav className="flex flex-col gap-2">
        <button
          className={`flex items-center gap-2 px-3 py-2 rounded ${isActive(
            "/dashboard"
          )}`}
          onClick={() => navigate("/dashboard")}
        >
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </button>

        <button
          className={`flex items-center gap-2 px-3 py-2 rounded ${isActive(
            "/licenses"
          )}`}
          onClick={() => navigate("/licenses")}
        >
          <FileText className="w-5 h-5" />
          Licenses
        </button>

        <button
          className={`flex items-center gap-2 px-3 py-2 rounded ${isActive(
            "/validate"
          )}`}
          onClick={() => navigate("/validate")}
        >
          <CheckCircle className="w-5 h-5" />
          Validate
        </button>

        <button
          className={`flex items-center gap-2 px-3 py-2 rounded text-red-400 hover:text-red-300 ${
            location.pathname === "/login" ? "bg-gray-700" : ""
          }`}
          onClick={() => navigate("/login")}
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;
