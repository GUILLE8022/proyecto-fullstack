import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { authAPI } from "../api/endpoints";
import { useAuthStore } from "../store/authStore";
import "../styles/auth.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = "El email es obligatorio";
    else if (!/\S+@\S+\.\S+/.test(form.email)) next.email = "Email inválido";
    if (!form.password) next.password = "La contraseña es obligatoria";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const data = await authAPI.login(form);
      login(data.usuario, data.token);
      toast.success(`¡Bienvenido, ${data.usuario.nombre}!`);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-box">
          <div className="auth-header">
            <Link to="/" className="auth-logo">🏍️ MotoStore</Link>
            <h2>Iniciar sesión</h2>
            <p>Accede a tu dashboard, marketplace e historial de ventas.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className={`form-group ${errors.email ? "has-error" : ""}`}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="tu@email.com"
                disabled={loading}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className={`form-group ${errors.password ? "has-error" : ""}`}>
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••"
                disabled={loading}
              />
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            <button type="submit" disabled={loading} className="auth-button">
              {loading ? "Ingresando..." : "Iniciar sesión"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              ¿No tienes cuenta?{" "}
              <Link to="/register">Regístrate gratis</Link> para publicar y comprar motos.
            </p>
            <Link to="/" className="back-link">← Volver al inicio</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
