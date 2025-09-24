import userService from '../services/user.service.js';
import generateToken from '../utils/auth.utils.js';


const register =  async (req,res) =>{
    try {
        const { name, email, password} = req.body

        const userExists = await userService.findOneUser(email)

        if (userExists) return res.status(401).send({ message: 'Email ja foi cadstrado'})

        const user = await userService.createUser({ name, email, password, role: 'admin' })
        const token = generateToken(user)

        res.status(201).send({message: 'usuario criado com sucesso', user: { id: user._id, name: user.name, email: user.email, role: user.role },
        token
    })
    } catch (error) {
        res.status(500).send({message: 'erro: ' + error.message})
    }
}

// const loginAdmin = async (req,res)=>{
//     try {
//         const {email,password} = req.body

//         const user = await userService.findOneUser(email)
//         if (!user) return res.status(404).send({message: 'user nao encontrado'})
            
//         const isMatch = await user.comparePassword(password)
//         if (!isMatch) return res.status(401).send({message: 'senha incorreta'})

//         const token = generateToken(user)

//         res.status(200).send({
//             message: 'login efectuado com sucesso',
//             user: {id: user._id, name: user.name, email: user.email, role: user.role},
//             token
//         });

//     } catch (error) {
//         res.status(500).send({ message: 'erro: ' + error.message })
//     }
// }

export default { register}