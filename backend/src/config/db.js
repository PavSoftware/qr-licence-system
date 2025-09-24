import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect (process.env.DB_URL)

        console.log('mongo connectado');
        

    } catch (error) {
        console.log('erro ao conectar mongo: ' + error.message);
        process.exit(1)
        
    }
}