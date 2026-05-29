import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authAPI, motosAPI, ventasAPI } from "../api/endpoints";
import ConfirmModal from "../components/ConfirmModal";
import SkeletonCard from "../components/SkeletonCard";
import "../styles/admin.css";

export default function AdminPanel() {
  const [tab, setTab] = useState("ventas");
  const [usuarios, setUsuarios] = useState([]);
  const [motos, setMotos] = useState([]);
  const [ventasData, setVentasData] = useState({ ventas: [], totalVendido: 0 });
  const [loading, setLoading] = useState(true);
  const [eliminarMotoId, setEliminarMotoId] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, [tab]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      if (tab === "usuarios") {
        const data = await authAPI.getUsuarios();
        setUsuarios(Array.isArray(data) ? data : []);
      } else if (tab === "motos") {
        const data = await motosAPI.getAllAdmin();
        setMotos(Array.isArray(data) ? data : []);
      } else {
        const data = await ventasAPI.getAllAdmin();
        setVentasData(data);
      }
    } catch (error) {
      toast.error(error.message || "Error al cargar panel admin");
    } finally {
      setLoading(false);
    }
  };

  const toggleUsuario = async (id) => {
    try {
      await authAPI.toggleUsuario(id);
      toast.success("Estado de usuario actualizado");
      cargarDatos();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const confirmarEliminarMoto = async () => {
    if (!eliminarMotoId) return;
    try {
      setEliminando(true);
      await motosAPI.deleteAdmin(eliminarMotoId);
      toast.success("Publicación eliminada");
      setEliminarMotoId(null);
      cargarDatos();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setEliminando(false);
    }
  };

  return (
    <div className="page-container admin-page">
      <header className="page-header">
        <h1>🛡️ Panel de administración</h1>
        <p>Moderación de usuarios, motos y ventas globales</p>
      </header>

      <div className="tabs">
        <button type="button" className={tab === "ventas" ? "tab active" : "tab"} onClick={() => setTab("ventas")}>
          Ventas globales
        </button>
        <button type="button" className={tab === "motos" ? "tab active" : "tab"} onClick={() => setTab("motos")}>
          Motos
        </button>
        <button type="button" className={tab === "usuarios" ? "tab active" : "tab"} onClick={() => setTab("usuarios")}>
          Usuarios
        </button>
      </div>

      {loading ? (
        <SkeletonCard count={3} />
      ) : (
        <>
          {tab === "ventas" && (
            <div>
              <p className="admin-summary">
                Total vendido en plataforma:{" "}
                <strong>${Number(ventasData.totalVendido || 0).toLocaleString()}</strong> (
                {ventasData.cantidad || ventasData.ventas?.length || 0} ventas)
              </p>
              <div className="admin-list">
                {(ventasData.ventas || []).map((v) => (
                  <div key={v._id} className="admin-item">
                    <p>
                      {v.moto?.marca} {v.moto?.modelo} — ${Number(v.precioTotal).toLocaleString()}
                    </p>
                    <small>
                      {v.comprador?.nombre} → {v.vendedor?.nombre} ·{" "}
                      {new Date(v.createdAt).toLocaleDateString("es-CO")}
                    </small>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "motos" && (
            <div className="admin-list">
              {motos.map((m) => (
                <div key={m._id} className="admin-item admin-item-row">
                  <div>
                    <p>
                      {m.marca} {m.modelo} — {m.propietario?.nombre}
                    </p>
                    <small>{m.disponible ? "Disponible" : "Vendida"}</small>
                  </div>
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => setEliminarMotoId(m._id)}>
                    Moderar
                  </button>
                </div>
              ))}
            </div>
          )}

          {tab === "usuarios" && (
            <div className="admin-list">
              {usuarios.map((u) => (
                <div key={u._id} className="admin-item admin-item-row">
                  <div>
                    <p>
                      {u.nombre} ({u.rol})
                    </p>
                    <small>{u.email}</small>
                  </div>
                  {u.rol !== "admin" && (
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => toggleUsuario(u._id)}>
                      {u.activo ? "Desactivar" : "Activar"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <ConfirmModal
        open={Boolean(eliminarMotoId)}
        title="Eliminar publicación"
        message="Como administrador, eliminarás esta moto del marketplace."
        confirmText="Eliminar"
        loading={eliminando}
        onConfirm={confirmarEliminarMoto}
        onCancel={() => setEliminarMotoId(null)}
      />
    </div>
  );
}
