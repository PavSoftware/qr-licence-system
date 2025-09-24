import path from 'path'
import fs from 'fs'
import licence from '../models/licence.js'
import * as licenseService from '../services/licence.service.js'
import { fileURLToPath } from "url"
import { log } from 'console'

//criar  licenca
const create = async(req,res)=>{
    try {
        const userId = req.user?.id || null  //vem do middleware auth
        const file = req.file
       
        
        const filePath = file ? `uploads/licenses/${file.filename}` : null
        const originalName = file ? file.originalname : null

        //se qrConfig vier como string, parseamos
        let body = { ...req.body }
        
        if (body.qrConfig) {
            try {
                body.qrConfig = JSON.parse(body.qrConfig)
            } catch (error) {
                return res.status(400).send( { message: 'qrConfig invalido, precisa ser Json' } )
            }   
        }
        const license = await licenseService.createLicense(body, filePath, userId, originalName)

        res.status(201).json({
            message: 'licenca criada com sucesso',
            license
        })
    } catch (error) {
        if (req.file) {
            const uploadedPath = path.join(process.cwd(), 'uploads/licenses', req.file.filename)
            if (fs.existsSync(uploadedPath)) {
                fs.unlinkSync(uploadedPath)
            }
        }
       if (error.message.includes("ja existe uam licenca")) {
            return res.status(400).json( { message: error.message} )
       }

       res.status(500).json({ message: 'Erro ao criar licenca', error: error.message})
    }
}


//listar todas as licencas
const list = async (req,res)=> {
    try {
        const licenses = await licenseService.findAllLicenses()
        res.status(200).send(licenses)
    } catch (error) {
        res.status(500).send({ message: 'erro ao listar  licencas', error: error.message })
    }
}


//buscar licenca por ID
const getById = async (req, res) => {
    try {
        const { id } = req.params
        const license = await licenseService.findLicenseById(id)

        if (!license) 
            return res.status(404).send({ message: 'licenca nao encontrada' })

        res.send(license)

    } catch (error) {
        res.status(500).send({ message: 'erro licenca nao encontrada', error: error.message })
    }
}


//actualizar licenca
const update = async (req,res)=> {
    try {
        const { id } = req.params
        const data = req.body

        const updateLicense = await licenseService.updateLicense(id, data)

        if (!updateLicense) return res.status(404).send({ message: 'licenca nao encontrada' })

        res.send(
            {
                message: 'licenca actualizada com sucesso',
                updateLicense
            }
        )
    } catch (error) {
        res.status(500).send({ message: 'erro ao actualizar  licencas', error: error.message })
    }
}


//deletar licenca
const remove = async (req,res)=> {
    try {
        const { id } = req.params
        const deleted = await licenseService.deleteLicense(id)

        if (!deleted) return res.status(404).send({ message: 'licenca nao encontrada' })
        
        res.status(200).send({ message: 'licenca criada com sucesso' })
            
    } catch (error) {
        res.status(500).send({ message: 'erro ao eliminar  licencas', error: error.message })
    }
}


