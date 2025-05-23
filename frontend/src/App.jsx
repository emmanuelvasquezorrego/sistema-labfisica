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
import Sidebar from "./components/SideBar";
import Layout from "./components/Layout";

function App() {
  // Estados para controlar visibilidad de modales
  const [showLogin, setShowLogin] = useState(false);
  const [showRegistro, setShowRegistro] = useState(false);
  const [showPrestamo, setShowPrestamo] = useState(false);

  // Equipo seleccionado para solicitar préstamo
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);

  // Estado para indicar recarga del historial tras nuevo préstamo
  const [recargarHistorial, setRecargarHistorial] = useState(false);

  // Control del sidebar lateral y su overlay
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const toggleSidebar = () => setSidebarAbierto(!sidebarAbierto);

  // Función para abrir modal de préstamo y asignar equipo seleccionado
  const abrirPrestamo = (equipo) => {
    setEquipoSeleccionado(equipo);
    setShowPrestamo(true);
  };

  return (
    // Contexto de autenticación para toda la app
    <AuthProvider>
      <Router>
        {/* Header con botones para abrir modales de login y registro */}
        <Header
          onLoginClick={() => setShowLogin(true)}
          onRegistroClick={() => setShowRegistro(true)}
        />

        {/* Overlay oscuro visible sólo cuando el sidebar está abierto */}
        {sidebarAbierto && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarAbierto(false)}
          />
        )}

        {/* Sidebar lateral */}
        <Sidebar
          abierto={sidebarAbierto}
          onClose={() => setSidebarAbierto(false)}
        />

        {/* Definición de rutas, todas envueltas en Layout que incluye botón para abrir sidebar */}
        <Routes>
          <Route
            path="/"
            element={
              <Layout onAbrirSidebar={() => setSidebarAbierto(true)}>
                <Home
                  onAbrirLogin={() => setShowLogin(true)}
                  onAbrirPrestamo={abrirPrestamo}
                />
              </Layout>
            }
          />
          <Route
            path="/historial"
            element={
              <Layout onAbrirSidebar={() => setSidebarAbierto(true)}>
                <MisPrestamos
                  recargar={recargarHistorial}
                  onRecargado={() => setRecargarHistorial(false)}
                />
              </Layout>
            }
          />
          <Route
            path="/perfil"
            element={
              <Layout onAbrirSidebar={() => setSidebarAbierto(true)}>
                <ActualizarPerfil />
              </Layout>
            }
          />
          <Route
            path="/admin/equipos"
            element={
              <Layout onAbrirSidebar={() => setSidebarAbierto(true)}>
                <AdminEquipos />
              </Layout>
            }
          />
          <Route
            path="/admin/usuarios"
            element={
              <Layout onAbrirSidebar={() => setSidebarAbierto(true)}>
                <AdminUsuarios />
              </Layout>
            }
          />
          <Route
            path="/admin/prestamos"
            element={
              <Layout onAbrirSidebar={() => setSidebarAbierto(true)}>
                <AdminPrestamos />
              </Layout>
            }
          />
          <Route
            path="/admin/estadisticas"
            element={
              <Layout onAbrirSidebar={() => setSidebarAbierto(true)}>
                <AdminEstadisticas />
              </Layout>
            }
          />
        </Routes>

        {/* Modales globales controlados por estado */}
        <LoginModal
          isOpen={showLogin}
          onClose={() => setShowLogin(false)}
          onAbrirRegistro={() => {
            setShowLogin(false);
            setShowRegistro(true);
          }}
        />
        <RegistroModal isOpen={showRegistro} onClose={() => setShowRegistro(false)} />
        <PedirPrestamoModal
          isOpen={showPrestamo}
          onClose={() => setShowPrestamo(false)}
          equipo={equipoSeleccionado}
          onPrestamoConfirmado={() => setRecargarHistorial(true)}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;