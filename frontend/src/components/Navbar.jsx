import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./Navbar.css";

function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to={isAuthenticated ? "/home" : "/"} className="nav-link">🏍️ MotoStore</Link>
      </div>
      <div className="nav-links">
        {!isAuthenticated ? (
          <>
            <Link to="/" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Registro</Link>
          </>
        ) : (
          <>
            <Link to="/home" className="nav-link">Inicio</Link>
            <Link to="/ventas" className="nav-link">Mis Compras</Link>
            <button onClick={logout} className="logout-btn">Cerrar sesión</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;