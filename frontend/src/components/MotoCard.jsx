import { useState } from "react";
import { API } from "../services/api";
import "./MotoCard.css";

function MotoCard({ moto, onCompra, onEdit }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleComprar = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await API.post("/ventas", { motoId: moto._id });

      setMessage("Compra realizada exitosamente!");
      if (onCompra) onCompra();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.msg || "Error al comprar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="moto-card">
      {moto.imagen && <img src={moto.imagen} alt={moto.modelo} className="moto-img" />}
      <h3>{moto.marca} {moto.modelo}</h3>
      <p className="moto-price">💰 ${moto.precio}</p>
      <p>⚙️ {moto.cilindraje} cc</p>
      <p>📦 Stock: {moto.stock}</p>
      {onEdit && (
        <button onClick={() => onEdit(moto)} className="edit-btn">
          Editar
        </button>
      )}
      <button
        onClick={handleComprar}
        disabled={loading || moto.stock <= 0}
        className="buy-btn"
      >
        {loading ? "Comprando..." : moto.stock > 0 ? "Comprar" : "Sin Stock"}
      </button>
      {message && <p className={`message ${message.includes("Error") ? "error" : "success"}`}>{message}</p>}
    </div>
  );
}

export default MotoCard;