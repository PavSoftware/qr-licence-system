import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import 'bootstrap-icons/font/bootstrap-icons.css'
import LicenseTable from '../components/LicenseTable/LicenseTable'

export default function Profile() {
  const { user } = useAuth()
  const [showCreateAdmin, setShowCreateAdmin] = useState(false)
   const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [licenses, setLicenses] = useState([]);

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:3000/license/list", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setLicenses(data))
      .catch((err) => console.error("Error fetching licenses:", err));
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:3000/license/stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((error) => console.error("Error fetching stats:", error));
  }, [token]);

  if (!stats) return <p>Carregando estatísticas...</p>;
  if (!user) return <p>Carregando...</p>

  const isSuperAdmin = user.role === 'super-admin'

  return (
    <div className="max-w-3xl mx-auto p-6 text-center">
      {/* Avatar */}
      <div className="flex justify-center">
        <div className="relative w-[6rem] h-[6rem] rounded-full border-4 border-amber-50 flex items-center justify-center text-2xl font-bold text-white bg-gray-700">
          {user.name?.charAt(0)}
          {user.name?.charAt(1)}
        </div>
      </div>

      {/* Nome e Role */}
      <h1 className="mt-4 text-2xl font-semibold text-white">
        {user.name}
      </h1>
      <p className="text-gray-200 mt-0.5">Perfil do Lunda Norte</p>

      <p
        className={`mt-2 inline-block px-3 py-1 text-sm rounded-full ${
          isSuperAdmin
            ? 'bg-purple-600 text-white'
            : 'text-white'
        }`}
      >
        {user.role}
      </p>

      {/* Infos rápidas */}
      <div className="flex justify-center gap-6 text-gray-200 mt-4 text-sm">
        <span className="flex items-center gap-1">
          <i className="bi bi-code-slash"></i>
          {user.id}
        </span>
        <span className="flex items-center gap-1">
          <i className="bi bi-whatsapp"></i>
          +244 9xx-xxx-xxx
        </span>
        <span className="flex items-center gap-1">
          <i className="bi bi-at"></i>
          {user.email}
        </span>
      </div>

     <div className='flex items-center justify-center gap-10'>
       {/* Métricas */}
      <div className="flex justify-center gap-8 mt-6">
        <div className="text-center">
          <strong className="text-lg">0</strong>
          <p className="text-gray-500 text-sm">Conexões</p>
        </div>
        <div className="text-center">
          <strong className="text-lg">230</strong>
          <p className="text-gray-500 text-sm">Publicações</p>
        </div>
      </div>

      {/* Botões normais */}
      <div className="flex justify-center gap-4 mt-6">
        <button className="px-6 py-2 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold">
          Publicar
        </button>
        <button className="px-6 py-2 rounded-full border border-yellow-500 text-yellow-600 hover:bg-yellow-100">
          Meu CV
        </button>
      </div>
     </div>

      {/* Seções exclusivas do Super Admin */}
      {isSuperAdmin && (
        <div className="mt-10 space-y-6">
          {/* Atalhos */}
          <div className="flex justify-center gap-6 text-2xl text-gray-700">
            <i className="bi bi-house-door cursor-pointer hover:text-yellow-500"></i>
            <i className="bi bi-pencil cursor-pointer hover:text-yellow-500"></i>
          </div>

          {/* Form Create Admin */}
          <button
            onClick={() => setShowCreateAdmin(!showCreateAdmin)}
            className="mt-4 px-6 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold"
          >
            {showCreateAdmin ? 'Fechar' : 'Criar Admin'}
          </button>

          {showCreateAdmin && (
            <div className="bg-gray-100 p-6 rounded-xl text-left max-w-md mx-auto">
              <h2 className="text-lg font-bold mb-4 text-gray-700">Criar novo Admin</h2>
              <form className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-semibold text-gray-600">Nome</label>
                  <input
                    type="text"
                    className="w-full p-2 rounded-lg border border-gray-300"
                    placeholder="Nome do Admin"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-semibold text-gray-600">Email</label>
                  <input
                    type="email"
                    className="w-full p-2 rounded-lg border border-gray-300"
                    placeholder="Email do Admin"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-semibold text-gray-600">Senha</label>
                  <input
                    type="password"
                    className="w-full p-2 rounded-lg border border-gray-300"
                    placeholder="Senha do Admin"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white"
                >
                  Criar Admin
                </button>
              </form>
            </div>
          )}

        </div>
      )}
       <LicenseTable licenses={licenses.slice(0, 5)} state={stats}></LicenseTable>
    </div>
  )
}
