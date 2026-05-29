import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motosAPI } from "../api/endpoints";
import ConfirmModal from "../components/ConfirmModal";
import ImageUpload from "../components/ImageUpload";
import SkeletonCard from "../components/SkeletonCard";
import EmptyState from "../components/EmptyState";
import { resolveImageUrl } from "../utils/imageUrl";
import "../styles/motos.css";

const FORM_INICIAL = {
  marca: "",
  modelo: "",
  precio: "",
  cilindraje: "",
  descripcion: "",
  segmento: "General",
  imagen: "",
  enVenta: true
};

export default function MisMotos() {
  const [motos, setMotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState(FORM_INICIAL);
  const [guardando, setGuardando] = useState(false);
  const [eliminarId, setEliminarId] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const [venderMoto, setVenderMoto] = useState(null);
  const [ventaForm, setVentaForm] = useState({ compradorEmail: "", compradorNombre: "", nota: "" });
  const [vendiendo, setVendiendo] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    cargarMotos();
  }, []);

  const cargarMotos = async () => {
    try {
      setLoading(true);
      const data = await motosAPI.getMisMotos();
      setMotos(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.message || "Error al cargar tus motos");
    } finally {
      setLoading(false);
    }
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    try {
      setGuardando(true);
      await motosAPI.create({
        ...form,
        precio: Number(form.precio),
        cilindraje: Number(form.cilindraje),
        enVenta: form.enVenta
      });
      toast.success(form.enVenta ? "Moto publicada en venta" : "Moto guardada");
      setForm(FORM_INICIAL);
      setMostrarForm(false);
      cargarMotos();
    } catch (error) {
      toast.error(error.message || "Error al crear moto");
    } finally {
      setGuardando(false);
    }
  };

  const handleToggleEnVenta = async (moto) => {
    try {
      const actualizada = await motosAPI.toggleEnVenta(moto._id);
      toast.success(actualizada.enVenta ? "En venta en marketplace" : "Retirada del marketplace");
      cargarMotos();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const confirmarVenta = async () => {
    if (!venderMoto) return;
    try {
      setVendiendo(true);
      await motosAPI.marcarVendida(venderMoto._id, ventaForm);
      toast.success("¡Venta registrada en el historial!");
      setVenderMoto(null);
      setVentaForm({ compradorEmail: "", compradorNombre: "", nota: "" });
      cargarMotos();
    } catch (error) {
      toast.error(error.message || "Error al registrar venta");
    } finally {
      setVendiendo(false);
    }
  };

  const confirmarEliminar = async () => {
    if (!eliminarId) return;
    try {
      setEliminando(true);
      await motosAPI.delete(eliminarId);
      toast.success("Moto eliminada");
      setEliminarId(null);
      cargarMotos();
    } catch (error) {
      toast.error(error.message || "Error al eliminar");
    } finally {
      setEliminando(false);
    }
  };

  return (
    <div className="page-container">
      <header className="page-header page-header-row">
        <div>
          <h1>🏍️ Mis Motos</h1>
          <p>Sube fotos, pon en venta y registra ventas</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setMostrarForm(!mostrarForm)}>
          {mostrarForm ? "Cancelar" : "+ Agregar moto"}
        </button>
      </header>

      {mostrarForm && (
        <form className="moto-form-card" onSubmit={handleCrear}>
          <ImageUpload
            value={form.imagen}
            onChange={(imagen) => setForm({ ...form, imagen })}
            disabled={guardando}
          />
          <div className="form-grid">
            <input
              placeholder="Marca"
              value={form.marca}
              onChange={(e) => setForm({ ...form, marca: e.target.value })}
              required
              disabled={guardando}
            />
            <input
              placeholder="Modelo"
              value={form.modelo}
              onChange={(e) => setForm({ ...form, modelo: e.target.value })}
              required
              disabled={guardando}
            />
            <input
              type="number"
              placeholder="Precio"
              value={form.precio}
              onChange={(e) => setForm({ ...form, precio: e.target.value })}
              required
              min="0"
              disabled={guardando}
            />
            <input
              type="number"
              placeholder="Cilindraje (cc)"
              value={form.cilindraje}
              onChange={(e) => setForm({ ...form, cilindraje: e.target.value })}
              required
              min="0"
              disabled={guardando}
            />
          </div>
          <textarea
            placeholder="Descripción"
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            disabled={guardando}
          />
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={form.enVenta}
              onChange={(e) => setForm({ ...form, enVenta: e.target.checked })}
              disabled={guardando}
            />
            Publicar en el marketplace (en venta)
          </label>
          <button type="submit" className="btn btn-primary" disabled={guardando}>
            {guardando ? "Guardando..." : "Guardar moto"}
          </button>
        </form>
      )}

      {loading ? (
        <SkeletonCard count={4} />
      ) : motos.length === 0 ? (
        <EmptyState
          icon="🏍️"
          title="Aún no tienes motos"
          description="Agrega tu primera moto con foto y publícala en venta."
          action={
            <button type="button" className="btn btn-primary" onClick={() => setMostrarForm(true)}>
              Agregar moto
            </button>
          }
        />
      ) : (
        <div className="motos-grid">
          {motos.map((moto) => (
            <article key={moto._id} className="moto-card mis-moto-card">
              <img src={resolveImageUrl(moto.imagen)} alt={`${moto.marca} ${moto.modelo}`} loading="lazy" />
              <div className="moto-info">
                <h3>
                  {moto.marca} {moto.modelo}
                </h3>
                <p className="precio">${Number(moto.precio).toLocaleString()}</p>
                <div className="badge-row">
                  <span className={`badge ${moto.disponible ? "badge-success" : "badge-muted"}`}>
                    {moto.disponible ? "Disponible" : "Vendida"}
                  </span>
                  {moto.disponible && (
                    <span className={`badge ${moto.enVenta ? "badge-info" : "badge-muted"}`}>
                      {moto.enVenta ? "En venta" : "No publicada"}
                    </span>
                  )}
                </div>
                <div className="card-actions card-actions-col">
                  {moto.disponible && (
                    <>
                      <button type="button" className="btn btn-outline" onClick={() => handleToggleEnVenta(moto)}>
                        {moto.enVenta ? "Quitar de venta" : "Poner en venta"}
                      </button>
                      <button type="button" className="btn btn-primary" onClick={() => setVenderMoto(moto)}>
                        Marcar como vendida
                      </button>
                    </>
                  )}
                  <div className="card-actions">
                    <button
                      type="button"
                      className="btn btn-outline"
                      disabled={!moto.disponible}
                      onClick={() => navigate(`/editar-moto/${moto._id}`)}
                    >
                      Editar
                    </button>
                    <button type="button" className="btn btn-danger" onClick={() => setEliminarId(moto._id)}>
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <ConfirmModal
        open={Boolean(eliminarId)}
        title="Eliminar moto"
        message="Esta acción eliminará tu publicación de forma permanente."
        confirmText="Eliminar"
        loading={eliminando}
        onConfirm={confirmarEliminar}
        onCancel={() => setEliminarId(null)}
      />

      {venderMoto && (
        <div className="modal-overlay" role="dialog">
          <div className="modal-card modal-card-wide">
            <h3>Registrar venta — {venderMoto.marca} {venderMoto.modelo}</h3>
            <p className="modal-subtitle">
              Se registrará en tu historial por ${Number(venderMoto.precio).toLocaleString()}
            </p>
            <div className="form-group">
              <label>Email del comprador (opcional)</label>
              <input
                type="email"
                placeholder="comprador@email.com"
                value={ventaForm.compradorEmail}
                onChange={(e) => setVentaForm({ ...ventaForm, compradorEmail: e.target.value })}
                disabled={vendiendo}
              />
            </div>
            <div className="form-group">
              <label>Nombre del comprador (opcional)</label>
              <input
                type="text"
                placeholder="Nombre si vendiste fuera de la app"
                value={ventaForm.compradorNombre}
                onChange={(e) => setVentaForm({ ...ventaForm, compradorNombre: e.target.value })}
                disabled={vendiendo}
              />
            </div>
            <div className="form-group">
              <label>Nota</label>
              <input
                type="text"
                placeholder="Ej: Pago en efectivo"
                value={ventaForm.nota}
                onChange={(e) => setVentaForm({ ...ventaForm, nota: e.target.value })}
                disabled={vendiendo}
              />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-outline" onClick={() => setVenderMoto(null)} disabled={vendiendo}>
                Cancelar
              </button>
              <button type="button" className="btn btn-primary" onClick={confirmarVenta} disabled={vendiendo}>
                {vendiendo ? "Registrando..." : "Confirmar venta"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
