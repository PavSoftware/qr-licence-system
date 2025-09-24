import { useState } from "react";

function Licenses() {
  const [search, setSearch] = useState("");
  
  // Exemplo de dados (depois vamos buscar do backend)
  const licenses = [
    { code: "L-2500006810", company: "Empresa XPTO", validUntil: "2025-12-31", status: "VÁLIDA" },
    { code: "L-2500006811", company: "Empresa ABC", validUntil: "2025-12-31", status: "EXPIRADA" },
    { code: "L-2500006812", company: "Empresa 123", validUntil: "2025-12-31", status: "REVOGADA" },
  ];

  // Filtro de pesquisa
  const filtered = licenses.filter(
    (l) =>
      l.code.toLowerCase().includes(search.toLowerCase()) ||
      l.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Licenses</h1>

      {/* Barra de pesquisa */}
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Pesquisar por código ou empresa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/3 px-4 py-2 rounded-lg bg-[#0f111a] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto bg-[#1a1d2d] rounded-lg shadow-md">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#0f111a] text-gray-400">
            <tr>
              <th className="px-6 py-3">License Code</th>
              <th className="px-6 py-3">Company</th>
              <th className="px-6 py-3">Valid Until</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l, i) => (
              <tr key={i} className="border-b border-gray-700">
                <td className="px-6 py-4">{l.code}</td>
                <td className="px-6 py-4">{l.company}</td>
                <td className="px-6 py-4">{l.validUntil}</td>
                <td className="px-6 py-4">
                  {l.status === "VÁLIDA" && (
                    <span className="px-3 py-1 text-sm rounded bg-green-700 text-white">
                      {l.status}
                    </span>
                  )}
                  {l.status === "EXPIRADA" && (
                    <span className="px-3 py-1 text-sm rounded bg-yellow-600 text-white">
                      {l.status}
                    </span>
                  )}
                  {l.status === "REVOGADA" && (
                    <span className="px-3 py-1 text-sm rounded bg-red-700 text-white">
                      {l.status}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <button className="px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white">
                    Download PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Licenses;
