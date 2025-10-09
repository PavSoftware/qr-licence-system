// src/pages/Validate.jsx
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"

function Validate() {
  const { code: codeFromUrl } = useParams()
  const [code, setCode] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const img = "/OIP.webp"
  const formatDate = (dateStr) => {
    if (!dateStr) return "—"
    return new Date(dateStr).toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  const handleValidate = async (licenseCode) => {
    if (!licenseCode) return
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:3000/license/validate/${licenseCode}`)
      const data = await res.json()
      setResult(data)
    } catch (err) {
      console.error(err)
      setResult({ valid: false, message: "Erro ao validar" })
    } finally {
      setLoading(false)
    }
  }

  // se vier pela rota, valida automaticamente
  useEffect(() => {
    if (codeFromUrl) {
      setCode(codeFromUrl)
      handleValidate(codeFromUrl)
    }
  }, [codeFromUrl])

  // cenário 1 → validando código via URL → layout estilo comprovante
  if (codeFromUrl) {
    if (loading) return <p className="text-center mt-10">Validando...</p>
    if (!result?.valid) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-lg max-w-lg">
            <h1 className="text-2xl font-bold mb-2">Licença inválida ❌</h1>
            <p>{result?.message || "Este código não corresponde a uma licença ativa."}</p>
          </div>
        </div>
      )
    }

    const license = result?.data
    const now = new Date()

    return (
      <div className="w-[100%] min-h-screen bg-white p-6">
        <div className="w-[100%] max-w-2xl mx-auto flex flex-col md:flex-row gap-6 p-6 items-start">
          {/* Left */}
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-full h-14 rounded-md  flex items-center justify-center text-white font-bold">
                <img className="w-42 h-22" src={img} alt="" />
              </div>
              <div className="flex collumn items-center">
                <p  className="text-gray-600 text-sm uppercase">Republica de Angola <br /> governo da provincia de luanda <br /> gestao e controlo de publicidade</p>
                {/* <h1 className="text-lg font-semibold">Codigo da licenca: {license.code ?? "—"}</h1>
                <p className="text-gray-600 text-sm">
                  {license.type ?? "—"} • {license.location ?? "—"}
                </p> */}
              </div>
            </div>

            <div className="text-xl font-bold text-gray-500 text-shadow-black mt-6 mb-4 text-center">Codigo da licenca: {license.code}</div>
            

            <div className="flex flex-col gap-8 mt-4">
              <div className="flex gap-2">
                <div className="text-sm text-gray-500">Validade até: </div>
                <div className="font-semibold text-sm text-gray-500">{formatDate(license.validUntil)}</div>
              </div>
              <div className="flex justify-around">
                <div className="text-sm text-gray-500">Estado</div>
                <span
                  className={`px-3 py-1 rounded-md font-semibold text-sm ${
                    license.state === "active"
                      ? "bg-green-100 text-green-700"
                      : license.state === "inactive"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {license.state}
                </span>
              </div>
            </div>

            <footer className="mt-40 ">
                  <p className="text-center text-sm text-gray-500"> Licença verificada em {formatDate(now)} — este comprovante digital confirma o estado publicado pela organização.</p>
            </footer>
          </div>

        </div>
      </div>
    )
  }

  // cenário 2 → validar pelo input
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Validar Licença</h1>
      <input
        type="text"
        placeholder="Digite o código da licença"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="px-4 py-2 rounded bg-[#0f111a] border border-gray-700 text-white mr-2"
      />
      <button
        onClick={() => handleValidate(code)}
        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-white"
      >
        Validar
      </button>

      {loading && <p className="mt-4 text-center">Validando...</p>}

      {result && !loading && (
        <div className="mt-6 p-4 bg-[#1a1d2d] rounded">
          {result.valid ? (
            <p className="text-green-400">
              Licença válida até {new Date(result.data.validUntil).toLocaleDateString()}
            </p>
          ) : (
            <p className="text-red-400">{result.message}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default Validate
