import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { MoreVertical, Trash2, Power, PlusCircle } from "lucide-react";

function ManageAdmins() {
  const { token, user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [menuAberto, setMenuAberto] = useState(null);
  const [confirmarDelete, setConfirmarDelete] = useState(null);
  const [pesquisa, setPesquisa] = useState("");
  const [abrirForm, setAbrirForm] = useState(false);
  const [novoAdmin, setNovoAdmin] = useState({ nome: "", email: "", senha: "" });
  const [loading, setLoading] = useState(true); // 🔹 estado de carregamento

  // Buscar todos os admins (somente super-admin)
  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/user/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      // ⏱Delay suave de 1.5s antes de mostrar os dados
      setTimeout(() => {
        setAdmins(data);
        setLoading(false);
      }, 1500);
    } catch (err) {
      console.error("Erro ao carregar admins:", err);
      setLoading(false);
    }
  };

  // Criar novo admin
  const handleCriarAdmin = async (e) => {
    e.preventDefault();
    if (!novoAdmin.nome || !novoAdmin.email || !novoAdmin.senha) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/user/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: novoAdmin.nome,
          email: novoAdmin.email,
          password: novoAdmin.senha,
          role: "admin",
        }),
      });

      if (!res.ok) throw new Error("Erro ao criar admin");
      alert("Admin criado com sucesso!");
      setAbrirForm(false);
      setNovoAdmin({ nome: "", email: "", senha: "" });
      fetchAdmins();
    } catch (err) {
      console.error(err);
      alert("Erro: " + err.message);
    }
  };

  // Ativar / Desativar admin
  const toggleAtivo = async (id, currentState) => {
    try {
      const res = await fetch(`http://localhost:3000/user/update/admin/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !currentState }),
      });

      if (!res.ok) throw new Error("Erro ao atualizar status");
      fetchAdmins();
      setMenuAberto(null);
    } catch (err) {
      console.error("Erro ao ativar/desativar:", err);
    }
  };

  // Eliminar admin
  const eliminarAdmin = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/user/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao eliminar admin");
      fetchAdmins();
      setConfirmarDelete(null);
    } catch (err) {
      console.error("Erro ao eliminar admin:", err);
    }
  };

  // Buscar admins no carregamento
  useEffect(() => {
    if (user?.role === "super-admin") fetchAdmins();
  }, [token]);

  // Filtro
  const adminsFiltrados = admins.filter(
    (a) =>
      a.name?.toLowerCase().includes(pesquisa.toLowerCase()) ||
      a.email?.toLowerCase().includes(pesquisa.toLowerCase())
  );

  return (
    <div className="p-8 bg-[#0f111a] min-h-screen">
      <div className="bg-[#0f111a] shadow-md rounded-2xl p-6">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-200">Gerir Admins</h2>
          <button
            onClick={() => setAbrirForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <PlusCircle size={18} />
            Criar Admin
          </button>
        </div>

        {/* Campo de pesquisa */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="🔍 Pesquisar..."
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            className="w-full text-gray-200 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* 🔹 Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p>Carregando admins...</p>
          </div>
        ) : adminsFiltrados.length === 0 ? (
          <p className="text-gray-400 text-center py-8">Nenhum admin encontrado.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-300 text-sm border-b">
                <th>Status</th>
                <th>Nome</th>
                <th>E-Mail</th>
                <th>Role</th>
                <th>Último Login</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {adminsFiltrados.map((admin) => (
                <tr key={admin._id} className="border-b hover:bg-gray-800 transition">
                  <td className="py-3">
                    <span
                      className={`inline-block w-3 h-3 rounded-full ${
                        admin.isActive ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></span>
                  </td>
                  <td className="py-3 text-gray-200">{admin.name}</td>
                  <td className="py-3 text-gray-200">{admin.email}</td>
                  <td className="py-3 text-gray-200">{admin.role}</td>
                  <td className="py-3 text-gray-200">
                    {admin.lastLogin
                      ? new Date(admin.lastLogin).toLocaleDateString("pt-PT")
                      : "-"}
                  </td>
                  <td className="relative text-right">
                    <button
                      onClick={() => setMenuAberto(menuAberto === admin._id ? null : admin._id)}
                      className="p-2 rounded text-gray-500 hover:bg-gray-200"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {menuAberto === admin._id && (
                      <div className="absolute right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-44">
                        <button
                          onClick={() => toggleAtivo(admin._id, admin.isActive)}
                          className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 gap-2"
                        >
                          <Power size={16} />
                          {admin.isActive ? "Desativar" : "Ativar"}
                        </button>
                        <button
                          onClick={() => setConfirmarDelete(admin._id)}
                          className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100 gap-2"
                        >
                          <Trash2 size={16} />
                          Eliminar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Modal de confirmação */}
        {confirmarDelete && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-20">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <p className="mb-4 text-gray-800 font-medium">
                Tens certeza que queres eliminar este admin?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => eliminarAdmin(confirmarDelete)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                >
                  Sim, eliminar
                </button>
                <button
                  onClick={() => setConfirmarDelete(null)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de criação */}
        {abrirForm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-20">
            <form
              onSubmit={handleCriarAdmin}
              className="bg-white p-6 rounded-lg shadow-lg w-96"
            >
              <h3 className="text-xl text-black font-semibold mb-4">
                Criar Novo Admin
              </h3>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nome"
                  value={novoAdmin.nome}
                  onChange={(e) => setNovoAdmin({ ...novoAdmin, nome: e.target.value })}
                  className="w-full text-black border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  placeholder="E-mail"
                  value={novoAdmin.email}
                  onChange={(e) => setNovoAdmin({ ...novoAdmin, email: e.target.value })}
                  className="w-full text-black border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="password"
                  placeholder="Senha"
                  value={novoAdmin.senha}
                  onChange={(e) => setNovoAdmin({ ...novoAdmin, senha: e.target.value })}
                  className="w-full text-black border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setAbrirForm(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Criar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageAdmins;
