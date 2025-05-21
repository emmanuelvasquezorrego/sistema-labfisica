import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function ActualizarPerfil() {
  const { usuario } = useAuth();
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [repetir, setRepetir] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
      if (mensaje) {
        const timeout = setTimeout(() => {
          setMensaje("");
        }, 4000); // 4 segundos

        return () => clearTimeout(timeout); // limpieza si cambia rápido
      }
    }, [mensaje]);

  const handleActualizar = async (e) => {
    e.preventDefault();

    if (nueva !== repetir) {
      setMensaje("Las nuevas contraseñas no coinciden.");
      return;
    }

    try {
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
      setMensaje("Contraseña actualizada correctamente.");
      setActual("");
      setNueva("");
      setRepetir("");
    } catch (error) {
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