import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MisPrestamos from "./pages/MisPrestamos";
import ActualizarPerfil from "./pages/ActualizarPerfil";
import Header from "./components/Header";
import LoginModal from "./components/LoginModal";
import RegistroModal from "./components/RegistroModal";
import PedirPrestamoModal from "./components/PedirPrestamoModal";
import { AuthProvider } from "./context/AuthContext";
import { useState } from "react";
import AdminEquipos from "./pages/admin/AdminEquipos";
import AdminUsuarios from "./pages/admin/AdminUsuarios";
import AdminPrestamos from "./pages/admin/AdminPrestamos";
import AdminEstadisticas from "./pages/admin/AdminEstadisticas";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegistro, setShowRegistro] = useState(false);
  const [showPrestamo, setShowPrestamo] = useState(false);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [recargarHistorial, setRecargarHistorial] = useState(false);

  const abrirPrestamo = (equipo) => {
    setEquipoSeleccionado(equipo);
    setShowPrestamo(true);
  };

  return (
    <AuthProvider>
      <Router>
        <Header
          onLoginClick={() => setShowLogin(true)}
          onRegistroClick={() => setShowRegistro(true)}
        />

        <Routes>
          <Route path="/" element={<Home onAbrirLogin={() => setShowLogin(true)} onAbrirPrestamo={abrirPrestamo} />} />
          <Route path="/historial" element={<MisPrestamos recargar={recargarHistorial} onRecargado={() => setRecargarHistorial(false)} />} />
          <Route path="/perfil" element={<ActualizarPerfil />} />
          <Route path="/admin/equipos" element={<AdminEquipos />} />
          <Route path="/admin/usuarios" element={<AdminUsuarios />} />
          <Route path="/admin/prestamos" element={<AdminPrestamos />} />
          <Route path="/admin/estadisticas" element={<AdminEstadisticas />} />
        </Routes>

        <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
        <RegistroModal isOpen={showRegistro} onClose={() => setShowRegistro(false)} />
        <PedirPrestamoModal isOpen={showPrestamo} onClose={() => setShowPrestamo(false)} equipo={equipoSeleccionado} onPrestamoConfirmado={() => setRecargarHistorial(true)} />

      </Router>
    </AuthProvider>
  );
}

export default App;