import { useState } from "react";
import { API } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import "./auth.css";

function Register() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      console.log("Enviando datos:", form);

      const res = await API.post("/auth/register", form);

      console.log("Respuesta:", res.data);

      alert("Usuario creado correctamente");

      navigate("/login");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message || "Error al registrar usuario"
      );
    }
  };

  return (
    <div className="auth">
      <div className="box">
        <h2>Crear cuenta</h2>

        {error && <span className="error">{error}</span>}

        <input
          placeholder="Nombre"
          onChange={(e) =>
            setForm({ ...form, nombre: e.target.value })
          }
        />

        <input
          placeholder="Correo"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Contraseña"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button onClick={handleRegister}>
          Registrarse
        </button>

        <p>
          ¿Ya tienes cuenta? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;