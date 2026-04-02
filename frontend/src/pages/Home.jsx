import { useEffect, useState } from "react";
import { API } from "../services/api";
import MotoCard from "../components/MotoCard";
import { useLocation } from "react-router-dom";
import "./Home.css";

function Home() {
  const [motos, setMotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingMoto, setEditingMoto] = useState(null);

  const [form, setForm] = useState({
    marca: "",
    modelo: "",
    precio: "",
    cilindraje: "",
    stock: "",
    imagen: "",
    segmento: ""
  });

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const search = params.get("search") || "";

  useEffect(() => {
    loadMotos();
  }, [location.search]);

  const loadMotos = async () => {
    try {
      setLoading(true);
      const res = await API.get("/motos");
      setMotos(res.data);
    } catch (err) {
      setError("Error al cargar motos");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (moto) => {
    setEditingMoto(moto);
    setForm({
      marca: moto.marca,
      modelo: moto.modelo,
      precio: moto.precio,
      cilindraje: moto.cilindraje,
      stock: moto.stock,
      imagen: moto.imagen,
      segmento: moto.segmento
    });
    setShowForm(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      ...form,
      precio: Number(form.precio),
      cilindraje: Number(form.cilindraje),
      stock: Number(form.stock)
    };

    if (editingMoto) {
      await API.put(`/motos/${editingMoto._id}`, data);
    } else {
      await API.post("/motos", data);
    }

    setShowForm(false);
    setEditingMoto(null);
    loadMotos();
  };

  const motosFiltradas = motos.filter((moto) => {
    const texto = search.toLowerCase();
    return (
      moto.marca.toLowerCase().includes(texto) ||
      moto.modelo.toLowerCase().includes(texto) ||
      moto.segmento?.toLowerCase().includes(texto)
    );
  });

  return (
    <div className="home">

      {/* HEADER */}
      <div className="home-header">
        <h1>🏍️ Inventario</h1>

        <button
          className="add-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cerrar" : "+ Nueva Moto"}
        </button>
      </div>

      {/* BUSQUEDA INFO */}
      {search && (
        <p className="search-info">
          Resultados para: <strong>{search}</strong>
        </p>
      )}

      {error && <p className="error">{error}</p>}

      {/* FORM */}
      {showForm && (
        <form onSubmit={handleSubmit} className="form">
          <input name="marca" placeholder="Marca" value={form.marca} onChange={handleChange} required />
          <input name="modelo" placeholder="Modelo" value={form.modelo} onChange={handleChange} required />
          <input name="precio" type="number" placeholder="Precio" value={form.precio} onChange={handleChange} required />
          <input name="cilindraje" type="number" placeholder="Cilindraje" value={form.cilindraje} onChange={handleChange} required />
          <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} />
          <input name="imagen" placeholder="Imagen URL" value={form.imagen} onChange={handleChange} />
          <input name="segmento" placeholder="Segmento" value={form.segmento} onChange={handleChange} />

          <button type="submit">
            {editingMoto ? "Actualizar" : "Crear"}
          </button>
        </form>
      )}

      {/* GRID */}
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="motos-grid">
          {motosFiltradas.map((moto) => (
            <MotoCard
              key={moto._id}
              moto={moto}
              onCompra={loadMotos}
              onEdit={handleEdit} // 🔥 AQUÍ ESTÁ LA CLAVE
            />
          ))}
        </div>
      )}

    </div>
  );
}

export default Home;