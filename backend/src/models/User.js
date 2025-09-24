import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'O nome e obrigatorio'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'O email e obrigatorio'],
            unique: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Formato de email invalido']
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        role: {
            type: String,
            enum: ['admin'],
            default: 'admin'
        },
        isActive:{
            type: Boolean,
            default: true
        },
        lastLogin: {
            type: Date
        },
    },
    {timestamps: true}
);

// Hashear antes de guardar no banco
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

// Comparar senha para login
UserSchema.methods.comparePassword = async function (loginPassword) {
    return await bcrypt.compare(loginPassword, this.password)
}

const User = mongoose.model('User', UserSchema)

export default User
