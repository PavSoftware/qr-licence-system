import e from "express";
import { generateQRCodeBase64, generateQRCodeFile , generateQRCodeWithText} from "../utils/qrcode.utils.js";
import path from "path";
import { fileURLToPath } from "url";

const router = e.Router();

// rota para gerar QR base64
router.get("/qr-base64", async (req, res) => {
  try {
    const { text = "L-2500006110" } = req.query;
    const qrCode = await generateQRCodeBase64(text);

    res.status(200).send({ text, qrCode });
  } catch (error) {
    res.status(500).send({ message: "Erro ao gerar QR base64", error: error.message });
  }
});

// rota para gerar QR e salvar como arquivo
router.get("/qr-file", async (req, res) => {
  try {
    const { text = "L-2500006110" } = req.query;

    // garantir pasta uploads/qrcodes
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const qrPath = path.join(__dirname, "../../uploads/qrcodes", `${Date.now()}_qr.png`);

    const filePath = await generateQRCodeFile(text, qrPath);

    res.status(200).send({
      message: "QR salvo com sucesso",
      text,
      file: filePath
    });
  } catch (error) {
    res.status(500).send({ message: "Erro ao gerar QR file", error: error.message });
  }
});


router.get("/qr-text", async (req, res) => {
  try {
    const { text = "L-2500006810" } = req.query;

    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const qrPath = path.join(__dirname, "../../uploads/qrcodes", `${Date.now()}_qr_text.png`);

    const file = await generateQRCodeWithText(text, qrPath);

    res.status(200).send({
      message: "QR com texto gerado",
      text,
      file
    });
  } catch (error) {
    res.status(500).send({ message: "Erro ao gerar QR com texto", error: error.message });
  }
});

export default router;
