import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={{ padding: "10px", background: "#000", color: "#fff" }}>
      <Link to="/" style={{ color: "#fff", marginRight: "10px" }}>Inicio</Link>

      {!user ? (
        <>
          <Link to="/login" style={{ color: "#fff", marginRight: "10px" }}>Login</Link>
          <Link to="/register" style={{ color: "#fff" }}>Registro</Link>
        </>
      ) : (
        <button onClick={logout}>Cerrar sesión</button>
      )}
    </nav>
  );
}

export default Navbar;