import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true); // Para verificar o token inicial
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      if (token) {
        try {
          // No futuro, você pode adicionar uma rota no backend para validar o token
          // Por agora, vamos decodificar o payload para pegar os dados do usuário
          // Isso NÃO valida se o token ainda é válido no servidor, apenas se ele existe e tem um payload.
          // Para uma validação real, seria /api/auth/me ou algo assim.
          const payloadBase64 = token.split('.')[1];
          if (payloadBase64) {
            const decodedPayload = JSON.parse(atob(payloadBase64));
            if (decodedPayload.user && decodedPayload.exp * 1000 > Date.now()) {
              setUser(decodedPayload.user);
            } else {
              localStorage.removeItem('token');
              setToken(null);
              setUser(null);
            }
          } else {
            // Token inválido
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
          }
        } catch (error) {
          console.error("Erro ao decodificar token:", error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    validateToken();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer login');
      }
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user); // Backend agora retorna o usuário completo
      navigate('/'); // Redireciona para a home após o login
      return { success: true };
    } catch (error) {
      console.error("Erro no login:", error);
      return { success: false, message: error.message };
    }
  };

  const register = async (userData) => {
    // userData deve incluir firstName, lastName, email, password, profileImageUrl
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.errors?.join(', ') || 'Erro ao registrar');
      }
      // Opcional: Fazer login automaticamente após o registro
      // await login(userData.email, userData.password);
      return { success: true, message: data.message };
    } catch (error) {
      console.error("Erro no registro:", error);
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/auth'); // Redireciona para a página de login/auth
  };

  const value = {
    user,
    token,
    loadingAuth: loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};