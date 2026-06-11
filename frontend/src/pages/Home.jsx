import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { motosAPI, ventasAPI } from "../api/endpoints";
import ConfirmModal from "../components/ConfirmModal";
import SkeletonCard from "../components/SkeletonCard";
import EmptyState from "../components/EmptyState";
import MotoImage from "../components/MotoImage";
import { useAuthStore } from "../store/authStore";
import "../styles/motos.css";

const esPropia = (moto, userId) => {
  if (!userId) return false;
  const ownerId = moto.propietario?._id || moto.propietario;
  return String(ownerId) === String(userId);
};

export default function Home() {
  const { user } = useAuthStore();
  const [motos, setMotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comprando, setComprando] = useState(null);
  const [confirmMoto, setConfirmMoto] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroMarca, setFiltroMarca] = useState("");
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");

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

  const marcasUnicas = useMemo(
    () => [...new Set(motos.map((m) => m.marca).filter(Boolean))].sort(),
    [motos]
  );

  const motosFiltradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();

    return motos.filter((moto) => {
      if (q) {
        const enMarca = moto.marca?.toLowerCase().includes(q);
        const enModelo = moto.modelo?.toLowerCase().includes(q);
        if (!enMarca && !enModelo) return false;
      }
      if (filtroMarca && moto.marca !== filtroMarca) return false;
      if (precioMin !== "" && Number(moto.precio) < Number(precioMin)) return false;
      if (precioMax !== "" && Number(moto.precio) > Number(precioMax)) return false;
      return true;
    });
  }, [motos, busqueda, filtroMarca, precioMin, precioMax]);

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

  const limpiarFiltros = () => {
    setBusqueda("");
    setFiltroMarca("");
    setPrecioMin("");
    setPrecioMax("");
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>🛒 Marketplace</h1>
        <p>Explora motos en venta — incluye tus publicaciones</p>
      </header>

      {!loading && motos.length > 0 && (
        <div className="marketplace-filters">
          <input
            type="search"
            placeholder="Buscar por marca o modelo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            aria-label="Buscar por marca o modelo"
          />
          <select
            value={filtroMarca}
            onChange={(e) => setFiltroMarca(e.target.value)}
            aria-label="Filtrar por marca"
          >
            <option value="">Todas las marcas</option>
            {marcasUnicas.map((marca) => (
              <option key={marca} value={marca}>
                {marca}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Precio mínimo"
            value={precioMin}
            onChange={(e) => setPrecioMin(e.target.value)}
            min="0"
            aria-label="Precio mínimo"
          />
          <input
            type="number"
            placeholder="Precio máximo"
            value={precioMax}
            onChange={(e) => setPrecioMax(e.target.value)}
            min="0"
            aria-label="Precio máximo"
          />
          {(busqueda || filtroMarca || precioMin || precioMax) && (
            <button type="button" className="btn btn-outline" onClick={limpiarFiltros}>
              Limpiar filtros
            </button>
          )}
        </div>
      )}

      {loading ? (
        <SkeletonCard count={6} />
      ) : motos.length === 0 ? (
        <EmptyState
          icon="🏍️"
          title="No hay motos en el marketplace"
          description="Vuelve más tarde o publica la tuya en Mis Motos."
        />
      ) : motosFiltradas.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="Sin resultados"
          description="No hay motos que coincidan con tu búsqueda o filtros."
          action={
            <button type="button" className="btn btn-outline" onClick={limpiarFiltros}>
              Limpiar filtros
            </button>
          }
        />
      ) : (
        <div className="motos-grid">
          {motosFiltradas.map((moto) => {
            const propia = esPropia(moto, user?.id);

            return (
              <article key={moto._id} className="moto-card">
                <MotoImage src={moto.imagen} alt={`${moto.marca} ${moto.modelo}`} />
                <div className="moto-info">
                  <h3>
                    {moto.marca} {moto.modelo}
                  </h3>
                  <p className="precio">${Number(moto.precio).toLocaleString()}</p>
                  <p className="cilindraje">
                    {moto.cilindraje} cc · {moto.segmento}
                  </p>
                  <p className="vendedor">Vendedor: {moto.propietario?.nombre || "—"}</p>
                  {propia && <span className="badge badge-own">Tu publicación</span>}
                  {propia ? (
                    <p className="btn-comprar-disabled" title="No puedes comprar tu propia moto">
                      No puedes comprar tu propia moto
                    </p>
                  ) : (
                    <button
                      type="button"
                      className="btn-comprar"
                      disabled={comprando === moto._id}
                      onClick={() => setConfirmMoto(moto)}
                    >
                      {comprando === moto._id ? "Procesando..." : "Comprar"}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
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
