import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const authMiddleware = async (req,res,next) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).send({ message: 'Token nao fornecido' })
    }

    const token = authHeader.split(' ')[1]

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id).select('-password')

        if(!user) return res.status(401).send( { message: 'Usuario nao encontrado'})

        req.user = user // para injectsr o user na request
        next()
    }catch (error) {
        res.status(500).send({message: 'erro: ' + error.message})
    }
}

//Middleware para admins
export const adminMiddleware = (req,res,next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send({ message: 'Acesso negado: apenas admin' })
    }

    next()
}