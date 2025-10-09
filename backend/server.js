import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import seedAdmin from "./src/config/adminSeed.js";
const PORT = process.env.PORT || 3000;

const startServer = async () => {
    connectDB()
    seedAdmin()
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}

startServer()