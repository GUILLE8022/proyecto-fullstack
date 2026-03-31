import { useEffect, useState } from "react";
import { API } from "../services/api";
import MotoCard from "../components/MotoCard";

function Home() {
  const [motos, setMotos] = useState([]);

  useEffect(() => {
    API.get("/motos")
      .then(res => setMotos(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>🏍️ Tienda de Motos</h1>

      {motos.map((moto) => (
        <MotoCard key={moto._id} moto={moto} />
      ))}
    </div>
  );
}

export default Home;