import { useState, useEffect } from "react";
import { getEquipmentImage } from "../utils/imageStorage";

export default function EquipoCard({ equipo, onPedirPrestamo }) {
  const [imgSrc, setImgSrc] = useState('/images/equipos/default.png'); // Estado para la imagen del equipo, por defecto imagen genérica
  const [loading, setLoading] = useState(true); // Estado para controlar carga de imagen

  useEffect(() => {
    const loadImage = () => {
      const img = new Image();
      img.src = getEquipmentImage(equipo.id_equipo); // Obtiene la URL de la imagen del equipo
      
      img.onload = () => {
        setImgSrc(img.src); // Actualiza el estado con la imagen cargada
        setLoading(false); // Cambia estado a cargado
      };
      
      img.onerror = () => {
        setImgSrc('/images/equipos/default.png'); // En caso de error, usar imagen por defecto
        setLoading(false); // Cambia estado a cargado
      };
    };

    loadImage(); // Ejecuta la función para cargar la imagen
  }, [equipo.id_equipo]); // Se ejecuta cuando cambia el id del equipo

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
      <div className={`w-24 h-24 flex items-center justify-center ${loading ? 'bg-gray-200 animate-pulse' : ''}`}>
        {!loading && (
          <img 
            src={imgSrc} 
            alt={equipo.nombre} 
            className="w-full h-full object-contain"
            onError={(e) => e.target.src = '/images/equipos/default.png'}
          />
        )}
      </div>
      
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