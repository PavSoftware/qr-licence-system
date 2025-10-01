import api from "./axios";

export const loginReq = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data; // espera o token vindo do user login do back
}
