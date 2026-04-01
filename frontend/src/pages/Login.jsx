import { useState } from "react";
import { API } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import "./auth.css";

function Login() {
  const navigate = useNavigate();

  // ✅ estado bien inicializado
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ manejar inputs correctamente
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ✅ login limpio y seguro
  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const cleanForm = {
        email: form.email.trim(),
        password: form.password.trim()
      };

      console.log("Enviando:", cleanForm);

      const res = await API.post("/auth/login", cleanForm);

      console.log("Respuesta:", res.data);

      // guardar token
      localStorage.setItem("token", res.data.token);

      // redirigir
      navigate("/home");

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.msg || "Error al iniciar sesión"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <div className="box">
        <h2>Iniciar sesión</h2>
        <p>Accede a tu cuenta</p>

        {error && <p className="error">{error}</p>}

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

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Cargando..." : "Iniciar sesión"}
        </button>

        <p>
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;