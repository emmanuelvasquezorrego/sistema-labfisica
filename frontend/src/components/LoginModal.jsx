import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function LoginModal({ isOpen, onClose }) {
  const { login } = useAuth();
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/usuarios/login", {
        correo,
        contraseña,
      });
      login({ ...res.data.usuario, token: res.data.token });
      onClose();
    } catch (err) {
      setError("Credenciales inválidas");
    }
  };

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
      </div>
    </div>
  );
}