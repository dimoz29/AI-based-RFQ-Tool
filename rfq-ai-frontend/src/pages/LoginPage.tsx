
import { useState } from "react";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function LoginPage(){
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const nav = useNavigate();
  const login = async ()=>{
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    nav("/");
  };
  return (
    <div className="min-h-screen grid place-items-center">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-sm space-y-3">
        <h1 className="text-xl font-semibold">Login</h1>
        <input className="border p-2 w-full rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="border p-2 w-full rounded" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button onClick={login} className="px-4 py-2">Sign in</button>
      </div>
    </div>
  );
}
