import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import generarPDF from "../utils/generarPDF";
import axios from "axios";
import ConfirmacionPrestamoModal from "./ConfirmacionPrestamoModal";

export default function PedirPrestamoModal({ isOpen, onClose, equipo, onPrestamoConfirmado }) {
  const { usuario } = useAuth();
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const handleConfirmar = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:3000/api/movimientos/prestamos",
        {
          fecha_prestamo: fechaInicio,
          fecha_devolucion_esperada: fechaFin,
          equipos: [equipo.id_equipo],
        },
        {
          headers: {
            Authorization: `Bearer ${usuario.token}`,
          },
        }
      );

      onPrestamoConfirmado?.();
      onClose(); // cierra el modal actual
      setMostrarConfirmacion(true); // abre el de confirmación
    } catch (error) {
      console.error("Error al registrar préstamo:", error);
    }
  };

  if (!isOpen || !equipo) return (
    <ConfirmacionPrestamoModal
      isOpen={mostrarConfirmacion}
      onClose={() => setMostrarConfirmacion(false)}
      onDescargar={() =>
        generarPDF({ usuario, equipo, fechaInicio, fechaFin })
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