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

        //verficar se qrcode vir como string caso sim parseamso
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
        let query = {}

        //filtros{}
       if(req.user.role !== 'super-admin'){
            query.createdBy = req.user._id
       }

        const licenses = await licenseService.findAllLicenses(query)
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
const validate = async (req, res) => {
  try {
    const { code } = req.params;
    const license = await licence.findOne({ code });

    if (!license) return res.status(404).send({ valid: false, message: 'Licenca nao encontrada' });

    console.log("Estado da licença:", license.state);

    // normaliza o estado
    const state = license.state?.toLowerCase();

    if (state !== "active" && state !== "ativa") {
      return res.status(400).send({ valid: false, message: "Licenca inativa" });
    }

    // checar se expirou
    if (new Date(license.validUntil) < new Date()) {
      return res.status(400).send({ valid: false, message: "Licenca expirada" });
    }

    return res.json({
      valid: true,
      data: {
        code: license.code,
        company: license.company,
        type: license.type,
        location: license.location,
        validUntil: license.validUntil,
        state: license.state,
      },
    });
  } catch (error) {
    res.status(500).send({ valid: false, message: 'erro ao validar licenca', error: error.message });
  }
};


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
