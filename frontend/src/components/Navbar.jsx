import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import "../styles/navbar.css";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada");
    navigate("/", { replace: true });
  };

  return (
    <nav className="app-navbar">
      <Link to="/dashboard" className="nav-brand">
        🏍️ MotoStore
      </Link>

      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/marketplace">Marketplace</Link>
        <Link to="/mis-motos">Mis Motos</Link>
        <Link to="/ventas">Historial</Link>
        {isAdmin() && <Link to="/admin" className="nav-admin">Admin</Link>}
      </div>

      <div className="nav-user">
        <span className="user-name">{user?.nombre}</span>
        <button type="button" className="btn-logout" onClick={handleLogout}>
          Salir
        </button>
      </div>
    </nav>
  );
}
