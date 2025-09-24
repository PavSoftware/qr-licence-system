import User from "../models/User.js";

const seedAdmin = async () => {
    try {
        const adminExists = await User.findOne({ role: 'admin'})

        if (!adminExists) {
            const admin = new User({
                name: 'Super Admin',
                email: 'admin@gmail.com',
                password: '11235813',
                role: 'admin'
            })

            await admin.save()

            console.log('usuario criado com sucesso');
        }else { 
            console.log('admin ja existe, seed ignorado');
            
        }
    } catch (error) {
        console.error(' erro ao criar admin seed:', error.message);
    }
}

export default seedAdmin