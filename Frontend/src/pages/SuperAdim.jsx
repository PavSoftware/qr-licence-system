// src/pages/SuperAdmin.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { UserCircle2 } from "lucide-react";

function SuperAdmin() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true); // 🌀 Estado de carregamento

  // Buscar admins reais do backend
  useEffect(() => {
    if (!token) return;

    const fetchAdmins = async () => {
      try {
        const res = await fetch("http://localhost:3000/user/list", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Erro ao buscar admins");

        setAdmins(Array.isArray(data) ? data : data.users || []);
      } catch (err) {
        console.error("Erro ao carregar admins:", err);
      } finally {
        // Delay suave para mostrar o spinner
        setTimeout(() => setLoading(false), 800);
      }
    };

    fetchAdmins();
  }, [token]);

  // 🌀 Tela de carregamento enquanto busca admins
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0f111a] text-white">
        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-300 text-sm">Carregando administradores...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f111a] flex">
      {/* Conteúdo principal */}
      <main className="flex-1 p-10 text-white">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gestão de Administradores</h1>
          <button
            onClick={() => navigate("/profile-super-admin")}
            className="px-5 py-2 text-2xl rounded-lg flex gap-2 bg-blue-600 hover:bg-blue-700 font-semibold"
          >
            <UserCircle2 size={35} /> Perfil
          </button>
        </div>

        {/* Card do Super Admin */}
        <div className="bg-[#1a1d2d] p-6 rounded-xl shadow-lg mb-8 flex items-center gap-6">
          <img
            src="/pic-3.png"
            alt="Avatar"
            className="w-16 h-16 rounded-full bg-[#0f111a] p-2"
          />
          <div>
            <h3 className="text-lg font-bold">{user?.name || "Super Admin"}</h3>
            <p className="text-gray-400">{user?.email || "admin@gmail.com"}</p>
            <span className="text-sm text-gray-500">super-admin</span>
          </div>
        </div>

        {/* Tabela de Admins */}
        <div className="bg-[#1a1d2d] p-6 rounded-xl shadow-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="py-3">Nome</th>
                <th className="py-3">Email</th>
                <th className="py-3">Último Login</th>
                <th className="py-3">Status</th>
                <th className="py-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {admins.length > 0 ? (
                admins.map((admin, i) => (
                  <tr key={i} className="border-b border-gray-800">
                    <td className="py-3">{admin.name}</td>
                    <td>{admin.email}</td>
                    <td>{admin.lastLogin || "—"}</td>
                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          admin.status === "Ativo"
                            ? "bg-green-700/30 text-green-400"
                            : "bg-yellow-700/30 text-yellow-400"
                        }`}
                      >
                        {admin.status || "Ativo"}
                      </span>
                    </td>
                    <td className="text-center">
                      <button className="px-4 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold">
                        Remover
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-4 text-gray-400 italic"
                  >
                    Nenhum administrador encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default SuperAdmin;
