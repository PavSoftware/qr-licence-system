import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import 'bootstrap-icons/font/bootstrap-icons.css'
import LicenseTable from '../components/LicenseTable/LicenseTable'

export default function Profile() {
  const { user, token } = useAuth()
  const [stats, setStats] = useState(null)
  const [licenses, setLicenses] = useState([])

  useEffect(() => {
    if (!token) return

    // Buscar lista de licenças
    fetch("http://localhost:3000/license/list", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setLicenses(data))
      .catch((err) => console.error("Erro ao buscar licenças:", err))
  }, [token])

  useEffect(() => {
    if (!token) return

    // Buscar estatísticas gerais
    fetch("http://localhost:3000/license/stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((error) => console.error("Erro ao buscar estatísticas:", error))
  }, [token])

  if (!stats) return <p>Carregando estatísticas...</p>
  if (!user) return <p>Carregando...</p>

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
      <h1 className="mt-4 text-2xl font-semibold text-white">{user.name}</h1>
      <p className="text-gray-200 mt-0.5">Perfil do Lunda Norte</p>

      <p className="mt-2 inline-block px-3 py-1 text-sm rounded-full bg-yellow-600 text-white">
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

      {/* Métricas e botões */}
      <div className="flex flex-col items-center justify-center mt-8 gap-6">
        {/* Métricas */}
        <div className="flex justify-center gap-8">
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
          <a
            href="/licenses"
            className="px-6 py-2 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold"
          >
            Criar Licença
          </a>
          <a
            href="/licenses"
            className="px-6 py-2 rounded-full border border-yellow-500 text-yellow-600 hover:bg-yellow-100"
          >
            Minhas Licenças
          </a>
        </div>
      </div>

      {/* Tabela de licenças */}
      <div className="mt-10">
        {licenses.length > 0 ? (
          <LicenseTable licenses={licenses.slice(0, 5)} state={stats} />
        ) : (
          <p className="px-6 py-4 text-center text-gray-400">
            Nenhuma licença encontrada.
          </p>
        )}
      </div>
    </div>
  )
}
