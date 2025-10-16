import e from "express";
import userController from '../controllers/user.controller.js'
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middlewar.js";
import  { isSuperAdmin } from "../middlewares/role.middlewares.js";

const router = e.Router()

router.post( '/create', authMiddleware, isSuperAdmin, userController.register )

router.get( '/list',authMiddleware,isSuperAdmin, userController.listUsers )

router.patch('/update/:id', authMiddleware, isSuperAdmin, userController.UpDateSuperAdmin)

router.patch('/update/admin/:id', authMiddleware, isSuperAdmin, userController.upDateAdmins)
router.delete('/delete/:id', authMiddleware, isSuperAdmin, userController.deleteUser)
// router.post('/login', userController.loginAdmin)

export default router