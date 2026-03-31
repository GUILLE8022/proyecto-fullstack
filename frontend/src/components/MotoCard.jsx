function MotoCard({ moto }) {
  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}>
      <h3>{moto.marca} {moto.modelo}</h3>
      <p>💰 ${moto.precio}</p>
      <p>⚙️ {moto.cilindraje} cc</p>
    </div>
  );
}

export default MotoCard;