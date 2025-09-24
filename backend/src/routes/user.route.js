import e from "express";
import userController from '../controllers/user.controller.js'


const router = e.Router()

router.post( '/create', userController.register )
// router.post('/login', userController.loginAdmin)

export default router