import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("authToken") || null);
  const [email, setEmail] = useState(localStorage.getItem("userEmail") || null);

  const login = (token, email) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("userEmail", email);
    setToken(token);
    setEmail(email);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    setToken(null);
    setEmail(null);
  };

  const isLoggedIn = !!token;
  const isGuestUser = email === "a@usc.edu";

  return (
    <AuthContext.Provider value={{ token, email, login, logout, isLoggedIn, isGuestUser }}>
      {children}
    </AuthContext.Provider>
  );
};