//validar licenca rota publica pequenos retoques pois ja foi feito algumas prevencoes no license.service.js
const validate = async (req,res)=> {
    try {
       const { code } = req.params
       const license = await licence.findOne( { code })

       if (!license) return res.status(404).send({ valid: false, message: 'Licenca nao encontrada' })



        //se nao estiver activa
        if (license.state !== "active") return res.status(400).send({  valid: false,message: "Licenca expirada"})

        //se estiver expirada
        if (license.validUntil < new Date()) {
            return res.json({ valid: false, message: 'Licenca expirada'})
        }

        //sucesso
        return res.json({
            valid: true,
            data: {
                code: license.code,
                company: license.company,
                type: license.type,
                location: license.location,
                validUntil: license.validUntil,
                state: license.state
            }
        })

        // //checar validade
        // const now = new Date()
        // const isValid = license.state === 'active' && new Date(license.validUntil) >= now

        // //decide se o cliente quer HTML (NAVEGADOR) PU JSON (api)
        // const wantsHTML = req.headers.accept && req.headers.accept.includes('text/html')

        // if (!wantsHTML) {
        //     //retorna uma api
        //     return res.status(200).send({
        //         valid: isValid,
        //         data: {
        //             code: license.code,
        //             company: license.company,
        //             type: license.type,
        //             location: license.location,
        //             validUntil: license.validUntil,
        //             state: license.state
        //         }
        //     })
        // }

        //--- Montar o Html mais se o dev que baixar o projecto quiser vc pode gerar isso no front poe em comentario e trabalha
        //Escolhe qual fonte da imagem QR usar: 
        //preferimos base64 em license.qrcode, se nao existir usa qrCodeURL publico
        // const qrImg = license.qrCode ? license.qrCode : (license.documentURL ? `${process.env.BASE_URL.replace(/\/$/, '')}/${license.documentURL.replace(/^\/+/, '')}` : '')

        // const formatDate = (d) => {
        //     try {
        //         return new Date(d).toLocaleString('pt-PT', { timeZone: 'Africa/Luanda'})
        //     } catch (error) {
        //         return d
        //     }
        // }

        //    const html = `<!doctype html>
        //         <html lang="pt">
        //         <head>
        //         <meta charset="utf-8"/>
        //         <meta name="viewport" content="width=device-width,initial-scale=1"/>
        //         <title>Validação de Licença — ${license.code}</title>
        //         <style>
        //         body{font-family: Inter, Arial, sans-serif; background:#f5f6f8; margin:0; padding:24px; color:#111}
        //         .card{max-width:900px;margin:24px auto;background:#fff;border-radius:8px;box-shadow:0 6px 20px rgba(0,0,0,0.08);display:flex;gap:24px;padding:24px;align-items:center}
        //         .left{flex:1}
        //         .right{width:260px; text-align:center}
        //         .brand{display:flex;gap:12px;align-items:center}
        //         .brand h1{margin:0;font-size:18px}
        //         .code{font-weight:700;font-size:28px;margin:12px 0;color:#0b486b}
        //         .meta{margin-top:8px;color:#444}
        //         .row{display:flex;gap:12px;margin-top:8px}
        //         .badge{padding:6px 10px;border-radius:6px;font-weight:600}
        //         .active{background:#e6ffef;color:#0a7a3a}
        //         .inactive{background:#fff4e6;color:#a76b00}
        //         .revoked{background:#ffe6e6;color:#a10000}
        //         footer{margin-top:16px;color:#666;font-size:13px}
        //         img.qr{width:200px;height:200px;border:1px solid #eee;padding:8px;background:#fff}
        //         @media(max-width:720px){ .card{flex-direction:column} .right{width:100%} }
        //         </style>
        //         </head>
        //         <body>
        //         <div class="card">
        //             <div class="left">
        //             <div class="brand">
        //                 <div style="width:56px;height:56px;border-radius:6px;background:#0b486b;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700">LOGO</div>
        //                 <div>
        //                 <h1>${license.company ?? '—'}</h1>
        //                 <div class="meta">${license.type ?? '—'} • ${license.location ?? '—'}</div>
        //                 </div>
        //             </div>

        //             <div class="code">${license.code}</div>

        //             <div class="row">
        //                 <div>
        //                 <div style="font-size:13px;color:#666">Validade até</div>
        //                 <div style="font-weight:600">${formatDate(license.validUntil)}</div>
        //                 </div>
        //                 <div>
        //                 <div style="font-size:13px;color:#666">Estado</div>
        //                 <div class="badge ${license.state}">${license.state}</div>
        //                 </div>
        //             </div>

        //             <footer>Licença verificada em ${formatDate(now)} — este comprovante digital confirma o estado publicado pela organização.</footer>
        //             </div>

        //             <div class="right">
        //             ${ qrImg ? `<img class="qr" src="${qrImg}" alt="QR Code da licença ${license.code}"/>` : `<div style="padding:24px;color:#999">QR indisponível</div>` }
        //             <div style="margin-top:10px;font-size:13px;color:#555">Escaneie para validar</div>
        //             </div>
        //         </div>
        //         </body>
        //         </html>`;

        // return res.status(200).send(html)
    } catch (error) {
        res.status(500).send({valid: false, message: 'erro ao validar  licenca', error: error.message })
    }
}

 const __dirname = path.dirname(fileURLToPath(import.meta.url))
 const projectRoot = path.join(__dirname, "../..")

const dowloadProcessed = async (req, res) => {
    try{
        const { id } = req.params
        const license = await licence.findById(id)

        if ( !license ) {
            return res.status(404).send({ message: "Licenca nao encontrada" })
        }
        
        

        if (!license.documentURL) {
            return res.status(400).send( {message: "Nenhum documento associado a esta licenca"} )
        }

        //monta o caminho absoluto do arquivo no servidor
        const filePath = path.join(projectRoot, license.documentURL)
        
        return res.download(filePath, `${license.code}.pdf`)
    }catch (err) {
        res.status(500).send( { message: "Erro ao baixar licenca", erro: err.message})
    }
}

const downloadOriginal = async (req,res) => {
    try {
        const { id } = req.params
        const license = await licence.findById(id)

        if (!license) {
              return res.status(404).send({ message: "Licenca nao encontrada" })
        }

        if (!license.documentOriginal) {
            return res.status(400).send( {message: "Nenhum documento original associado"} )
        }

        const filePath = path.join(projectRoot, license.documentOriginal)
        return res.download(filePath, `${license.code}_original.pdf`)
    } catch (error) {
          res.status(500).send( { message: "Erro ao baixar licenca original", erro: err.message})
    }
}

const stats = async (req,res) => {
    try{
        const data = await licenseService.getLicenseStates()
        res.status(200).json(data)
    }catch (error) {
        res.status(500).json({
            message: 'Erro ao buscar estatisticas',
            error: error.message
        })
    }
}
export default {
    create,
    list,
    getById,
    update,
    remove,
    validate,
    dowloadProcessed,
    downloadOriginal,
    stats
}
