import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; // ⬅️ Importa o hook de navegação
import { ArrowLeftCircle, Save } from "lucide-react";

function EditSuperAdmin() {
  const { user, token, setUser } = useAuth();
  const navigate = useNavigate(); // ⬅️ Inicializa o hook

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`http://localhost:3000/user/update/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erro ao atualizar perfil");

      //Atualiza o estado global e o localStorage
      const updatedUser = data.user || { ...user, name, email };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("Perfil atualizado com sucesso!");

      //Redireciona para o dashboard após sucesso
      navigate(user.role === "super-admin" ? "/super-admin" : "/dashboard");
    } catch (error) {
      alert("Erro: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f111a] text-white flex justify-center p-8">
      <div className="bg-[#1a1d2d] rounded-2xl shadow-lg w-full max-w-2xl p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Editar Perfil</h1>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition"
          >
            <ArrowLeftCircle size={20} />
            Voltar
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Nome */}
          <div>
            <label className="block text-sm mb-2 text-gray-400">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-[#0f111a] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm mb-2 text-gray-400">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-[#0f111a] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Senha */}
          <div>
            <label className="block text-sm mb-2 text-gray-400">Nova Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-[#0f111a] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Confirmar senha */}
          <div>
            <label className="block text-sm mb-2 text-gray-400">
              Confirmar Nova Senha
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-[#0f111a] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Botão */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 transition"
          >
            <Save size={20} />
            {loading ? "Salvando..." : "Salvar Alterações"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditSuperAdmin;
