import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import "../styles/landing.css";

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="page-loader landing-loader">
        <div className="spinner" />
      </div>
    );
  }

  if (isAuthenticated) return null;

  return (
    <div className="landing">
      <nav className="navbar-landing">
        <div className="container">
          <div className="logo">🏍️ MotoStore</div>
          <div className="nav-links">
            <button type="button" onClick={() => navigate("/login")} className="btn btn-outline">
              Iniciar Sesión
            </button>
            <button type="button" onClick={() => navigate("/register")} className="btn btn-primary">
              Registrarse
            </button>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-content">
            <span className="hero-badge">Plataforma Full Stack</span>
            <h1>Compra y vende motos con confianza</h1>
            <p>
              MotoStore conecta compradores y vendedores en un marketplace seguro.
              Publica tus motos, explora el catálogo y lleva un historial real de ventas.
            </p>
            <div className="hero-buttons">
              <button type="button" onClick={() => navigate("/register")} className="btn btn-lg btn-primary">
                Crear cuenta gratis
              </button>
              <button type="button" onClick={() => navigate("/login")} className="btn btn-lg btn-outline">
                Ya tengo cuenta
              </button>
            </div>
          </div>
          <div className="hero-image">
            <div className="bike-illustration">🏍️</div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>¿Por qué MotoStore?</h2>
          <div className="features-grid">
            <article className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Seguridad JWT</h3>
              <p>Autenticación robusta y rutas protegidas por rol.</p>
            </article>
            <article className="feature-card">
              <div className="feature-icon">🏍️</div>
              <h3>Mis motos</h3>
              <p>Gestiona solo tus publicaciones con permisos de ownership.</p>
            </article>
            <article className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Historial inmutable</h3>
              <p>Las ventas son registros permanentes con trazabilidad completa.</p>
            </article>
            <article className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>UX moderna</h3>
              <p>Interfaz responsive, toasts y confirmaciones elegantes.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="container">
          <h2>¿Cómo funciona?</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Regístrate</h3>
              <p>Crea tu cuenta en segundos y accede al dashboard.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Publica</h3>
              <p>Agrega tus motos en la sección Mis Motos.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Compra</h3>
              <p>Explora el marketplace y adquiere motos disponibles.</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Historial</h3>
              <p>Consulta compras, ventas y estadísticas reales.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>¿Listo para comenzar?</h2>
          <p>Únete y gestiona tu negocio de motos desde un solo lugar.</p>
          <button type="button" onClick={() => navigate("/register")} className="btn btn-lg btn-primary">
            Comenzar ahora
          </button>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-flex">
          <p>&copy; 2026 MotoStore. Proyecto Full Stack académico/profesional.</p>
          <div className="footer-links">
            <a href="#privacidad">Privacidad</a>
            <a href="#terminos">Términos</a>
            <a href="mailto:contacto@motostore.com">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
