import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import "./Navbar.css";

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const [busqueda, setBusqueda] = useState("");
  const navigate = useNavigate();

  // 🔥 LOGOUT COMPLETO
  const handleLogout = () => {
    logout(); // elimina token
    navigate("/", { replace: true }); // redirige y bloquea volver atrás
  };

  // 🔍 BUSCADOR
  const handleSearch = (e) => {
    e.preventDefault();

    if (busqueda.trim() === "") {
      navigate("/home");
    } else {
      navigate(`/home?search=${busqueda}`);
    }

    setBusqueda("");
  };

  return (
    <nav className="navbar">

      {/* LOGO */}
      <div className="nav-brand">
        <Link to={isAuthenticated ? "/home" : "/"} className="nav-link">
          🏍️ MotoStore
        </Link>
      </div>

      {/* 🔍 BUSCADOR */}
      {isAuthenticated && (
        <form className="nav-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Buscar motos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button type="submit">Buscar</button>
        </form>
      )}

      {/* LINKS */}
      <div className="nav-links">
        {!isAuthenticated ? (
          <>
            <Link to="/" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Registro</Link>
          </>
        ) : (
          <>
            <Link to="/home" className="nav-link">Inicio</Link>
            <Link to="/ventas" className="nav-link">Ventas</Link>

            <button onClick={handleLogout} className="logout-btn">
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;