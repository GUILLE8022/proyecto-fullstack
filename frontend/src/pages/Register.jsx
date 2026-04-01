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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
      setError("");

      const cleanForm = {
        nombre: form.nombre.trim(),
        email: form.email.trim(),
        password: form.password.trim()
      };

      console.log("Enviando:", cleanForm);

      const res = await API.post("/auth/register", cleanForm);

      console.log("Respuesta:", res.data);

      alert("Usuario creado correctamente");

      navigate("/");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.msg || "Error al registrar usuario"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <div className="box">
        <h2>Crear cuenta</h2>

        {error && <p className="error">{error}</p>}

        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Correo"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
        />

        <button onClick={handleRegister} disabled={loading}>
          {loading ? "Cargando..." : "Registrarse"}
        </button>

        <p>
          ¿Ya tienes cuenta? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;