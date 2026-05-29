import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ventasAPI } from "../api/endpoints";
import SkeletonCard from "../components/SkeletonCard";
import EmptyState from "../components/EmptyState";
import "../styles/ventas.css";

export default function Ventas() {
  const [historial, setHistorial] = useState({
    compras: [],
    ventas: [],
    totalComprado: 0,
    totalVendido: 0,
    cantidadCompras: 0,
    cantidadVentas: 0
  });
  const [tab, setTab] = useState("compras");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarHistorial();
  }, []);

  const cargarHistorial = async () => {
    try {
      setLoading(true);
      const data = await ventasAPI.getHistorial();
      setHistorial(data);
    } catch (error) {
      toast.error(error.message || "Error al cargar historial");
    } finally {
      setLoading(false);
    }
  };

  const lista = tab === "compras" ? historial.compras : historial.ventas;

  return (
    <div className="page-container ventas-page">
      <header className="page-header">
        <h1>📜 Historial de ventas</h1>
        <p>Registros inmutables — no se pueden editar ni eliminar</p>
      </header>

      <div className="ventas-stats">
        <div className="stat-card">
          <h3>Compras</h3>
          <p className="stat-value">{historial.cantidadCompras}</p>
          <span>${Number(historial.totalComprado).toLocaleString()}</span>
        </div>
        <div className="stat-card">
          <h3>Ventas</h3>
          <p className="stat-value">{historial.cantidadVentas}</p>
          <span>${Number(historial.totalVendido).toLocaleString()}</span>
        </div>
        <div className="stat-card highlight">
          <h3>Balance</h3>
          <p className="stat-value">
            ${Number(historial.totalVendido - historial.totalComprado).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="tabs">
        <button
          type="button"
          className={tab === "compras" ? "tab active" : "tab"}
          onClick={() => setTab("compras")}
        >
          Mis compras
        </button>
        <button
          type="button"
          className={tab === "ventas" ? "tab active" : "tab"}
          onClick={() => setTab("ventas")}
        >
          Mis ventas
        </button>
      </div>

      {loading ? (
        <SkeletonCard count={3} />
      ) : lista.length === 0 ? (
        <EmptyState
          icon="📭"
          title={tab === "compras" ? "Sin compras registradas" : "Sin ventas registradas"}
          description="Las transacciones aparecerán aquí automáticamente."
        />
      ) : (
        <div className="ventas-list">
          {lista.map((venta) => (
            <article key={venta._id} className="venta-card">
              <div className="venta-header">
                <h3>
                  {venta.moto?.marca} {venta.moto?.modelo}
                </h3>
                <span className="badge badge-success">Completada</span>
              </div>
              <div className="venta-body">
                <p>
                  <strong>Monto:</strong> ${Number(venta.precioTotal).toLocaleString()}
                </p>
                <p>
                  <strong>{tab === "compras" ? "Vendedor" : "Comprador"}:</strong>{" "}
                  {tab === "compras"
                    ? venta.vendedor?.nombre
                    : venta.comprador?.nombre || venta.compradorNombre || "—"}
                </p>
                <p>
                  <strong>Tipo:</strong>{" "}
                  {venta.tipo === "directa" ? "Venta directa" : "Marketplace"}
                </p>
                <p>
                  <strong>Fecha:</strong>{" "}
                  {new Date(venta.createdAt).toLocaleString("es-CO")}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
