import multer from "multer";
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'
import { dir } from "console";


//pastas
const UPLOADS_ROOT = path.resolve("uploads")
const LICENSES_DIR = path.join(UPLOADS_ROOT, "licenses")
const QRCODES_DIR = path.join(UPLOADS_ROOT, "qrcodes")

//storage com nome unico
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, LICENSES_DIR)
    },
    filename : (req, file, cb) => {
        const ext = path.extname(file.originalname).toLocaleLowerCase()
        const unique = `${Date.now()} - ${ crypto.randomBytes(6).toString("hex")}`
        cb(null, `${unique}${ext}`)
    }
})

//aceita apena pdf
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true)
    }else{
        cb(new Error("somente arquivo pdf sao permitidos"), false)
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 20 * 1024 * 1024}
})

export default upload