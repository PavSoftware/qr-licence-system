import fs from 'fs'
import { PDFDocument } from 'pdf-lib'

/**
 * Insere um QR Code (em base64 ou ficheiro) dentro de um PDF.
 * @param {string} inputPath - caminho do PDF original
 * @param {string} outputPath - caminho do PDF processado
 * @param {string} qrSource - QR Code em base64 ("data:image/png;base64,...") ou caminho para .png
 * @param {object} position - { x, y, width, height }
 */
const inserQrIntoPdf = async (
  inputPath,
  outputPath,
  qrSource,
  position = { x: 600, y: 400, width: 500, height: 500 }
) => {
  // Lê PDF original
  const existingPdfBytes = fs.readFileSync(inputPath)
  const pdfDoc = await PDFDocument.load(existingPdfBytes)
  const pages = pdfDoc.getPages()
  const firstPage = pages[0]

  let qrImageBytes

  // 🔹 Se for base64 (data:image/png;base64,...)
  if (qrSource.startsWith('data:image')) {
    qrImageBytes = Buffer.from(qrSource.split(',')[1], 'base64')
  } 
  // 🔹 Se for caminho de ficheiro
  else if (fs.existsSync(qrSource)) {
    qrImageBytes = fs.readFileSync(qrSource)
  } 
  else {
    throw new Error("QR inválido: precisa ser base64 ou caminho de ficheiro existente")
  }

  // Embed QR
  const qrImage = await pdfDoc.embedPng(qrImageBytes)

  // Desenha QR na posição escolhida
  firstPage.drawImage(qrImage, {
    x: 60,
    y: 160,
    width: 255,
    height: 260
  })

  // Salva novo PDF
  const pdfBytes = await pdfDoc.save()
  fs.writeFileSync(outputPath, pdfBytes)

  return outputPath
}

export { inserQrIntoPdf }
