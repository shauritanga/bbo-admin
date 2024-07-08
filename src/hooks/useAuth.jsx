import React, { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider.jsx";

export function useAuth() {
  return useContext(AuthContext);
}
