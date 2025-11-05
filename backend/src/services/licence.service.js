import licence from "../models/licence.js";
import { generateQRCodeWithText } from "../utils/qrcode.utils.js";
import path from "path";
import { fileURLToPath } from "url";
import { inserQrIntoPdf } from "../utils/pdf.utils.js";
import fs from "fs";

// 🔹 Criar uma licença nova
const createLicense = async (data, filePath, userId, originalName) => {
  if (!filePath) throw new Error("Caminho do arquivo não definido");

  const existingLicense = await licence.findOne({
    $or: [{ documentURL: filePath }, { originalName }],
    state: "active",
    validUntil: { $gte: new Date() },
  });

  if (existingLicense) throw new Error("Já existe uma licença ativa para este documento");

  const licenseCode = "L-" + Date.now();
  const validationURL = `${process.env.Base_URL}/license/validate/${licenseCode}`;

  // 🔹 Gera QR em base64
  const qrBase64 = await generateQRCodeWithText(validationURL, licenseCode);

  const inputPath = path.join(process.cwd(), filePath);
  const processDir = path.join(process.cwd(), "uploads/licenses/processed");
  if (!fs.existsSync(processDir)) fs.mkdirSync(processDir, { recursive: true });

  const outputPath = path.join(processDir, `${licenseCode}.pdf`);
  const qrConfig = data.qrConfig || { x: 450, y: 50, width: 120, height: 120 };

  // 🔹 Injeta QR no PDF
  await inserQrIntoPdf(inputPath, outputPath, qrBase64, qrConfig);

  // 🔹 Normaliza o estado (remove espaços, converte para minúsculo)
  const normalizedState = (data.state || "active").trim().toLowerCase();

    return await licence.create({
        ...data,
        state: (data.state && data.state.trim().toLowerCase()) === 'inactive' 
            ? 'inactive' 
            : 'active', // 🧱 força "active" se vier vazio, null, undefined, etc
        code: licenseCode,
        qrCode: qrBase64,
        documentOriginal: filePath,
        originalName,
        documentURL: `uploads/licenses/processed/${licenseCode}.pdf`,
        createdBy: userId
        });


};

// 🔹 Buscar licença por ID
const findLicenseById = async (id) => {
  return await licence.findById(id);
};

// 🔹 Buscar todas as licenças
const findAllLicenses = async (filter) => {
  return await licence
    .find(filter)
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });
};

// 🔹 Buscar licença por código
const findLicenseBycode = async (code) => {
  return await licence.findOne({ code });
};

// 🔹 Atualizar licença
const updateLicense = async (id, data) => {
  if (data.state) data.state = data.state.trim().toLowerCase();
  return await licence.findByIdAndUpdate(id, data, { new: true });
};

// 🔹 Deletar licença
const deleteLicense = async (id) => {
  return await licence.findByIdAndDelete(id);
};

// 🔹 Validar licença (usada pela rota pública /license/validate/:code)
const validateLicense = async (code) => {
  const license = await licence.findOne({ code });

  if (!license) return { valid: false, message: "Licença não encontrada" };

  // Normaliza o valor antes de comparar
  const currentState = license.state?.trim().toLowerCase();

  if (currentState !== "active") {
    return { valid: false, message: "Licença não ativa" };
  }

  if (license.validUntil < new Date()) {
    return { valid: false, message: "Licença expirada" };
  }

  return { valid: true, data: license };
};

// 🔹 Estatísticas das licenças
const getLicenseStates = async () => {
  const total = await licence.countDocuments();
  const active = await licence.countDocuments({ state: "active" });
  const inactive = await licence.countDocuments({ state: "inactive" });
  const revoked = await licence.countDocuments({ state: "revoked" });
  const expired = await licence.countDocuments({ validUntil: { $lt: new Date() } });

  const latest = await licence.find().sort({ createdAt: -1 }).limit(5);

  return {
    total,
    active,
    inactive,
    revoked,
    expired,
    latest,
  };
};

export {
  createLicense,
  findAllLicenses,
  findLicenseById,
  findLicenseBycode,
  updateLicense,
  deleteLicense,
  validateLicense,
  getLicenseStates,
};
