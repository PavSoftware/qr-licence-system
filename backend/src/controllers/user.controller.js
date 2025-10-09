import userService from '../services/user.service.js';
import generateToken from '../utils/auth.utils.js';


const register = async (req, res) => {
  try {
    // agora usa findOneUserById
    const requestingUser = await userService.findOneUserById(req.user._id);
    if (!requestingUser || requestingUser.role !== 'super-admin') {
      return res.status(403).send({ message: 'Acesso negado. Apenas super-admin pode registrar novos usuarios.' });
    }

    const { name, email, password } = req.body;

    // verifica se já existe pelo email
    const userExists = await userService.findOneUserByEmail(email);
    if (userExists) {
      return res.status(401).send({ message: 'Email já foi cadastrado' });
    }

    const user = await userService.createUser({
      name,
      email,
      password,
      role: 'admin',
      createdBy: req.user._id,
    });

    const token = generateToken(user);

    res.status(201).send({
      message: 'usuario criado com sucesso',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).send({ message: 'erro: ' + error.message });
  }
};


const listUsers = async (req,res) => {
    try {
        const role = 'admin'
        const admins = await userService.findAdmins(role)
        res.status(200).send(admins)
    } catch (error) {
        res.status(500).send({ message: 'erro ao listar usuarios', error: error.message })
    }
}



const deleteUser = async (req,res) => {
    try {
       const { id } = req.body
        const user = await userService.findOneUser(id)

        if (!user) return res.status(404).send({ message: 'usuario nao encontrado'})

        if (user.role === 'super-admin') return res.status(403).send({ message: 'nao e possivel apagar super-admin'})

        await userService.deleteUser( id )

        return res.status(200).send({ message: 'usuario apagado com sucesso' })
    } catch (error) {
      res.status(500).send({message: 'Erro: ' + error})
    }
} 

const UpDateSuperAdmin = async (req, res) => {
  try {
    const { id } = req.params; // o ID vem da URL
    const { name, email, password } = req.body;
    const userId = req.admin; // vem do middleware

    // garante que o super-admin só atualize a própria conta
    if (userId !== id) {
      return res.status(403).send({ message: 'Acesso negado: você só pode atualizar sua própria conta.' });
    }

    if (!name || !email || !password) {
      return res.status(400).send({ message: 'Por favor, preencha todos os campos.' });
    }

    const updatedUser = await userService.UpDateSuperAdmin({
      id,
      name,
      email,
      password,
    });

    if (!updatedUser) {
      return res.status(404).send({ message: 'Usuário não encontrado.' });
    }

    return res.status(200).send({
      message: 'Usuário atualizado com sucesso.',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    res.status(500).send({ message: 'Erro: ' + error.message });
  }
};

export default { register, listUsers, deleteUser, UpDateSuperAdmin}


















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