import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function MisPrestamos({ recargar, onRecargado }) {
  const { usuario } = useAuth();
  const [historial, setHistorial] = useState([]);

  const cargarHistorial = () => {
    if (!usuario) return;
    axios
      .get(`http://localhost:3000/api/movimientos/historial/${usuario.id_usuario}`, {
        headers: {
          Authorization: `Bearer ${usuario.token}`,
        },
      })
      .then((res) => {
        console.log("ID del usuario:", usuario.id_usuario);
        console.log("Historial recibido:", res.data);
        setHistorial(res.data);
      })
      .catch((err) => console.error("Error al cargar historial:", err));
      };

  useEffect(() => {
    cargarHistorial();
  }, [usuario]);

  useEffect(() => {
    if (recargar) {
      cargarHistorial();
      onRecargado();
    }
  }, [recargar]);

  const formatearFecha = (fecha) => {
    if (!fecha) return "Pendiente";
    const d = new Date(fecha);
    return d.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  return (
    <div className="flex justify-center pt-12 px-6 pb-20">
      <div className="w-full max-w-4xl grid gap-6">
        {[...historial]
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
        ))}
      </div>
    </div>
  );
}