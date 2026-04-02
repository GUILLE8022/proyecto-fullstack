import { useEffect, useState } from "react";
import { API } from "../services/api";
import "./Ventas.css";

function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    total: 0,
    ingresos: 0
  });

  useEffect(() => {
    loadVentas();
  }, []);

  const loadVentas = async () => {
    try {
      setLoading(true);
      const res = await API.get("/ventas");
      setVentas(res.data);

      // 🔥 calcular métricas
      const total = res.data.length;
      const ingresos = res.data.reduce(
        (acc, v) => acc + (v.moto?.precio || 0),
        0
      );

      setStats({ total, ingresos });

    } catch (err) {
      console.log(err);
      setError("Error al cargar ventas");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="ventas"><p>Cargando...</p></div>;
  if (error) return <div className="ventas"><p className="error">{error}</p></div>;

  return (
    <div className="ventas">

      <h1>📊 Panel de Ventas</h1>

      {/* 🔥 MÉTRICAS */}
      <div className="ventas-stats">
        <div className="stat-card">
          <h3>Total Ventas</h3>
          <p>{stats.total}</p>
        </div>

        <div className="stat-card">
          <h3>Ingresos</h3>
          <p>${stats.ingresos}</p>
        </div>
      </div>

      {/* 🏍️ LISTA */}
      {ventas.length === 0 ? (
        <p className="empty">No hay ventas registradas</p>
      ) : (
        <div className="ventas-list">
          {ventas.map((venta) => (
            <div key={venta._id} className="venta-card">

              <div className="venta-header">
                <h3>{venta.moto?.marca} {venta.moto?.modelo}</h3>
                <span className="badge">Vendido</span>
              </div>

              <div className="venta-body">
                <p><strong>💰 Precio:</strong> ${venta.moto?.precio}</p>
                <p><strong>📦 Cantidad:</strong> {venta.cantidad}</p>
                <p><strong>📅 Fecha:</strong> {new Date(venta.fecha).toLocaleDateString()}</p>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Ventas;