import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function MisPrestamos({ recargar, onRecargado }) {
  const { usuario } = useAuth(); // Obtenemos el usuario autenticado desde el contexto
  const [historial, setHistorial] = useState([]); // Estado para guardar el historial de préstamos
  const [filtro, setFiltro] = useState(""); // Estado para controlar el filtro de búsqueda

  // Función para cargar el historial de préstamos desde la API
  const cargarHistorial = () => {
    if (!usuario) return; // Si no hay usuario, no se hace la petición

    axios
      .get(`http://localhost:3000/api/movimientos/historial/${usuario.id_usuario}`, {
        headers: {
          Authorization: `Bearer ${usuario.token}`, // Se envía el token para autorización
        },
      })
      .then((res) => {
        console.log("ID del usuario:", usuario.id_usuario);
        console.log("Historial recibido:", res.data);
        setHistorial(res.data); // Guardamos el historial en el estado
      })
      .catch((err) => console.error("Error al cargar historial:", err));
  };

  // useEffect para cargar el historial la primera vez que se monta el componente o cambia el usuario
  useEffect(() => {
    cargarHistorial();
  }, [usuario]);

  // useEffect para recargar el historial cuando la prop 'recargar' cambia a true
  useEffect(() => {
    if (recargar) {
      cargarHistorial();
      onRecargado(); // Notificamos que se completó la recarga para que el padre pueda actualizar su estado
    }
  }, [recargar]);

  // Función para formatear fechas a formato dd/mm/yyyy en español
  const formatearFecha = (fecha) => {
    if (!fecha) return "Pendiente"; // Si no hay fecha, se muestra "Pendiente"
    const d = new Date(fecha);
    return d.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Filtramos el historial según el texto ingresado en el filtro,
  // buscando en el nombre del equipo o en el tipo de préstamo
  const historialFiltrado = historial.filter(
    (p) =>
      p.equipo?.toLowerCase().includes(filtro.toLowerCase()) ||
      p.tipo?.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="flex justify-center pt-12 px-6 pb-20">
      <div className="w-full max-w-4xl grid gap-6">
      <h1 className="text-2xl font-bold text-vino mb-6 text-center">Historial de Préstamos</h1>

        <input
          type="text"
          placeholder="Buscar por nombre o tipo de equipo"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-full mb-6 px-4 py-2 border rounded shadow-sm"
        /> 

        {historial.length === 0 ? (
        <p className="text-center text-2xl text-gray-700 font-semibold">Sin préstamos realizados.</p>
        ) : (
        [...historialFiltrado]
          .filter((p) => p.fecha_prestamo)
          .sort((a, b) => new Date(b.fecha_prestamo) - new Date(a.fecha_prestamo))
          .map((item, i) => (

          <div key={i} className="bg-white rounded-xl border-2 border-gray-200 shadow p-6 text-center">
          <p><strong className="text-vino">Equipo:</strong> {item.equipo} ({item.tipo})</p>
          <p><strong className="text-vino">Fecha Préstamo:</strong> {formatearFecha(item.fecha_prestamo)}</p>
          <p><strong className="text-vino">Fecha Esperada Devolución:</strong> {formatearFecha(item.fecha_devolucion_esperada)}</p>
          <p><strong className="text-vino">Fecha Devolución Real:</strong> {formatearFecha(item.fecha_devolucion_real)}</p>
          <p>
            <strong className="text-vino">Estado:</strong>{" "}
            <span className={item.fecha_devolucion_real ? "text-green-600" : "text-yellow-600"}>
              {item.fecha_devolucion_real ? "Devuelto" : "Pendiente"}
            </span>
          </p>
          </div>
        ))
      )}
      </div>
    </div>
  );
}