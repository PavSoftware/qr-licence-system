// src/pages/Licenses.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function Licenses() {
  const [search, setSearch] = useState("");
  const { token } = useAuth();
  const [licenses, setLicenses] = useState([]);
  const [stats, setStats] = useState(null);

  // Estados do formulário
  const [showForm, setShowForm] = useState(false);
  const [company, setCompany] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [file, setFile] = useState(null);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Novo estado de loading (exibe spinner)
  const [loading, setLoading] = useState(true);

  // Buscar licenças
  const fetchLicenses = async () => {
    try {
      const res = await fetch("http://localhost:3000/license/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const sorted = [...data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setLicenses(sorted);
    } catch (err) {
      console.error("Erro ao buscar licenças:", err);
    }
  };

  // Buscar estatísticas
  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:3000/license/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Erro ao buscar estatísticas:", err);
    }
  };

  // Buscar tudo quando o token mudar
  useEffect(() => {
    if (!token) return;

    const loadData = async () => {
      await Promise.all([fetchLicenses(), fetchStats()]);
      // dá um pequeno delay pra deixar o spinner mais suave
      setTimeout(() => setLoading(false), 2000);
    };

    loadData();
  }, [token]);

  // Spinner enquanto carrega
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0f111a] text-white">
        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-300 text-sm">Carregando licenças...</p>
      </div>
    );
  }

  // Submeter nova licença
  const handleCreateLicense = async (e) => {
    e.preventDefault();
    if (!file) return alert("Selecione um arquivo PDF!");

    try {
      const formData = new FormData();
      formData.append("company", company);
      formData.append("type", type);
      formData.append("location", location);
      formData.append("validUntil", validUntil);
      formData.append("document", file);

      const res = await fetch("http://localhost:3000/license/create", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const contentType = res.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        await res.json();
      } else {
        throw new Error(await res.text());
      }

      alert("Licença criada com sucesso!");
      setShowForm(false);
      setCompany("");
      setType("");
      setLocation("");
      setValidUntil("");
      setFile(null);
      fetchLicenses();
      fetchStats();
    } catch (err) {
      console.error(err);
      alert("Erro: " + err.message);
    }
  };

  // Filtro de pesquisa
  const filtered = licenses.filter(
    (l) =>
      (l.code || "").toLowerCase().includes(search.toLowerCase().trim()) ||
      (l.company || "").toLowerCase().includes(search.toLowerCase().trim())
  );

  // Paginação
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

  // Formatador de data
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString("pt-BR");
    } catch {
      return dateStr;
    }
  };

  return (
    <div>
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Licenças</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white"
        >
          {showForm ? "Fechar" : "Criar Licença"}
        </button>
      </div>

      {/* Formulário */}
      {showForm && (
        <form
          onSubmit={handleCreateLicense}
          className="bg-[#1a1d2d] p-6 rounded-lg shadow-lg mb-6 space-y-4"
        >
          <div>
            <label className="block text-sm text-gray-300 mb-1">Empresa</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg bg-[#0f111a] border border-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Origem (type)</label>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg bg-[#0f111a] border border-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Localização</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg bg-[#0f111a] border border-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Validade até</label>
            <input
              type="date"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg bg-[#0f111a] border border-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Upload do PDF</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              required
              className="w-full text-sm text-gray-400"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
          >
            Salvar
          </button>
        </form>
      )}

      {/* Pesquisa */}
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Pesquisar por código ou empresa..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-1/3 px-4 py-2 rounded-lg bg-[#0f111a] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto bg-[#1a1d2d] rounded-lg shadow-md">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#0f111a] text-gray-400">
            <tr>
              <th className="px-6 py-3">Código</th>
              <th className="px-6 py-3">Empresa</th>
              <th className="px-6 py-3">Validade</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length > 0 ? (
              paginated.map((l, i) => (
                <tr key={i} className="border-b border-gray-700">
                  <td className="px-6 py-4">{l.code}</td>
                  <td className="px-6 py-4">{l.company}</td>
                  <td className="px-6 py-4">{formatDate(l.validUntil)}</td>
                  <td className="px-6 py-4">
                    {l.state === "active" && (
                      <span className="px-3 py-1 text-sm rounded bg-green-700 text-white">
                        Ativa
                      </span>
                    )}
                    {l.state === "expired" && (
                      <span className="px-3 py-1 text-sm rounded bg-yellow-600 text-white">
                        Expirada
                      </span>
                    )}
                    {l.state === "revoked" && (
                      <span className="px-3 py-1 text-sm rounded bg-red-700 text-white">
                        Revogada
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={`http://localhost:3000/${l.documentURL}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Download PDF
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-400">
                  Nenhuma licença encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            Anterior
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-800 text-white"
                  : "bg-gray-700 text-gray-200 hover:bg-gray-600"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}

export default Licenses;
