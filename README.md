# 📌 QR License System

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)](https://nodejs.org/)  
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)](https://react.dev/)  
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-47A248?logo=mongodb)](https://www.mongodb.com/)  
[![Express](https://img.shields.io/badge/Express.js-4.x-black?logo=express)](https://expressjs.com/)  
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)  

Sistema de **Gestão e Validação de Licenças com QR Code** desenvolvido pela **Pavsoftware**.

---

## 🚀 Funcionalidades

- 🔑 Autenticação com **JWT** (usuários e admin)  
- 📂 Upload de documentos (**PDFs, imagens**)  
- 🏷️ Criação e gestão de **licenças (CRUD completo)**  
- 📎 Injeção de **QR Code** dentro do PDF da licença  
- 🔍 Rota pública para **validação de licenças** via QR Code  
- 📊 Estatísticas (**ativas, expiradas, revogadas**)  
- 🌐 Frontend em **React + Tailwind** (painel administrativo e validação pública)  

---

## 🛠️ Tecnologias Utilizadas

### 🔹 Backend
- **Node.js + Express**  
- **MongoDB + Mongoose**  
- **JWT** (autenticação)  
- **pdf-lib** (injeção de QR Codes em PDFs)  
- **qrcode + canvas** (geração de QR Code)  
- **Multer** (upload de ficheiros)  

### 🔹 Frontend
- **React + Vite**  
- **React Router**  
- **Tailwind CSS**  
- Componentes reutilizáveis (**Dashboard, Licenses, Validate**)  

---

## ⚙️ Instalação

### Backend
```bash
cd backend
npm install
npm run dev

---

## Crie um arquivo .env dentro de backend/ com as seguintes variáveis:

PORT=5000
MONGO_URI=mongodb://localhost:27017/qr-license-system
JWT_SECRET=sua_chave_segura
BASE_URL=http://localhost:5000

---
```
### Frontend
```bash
cd frontend
npm install
npm run dev
---
```
### 📸 Estrutura do Projeto
qr-license-system/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── app.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   └── index.html
│
└── docs/
    └── README.md

# 📞 Contatos

📧 Email: comercialpavsoftware@gmail.com

📱 WhatsApp: +244 951 752 335

# 📄 Licença

Este projeto é distribuído sob a licença MIT.
Sinta-se livre para usar, modificar e distribuir.
