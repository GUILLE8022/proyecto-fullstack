import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motosAPI } from "../api/endpoints";
import ImageUpload from "../components/ImageUpload";
import "../styles/motos.css";

export default function EditarMoto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    marca: "",
    modelo: "",
    precio: "",
    cilindraje: "",
    descripcion: "",
    segmento: "General",
    imagen: "",
    enVenta: false
  });
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [disponible, setDisponible] = useState(true);

  useEffect(() => {
    if (id) cargarMoto();
  }, [id]);

  const cargarMoto = async () => {
    try {
      setLoading(true);
      setError("");
      const moto = await motosAPI.getById(id);
      setDisponible(moto.disponible !== false);
      setForm({
        marca: moto.marca || "",
        modelo: moto.modelo || "",
        precio: moto.precio ?? "",
        cilindraje: moto.cilindraje ?? "",
        descripcion: moto.descripcion || "",
        segmento: moto.segmento || "General",
        imagen: moto.imagen || "",
        enVenta: moto.enVenta || false
      });
    } catch (err) {
      setError(err.message || "No se pudo cargar la moto");
      toast.error(err.message || "Moto no encontrada");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setGuardando(true);
      await motosAPI.update(id, {
        marca: form.marca,
        modelo: form.modelo,
        precio: Number(form.precio),
        cilindraje: Number(form.cilindraje),
        descripcion: form.descripcion,
        segmento: form.segmento,
        imagen: form.imagen,
        enVenta: disponible ? form.enVenta : false
      });
      toast.success("Moto actualizada");
      navigate("/mis-motos");
    } catch (err) {
      toast.error(err.message || "Error al actualizar");
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-loader">
          <div className="spinner" />
          <p>Cargando moto...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-fallback">
          <h2>No se pudo cargar la moto</h2>
          <p>{error}</p>
          <button type="button" className="btn btn-primary" onClick={() => navigate("/mis-motos")}>
            Volver a Mis Motos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>✏️ Editar moto</h1>
        <p>Actualiza foto, datos y estado de venta</p>
      </header>

      <form className="moto-form-card edit-form" onSubmit={handleSubmit}>
        <ImageUpload
          value={form.imagen}
          onChange={(imagen) => setForm({ ...form, imagen })}
          disabled={guardando}
        />

        <div className="form-group">
          <label htmlFor="marca">Marca</label>
          <input
            id="marca"
            value={form.marca}
            onChange={(e) => setForm({ ...form, marca: e.target.value })}
            required
            disabled={guardando}
          />
        </div>
        <div className="form-group">
          <label htmlFor="modelo">Modelo</label>
          <input
            id="modelo"
            value={form.modelo}
            onChange={(e) => setForm({ ...form, modelo: e.target.value })}
            required
            disabled={guardando}
          />
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="precio">Precio</label>
            <input
              id="precio"
              type="number"
              min="0"
              value={form.precio}
              onChange={(e) => setForm({ ...form, precio: e.target.value })}
              required
              disabled={guardando}
            />
          </div>
          <div className="form-group">
            <label htmlFor="cilindraje">Cilindraje</label>
            <input
              id="cilindraje"
              type="number"
              min="0"
              value={form.cilindraje}
              onChange={(e) => setForm({ ...form, cilindraje: e.target.value })}
              required
              disabled={guardando}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            disabled={guardando}
          />
        </div>

        {disponible && (
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={form.enVenta}
              onChange={(e) => setForm({ ...form, enVenta: e.target.checked })}
              disabled={guardando}
            />
            Publicada en el marketplace
          </label>
        )}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={guardando}>
            {guardando ? "Guardando..." : "Guardar cambios"}
          </button>
          <button type="button" className="btn btn-outline" disabled={guardando} onClick={() => navigate("/mis-motos")}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
