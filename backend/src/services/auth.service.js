import User from '../models/User.js'


const loginUser = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Usuario nao encontrado')
    }

    const isMatch = await user.comparePassword(password)

    if (!isMatch) throw  new Error('Senha incorrecta')

    //actualiza ultimo login
    user.lastLogin = new Date()
    await user.save()

    return user
}



export default { loginUser }