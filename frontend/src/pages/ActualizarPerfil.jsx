import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function ActualizarPerfil() {
  const { usuario } = useAuth(); // Obtenemos el usuario autenticado desde el contexto

  // Estados para las contraseñas y el mensaje de feedback
  const [actual, setActual] = useState("");   // Contraseña actual
  const [nueva, setNueva] = useState("");     // Nueva contraseña
  const [repetir, setRepetir] = useState(""); // Confirmación nueva contraseña
  const [mensaje, setMensaje] = useState(""); // Mensaje de éxito o error

  // useEffect para limpiar el mensaje automáticamente después de 4 segundos
  useEffect(() => {
    if (mensaje) {
      const timeout = setTimeout(() => {
        setMensaje("");
      }, 4000); // Limpia mensaje después de 4 segundos

      return () => clearTimeout(timeout); // Limpieza si el mensaje cambia rápido
    }
  }, [mensaje]);

  // Función para manejar el envío del formulario de actualización de contraseña
  const handleActualizar = async (e) => {
    e.preventDefault();

    // Validar que las nuevas contraseñas coincidan antes de enviar
    if (nueva !== repetir) {
      setMensaje("Las nuevas contraseñas no coinciden.");
      return;
    }

    try {
      // Llamada PUT a la API para actualizar la contraseña del usuario autenticado
      await axios.put(
        `http://localhost:3000/api/usuarios/${usuario.id_usuario}/password`,
        {
          actualContraseña: actual,
          nuevaContraseña: nueva,
        },
        {
          headers: {
            Authorization: `Bearer ${usuario.token}`,
          },
        }
      );

      // Mensaje de éxito y limpiar campos de contraseña
      setMensaje("Contraseña actualizada correctamente.");
      setActual("");
      setNueva("");
      setRepetir("");
    } catch (error) {
      // Mensaje de error si la actualización falla
      setMensaje("Error al actualizar la contraseña.");
    }
  };

  return (
    <div className="flex justify-center mt-12 p-6">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow border-2 border-vino">
        <h2 className="text-2xl font-bold text-vino mb-6 text-center">Actualizar Contraseña</h2>
        <form onSubmit={handleActualizar} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Contraseña actual"
            value={actual}
            onChange={(e) => setActual(e.target.value)}
            className="border rounded px-4 py-2"
            required
          />
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={nueva}
            onChange={(e) => setNueva(e.target.value)}
            className="border rounded px-4 py-2"
            required
          />
          <input
            type="password"
            placeholder="Repetir nueva contraseña"
            value={repetir}
            onChange={(e) => setRepetir(e.target.value)}
            className="border rounded px-4 py-2"
            required
          />
          <button className="bg-vino text-white py-2 rounded hover:opacity-90">
            Guardar cambios
          </button>
        </form>
        {mensaje && (
          <p
            className={`mt-4 text-center text-sm font-medium ${
              mensaje.includes("correctamente") ? "text-green-600" : "text-red-600"
            }`}
          >
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
}