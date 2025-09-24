import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'

import userRoute from './routes/user.route.js'
import licenseRoute from './routes/license.route.js'
import authRoute from './routes/auth.route.js'
import testRoute from './routes/test.routes.js'


dotenv.config()

const app = express()
const uploadsPath = path.resolve("uploads")
//Middlewars
app.use(cors())
app.use(express.json())
app.use("/uploads", express.static(uploadsPath))

//Rotas
app.use('/user',userRoute)
app.use('/license', licenseRoute)
app.use('/auth', authRoute)
app.use('/test', testRoute)

export default app