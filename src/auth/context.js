import { createContext, useContext } from "react";

const AuthContext = createContext({
  user: { role: "ADMIN", medicoId: "m1" }, // o "MEDICO"
});

export function useAuth() {
  return useContext(AuthContext);
}
