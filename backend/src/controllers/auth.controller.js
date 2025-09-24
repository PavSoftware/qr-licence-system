import authService from "../services/auth.service.js";
import generateToken from '../utils/auth.utils.js'

const login = async (req,res) => {
    try {
        const { email, password } = req.body

        const user = await authService.loginUser(email, password)

        const token = generateToken(user)

        res.status(200).send({
            message: 'Login realizado com sucesso',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        })
    } catch (error) {
        res.status(401).send({ message: error.message })
    }
}

export default  login 