import QRCode from 'qrcode'
import { createCanvas, loadImage } from "canvas";
import sharp from "sharp";
import fs from "fs";
//gera qr code em base64
const generateQRCodeBase64 = async (text) => {
    try {
        return await QRCode.toDataURL(text) // retorna uma string base64
    } catch (err) {
        throw new Error('Erro ao gerar o Qr code: '+ err.message)
    }
}

//gera qr code e salva como arquivo na pasta/uploads/qrcodes
const generateQRCodeFile = async (text, path) => {
    try{
        await QRCode.toFile(path, text, {
            errorCorrectionLevel: 'H', // mais resistente
            type: 'image/png',
            quality: 0.9,
            margin: 1, 
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        })
        return path
    }catch (err) {
        throw new Error('Erro ao gerar o Qr code: '+ err.message)
    }
}

const generateQRCodeWithText = async (url, codeText) => {
  try {
    const size = 500;
    const qrBuffer = await QRCode.toBuffer(url, {  // 👈 QR codifica a URL
      errorCorrectionLevel: "H",
      type: "png",
      quality: 0.9,
      margin: 1,
      width: size,
      color: { dark: "#000000", light: "#ffffff" },
    });

    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);

    const qrImg = await loadImage(qrBuffer);
    ctx.drawImage(qrImg, 0, 0, size, size);

    // desenhar o código no centro
    ctx.font = "bold 48px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const metrics = ctx.measureText(codeText);
    const textWidth = metrics.width + 20;
    const textHeight = 60;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(size / 2 - textWidth / 2, size / 2 - textHeight / 2, textWidth, textHeight);

    ctx.fillStyle = "#000000";
    ctx.fillText(codeText, size / 2, size / 2);

    const finalBuffer = canvas.toBuffer("image/png");
    return `data:image/png;base64,${finalBuffer.toString("base64")}`;
  } catch (err) {
    throw new Error("Erro ao gerar QR com texto: " + err.message);
  }
};



export {
    generateQRCodeBase64,
    generateQRCodeFile,
    generateQRCodeWithText
}