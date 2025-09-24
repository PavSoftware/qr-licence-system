import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        // escaldo para integrar com o back
        console.log("login enviado:", {email, password});
        navigate('/dashboard') // redireciona apos login
    }

  return (
   <div className="flex items-center justify-center min-h-screen bg-[#0f111a]">
        <div className="bg-[#1a1d2d] p-10 rounded-2xl shadow-2xl w-full max-w-md">
            {/* Logo / Titulo */}
            <h1 className="text-3xl font-bold text-center mb-6 text-white">GPL - Solip</h1>
            <p className="text-gray-400 text-center mb-8">
                Faca login para continuar
            </p>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
               <div>
                 <label className="block text-sm font-medium text-gray-300 mb-2">E-Mail</label>

                <input type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Digite seu e-mail"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-[#0f111a] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
               </div>

               {/* Senha */}
                 <div>
                 <label className="block text-sm font-medium text-gray-300 mb-2">Senha</label>

                <input type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-[#0f111a] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
               </div>

               {/* Botao */}
               <button type="submit"
                className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold"
               > Entrar </button>
            </form>
            {/* Extra */}
            <p className="text-gray-500 text-xs text-center mt-8">
                Desenvolvido por <span className="text-blue-400">PavSoftware &copy;</span> 
            </p>
        </div>
   </div>
  )
}

export default Login