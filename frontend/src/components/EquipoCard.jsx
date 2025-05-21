import { useAuth } from "../context/AuthContext";

export default function EquipoCard({ equipo, onPedirPrestamo }) {
  const { usuario } = useAuth();

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
      <img src={`/assets/${equipo.id_equipo}.png`} alt={equipo.nombre} className="w-24 h-24" />
      <h2 className="text-lg font-semibold mt-2">{equipo.nombre}</h2>
      <p className="text-sm text-gray-500">{equipo.tipo}</p>
      <p className={`mt-1 text-sm font-medium ${
        equipo.estado === 'Disponible' ? 'text-green-600' :
        equipo.estado === 'Prestado' ? 'text-yellow-600' :
        'text-red-600'
      }`}>
        {equipo.estado}
      </p>
      <button
        onClick={() => onPedirPrestamo(equipo)}
        disabled={equipo.estado !== "Disponible"}
        className="mt-3 bg-vino text-white px-4 py-1 rounded disabled:opacity-50"
      >
        Pedir préstamo
      </button>
    </div>
  );
}