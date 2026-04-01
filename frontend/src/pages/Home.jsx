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
    imagen: ""
  });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      await API.post("/motos", {
        ...form,
        precio: Number(form.precio),
        cilindraje: Number(form.cilindraje),
        stock: Number(form.stock) || 10
      });
      setForm({ marca: "", modelo: "", precio: "", cilindraje: "", stock: "", imagen: "" });
      setShowForm(false);
      loadMotos();
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.msg || "Error al crear moto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <h1>🏍️ Tienda de Motos</h1>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      <button className="add-btn" onClick={() => setShowForm(!showForm)}>
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
          <button type="submit" disabled={loading}>
            {loading ? "Creando..." : "Crear Moto"}
          </button>
        </form>
      )}

      <div className="motos-grid">
        {motos.map((moto) => (
          <MotoCard key={moto._id} moto={moto} onCompra={loadMotos} />
        ))}
      </div>
    </div>
  );
}

export default Home;