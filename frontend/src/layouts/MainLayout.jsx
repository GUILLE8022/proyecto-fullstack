import Navbar from "../components/Navbar";
import "../styles/navbar.css";

export default function MainLayout({ children }) {
  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">{children}</main>
    </div>
  );
}
