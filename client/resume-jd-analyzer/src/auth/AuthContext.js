// src/auth/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Effect to verify token on load
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const res = await fetch("http://localhost:5000/api/auth/verify", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (data.valid) {
            setUser({ id: data.userId });
          } else {
            logout();
          }
        } catch (error) {
          console.error("Token verification failed:", error);
          logout();
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, [token]);

  // Login and store token
  const login = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  // Logout and clear state
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);
