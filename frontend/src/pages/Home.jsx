import { useEffect, useState } from "react";
import { API } from "../services/api";
import MotoCard from "../components/MotoCard";
import "./Home.css";

function Home() {
  const [motos, setMotos] = useState([]);
  const [form, setForm] = useState({
    marca: "",
    modelo: "",
    precio: "",
    cilindraje: "",
    stock: "",
    imagen: "",
    segmento: ""
  });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingMoto, setEditingMoto] = useState(null);

  useEffect(() => {
    loadMotos();
  }, []);

  const loadMotos = async () => {
    try {
      const res = await API.get("/motos");
      setMotos(res.data);
    } catch (err) {
      console.log(err);
      setError("Error al cargar motos");
    }
  };

  const handleEdit = (moto) => {
    setEditingMoto(moto);
    setForm({
      marca: moto.marca,
      modelo: moto.modelo,
      precio: moto.precio.toString(),
      cilindraje: moto.cilindraje.toString(),
      stock: moto.stock.toString(),
      imagen: moto.imagen,
      segmento: moto.segmento || ""
    });
    setShowForm(true);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const data = {
        ...form,
        precio: Number(form.precio),
        cilindraje: Number(form.cilindraje),
        stock: Number(form.stock) || 10
      };
      if (editingMoto) {
        await API.put(`/motos/${editingMoto._id}`, data);
      } else {
        await API.post("/motos", data);
      }
      setForm({ marca: "", modelo: "", precio: "", cilindraje: "", stock: "", imagen: "", segmento: "" });
      setShowForm(false);
      setEditingMoto(null);
      loadMotos();
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.msg || "Error al guardar moto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <h1>🏍️ Tienda de Motos</h1>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      <button className="add-btn" onClick={() => {
        if (showForm && editingMoto) {
          setEditingMoto(null);
          setForm({ marca: "", modelo: "", precio: "", cilindraje: "", stock: "", imagen: "", segmento: "" });
        }
        setShowForm(!showForm);
      }}>
        {showForm ? "Ocultar Formulario" : "Agregar Moto"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="form">
          <input name="marca" placeholder="Marca" value={form.marca} onChange={handleChange} required />
          <input name="modelo" placeholder="Modelo" value={form.modelo} onChange={handleChange} required />
          <input name="precio" type="number" placeholder="Precio" value={form.precio} onChange={handleChange} required />
          <input name="cilindraje" type="number" placeholder="Cilindraje" value={form.cilindraje} onChange={handleChange} required />
          <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} />
          <input name="imagen" placeholder="Imagen URL" value={form.imagen} onChange={handleChange} />
          <input name="segmento" placeholder="Segmento (ej: Deportiva, Cruiser)" value={form.segmento} onChange={handleChange} />
          <button type="submit" disabled={loading}>
            {loading ? "Guardando..." : editingMoto ? "Actualizar Moto" : "Crear Moto"}
          </button>
        </form>
      )}

      <div className="motos-container">
        {Object.entries(
          motos.reduce((acc, moto) => {
            const segmento = moto.segmento || "General";
            if (!acc[segmento]) acc[segmento] = [];
            acc[segmento].push(moto);
            return acc;
          }, {})
        ).map(([segmento, motosSegmento]) => (
          <div key={segmento} className="segmento-section">
            <h2>{segmento}</h2>
            <div className="motos-grid">
              {motosSegmento.map((moto) => (
                <MotoCard key={moto._id} moto={moto} onCompra={loadMotos} onEdit={handleEdit} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;