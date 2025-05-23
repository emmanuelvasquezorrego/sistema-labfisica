import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function AdminPrestamos() {
  const { usuario } = useAuth(); // Obtener usuario autenticado
  const [prestamos, setPrestamos] = useState([]); // Lista de préstamos
  const [filtro, setFiltro] = useState(""); // Texto para filtrar préstamos por nombre o correo

  // Función para cargar todos los préstamos desde el backend con autorización
  const obtenerPrestamos = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/movimientos/prestamos/admin", {
        headers: {
          Authorization: `Bearer ${usuario.token}`,
        },
      });
      setPrestamos(res.data); // Guardar los datos en el estado
    } catch (err) {
      console.error("Error al obtener préstamos:", err); // Mostrar error en consola
    }
  };

  // Cargar los préstamos al montar el componente
  useEffect(() => {
    obtenerPrestamos();
  }, []);

  // Función para marcar un préstamo como devuelto
  const marcarDevuelto = async (id_prestamo) => {
    if (!window.confirm("¿Confirmar devolución de este préstamo?")) return; // Confirmación del usuario

    try {
      await axios.put(
        `http://localhost:3000/api/movimientos/prestamos/${id_prestamo}/devolver`,
        {},
        {
          headers: {
            Authorization: `Bearer ${usuario.token}`,
          },
        }
      );
      alert("Préstamo marcado como devuelto"); // Notificación al usuario
      obtenerPrestamos(); // Recargar la lista después de la actualización
    } catch (err) {
      console.error("Error al marcar como devuelto:", err); // Mostrar error en consola
    }
  };

  // Filtrado de préstamos por nombre o correo usando texto en minúsculas para coincidencia parcial
  const prestamosFiltrados = prestamos.filter(
    (p) =>
      p.nombre?.toLowerCase().includes(filtro.toLowerCase()) ||
      p.correo?.toLowerCase().includes(filtro.toLowerCase())
  );

  // Formateo de fechas para mostrar en formato dd/mm/yyyy o "Pendiente" si no hay fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return "Pendiente";
    const d = new Date(fecha);
    return d.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="flex justify-center mt-12 p-6">
      <div className="w-full max-w-6xl">
        <h2 className="text-2xl font-bold text-vino mb-6 text-center">
          Gestión de Préstamos
        </h2>

        <input
          type="text"
          placeholder="Buscar por nombre o correo"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-full mb-6 px-4 py-2 border border-borde rounded shadow-sm"
        />

        <div className="flex justify-center p-4">
          <div className="w-full grid gap-6">
            {[...prestamosFiltrados]
              .filter((p) => p.fecha_prestamo)
              .sort(
                (a, b) => new Date(b.fecha_prestamo) - new Date(a.fecha_prestamo)
              )
              .map((p, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-borde shadow p-6 text-center"
                >
                  <p>
                    <strong className="text-vino">Estudiante:</strong>{" "}
                    {p.nombre} ({p.correo})
                  </p>
                  <p>
                    <strong className="text-vino">Equipo:</strong>{" "}
                    {p.equipo} ({p.tipo})
                  </p>
                  <p>
                    <strong className="text-vino">Fecha préstamo:</strong>{" "}
                    {formatearFecha(p.fecha_prestamo)}
                  </p>
                  <p>
                    <strong className="text-vino">
                      Fecha esperada devolución:
                    </strong>{" "}
                    {formatearFecha(p.fecha_devolucion_esperada)}
                  </p>
                  <p>
                    <strong className="text-vino">
                      Fecha real devolución:
                    </strong>{" "}
                    {formatearFecha(p.fecha_devolucion_real)}
                  </p>
                  <p>
                    <strong className="text-vino">Estado:</strong>{" "}
                    <span
                      className={
                        p.fecha_devolucion_real
                          ? "text-green-600"
                          : "text-yellow-600"
                      }
                    >
                      {p.fecha_devolucion_real ? "Devuelto" : "Pendiente"}
                    </span>
                  </p>

                  {!p.fecha_devolucion_real && (
                    <button
                      onClick={() => marcarDevuelto(p.id_prestamo)}
                      className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                    >
                      Marcar como devuelto
                    </button>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}