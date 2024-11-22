import { jwtDecode } from "jwt-decode";
import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const setUserToken = (token) => {
    const decodedUser = jwtDecode(token);
    setUser(decodedUser);
    localStorage.setItem("token", token);
    navigate("/dashboard");
  };

  const logOut = () => {
    console.log("its called");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, setUserToken, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
