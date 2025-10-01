// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

// Criação do contexto
const AuthContext = createContext();

// Hook para consumir o contexto
const useAuth =  () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const navigate = useNavigate();

  // Carregar usuário do localStorage se houver token
  useEffect(() => {
    if (token && !user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    }
  }, [token, user]);

  // Função de login
  const login = async (email, password) => {
    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Resposta do backend:", data); 

      if (!res.ok) throw new Error(data.message || "Erro no login");

      const t = data.token;
      const u = data.user;

      setToken(t);
      setUser(u);

      localStorage.setItem("token", t);
      localStorage.setItem("user", JSON.stringify(u));

      navigate("/dashboard");
    } catch (err) {
      console.error("Erro no login:", err.message);
      alert("Falha no login: " + err.message);
    }
  };

  // Função de logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export {
  useAuth,
  AuthContext
}