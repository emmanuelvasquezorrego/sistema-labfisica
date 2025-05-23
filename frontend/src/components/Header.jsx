import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header({ onLoginClick }) {
  const { usuario, logout } = useAuth();

  return (
    <header className="flex justify-between items-center p-4 bg-vino text-white">
      <h1 className="text-xl font-bold">
        <Link to="/">Laboratorio de Física</Link>
      </h1>

      <div className="flex items-center gap-4">

        {!usuario ? (
          <button onClick={onLoginClick} className="hover:underline">
            Iniciar sesión
          </button>
        ) : (
          
          <div className="flex items-center gap-6">
            <span>Bienvenid@, {usuario.nombre || usuario.email || "Usuari@"}</span>
            <button
              onClick={logout}
              className="bg-white text-vino px-3 py-1 rounded hover:bg-gray-100"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
