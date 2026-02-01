import { createContext, useState, useEffect } from "react";
import api from "../services/api";

// 1. Export the Context object itself
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          // ✅ FIXED: Changed /users/me to /api/auth/me
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
    // 1. Send Login Request (JSON)
    // Note: If this gives 422, ensure your backend accepts JSON login or switch to FormData
    const response = await api.post("/api/auth/login", {
      email: email,       
      password: password 
    });

    // 2. Save token
    localStorage.setItem("token", response.data.access_token);

    // 3. Get user details
    // ✅ FIXED: Changed /users/me to /api/auth/me
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