import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ abierto, onClose }) {
  const { usuario } = useAuth();

  return (
    <nav
      className={`fixed top-0 left-0 h-full w-60 bg-vino text-white p-6 shadow-lg z-50 transform transition-transform duration-500 ${
        abierto ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <h2 className="text-lg font-semibold mb-6">Menú</h2>

      <ul className="flex flex-col gap-4">
        {usuario?.rol === "estudiante" && (
          <>
            <li><Link to="/" onClick={onClose}>Equipos</Link></li>
            <li><Link to="/historial" onClick={onClose}>Préstamos</Link></li>
            <li><Link to="/perfil" onClick={onClose}>Actualizar Datos</Link></li>
          </>
        )}

        {usuario?.rol === "admin" && (
          <>
            <li><Link to="/" onClick={onClose}>Catálogo</Link></li>
            <li><Link to="/admin/equipos" onClick={onClose}>Equipos</Link></li>
            <li><Link to="/admin/prestamos" onClick={onClose}>Préstamos</Link></li>
            <li><Link to="/admin/usuarios" onClick={onClose}>Usuarios</Link></li>
            <li><Link to="/admin/estadisticas" onClick={onClose}>Estadísticas</Link></li>
          </>
        )}
      </ul>

      <button
        onClick={onClose}
        className="mt-6 px-3 py-1 bg-white text-vino rounded hover:bg-gray-100"
      >
        Cerrar menú
      </button>
    </nav>
  );
}