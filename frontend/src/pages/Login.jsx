import { useState } from "react";
import { API } from "../services/api";
import { useAuth } from "../hooks/useAuth";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", form);
      login(res.data.token);
      alert("Login exitoso");
    } catch (error) {
      alert("Error en login");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Login</h2>

      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button onClick={handleLogin}>Ingresar</button>
    </div>
  );
}

export default Login;