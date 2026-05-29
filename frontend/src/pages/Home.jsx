import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motosAPI, ventasAPI } from "../api/endpoints";
import ConfirmModal from "../components/ConfirmModal";
import SkeletonCard from "../components/SkeletonCard";
import EmptyState from "../components/EmptyState";
import { resolveImageUrl } from "../utils/imageUrl";
import "../styles/motos.css";

export default function Home() {
  const [motos, setMotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comprando, setComprando] = useState(null);
  const [confirmMoto, setConfirmMoto] = useState(null);

  useEffect(() => {
    cargarMotos();
  }, []);

  const cargarMotos = async () => {
    try {
      setLoading(true);
      const data = await motosAPI.getMarketplace();
      setMotos(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.message || "Error al cargar marketplace");
    } finally {
      setLoading(false);
    }
  };

  const confirmarCompra = async () => {
    if (!confirmMoto) return;
    try {
      setComprando(confirmMoto._id);
      await ventasAPI.crear({ motoId: confirmMoto._id });
      toast.success("¡Compra realizada con éxito!");
      setConfirmMoto(null);
      cargarMotos();
    } catch (error) {
      toast.error(error.message || "No se pudo completar la compra");
    } finally {
      setComprando(null);
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>🛒 Marketplace</h1>
        <p>Explora motos disponibles de otros vendedores</p>
      </header>

      {loading ? (
        <SkeletonCard count={6} />
      ) : motos.length === 0 ? (
        <EmptyState
          icon="🏍️"
          title="No hay motos en el marketplace"
          description="Vuelve más tarde o publica la tuya en Mis Motos."
        />
      ) : (
        <div className="motos-grid">
          {motos.map((moto) => (
            <article key={moto._id} className="moto-card">
              <img src={resolveImageUrl(moto.imagen)} alt={`${moto.marca} ${moto.modelo}`} loading="lazy" />
              <div className="moto-info">
                <h3>
                  {moto.marca} {moto.modelo}
                </h3>
                <p className="precio">${Number(moto.precio).toLocaleString()}</p>
                <p className="cilindraje">{moto.cilindraje} cc · {moto.segmento}</p>
                <p className="vendedor">Vendedor: {moto.propietario?.nombre || "—"}</p>
                <button
                  type="button"
                  className="btn-comprar"
                  disabled={comprando === moto._id}
                  onClick={() => setConfirmMoto(moto)}
                >
                  {comprando === moto._id ? "Procesando..." : "Comprar"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <ConfirmModal
        open={Boolean(confirmMoto)}
        title="Confirmar compra"
        message={
          confirmMoto
            ? `¿Deseas comprar ${confirmMoto.marca} ${confirmMoto.modelo} por $${Number(confirmMoto.precio).toLocaleString()}?`
            : ""
        }
        confirmText="Comprar"
        loading={Boolean(comprando)}
        onConfirm={confirmarCompra}
        onCancel={() => setConfirmMoto(null)}
      />
    </div>
  );
}
