import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import "./Navbar.css";

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const [busqueda, setBusqueda] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    if (busqueda.trim() === "") {
      navigate("/home");
    } else {
      navigate(`/home?search=${busqueda}`);
    }
  };

  return (
    <nav className="navbar">

      {/* IZQUIERDA */}
      <div className="nav-left">
        <Link to="/home" className="logo">
          🏍️ MotoStore
        </Link>
      </div>

      {/* CENTRO 🔍 */}
      {isAuthenticated && (
        <form className="nav-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="🔍 Buscar por marca, modelo o segmento..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </form>
      )}

      {/* DERECHA */}
      <div className="nav-right">
        {!isAuthenticated ? (
          <>
            <Link to="/" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Registro</Link>
          </>
        ) : (
          <>
            <Link to="/home" className="nav-link">Inicio</Link>
            <Link to="/ventas" className="nav-link">Ventas</Link>
            <button onClick={logout} className="logout-btn">
              Cerrar sesión
            </button>
          </>
        )}
      </div>

    </nav>
  );
}

export default Navbar;