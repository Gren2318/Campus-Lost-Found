import { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const res = await api.get("/api/auth/me");
          setUser(res.data);
        } catch (error) {
          console.error("Auto-login failed:", error);
          localStorage.removeItem("token");
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkLogin();
  }, []);

  const login = async (email, password) => {
    const response = await api.post("/api/auth/login", {
      email: email,       
      password: password 
    });

    localStorage.setItem("token", response.data.access_token);

    const userRes = await api.get("/api/auth/me");
    setUser(userRes.data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const register = async (data) => {
    await api.post("/api/auth/register", data);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};