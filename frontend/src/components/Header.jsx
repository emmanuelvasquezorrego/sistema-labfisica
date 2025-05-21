import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Header({ onLoginClick, onRegistroClick }) {
  const { usuario, logout } = useAuth();

  return (
    <header className="flex justify-between items-center p-4 bg-vino text-white">
      <h1 className="text-xl font-bold">
        <Link to="/">Laboratorio de Física</Link>
      </h1>

      <nav className="flex items-center gap-4">
        {!usuario ? (
          <>
            <button onClick={onLoginClick} className="hover:underline">Iniciar sesión</button>
            <button onClick={onRegistroClick} className="hover:underline">Registrarse</button>
          </>
        ) : (
          <>
            {usuario.rol === "estudiante" && (
              <>
                <Link to="/">Equipos</Link>
                <Link to="/historial">Préstamos</Link>
                <Link to="/perfil">Actualizar Datos</Link>
              </>
            )}
            {usuario.rol === "admin" && (
              <>
                <Link to="/">Catálogo</Link>
                <Link to="/admin/equipos">Equipos</Link>
                <Link to="/admin/prestamos">Préstamos</Link>
                <Link to="/admin/usuarios">Usuarios</Link>
                <Link to="/admin/estadisticas">Estadísticas</Link>
              </>
            )}
            <span className="text-sm">Hola, {usuario.nombre}</span>
            <button
              onClick={logout}
              className="bg-white text-vino px-3 py-1 rounded hover:bg-gray-100"
            >
              Cerrar sesión
            </button>
          </>
        )}
      </nav>
    </header>
  );
}