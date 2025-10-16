// src/pages/SuperAdminDashboard.jsx
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BarChart3, Users, FileText, LogOut, Home, Edit3, Loader2 } from "lucide-react";

function SuperAdminDashboard() {
  const {token, user, logout } = useAuth();
  const navigate = useNavigate();
  const [license,setLicense] = useState([])
  const [users,setUsers] = useState([])
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    ativos: 0,
    inativos: 0,
    licencas: 0,
    ativas: 0,
  });

    useEffect(() => {
      if (!token) return;
      fetch("http://localhost:3000/license/list", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setLicense(data))
        .catch((err) => console.error("Error fetching licenses:", err));
    }, [token]);
  
    useEffect(() => {
      if (!token) return;
      fetch("http://localhost:3000/user/list", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setUsers(data))
        .catch((error) => console.error("Error fetching stats:", error));

    }, [token]);
    
    const tot = users.filter((u)=>{
          if(u.isActive) {
            return u
          }
          return 0
        }) 

        const totInactive = users.filter((u)=>{
          if(!u.isActive) {
            return u
          }
          return 0
        }) 

        const totLicense = license.filter((l) => {
           if (l.state == 'active') {
            return l
           }
           return 0
        })


  
  useEffect(() => {
    setTimeout(() => {
      setStats({
        ativos: tot.length,
        licencas: license.length,
        ativas: totLicense.length,
        inativos: totInactive.length,
      });
      setLoading(false);
      
    }, 1500);
  }, );

  return (
    <div className="min-h-screen bg-[#0f111a] text-white p-8">
      {/* Header com perfil */}
      <div className="bg-[#1a1d2d] p-6 rounded-2xl shadow-lg mb-8 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold mb-4">
          {user?.name?.charAt(0) || "S"}
        </div>
        <h2 className="text-2xl font-bold">{user?.name || "Super Admin"}</h2>
        <p className="text-gray-400">{user?.email}</p>
        <p className="text-gray-400 text-sm mt-1">Código: {user?.id}</p>

        <div className="flex gap-4 mt-5">
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition">
            <Home size={18} /> Home
          </button>
          <button
            onClick={() => navigate("/edit-super-admin")}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg transition"
          >
            <Edit3 size={18} /> Editar Perfil
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
          >
            <LogOut size={18} /> Sair
          </button>
        </div>
      </div>

      {/* Painel de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-4 flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-blue-400" size={48} />
            <span className="ml-3 text-gray-400 text-lg">Carregando dados...</span>
          </div>
        ) : (
          <>
            <div className="bg-[#1a1d2d] p-6 rounded-xl shadow-lg flex flex-col items-center justify-center">
              <Users size={36} className="text-blue-400 mb-3" />
              <h3 className="text-lg font-semibold">Admins Ativos</h3>
              <p className="text-3xl font-bold mt-2 text-blue-500">{stats.ativos}</p>
            </div>

            <div className="bg-[#1a1d2d] p-6 rounded-xl shadow-lg flex flex-col items-center justify-center">
              <FileText size={36} className="text-green-400 mb-3" />
              <h3 className="text-lg font-semibold">Licenças Emitidas</h3>
              <p className="text-3xl font-bold mt-2 text-green-500">{stats.licencas}</p>
            </div>

            <div className="bg-[#1a1d2d] p-6 rounded-xl shadow-lg flex flex-col items-center justify-center">
              <BarChart3 size={36} className="text-yellow-400 mb-3" />
              <h3 className="text-lg font-semibold">Ativas</h3>
              <p className="text-3xl font-bold mt-2 text-yellow-500">{stats.ativas}</p>
            </div>

            <div className="bg-[#1a1d2d] p-6 rounded-xl shadow-lg flex flex-col items-center justify-center">
              <Users size={36} className="text-red-400 mb-3" />
              <h3 className="text-lg font-semibold">Admins Inativos</h3>
              <p className="text-3xl font-bold mt-2 text-red-500">{stats.inativos}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SuperAdminDashboard;
