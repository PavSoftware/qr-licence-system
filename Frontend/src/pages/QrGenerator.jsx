import { useState } from "react";
import QRCode from "qrcode";

function QrGenerator() {
  const [licenseCode, setLicenseCode] = useState("");
  const [autoGenerate, setAutoGenerate] = useState(false);
  const [qrUrl, setQrUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const code = autoGenerate ? "L-" + Date.now() : licenseCode.trim();

      if (!code) {
        alert("Digite o código ou marque a opção de gerar automático.");
        setLoading(false);
        return;
      }

      const validationUrl = `http://localhost:3000/license/validate/${code}`;

      // 1️ Gera o QR b64
      const qrData = await QRCode.toDataURL(validationUrl, {
        errorCorrectionLevel: "H",
        type: "image/png",
        width: 400,
        margin: 1,
        color: { dark: "#000000", light: "#ffffff" },
      });

      // 2️ Cria o canvas e desenha o QR + texto central
      const qrImg = new Image();
      qrImg.src = qrData;
      qrImg.onload = () => {
        const size = qrImg.width;
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = size;
        canvas.height = size;

        // Fundo branco
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, size, size);

        // Desenha o QR
        ctx.drawImage(qrImg, 0, 0, size, size);

        // 3️⃣ Adiciona o texto no centro
        const fontSize = Math.floor(size / 10);
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Caixa branca leve atrás do texto
        const textWidth = ctx.measureText(code).width;
        const textHeight = fontSize + 10;
        ctx.fillStyle = "#fff";
        ctx.fillRect(
          size / 2 - textWidth / 2 - 8,
          size / 2 - textHeight / 2,
          textWidth + 16,
          textHeight
        );

        // Texto preto no centro
        ctx.fillStyle = "#000000";
        ctx.fillText(code, size / 2, size / 2);

        // 4️⃣ Converte pra Base64
        const finalQr = canvas.toDataURL("image/png");
        setQrUrl(finalQr);

        // 🔄 Limpa o input automaticamente após gerar
        setLicenseCode("");

        setLoading(false);
      };
    } catch (err) {
      console.error("Erro ao gerar QR:", err);
      alert("Falha ao gerar o QR Code!");
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qrUrl) return;
    const link = document.createElement("a");
    link.href = qrUrl;
    link.download = `${licenseCode || "licenca"}-qr.png`;
    link.click();
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Gerador de QR Code (Super Admin)</h1>

      <div className="bg-[#1a1d2d] p-6 rounded-xl shadow-lg w-full max-w-lg mx-auto">
        <label className="block text-sm text-gray-300 mb-2">Código da Licença</label>
        <input
          type="text"
          placeholder="Digite o código ou gere automaticamente"
          value={licenseCode}
          onChange={(e) => setLicenseCode(e.target.value)}
          disabled={autoGenerate}
          className="w-full px-4 py-2 mb-4 rounded-lg bg-[#0f111a] border border-gray-700 text-white focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            checked={autoGenerate}
            onChange={() => setAutoGenerate(!autoGenerate)}
            className="mr-2"
          />
          <span className="text-gray-300">Gerar código automaticamente</span>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors font-semibold"
        >
          {loading ? "Gerando..." : "Gerar QR Code"}
        </button>

        {qrUrl && (
          <div className="mt-8 text-center">
            <img
              src={qrUrl}
              alt="QR Code"
              className="mx-auto border border-gray-700 rounded-lg p-2 bg-white"
            />
            <button
              onClick={handleDownload}
              className="mt-4 px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 font-semibold"
            >
              Download QR
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default QrGenerator;
