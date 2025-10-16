import User from "../models/User.js";

const seedAdmin = async () => {
    try {
        const adminSuper = await User.findOne({ role: 'super-admin' })

        if ( !adminSuper ) {
            const admin = new User({
                name: 'Super Admin',
                email: 'superadmin@gmail.com',
                password: 'superadmin1234',
                role: 'super-admin'
            })

            await admin.save()

            console.log('usuario criado com sucesso');
        }else { 
            console.log('super admin ja existe, seed ignorado');
            
        }
    } catch (error) {
        console.error(' erro ao criar admin seed:', error.message);
    }
}

export default seedAdmin