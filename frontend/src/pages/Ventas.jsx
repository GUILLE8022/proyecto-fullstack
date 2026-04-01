import { useEffect, useState } from "react";
import { API } from "../services/api";
import "./Ventas.css";

function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadVentas();
  }, []);

  const loadVentas = async () => {
    try {
      setLoading(true);
      const res = await API.get("/ventas");
      setVentas(res.data);
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
      <h1>📊 Mis Compras</h1>

      {ventas.length === 0 ? (
        <p>No has realizado compras aún.</p>
      ) : (
        <div className="ventas-list">
          {ventas.map((venta) => (
            <div key={venta._id} className="venta-card">
              <h3>{venta.moto?.marca} {venta.moto?.modelo}</h3>
              <p className="venta-price">💰 ${venta.moto?.precio}</p>
              <p>Cantidad: {venta.cantidad}</p>
              <p>Fecha: {new Date(venta.fecha).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Ventas;