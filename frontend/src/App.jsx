import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>

        <Routes>
          {/* PUBLICAS */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* PRIVADAS */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <>
                  <Navbar />
                  <Home />
                </>
              </PrivateRoute>
            }
          />
        </Routes>

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;