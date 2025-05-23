import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import generarPDF from "../utils/generarPDF";
import axios from "axios";
import ConfirmacionPrestamoModal from "./ConfirmacionPrestamoModal";
import jsPDF from "jspdf";

export default function PedirPrestamoModal({ isOpen, onClose, equipo, onPrestamoConfirmado }) {
  // Obtener datos del usuario autenticado desde el contexto
  const { usuario } = useAuth();
  // Estado para la fecha de inicio del préstamo
  const [fechaInicio, setFechaInicio] = useState("");
  // Estado para la fecha esperada de devolución
  const [fechaFin, setFechaFin] = useState("");
  // Estado para mostrar modal de confirmación después del préstamo
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  // Función que maneja el envío del formulario para confirmar el préstamo
  const handleConfirmar = async (e) => {
    e.preventDefault(); // evitar recarga de página
    try {
      // Enviar datos al backend para crear el préstamo
      await axios.post(
        "http://localhost:3000/api/movimientos",
        {
          fecha_prestamo: fechaInicio,
          fecha_devolucion_esperada: fechaFin,
          equipos: [equipo.id_equipo],
        },
        {
          headers: {
            Authorization: `Bearer ${usuario.token}`, // incluir token en encabezado
          },
        }
      );

      // Ejecutar callback tras confirmar préstamo si existe
      onPrestamoConfirmado?.();
      // Cerrar el modal de pedido de préstamo
      onClose();
      // Mostrar modal de confirmación
      setMostrarConfirmacion(true);
    } catch (error) {
      // Mostrar error en consola si falla el registro del préstamo
      console.error("Error al registrar préstamo:", error);
    }
  };

  // Si el modal no está abierto o no hay equipo seleccionado, mostrar modal de confirmación
  if (!isOpen || !equipo) return (
    <ConfirmacionPrestamoModal
      isOpen={mostrarConfirmacion}
      onClose={() => setMostrarConfirmacion(false)}
      onDescargar={() =>
        generarPDF({ usuario, equipo, fechaInicio, fechaFin }) // generar PDF con datos
      }
    />
  );

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Solicitar préstamo</h2>
          <p className="mb-2">Equipo: <strong>{equipo.nombre}</strong></p>
          <form onSubmit={handleConfirmar} className="flex flex-col gap-3">
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="border px-3 py-2 rounded"
              required
            />
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="border px-3 py-2 rounded"
              required
            />
            <button className="bg-vino text-white py-2 rounded hover:opacity-90">Confirmar</button>
          </form>
          <button onClick={onClose} className="mt-3 text-sm text-gray-500 hover:underline">
            Cancelar
          </button>
        </div>
      </div>

      <ConfirmacionPrestamoModal
        isOpen={mostrarConfirmacion}
        onClose={() => setMostrarConfirmacion(false)}
        onDescargar={() =>
          generarPDF({ usuario, equipo, fechaInicio, fechaFin })
        }
      />
    </>
  );
}