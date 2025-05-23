import { FaBars } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Layout({ children, onAbrirSidebar }) {
  const { usuario } = useAuth();

  return (
    <div className="p-4">
      <div className="flex items-center gap-4 mb-4">
        {usuario && (
          <button 
            onClick={onAbrirSidebar} 
            className="text-2xl text-vino flex-shrink-0"
            aria-label="Abrir menú"
          >
            <FaBars />
          </button>
        )}
      </div>

      <div className="mt-6">
        {children}
      </div>
    </div>
  );
}