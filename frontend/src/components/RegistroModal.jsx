import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function RegistroModal({ isOpen, onClose }) {
  // Estados para los campos del formulario de registro
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  // Estado para mostrar mensajes de error o éxito
  const [mensaje, setMensaje] = useState("");
  // Función para iniciar sesión desde el contexto de autenticación
  const { login } = useAuth();

  // Maneja el envío del formulario de registro
  const handleRegistro = async (e) => {
    e.preventDefault(); // evitar recarga de página
    try {
      // Solicitar al backend registrar nuevo usuario
      const res = await axios.post("http://localhost:3000/api/usuarios/register", {
        nombre,
        correo,
        contraseña,
        rol: "estudiante", // rol fijo al registrar
      });

      // Iniciar sesión automáticamente después de registro
      const loginRes = await axios.post("http://localhost:3000/api/usuarios/login", {
        correo,
        contraseña,
      });
      login(loginRes.data.usuario); // actualizar estado global de usuario
      onClose(); // cerrar modal de registro
    } catch {
      // Mostrar mensaje de error si falla el registro
      setMensaje("Hubo un error en el registro.");
    }
  };

  // Si el modal no está abierto no renderiza nada
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Registro</h2>
        {mensaje && <p className="text-sm text-blue-600">{mensaje}</p>}
        <form onSubmit={handleRegistro} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="border px-3 py-2 rounded"
            required
          />
          <input
            type="email"
            placeholder="Correo institucional"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="border px-3 py-2 rounded"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            className="border px-3 py-2 rounded"
            required
          />
          <button className="bg-vino text-white py-2 rounded hover:opacity-90">Registrar</button>
        </form>
        <button onClick={onClose} className="mt-3 text-sm text-gray-500 hover:underline">
          Cancelar
        </button>
      </div>
    </div>
  );
}