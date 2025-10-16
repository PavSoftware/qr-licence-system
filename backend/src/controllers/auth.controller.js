import authService from "../services/auth.service.js";
import generateToken from '../utils/auth.utils.js'

const login = async (req,res) => {
    try {
        const { email, password } = req.body

        const user = await authService.loginUser(email, password)

        const token = generateToken(user)

       if (user.isActive) {
         res.status(200).send({
            message: 'Login realizado com sucesso',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive
            },
            token
        })
       }else return res.status(200).send({message: 'Usuario nao se encontra activo', user: {isActive: user.isActive}})
    } catch (error) {
        res.status(401).send({ message: error.message })
    }
}

export default  login 