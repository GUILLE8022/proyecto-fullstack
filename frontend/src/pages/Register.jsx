import { useState } from "react";
import { API } from "../services/api";

function Register() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: ""
  });

  const handleRegister = async () => {
    try {
      await API.post("/auth/register", form);
      alert("Usuario creado");
    } catch {
      alert("Error en registro");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Registro</h2>

      <input
        placeholder="Nombre"
        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
      />

      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button onClick={handleRegister}>Registrarse</button>
    </div>
  );
}

export default Register;