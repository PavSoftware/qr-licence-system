import licence from "../models/licence.js";
import { generateQRCodeWithText } from '../utils/qrcode.utils.js';
import path from "path";
import { fileURLToPath } from "url";
import { inserQrIntoPdf } from '../utils/pdf.utils.js'
import fs from "fs"


//criar uma licenca nova
const createLicense = async (data, filePath, userId, originalName) => {
  if (!filePath) throw new Error("Caminho do arquivo não definido")

  const existingLicense = await licence.findOne({
    $or: [{ documentURL: filePath }, { originalName }],
    state: 'active',
    validUntil: { $gte: new Date() }
  })

  if (existingLicense) throw new Error('Ja existe uma licenca activa para este documento')

  const licenseCode = "LIC-" + Date.now()
  const validationURL = `${process.env.Base_URL}/license/validate/${licenseCode}`

  // 🔹 Gera QR em base64
  const qrBase64 = await generateQRCodeWithText(validationURL, licenseCode)

  const inputPath = path.join(process.cwd(), filePath)
  const processDir = path.join(process.cwd(), "uploads/licenses/processed")
  if (!fs.existsSync(processDir)) fs.mkdirSync(processDir, { recursive: true })

  const outputPath = path.join(processDir, `${licenseCode}.pdf`)
  const qrConfig = data.qrConfig || { x: 450, y: 50, width: 120, height: 120 }

  // 🔹 Injeta QR
  await inserQrIntoPdf(inputPath, outputPath, qrBase64, qrConfig)

  return await licence.create({
    ...data,
    code: licenseCode,
    qrCode: qrBase64, // opcional
    documentOriginal: filePath,
    originalName,
    documentURL: `uploads/licenses/processed/${licenseCode}.pdf`,
    createdBy: userId
  })
}



//buscar licenca por id
const findLicenseById = async (id) => {
    return await licence.findById(id)
}


//buscar all licencas (escalavel para caso se precise fazer buscas com filtros)
const findAllLicenses = async (filter = {} ) => {
    return await licence.find(filter)
} 


//buscar licenca por codigo unico
const findLicenseBycode = async (code) => {
    return await licence.findOne({ code })
}


//actualizar licenca
const updateLicense = async (id, data) => {
    return await licence.findByIdAndUpdate(id, data, { new: true})
}


//deletar licenca
const deleteLicense = async (id) => {
    return await licence.findByIdAndDelete(id)
}


//Diferencial dentro do service a gente vai validar a licenca pelo cpodigo usado para rota publica via QR
const validateLicense = async (code) => {
    const license = await licence.findOne({ code })

    if (!license) return  { valid: false, message: 'Licenca nao encontrada'}

    if (license.state !== 'active') 
        return {valid: false, message: 'licenca nao activa'}
    if (license.validUntil < new Date()) return { valid: false, message: 'Licenca expirada'}

    return {valid: true, data: license}
}

//estatisticas das licencas
const getLicenseStates = async () => {
    const total = await licence.countDocuments()
    const active = await licence.countDocuments({ state: "active" })
    const inactive = await licence.countDocuments({ state: "inactive "})
    const revoked = await licence.countDocuments({ state: 'revoked'})
    const expired = await licence.countDocuments({ validUntil: {$lt: new Date() } })

    const latest = await licence.find().sort({ createdAt: -1 }).limit(5)

    return {
        total,
        active,
        inactive,
        revoked,
        expired,
        latest
    }
}

export {
    createLicense,
    findAllLicenses,
    findLicenseById,
    findLicenseBycode,
    updateLicense,
    deleteLicense,
    validateLicense,
    getLicenseStates
}