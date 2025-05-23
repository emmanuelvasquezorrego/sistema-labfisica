import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function LoginModal({ isOpen, onClose, onAbrirRegistro }) {
  // Obtener la función de login del contexto de autenticación
  const { login } = useAuth();
  // Estado para controlar el correo ingresado
  const [correo, setCorreo] = useState("");
  // Estado para controlar la contraseña ingresada
  const [contraseña, setContraseña] = useState("");
  // Estado para controlar el mensaje de error en el login
  const [error, setError] = useState("");

  // Función que se ejecuta al enviar el formulario de login
  const handleLogin = async (e) => {
    e.preventDefault(); // Evita recargar la página al enviar el formulario
    try {
      // Intentar autenticar al usuario enviando correo y contraseña al backend
      const res = await axios.post("http://localhost:3000/api/usuarios/login", {
        correo,
        contraseña,
      });
      // Si el login es exitoso, guardar datos y token en el contexto
      login({ ...res.data.usuario, token: res.data.token });
      // Cerrar modal de login
      onClose();
    } catch (err) {
      // Si hay error, mostrar mensaje de credenciales inválidas
      setError("Credenciales inválidas");
    }
  };

  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Iniciar Sesión</h2>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <form onSubmit={handleLogin} className="flex flex-col gap-3">
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
          <button className="bg-vino text-white py-2 rounded hover:opacity-90">Entrar</button>
        </form>
        <button onClick={onClose} className="mt-3 text-sm text-gray-500 hover:underline">
          Cancelar
        </button>

        <p className="mt-4 text-sm text-center">
          ¿No tienes una cuenta?{" "}
          <button onClick={() => { onClose(); onAbrirRegistro(); }} className="text-vino hover:underline">
            Regístrate
          </button>
        </p>
      </div>
    </div>
  );
}