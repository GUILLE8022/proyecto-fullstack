import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ventasAPI } from "../api/endpoints";
import { useAuthStore } from "../store/authStore";
import SkeletonCard from "../components/SkeletonCard";
import "../styles/dashboard.css";

export default function Dashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const data = await ventasAPI.getEstadisticas();
      setStats(data);
    } catch (error) {
      toast.error(error.message || "Error al cargar estadísticas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container dashboard-page">
      <header className="page-header">
        <h1>👋 Hola, {user?.nombre}</h1>
        <p>Resumen de tu actividad en MotoStore</p>
      </header>

      {loading ? (
        <SkeletonCard count={3} />
      ) : (
        <>
          <div className="dashboard-stats">
            <div className="stat-card">
              <h3>Total gastado</h3>
              <p className="stat-value">${Number(stats?.totalCompras || 0).toLocaleString()}</p>
              <span>{stats?.cantidadCompras || 0} compras</span>
            </div>
            <div className="stat-card">
              <h3>Total vendido</h3>
              <p className="stat-value">${Number(stats?.totalVentas || 0).toLocaleString()}</p>
              <span>{stats?.cantidadVentas || 0} ventas</span>
            </div>
            <div className="stat-card highlight">
              <h3>Balance neto</h3>
              <p className="stat-value">${Number(stats?.balance || 0).toLocaleString()}</p>
            </div>
          </div>

          <div className="quick-actions">
            <Link to="/marketplace" className="action-card">
              <span>🛒</span>
              <h3>Marketplace</h3>
              <p>Comprar motos de otros usuarios</p>
            </Link>
            <Link to="/mis-motos" className="action-card">
              <span>🏍️</span>
              <h3>Mis motos</h3>
              <p>Publicar y gestionar tus motos</p>
            </Link>
            <Link to="/ventas" className="action-card">
              <span>📜</span>
              <h3>Historial</h3>
              <p>Ver compras y ventas</p>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
