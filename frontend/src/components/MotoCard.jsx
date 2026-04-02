import { useState } from "react";
import { API } from "../services/api";
import "./MotoCard.css";

function MotoCard({ moto, onCompra, onEdit }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔥 VENDER MOTO (ANTES COMPRAR)
  const handleVender = async () => {
    try {
      setLoading(true);
      setMessage("");

      await API.post("/ventas", {
        motoId: moto._id,
        cantidad: 1
      });

      setMessage("✅ Venta realizada");

      // 🔥 ACTUALIZA STOCK AUTOMÁTICO
      if (onCompra) onCompra();

    } catch (err) {
      console.error(err);
      setMessage("❌ Error al vender");
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ DELETE PRO
  const handleDelete = async () => {
    const confirmDelete = window.confirm("¿Eliminar esta moto?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/motos/${moto._id}`);
      setMessage("🗑️ Moto eliminada");

      if (onCompra) onCompra();
    } catch (err) {
      console.error(err);
      setMessage("❌ Error al eliminar");
    }
  };

  return (
    <div className="moto-card">

      <img
        src={moto.imagen || "https://via.placeholder.com/300"}
        alt={moto.modelo}
        className="moto-img"
      />

      <h3>{moto.marca} {moto.modelo}</h3>

      <p className="moto-price">💰 ${moto.precio}</p>
      <p>⚙️ {moto.cilindraje} cc</p>
      <p>📦 Stock: {moto.stock}</p>
      <p>🏁 {moto.segmento}</p>

      {/* 🔥 BOTONES PRO */}
      <div className="card-actions">

        {/* VENDER */}
        <button
          onClick={handleVender}
          disabled={loading || moto.stock <= 0}
          className="sell-btn"
        >
          {loading ? "Procesando..." : moto.stock > 0 ? "Vender" : "Sin stock"}
        </button>

        {/* EDITAR (NO SE QUITA) */}
        {onEdit && (
          <button
            onClick={() => onEdit(moto)}
            className="edit-btn"
          >
            Editar
          </button>
        )}

        {/* DELETE */}
        <button
          onClick={handleDelete}
          className="delete-btn"
        >
          Eliminar
        </button>

      </div>

      {/* MENSAJE */}
      {message && (
        <p className={`message ${message.includes("Error") ? "error" : "success"}`}>
          {message}
        </p>
      )}

    </div>
  );
}

export default MotoCard;