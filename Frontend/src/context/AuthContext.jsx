// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Restaura token e usuário do localStorage ao iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    // Evita renderizar rotas antes de terminar o carregamento
    setTimeout(() => setLoading(false), 2000);
  }, []);

const updateUser = (updatedUser) => {
  setUser(updatedUser);
  localStorage.setItem("user", JSON.stringify(updatedUser));
};

  const login = async (email, password) => {
    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Erro no login");

      
      const u = data.user;

        if (u.isActive) {
          const t = data.token;
          setToken(t);
          setUser(u);

          localStorage.setItem("token", t);
          localStorage.setItem("user", JSON.stringify(u));
          
          if (u.role === "super-admin") {
            navigate("/super-admin");
          } else {
            navigate("/dashboard");
          }
        }else{
          alert('Usuario nao se encontra activo')
          return navigate('/login')
        }

        
    } catch (err) {
      console.error("Erro no login:", err.message);
      alert("Falha no login: " + err.message);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    //spinner bonito com Tailwind
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0f111a] text-white">
        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-300 text-sm">Carregando sessão...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// src/context/AuthContext.jsx


