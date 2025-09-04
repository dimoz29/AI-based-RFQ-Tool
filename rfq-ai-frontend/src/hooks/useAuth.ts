
import { useState } from "react";
import api from "../lib/api";

export default function useAuth() {
  const [user, setUser] = useState<{ id: string; email: string; name: string; role: string } | null>(null);
  const login = async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data.user;
  };
  const logout = () => { localStorage.removeItem("token"); setUser(null); };
  return { user, login, logout };
}
