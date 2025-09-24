import e from "express";
import licenseController from '../controllers/license.controller.js'
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middlewar.js";
import upload from '../middlewares/upload.middleware.js'
const router = e.Router()

//rotas que apenas o admin pode acessar
router.post('/create',authMiddleware, upload.single("document"), adminMiddleware, licenseController.create)
router.put('/:id',authMiddleware, adminMiddleware, licenseController.update)
router.delete('/:id',authMiddleware, adminMiddleware, licenseController.remove)

//rotas para tirar estatisticas
router.get("/stats",authMiddleware,licenseController.stats)

//validacao publica com qr code
router.get('/validate/:code', licenseController.validate)

//listar todas licencas mas claro pode ser so admin tambem dependo da escalabilidade do dev
router.get('/list',authMiddleware, adminMiddleware, licenseController.list)

//buscar licenca por id admin
router.get('/:id',authMiddleware,adminMiddleware, licenseController.getById)
//rotas para dowload
router.get("/dowload/:id", authMiddleware, licenseController.dowloadProcessed)
router.get("/dowload/:id", authMiddleware, licenseController.downloadOriginal)



export default router